
import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import pandas as pd
from datetime import datetime
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import re
from collections import Counter
import random

app = Flask(__name__, static_folder='build')
CORS(app)

# Load data (CSV file)
DATA_FILE = 'submissions.csv'
ADMIN_PASSWORD = "campus2024"
DEPARTMENTS = [
    "Computer Science", "Engineering", "Business", "Arts & Humanities",
    "Sciences", "Medicine", "Law", "Education", "Social Sciences", "Other"
]
YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Graduate", "PhD"]

TOXIC_KEYWORDS = [
    'hate', 'kill', 'suicide', 'death', 'die', 'stupid', 'idiot', 'dumb',
    'worthless', 'useless', 'terrible', 'awful', 'horrible', 'disgusting',
    'fuck', 'shit', 'bitch', 'ass', 'damn', 'hell', 'crap', 'piss'
]

ENCOURAGEMENT_MESSAGES = [
    "Every challenge is an opportunity to grow stronger!",
    "You're doing better than you think. Keep going!",
    "Tough times don't last, but tough people do!",
    "Focus on progress, not perfection. You've got this!",
    "Your potential is limitless. Believe in yourself!",
    "Small steps lead to big changes. Keep moving forward!",
    "Growth happens outside your comfort zone. You're growing!",
    "You are stronger than any obstacle in your way!",
    "Life is a journey, not a destination. Enjoy the ride!",
    "Your determination will light the way to success!"
]

def load_data():
    """Load submissions data from CSV"""
    try:
        df = pd.read_csv(DATA_FILE)
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        return df
    except FileNotFoundError:
        return pd.DataFrame(columns=['text', 'department', 'year', 'timestamp', 'sentiment', 'flagged'])

def save_data(df):
    """Save submissions data to CSV"""
    df.to_csv(DATA_FILE, index=False)

def analyze_sentiment(text):
    """Analyze sentiment using VADER"""
    analyzer = SentimentIntensityAnalyzer()
    scores = analyzer.polarity_scores(text)
    compound = scores['compound']

    if compound >= 0.05:
        return 'positive'
    elif compound <= -0.05:
        return 'negative'
    else:
        return 'neutral'

def check_toxic_content(text):
    """Check for toxic keywords"""
    text_lower = text.lower()
    toxic_count = sum(1 for word in TOXIC_KEYWORDS if word in text_lower)
    return toxic_count > 0

def calculate_karma_score(df, department):
    """Calculate karma score for a department"""
    dept_data = df[df['department'] == department]
    if len(dept_data) == 0:
        return 0

    # Base score from number of submissions
    submission_score = min(len(dept_data) * 10, 100)

    # Positivity bonus
    positive_ratio = (dept_data['sentiment'] == 'positive').sum() / len(dept_data)
    positivity_bonus = positive_ratio * 50

    return submission_score + positivity_bonus

# API endpoints
@app.route('/submit_feedback', methods=['POST'])
def submit_feedback():
    data = request.get_json()
    text = data.get('text', '')
    department = data.get('department', '')
    year = data.get('year', '')

    if text.strip():
        df = load_data()
        sentiment = analyze_sentiment(text)
        flagged = check_toxic_content(text)

        new_row = pd.DataFrame([{
            'text': text,
            'department': department,
            'year': year,
            'timestamp': datetime.now(),
            'sentiment': sentiment,
            'flagged': flagged
        }])

        df = pd.concat([df, new_row], ignore_index=True)
        save_data(df)

        response = {'message': "Thank you for your feedback! Your submission has been recorded anonymously.", 'sentiment': sentiment}
        if sentiment == 'negative':
            encouragement = random.choice(ENCOURAGEMENT_MESSAGES)
            response['encouragement'] = encouragement
        return jsonify(response)
    else:
        return jsonify({'error': "Please enter your feedback before submitting."}), 400

@app.route('/get_data', methods=['GET'])
def get_data():
    df = load_data()
    if not df.empty:
        df['timestamp'] = df['timestamp'].astype(str)  # Convert timestamp to string for JSON serialization
        return jsonify(df.to_dict(orient='records'))
    else:
        return jsonify([])

@app.route('/admin_login', methods=['POST'])
def admin_login():
    data = request.get_json()
    password = data.get('password', '')

    if password == ADMIN_PASSWORD:
        return jsonify({'success': True, 'message': "Admin access granted!"})
    else:
        return jsonify({'success': False, 'message': "Incorrect password!"}), 401

@app.route('/flag_entry', methods=['POST'])
def flag_entry():
    data = request.get_json()
    # Assuming you send the index of the entry to flag
    index = data.get('index')
    df = load_data()
    if index is not None and 0 <= index < len(df):
        df.at[index, 'flagged'] = True
        save_data(df)
        return jsonify({'success': True, 'message': "Entry flagged!"})
    else:
        return jsonify({'success': False, 'message': "Invalid entry index."}), 400

@app.route('/delete_flagged_entries', methods=['POST'])
def delete_flagged_entries():
    df = load_data()
    flagged_count = df['flagged'].sum()
    df = df[df['flagged'] == False]
    save_data(df)
    return jsonify({'success': True, 'message': f"Flagged entries deleted! {flagged_count} entries removed."})

@app.route('/department_karma', methods=['GET'])
def department_karma():
    df = load_data()
    karma_scores = {}
    for dept in DEPARTMENTS:
        karma_scores[dept] = calculate_karma_score(df, dept)
    return jsonify(karma_scores)

# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True)

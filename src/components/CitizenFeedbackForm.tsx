import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Sparkles, Heart, AlertTriangle, MessageCircle } from 'lucide-react';

const ministries = [
  'Ministry of Home Affairs',
  'Ministry of Finance',
  'Ministry of Defence',
  'Ministry of Health',
  'Ministry of Education',
  'Ministry of Environment',
  'Ministry of Railways',
  'Ministry of External Affairs'
];

const clauses = [
  'Article 1: Fundamental Rights',
  'Article 2: Implementation Timeline',
  'Article 3: Budget Allocation',
  'Article 4: Enforcement Mechanism',
  'Article 5: Public Consultation'
];

interface SentimentResult {
  type: 'positive' | 'neutral' | 'negative';
  confidence: number;
  message: string;
  sticker: string;
}

export function CitizenFeedbackForm() {
  const [feedback, setFeedback] = useState('');
  const [ministry, setMinistry] = useState('');
  const [clause, setClause] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<SentimentResult | null>(null);
  const [showSticker, setShowSticker] = useState(false);

  const analyzeSentiment = (text: string): SentimentResult => {
    const positiveWords = ['good', 'great', 'excellent', 'support', 'agree', 'wonderful', 'amazing', 'perfect'];
    const negativeWords = ['bad', 'terrible', 'wrong', 'disagree', 'oppose', 'awful', 'hate', 'stupid'];
    
    const words = text.toLowerCase().split(' ');
    const positiveCount = words.filter(word => positiveWords.some(pos => word.includes(pos))).length;
    const negativeCount = words.filter(word => negativeWords.some(neg => word.includes(neg))).length;
    
    if (positiveCount > negativeCount) {
      return {
        type: 'positive',
        confidence: Math.min(95, 60 + positiveCount * 10),
        message: 'Positive vibes detected! Democracy is working ✨',
        sticker: 'Big policy energy detected.'
      };
    } else if (negativeCount > positiveCount) {
      return {
        type: 'negative',
        confidence: Math.min(95, 60 + negativeCount * 10),
        message: 'Negative. Democracy is spicy 🌶️',
        sticker: 'Policy is listening.'
      };
    } else {
      return {
        type: 'neutral',
        confidence: Math.random() * 20 + 70,
        message: 'Neutral territory. The democracy Switzerland 🇨🇭',
        sticker: 'Every voice counts. Yes, even yours.'
      };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:5000/submit_feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: feedback,
          department: ministry,
          year: 'NA',
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult({
          type: data.sentiment,
          confidence: 90,
          message: data.message,
          sticker: data.encouragement || 'Thanks for the feedback!'
      })
      setIsSubmitting(false);
      setShowSticker(true);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      // Handle error appropriately (e.g., display an error message)
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <motion.h1 
          className="text-6xl mb-4 bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 bg-clip-text text-transparent"
          animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
          transition={{ duration: 8, repeat: Infinity }}
        >
          Your Voice → Policy
        </motion.h1>
        <p className="text-xl text-gray-600 mb-2">Drop your thoughts. Watch democracy digest them.</p>
        <motion.div 
          className="inline-block bg-yellow-100 border border-yellow-300 rounded-full px-4 py-2 text-sm"
          animate={{ rotate: [-1, 1, -1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
           Every comment shapes tomorrow's policies
        </motion.div>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Oversized Textarea */}
        <motion.div
          className="relative"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <label className="block mb-4 text-xl">
            Your Voice Matters → Drop It Here.
          </label>
          <div className="relative">
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Type your thoughts about the policy... Be bold, be honest, be heard."
              className="min-h-[200px] text-lg p-6 border-2 border-dashed border-gray-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-200 transition-all duration-300 resize-none"
              style={{
                background: 'linear-gradient(135deg, #fefefe 0%, #f8f9ff 100%)',
              }}
            />
            <motion.div
              className="absolute top-4 right-4 text-orange-500"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="size-6" />
            </motion.div>
          </div>
          <div className="text-right text-sm text-gray-500 mt-2">
            {feedback.length} characters of democracy
          </div>
        </motion.div>

        {/* Dropdowns */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2">Choose Ministry</label>
            <Select value={ministry} onValueChange={setMinistry}>
              <SelectTrigger className="h-12 text-lg">
                <SelectValue placeholder="Which ministry gets the feedback?" />
              </SelectTrigger>
              <SelectContent>
                {ministries.map((m) => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block mb-2">Choose Clause (Optional)</label>
            <Select value={clause} onValueChange={setClause}>
              <SelectTrigger className="h-12 text-lg">
                <SelectValue placeholder="Specific section? (optional)" />
              </SelectTrigger>
              <SelectContent>
                {clauses.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Morphing Submit Button */}
        <div className="flex justify-center">
          <motion.button
            type="submit"
            disabled={!feedback.trim() || isSubmitting}
            className="relative overflow-hidden bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full transition-all duration-500 disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={isSubmitting ? {
              width: [200, 60, 60],
              height: [60, 60, 60],
              borderRadius: ['30px', '50%', '50%']
            } : {
              width: 200,
              height: 60,
              borderRadius: '30px'
            }}
            style={{
              width: isSubmitting ? 60 : 200,
              height: 60,
            }}
          >
            <AnimatePresence mode="wait">
              {!isSubmitting ? (
                <motion.span
                  key="submit-text"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="size-5" />
                  <span>Feed Democracy</span>
                </motion.span>
              ) : (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center"
                >
                  <motion.div
                    className="size-6 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </form>

      {/* Sentiment Result Card */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -30 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="mt-12"
          >
            <Card className="p-8 border-2 border-dashed border-gray-300 bg-white shadow-lg">
              <div className="text-center">
                <motion.div
                  className="mb-4"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  {result.type === 'positive' && <Heart className="size-16 text-green-500 mx-auto" />}
                  {result.type === 'negative' && <AlertTriangle className="size-16 text-red-500 mx-auto" />}
                  {result.type === 'neutral' && <MessageCircle className="size-16 text-blue-500 mx-auto" />}
                </motion.div>
                
                <h3 className="text-2xl mb-2">{result.message}</h3>
                
                <Badge 
                  variant={result.type === 'positive' ? 'default' : result.type === 'negative' ? 'destructive' : 'secondary'}
                  className="text-lg px-4 py-2 mb-4"
                >
                  {result.confidence.toFixed(0)}% confident
                </Badge>
                
                <p className="text-gray-600 mb-6">
                  Your feedback has been processed by our AI sentiment analyzer and forwarded to the relevant ministry.
                </p>

                {/* Encouragement Sticker */}
                <AnimatePresence>
                  {showSticker && (
                    <motion.div
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="inline-block bg-yellow-200 border-2 border-yellow-400 rounded-lg px-6 py-3 transform -rotate-2 shadow-lg"
                      style={{ fontFamily: 'Comic Sans MS, cursive' }}
                    >
                      <div className="text-lg">🎯 {result.sticker}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
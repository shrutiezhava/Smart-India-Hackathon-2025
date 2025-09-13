import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Heart,
  MessageSquare,
  Download,
  Trash2,
  Crown,
  Zap,
  Activity,
  Users,
  FileText,
  Target
} from 'lucide-react';
import { KeywordConstellations } from './KeywordConstellations';
import { io } from 'socket.io-client';

// Mock Data
const sentimentData = [
  { name: 'Positive', value: 340, color: '#10B981' },
  { name: 'Neutral', value: 280, color: '#6B7280' },
  { name: 'Negative', value: 380, color: '#EF4444' }
];

const ministryLeaderboard = [
  { name: 'Health', positive: 85, total: 120, percentage: 71 },
  { name: 'Education', positive: 78, total: 110, percentage: 71 },
  { name: 'Environment', positive: 92, total: 135, percentage: 68 },
  { name: 'Railways', positive: 45, total: 85, percentage: 53 },
  { name: 'Defence', positive: 34, total: 75, percentage: 45 },
  { name: 'Finance', positive: 28, total: 95, percentage: 29 }
];

const flaggedComments = [
  { id: 1, text: "This policy is absolutely ridiculous and shows how out of touch the government is", ministry: "Finance", severity: "high" },
  { id: 2, text: "Complete waste of taxpayer money, typical government incompetence", ministry: "Railways", severity: "medium" },
  { id: 3, text: "This is just another way to control citizens, wake up people!", ministry: "Home Affairs", severity: "high" }
];

const wordCloudData = [
  { text: "healthcare", size: 48, sentiment: "positive" },
  { text: "budget", size: 42, sentiment: "negative" },
  { text: "education", size: 38, sentiment: "positive" },
  { text: "transparency", size: 35, sentiment: "neutral" },
  { text: "corruption", size: 32, sentiment: "negative" },
  { text: "development", size: 30, sentiment: "positive" },
  { text: "taxes", size: 28, sentiment: "negative" },
  { text: "infrastructure", size: 26, sentiment: "neutral" },
  { text: "jobs", size: 24, sentiment: "positive" },
  { text: "bureaucracy", size: 22, sentiment: "negative" }
];

export function GovernmentDashboard() {
  const [totalSubmissions, setTotalSubmissions] = useState(0);
  const [alertVisible, setAlertVisible] = useState(true);
  const [selectedTab, setSelectedTab] = useState('overview');
    const [topics, setTopics] = useState([]);
  const [weeklyTrendData, setWeeklyTrendData] = useState([
    { week: 'Mon', positive: 45, neutral: 30, negative: 55 },
    { week: 'Tue', positive: 52, neutral: 28, negative: 48 },
    { week: 'Wed', positive: 38, neutral: 35, negative: 62 },
    { week: 'Thu', positive: 41, neutral: 32, negative: 58 },
    { week: 'Fri', positive: 48, neutral: 29, negative: 51 },
    { week: 'Sat', positive: 43, neutral: 31, negative: 56 },
    { week: 'Sun', positive: 39, neutral: 33, negative: 60 }
  ]);
  const negativePercentage = (sentimentData[2].value / sentimentData.reduce((sum, item) => sum + item.value, 0)) * 100;
  const isPolicyCrisis = negativePercentage > 35;

  useEffect(() => {
    const socket = io('http://localhost:5000');

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('analysis_update', (data) => {
      console.log('New analysis received:', data);
      setTopics(data.topics);

      // Transform weekly_trend_data to match recharts format
      const formattedWeeklyTrendData = data.weekly_trend_data.map(item => ({
        week: item.week,
        positive: item.positive,
        neutral: 100 - item.positive, // Mock data for neutral
        negative: 0 // Mock data for negative - remove if you have real data
      }));
      setWeeklyTrendData(formattedWeeklyTrendData)
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleDeleteComment = (id: number) => {
    // Animate deletion
  };

  const handleExportReport = () => {
    // Simulate export
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-4xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Control Room → Democracy Live
              </h1>
              <p className="text-gray-600 mt-2">Real-time pulse of the nation's thoughts</p>
            </div>
            <motion.div
              className="flex items-center space-x-2"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="size-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-gray-600">System Live</span>
            </motion.div>
          </div>

          {/* Crisis Alert */}
          <AnimatePresence>
            {isPolicyCrisis && alertVisible && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  backgroundColor: ['#FEF2F2', '#FEE2F2', '#FEF2F2']
                }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.3, backgroundColor: { duration: 2, repeat: Infinity } }}
                className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6 relative"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    >
                      <AlertTriangle className="size-6 text-red-500" />
                    </motion.div>
                    <div>
                      <h3 className="text-lg text-red-800">
                        🚨 Democracy Mood Crisis Detected
                      </h3>
                      <p className="text-red-600">
                        {negativePercentage.toFixed(0)}% negative sentiment. Time for urgent chai summit.
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setAlertVisible(false)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Top Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Total Submissions</p>
                  <motion.p
                    className="text-3xl"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1 }}
                  >
                    {totalSubmissions.toLocaleString()}
                  </motion.p>
                  <p className="text-xs text-green-600 mt-1">↗ This week</p>
                </div>
                <Users className="size-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Positive Vibes</p>
                  <motion.p
                    className="text-3xl text-green-600"
                    animate={{ color: ['#16A34A', '#22C55E', '#16A34A'] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {sentimentData[0].value}
                  </motion.p>
                  <p className="text-xs text-green-600 mt-1">Democracy working ✨</p>
                </div>
                <Heart className="size-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Spicy Takes</p>
                  <motion.p
                    className="text-3xl text-red-600"
                    animate={{ color: ['#DC2626', '#EF4444', '#DC2626'] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    {sentimentData[2].value}
                  </motion.p>
                  <p className="text-xs text-red-600 mt-1">🌶️ Democracy is spicy</p>
                </div>
                <TrendingDown className="size-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Neutral Zone</p>
                  <motion.p
                    className="text-3xl text-gray-600"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    {sentimentData[1].value}
                  </motion.p>
                  <p className="text-xs text-gray-600 mt-1">🇨🇭 Switzerland energy</p>
                </div>
                <Activity className="size-8 text-gray-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Dashboard Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="moderation">Moderation</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sentiment Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="size-5" />
                    <span>Sentiment Distribution</span>
                    <motion.span
                      className="text-sm text-gray-500"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      → Gradient slices wobble gently
                    </motion.span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={sentimentData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                        >
                          {sentimentData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center space-x-4 mt-4">
                    {sentimentData.map((item) => (
                      <div key={item.name} className="flex items-center space-x-2">
                        <div
                          className="size-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm">{item.name}: {item.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Weekly Trend Line */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="size-5" />
                    <span>Weekly Mood Swings</span>
                    <motion.span
                      className="text-sm text-gray-500"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      → ECG of democracy
                    </motion.span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={weeklyTrendData}>
                        <XAxis dataKey="week" />
                        <YAxis />
                        <Line
                          type="monotone"
                          dataKey="positive"
                          stroke="#10B981"
                          strokeWidth={3}
                          dot={{ r: 6 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="negative"
                          stroke="#EF4444"
                          strokeWidth={3}
                          dot={{ r: 6 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="neutral"
                          stroke="#6B7280"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Keyword Constellations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="size-5" />
                  <span>Keyword Constellations</span>
                  <motion.span
                    className="text-sm text-gray-500"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    → Stars connected by semantic proximity
                  </motion.span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul>
                  {topics && topics.map((topic, index) => (
                    <li key={index}>{topic}</li>
                  ))}
                </ul>
                <KeywordConstellations />
              </CardContent>
            </Card>

            {/* Ministry Leaderboard */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Crown className="size-5" />
                  <span>Which ministry's winning the vibe war?</span>
                  <motion.span
                    className="text-sm text-gray-500"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    → Bars stack like Tetris
                  </motion.span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ministryLeaderboard.map((ministry, index) => (
                    <motion.div
                      key={ministry.name}
                      className="flex items-center space-x-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="w-20 text-sm">{ministry.name}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-600">
                            {ministry.positive}/{ministry.total}
                          </span>
                          <span className="text-sm">{ministry.percentage}%</span>
                        </div>
                        <Progress value={ministry.percentage} className="h-2" />
                      </div>
                      <Badge
                        variant={ministry.percentage > 60 ? 'default' : 'secondary'}
                        className={ministry.percentage > 60 ? 'bg-green-500' : ''}
                      >
                        {ministry.percentage > 60 ? '🏆' : '📈'}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="moderation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="size-5" />
                  <span>Feedback That Went Feral</span>
                  <Badge variant="secondary">{flaggedComments.length} flagged</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {flaggedComments.map((comment) => (
                    <motion.div
                      key={comment.id}
                      className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 relative"
                      style={{
                        transform: `rotate(${Math.random() * 4 - 2}deg)`,
                        fontFamily: 'Comic Sans MS, cursive'
                      }}
                      whileHover={{ rotate: 0, scale: 1.02 }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <Badge
                          variant={comment.severity === 'high' ? 'destructive' : 'secondary'}
                        >
                          {comment.severity} risk
                        </Badge>
                        <motion.button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-red-500 hover:text-red-700"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Trash2 className="size-4" />
                        </motion.button>
                      </div>
                      <p className="text-sm mb-2">"{comment.text}"</p>
                      <p className="text-xs text-gray-600">Ministry: {comment.ministry}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="size-5" />
                  <span>Export Democracy</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={handleExportReport}
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg"
                    >
                      <Download className="size-6 mr-3" />
                      Generate Policy CSV → Democracy in Excel form
                    </Button>
                  </motion.div>
                  <p className="text-gray-600 mt-4">
                    Export comprehensive analytics report with sentiment trends, ministry performance, and citizen feedback data.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
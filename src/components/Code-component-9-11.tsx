import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from './ui/card';

interface Keyword {
  text: string;
  frequency: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  x: number;
  y: number;
  connections: string[];
  comments: string[];
}

interface Connection {
  from: string;
  to: string;
  strength: number;
}

const keywordData: Keyword[] = [
  {
    text: "healthcare",
    frequency: 48,
    sentiment: "positive",
    x: 0.2,
    y: 0.3,
    connections: ["budget", "development", "jobs"],
    comments: [
      "Healthcare reforms are much needed for rural areas",
      "The healthcare budget allocation seems reasonable",
      "Healthcare infrastructure development is progressing well"
    ]
  },
  {
    text: "budget",
    frequency: 42,
    sentiment: "negative",
    x: 0.6,
    y: 0.2,
    connections: ["healthcare", "taxes", "corruption"],
    comments: [
      "Budget allocation seems unfair across ministries",
      "Healthcare budget should be increased significantly",
      "Tax burden vs budget transparency is concerning"
    ]
  },
  {
    text: "education",
    frequency: 38,
    sentiment: "positive",
    x: 0.8,
    y: 0.7,
    connections: ["development", "jobs", "infrastructure"],
    comments: [
      "Education policy changes are very promising",
      "Digital education infrastructure is improving",
      "Job creation through education reforms"
    ]
  },
  {
    text: "transparency",
    frequency: 35,
    sentiment: "neutral",
    x: 0.4,
    y: 0.8,
    connections: ["corruption", "bureaucracy"],
    comments: [
      "Government transparency has improved slightly",
      "More transparency needed in policy making",
      "Bureaucratic transparency is still lacking"
    ]
  },
  {
    text: "corruption",
    frequency: 32,
    sentiment: "negative",
    x: 0.7,
    y: 0.4,
    connections: ["budget", "transparency", "bureaucracy"],
    comments: [
      "Corruption in budget allocation is concerning",
      "Need more transparency to fight corruption",
      "Bureaucratic corruption affects policy implementation"
    ]
  },
  {
    text: "development",
    frequency: 30,
    sentiment: "positive",
    x: 0.3,
    y: 0.6,
    connections: ["healthcare", "education", "infrastructure"],
    comments: [
      "Rural development programs showing good results",
      "Healthcare development initiatives are promising",
      "Educational development is progressing steadily"
    ]
  },
  {
    text: "taxes",
    frequency: 28,
    sentiment: "negative",
    x: 0.5,
    y: 0.1,
    connections: ["budget", "bureaucracy"],
    comments: [
      "Tax policies are burdensome for middle class",
      "Budget allocation vs tax collection transparency",
      "Bureaucratic tax processes need simplification"
    ]
  },
  {
    text: "infrastructure",
    frequency: 26,
    sentiment: "neutral",
    x: 0.9,
    y: 0.5,
    connections: ["education", "development", "jobs"],
    comments: [
      "Infrastructure development is slow but steady",
      "Educational infrastructure needs more focus",
      "Infrastructure projects creating employment"
    ]
  },
  {
    text: "jobs",
    frequency: 24,
    sentiment: "positive",
    x: 0.1,
    y: 0.7,
    connections: ["healthcare", "education", "infrastructure"],
    comments: [
      "Job creation in healthcare sector is positive",
      "Education reforms leading to better job prospects",
      "Infrastructure projects generating employment"
    ]
  },
  {
    text: "bureaucracy",
    frequency: 22,
    sentiment: "negative",
    x: 0.6,
    y: 0.6,
    connections: ["corruption", "transparency", "taxes"],
    comments: [
      "Bureaucratic red tape is still a major issue",
      "Corruption within bureaucracy needs addressing",
      "Tax-related bureaucracy is overly complex"
    ]
  }
];

export function KeywordConstellations() {
  const [hoveredKeyword, setHoveredKeyword] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const getConnections = () => {
    const connections: Connection[] = [];
    keywordData.forEach(keyword => {
      keyword.connections.forEach(connectionText => {
        const targetKeyword = keywordData.find(k => k.text === connectionText);
        if (targetKeyword) {
          // Calculate connection strength based on frequency overlap
          const strength = Math.min(keyword.frequency, targetKeyword.frequency) / Math.max(keyword.frequency, targetKeyword.frequency);
          connections.push({
            from: keyword.text,
            to: connectionText,
            strength
          });
        }
      });
    });
    return connections;
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return '#10B981';
      case 'negative': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStarSize = (frequency: number) => {
    return Math.max(8, Math.min(24, frequency / 2));
  };

  const connections = getConnections();

  return (
    <div className="relative h-96 w-full" ref={containerRef}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 rounded-lg overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" opacity="0.3"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      {/* Connection Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {connections.map((connection, index) => {
          const fromKeyword = keywordData.find(k => k.text === connection.from);
          const toKeyword = keywordData.find(k => k.text === connection.to);
          
          if (!fromKeyword || !toKeyword || !dimensions.width || !dimensions.height) return null;

          const x1 = fromKeyword.x * dimensions.width;
          const y1 = fromKeyword.y * dimensions.height;
          const x2 = toKeyword.x * dimensions.width;
          const y2 = toKeyword.y * dimensions.height;

          const isHighlighted = hoveredKeyword === connection.from || hoveredKeyword === connection.to;

          return (
            <motion.line
              key={`${connection.from}-${connection.to}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth={connection.strength * 2}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: isHighlighted ? 0.8 : 0.2,
                strokeWidth: isHighlighted ? connection.strength * 3 : connection.strength * 1.5
              }}
              transition={{ duration: 0.3 }}
            />
          );
        })}
      </svg>

      {/* Keywords as Stars */}
      {keywordData.map((keyword, index) => {
        const starSize = getStarSize(keyword.frequency);
        const color = getSentimentColor(keyword.sentiment);
        
        return (
          <motion.div
            key={keyword.text}
            className="absolute cursor-pointer select-none"
            style={{
              left: `${keyword.x * 100}%`,
              top: `${keyword.y * 100}%`,
              transform: 'translate(-50%, -50%)'
            }}
            onMouseEnter={() => setHoveredKeyword(keyword.text)}
            onMouseLeave={() => setHoveredKeyword(null)}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: 1, 
              scale: hoveredKeyword === keyword.text ? 1.3 : 1,
            }}
            transition={{ 
              delay: index * 0.1,
              duration: 0.5,
              scale: { duration: 0.2 }
            }}
          >
            {/* Pulsing outer glow */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                width: starSize * 2,
                height: starSize * 2,
                background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
                transform: 'translate(-50%, -50%)'
              }}
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{ 
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Main star */}
            <motion.div
              className="relative rounded-full shadow-lg"
              style={{
                width: starSize,
                height: starSize,
                backgroundColor: color,
                boxShadow: `0 0 ${starSize}px ${color}60`
              }}
              animate={{
                boxShadow: [
                  `0 0 ${starSize}px ${color}60`,
                  `0 0 ${starSize * 1.5}px ${color}80`,
                  `0 0 ${starSize}px ${color}60`
                ]
              }}
              transition={{
                duration: 2 + Math.random(),
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Keyword label */}
            <motion.div
              className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 text-white text-sm px-2 py-1 bg-black bg-opacity-60 rounded backdrop-blur-sm"
              initial={{ opacity: 0, y: -10 }}
              animate={{ 
                opacity: hoveredKeyword === keyword.text ? 1 : 0.7,
                y: hoveredKeyword === keyword.text ? 0 : -5
              }}
              transition={{ duration: 0.2 }}
            >
              {keyword.text}
              <div className="text-xs text-gray-300">
                {keyword.frequency} mentions
              </div>
            </motion.div>
          </motion.div>
        );
      })}

      {/* Hover Tooltip */}
      <AnimatePresence>
        {hoveredKeyword && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-90 text-white p-4 rounded-lg backdrop-blur-sm"
          >
            <h4 className="text-lg mb-2 text-yellow-300">
              Related Comments for "{hoveredKeyword}"
            </h4>
            <div className="space-y-2 max-h-24 overflow-y-auto">
              {keywordData
                .find(k => k.text === hoveredKeyword)
                ?.comments.slice(0, 3)
                .map((comment, index) => (
                  <p key={index} className="text-sm text-gray-300 italic">
                    "...{comment}..."
                  </p>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="absolute top-4 right-4 bg-black bg-opacity-60 text-white p-3 rounded-lg backdrop-blur-sm">
        <div className="text-sm space-y-1">
          <div className="flex items-center space-x-2">
            <div className="size-3 bg-green-500 rounded-full"></div>
            <span>Positive</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="size-3 bg-red-500 rounded-full"></div>
            <span>Negative</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="size-3 bg-gray-500 rounded-full"></div>
            <span>Neutral</span>
          </div>
        </div>
        <div className="text-xs text-gray-400 mt-2">
          Lines show semantic connections
        </div>
      </div>
    </div>
  );
}
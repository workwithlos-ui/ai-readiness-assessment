import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowLeft, BarChart3, TrendingUp } from 'lucide-react';
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import { generateReport } from './lib/generateReport';

// ============================================================================
// DATA
// ============================================================================

const ASSESSMENT_DATA = [
  {
    category: 'Data Infrastructure',
    description:
      'Your ability to collect, organize, and access customer data',
    questions: [
      {
        id: 'q1',
        text: 'How do you currently store customer data?',
        options: [
          { text: 'Scattered across spreadsheets and emails', score: 1 },
          {
            text: 'Centralized database but limited integration',
            score: 2,
          },
          {
            text: 'Integrated CRM/database with real-time access',
            score: 3,
          },
          {
            text: 'Enterprise data platform with AI-ready structure',
            score: 4,
          },
        ],
      },
      {
        id: 'q2',
        text: 'Do you have real-time access to business metrics and KPIs?',
        options: [
          { text: 'Manual reports pulled weekly or monthly', score: 1 },
          { text: 'Dashboard updated daily', score: 2 },
          { text: 'Real-time dashboard with 1-2 hour latency', score: 3 },
          { text: 'Live streaming metrics with sub-minute updates', score: 4 },
        ],
      },
      {
        id: 'q3',
        text: 'How well integrated are your core systems?',
        options: [
          { text: 'Systems are disconnected, manual data entry required', score: 1 },
          { text: 'Basic API connections between main systems', score: 2 },
          { text: 'Most systems connected with some manual handoffs', score: 3 },
          {
            text: 'Full system integration with automated data flow',
            score: 4,
          },
        ],
      },
      {
        id: 'q4',
        text: 'Do you have documented data processes and standards?',
        options: [
          { text: 'No documentation, processes vary by person', score: 1 },
          { text: 'Some documented processes, inconsistent application', score: 2 },
          { text: 'Most processes documented, being implemented', score: 3 },
          {
            text: 'Comprehensive documentation with regular audits',
            score: 4,
          },
        ],
      },
      {
        id: 'q5',
        text: 'What is the overall quality and cleanliness of your data?',
        options: [
          { text: 'Significant duplicates, errors, and missing values', score: 1 },
          { text: 'Notable data quality issues but manageable', score: 2 },
          { text: 'Mostly clean with occasional issues', score: 3 },
          { text: 'High quality with continuous cleaning processes', score: 4 },
        ],
      },
    ],
  },
  {
    category: 'Process Maturity',
    description: 'The structure and consistency of your business processes',
    questions: [
      {
        id: 'q6',
        text: 'How do you handle customer inquiries?',
        options: [
          {
            text: 'Ad-hoc responses, inconsistent quality',
            score: 1,
          },
          {
            text: 'Some templates and processes, but variable',
            score: 2,
          },
          {
            text: 'Documented process with 80% adherence',
            score: 3,
          },
          {
            text: 'Standardized, automated processes with quality gates',
            score: 4,
          },
        ],
      },
      {
        id: 'q7',
        text: 'How mature is your sales pipeline management?',
        options: [
          { text: 'No formal pipeline tracking', score: 1 },
          { text: 'Manual pipeline, basic stages', score: 2 },
          { text: 'Tracked in CRM with consistent stages', score: 3 },
          {
            text: 'Predictive pipeline with automated workflows',
            score: 4,
          },
        ],
      },
      {
        id: 'q8',
        text: 'How are tasks and work assignments managed?',
        options: [
          { text: 'Email and ad-hoc assignments', score: 1 },
          { text: 'Shared spreadsheet or basic tool', score: 2 },
          { text: 'Project management tool with clear workflows', score: 3 },
          {
            text: 'Advanced tool with automation and resource planning',
            score: 4,
          },
        ],
      },
      {
        id: 'q9',
        text: 'How do you ensure follow-ups happen consistently?',
        options: [
          { text: 'Relies on individual memory', score: 1 },
          { text: 'Manual list checked occasionally', score: 2 },
          { text: 'Scheduled follow-ups with monitoring', score: 3 },
          {
            text: 'Automated reminders and escalation workflows',
            score: 4,
          },
        ],
      },
      {
        id: 'q10',
        text: 'How standardized are your operations?',
        options: [
          { text: 'Every team member does things differently', score: 1 },
          { text: 'Some shared practices, but inconsistent', score: 2 },
          { text: 'Clear playbooks followed 80% of the time', score: 3 },
          {
            text: 'Highly standardized with continuous improvement',
            score: 4,
          },
        ],
      },
    ],
  },
  {
    category: 'Team & Culture',
    description: 'Your team readiness to adopt and leverage AI',
    questions: [
      {
        id: 'q11',
        text: "What is your team's overall sentiment about AI?",
        options: [
          { text: 'Skeptical or fearful about job impact', score: 1 },
          { text: 'Cautiously interested, but concerns exist', score: 2 },
          { text: 'Positive, some early adopters already experimenting', score: 3 },
          {
            text: 'Enthusiastic, actively seeking AI opportunities',
            score: 4,
          },
        ],
      },
      {
        id: 'q12',
        text: 'How tech-savvy is your team overall?',
        options: [
          { text: 'Limited comfort with software beyond email', score: 1 },
          { text: 'Comfortable with standard business tools', score: 2 },
          {
            text: 'Most team members use advanced tools confidently',
            score: 3,
          },
          {
            text: 'High technical proficiency across the team',
            score: 4,
          },
        ],
      },
      {
        id: 'q13',
        text: 'Who owns AI initiatives in your organization?',
        options: [
          { text: 'No clear owner, sporadic interest', score: 1 },
          { text: 'One person championing, limited resources', score: 2 },
          { text: 'Dedicated person/team with some buy-in', score: 3 },
          {
            text: 'Executive sponsor with dedicated team and budget',
            score: 4,
          },
        ],
      },
      {
        id: 'q14',
        text: 'How does leadership view AI and automation?',
        options: [
          { text: 'Skeptical or dismissive', score: 1 },
          { text: 'Interested but cautious, limited investment', score: 2 },
          { text: 'Supportive, strategic initiatives underway', score: 3 },
          {
            text: 'Core to business strategy with budget committed',
            score: 4,
          },
        ],
      },
      {
        id: 'q15',
        text: 'How often does your team engage in learning and development?',
        options: [
          { text: 'Rare or never', score: 1 },
          { text: 'Quarterly training sessions', score: 2 },
          { text: 'Monthly learning initiatives', score: 3 },
          {
            text: 'Continuous learning culture with regular skill-building',
            score: 4,
          },
        ],
      },
    ],
  },
  {
    category: 'Revenue Operations',
    description: 'How your sales and customer success processes impact revenue',
    questions: [
      {
        id: 'q16',
        text: 'How accurately do you track revenue and pipeline?',
        options: [
          { text: 'Limited visibility, significant gaps', score: 1 },
          { text: 'Basic tracking with manual efforts', score: 2 },
          { text: 'Automated tracking with good accuracy', score: 3 },
          {
            text: 'Precise forecasting with predictive analytics',
            score: 4,
          },
        ],
      },
      {
        id: 'q17',
        text: 'How dynamic is your pricing strategy?',
        options: [
          { text: 'One-size-fits-all pricing', score: 1 },
          { text: 'Occasional discounting based on judgment', score: 2 },
          {
            text: 'Tiered pricing with documented criteria',
            score: 3,
          },
          {
            text: 'Dynamic pricing optimized for segments',
            score: 4,
          },
        ],
      },
      {
        id: 'q18',
        text: 'How actively do you pursue upsells and cross-sells?',
        options: [
          { text: 'No structured upsell approach', score: 1 },
          { text: 'Ad-hoc upsells based on relationships', score: 2 },
          { text: 'Process exists, executed inconsistently', score: 3 },
          {
            text: 'Systematic approach with solid attach rates',
            score: 4,
          },
        ],
      },
      {
        id: 'q19',
        text: 'How strong are your customer retention efforts?',
        options: [
          { text: 'Minimal retention focus', score: 1 },
          { text: 'Reactive when churn occurs', score: 2 },
          { text: 'Proactive monitoring with interventions', score: 3 },
          {
            text: 'Predictive retention with automated programs',
            score: 4,
          },
        ],
      },
      {
        id: 'q20',
        text: 'How sophisticated is your sales forecasting?',
        options: [
          { text: 'Based on gut feel', score: 1 },
          { text: 'Extrapolation from recent months', score: 2 },
          { text: 'Based on pipeline with some analysis', score: 3 },
          {
            text: 'Advanced models with probability weighting',
            score: 4,
          },
        ],
      },
    ],
  },
  {
    category: 'Competitive Position',
    description:
      'Your ability to compete and win in the market with AI-powered capabilities',
    questions: [
      {
        id: 'q21',
        text: "How well do you understand competitors' technology capabilities?",
        options: [
          { text: 'Limited visibility into competitor tech', score: 1 },
          { text: 'Basic awareness of major competitors', score: 2 },
          { text: 'Regular competitive analysis and monitoring', score: 3 },
          {
            text: 'Sophisticated CI program with predictive insights',
            score: 4,
          },
        ],
      },
      {
        id: 'q22',
        text: 'How quickly can you respond to market changes?',
        options: [
          { text: 'Months to adapt', score: 1 },
          { text: 'Several weeks', score: 2 },
          { text: 'Within 1-2 weeks', score: 3 },
          {
            text: 'Days or real-time response capability',
            score: 4,
          },
        ],
      },
      {
        id: 'q23',
        text: 'How personalized is your customer experience?',
        options: [
          { text: 'One-size-fits-all approach', score: 1 },
          { text: 'Basic personalization by customer segment', score: 2 },
          {
            text: 'Account-level personalization',
            score: 3,
          },
          {
            text: 'Individual-level AI-driven personalization',
            score: 4,
          },
        ],
      },
      {
        id: 'q24',
        text: 'How much of your workflow is automated?',
        options: [
          { text: 'Minimal automation, mostly manual', score: 1 },
          { text: 'Some routine tasks automated', score: 2 },
          { text: 'Major processes automated', score: 3 },
          {
            text: 'End-to-end automation with minimal human intervention',
            score: 4,
          },
        ],
      },
      {
        id: 'q25',
        text: 'How do you measure customer satisfaction and outcomes?',
        options: [
          { text: 'Informal feedback only', score: 1 },
          { text: 'Annual survey', score: 2 },
          { text: 'Regular NPS measurement and tracking', score: 3 },
          {
            text: 'Real-time feedback loops with outcome tracking',
            score: 4,
          },
        ],
      },
    ],
  },
];

const GRADE_THRESHOLDS = [
  { min: 86, max: 100, label: 'AI-Native', color: 'emerald', description: 'Already operating at elite level' },
  { min: 71, max: 85, label: 'Optimized', color: 'blue', description: 'Ahead of 90% of businesses' },
  { min: 56, max: 70, label: 'Advancing', color: 'purple', description: 'Strong foundation, ready for multi-agent AI' },
  { min: 41, max: 55, label: 'Emerging', color: 'amber', description: 'Pieces in place, 3-5x efficiency in 90 days' },
  { min: 25, max: 40, label: 'Foundation Phase', color: 'red', description: 'Starting from scratch, needs infrastructure first' },
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function getGradeByScore(score) {
  for (const threshold of GRADE_THRESHOLDS) {
    if (score >= threshold.min && score <= threshold.max) {
      return threshold;
    }
  }
  return GRADE_THRESHOLDS[GRADE_THRESHOLDS.length - 1];
}

function calculateCategoryScores(answers, categoryIndex) {
  const category = ASSESSMENT_DATA[categoryIndex];
  let score = 0;
  category.questions.forEach((question) => {
    const answer = answers[question.id];
    if (answer !== undefined) {
      score += answer;
    }
  });
  return score;
}

function calculateAllCategoryScores(answers) {
  return ASSESSMENT_DATA.map((_, index) => calculateCategoryScore(answers, index));
}

function calculateCategoryScore(answers, categoryIndex) {
  const category = ASSESSMENT_DATA[categoryIndex];
  let score = 0;
  category.questions.forEach((question) => {
    const answer = answers[question.id];
    if (answer !== undefined) {
      score += answer;
    }
  });
  return score;
}

function calculateTotalScore(answers) {
  return calculateAllCategoryScores(answers).reduce((sum, score) => sum + score, 0);
}

function getLowestCategories(categoryScores, count = 3) {
  return categoryScores
    .map((score, index) => ({
      index,
      name: ASSESSMENT_DATA[index].category,
      score,
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, count);
}

function generateRecommendations(lowestCategories) {
  const recommendations = {
    'Data Infrastructure': [
      'Audit all customer touchpoints and consolidate data sources into a single CRM platform',
      'Implement real-time data validation and cleansing at point of entry',
      'Set up automated data integration between sales, marketing, and support systems',
    ],
    'Process Maturity': [
      'Document all critical business processes and create standardized playbooks',
      'Implement workflow automation for high-volume, repetitive tasks',
      'Establish performance metrics and KPIs for process adherence and continuous improvement',
    ],
    'Team & Culture': [
      'Launch internal AI literacy program with hands-on training for all staff',
      'Create AI champions program to drive adoption and share best practices',
      'Establish clear AI governance structure with executive sponsorship',
    ],
    'Revenue Operations': [
      'Implement advanced analytics to forecast revenue with greater accuracy',
      'Develop dynamic pricing model based on market conditions and customer segments',
      'Create automated upsell and cross-sell workflows triggered by customer behavior',
    ],
    'Competitive Position': [
      'Establish competitive intelligence program with monthly briefings',
      'Implement customer feedback loops and sentiment analysis tools',
      'Build agile response processes to deploy changes within days, not weeks',
    ],
  };

  return lowestCategories.map((cat) => ({
    category: cat.name,
    actions: recommendations[cat.name] || [],
  }));
}

// ============================================================================
// SCREENS
// ============================================================================

function LandingScreen({ onStart }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4"
    >
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="inline-block mb-4">
              <span className="text-amber-500 text-sm font-semibold tracking-widest uppercase">
                AI READINESS ASSESSMENT
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              How AI-Ready Is Your Business?
            </h1>
            <p className="text-xl text-slate-300">
              Discover your AI readiness maturity in 25 questions, ~4 minutes
            </p>
          </motion.div>
        </div>

        {/* Main card with glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 mb-8"
        >
          <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-500 mb-2">500+</div>
                <div className="text-sm text-slate-400">Businesses Assessed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-500 mb-2">3-5x</div>
                <div className="text-sm text-slate-400">Efficiency Gain</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-500 mb-2">90</div>
                <div className="text-sm text-slate-400">Days to Impact</div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">What You'll Get:</h2>
              <ul className="space-y-3">
                {[
                  '25 targeted questions across 5 categories',
                  'Your AI maturity score and grade',
                  'Category-by-category breakdown with insights',
                  'Personalized 90-day action plan',
                  'Professional PDF report for your team',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onStart}
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-lg"
            >
              Start Assessment
              <ChevronRight size={24} />
            </motion.button>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="text-center text-slate-400 text-sm">
          Powered by Elios AI Consulting & 33v Product Studio
        </div>
      </div>
    </motion.div>
  );
}

function QuestionScreen({
  currentCategoryIndex,
  currentQuestionIndex,
  question,
  categoryName,
  totalQuestions,
  onAnswer,
  onBack,
  answered,
}) {
  const progressPercent =
    ((currentCategoryIndex * 5 + currentQuestionIndex) / 25) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8"
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="text-sm text-slate-400 mb-2">
              {currentCategoryIndex + 1} of 5 Categories
            </div>
            <h2 className="text-2xl font-bold text-white">{categoryName}</h2>
          </div>
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-amber-500 transition"
          >
            <ArrowLeft size={20} />
            <span className="hidden sm:inline">Back</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-400">
              Question {currentCategoryIndex * 5 + currentQuestionIndex + 1} of 25
            </span>
            <span className="text-sm text-amber-500 font-semibold">
              {Math.round(progressPercent)}%
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-amber-500 to-amber-600 h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Question */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-10">
            {question.text}
          </h3>

          {/* Options */}
          <div className="space-y-4">
            {question.options.map((option, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onAnswer(option.score)}
                className="w-full text-left p-5 rounded-xl border-2 border-slate-700 bg-slate-800/30 hover:bg-slate-700/50 hover:border-amber-500 transition-all duration-200 group cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-lg border-2 border-slate-500 group-hover:border-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5 transition">
                    <div className="w-3 h-3 bg-amber-500 rounded-md opacity-0 group-hover:opacity-100 transition" />
                  </div>
                  <span className="text-slate-200 group-hover:text-white transition">
                    {option.text}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Hint */}
          <div className="mt-8 p-4 bg-slate-800/30 border border-slate-700 rounded-lg">
            <p className="text-sm text-slate-400">
              Tip: Choose the option that most accurately describes your current
              situation. This assessment is for your eyes only\u2014be honest!
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function EmailCaptureScreen({ score, grade, onContinue, onSkip }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.company) {
      onContinue(formData);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4"
    >
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Your Results Are Ready!
          </h2>
          <p className="text-lg text-slate-300">
            Get your detailed PDF report and personalized recommendations
          </p>
        </motion.div>

        {/* Score preview (blurred) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 mb-8 text-center"
        >
          <div className="blur-sm inline-block mb-4">
            <span className="text-5xl font-bold text-amber-500">{score}</span>
            <span className="text-3xl text-slate-400"> / 100</span>
          </div>
          <p className="text-lg text-slate-300">
            {grade.label} \u2014 {grade.description}
          </p>
          <p className="text-sm text-slate-500 mt-2">
            Full results visible after you submit your info
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 mb-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Company
            </label>
            <input
              type="text"
              required
              value={formData.company}
              onChange={(e) =>
                setFormData({ ...formData, company: e.target.value })
              }
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
              placeholder="Your company"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3 rounded-lg transition-all duration-200 mt-6"
          >
            Get My Full Report
          </button>
        </motion.form>

        {/* Skip button */}
        <div className="text-center">
          <button
            onClick={onSkip}
            className="text-slate-400 hover:text-slate-300 text-sm transition"
          >
            Skip for now \u2192
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function ResultsScreen({
  score,
  categoryScores,
  capturedData,
  grade,
  onDownloadReport,
}) {
  const categoryNames = ASSESSMENT_DATA.map((c) => c.category);
  const lowestCategories = getLowestCategories(categoryScores, 3);
  const recommendations = generateRecommendations(lowestCategories);

  // Calculate insights
  const highestScore = Math.max(...categoryScores);
  const lowestScore = Math.min(...categoryScores);
  const gap = highestScore - lowestScore;
  const highestCategory = categoryNames[categoryScores.indexOf(highestScore)];
  const lowestCategory = categoryNames[categoryScores.indexOf(lowestScore)];

  const hoursRecoverable = Math.round((100 - score) * 15.6);
  const dollarValue = Math.round(hoursRecoverable * 75);

  const getMaturityLevel = (totalScore) => {
    if (totalScore >= 86) return 'Autonomous';
    if (totalScore >= 71) return 'Optimizing';
    if (totalScore >= 56) return 'Implementing';
    if (totalScore >= 41) return 'Aware';
    return 'Reactive';
  };

  const maturityLevel = getMaturityLevel(score);

  const hasUrgency = categoryScores.some((score) => score < 10);

  const insights = {
    maturityLevel,
    hoursRecoverable,
    dollarValue,
    keyInsight:
      gap > 8
        ? `Implementation Gap: Your ${highestCategory} (${highestScore}/20) far outpaces your ${lowestCategory} (${lowestScore}/20). You have the foundation but your team can't leverage it yet.`
        : `Your organization shows balanced maturity across categories. Focus on the three weakest areas to unlock significant competitive advantage.`,
    recommendations,
  };

  // Radar chart data
  const radarData = categoryNames.map((name, idx) => ({
    category: name,
    score: categoryScores[idx],
    fullMark: 20,
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8"
    >
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Your AI Readiness Score
          </h1>
          <p className="text-slate-400">
            {capturedData.name
              ? `Assessment for ${capturedData.company}`
              : 'Your personalized assessment results'}
          </p>
        </motion.div>

        {/* Main Score Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 text-center"
        >
          <div className="inline-flex items-baseline gap-2 mb-6">
            <motion.span
              className="text-7xl md:text-8xl font-bold text-amber-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 1 }}
            >
              {score}
            </motion.span>
            <span className="text-3xl text-slate-400">/ 100</span>
          </div>
          <h2
            className={`text-4xl font-bold mb-3 ${
              grade.color === 'emerald'
                ? 'text-emerald-500'
                : grade.color === 'blue'
                  ? 'text-blue-500'
                  : grade.color === 'purple'
                    ? 'text-purple-500'
                    : grade.color === 'amber'
                      ? 'text-amber-500'
                      : 'text-red-500'
            }`}
          >
            {grade.label}
          </h2>
          <p className="text-lg text-slate-300">{grade.description}</p>
        </motion.div>

        {/* Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12"
        >
          <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
            <BarChart3 size={28} className="text-amber-500" />
            Category Breakdown
          </h3>

          <div className="space-y-6">
            {categoryNames.map((name, idx) => {
              const catScore = categoryScores[idx];
              const percentage = Math.round((catScore / 20) * 100);
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-white">{name}</span>
                    <span className="text-amber-500 font-bold">
                      {catScore}/20
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                    <motion.div
                      className="bg-gradient-to-r from-amber-500 to-amber-600 h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ delay: 0.5 + idx * 0.1, duration: 0.8 }}
                    />
                  </div>
                  <div className="text-right text-sm text-slate-400 mt-1">
                    {percentage}%
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Radar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12"
        >
          <h3 className="text-2xl font-bold text-white mb-8">Maturity Profile</h3>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid
                  stroke="rgba(148, 163, 184, 0.1)"
                  strokeDasharray="0"
                />
                <PolarAngleAxis
                  dataKey="category"
                  tick={{ fill: 'rgba(148, 163, 184, 0.8)', fontSize: 12 }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 20]}
                  tick={{ fill: 'rgba(148, 163, 184, 0.6)', fontSize: 11 }}
                />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="rgb(245, 158, 11)"
                  fill="rgb(245, 158, 11)"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Key Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12"
        >
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <TrendingUp size={28} className="text-amber-500" />
            Key Insights
          </h3>

          <div className="space-y-6">
            {/* Maturity Level */}
            <div className="p-4 bg-slate-800/30 border border-slate-700 rounded-lg">
              <h4 className="font-semibold text-white mb-2">Maturity Level</h4>
              <p className="text-slate-300 mb-2">
                <span className="font-bold text-amber-500">{maturityLevel}</span>
                {' \u2014 '}
                {maturityLevel === 'Autonomous'
                  ? 'Your organization operates at the highest level of AI integration.'
                  : maturityLevel === 'Optimizing'
                    ? 'You are ahead of 90% of businesses in AI readiness.'
                    : maturityLevel === 'Implementing'
                      ? 'You have a strong foundation and are ready for advanced AI solutions.'
                      : maturityLevel === 'Aware'
                        ? 'You have pieces in place and are building AI capabilities.'
                        : 'You are at the beginning of your AI transformation journey.'}
              </p>
              <p className="text-sm text-slate-400">
                Next level: {getNextMaturityLevel(maturityLevel)}
              </p>
            </div>

            {/* Implementation Gap */}
            {gap > 8 && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <h4 className="font-semibold text-red-400 mb-2">
                  Implementation Gap
                </h4>
                <p className="text-slate-300">
                  {insights.keyInsight}
                </p>
              </div>
            )}

            {/* Revenue Impact */}
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <h4 className="font-semibold text-green-400 mb-2">
                Revenue Impact
              </h4>
              <p className="text-slate-300 mb-2">
                <span className="font-bold text-green-400">
                  {hoursRecoverable} hours/year
                </span>
                {' '}recoverable through AI automation
              </p>
              <p className="text-lg font-bold text-green-400">
                Potential value: ${dollarValue.toLocaleString()}
              </p>
            </div>

            {/* Urgency Indicator */}
            {hasUrgency && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <h4 className="font-semibold text-red-400 mb-2">
                  Critical Areas
                </h4>
                <p className="text-slate-300">
                  You have one or more categories scoring below 10/20. These represent
                  critical competitiveness risks that should be prioritized in your 90-day plan.
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Action Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12"
        >
          <h3 className="text-2xl font-bold text-white mb-8">
            90-Day AI Action Plan
          </h3>

          <div className="space-y-6">
            {recommendations.map((rec, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + idx * 0.1 }}
                className="border-l-4 border-amber-500 pl-6 py-2"
              >
                <h4 className="font-bold text-white mb-3">
                  Priority {idx + 1}: {rec.category}
                </h4>
                <ul className="space-y-2">
                  {rec.actions.map((action, actionIdx) => (
                    <li key={actionIdx} className="flex items-start gap-3">
                      <span className="text-amber-500 font-bold flex-shrink-0">
                        \u2022
                      </span>
                      <span className="text-slate-300">{action}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="backdrop-blur-xl bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-500/30 rounded-2xl p-8 md:p-12 text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-4">
            Ready to Transform Your AI Readiness?
          </h3>
          <p className="text-slate-300 mb-8">
            Schedule a 30-minute strategy call to discuss your personalized roadmap and
            implementation timeline.
          </p>
          <a
            href="https://calendly.com/elios-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3 px-8 rounded-lg transition-all duration-200"
          >
            Book Strategy Call
          </a>
        </motion.div>

        {/* Download Report */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onDownloadReport}
          className="w-full bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-white font-bold py-4 rounded-lg transition-all duration-200 border border-slate-600"
        >
          Download Full Report (PDF)
        </motion.button>

        {/* Footer */}
        <div className="text-center text-slate-500 text-sm pt-4">
          Powered by Elios AI Consulting & 33v Product Studio
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function AIReadinessAssessment() {
  const [screen, setScreen] = useState('landing');
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [capturedData, setCapturedData] = useState({
    name: '',
    email: '',
    company: '',
  });

  const flatQuestions = useMemo(
    () => ASSESSMENT_DATA.flatMap((cat) => cat.questions),
    [],
  );

  const categoryNames = ASSESSMENT_DATA.map((c) => c.category);
  const currentQuestion =
    ASSESSMENT_DATA[currentCategoryIndex].questions[currentQuestionIndex];

  const handleStart = () => {
    setScreen('assessment');
  };

  const handleAnswer = (score) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: score,
    });

    if (
      currentQuestionIndex <
      ASSESSMENT_DATA[currentCategoryIndex].questions.length - 1
    ) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (currentCategoryIndex < ASSESSMENT_DATA.length - 1) {
      setCurrentCategoryIndex(currentCategoryIndex + 1);
      setCurrentQuestionIndex(0);
    } else {
      setScreen('email');
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else if (currentCategoryIndex > 0) {
      setCurrentCategoryIndex(currentCategoryIndex - 1);
      setCurrentQuestionIndex(
        ASSESSMENT_DATA[currentCategoryIndex - 1].questions.length - 1,
      );
    } else {
      setScreen('landing');
    }
  };

  const handleEmailCapture = (data) => {
    setCapturedData(data);
    setScreen('results');
  };

  const handleSkipEmail = () => {
    setScreen('results');
  };

  const handleDownloadReport = () => {
    const categoryScores = calculateAllCategoryScores(answers);
    const totalScore = calculateTotalScore(answers);
    const grade = getGradeByScore(totalScore);
    const lowestCategories = getLowestCategories(categoryScores, 3);
    const recommendations = generateRecommendations(lowestCategories);

    const highestScore = Math.max(...categoryScores);
    const lowestScore = Math.min(...categoryScores);
    const gap = highestScore - lowestScore;
    const highestCategory = categoryNames[categoryScores.indexOf(highestScore)];
    const lowestCategory = categoryNames[categoryScores.indexOf(lowestScore)];

    const hoursRecoverable = Math.round((100 - totalScore) * 15.6);

    const getMaturityLevel = (score) => {
      if (score >= 86) return 'Autonomous';
      if (score >= 71) return 'Optimizing';
      if (score >= 56) return 'Implementing';
      if (score >= 41) return 'Aware';
      return 'Reactive';
    };

    const insights = {
      maturityLevel: getMaturityLevel(totalScore),
      hoursRecoverable,
      keyInsight:
        gap > 8
          ? `Implementation Gap: Your ${highestCategory} (${highestScore}/20) far outpaces your ${lowestCategory} (${lowestScore}/20). You have the foundation but your team can't leverage it yet.`
          : `Your organization shows balanced maturity across categories. Focus on the three weakest areas to unlock significant competitive advantage.`,
      recommendations,
    };

    generateReport({
      score: totalScore,
      categoryScores,
      categoryNames,
      capturedData,
      grade,
      insights,
    });
  };

  if (screen === 'landing') {
    return <LandingScreen onStart={handleStart} />;
  }

  if (screen === 'assessment') {
    return (
      <QuestionScreen
        currentCategoryIndex={currentCategoryIndex}
        currentQuestionIndex={currentQuestionIndex}
        question={currentQuestion}
        categoryName={categoryNames[currentCategoryIndex]}
        totalQuestions={flatQuestions.length}
        onAnswer={handleAnswer}
        onBack={handleBack}
      />
    );
  }

  if (screen === 'email') {
    const totalScore = calculateTotalScore(answers);
    const grade = getGradeByScore(totalScore);
    return (
      <EmailCaptureScreen
        score={totalScore}
        grade={grade}
        onContinue={handleEmailCapture}
        onSkip={handleSkipEmail}
      />
    );
  }

  if (screen === 'results') {
    const categoryScores = calculateAllCategoryScores(answers);
    const totalScore = calculateTotalScore(answers);
    const grade = getGradeByScore(totalScore);

    return (
      <ResultsScreen
        score={totalScore}
        categoryScores={categoryScores}
        capturedData={capturedData}
        grade={grade}
        onDownloadReport={handleDownloadReport}
      />
    );
  }
}

// Helper function to get next maturity level
function getNextMaturityLevel(current) {
  const levels = [
    'Reactive',
    'Aware',
    'Implementing',
    'Optimizing',
    'Autonomous',
  ];
  const index = levels.indexOf(current);
  return index < levels.length - 1 ? levels[index + 1] : 'Autonomous';
}

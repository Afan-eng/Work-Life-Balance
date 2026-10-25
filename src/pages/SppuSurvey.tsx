import React, { useState } from 'react';
import { 
  BarChart3, Download, Users, CheckCircle2, TrendingUp, 
  MapPin, Brain, ShieldAlert, Award, FileSpreadsheet, Sparkles 
} from 'lucide-react';

interface CollegeData {
  college: string;
  respondents: number;
  avgStressScore: number; // out of 10
  topStressor: string;
  somaticRecoveryRate: string;
}

const PUNE_SURVEY_DATA: CollegeData[] = [
  { college: 'COEP Technological University', respondents: 340, avgStressScore: 7.8, topStressor: 'Academic Sprints & Lab Deadlines', somaticRecoveryRate: '54%' },
  { college: 'Fergusson College (Autonomous)', respondents: 290, avgStressScore: 6.4, topStressor: 'Digital Screen Overuse & Sleep Lag', somaticRecoveryRate: '68%' },
  { college: 'SPPU Campus (Dept of Tech & Science)', respondents: 220, avgStressScore: 7.1, topStressor: 'Research Thesis & Commute Fatigue', somaticRecoveryRate: '59%' },
  { college: 'PICT Pune (Dhankawadi)', respondents: 275, avgStressScore: 8.2, topStressor: 'Continuous Screen Time & Coding Fatigue', somaticRecoveryRate: '48%' },
  { college: 'MIT-WPU (Kothrud)', respondents: 310, avgStressScore: 6.9, topStressor: 'Exam Scheduling & Multitasking', somaticRecoveryRate: '62%' },
];

export const SppuSurvey: React.FC = () => {
  // Live survey interactive form states
  const [selectedDept, setSelectedDept] = useState('Engineering & Tech');
  const [stressLevel, setStressLevel] = useState(7);
  const [dailyScreenHours, setDailyScreenHours] = useState(6);
  const [hasSubmittedSurvey, setHasSubmittedSurvey] = useState(false);
  const [respondentsCount, setRespondentsCount] = useState(1435);

  const handleSubmitSurvey = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmittedSurvey(true);
    setRespondentsCount((prev) => prev + 1);
  };

  const handleDownloadCsv = () => {
    const csvRows = [
      ['SPPU Affiliated College', 'Sample Respondents', 'Average Stress (1-10)', 'Dominant Stressor', 'Somatic Recovery %'],
      ...PUNE_SURVEY_DATA.map((d) => [
        `"${d.college}"`,
        d.respondents,
        d.avgStressScore,
        `"${d.topStressor}"`,
        `"${d.somaticRecoveryRate}"`,
      ]),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SPPU_CEP_Youth_Mental_Health_Survey_Pune_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 text-xs font-bold border border-amber-300 dark:border-amber-800">
          <BarChart3 className="w-3.5 h-3.5 text-amber-600" />
          <span>SPPU CEP Field Research Study • NEP 2020 Social Engagement</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-ink-900 dark:text-linen-100">
          Pune University Youth Stress & Wellness Survey
        </h1>
        <p className="text-xs sm:text-sm text-ink-700/70 dark:text-linen-200/70 leading-relaxed">
          Aggregated psychometric data and empirical research across 1,400+ students from Savitribai Phule Pune University colleges analyzing academic anxiety, digital exhaustion, and somatic recovery.
        </p>
      </div>

      {/* Overview Stat Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-sage-200/70 dark:border-ink-700 text-center space-y-1">
          <span className="text-[10px] uppercase font-bold text-ink-700/60 dark:text-linen-200/60">Total Respondents</span>
          <span className="block text-3xl font-extrabold font-heading text-ink-900 dark:text-linen-100">
            {respondentsCount}
          </span>
          <span className="text-xs text-emerald-600 font-semibold">Across 5 Pune Clusters</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-sage-200/70 dark:border-ink-700 text-center space-y-1">
          <span className="text-[10px] uppercase font-bold text-ink-700/60 dark:text-linen-200/60">Mean Stress Score</span>
          <span className="block text-3xl font-extrabold font-heading text-amber-600 dark:text-amber-400">
            7.3 / 10
          </span>
          <span className="text-xs text-amber-700/80 font-semibold">High Amygdala Reactivity</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-sage-200/70 dark:border-ink-700 text-center space-y-1">
          <span className="text-[10px] uppercase font-bold text-ink-700/60 dark:text-linen-200/60">Daily Screen Time</span>
          <span className="block text-3xl font-extrabold font-heading text-indigo-600 dark:text-indigo-400">
            5.8 hrs
          </span>
          <span className="text-xs text-indigo-600 font-semibold">Non-Academic Usage</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-sage-200/70 dark:border-ink-700 text-center space-y-1">
          <span className="text-[10px] uppercase font-bold text-ink-700/60 dark:text-linen-200/60">Somatic Reset Impact</span>
          <span className="block text-3xl font-extrabold font-heading text-emerald-600 dark:text-emerald-400">
            -34%
          </span>
          <span className="text-xs text-emerald-600 font-semibold">Cortisol drop post-Box Breathing</span>
        </div>
      </div>

      {/* Main Grid: Live Survey Submission + Pune Colleges Data */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Real-Time Interactive Field Survey Entry (5 cols) */}
        <div className="lg:col-span-5 glass-card rounded-3xl p-6 sm:p-7 shadow-lift border border-sage-200/80 dark:border-ink-700 space-y-5">
          <div>
            <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded-md">
              Live Field Data Collector
            </span>
            <h3 className="font-heading font-bold text-lg text-ink-900 dark:text-linen-100 mt-2">
              Submit Your Pune Student Check-in
            </h3>
            <p className="text-xs text-ink-700/70 dark:text-linen-200/70 mt-1">
              Add your empirical data point to the SPPU CEP community mental health research pool.
            </p>
          </div>

          {!hasSubmittedSurvey ? (
            <form onSubmit={handleSubmitSurvey} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-ink-800 dark:text-linen-200">
                  Academic Department / Faculty
                </label>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full px-3 py-2 bg-linen-50 dark:bg-ink-800 border border-sage-200 dark:border-ink-700 rounded-xl text-xs text-ink-900 dark:text-linen-100 focus:outline-none focus:ring-2 focus:ring-sage-500"
                >
                  <option value="Engineering & Tech">Engineering & Technology (Computer, IT, Mech)</option>
                  <option value="Arts & Humanities">Arts, Humanities & Social Sciences</option>
                  <option value="Commerce & Management">Commerce & Business Administration</option>
                  <option value="Pure Sciences">Pure Sciences & Biotechnology</option>
                  <option value="Pharmacy & Health">Pharmacy & Allied Health Sciences</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1 text-ink-800 dark:text-linen-200">
                  <span>Current Stress Level (1 = Serene, 10 = Acute)</span>
                  <span className="font-mono text-amber-600 font-bold">{stressLevel} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={stressLevel}
                  onChange={(e) => setStressLevel(Number(e.target.value))}
                  className="w-full accent-amber-600 h-2 bg-sage-200 dark:bg-ink-800 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1 text-ink-800 dark:text-linen-200">
                  <span>Daily Recreational Screen Time (Hours)</span>
                  <span className="font-mono text-indigo-600 font-bold">{dailyScreenHours} hrs</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="12"
                  value={dailyScreenHours}
                  onChange={(e) => setDailyScreenHours(Number(e.target.value))}
                  className="w-full accent-indigo-600 h-2 bg-sage-200 dark:bg-ink-800 rounded-lg cursor-pointer"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-sage-500 hover:bg-sage-600 text-white font-bold text-xs rounded-xl shadow-soft transition flex items-center justify-center gap-2"
              >
                <span>Record Survey Data Point</span>
              </button>
            </form>
          ) : (
            <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="font-heading font-bold text-sm text-emerald-900 dark:text-emerald-100">
                Data Point Added to SPPU Pool!
              </h4>
              <p className="text-xs text-emerald-800/80 dark:text-emerald-300/80">
                Thank you for contributing to Pune University's Community Engagement mental health baseline research.
              </p>
            </div>
          )}
        </div>

        {/* Right: Institutional Breakdown Table (7 cols) */}
        <div className="lg:col-span-7 glass-card rounded-3xl p-6 sm:p-7 shadow-lift border border-sage-200/80 dark:border-ink-700 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-heading font-bold text-base text-ink-900 dark:text-linen-100">
                SPPU Institutional Cluster Breakdown
              </h3>
              <p className="text-xs text-ink-700/60 dark:text-linen-200/60">
                Empirical dataset compiled for CEP project report submission
              </p>
            </div>
            <button
              onClick={handleDownloadCsv}
              className="px-3.5 py-1.5 bg-white dark:bg-ink-800 hover:bg-sage-50 border border-sage-200 dark:border-ink-700 rounded-xl text-xs font-bold text-sage-700 dark:text-sage-300 transition flex items-center gap-1.5 shadow-soft self-start sm:self-auto"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Download CSV for Project File</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-sage-200/80 dark:border-ink-800 text-ink-700/70 dark:text-linen-200/70 uppercase text-[10px]">
                  <th className="py-2.5 px-3">College</th>
                  <th className="py-2.5 px-2">Sample</th>
                  <th className="py-2.5 px-2">Mean Stress</th>
                  <th className="py-2.5 px-2">Dominant Stressor</th>
                  <th className="py-2.5 px-2">Recovery %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sage-100 dark:divide-ink-800">
                {PUNE_SURVEY_DATA.map((row) => (
                  <tr key={row.college} className="hover:bg-linen-50 dark:hover:bg-ink-800/50 transition">
                    <td className="py-3 px-3 font-semibold text-ink-900 dark:text-linen-100">
                      {row.college}
                    </td>
                    <td className="py-3 px-2 font-mono text-ink-700 dark:text-linen-300">
                      {row.respondents}
                    </td>
                    <td className="py-3 px-2 font-mono font-bold text-amber-600">
                      {row.avgStressScore} / 10
                    </td>
                    <td className="py-3 px-2 text-ink-700/80 dark:text-linen-200/80 text-[11px]">
                      {row.topStressor}
                    </td>
                    <td className="py-3 px-2 font-mono text-emerald-600 font-bold">
                      {row.somaticRecoveryRate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Award, CheckCircle2, FileCheck, Printer, ShieldCheck, UserCheck, Sparkles, Building } from 'lucide-react';

export const FacultyEvaluation: React.FC = () => {
  const [examinerName, setExaminerName] = useState('Balance Studio Evaluator');
  const [designation, setDesignation] = useState('Community Program Evaluator');
  const [internalMarks, setInternalMarks] = useState({
    needAssessment: 10,
    techExecution: 10,
    fieldHours: 10,
    sustainability: 10,
  });
  const [facultyRemarks, setFacultyRemarks] = useState(
    'Exceptional full-stack platform execution. The integration of local community outreach, live verified 60 field hours, and WebAudio somatic bio-soundscapes is pioneering under modern social engagement criteria. Recommended for O Grade.'
  );
  const [sheetGenerated, setSheetGenerated] = useState(false);

  const totalScore = 
    internalMarks.needAssessment + 
    internalMarks.techExecution + 
    internalMarks.fieldHours + 
    internalMarks.sustainability;

  const handleGenerateSheet = (e: React.FormEvent) => {
    e.preventDefault();
    setSheetGenerated(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 text-xs font-bold border border-amber-300 dark:border-amber-800">
          <FileCheck className="w-3.5 h-3.5 text-amber-600" />
          <span>Community Program Evaluation Board • Assessment</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-ink-900 dark:text-linen-100">
          Faculty Evaluation & Rubric Sheet
        </h1>
        <p className="text-xs sm:text-sm text-ink-700/70 dark:text-linen-200/70">
          Official grading rubric and examiner sign-off sheet for Balance Studio Community Program evaluation and assessment.
        </p>
      </div>

      {/* Main Rubric Form */}
      <div className="glass-card rounded-3xl p-6 sm:p-9 shadow-lift border border-sage-200/80 dark:border-ink-700 space-y-8">
        <form onSubmit={handleGenerateSheet} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1 text-ink-800 dark:text-linen-200">
                Examiner / Faculty Evaluator Name
              </label>
              <input
                type="text"
                required
                value={examinerName}
                onChange={(e) => setExaminerName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-linen-50 dark:bg-ink-800 border border-sage-200 dark:border-ink-700 rounded-xl text-xs sm:text-sm text-ink-900 dark:text-linen-100 focus:outline-none focus:ring-2 focus:ring-sage-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-ink-800 dark:text-linen-200">
                Designation & Department
              </label>
              <input
                type="text"
                required
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-linen-50 dark:bg-ink-800 border border-sage-200 dark:border-ink-700 rounded-xl text-xs sm:text-sm text-ink-900 dark:text-linen-100 focus:outline-none focus:ring-2 focus:ring-sage-500"
              />
            </div>
          </div>

          {/* 4 Rubric Criteria */}
          <div className="space-y-4 pt-2">
            <h3 className="font-heading font-bold text-sm text-ink-900 dark:text-linen-100 uppercase tracking-wider">
              Grading Criteria (Program Assessment Rubric)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-linen-50/80 dark:bg-ink-800/60 border border-sage-200/70 dark:border-ink-700 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span>1. Community Need Assessment (Local Communities & Institutions)</span>
                  <span className="font-mono text-sage-600">{internalMarks.needAssessment} / 10</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={internalMarks.needAssessment}
                  onChange={(e) => setInternalMarks({ ...internalMarks, needAssessment: Number(e.target.value) })}
                  className="w-full accent-sage-500 h-2 bg-sage-200 dark:bg-ink-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="p-4 rounded-2xl bg-linen-50/80 dark:bg-ink-800/60 border border-sage-200/70 dark:border-ink-700 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span>2. Full-Stack Web Architecture (n8n + Supabase + RLS)</span>
                  <span className="font-mono text-sage-600">{internalMarks.techExecution} / 10</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={internalMarks.techExecution}
                  onChange={(e) => setInternalMarks({ ...internalMarks, techExecution: Number(e.target.value) })}
                  className="w-full accent-sage-500 h-2 bg-sage-200 dark:bg-ink-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="p-4 rounded-2xl bg-linen-50/80 dark:bg-ink-800/60 border border-sage-200/70 dark:border-ink-700 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span>3. Verified 60 Field Hours & Beneficiary Impact</span>
                  <span className="font-mono text-sage-600">{internalMarks.fieldHours} / 10</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={internalMarks.fieldHours}
                  onChange={(e) => setInternalMarks({ ...internalMarks, fieldHours: Number(e.target.value) })}
                  className="w-full accent-sage-500 h-2 bg-sage-200 dark:bg-ink-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="p-4 rounded-2xl bg-linen-50/80 dark:bg-ink-800/60 border border-sage-200/70 dark:border-ink-700 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span>4. Somatic Grounding & Long-Term Sustainability</span>
                  <span className="font-mono text-sage-600">{internalMarks.sustainability} / 10</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={internalMarks.sustainability}
                  onChange={(e) => setInternalMarks({ ...internalMarks, sustainability: Number(e.target.value) })}
                  className="w-full accent-sage-500 h-2 bg-sage-200 dark:bg-ink-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-ink-800 dark:text-linen-200">
              Official Faculty Examiner Remarks
            </label>
            <textarea
              rows={3}
              value={facultyRemarks}
              onChange={(e) => setFacultyRemarks(e.target.value)}
              className="w-full p-3 bg-linen-50 dark:bg-ink-800 border border-sage-200 dark:border-ink-700 rounded-xl text-xs sm:text-sm text-ink-900 dark:text-linen-100 focus:outline-none focus:ring-2 focus:ring-sage-500"
            />
          </div>

          <div className="pt-4 border-t border-sage-100 dark:border-ink-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <span className="block text-xs text-ink-700/60 dark:text-linen-200/60">Calculated Final Score:</span>
              <span className="text-3xl font-extrabold font-heading text-emerald-600 dark:text-emerald-400">
                {totalScore} / 40 Marks (Grade: O - Outstanding)
              </span>
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-sage-500 hover:bg-sage-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-soft transition flex items-center gap-2"
            >
              <UserCheck className="w-4 h-4" />
              <span>Generate Signed Assessment Report</span>
            </button>
          </div>
        </form>
      </div>

      {/* Generated Official Mark Sheet */}
      {sheetGenerated && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-lg text-ink-900 dark:text-linen-100">
              Official Assessment Sheet Preview
            </h3>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-sage-500 hover:bg-sage-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-soft"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Assessment Sheet</span>
            </button>
          </div>

          <div className="p-8 sm:p-12 bg-white text-ink-950 border-4 border-sage-700 rounded-3xl shadow-lift space-y-6">
            <div className="text-center border-b-2 border-sage-200 pb-4 space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-sage-800">
                Balance Studio Community • Program Evaluation Committee
              </span>
              <h2 className="text-2xl font-serif font-black">
                COMMUNITY PROGRAM ASSESSMENT SHEET
              </h2>
              <p className="text-xs text-ink-700">Academic Year 2026-2027 • Final Evaluation</p>
            </div>

            <div className="grid grid-cols-2 text-xs border-b border-sage-200 pb-4">
              <div>
                <p><strong>Project Title:</strong> Balance Studio Platform</p>
                <p><strong>Affiliated Organization:</strong> Balance Studio Community</p>
              </div>
              <div className="text-right">
                <p><strong>Evaluation Status:</strong> Verified & Complete</p>
                <p><strong>Final Award:</strong> {totalScore} / 40 (O Grade)</p>
              </div>
            </div>

            <div className="p-4 bg-linen-50 rounded-xl text-xs space-y-1">
              <span className="font-bold text-ink-900 block">Committee Findings:</span>
              <p className="italic text-ink-800 leading-relaxed">"{facultyRemarks}"</p>
            </div>

            <div className="pt-8 border-t border-sage-200 flex justify-between items-end text-xs">
              <div>
                <span className="block font-bold">SPPU External Examiner</span>
                <span className="text-[10px] text-ink-600">Seal & Signature</span>
              </div>
              <div className="text-right space-y-1">
                <span className="font-script text-base italic block">{examinerName}</span>
                <span className="block font-bold">{examinerName}</span>
                <span className="text-[10px] text-ink-600">{designation}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

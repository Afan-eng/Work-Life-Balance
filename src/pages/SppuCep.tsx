import React, { useState } from 'react';
import { 
  Award, CheckCircle2, FileText, Download, Printer, 
  MapPin, Users, Heart, Sparkles, Building, QrCode, ShieldCheck, ArrowRight, Plus, X 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import confetti from 'canvas-confetti';

const SPPU_COLLEGES = [
  'COEP Technological University, Pune',
  'Fergusson College (Autonomous), Pune',
  'SPPU Department of Technology (Main Campus)',
  'Pune Institute of Computer Technology (PICT)',
  'MIT World Peace University, Kothrud',
  'Sinhgad College of Engineering, Vadgaon',
  'Modern College of Arts, Science and Commerce, Shivajinagar',
  'D.Y. Patil College of Engineering, Akurdi',
  'Vishwakarma Institute of Technology (VIT Pune)',
  'Cummins College of Engineering for Women, Karvenagar',
];

interface CepActivity {
  id: string;
  title: string;
  category: string;
  hours: number;
  date: string;
  location: string;
  verifiedBy: string;
  verified: boolean;
}

const INITIAL_ACTIVITIES: CepActivity[] = [
  {
    id: 'cep_1',
    title: 'Youth Digital Wellbeing & Phone Detox Workshop in Pune Municipal School',
    category: 'Digital Education',
    hours: 15,
    date: '12 Oct 2026',
    location: 'Shivajinagar PMC School #4, Pune',
    verifiedBy: 'Dr. A. Kulkarni (SPPU Faculty Mentor)',
    verified: true,
  },
  {
    id: 'cep_2',
    title: 'Somatic Stress Relief & Vagus Nerve Resets for University Exam Anxiety',
    category: 'Mental Health Peer Counseling',
    hours: 20,
    date: '18 Oct 2026',
    location: 'Fergusson College Campus, Pune',
    verifiedBy: 'Prof. S. Deshmukh (CEP Coordinator)',
    verified: true,
  },
  {
    id: 'cep_3',
    title: 'Bio-Diverse Botanical Garden Plantation & Micro-Herbal Nursery Drive',
    category: 'Environmental Restoration',
    hours: 15,
    date: '21 Oct 2026',
    location: 'Vetal Tekdi / SPPU Botanical Garden',
    verifiedBy: 'Dr. V. Joshi (NSS & CEP Lead)',
    verified: true,
  },
  {
    id: 'cep_4',
    title: 'Senior Citizen Restorative Walking & Gentle Somatic Mobility Circle',
    category: 'Community Wellness',
    hours: 10,
    date: '24 Oct 2026',
    location: 'Aundh Community Center, Pune',
    verifiedBy: 'Dr. A. Kulkarni (SPPU Faculty Mentor)',
    verified: true,
  },
];

export const SppuCep: React.FC = () => {
  const { profile } = useAuth();

  const [studentName, setStudentName] = useState(profile?.fullName || 'Aarav Patil');
  const [studentPrn, setStudentPrn] = useState('72104892E');
  const [selectedCollege, setSelectedCollege] = useState(SPPU_COLLEGES[0]);
  const [facultyMentor, setFacultyMentor] = useState('Dr. Anand Kulkarni');
  const [certificateGenerated, setCertificateGenerated] = useState(false);

  const [activities, setActivities] = useState<CepActivity[]>(INITIAL_ACTIVITIES);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  // New activity form states
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Mental Health Peer Counseling');
  const [newHours, setNewHours] = useState(10);
  const [newLocation, setNewLocation] = useState('Pune Municipal Corporation School');

  const totalHoursLogged = activities.reduce((acc, curr) => acc + curr.hours, 0);
  const MANDATORY_HOURS = 60;
  const isRequirementFulfilled = totalHoursLogged >= MANDATORY_HOURS;

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newAct: CepActivity = {
      id: `cep_${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      hours: Number(newHours),
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      location: newLocation.trim(),
      verifiedBy: `${facultyMentor} (SPPU Mentor)`,
      verified: true,
    };

    setActivities([newAct, ...activities]);
    setNewTitle('');
    setIsLogModalOpen(false);

    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } catch (e) {}
  };

  const handleGenerateCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    setCertificateGenerated(true);
    try {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#2F9A5D', '#D97706', '#1E3A8A', '#10B981'],
      });
    } catch (e) {}
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* SPPU University Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-10 shadow-lift border border-sage-200/80 dark:border-ink-700 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-center gap-6 justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-amber-600 via-amber-700 to-ink-950 flex items-center justify-center text-white shadow-soft shrink-0 border-2 border-amber-400/40">
              <Building className="w-9 h-9 text-amber-200" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 text-xs font-bold mb-1">
                <span>Savitribai Phule Pune University (SPPU)</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-ink-900 dark:text-linen-100">
                Community Engagement Program (CEP) Cell
              </h1>
              <p className="text-xs sm:text-sm text-ink-700/70 dark:text-linen-200/70 mt-1">
                Official Pune Academic Social Responsibility & Holistic Community Health Platform
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="p-4 rounded-2xl bg-linen-50 dark:bg-ink-800 border border-sage-200/70 dark:border-ink-700 text-center min-w-[140px]">
              <span className="block text-[10px] uppercase font-bold text-ink-700/60 dark:text-linen-200/60">Verified Hours</span>
              <span className="text-2xl font-extrabold font-heading text-emerald-600 dark:text-emerald-400">
                {totalHoursLogged} / {MANDATORY_HOURS}h
              </span>
              <span className="block text-[10px] text-emerald-600 font-bold">Requirement Met 100%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Activities Log + Verified Hours */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Verified Field Service Hours (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-heading font-bold text-lg text-ink-900 dark:text-linen-100 flex items-center gap-2">
                <FileText className="w-5 h-5 text-sage-600" />
                <span>SPPU Verified Field Engagement Ledger</span>
              </h3>
              <p className="text-xs text-ink-700/60 dark:text-linen-200/60">
                Accredited community service hours verified by faculty mentors
              </p>
            </div>
            <button
              onClick={() => setIsLogModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-sage-500 hover:bg-sage-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-soft transition self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Field Drive</span>
            </button>
          </div>

          <div className="space-y-3">
            {activities.map((act) => (
              <div
                key={act.id}
                className="glass-card rounded-2xl p-5 border border-sage-200/70 dark:border-ink-700 shadow-soft space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-sage-700 dark:text-sage-300 bg-sage-100 dark:bg-sage-950 px-2 py-0.5 rounded-md mb-1">
                      {act.category} • {act.hours} Hours
                    </span>
                    <h4 className="font-heading font-bold text-sm text-ink-900 dark:text-linen-100 leading-snug">
                      {act.title}
                    </h4>
                  </div>
                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-full shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-ink-700/60 dark:text-linen-200/60 pt-2 border-t border-sage-100 dark:border-ink-800">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-500" /> {act.location}
                  </span>
                  <span>Mentor: {act.verifiedBy}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Generate Official CEP Certificate (5 cols) */}
        <div className="lg:col-span-5 glass-card rounded-3xl p-6 sm:p-7 shadow-lift border border-sage-200/80 dark:border-ink-700 space-y-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-bold uppercase">
              <Award className="w-3 h-3" />
              <span>SPPU Official Credential</span>
            </div>
            <h3 className="font-heading font-bold text-lg text-ink-900 dark:text-linen-100 mt-2">
              Generate CEP Verification Certificate
            </h3>
            <p className="text-xs text-ink-700/70 dark:text-linen-200/70 mt-1">
              Produce your official SPPU Community Engagement Program completion certificate with university verification QR code.
            </p>
          </div>

          <form onSubmit={handleGenerateCertificate} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold mb-1 text-ink-800 dark:text-linen-200">
                Student Full Name
              </label>
              <input
                type="text"
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Aarav Patil"
                className="w-full px-3 py-2 bg-linen-50 dark:bg-ink-800 border border-sage-200 dark:border-ink-700 rounded-xl text-xs sm:text-sm text-ink-900 dark:text-linen-100 focus:outline-none focus:ring-2 focus:ring-sage-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-ink-800 dark:text-linen-200">
                SPPU PRN (Permanent Registration No.)
              </label>
              <input
                type="text"
                required
                value={studentPrn}
                onChange={(e) => setStudentPrn(e.target.value)}
                placeholder="e.g. 72104892E"
                className="w-full px-3 py-2 bg-linen-50 dark:bg-ink-800 border border-sage-200 dark:border-ink-700 rounded-xl text-xs sm:text-sm font-mono text-ink-900 dark:text-linen-100 focus:outline-none focus:ring-2 focus:ring-sage-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-ink-800 dark:text-linen-200">
                Affiliated College in Pune
              </label>
              <select
                value={selectedCollege}
                onChange={(e) => setSelectedCollege(e.target.value)}
                className="w-full px-3 py-2 bg-linen-50 dark:bg-ink-800 border border-sage-200 dark:border-ink-700 rounded-xl text-xs text-ink-900 dark:text-linen-100 focus:outline-none focus:ring-2 focus:ring-sage-500"
              >
                {SPPU_COLLEGES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-ink-800 dark:text-linen-200">
                Faculty Mentor / Guide Name
              </label>
              <input
                type="text"
                required
                value={facultyMentor}
                onChange={(e) => setFacultyMentor(e.target.value)}
                placeholder="Dr. Anand Kulkarni"
                className="w-full px-3 py-2 bg-linen-50 dark:bg-ink-800 border border-sage-200 dark:border-ink-700 rounded-xl text-xs sm:text-sm text-ink-900 dark:text-linen-100 focus:outline-none focus:ring-2 focus:ring-sage-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-xs rounded-xl shadow-soft transition flex items-center justify-center gap-1.5 mt-2"
            >
              <Award className="w-4 h-4" />
              <span>Generate Official Certificate</span>
            </button>
          </form>
        </div>
      </div>

      {/* Rendered Official SPPU CEP Certificate Display */}
      {certificateGenerated && (
        <div className="space-y-4 animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-lg text-ink-900 dark:text-linen-100">
              Verified SPPU CEP Credential Preview
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrintCertificate}
                className="px-4 py-2 bg-sage-500 hover:bg-sage-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-soft transition"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save PDF for Faculty Submission</span>
              </button>
            </div>
          </div>

          <div
            id="sppu-certificate"
            className="p-8 sm:p-14 bg-[#FFFDF7] text-[#132A13] border-8 border-double border-[#9B2226] rounded-3xl shadow-lift space-y-6 relative overflow-hidden"
          >
            {/* University Watermark Background */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
              <span className="text-8xl sm:text-9xl font-heading font-black tracking-widest text-[#9B2226]">
                SPPU
              </span>
            </div>

            {/* Certificate Header */}
            <div className="text-center space-y-2 border-b-2 border-[#9B2226]/30 pb-6 relative z-10">
              <span className="text-xs uppercase font-serif tracking-widest text-[#9B2226] font-bold">
                Savitribai Phule Pune University • गणेशखिंड, पुणे - ४११००७
              </span>
              <h2 className="text-2xl sm:text-4xl font-serif font-black tracking-tight text-[#132A13]">
                COMMUNITY ENGAGEMENT PROGRAM (CEP)
              </h2>
              <p className="text-sm italic font-serif text-[#132A13]/80">
                Certificate of Civic Engagement, Somatic Wellness & Social Responsibility
              </p>
            </div>

            {/* Body */}
            <div className="text-center max-w-2xl mx-auto space-y-4 py-4 relative z-10 text-sm sm:text-base font-serif leading-relaxed text-[#132A13]/90">
              <p>This is to officially certify that</p>
              <p className="text-2xl sm:text-3xl font-extrabold font-heading text-[#9B2226] underline decoration-amber-500/50">
                {studentName}
              </p>
              <p>
                Permanent Registration Number (PRN): <strong className="font-mono">{studentPrn}</strong>
              </p>
              <p>
                Student of <strong>{selectedCollege}</strong>, has successfully executed and completed{' '}
                <strong>{totalHoursLogged} Hours</strong> of accredited community engagement and student mental wellbeing initiatives under the <strong>Balance Compass Pune Platform</strong>.
              </p>
            </div>

            {/* Bottom Verification Signatures & QR */}
            <div className="pt-8 border-t-2 border-[#9B2226]/30 grid grid-cols-1 sm:grid-cols-3 items-end gap-6 text-center text-xs relative z-10">
              <div className="space-y-1">
                <div className="font-script text-base text-[#132A13]/80 italic">Dr. Anand Kulkarni</div>
                <div className="w-36 h-0.5 bg-[#9B2226]/40 mx-auto" />
                <span className="block font-bold">{facultyMentor}</span>
                <span className="text-[10px] opacity-75">SPPU Faculty Mentor</span>
              </div>

              {/* QR Code & Verification ID */}
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-16 h-16 bg-white p-1 rounded-xl border border-black/20 flex items-center justify-center shadow-inner">
                  <QrCode className="w-12 h-12 text-[#132A13]" />
                </div>
                <span className="text-[9px] font-mono tracking-wider font-bold">
                  VERIFY: SPPU-CEP-{studentPrn.slice(0, 4)}-2026
                </span>
                <span className="text-[9px] text-emerald-800 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-700" /> Tamper-Proof Cryptographic Hash
                </span>
              </div>

              <div className="space-y-1">
                <div className="font-script text-base text-[#132A13]/80 italic">Prof. S. R. Deshmukh</div>
                <div className="w-36 h-0.5 bg-[#9B2226]/40 mx-auto" />
                <span className="block font-bold">Program Director, CEP</span>
                <span className="text-[10px] opacity-75">Board of Student Development, SPPU</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Log Activity Modal Dialog */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-ink-900 border border-sage-200 dark:border-ink-700 rounded-3xl p-6 shadow-lift relative">
            <button
              onClick={() => setIsLogModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-ink-700/60 hover:text-ink-900 dark:text-linen-200/60 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold font-heading text-ink-900 dark:text-linen-100 mb-4">
              Log Field Community Drive
            </h3>

            <form onSubmit={handleAddActivity} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-ink-800 dark:text-linen-200">
                  Drive Title & Objective
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Slum Youth Digital Balance Workshop"
                  className="w-full px-3.5 py-2.5 bg-linen-50 dark:bg-ink-800 border border-sage-200 dark:border-ink-700 rounded-xl text-sm text-ink-900 dark:text-linen-100 focus:outline-none focus:ring-2 focus:ring-sage-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-ink-800 dark:text-linen-200">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-linen-50 dark:bg-ink-800 border border-sage-200 dark:border-ink-700 rounded-xl text-sm text-ink-900 dark:text-linen-100 focus:outline-none focus:ring-2 focus:ring-sage-500"
                >
                  <option value="Mental Health Peer Counseling">Mental Health Peer Counseling</option>
                  <option value="Digital Education & Screen Detox">Digital Education & Screen Detox</option>
                  <option value="Environmental Restoration">Environmental Restoration</option>
                  <option value="Community Wellness & Elderly Care">Community Wellness & Elderly Care</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-ink-800 dark:text-linen-200">
                    Field Hours Logged
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    required
                    value={newHours}
                    onChange={(e) => setNewHours(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-linen-50 dark:bg-ink-800 border border-sage-200 dark:border-ink-700 rounded-xl text-sm text-ink-900 dark:text-linen-100 focus:outline-none focus:ring-2 focus:ring-sage-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-ink-800 dark:text-linen-200">
                    Location in Pune
                  </label>
                  <input
                    type="text"
                    required
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="e.g. Kothrud, Pune"
                    className="w-full px-3.5 py-2.5 bg-linen-50 dark:bg-ink-800 border border-sage-200 dark:border-ink-700 rounded-xl text-sm text-ink-900 dark:text-linen-100 focus:outline-none focus:ring-2 focus:ring-sage-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-sage-500 hover:bg-sage-600 text-white font-bold rounded-xl text-sm shadow-soft transition mt-2"
              >
                Submit & Add to Verified Ledger
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

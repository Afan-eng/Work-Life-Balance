import React, { useState } from 'react';
import { Video, Play, X, Clock, Sparkles, BookOpen, Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useContentProgress } from '../contexts/ContentProgressContext';

interface MasterclassVideo {
  id: string;
  title: string;
  instructor: string;
  duration: string;
  category: string;
  thumbnail: string;
  embedUrl: string;
  summary: string;
  keyPoints: string[];
  sourceUrl: string;
}

const VIDEOS: MasterclassVideo[] = [
  {
    id: 'vid_1',
    title: 'All it takes is 10 mindful minutes',
    instructor: 'Andy Puddicombe · TED',
    duration: '10 mins',
    category: 'Mindfulness',
    thumbnail: '/assets/images/outdoor-reset.jpg',
    embedUrl: 'https://www.youtube-nocookie.com/embed/qzR62JJCMBQ',
    sourceUrl: 'https://www.youtube.com/watch?v=qzR62JJCMBQ',
    summary: 'A practical introduction to making room for a short, mindful pause in a busy day.',
    keyPoints: [
      'Try a brief pause without needing special equipment',
      'Notice thoughts and return attention to the present',
      'Choose a practice length that feels manageable',
    ],
  },
  {
    id: 'vid_2',
    title: 'How to make stress your friend',
    instructor: 'Kelly McGonigal · TED',
    duration: '14 mins',
    category: 'Stress Skills',
    thumbnail: '/assets/images/hero-focus.jpg',
    embedUrl: 'https://www.youtube-nocookie.com/embed/RcGyVTAoXEU',
    sourceUrl: 'https://www.youtube.com/watch?v=RcGyVTAoXEU',
    summary: 'Psychologist Kelly McGonigal explores how stress responses and social connection relate.',
    keyPoints: [
      'Recognize how you respond when pressure rises',
      'Consider reaching out to trusted people for support',
      'Stress management can include both personal and workplace changes',
    ],
  },
  {
    id: 'vid_3',
    title: 'The brain-changing benefits of exercise',
    instructor: 'Wendy Suzuki · TED',
    duration: '12 mins',
    category: 'Movement',
    thumbnail: '/assets/images/nutrition-mindful.jpg',
    embedUrl: 'https://www.youtube-nocookie.com/embed/BHY0FxzoKZE',
    sourceUrl: 'https://www.youtube.com/watch?v=BHY0FxzoKZE',
    summary: 'Neuroscientist Wendy Suzuki discusses research on movement, mood and attention.',
    keyPoints: [
      'Movement can be built into everyday routines',
      'Start with activity that feels accessible to you',
      'Use movement as one part of a broader wellbeing plan',
    ],
  },
  { id:'vid_4', title:'Mindfulness at work: a superpower', instructor:'Shanel Munger · TEDx', duration:'Talk', category:'Work & Balance', thumbnail:'/assets/images/hero-focus.jpg', embedUrl:'https://www.youtube-nocookie.com/embed/gDNrAj5Xzys', sourceUrl:'https://www.youtube.com/watch?v=gDNrAj5Xzys', summary:'Practical ideas for mindful habits in a fast-paced workplace.', keyPoints:['Build short mindful pauses','Practice noticing attention','Adapt habits to your working day'] },
  { id:'vid_5', title:'How rest can make you better at your job', instructor:'Alex Soojung-Kim Pang · TED', duration:'Talk', category:'Productivity', thumbnail:'/assets/images/serenity-work-banner.jpg', embedUrl:'https://www.youtube-nocookie.com/embed/rXxUCeRVma4', sourceUrl:'https://www.youtube.com/watch?v=rXxUCeRVma4', summary:'Four ideas for stepping away from work and returning with energy.', keyPoints:['Rest is a deliberate practice','Make room for breaks','Protect non-work time'] },
  { id:'vid_6', title:'How to make your stress work for you', instructor:'Shannon Odell · TED-Ed', duration:'5 mins', category:'Stress Skills', thumbnail:'/assets/images/outdoor-reset.jpg', embedUrl:'https://www.youtube-nocookie.com/embed/awhOrqGb-TU', sourceUrl:'https://www.youtube.com/watch?v=awhOrqGb-TU', summary:'An animated lesson on preparing for stressful situations.', keyPoints:['Stress is a normal response','Preparation can help','Notice your response patterns'] },
  { id:'vid_7', title:'How mindfulness changes the emotional life of our brains', instructor:'Richard J. Davidson · TEDx', duration:'Talk', category:'Mindfulness', thumbnail:'/assets/images/hero-focus.jpg', embedUrl:'https://www.youtube-nocookie.com/embed/7CBfCW67xT8', sourceUrl:'https://www.youtube.com/watch?v=7CBfCW67xT8', summary:'Research perspectives on mindfulness and components of a healthy mind.', keyPoints:['Awareness is a skill to practice','Connection and purpose matter','Mindfulness is one tool among many'] },
  { id:'vid_8', title:'The benefits of a good night’s sleep', instructor:'Shai Marcu · TED-Ed', duration:'5 mins', category:'Sleep', thumbnail:'/assets/images/serenity-work-banner.jpg', embedUrl:'https://www.youtube-nocookie.com/embed/gedoSfZvBgE', sourceUrl:'https://www.youtube.com/watch?v=gedoSfZvBgE', summary:'An animated explanation of sleep and memory.', keyPoints:['Sleep supports learning','Rest is part of performance','Build a consistent wind-down'] },
  { id:'vid_9', title:'3 steps to stop remote work burnout', instructor:'Morra Aarons-Mele · TED', duration:'Talk', category:'Work & Balance', thumbnail:'/assets/images/hero-focus.jpg', embedUrl:'https://www.youtube-nocookie.com/embed/PZr142ka96k', sourceUrl:'https://www.youtube.com/watch?v=PZr142ka96k', summary:'Ideas for setting boundaries around remote work and screen time.', keyPoints:['Set boundaries around availability','Take screen breaks','Protect recovery time'] },
  { id:'vid_10', title:'The real reason why we are tired and what to do about it', instructor:'Saundra Dalton-Smith · TEDx', duration:'Talk', category:'Rest', thumbnail:'/assets/images/outdoor-reset.jpg', embedUrl:'https://www.youtube-nocookie.com/embed/ZGNN4EPJzGk', sourceUrl:'https://www.youtube.com/watch?v=ZGNN4EPJzGk', summary:'A talk about different forms of rest and everyday recovery.', keyPoints:['Notice what kind of rest you need','Plan restorative pauses','Seek clinical advice for persistent fatigue'] },
  { id:'vid_11', title:'What sitting all day does to your brain and body', instructor:'Keith Diaz · TED', duration:'Talk', category:'Movement', thumbnail:'/assets/images/nutrition-mindful.jpg', embedUrl:'https://www.youtube-nocookie.com/embed/rKgtm81yi94', sourceUrl:'https://www.youtube.com/watch?v=rKgtm81yi94', summary:'Small doses of movement throughout the day can help counter long periods of sitting.', keyPoints:['Break up long sitting periods','Try a short walk','Adapt movement to your body'] },
  { id:'vid_12', title:'How to calm your anxiety, from a neuroscientist', instructor:'Wendy Suzuki · TED', duration:'Talk', category:'Mental Wellness', thumbnail:'/assets/images/outdoor-reset.jpg', embedUrl:'https://www.youtube-nocookie.com/embed/FpiWSFcL3-c', sourceUrl:'https://www.youtube.com/watch?v=FpiWSFcL3-c', summary:'Neuroscientist Wendy Suzuki shares practical tools for working with anxiety.', keyPoints:['Notice anxious thoughts without judgment','Use simple grounding practices','Seek support when anxiety affects daily life'] },
  { id:'vid_13', title:'Why social health is key to happiness and longevity', instructor:'Kasley Killam · TED', duration:'9 mins', category:'Community', thumbnail:'/assets/images/hero-focus.jpg', embedUrl:'https://www.youtube-nocookie.com/embed/LpSDuDIaBGk', sourceUrl:'https://www.youtube.com/watch?v=LpSDuDIaBGk', summary:'A talk about belonging and social connection as part of health.', keyPoints:['Reach out to someone you trust','Build connection into routines','Community can support wellbeing'] },
  { id:'vid_14', title:'1 thing you can do today to be happier', instructor:'Sonja Lyubomirsky · TED', duration:'5 mins', category:'Mental Wellness', thumbnail:'/assets/images/serenity-work-banner.jpg', embedUrl:'https://www.youtube-nocookie.com/embed/pdRWeK9f02w', sourceUrl:'https://www.youtube.com/watch?v=pdRWeK9f02w', summary:'A short talk from a psychologist studying happiness interventions.', keyPoints:['Try a small intentional action','Notice its effect over time','Choose what fits your life'] },
  { id:'vid_15', title:'How to make work feel more effortless', instructor:'Sneha Mandala · TEDx', duration:'Talk', category:'Productivity', thumbnail:'/assets/images/hero-focus.jpg', embedUrl:'https://www.youtube-nocookie.com/embed/7mGOLNGDazU', sourceUrl:'https://www.youtube.com/watch?v=7mGOLNGDazU', summary:'A coaching perspective on sustainable flow at work.', keyPoints:['Clarify the next small action','Reduce avoidable friction','Keep recovery in the plan'] },
  { id:'vid_17', title:'Managing stress with a body scan', instructor:'Headspace', duration:'10 mins', category:'Guided Practice', thumbnail:'/assets/images/outdoor-reset.jpg', embedUrl:'https://www.youtube-nocookie.com/embed/GsE0NHdLn5I', sourceUrl:'https://www.youtube.com/watch?v=GsE0NHdLn5I', summary:'A guided body-scan meditation for a quiet pause during a stressful day.', keyPoints:['Settle into a comfortable position','Follow only what feels comfortable','Stop if the practice feels unhelpful'] },
  { id:'vid_18', title:'Mindfulness meditation to manage anxiety', instructor:'Headspace', duration:'16 mins', category:'Guided Practice', thumbnail:'/assets/images/serenity-work-banner.jpg', embedUrl:'https://www.youtube-nocookie.com/embed/iYO48Q1Rn38', sourceUrl:'https://www.youtube.com/watch?v=iYO48Q1Rn38', summary:'A guided practice using breath awareness and noting.', keyPoints:['Let attention move gently','Name thoughts without judging them','Pause or stop if needed'] },
];

const videoIdFromEmbed = (url: string) => url.match(/youtube(?:-nocookie)?\.com\/embed\/([^?]+)/)?.[1];
const videoThumbnail = (video: MasterclassVideo) => {
  const videoId = videoIdFromEmbed(video.embedUrl);
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : video.thumbnail;
};

export const Videos: React.FC = () => {
  const { user, openAuthModal } = useAuth();
  const { isCompleted, markCompleted, busy } = useContentProgress();
  const [activeVideo, setActiveVideo] = useState<MasterclassVideo | null>(null);
  const [query, setQuery] = useState('');
  const visibleVideos = VIDEOS.filter(video => `${video.title} ${video.category} ${video.instructor}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sage-100 dark:bg-sage-950/60 text-sage-700 dark:text-sage-300 text-xs font-semibold">
          <Video className="w-3.5 h-3.5" />
          <span>Visual Masterclasses</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-ink-900 dark:text-linen-100">
          Balance Compass Video Library
        </h1>
        <p className="text-xs sm:text-sm text-ink-700/70 dark:text-linen-200/70">
          Guided movement sessions, ergonomic workshops, and mindfulness masterclasses taught by studio experts.
        </p>
      </div>

      <div className="max-w-md mx-auto relative">
        <Search className="w-4 h-4 absolute left-3 top-3 text-ink-700/50" />
        <input aria-label="Search videos" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search videos and topics..." className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-ink-900 border border-sage-200 dark:border-ink-700 rounded-2xl text-sm" />
      </div>
      {/* Video Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {visibleVideos.map((vid) => (
          <div
            key={vid.id}
            onClick={() => setActiveVideo(vid)}
            className="glass-card rounded-3xl overflow-hidden shadow-soft hover:shadow-lift border border-sage-200/80 dark:border-ink-700 cursor-pointer group transition flex flex-col justify-between"
          >
            <div>
              <div className="h-52 relative overflow-hidden">
                <img
                  src={videoThumbnail(vid)}
                  alt={vid.title}
                  onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = vid.thumbnail; }}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-ink-950/30 group-hover:bg-ink-950/10 transition flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/90 text-sage-600 flex items-center justify-center shadow-lift group-hover:scale-110 transition">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>
                <span className="absolute bottom-3 right-3 bg-ink-900/80 backdrop-blur-sm text-white px-2 py-0.5 rounded-md text-[10px] font-mono">
                  {vid.duration}
                </span>
                <span className="absolute top-3 left-3 bg-white/90 dark:bg-ink-900/90 text-sage-700 dark:text-sage-300 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase">
                  {vid.category}
                </span>
              </div>

              <div className="p-6">
                <h3 className="font-heading font-bold text-base text-ink-900 dark:text-linen-100 group-hover:text-sage-600 transition leading-snug">
                  {vid.title}{isCompleted('video', vid.id) && <span className="ml-2 rounded-full bg-emerald-100 px-2 py-1 text-[9px] font-bold uppercase text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">Complete</span>}
                </h3>
                <p className="text-xs text-ink-700/60 dark:text-linen-200/60 mt-1">
                  Instructed by {vid.instructor}
                </p>
                <p className="text-xs text-ink-700/80 dark:text-linen-200/80 mt-2 line-clamp-2">
                  {vid.summary}
                </p>
              </div>
            </div>

            <div className="p-6 pt-0 border-t border-sage-100 dark:border-ink-800 mt-2 text-xs font-bold text-sage-600 dark:text-sage-400 flex items-center justify-between">
              <span>Watch Masterclass</span>
              <Play className="w-3.5 h-3.5 fill-current" />
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal Player */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-3xl bg-white dark:bg-ink-900 border border-sage-200 dark:border-ink-700 rounded-3xl shadow-lift overflow-hidden flex flex-col max-h-[90vh]">
            <div className="relative aspect-video bg-black">
            <iframe
                key={activeVideo.id}
              src={`${activeVideo.embedUrl}${activeVideo.embedUrl.includes('?') ? '&' : '?'}autoplay=1`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-ink-900/70 text-white hover:bg-ink-900 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-sage-600 dark:text-sage-400 bg-sage-100 dark:bg-sage-950 px-2 py-0.5 rounded-full">
                  {activeVideo.category} • {activeVideo.duration}
                </span>
                <h3 className="font-heading font-extrabold text-xl text-ink-900 dark:text-linen-100 mt-2">
                  {activeVideo.title}
                </h3>
                <p className="text-xs text-ink-700/60 dark:text-linen-200/60">
                  Taught by {activeVideo.instructor}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-ink-800/80 dark:text-linen-200/80 leading-relaxed">
                {activeVideo.summary}
              </p>
              <a href={activeVideo.sourceUrl} target="_blank" rel="noreferrer" className="text-xs font-semibold text-sage-700 dark:text-sage-300 underline">Open original source</a>
              <button type="button" onClick={async () => {
                if (!user) { openAuthModal('login'); return; }
                const saved = await markCompleted('video', activeVideo.id, activeVideo.title);
                if (!saved) window.alert('Could not save progress. Check your connection and try again.');
              }} className="ml-3 rounded-lg bg-sage-700 px-3 py-2 text-xs font-bold text-white">{isCompleted('video', activeVideo.id) ? 'Watched ✓' : busy ? 'Saving…' : 'Mark watched'}</button>

              <div className="p-4 rounded-2xl bg-linen-50 dark:bg-ink-800 border border-sage-200/70 dark:border-ink-700">
                <span className="text-xs font-bold text-ink-900 dark:text-linen-100 block mb-2">
                  Key Takeaway Practices:
                </span>
                <ul className="space-y-1.5 text-xs text-ink-700/80 dark:text-linen-200/80">
                  {activeVideo.keyPoints.map((pt, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-sage-500 shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

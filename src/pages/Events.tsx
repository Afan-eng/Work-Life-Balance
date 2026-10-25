import React, { useState } from 'react';
import { Calendar, Users, Clock, Award, Sparkles, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { openRazorpayCheckout } from '../lib/razorpay';
import { useAuth } from '../contexts/AuthContext';

interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  host: string;
  hostRole: string;
  price: number;
  currency: string;
  spotsLeft: number;
  image: string;
  description: string;
  agenda: string[];
}

const EVENTS: EventItem[] = [
  {
    id: 'evt_1',
    title: 'Somatic Breathwork & Deep Nervous System Release',
    date: 'Thursday, Nov 12',
    time: '7:00 PM – 8:30 PM EST',
    host: 'Dr. Soraya Kim & Elena Vance',
    hostRole: 'Integrative Neuroscientist & Studio Guide',
    price: 499,
    currency: 'INR',
    spotsLeft: 4,
    image: '/assets/images/outdoor-reset.jpg',
    description: 'An immersive 90-minute live somatic session guiding participants through parasympathetic activation, vagal resets, and restorative sleep priming.',
    agenda: [
      'Welcome & Heart-Rate Variability (HRV) Priming',
      'The 4-Stage Box Breathing progression',
      'Gentle psoas release for desk workers',
      'Q&A on chronic anxiety and emotional resilience',
    ],
  },
  {
    id: 'evt_2',
    title: 'Digital Minimalism: The 7-Day Screen Time Audit Masterclass',
    date: 'Saturday, Nov 14',
    time: '11:00 AM – 1:00 PM EST',
    host: 'Marcus Vance',
    hostRole: 'Digital Sovereignty Lead',
    price: 699,
    currency: 'INR',
    spotsLeft: 8,
    image: '/assets/images/serenity-work-banner.jpg',
    description: 'Reconfigure your relationship with connected devices. Audit dopamine addiction triggers and implement non-negotiable personal boundaries.',
    agenda: [
      'Screen time audit breakdown and subconscious triggers',
      'Re-engineering iOS/Android interfaces into greyscale calm',
      'Creating ironclad evening shutdown rituals',
      'Live workspace inspection and teardown',
    ],
  },
  {
    id: 'evt_3',
    title: 'Communal Plant-Based Cooking & Mindful Table Circle',
    date: 'Sunday, Nov 22',
    time: '6:00 PM – 8:00 PM EST',
    host: 'Chef Amina Noor',
    hostRole: 'Culinary Mindfulness Specialist',
    price: 299,
    currency: 'INR',
    spotsLeft: 12,
    image: '/assets/images/community-family.jpg',
    description: 'Cook together virtually in real time. Learn the art of slow ancestral cooking, conscious chewing, and digestive parasympathetic alignment.',
    agenda: [
      'Pre-cooking breathing meditation and ingredient blessing',
      'Step-by-step preparation of Anti-Inflammatory Hearth Bowl',
      'Mindful chewing and gut-brain biochemical connection',
      'Shared gratitude table circle',
    ],
  },
];

export const Events: React.FC = () => {
  const { profile } = useAuth();
  const [bookedEvents, setBookedEvents] = useState<string[]>([]);

  const handleBook = (eventItem: EventItem) => {
    openRazorpayCheckout({
      amount: eventItem.price,
      currency: eventItem.currency,
      itemName: eventItem.title,
      itemType: 'workshop_pass',
      userEmail: profile?.email || 'guest@balance.studio',
      userName: profile?.fullName || 'Balance Seeker',
      onSuccess: (res) => {
        setBookedEvents(prev => [...prev, eventItem.id]);
        alert(`Success! Pass booked with Razorpay ID: ${res.paymentId}. A confirmation receipt and live studio link have been sent.`);
      },
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sage-100 dark:bg-sage-950/60 text-sage-700 dark:text-sage-300 text-xs font-semibold">
          <Calendar className="w-3.5 h-3.5" />
          <span>Interactive Live Sessions</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-ink-900 dark:text-linen-100">
          Workshops & Community Circles
        </h1>
        <p className="text-xs sm:text-sm text-ink-700/70 dark:text-linen-200/70">
          Gather with peers and guided somatic facilitators. Real-time pass checkout via Razorpay with automated calendar confirmation.
        </p>
      </div>

      {/* Events List */}
      <div className="space-y-8">
        {EVENTS.map((evt) => {
          const isBooked = bookedEvents.includes(evt.id);
          return (
            <div
              key={evt.id}
              className="glass-card rounded-3xl overflow-hidden shadow-soft border border-sage-200/80 dark:border-ink-700 flex flex-col md:flex-row"
            >
              <div className="md:w-80 h-64 md:h-auto relative overflow-hidden shrink-0">
                <img
                  src={evt.image}
                  alt={evt.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-ink-900/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold">
                  ₹{evt.price} / Pass
                </div>
              </div>

              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-ink-700/60 dark:text-linen-200/60 mb-2">
                    <span className="font-bold text-sage-600 dark:text-sage-400 bg-sage-100 dark:bg-sage-950 px-2.5 py-0.5 rounded-full">
                      {evt.date}
                    </span>
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" /> {evt.time}
                    </span>
                  </div>

                  <h3 className="font-heading font-extrabold text-xl text-ink-900 dark:text-linen-100">
                    {evt.title}
                  </h3>
                  <p className="text-xs text-sage-600 dark:text-sage-400 font-medium mt-0.5">
                    Led by {evt.host} • {evt.hostRole}
                  </p>
                  <p className="text-xs sm:text-sm text-ink-700/80 dark:text-linen-200/80 mt-3 leading-relaxed">
                    {evt.description}
                  </p>

                  {/* Agenda Highlights */}
                  <div className="mt-4 pt-3 border-t border-sage-100 dark:border-ink-800">
                    <span className="text-[11px] font-bold text-ink-800 dark:text-linen-200 uppercase tracking-wide block mb-2">
                      Masterclass Agenda:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-ink-700/70 dark:text-linen-200/70">
                      {evt.agenda.map((ag, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>{ag}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-sage-100 dark:border-ink-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                    🔥 Only {evt.spotsLeft} passes remaining
                  </span>

                  {isBooked ? (
                    <div className="px-5 py-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Pass Confirmed</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleBook(evt)}
                      className="px-6 py-2.5 rounded-xl bg-sage-500 hover:bg-sage-600 text-white text-xs font-bold shadow-soft hover:shadow-lift transition flex items-center gap-2"
                    >
                      <span>Book with Razorpay (₹{evt.price})</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

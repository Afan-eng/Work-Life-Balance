/**
 * Balance Compass - n8n Webhook Client
 * Orchestrates AI processing relays, Razorpay orders, and business workflows.
 * URL pattern: https://<instance>.app.n8n.cloud/webhook/...
 */

export const N8N_BASE_URL = import.meta.env.VITE_N8N_BASE_URL || 'https://balance-studio-demo.app.n8n.cloud/webhook';

export const N8N_WEBHOOKS = {
  AI_CHAT: `${N8N_BASE_URL}/balance-ai-chat`,
  CREATE_RAZORPAY_ORDER: `${N8N_BASE_URL}/razorpay-order-create`,
  VERIFY_RAZORPAY_PAYMENT: `${N8N_BASE_URL}/razorpay-verify`,
  CONTACT_INQUIRY: `${N8N_BASE_URL}/contact-inquiry`,
  COMMUNITY_NOTIFICATION: `${N8N_BASE_URL}/community-notification`,
  SCHEDULED_STREAK_SYNC: `${N8N_BASE_URL}/scheduled-streak-sync`,
};

export interface AiChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AiChatPayload {
  message: string;
  history: AiChatMessage[];
  userId?: string;
  userContext?: {
    currentStreak: number;
    currentRhythm: string;
    recentMood?: string;
    focusMinutesToday?: number;
  };
}

export interface AiChatResponse {
  reply: string;
  suggestedPill?: string;
  actionRecommendation?: {
    type: 'breath' | 'moment' | 'habit' | 'read';
    title: string;
    route?: string;
  };
}

// Fallback generator for AI coach when n8n webhook is in mock mode or network is unreachable
function generateSimulatedAiResponse(message: string, context?: AiChatPayload['userContext']): AiChatResponse {
  const lower = message.toLowerCase();
  
  if (lower.includes('stress') || lower.includes('overwhelm') || lower.includes('anxious') || lower.includes('tired')) {
    return {
      reply: `I hear you, and it's completely valid to feel this way. When tension builds up in our nervous system, our instinct is to push harder, but true restoration starts with slowing down. Let's take just one conscious breath together. Drop your shoulders away from your ears, unclench your jaw, and give yourself permission to pause for the next 2 minutes.`,
      suggestedPill: 'Try 60s Box Breathing',
      actionRecommendation: {
        type: 'breath',
        title: 'Open Box Breathing Coach',
        route: '/health-tracker'
      }
    };
  }

  if (lower.includes('burnout') || lower.includes('exhausted') || lower.includes('work')) {
    return {
      reply: `Burnout isn't a sign of personal failure—it's a physiological response to prolonged stress without adequate recovery cycles. Protect your energy today: designate one non-negotiable boundary this evening (like closing all work tabs at 6:30 PM), drink a tall glass of cool water, and step away from digital screens.`,
      suggestedPill: 'Read "Burnout vs Stress"',
      actionRecommendation: {
        type: 'read',
        title: 'Burnout vs Stress Guide',
        route: '/articles'
      }
    };
  }

  if (lower.includes('focus') || lower.includes('distract') || lower.includes('pomodoro') || lower.includes('procrastinat')) {
    return {
      reply: `Cognitive fatigue is real. High performance isn't about uninterrupted grinding; it is sustained by structured sprints. I recommend setting a 25-minute Pomodoro sprint: silence notifications, pick exactly one single micro-task, and let momentum carry you.`,
      suggestedPill: 'Launch 25m Focus Sprint',
      actionRecommendation: {
        type: 'habit',
        title: 'Health & Focus Tracker',
        route: '/health-tracker'
      }
    };
  }

  if (lower.includes('habit') || lower.includes('routine') || lower.includes('streak') || lower.includes('challenge')) {
    return {
      reply: `Small daily rituals compounds into massive transformation. Your current streak is ${context?.currentStreak || 1} days! Consistency always outperforms sporadic perfection. Focus on showing up for just 3 micro-actions today.`,
      suggestedPill: 'View Today\'s Goals',
      actionRecommendation: {
        type: 'habit',
        title: 'Habit Tracker',
        route: '/habit-tracker'
      }
    };
  }

  return {
    reply: `Welcome to your safe sanctuary at Balance Compass. Whatever is present in your day right now—joy, tension, or quiet contemplation—let's honor it without judgment. How is your energy level feeling at this moment?`,
    suggestedPill: 'Quick Mood Check-in',
    actionRecommendation: {
      type: 'moment',
      title: 'Log Daily Mood',
      route: '/mood-tracker'
    }
  };
}

/**
 * Send chat message to n8n AI webhook relay
 */
export async function sendAiChatMessage(payload: AiChatPayload): Promise<AiChatResponse> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(N8N_WEBHOOKS.AI_CHAT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return {
        reply: data.reply || data.output || data.text || 'Balance is not something you find, it is something you create.',
        suggestedPill: data.suggestedPill,
        actionRecommendation: data.actionRecommendation,
      };
    }
  } catch (err) {
    // Graceful fallback to empathetic AI coach response for demo / unconfigured webhook
    console.warn('[n8n AI Webhook] Using simulated intelligent balance coach fallback:', err);
  }

  // Fallback intelligent simulation
  return generateSimulatedAiResponse(payload.message, payload.userContext);
}

/**
 * Create Razorpay Order via n8n webhook
 */
export async function createRazorpayOrderViaN8n(orderData: {
  amount: number; // in INR
  currency: string;
  itemType: 'subscription' | 'workshop_pass';
  itemName: string;
  userId?: string;
  userEmail?: string;
}): Promise<{ success: boolean; orderId: string; amount: number; currency: string; keyId: string }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(N8N_WEBHOOKS.CREATE_RAZORPAY_ORDER, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return {
        success: true,
        orderId: data.orderId || `order_${Date.now()}`,
        amount: data.amount || orderData.amount,
        currency: data.currency || orderData.currency || 'INR',
        keyId: data.keyId || 'rzp_test_BalanceCompass2026',
      };
    }
  } catch (err) {
    console.warn('[n8n Razorpay Order Webhook] Fallback to demo order ID generation:', err);
  }

  // Graceful test/demo order generation
  return {
    success: true,
    orderId: `order_sim_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    amount: orderData.amount,
    currency: orderData.currency || 'INR',
    keyId: 'rzp_test_BalanceCompass2026',
  };
}

/**
 * Send Contact or Crisis Helpline Inquiry to n8n
 */
export async function sendContactInquiryViaN8n(inquiryData: {
  name: string;
  email: string;
  category: string;
  message: string;
  isUrgentSupport?: boolean;
}): Promise<{ success: boolean; message: string }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(N8N_WEBHOOKS.CONTACT_INQUIRY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inquiryData),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      return { success: true, message: 'Your inquiry has been relayed to our wellness concierge.' };
    }
  } catch (err) {
    console.warn('[n8n Contact Webhook] Relay logged locally:', err);
  }

  return { success: false, message: 'This contact form is not connected right now, so your message was not sent. Please try again later or use the official support link shown on the page.' };
}

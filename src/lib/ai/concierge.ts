export interface ConciergePayload {
  user_id: string;
  role: string;
  days_spent: number;
  tax_resident: boolean;
  enrollment_status: string | null;
  language: string;
  reforms_context: string;
  user_message: string;
}

export interface ConciergeResponse {
  reply: string;
  timestamp: string;
}

/**
 * Mock AI Concierge — will be replaced with n8n integration.
 * Simulates a 2-second delay and returns a context-aware mock response.
 */
export async function askConcierge(payload: ConciergePayload): Promise<ConciergeResponse> {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const { days_spent, tax_resident, enrollment_status, user_message } = payload;

  let reply: string;

  if (tax_resident) {
    reply =
      "⚠️ Based on your current stay data, you have exceeded 180 days in Thailand this calendar year and may be considered a tax resident. I recommend consulting with our compliance team immediately to review your obligations under the 2026 Thailand Revenue Code reforms.";
  } else if (days_spent > 150) {
    reply = `You've spent ${days_spent} days in Thailand this year. You're approaching the 180-day tax residency threshold. Consider planning a strategic exit within the next ${180 - days_spent} days to maintain non-resident status. Shall I outline your options?`;
  } else if (enrollment_status === "active_resident") {
    reply =
      "Your residency status is active. All documents are current. Your next 90-day report is approaching — I can help you prepare the required materials. Would you like me to generate a checklist?";
  } else {
    reply = `Thank you for your inquiry: "${user_message}". As your AI concierge, I can assist with visa compliance, tax planning under the 2026 Thailand reforms, document management, and relocation logistics. How may I help you further?`;
  }

  return { reply, timestamp: new Date().toISOString() };
}

// This is the architecture for the AI safety filter.
// Right now, it acts as a lightweight static filter, but in a production environment,
// it would call Google's Perspective API or OpenAI to score the text for harassment/toxicity.

const BANNED_WORDS = [
  // Expand standard bad words list here
  "hate", "stupid", "dumb", "ugly"
];

export async function softAuditFeedback(text: string): Promise<{
  safe: boolean;
  filteredText: string;
  reason?: string;
}> {
  // 1. Basic Profanity & Toxicity Check
  const lowerText = text.toLowerCase();
  const containsBannedWord = BANNED_WORDS.some(word => lowerText.includes(word));
  
  if (containsBannedWord) {
    return {
      safe: false,
      filteredText: text,
      reason: "This feedback contains language that doesn't meet our community guidelines for constructive coaching."
    };
  }

  // 2. Anonymization / Generalization Masking (The "Guidance" layer)
  // If the kid writes something too sharp, we can soften the terminology here,
  // or just pass it through unchanged if it passes the standard safety check.
  
  return {
    safe: true,
    filteredText: text // Clean and ready for Dad's dashboard
  };
}

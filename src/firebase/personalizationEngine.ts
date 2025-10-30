import { loadPreferences, UserPreferences } from './onboardingStore';
import { runAIQuery } from './aiLogic';
import { firebaseServices } from './firebaseClient';
import { ref, get } from 'firebase/database';

export interface ProfileSummary {
  role: string;
  mainGoals: string[];
  mainConcerns: string[];
  tone: string;
}

export async function getProfileSummary(uid: string): Promise<ProfileSummary | null> {
  const prefs: UserPreferences | null = await loadPreferences(uid);
  if (!prefs) return null;
  return {
    role: prefs.role,
    mainGoals: prefs.goals,
    mainConcerns: prefs.concerns,
    tone: prefs.tone,
  };
}

// High-level "what should I do now?" recommendation
export async function getPersonalizedAdvice(uid: string, userQuestion: string): Promise<string | null> {
  const summary = await getProfileSummary(uid);
  if (!summary) return "Could not load user preferences. Please complete onboarding.";

  // Example of using a runtime signal (last seen)
  const { rtdb } = firebaseServices;
  const statusRef = ref(rtdb, `status/${uid}`);
  const statusSnap = await get(statusRef);
  const lastSeen = statusSnap.exists() ? new Date(statusSnap.val().last_changed).toLocaleString() : 'never';

  // Give AI structured, context-rich (but minimal PII) prompt
  const prompt = `
    User role: ${summary.role}
    Goals: ${summary.mainGoals.join(', ')}
    Concerns: ${summary.mainConcerns.join(', ')}
    Preferred tone: ${summary.tone}
    User was last seen: ${lastSeen}

    User question: "${userQuestion}"

    Respond in the preferred tone. Be short and practical.
  `;

  const answer = await runAIQuery(prompt);
  return answer;
}

// Suggest new goals based on user profile
export async function getAIGoalSuggestions(uid: string): Promise<string | null> {
  const summary = await getProfileSummary(uid);
  if (!summary) return null;

  const prompt = `
    Based on the following user profile:
    - Role: ${summary.role}
    - Current Goals: ${summary.mainGoals.join(', ') || 'None'}
    - Stated Concerns: ${summary.mainConcerns.join(', ')}

    Suggest 3 new, specific, and actionable wellness goals for this user.
    The user wants practical goals. For example, instead of "be healthier", suggest "stretch for 5 minutes every morning".
    
    Return the suggestions as a JSON array of strings. For example:
    ["Drink a glass of water after waking up", "Take a 10-minute walk during lunch", "Read a book for 15 minutes before bed"]
  `;

  const suggestions = await runAIQuery(prompt);
  return suggestions;
}

import { createClient } from '@/lib/supabase/server';

export type GamificationAction = 'journal_entry' | 'assignment_complete' | 'login';

const XP_RATES: Record<GamificationAction, number> = {
  journal_entry: 20,
  assignment_complete: 50,
  login: 5,
};

export async function awardXP(userId: string, action: GamificationAction) {
  const supabase = await createClient();
  const xpAmount = XP_RATES[action];

  if (!xpAmount) return;

  // 1. Get current profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('xp, level, current_streak, last_activity_date')
    .eq('auth_id', userId) // Assuming auth_id is used for lookup
    .single();

  if (!profile) return;

  let newXP = (profile.xp || 0) + xpAmount;
  let newLevel = Math.floor(Math.sqrt(newXP / 100)) + 1; // Simple sqrt curve: 100xp=lvl2, 400xp=lvl3

  // Streak Logic
  const today = new Date().toISOString().split('T')[0];
  let newStreak = profile.current_streak;

  if (profile.last_activity_date !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (profile.last_activity_date === yesterdayStr) {
      newStreak += 1;
    } else {
      newStreak = 1; // Reset if missed a day
    }
  }

  // 2. Update Profile
  await supabase
    .from('profiles')
    .update({
      xp: newXP,
      level: newLevel,
      current_streak: newStreak,
      last_activity_date: today
    })
    .eq('auth_id', userId);

  // 3. Check for Achievements (Simple check for now)
  if (newStreak === 7) {
    await unlockAchievement(supabase, userId, 'streak_7');
  }
}

async function unlockAchievement(supabase: any, userId: string, key: string) {
  const { data: achievement } = await supabase.from('achievements').select('id').eq('key', key).single();
  if (achievement) {
    await supabase.from('user_achievements').insert({
      user_id: userId,
      achievement_id: achievement.id
    }).ignore(); // Ignore if already exists
  }
}

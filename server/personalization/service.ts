// Service for handling onboarding and personalization logic
import { db } from '@/lib/db';
import { OnboardingQuestion, UserOnboardingAnswer } from '@/types/personalization';

export async function getOnboardingQuestions(): Promise<OnboardingQuestion[]> {
  try {
    const { rows } = await db.query(
      `SELECT * FROM onboarding_questions 
       WHERE is_active = true 
       ORDER BY display_order ASC`
    );

    // Map to camelCase
    return rows.map((q: any) => ({
      id: q.id,
      questionKey: q.question_key,
      questionText: q.question_text,
      type: q.type,
      options: q.options,
      displayOrder: q.display_order,
      category: q.category,
    }));
  } catch (error) {
    console.error('Error fetching onboarding questions', error);
    return [];
  }
}

export async function submitOnboardingAnswers(
  profileId: string,
  answers: { questionId: string; value: any }[]
): Promise<boolean> {
  if (!answers.length) return true;

  try {
    // Basic implementation using loop for simplicity with PG,
    // or we could construct a bulk INSERT ... ON CONFLICT statement.
    // For onboarding data (small scale), loop with Promise.all is acceptable or a transaction.

    // Better: Transaction
    // Need access to pool to get client for transaction.
    // Assuming db exposes pool or we can just run queries sequentially.
    // db.query is a wrapper around pool.query.

    // Since db.ts doesn't export pool directly in the wrapper shown earlier (it exports 'query'),
    // we will run sequential queries. If one fails, it might be partial state, which is acceptable for MVP
    // or we should update db.ts to expose transaction helper.

    const queryText = `
        INSERT INTO user_onboarding_answers (profile_id, question_id, answer_data, updated_at)
        VALUES ($1, $2, $3, NOW())
        ON CONFLICT (profile_id, question_id) 
        DO UPDATE SET answer_data = EXCLUDED.answer_data, updated_at = NOW()
      `;

    for (const answer of answers) {
      await db.query(queryText, [
        profileId,
        answer.questionId,
        { value: answer.value }, // Standardize value wrapper
      ]);
    }

    return true;
  } catch (error) {
    console.error('Error submitting onboarding answers', error);
    throw new Error('Failed to save answers');
  }
}

export async function getUserPersonalization(profileId: string) {
  try {
    const { rows } = await db.query(`SELECT personalization_data FROM profiles WHERE id = $1`, [
      profileId,
    ]);

    if (rows.length === 0) return null;
    return rows[0]!.personalization_data;
  } catch (error) {
    console.error('Error fetching personalization', error);
    return null;
  }
}

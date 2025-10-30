'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { getProfileSummary, getPersonalizedAdvice, ProfileSummary } from '@/firebase/personalizationEngine';

export default function PersonalBlock() {
  const { user, loading: authLoading } = useAuth();
  const [summary, setSummary] = useState<ProfileSummary | null>(null);
  const [question, setQuestion] = useState('');
  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setLoading(true);
      getProfileSummary(user.uid)
        .then(setSummary)
        .finally(() => setLoading(false));
    }
  }, [user]);

  const handleAsk = async () => {
    if (!user || !question) return;
    setLoading(true);
    setAdvice('');
    const result = await getPersonalizedAdvice(user.uid, question);
    setAdvice(result || 'Sorry, I could not fetch advice at this time.');
    setLoading(false);
  };

  if (authLoading) {
    return <div className="p-4 bg-gray-100 rounded-lg animate-pulse">Loading your profile...</div>;
  }

  if (!summary) {
    return <div className="p-4 bg-yellow-100 text-yellow-800 rounded-lg">Please complete onboarding to get personalized advice.</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md space-y-4">
      <h3 className="text-xl font-bold text-gray-800">For You</h3>
      <div className="text-sm text-gray-600">
        <p><span className="font-semibold">Role:</span> {summary.role}</p>
        <p><span className="font-semibold">Main Goal:</span> {summary.mainGoals[0] || 'Not set'}</p>
        <p><span className="font-semibold">Tone:</span> {summary.tone}</p>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="guidance" className="block text-sm font-medium text-gray-700">Ask for guidance:</label>
        <input
          id="guidance"
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g., What's a good 5-minute stretch?"
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <button onClick={handleAsk} disabled={loading} className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-400">
          {loading ? 'Thinking...' : 'Get Advice'}
        </button>
      </div>

      {advice && (
        <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
          <h4 className="font-semibold text-gray-800">Personalized Advice:</h4>
          <p className="text-gray-700 whitespace-pre-wrap">{advice}</p>
        </div>
      )}
    </div>
  );
}

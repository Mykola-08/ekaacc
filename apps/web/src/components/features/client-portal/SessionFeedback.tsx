import { useState } from 'react';
import { ArrowLeft, Star, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface SessionFeedbackProps {
  userId: string;
  onBack: () => void;
  sessionType: string;
  practitioner: string;
}

export function SessionFeedback({ userId, onBack, sessionType, practitioner }: SessionFeedbackProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const tags = [
    'Relaxing',
    'Insightful',
    'Transformative',
    'Professional',
    'Comfortable',
    'Effective',
    'Grounding',
    'Healing'
  ];

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error('Please add a rating');
      return;
    }
    toast.success('Thank you for your feedback!');
    setTimeout(() => onBack(), 1000);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10">
        <div className="p-6 flex items-center gap-4 max-w-md mx-auto">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-gray-900">Session Feedback</h2>
            <p className="text-sm text-gray-500">How was your experience?</p>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-6 space-y-6">
        {/* Session Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-5 bg-white rounded-2xl">
            <p className="text-sm text-gray-500 mb-1">Session Completed</p>
            <p className="text-gray-900">{sessionType}</p>
            <p className="text-sm text-gray-500">with {practitioner}</p>
          </div>
        </motion.div>

        {/* Rating */}
        <div className="p-7 bg-white rounded-2xl text-center">
          <h3 className="text-gray-900 mb-5">Rate Your Session</h3>
          <div className="flex justify-center gap-2 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                <Star
                  className={`w-10 h-10 transition-colors ${
                    star <= (hoveredRating || rating)
                      ? 'fill-gray-900 text-gray-900'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-gray-500"
            >
              {rating === 5 && 'Amazing!'}
              {rating === 4 && 'Great!'}
              {rating === 3 && 'Good'}
              {rating === 2 && 'Fair'}
              {rating === 1 && 'Needs Improvement'}
            </motion.p>
          )}
        </div>

        {/* Quick Tags */}
        <div>
          <h3 className="text-gray-900 mb-3">How would you describe it?</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-4 py-2.5 rounded-full text-sm transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-700'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Written Feedback */}
        <div>
          <h3 className="text-gray-900 mb-3">Additional Comments (Optional)</h3>
          <Textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Share more about your experience..."
            className="min-h-32 resize-none border-0 bg-white rounded-2xl"
          />
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={rating === 0}
          className="w-full bg-gray-900 hover:bg-gray-800 text-white disabled:opacity-50 border-0 py-6 rounded-2xl"
        >
          <Send className="w-4 h-4 mr-2" />
          Submit Feedback
        </Button>
      </div>
    </div>
  );
}



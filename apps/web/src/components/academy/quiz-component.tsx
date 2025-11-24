'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle } from 'lucide-react';

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number; // Index of the correct option
}

interface QuizData {
  questions: Question[];
  passingScore: number; // Percentage
}

interface QuizComponentProps {
  data: QuizData;
  onComplete: (score: number, passed: boolean) => void;
}

export function QuizComponent({ data, onComplete }: QuizComponentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = data.questions[currentQuestionIndex];

  const handleOptionSelect = (optionIndex: number) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: optionIndex,
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < data.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateResults();
    }
  };

  const calculateResults = () => {
    let correctCount = 0;
    data.questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const finalScore = (correctCount / data.questions.length) * 100;
    setScore(finalScore);
    setShowResults(true);
    onComplete(finalScore, finalScore >= data.passingScore);
  };

  const handleRetry = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setShowResults(false);
    setScore(0);
  };

  if (showResults) {
    const passed = score >= data.passingScore;
    return (
      <div className="text-center space-y-6 py-8">
        <div className="flex justify-center">
          {passed ? (
            <CheckCircle className="w-16 h-16 text-green-500" />
          ) : (
            <XCircle className="w-16 h-16 text-red-500" />
          )}
        </div>
        <div>
          <h3 className="text-2xl font-bold">{passed ? 'Quiz Passed!' : 'Quiz Failed'}</h3>
          <p className="text-muted-foreground mt-2">
            You scored {score.toFixed(0)}%. Passing score is {data.passingScore}%.
          </p>
        </div>
        <div className="flex justify-center gap-4">
          {!passed && (
            <Button onClick={handleRetry} variant="outline">
              Retry Quiz
            </Button>
          )}
          {passed && (
             <p className="text-green-600 font-medium">Great job! You can now proceed.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 flex justify-between text-sm text-muted-foreground">
        <span>Question {currentQuestionIndex + 1} of {data.questions.length}</span>
        <span>Progress: {Math.round(((currentQuestionIndex) / data.questions.length) * 100)}%</span>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{currentQuestion.text}</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={answers[currentQuestion.id]?.toString()}
            onValueChange={(val) => handleOptionSelect(parseInt(val))}
            className="space-y-3"
          >
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 border p-3 rounded-md hover:bg-accent cursor-pointer">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-grow cursor-pointer font-normal">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button 
            onClick={handleNext} 
            disabled={answers[currentQuestion.id] === undefined}
          >
            {currentQuestionIndex === data.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

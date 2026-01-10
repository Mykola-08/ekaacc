'use client';

import { useEffect, useState, use } from 'react';
import { academyService } from '@/services/academy-service';
import { Lesson } from '@/types/platform/academy';
import { Button } from '@/components/platform/ui/button';
import { Input } from '@/components/platform/ui/input';
import { Textarea } from '@/components/platform/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/platform/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/platform/ui/card';
import { Label } from '@/components/platform/ui/label';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, GripVertical } from 'lucide-react';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
}

export default function EditLessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = use(params);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  // Form State
  const [title, setTitle] = useState('');
  const [contentType, setContentType] = useState<'video' | 'article' | 'quiz' | 'assignment' | 'exercise'>('article');
  const [isPublished, setIsPublished] = useState(false);
  
  // Content State
  const [articleContent, setArticleContent] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const data = await academyService.getLesson(lessonId);
        setTitle(data.title);
        setContentType(data.content_type);
        setIsPublished(data.is_published);
        
        // Parse Content
        const content = data.content || {};
        if (data.content_type === 'article') {
          setArticleContent(content.article_text || '');
        } else if (data.content_type === 'video') {
          setVideoUrl(content.video_url || '');
        } else if (data.content_type === 'quiz') {
          setQuizQuestions(content.questions || []);
        }
      } catch (error) {
        console.error('Failed to fetch lesson:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [lessonId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Construct content JSON based on type
      let contentJson: any = {};
      
      if (contentType === 'article') {
        contentJson = { article_text: articleContent };
      } else if (contentType === 'video') {
        contentJson = { video_url: videoUrl };
      } else if (contentType === 'quiz') {
        contentJson = { questions: quizQuestions };
      }

      await academyService.updateLesson(lessonId, {
        title,
        content_type: contentType,
        content: contentJson,
        is_published: isPublished
      });
      router.back();
    } catch (error) {
      console.error('Failed to save lesson:', error);
    } finally {
      setSaving(false);
    }
  };

  const addQuestion = () => {
    setQuizQuestions([
      ...quizQuestions,
      {
        id: crypto.randomUUID(),
        question: '',
        options: ['', '', '', ''],
        correct_answer: 0
      }
    ]);
  };

  const updateQuestion = (index: number, field: keyof QuizQuestion, value: any) => {
    const newQuestions = [...quizQuestions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setQuizQuestions(newQuestions);
  };

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const newQuestions = [...quizQuestions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuizQuestions(newQuestions);
  };

  const removeQuestion = (index: number) => {
    setQuizQuestions(quizQuestions.filter((_, i) => i !== index));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Edit Lesson</h1>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="space-y-6 pt-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Lesson Title</Label>
              <Input 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="Enter lesson title"
              />
            </div>

            <div className="space-y-2">
              <Label>Content Type</Label>
              <Select 
                value={contentType} 
                onValueChange={(val: any) => setContentType(val)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="article">Article / Text</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="quiz">Quiz</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* VIDEO EDITOR */}
          {contentType === 'video' && (
            <div className="space-y-4 border p-4 rounded-lg bg-muted/20">
              <div className="space-y-2">
                <Label>Video URL</Label>
                <Input 
                  value={videoUrl} 
                  onChange={(e) => setVideoUrl(e.target.value)} 
                  placeholder="https://youtube.com/..."
                />
                <p className="text-sm text-muted-foreground">
                  Paste a link to a video from YouTube, Vimeo, or your hosting provider.
                </p>
              </div>
              {videoUrl && (
                <div className="aspect-video bg-black rounded-lg flex items-center justify-center text-white">
                  Video Preview Placeholder
                </div>
              )}
            </div>
          )}

          {/* ARTICLE EDITOR */}
          {contentType === 'article' && (
            <div className="space-y-2">
              <Label>Content (Markdown Supported)</Label>
              <Textarea 
                value={articleContent} 
                onChange={(e) => setArticleContent(e.target.value)} 
                rows={15}
                className="font-mono text-sm"
                placeholder="# Introduction\n\nWrite your lesson content here..."
              />
            </div>
          )}

          {/* QUIZ EDITOR */}
          {contentType === 'quiz' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <Label className="text-lg">Quiz Questions</Label>
                <Button onClick={addQuestion} size="sm" variant="secondary">
                  <Plus className="w-4 h-4 mr-2" /> Add Question
                </Button>
              </div>

              {quizQuestions.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed rounded-lg text-muted-foreground">
                  No questions added yet. Click "Add Question" to start.
                </div>
              )}

              <div className="space-y-6">
                {quizQuestions.map((q, qIndex) => (
                  <Card key={q.id} className="relative">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2 text-destructive hover:text-destructive"
                      onClick={() => removeQuestion(qIndex)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <CardContent className="pt-6 space-y-4">
                      <div className="space-y-2">
                        <Label>Question {qIndex + 1}</Label>
                        <Input 
                          value={q.question}
                          onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                          placeholder="Enter your question here"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Options</Label>
                        <div className="grid gap-2">
                          {q.options.map((opt, oIndex) => (
                            <div key={oIndex} className="flex items-center gap-2">
                              <input 
                                type="radio" 
                                name={`correct-${q.id}`}
                                checked={q.correct_answer === oIndex}
                                onChange={() => updateQuestion(qIndex, 'correct_answer', oIndex)}
                                className="w-4 h-4"
                              />
                              <Input 
                                value={opt}
                                onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                placeholder={`Option ${oIndex + 1}`}
                                className={q.correct_answer === oIndex ? "border-green-500 ring-1 ring-green-500" : ""}
                              />
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">Select the radio button next to the correct answer.</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex items-center space-x-2 pt-4 border-t">
             <input 
               type="checkbox" 
               id="published"
               checked={isPublished}
               onChange={(e) => setIsPublished(e.target.checked)}
               className="h-4 w-4 rounded border-gray-300"
             />
             <Label htmlFor="published">Publish this lesson</Label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

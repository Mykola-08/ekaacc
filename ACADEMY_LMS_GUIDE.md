# Academy LMS Implementation Guide

## Overview

The Academy LMS is a comprehensive learning management system integrated into the EKA Account platform, designed to deliver mental health education, professional development for therapists, and wellness courses for users.

## Features

### Core LMS Features

1. **Course Management**
   - Create and organize courses with modules and lessons
   - Support for multiple content types (video, articles, quizzes, assignments)
   - Course categories and difficulty levels
   - Instructor-led and self-paced courses

2. **Progress Tracking**
   - Real-time progress monitoring
   - Lesson completion tracking
   - Quiz scores and assessment results
   - Time spent analytics

3. **Certifications**
   - Automatic certificate generation upon course completion
   - Verification codes for authenticity
   - Digital certificate downloads
   - Transcript generation

4. **Interactive Content**
   - Video lessons with playback tracking
   - Rich text articles
   - Interactive quizzes
   - Discussion forums
   - Assignments with file uploads

5. **Gamification**
   - Achievement badges
   - Progress milestones
   - Leaderboards
   - Completion streaks

### AI-Powered Features

1. **Learning Path Generator** (Feature Flag: `ai_learning_paths`)
   - Analyzes user interests, skill level, and goals
   - Recommends personalized course sequences
   - Adapts based on progress and performance
   - Considers learning style preferences

2. **Content Recommender** (Feature Flag: `ai_content_recommendations`)
   - Suggests relevant lessons based on current progress
   - Identifies knowledge gaps
   - Recommends supplementary materials
   - Cross-references with journal entries and mood data

3. **Progress Predictor** (Feature Flag: `ai_progress_prediction`)
   - Forecasts course completion dates
   - Estimates time required for lessons
   - Identifies potential dropout risks
   - Suggests optimal study schedules

4. **Skill Gap Analyzer** (Feature Flag: `ai_skill_gap_analysis`)
   - Identifies areas needing improvement
   - Compares performance across topics
   - Recommends targeted practice
   - Tracks skill development over time

## Architecture

### Directory Structure

```
apps/academy/
├── src/
│   ├── app/                  # Next.js 15 app directory
│   │   ├── (dashboard)/      # Dashboard layouts
│   │   │   ├── courses/      # Course catalog
│   │   │   ├── my-learning/  # User's enrolled courses
│   │   │   ├── instructors/  # Instructor management
│   │   │   └── analytics/    # Learning analytics
│   │   ├── course/
│   │   │   └── [id]/         # Course detail and player
│   │   ├── lesson/
│   │   │   └── [id]/         # Lesson player
│   │   └── api/              # API routes
│   ├── components/
│   │   ├── course/           # Course components
│   │   ├── lesson/           # Lesson components
│   │   ├── quiz/             # Quiz components
│   │   └── player/           # Video player
│   ├── lib/
│   │   ├── academy/          # Academy utilities
│   │   ├── ai/               # AI integrations
│   │   └── analytics/        # Analytics
│   ├── services/
│   │   ├── course-service.ts
│   │   ├── enrollment-service.ts
│   │   ├── progress-service.ts
│   │   └── certificate-service.ts
│   └── types/
│       ├── course.ts
│       ├── lesson.ts
│       └── enrollment.ts
├── public/
│   └── certificates/         # Certificate templates
└── package.json
```

### Database Schema

See `DATABASE_CHANGES_ACADEMY.md` for complete migration scripts.

**Key Tables**:
- `academy_courses` - Course metadata
- `academy_modules` - Course modules/chapters
- `academy_lessons` - Individual lessons
- `academy_enrollments` - User enrollments
- `academy_lesson_progress` - Lesson completion tracking
- `academy_certificates` - Issued certificates
- `academy_learning_paths` - AI-generated recommendations

## Implementation

### 1. Course Creation

```typescript
import { courseService } from '@/services/course-service';

// Create a new course
const course = await courseService.create({
  title: 'Introduction to Mindfulness',
  description: 'Learn the basics of mindfulness meditation',
  category: 'mental-health',
  difficulty: 'beginner',
  estimatedHours: 4,
  instructorId: userId,
  modules: [
    {
      title: 'Module 1: Understanding Mindfulness',
      lessons: [
        {
          title: 'What is Mindfulness?',
          contentType: 'video',
          content: {
            videoUrl: 'https://...',
            duration: 15
          },
          durationMinutes: 15
        },
        {
          title: 'Benefits of Mindfulness',
          contentType: 'article',
          content: {
            text: '...',
            readingTime: 10
          },
          durationMinutes: 10
        },
        {
          title: 'Quiz: Mindfulness Basics',
          contentType: 'quiz',
          content: {
            questions: [
              {
                question: 'What is mindfulness?',
                options: ['A', 'B', 'C', 'D'],
                correctAnswer: 0
              }
            ]
          },
          durationMinutes: 5
        }
      ]
    }
  ]
});
```

### 2. User Enrollment

```typescript
import { enrollmentService } from '@/services/enrollment-service';

// Enroll user in course
const enrollment = await enrollmentService.enroll(userId, courseId);

// Track progress
await enrollmentService.updateProgress(userId, lessonId, {
  status: 'completed',
  timeSpentSeconds: 900,
  quizScore: 85
});

// Check completion
const isComplete = await enrollmentService.isComplete(userId, courseId);
if (isComplete) {
  const certificate = await enrollmentService.issueCertificate(userId, courseId);
}
```

### 3. AI Learning Paths

```typescript
import { learningPathGenerator } from '@ekaacc/ai-services';

// Generate personalized learning path
const path = await learningPathGenerator.generatePath(userId, supabase);
// Returns: {
//   recommendedCourses: [courseId1, courseId2, courseId3],
//   reasoning: 'Based on your interest in anxiety management...',
//   confidenceScore: 0.85
// }

// Get course recommendations for current lesson
const recommendations = await learningPathGenerator.getNextRecommendations(
  userId,
  currentLessonId,
  supabase
);
```

### 4. Progress Prediction

```typescript
import { progressPredictor } from '@ekaacc/ai-services';

// Predict completion date
const prediction = await progressPredictor.predictCompletion(
  userId,
  courseId,
  supabase
);
// Returns: {
//   estimatedCompletionDate: '2024-02-15',
//   confidence: 0.78,
//   remainingHours: 12,
//   weeklyPace: 3.5
// }

// Get optimal study schedule
const schedule = await progressPredictor.suggestSchedule(userId, courseId);
// Returns: {
//   sessionsPerWeek: 3,
//   minutesPerSession: 45,
//   preferredDays: ['Monday', 'Wednesday', 'Friday'],
//   preferredTime: '19:00'
// }
```

## Feature Flags

All Academy features are controlled by feature flags:

```typescript
// Feature flag configuration
const academyFeatures = {
  academy_lms: {
    status: 'beta',
    enabled: true,
    minRole: 'Patient'
  },
  ai_learning_paths: {
    status: 'beta',
    enabled: false, // Gradual rollout
    minRole: 'Patient'
  },
  ai_content_recommendations: {
    status: 'alpha',
    enabled: false,
    minRole: 'Patient'
  },
  ai_progress_prediction: {
    status: 'beta',
    enabled: true,
    minRole: 'Patient'
  }
};

// Check if feature is enabled
import { featureService } from '@/services/feature-service';

const canAccessAcademy = await featureService.isEnabled(
  'academy_lms',
  userId
);

const hasAIRecommendations = await featureService.isEnabled(
  'ai_content_recommendations',
  userId
);
```

## Design Consistency

### UI Components

All Academy components use the shared design system:

```typescript
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

// Course card with consistent styling
<Card className="hover:shadow-lg transition-shadow">
  <CardHeader>
    <CardTitle>{course.title}</CardTitle>
    <CardDescription>{course.description}</CardDescription>
  </CardHeader>
  <CardContent>
    <Progress value={course.progressPercentage} />
    <Badge variant={course.difficulty}>
      {course.difficulty}
    </Badge>
  </CardContent>
  <CardFooter>
    <Button>Continue Learning</Button>
  </CardFooter>
</Card>
```

### Styling Guidelines

- Use Tailwind CSS classes from shared configuration
- Follow mobile-first responsive design
- Maintain consistent spacing (4px grid)
- Use semantic color tokens
- Ensure WCAG 2.1 AA compliance

### Navigation

Academy follows the same navigation pattern as other apps:

```typescript
// Main navigation
const academyNav = [
  { href: '/academy', label: 'Courses', icon: BookOpen },
  { href: '/academy/my-learning', label: 'My Learning', icon: GraduationCap },
  { href: '/academy/certificates', label: 'Certificates', icon: Award },
  { href: '/academy/progress', label: 'Progress', icon: TrendingUp },
];
```

## API Reference

### Course Service

```typescript
class CourseService {
  async create(data: CreateCourseDTO): Promise<Course>;
  async update(id: string, data: UpdateCourseDTO): Promise<Course>;
  async delete(id: string): Promise<void>;
  async getById(id: string): Promise<Course>;
  async list(filters?: CourseFilters): Promise<Course[]>;
  async publish(id: string): Promise<Course>;
  async unpublish(id: string): Promise<Course>;
}
```

### Enrollment Service

```typescript
class EnrollmentService {
  async enroll(userId: string, courseId: string): Promise<Enrollment>;
  async unenroll(userId: string, courseId: string): Promise<void>;
  async getEnrollments(userId: string): Promise<Enrollment[]>;
  async updateProgress(userId: string, lessonId: string, data: ProgressData): Promise<void>;
  async isComplete(userId: string, courseId: string): Promise<boolean>;
  async issueCertificate(userId: string, courseId: string): Promise<Certificate>;
}
```

### Progress Service

```typescript
class ProgressService {
  async getLessonProgress(userId: string, lessonId: string): Promise<LessonProgress>;
  async getCourseProgress(userId: string, courseId: string): Promise<CourseProgress>;
  async getOverallProgress(userId: string): Promise<OverallProgress>;
  async trackTime(userId: string, lessonId: string, seconds: number): Promise<void>;
  async completeLesson(userId: string, lessonId: string): Promise<void>;
}
```

## Integration with Existing Features

### Mood Tracking Integration

Recommend courses based on mood patterns:

```typescript
import { moodPredictor } from '@ekaacc/ai-services';

const mood = await moodPredictor.getCurrentMood(userId, supabase);
if (mood.moodLevel < 4) {
  // Recommend stress management courses
  const courses = await courseService.findByCategory('stress-management');
}
```

### Journal Integration

Analyze journal entries to suggest relevant courses:

```typescript
import { journalAnalyzer } from '@ekaacc/ai-services';

const trends = await journalAnalyzer.analyzeTrends(userId, supabase, 30);
if (trends.topThemes.includes('anxiety')) {
  // Recommend anxiety-related courses
  const courses = await courseService.findByTags(['anxiety', 'coping']);
}
```

### Therapy Integration

Track course completion as therapy goals:

```typescript
// Create goal for course completion
await goalService.create({
  userId,
  title: `Complete "${course.title}" course`,
  category: 'education',
  targetDate: addMonths(new Date(), 2),
  metadata: {
    courseId: course.id,
    type: 'academy_completion'
  }
});
```

## Performance Considerations

### Caching Strategy

```typescript
// Cache course catalog (15 minutes)
const courses = await cache.wrap(
  'academy:courses:catalog',
  () => courseService.list(),
  900
);

// Cache user enrollments (5 minutes)
const enrollments = await cache.wrap(
  `academy:enrollments:${userId}`,
  () => enrollmentService.getEnrollments(userId),
  300
);
```

### Video Optimization

- Use adaptive bitrate streaming (HLS/DASH)
- Implement lazy loading for video players
- Preload next lesson in sequence
- Cache video metadata
- Optimize thumbnail generation

### Database Optimization

Already implemented:
- Indexes on frequently queried columns
- Partial indexes for active enrollments
- Materialized views for analytics
- Connection pooling

## Security

### Access Control

```typescript
// RLS policies on academy tables
CREATE POLICY "Users can view published courses"
  ON academy_courses FOR SELECT
  USING (is_published = true);

CREATE POLICY "Users can only view their own enrollments"
  ON academy_enrollments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Instructors can manage their courses"
  ON academy_courses FOR ALL
  USING (auth.uid() = instructor_id);
```

### Content Security

- Sanitize user-generated content
- Validate file uploads (type, size)
- Use signed URLs for video streaming
- Implement CORS for CDN resources
- Rate limit API endpoints

## Analytics

Track key metrics:

```typescript
const analytics = {
  // Engagement metrics
  courseViews: 'academy_course_views',
  lessonCompletions: 'academy_lesson_completions',
  quizAttempts: 'academy_quiz_attempts',
  certificatesIssued: 'academy_certificates_issued',
  
  // Performance metrics
  avgCompletionTime: 'academy_avg_completion_time',
  completionRate: 'academy_completion_rate',
  dropoutRate: 'academy_dropout_rate',
  avgQuizScore: 'academy_avg_quiz_score',
  
  // User metrics
  activeUsers: 'academy_active_users',
  newEnrollments: 'academy_new_enrollments',
  retentionRate: 'academy_retention_rate'
};
```

## Testing

### Unit Tests

```typescript
describe('EnrollmentService', () => {
  it('should enroll user in course', async () => {
    const enrollment = await enrollmentService.enroll(userId, courseId);
    expect(enrollment).toBeDefined();
    expect(enrollment.userId).toBe(userId);
    expect(enrollment.courseId).toBe(courseId);
  });

  it('should track lesson progress', async () => {
    await enrollmentService.updateProgress(userId, lessonId, {
      status: 'completed',
      timeSpentSeconds: 600
    });
    const progress = await progressService.getLessonProgress(userId, lessonId);
    expect(progress.status).toBe('completed');
  });
});
```

### Integration Tests

```typescript
describe('Learning Path Generator', () => {
  it('should generate personalized path', async () => {
    const path = await learningPathGenerator.generatePath(userId, supabase);
    expect(path.recommendedCourses).toHaveLength(5);
    expect(path.confidenceScore).toBeGreaterThan(0.5);
  });
});
```

## Deployment

### Environment Variables

```bash
# Academy LMS
NEXT_PUBLIC_ACADEMY_ENABLED=true
ACADEMY_VIDEO_CDN_URL=https://cdn.example.com
ACADEMY_CERTIFICATE_TEMPLATE_URL=https://...
ACADEMY_MAX_UPLOAD_SIZE_MB=100

# AI Features
NEXT_PUBLIC_AI_LEARNING_PATHS_ENABLED=false
NEXT_PUBLIC_AI_CONTENT_RECOMMENDATIONS_ENABLED=false
NEXT_PUBLIC_AI_PROGRESS_PREDICTION_ENABLED=true
```

### Migration Steps

1. Run database migrations:
   ```bash
   npm run migration:run -- academy-schema
   ```

2. Seed initial courses (optional):
   ```bash
   npm run seed:academy
   ```

3. Enable feature flags:
   ```sql
   UPDATE features 
   SET is_enabled = true 
   WHERE key = 'academy_lms';
   ```

4. Deploy Academy app:
   ```bash
   cd apps/academy
   npm run build
   npm run deploy
   ```

## Monitoring

### Health Checks

```typescript
// API health endpoint
app.get('/api/academy/health', async (req, res) => {
  const health = {
    database: await checkDatabaseConnection(),
    videoStreaming: await checkCDNAvailability(),
    aiServices: await checkAIServicesAvailability(),
    featureFlags: await checkFeatureFlagsAvailability()
  };
  res.json(health);
});
```

### Error Tracking

- Log enrollment failures
- Track video playback errors
- Monitor quiz submission issues
- Alert on certificate generation failures

## Future Enhancements

### Planned Features

1. **Live Classes** - Real-time video sessions with instructors
2. **Peer Learning** - Study groups and collaboration tools
3. **Mobile App** - Native iOS/Android apps
4. **Offline Mode** - Download courses for offline viewing
5. **AR/VR Integration** - Immersive learning experiences
6. **Advanced Analytics** - Learning analytics dashboard
7. **Integration Marketplace** - Third-party content providers
8. **Blockchain Certificates** - Verifiable credentials on blockchain

### Roadmap

- Q1 2024: Beta launch with core features
- Q2 2024: AI-powered recommendations
- Q3 2024: Live classes and peer learning
- Q4 2024: Mobile apps and offline mode

## Support

### Documentation

- [API Reference](./ACADEMY_API_REFERENCE.md)
- [Database Schema](./DATABASE_CHANGES_ACADEMY.md)
- [Component Library](./COMPONENT_LIBRARY.md)
- [Design System](./DESIGN_SYSTEM.md)

### Contact

- Technical Support: dev@ekaacc.com
- Feature Requests: features@ekaacc.com
- Bug Reports: bugs@ekaacc.com

## Conclusion

The Academy LMS provides a comprehensive learning platform that integrates seamlessly with the existing EKA Account ecosystem. With AI-powered features, consistent design, and robust architecture, it enhances the mental health and wellness journey for users while providing valuable educational resources.

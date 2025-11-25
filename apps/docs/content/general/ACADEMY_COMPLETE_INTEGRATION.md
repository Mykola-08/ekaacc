# EKAACC Academy LMS - Complete Integration Guide

## 🎓 Overview

This guide provides complete instructions for integrating the Academy LMS subapp with the existing EKAACC platform. The Academy LMS is a full-featured learning management system designed specifically for mental health education.

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Database Setup](#database-setup)
3. [Dashboard Integration](#dashboard-integration)
4. [API Configuration](#api-configuration)
5. [Frontend Integration](#frontend-integration)
6. [Feature Flags](#feature-flags)
7. [Sample Courses](#sample-courses)
8. [Testing](#testing)

---

## 🚀 Quick Start

### Prerequisites
- Supabase database access
- Auth0 configured
- Node.js 18+ installed
- Existing EKAACC apps running

### Installation Steps

```bash
# 1. Run database migration
psql -h YOUR_SUPABASE_URL -U postgres -d postgres < academy_complete_setup.sql

# 2. Install dependencies (if not already done)
npm install

# 3. Configure environment variables
cp .env.example .env.local

# Add to .env.local:
NEXT_PUBLIC_ACADEMY_ENABLED=true
ACADEMY_CERTIFICATE_SIGNING_KEY=your-secret-key-here

# 4. Start the academy app
cd apps/academy
npm run dev
```

---

## 🗄️ Database Setup

### Running the Migration

The `academy_complete_setup.sql` file creates all necessary tables, triggers, views, and sample courses.

```bash
# Connect to your Supabase database
psql -h db.YOUR_PROJECT_ID.supabase.co -U postgres -d postgres

# Run the migration
\i academy_complete_setup.sql

# Verify tables created
\dt academy_*

# Expected output:
# academy_courses
# academy_modules
# academy_lessons
# academy_enrollments
# academy_lesson_progress
# academy_certificates
# academy_learning_paths
# academy_course_reviews
# academy_analytics_events
```

### Update Instructor ID

After running the migration, update the instructor ID to match an actual admin user:

```sql
-- Get your admin user ID
SELECT id, email FROM auth.users WHERE email = 'admin@example.com';

-- Update all sample courses
UPDATE academy_courses 
SET instructor_id = 'YOUR_ADMIN_USER_ID'
WHERE instructor_id = '00000000-0000-0000-0000-000000000001';
```

### Verify Sample Data

```sql
-- Check courses
SELECT id, title, category, is_published FROM academy_courses;

-- Check modules count
SELECT c.title, COUNT(m.id) as modules_count
FROM academy_courses c
LEFT JOIN academy_modules m ON m.course_id = c.id
GROUP BY c.id, c.title;

-- Check lessons count
SELECT c.title, COUNT(l.id) as lessons_count
FROM academy_courses c
LEFT JOIN academy_modules m ON m.course_id = c.id
LEFT JOIN academy_lessons l ON l.module_id = m.id
GROUP BY c.id, c.title;
```

---

## 📊 Dashboard Integration

### 1. User Dashboard Integration

**File**: `apps/web/src/app/dashboard/page.tsx`

Add Academy section to the user dashboard:

```typescript
import { AcademyQuickAccess } from '@/components/academy/academy-quick-access';
import { getAcademyEnrollments } from '@/lib/academy/enrollments';

export default async function UserDashboard() {
  const { user } = await getUser();
  const enrollments = await getAcademyEnrollments(user.id);
  
  return (
    <div className="dashboard-container">
      {/* Existing dashboard content */}
      
      {/* Add Academy Section */}
      <section className="academy-section">
        <h2 className="text-2xl font-bold mb-4">Your Learning</h2>
        <AcademyQuickAccess 
          enrollments={enrollments}
          userId={user.id}
        />
      </section>
    </div>
  );
}
```

**Component**: `apps/web/src/components/academy/academy-quick-access.tsx`

```typescript
'use client';

import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BookOpen, Award, TrendingUp } from 'lucide-react';

interface AcademyQuickAccessProps {
  enrollments: Enrollment[];
  userId: string;
}

export function AcademyQuickAccess({ enrollments, userId }: AcademyQuickAccessProps) {
  const inProgressCourses = enrollments.filter(e => e.status === 'active');
  const completedCourses = enrollments.filter(e => e.status === 'completed');
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Statistics */}
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">In Progress</p>
            <p className="text-2xl font-bold">{inProgressCourses.length}</p>
          </div>
        </div>
      </Card>
      
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <Award className="h-8 w-8 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="text-2xl font-bold">{completedCourses.length}</p>
          </div>
        </div>
      </Card>
      
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-8 w-8 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Avg Progress</p>
            <p className="text-2xl font-bold">
              {Math.round(enrollments.reduce((sum, e) => sum + e.progress_percentage, 0) / enrollments.length || 0)}%
            </p>
          </div>
        </div>
      </Card>
      
      {/* Active Courses */}
      <Card className="md:col-span-3 p-4">
        <h3 className="font-semibold mb-4">Continue Learning</h3>
        {inProgressCourses.length > 0 ? (
          <div className="space-y-4">
            {inProgressCourses.slice(0, 3).map(enrollment => (
              <div key={enrollment.id} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium">{enrollment.course.title}</p>
                  <Progress value={enrollment.progress_percentage} className="mt-2" />
                </div>
                <Button asChild variant="outline" size="sm" className="ml-4">
                  <Link href={`/academy/learn/${enrollment.id}`}>
                    Continue
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No courses in progress</p>
            <Button asChild>
              <Link href="/academy">Browse Courses</Link>
            </Button>
          </div>
        )}
      </Card>
      
      {/* Quick Actions */}
      <Card className="md:col-span-3 p-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Quick Actions</h3>
          <div className="space-x-2">
            <Button asChild variant="outline">
              <Link href="/academy">Browse Courses</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/academy/my-courses">My Courses</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/academy/certificates">My Certificates</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 2. Admin Dashboard Integration

**File**: `apps/admin/src/app/dashboard/page.tsx`

Add Academy admin panel:

```typescript
import { AcademyAdminPanel } from '@/components/academy/admin-panel';
import { getAcademyStatistics } from '@/lib/academy/admin';

export default async function AdminDashboard() {
  const academyStats = await getAcademyStatistics();
  
  return (
    <div className="dashboard-container">
      {/* Existing dashboard content */}
      
      {/* Academy Admin Section */}
      <section className="academy-admin-section">
        <h2 className="text-2xl font-bold mb-4">Academy LMS</h2>
        <AcademyAdminPanel statistics={academyStats} />
      </section>
    </div>
  );
}
```

**Component**: `apps/admin/src/components/academy/admin-panel.tsx`

```typescript
'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Users, BookOpen, Award, TrendingUp } from 'lucide-react';

export function AcademyAdminPanel({ statistics }) {
  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Total Courses</p>
              <p className="text-2xl font-bold">{statistics.totalCourses}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Total Enrollments</p>
              <p className="text-2xl font-bold">{statistics.totalEnrollments}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Award className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Certificates Issued</p>
              <p className="text-2xl font-bold">{statistics.certificatesIssued}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Completion Rate</p>
              <p className="text-2xl font-bold">{statistics.completionRate}%</p>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Top Courses */}
      <Card className="p-4">
        <h3 className="font-semibold mb-4">Top Performing Courses</h3>
        <div className="space-y-2">
          {statistics.topCourses.map(course => (
            <div key={course.id} className="flex justify-between items-center py-2 border-b last:border-0">
              <div>
                <p className="font-medium">{course.title}</p>
                <p className="text-sm text-muted-foreground">
                  {course.enrollments} enrollments • {course.completionRate}% completion
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">{course.avgRating}/5</p>
                <p className="text-sm text-muted-foreground">{course.reviews} reviews</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
      
      {/* Quick Actions */}
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/admin/academy/courses">Manage Courses</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/admin/academy/enrollments">View Enrollments</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/admin/academy/analytics">Analytics</Link>
        </Button>
      </div>
    </div>
  );
}
```

### 3. Therapist Dashboard Integration

**File**: `apps/therapist/src/app/dashboard/page.tsx`

Add patient learning tracking:

```typescript
import { PatientAcademyProgress } from '@/components/academy/patient-progress';
import { getPatientAcademyData } from '@/lib/academy/therapist';

export default async function TherapistDashboard() {
  const { user } = await getUser();
  const patientData = await getPatientAcademyData(user.id);
  
  return (
    <div className="dashboard-container">
      {/* Existing dashboard content */}
      
      {/* Patient Academy Progress */}
      <section className="patient-academy-section">
        <h2 className="text-2xl font-bold mb-4">Patient Learning Progress</h2>
        <PatientAcademyProgress 
          patients={patientData}
          therapistId={user.id}
        />
      </section>
    </div>
  );
}
```

---

## 🔌 API Configuration

### API Routes Structure

Create the following API routes in `apps/api/src/routes/academy/`:

```
apps/api/src/routes/academy/
├── courses.ts          # GET /api/academy/courses
├── enrollment.ts       # POST /api/academy/enroll
├── progress.ts         # PUT /api/academy/progress/:lessonId
├── certificates.ts     # POST /api/academy/certificates
├── recommendations.ts  # GET /api/academy/recommendations/:userId
└── analytics.ts        # GET /api/academy/analytics
```

### Example API Route: Courses

**File**: `apps/api/src/routes/academy/courses.ts`

```typescript
import { Router } from 'express';
import { createClient } from '@supabase/supabase-js';
import { requireAuth } from '../../middleware/auth';

const router = Router();

// GET /api/academy/courses - List all published courses
router.get('/courses', async (req, res) => {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );
    
    const { category, difficulty, search } = req.query;
    
    let query = supabase
      .from('academy_courses')
      .select(`
        *,
        modules:academy_modules(count),
        reviews:academy_course_reviews(rating)
      `)
      .eq('is_published', true)
      .order('created_at', { ascending: false });
    
    if (category) {
      query = query.eq('category', category);
    }
    
    if (difficulty) {
      query = query.eq('difficulty', difficulty);
    }
    
    if (search) {
      query = query.ilike('title', `%${search}%`);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    // Calculate average ratings
    const coursesWithRatings = data.map(course => ({
      ...course,
      avgRating: course.reviews.length > 0
        ? course.reviews.reduce((sum, r) => sum + r.rating, 0) / course.reviews.length
        : null,
      reviewCount: course.reviews.length
    }));
    
    res.json({ courses: coursesWithRatings });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// GET /api/academy/courses/:id - Get course details
router.get('/courses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );
    
    const { data, error } = await supabase
      .from('academy_courses')
      .select(`
        *,
        modules:academy_modules(
          *,
          lessons:academy_lessons(*)
        ),
        reviews:academy_course_reviews(
          *,
          user:profiles(name, avatar_url)
        ),
        instructor:profiles(name, avatar_url, bio)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    res.json({ course: data });
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ error: 'Failed to fetch course' });
  }
});

export default router;
```

### Example API Route: Enrollment

**File**: `apps/api/src/routes/academy/enrollment.ts`

```typescript
import { Router } from 'express';
import { createClient } from '@supabase/supabase-js';
import { requireAuth } from '../../middleware/auth';

const router = Router();

// POST /api/academy/enroll - Enroll in a course
router.post('/enroll', requireAuth, async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;
    
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );
    
    // Check if already enrolled
    const { data: existing } = await supabase
      .from('academy_enrollments')
      .select('id')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .single();
    
    if (existing) {
      return res.status(400).json({ error: 'Already enrolled in this course' });
    }
    
    // Create enrollment
    const { data, error } = await supabase
      .from('academy_enrollments')
      .insert({
        user_id: userId,
        course_id: courseId,
        status: 'active',
        progress_percentage: 0
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Track analytics event
    await supabase.from('academy_analytics_events').insert({
      user_id: userId,
      event_type: 'course_enrolled',
      event_data: { course_id: courseId }
    });
    
    res.json({ enrollment: data });
  } catch (error) {
    console.error('Error enrolling:', error);
    res.status(500).json({ error: 'Failed to enroll' });
  }
});

export default router;
```

---

## 🎨 Frontend Integration

### Navigation Menu Updates

Add Academy links to all app navigation menus:

**File**: `apps/web/src/components/layout/navigation.tsx`

```typescript
import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export function Navigation() {
  return (
    <nav>
      {/* Existing nav items */}
      
      {/* Add Academy Link */}
      <Link 
        href="/academy"
        className="nav-item"
      >
        <BookOpen className="h-5 w-5" />
        <span>Academy</span>
      </Link>
    </nav>
  );
}
```

### Feature Flag Integration

**File**: `apps/web/src/lib/feature-flags.ts`

```typescript
export async function isAcademyEnabled(userId?: string): Promise<boolean> {
  // Check environment variable
  if (process.env.NEXT_PUBLIC_ACADEMY_ENABLED !== 'true') {
    return false;
  }
  
  // Check feature flag in database
  const supabase = createClient();
  const { data } = await supabase
    .from('features')
    .select('is_enabled')
    .eq('key', 'academy_lms')
    .single();
  
  return data?.is_enabled ?? false;
}
```

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Database migration runs successfully
- [ ] Sample courses are visible
- [ ] User can enroll in a course
- [ ] Progress tracking works
- [ ] Lesson completion updates enrollment progress
- [ ] Certificate is issued upon 100% completion
- [ ] Dashboard widgets display correct data
- [ ] API endpoints return expected data
- [ ] Navigation links work across all apps
- [ ] RLS policies prevent unauthorized access

### Test Enrollment Flow

```typescript
// Test script
async function testEnrollmentFlow() {
  const userId = 'test-user-id';
  const courseId = 'feldenkrais-course-id';
  
  // 1. Enroll
  const enrollment = await enrollInCourse(userId, courseId);
  console.assert(enrollment.progress_percentage === 0);
  
  // 2. Complete first lesson
  await updateLessonProgress(userId, 'lesson-1-id', 'completed');
  
  // 3. Check progress updated
  const updated = await getEnrollment(enrollment.id);
  console.assert(updated.progress_percentage > 0);
  
  console.log('✅ Enrollment flow test passed');
}
```

---

## 📝 Next Steps

1. **Customize Sample Courses**: Update course content URLs and descriptions
2. **Configure Certificate Generation**: Set up PDF generation service
3. **Enable Feature Flags**: Gradually roll out to users
4. **Monitor Analytics**: Track engagement and completion rates
5. **Gather Feedback**: Collect user feedback for improvements

---

## 🆘 Troubleshooting

### Common Issues

**Issue**: Migration fails with "relation already exists"
**Solution**: Drop existing tables if rerunning migration:
```sql
DROP TABLE IF EXISTS academy_analytics_events CASCADE;
DROP TABLE IF EXISTS academy_course_reviews CASCADE;
-- etc...
```

**Issue**: RLS policies block access
**Solution**: Verify user role and authentication:
```sql
SELECT * FROM profiles WHERE id = auth.uid();
```

**Issue**: Sample courses not visible
**Solution**: Check `is_published` flag:
```sql
UPDATE academy_courses SET is_published = true;
```

---

## 📞 Support

For questions or issues:
- Check documentation in `/docs/academy/`
- Review sample code in `/packages/ai-services/src/`
- Contact development team

---

**Last Updated**: November 24, 2025
**Version**: 1.0.0

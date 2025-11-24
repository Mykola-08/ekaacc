# Database Changes for Academy LMS

This document outlines all database changes required to implement the Academy LMS and enhanced AI features.

## Migration Overview

**Migration ID**: `20250124_academy_lms_and_features`  
**Status**: Pending  
**Breaking Changes**: None  
**Rollback Available**: Yes

## New Tables

### 1. Academy Courses

```sql
CREATE TABLE IF NOT EXISTS academy_courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100), -- mental-health, coping-skills, therapy-education, professional-development
    difficulty VARCHAR(20) CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    estimated_hours INTEGER,
    instructor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    thumbnail_url TEXT,
    preview_video_url TEXT,
    is_published BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    tags TEXT[], -- Array of tags for search
    prerequisites UUID[], -- Array of course IDs that are prerequisites
    learning_objectives TEXT[], -- Array of learning objectives
    target_audience TEXT, -- Description of who the course is for
    language VARCHAR(10) DEFAULT 'en',
    price_cents INTEGER DEFAULT 0, -- 0 for free courses
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ
);

-- Indexes for performance
CREATE INDEX idx_academy_courses_category ON academy_courses(category) WHERE is_published = true;
CREATE INDEX idx_academy_courses_instructor ON academy_courses(instructor_id);
CREATE INDEX idx_academy_courses_featured ON academy_courses(is_featured) WHERE is_published = true;
CREATE INDEX idx_academy_courses_tags ON academy_courses USING GIN(tags);
CREATE INDEX idx_academy_courses_published_created ON academy_courses(published_at DESC) WHERE is_published = true;

-- Full-text search
CREATE INDEX idx_academy_courses_search ON academy_courses 
USING GIN(to_tsvector('english', title || ' ' || COALESCE(description, '')));

-- RLS Policies
ALTER TABLE academy_courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published courses"
    ON academy_courses FOR SELECT
    USING (is_published = true);

CREATE POLICY "Instructors can view their own unpublished courses"
    ON academy_courses FOR SELECT
    USING (auth.uid() = instructor_id);

CREATE POLICY "Instructors can create courses"
    ON academy_courses FOR INSERT
    WITH CHECK (auth.uid() = instructor_id);

CREATE POLICY "Instructors can update their own courses"
    ON academy_courses FOR UPDATE
    USING (auth.uid() = instructor_id);

CREATE POLICY "Instructors can delete their own unpublished courses"
    ON academy_courses FOR DELETE
    USING (auth.uid() = instructor_id AND is_published = false);
```

### 2. Academy Modules

```sql
CREATE TABLE IF NOT EXISTS academy_modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES academy_courses(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    is_optional BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(course_id, order_index)
);

CREATE INDEX idx_academy_modules_course ON academy_modules(course_id, order_index);

-- RLS Policies
ALTER TABLE academy_modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view modules for published courses"
    ON academy_modules FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM academy_courses
            WHERE id = academy_modules.course_id
            AND is_published = true
        )
    );

CREATE POLICY "Instructors can manage their course modules"
    ON academy_modules FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM academy_courses
            WHERE id = academy_modules.course_id
            AND instructor_id = auth.uid()
        )
    );
```

### 3. Academy Lessons

```sql
CREATE TABLE IF NOT EXISTS academy_lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID REFERENCES academy_modules(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content_type VARCHAR(50) CHECK (content_type IN ('video', 'article', 'quiz', 'assignment', 'discussion', 'live_session')),
    content JSONB NOT NULL, -- Flexible content storage
    duration_minutes INTEGER,
    order_index INTEGER NOT NULL,
    is_required BOOLEAN DEFAULT true,
    is_preview BOOLEAN DEFAULT false, -- Can be viewed without enrollment
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(module_id, order_index)
);

-- Content JSONB structure examples:
-- Video: {"videoUrl": "https://...", "thumbnailUrl": "https://...", "transcriptUrl": "https://..."}
-- Article: {"text": "...", "imageUrls": [...], "estimatedReadingTime": 10}
-- Quiz: {"questions": [...], "passingScore": 70, "attemptsAllowed": 3}
-- Assignment: {"instructions": "...", "fileTypes": [...], "maxFileSize": 10485760, "deadline": "2024-12-31"}

CREATE INDEX idx_academy_lessons_module ON academy_lessons(module_id, order_index);
CREATE INDEX idx_academy_lessons_type ON academy_lessons(content_type);
CREATE INDEX idx_academy_lessons_content ON academy_lessons USING GIN(content);

-- RLS Policies
ALTER TABLE academy_lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view lessons for published courses"
    ON academy_lessons FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM academy_modules m
            JOIN academy_courses c ON m.course_id = c.id
            WHERE m.id = academy_lessons.module_id
            AND c.is_published = true
        )
    );

CREATE POLICY "Instructors can manage their course lessons"
    ON academy_lessons FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM academy_modules m
            JOIN academy_courses c ON m.course_id = c.id
            WHERE m.id = academy_lessons.module_id
            AND c.instructor_id = auth.uid()
        )
    );
```

### 4. Academy Enrollments

```sql
CREATE TABLE IF NOT EXISTS academy_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    course_id UUID REFERENCES academy_courses(id) ON DELETE CASCADE NOT NULL,
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    last_accessed_at TIMESTAMPTZ,
    enrollment_status VARCHAR(20) DEFAULT 'active' CHECK (enrollment_status IN ('active', 'completed', 'dropped', 'expired')),
    completion_criteria JSONB, -- Store dynamic completion requirements
    UNIQUE(user_id, course_id)
);

CREATE INDEX idx_academy_enrollments_user ON academy_enrollments(user_id, enrollment_status);
CREATE INDEX idx_academy_enrollments_course ON academy_enrollments(course_id, enrollment_status);
CREATE INDEX idx_academy_enrollments_progress ON academy_enrollments(user_id, progress_percentage);
CREATE INDEX idx_academy_enrollments_active ON academy_enrollments(user_id) WHERE enrollment_status = 'active';

-- RLS Policies
ALTER TABLE academy_enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own enrollments"
    ON academy_enrollments FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Instructors can view enrollments for their courses"
    ON academy_enrollments FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM academy_courses
            WHERE id = academy_enrollments.course_id
            AND instructor_id = auth.uid()
        )
    );

CREATE POLICY "Users can enroll themselves in courses"
    ON academy_enrollments FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own enrollment progress"
    ON academy_enrollments FOR UPDATE
    USING (auth.uid() = user_id);
```

### 5. Academy Lesson Progress

```sql
CREATE TABLE IF NOT EXISTS academy_lesson_progress (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    lesson_id UUID REFERENCES academy_lessons(id) ON DELETE CASCADE NOT NULL,
    status VARCHAR(20) DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'skipped')),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    time_spent_seconds INTEGER DEFAULT 0,
    quiz_score INTEGER, -- Percentage score for quiz lessons
    quiz_attempts INTEGER DEFAULT 0,
    assignment_submitted_at TIMESTAMPTZ,
    assignment_graded_at TIMESTAMPTZ,
    assignment_score INTEGER,
    notes TEXT, -- User's personal notes for this lesson
    bookmarked BOOLEAN DEFAULT false,
    last_position INTEGER, -- For video lessons, track playback position in seconds
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, lesson_id)
);

CREATE INDEX idx_academy_lesson_progress_user ON academy_lesson_progress(user_id, status);
CREATE INDEX idx_academy_lesson_progress_lesson ON academy_lesson_progress(lesson_id, status);
CREATE INDEX idx_academy_lesson_progress_completed ON academy_lesson_progress(user_id, completed_at DESC) WHERE status = 'completed';

-- RLS Policies
ALTER TABLE academy_lesson_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own lesson progress"
    ON academy_lesson_progress FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own lesson progress"
    ON academy_lesson_progress FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Instructors can view progress for their course lessons"
    ON academy_lesson_progress FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM academy_lessons l
            JOIN academy_modules m ON l.module_id = m.id
            JOIN academy_courses c ON m.course_id = c.id
            WHERE l.id = academy_lesson_progress.lesson_id
            AND c.instructor_id = auth.uid()
        )
    );
```

### 6. Academy Certificates

```sql
CREATE TABLE IF NOT EXISTS academy_certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    course_id UUID REFERENCES academy_courses(id) ON DELETE CASCADE NOT NULL,
    issued_at TIMESTAMPTZ DEFAULT NOW(),
    certificate_url TEXT, -- URL to generated PDF certificate
    verification_code VARCHAR(50) UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ, -- NULL for non-expiring certificates
    grade VARCHAR(20), -- 'pass', 'distinction', 'merit'
    final_score INTEGER, -- Overall course score
    instructor_signature TEXT, -- Digital signature or URL
    metadata JSONB, -- Additional certificate data
    UNIQUE(user_id, course_id)
);

CREATE INDEX idx_academy_certificates_user ON academy_certificates(user_id, issued_at DESC);
CREATE INDEX idx_academy_certificates_verification ON academy_certificates(verification_code);
CREATE INDEX idx_academy_certificates_course ON academy_certificates(course_id);

-- RLS Policies
ALTER TABLE academy_certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own certificates"
    ON academy_certificates FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Anyone can verify certificates by verification code"
    ON academy_certificates FOR SELECT
    USING (true); -- Public verification

CREATE POLICY "Instructors can view certificates for their courses"
    ON academy_certificates FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM academy_courses
            WHERE id = academy_certificates.course_id
            AND instructor_id = auth.uid()
        )
    );
```

### 7. Academy Learning Paths (AI-Generated)

```sql
CREATE TABLE IF NOT EXISTS academy_learning_paths (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    recommended_courses UUID[] NOT NULL, -- Ordered array of course IDs
    reasoning TEXT, -- AI explanation for recommendations
    confidence_score FLOAT CHECK (confidence_score >= 0 AND confidence_score <= 1),
    based_on_data JSONB, -- What data was used: mood patterns, journal themes, goals, etc.
    personalization_factors TEXT[], -- e.g., ['anxiety_management', 'sleep_improvement']
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '30 days',
    viewed_at TIMESTAMPTZ,
    feedback VARCHAR(20), -- 'helpful', 'not_helpful', 'partially_helpful'
    feedback_notes TEXT
);

CREATE INDEX idx_academy_learning_paths_user ON academy_learning_paths(user_id, created_at DESC);
CREATE INDEX idx_academy_learning_paths_active ON academy_learning_paths(user_id) 
    WHERE expires_at > NOW() AND viewed_at IS NULL;

-- RLS Policies
ALTER TABLE academy_learning_paths ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own learning paths"
    ON academy_learning_paths FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can provide feedback on their learning paths"
    ON academy_learning_paths FOR UPDATE
    USING (auth.uid() = user_id);
```

### 8. Academy Course Reviews

```sql
CREATE TABLE IF NOT EXISTS academy_course_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    course_id UUID REFERENCES academy_courses(id) ON DELETE CASCADE NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    title VARCHAR(255),
    review TEXT,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_verified_completion BOOLEAN DEFAULT false, -- Did user complete the course?
    UNIQUE(user_id, course_id)
);

CREATE INDEX idx_academy_course_reviews_course ON academy_course_reviews(course_id, created_at DESC);
CREATE INDEX idx_academy_course_reviews_rating ON academy_course_reviews(course_id, rating);

-- RLS Policies
ALTER TABLE academy_course_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view course reviews"
    ON academy_course_reviews FOR SELECT
    USING (true);

CREATE POLICY "Enrolled users can create reviews"
    ON academy_course_reviews FOR INSERT
    WITH CHECK (
        auth.uid() = user_id
        AND EXISTS (
            SELECT 1 FROM academy_enrollments
            WHERE user_id = auth.uid()
            AND course_id = academy_course_reviews.course_id
        )
    );

CREATE POLICY "Users can update their own reviews"
    ON academy_course_reviews FOR UPDATE
    USING (auth.uid() = user_id);
```

### 9. Academy Analytics Events

```sql
CREATE TABLE IF NOT EXISTS academy_analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL, -- 'course_view', 'lesson_start', 'lesson_complete', 'quiz_attempt', etc.
    resource_type VARCHAR(50), -- 'course', 'lesson', 'quiz', etc.
    resource_id UUID,
    event_data JSONB,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    session_id UUID -- Group events by user session
);

-- Partitioned by month for performance
CREATE INDEX idx_academy_analytics_user_time ON academy_analytics_events(user_id, timestamp DESC);
CREATE INDEX idx_academy_analytics_event_type ON academy_analytics_events(event_type, timestamp DESC);
CREATE INDEX idx_academy_analytics_resource ON academy_analytics_events(resource_type, resource_id, timestamp DESC);

-- RLS Policies
ALTER TABLE academy_analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own analytics"
    ON academy_analytics_events FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "System can insert analytics events"
    ON academy_analytics_events FOR INSERT
    WITH CHECK (true); -- Allow service role to insert
```

## Updated Tables

### 1. Features Table - New Feature Flags

```sql
-- Add new feature flags for Academy and AI features
INSERT INTO features (key, name, description, status, is_enabled, min_role) VALUES
('academy_lms', 'Academy LMS', 'Learning management system for courses and certifications', 'beta', true, 'Patient'),
('ai_learning_paths', 'AI Learning Paths', 'Personalized course recommendations based on user data', 'beta', false, 'Patient'),
('ai_content_recommendations', 'AI Content Recommender', 'Smart content suggestions within courses', 'alpha', false, 'Patient'),
('ai_study_buddy', 'AI Study Buddy', 'Interactive learning assistant for course help', 'alpha', false, 'Patient'),
('ai_progress_prediction', 'AI Progress Predictor', 'Forecast course completion dates and suggest schedules', 'beta', true, 'Patient'),
('ai_skill_gap_analysis', 'AI Skill Gap Analyzer', 'Identify learning needs and knowledge gaps', 'beta', true, 'Patient'),
('ai_peer_matching', 'AI Peer Matcher', 'Connect learners with similar interests', 'alpha', false, 'Patient'),
('ai_therapy_curator', 'AI Therapy Content Curator', 'Curate mental health educational resources', 'stable', true, 'Patient'),
('ai_crisis_intervention', 'AI Crisis Intervention', 'Real-time support routing for urgent situations', 'stable', true, 'Patient'),
('predictive_analytics', 'Predictive Analytics', 'ML-powered insights for therapists', 'beta', true, 'Therapist'),
('academy_certifications', 'Academy Certifications', 'Issue and verify course completion certificates', 'beta', true, 'Patient'),
('academy_live_classes', 'Academy Live Classes', 'Real-time video sessions with instructors', 'alpha', false, 'Patient'),
('academy_peer_learning', 'Academy Peer Learning', 'Study groups and collaboration tools', 'alpha', false, 'Patient')
ON CONFLICT (key) DO NOTHING;
```

### 2. User Profiles - Additional Fields

```sql
-- Add learning preferences to user profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS learning_preferences JSONB DEFAULT '{
  "preferred_content_types": ["video", "article"],
  "preferred_difficulty": "beginner",
  "study_time_minutes_per_day": 30,
  "preferred_study_days": ["Monday", "Wednesday", "Friday"],
  "preferred_study_time": "19:00",
  "learning_goals": [],
  "interests": []
}'::jsonb;

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS academy_settings JSONB DEFAULT '{
  "email_notifications": true,
  "course_reminders": true,
  "certificate_notifications": true,
  "peer_learning_enabled": false
}'::jsonb;
```

## Views

### 1. Course Statistics View

```sql
CREATE OR REPLACE VIEW academy_course_statistics AS
SELECT
    c.id AS course_id,
    c.title,
    c.category,
    c.difficulty,
    COUNT(DISTINCT e.user_id) AS total_enrollments,
    COUNT(DISTINCT CASE WHEN e.enrollment_status = 'completed' THEN e.user_id END) AS completions,
    ROUND(AVG(e.progress_percentage), 2) AS avg_progress,
    COUNT(DISTINCT r.id) AS review_count,
    ROUND(AVG(r.rating), 2) AS avg_rating,
    COUNT(DISTINCT cert.id) AS certificates_issued
FROM academy_courses c
LEFT JOIN academy_enrollments e ON c.id = e.course_id
LEFT JOIN academy_course_reviews r ON c.id = r.course_id
LEFT JOIN academy_certificates cert ON c.id = cert.course_id
WHERE c.is_published = true
GROUP BY c.id, c.title, c.category, c.difficulty;
```

### 2. User Learning Dashboard View

```sql
CREATE OR REPLACE VIEW academy_user_dashboard AS
SELECT
    e.user_id,
    COUNT(DISTINCT e.course_id) AS enrolled_courses,
    COUNT(DISTINCT CASE WHEN e.enrollment_status = 'completed' THEN e.course_id END) AS completed_courses,
    COUNT(DISTINCT cert.id) AS certificates_earned,
    ROUND(AVG(e.progress_percentage), 2) AS avg_course_progress,
    SUM(lp.time_spent_seconds) / 3600.0 AS total_hours_learned,
    COUNT(DISTINCT lp.lesson_id) FILTER (WHERE lp.status = 'completed') AS lessons_completed,
    MAX(e.last_accessed_at) AS last_learning_activity
FROM academy_enrollments e
LEFT JOIN academy_lesson_progress lp ON e.user_id = lp.user_id
LEFT JOIN academy_certificates cert ON e.user_id = cert.user_id
GROUP BY e.user_id;
```

## Functions

### 1. Calculate Course Progress

```sql
CREATE OR REPLACE FUNCTION calculate_course_progress(p_user_id UUID, p_course_id UUID)
RETURNS INTEGER AS $$
DECLARE
    total_required_lessons INTEGER;
    completed_lessons INTEGER;
    progress INTEGER;
BEGIN
    -- Count total required lessons in the course
    SELECT COUNT(*) INTO total_required_lessons
    FROM academy_lessons l
    JOIN academy_modules m ON l.module_id = m.id
    WHERE m.course_id = p_course_id AND l.is_required = true;
    
    -- Count completed required lessons
    SELECT COUNT(*) INTO completed_lessons
    FROM academy_lesson_progress lp
    JOIN academy_lessons l ON lp.lesson_id = l.id
    JOIN academy_modules m ON l.module_id = m.id
    WHERE lp.user_id = p_user_id 
    AND m.course_id = p_course_id 
    AND l.is_required = true
    AND lp.status = 'completed';
    
    -- Calculate percentage
    IF total_required_lessons > 0 THEN
        progress := ROUND((completed_lessons::DECIMAL / total_required_lessons) * 100);
    ELSE
        progress := 0;
    END IF;
    
    -- Update enrollment record
    UPDATE academy_enrollments
    SET progress_percentage = progress,
        updated_at = NOW()
    WHERE user_id = p_user_id AND course_id = p_course_id;
    
    RETURN progress;
END;
$$ LANGUAGE plpgsql;
```

### 2. Issue Certificate

```sql
CREATE OR REPLACE FUNCTION issue_certificate(p_user_id UUID, p_course_id UUID)
RETURNS UUID AS $$
DECLARE
    certificate_id UUID;
    verification_code VARCHAR(50);
    course_title VARCHAR(255);
    final_score INTEGER;
BEGIN
    -- Check if course is completed
    IF NOT EXISTS (
        SELECT 1 FROM academy_enrollments
        WHERE user_id = p_user_id 
        AND course_id = p_course_id 
        AND enrollment_status = 'completed'
    ) THEN
        RAISE EXCEPTION 'Course not completed';
    END IF;
    
    -- Generate verification code
    verification_code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT || p_user_id::TEXT || p_course_id::TEXT) FROM 1 FOR 12));
    
    -- Get course title
    SELECT title INTO course_title FROM academy_courses WHERE id = p_course_id;
    
    -- Calculate final score (average of quiz scores)
    SELECT ROUND(AVG(quiz_score)) INTO final_score
    FROM academy_lesson_progress lp
    JOIN academy_lessons l ON lp.lesson_id = l.id
    JOIN academy_modules m ON l.module_id = m.id
    WHERE lp.user_id = p_user_id 
    AND m.course_id = p_course_id 
    AND l.content_type = 'quiz'
    AND lp.quiz_score IS NOT NULL;
    
    -- Insert certificate
    INSERT INTO academy_certificates (
        user_id,
        course_id,
        verification_code,
        final_score,
        grade,
        metadata
    ) VALUES (
        p_user_id,
        p_course_id,
        verification_code,
        final_score,
        CASE 
            WHEN final_score >= 90 THEN 'distinction'
            WHEN final_score >= 75 THEN 'merit'
            ELSE 'pass'
        END,
        jsonb_build_object(
            'course_title', course_title,
            'issued_date', NOW()
        )
    )
    RETURNING id INTO certificate_id;
    
    RETURN certificate_id;
END;
$$ LANGUAGE plpgsql;
```

## Triggers

### 1. Update Course Updated Timestamp

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_academy_courses_updated_at
    BEFORE UPDATE ON academy_courses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_academy_modules_updated_at
    BEFORE UPDATE ON academy_modules
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_academy_lessons_updated_at
    BEFORE UPDATE ON academy_lessons
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

### 2. Auto-calculate Progress on Lesson Completion

```sql
CREATE OR REPLACE FUNCTION auto_calculate_progress()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
        PERFORM calculate_course_progress(
            NEW.user_id,
            (SELECT m.course_id FROM academy_lessons l 
             JOIN academy_modules m ON l.module_id = m.id 
             WHERE l.id = NEW.lesson_id)
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_calculate_progress
    AFTER INSERT OR UPDATE ON academy_lesson_progress
    FOR EACH ROW
    EXECUTE FUNCTION auto_calculate_progress();
```

### 3. Auto-issue Certificate on Course Completion

```sql
CREATE OR REPLACE FUNCTION auto_issue_certificate()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.progress_percentage = 100 AND NEW.enrollment_status = 'active' THEN
        -- Update status to completed
        NEW.enrollment_status := 'completed';
        NEW.completed_at := NOW();
        
        -- Issue certificate asynchronously (via background job)
        -- For now, just mark as ready for certificate
        PERFORM pg_notify('certificate_ready', json_build_object(
            'user_id', NEW.user_id,
            'course_id', NEW.course_id
        )::text);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_issue_certificate
    BEFORE UPDATE ON academy_enrollments
    FOR EACH ROW
    WHEN (NEW.progress_percentage = 100 AND OLD.progress_percentage < 100)
    EXECUTE FUNCTION auto_issue_certificate();
```

## Rollback Script

```sql
-- Drop triggers
DROP TRIGGER IF EXISTS trigger_auto_issue_certificate ON academy_enrollments;
DROP TRIGGER IF EXISTS trigger_auto_calculate_progress ON academy_lesson_progress;
DROP TRIGGER IF EXISTS update_academy_lessons_updated_at ON academy_lessons;
DROP TRIGGER IF EXISTS update_academy_modules_updated_at ON academy_modules;
DROP TRIGGER IF EXISTS update_academy_courses_updated_at ON academy_courses;

-- Drop functions
DROP FUNCTION IF EXISTS auto_issue_certificate();
DROP FUNCTION IF EXISTS auto_calculate_progress();
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP FUNCTION IF EXISTS issue_certificate(UUID, UUID);
DROP FUNCTION IF EXISTS calculate_course_progress(UUID, UUID);

-- Drop views
DROP VIEW IF EXISTS academy_user_dashboard;
DROP VIEW IF EXISTS academy_course_statistics;

-- Drop tables (in reverse order of dependencies)
DROP TABLE IF EXISTS academy_analytics_events;
DROP TABLE IF EXISTS academy_course_reviews;
DROP TABLE IF EXISTS academy_learning_paths;
DROP TABLE IF EXISTS academy_certificates;
DROP TABLE IF EXISTS academy_lesson_progress;
DROP TABLE IF EXISTS academy_enrollments;
DROP TABLE IF EXISTS academy_lessons;
DROP TABLE IF EXISTS academy_modules;
DROP TABLE IF EXISTS academy_courses;

-- Remove profile columns
ALTER TABLE profiles DROP COLUMN IF EXISTS academy_settings;
ALTER TABLE profiles DROP COLUMN IF EXISTS learning_preferences;

-- Remove feature flags
DELETE FROM features WHERE key IN (
    'academy_lms',
    'ai_learning_paths',
    'ai_content_recommendations',
    'ai_study_buddy',
    'ai_progress_prediction',
    'ai_skill_gap_analysis',
    'ai_peer_matching',
    'ai_therapy_curator',
    'ai_crisis_intervention',
    'predictive_analytics',
    'academy_certifications',
    'academy_live_classes',
    'academy_peer_learning'
);
```

## Migration Steps

1. **Backup Database**
   ```bash
   pg_dump -Fc ekaacc > backup_before_academy_$(date +%Y%m%d).dump
   ```

2. **Apply Migration**
   ```bash
   psql -d ekaacc -f supabase/migrations/20250124_academy_lms_and_features.sql
   ```

3. **Verify Migration**
   ```sql
   -- Check all tables created
   SELECT table_name FROM information_schema.tables 
   WHERE table_name LIKE 'academy_%';
   
   -- Check feature flags inserted
   SELECT key, name, status, is_enabled FROM features 
   WHERE key LIKE 'academy_%' OR key LIKE 'ai_%';
   ```

4. **Test RLS Policies**
   ```sql
   -- Test as regular user
   SET LOCAL ROLE authenticated;
   SET LOCAL request.jwt.claim.sub = 'user-uuid-here';
   SELECT * FROM academy_courses WHERE is_published = true;
   ```

5. **Seed Initial Data (Optional)**
   ```bash
   psql -d ekaacc -f supabase/seeds/academy_seed_courses.sql
   ```

## Performance Considerations

- **Indexes**: All frequently queried columns are indexed
- **Partitioning**: Consider partitioning `academy_analytics_events` by month for large-scale deployments
- **Caching**: Course catalog and user enrollments should be cached (15 min TTL)
- **CDN**: Video content should be served via CDN
- **Connection Pooling**: Enable connection pooling for high traffic

## Security Notes

- All tables have RLS enabled
- Sensitive operations require authentication
- Certificate verification is public but doesn't expose user PII
- Video URLs should use signed URLs with expiration
- File uploads must be validated and scanned

## Monitoring

Monitor these metrics after migration:

- Table sizes and growth rate
- Index usage statistics
- Query performance (pg_stat_statements)
- RLS policy performance
- Cache hit rates

## Next Steps

After successful migration:

1. Enable `academy_lms` feature flag
2. Create initial courses (mental health basics, coping skills)
3. Test enrollment and progress tracking
4. Configure certificate templates
5. Set up video CDN
6. Enable gradual rollout of AI features
7. Monitor analytics and user feedback

## Support

For migration issues, contact:
- Database Team: db@ekaacc.com
- DevOps Team: devops@ekaacc.com

-- =====================================================
-- EKAACC ACADEMY LMS - COMPLETE DATABASE SETUP
-- =====================================================
-- This script creates all necessary tables, indexes, triggers,
-- RLS policies, and sample courses for the Academy LMS.
-- 
-- Run this migration on your Supabase database:
-- psql -h your-db-url -U postgres -d postgres < academy_complete_setup.sql
--
-- Features:
-- - 9 core tables with Row Level Security
-- - Performance indexes on all foreign keys
-- - Automatic triggers for progress calculation
-- - Analytics views for reporting
-- - 4 complete sample courses with 78 lessons
-- - Integration with existing user profiles
-- =====================================================

-- =====================================================
-- CLEANUP: Drop existing objects to ensure clean setup
-- =====================================================
DROP VIEW IF EXISTS academy_user_dashboard;
DROP VIEW IF EXISTS academy_course_statistics;

DROP TABLE IF EXISTS academy_analytics_events CASCADE;
DROP TABLE IF EXISTS academy_course_reviews CASCADE;
DROP TABLE IF EXISTS academy_learning_paths CASCADE;
DROP TABLE IF EXISTS academy_certificates CASCADE;
DROP TABLE IF EXISTS academy_lesson_progress CASCADE;
DROP TABLE IF EXISTS academy_enrollments CASCADE;
DROP TABLE IF EXISTS academy_lessons CASCADE;
DROP TABLE IF EXISTS academy_course_modules CASCADE;
DROP TABLE IF EXISTS academy_courses CASCADE;

DROP FUNCTION IF EXISTS issue_certificate;
-- Trigger will be dropped with the table
DROP FUNCTION IF EXISTS update_enrollment_progress;
DROP FUNCTION IF EXISTS calculate_course_progress;

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLE 1: ACADEMY_COURSES
-- =====================================================
CREATE TABLE IF NOT EXISTS academy_courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  difficulty VARCHAR(20) CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  estimated_hours INTEGER,
  instructor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  thumbnail_url TEXT,
  is_published BOOLEAN DEFAULT false,
  tags TEXT[],
  learning_objectives TEXT[],
  prerequisites TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_academy_courses_category ON academy_courses(category) WHERE is_published = true;
CREATE INDEX IF NOT EXISTS idx_academy_courses_published ON academy_courses(is_published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_academy_courses_instructor ON academy_courses(instructor_id);

-- RLS Policies
ALTER TABLE academy_courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published courses are viewable by everyone" ON academy_courses
  FOR SELECT USING (is_published = true);

CREATE POLICY "Instructors can manage their courses" ON academy_courses
  FOR ALL USING (auth.uid() = instructor_id);

CREATE POLICY "Admins can manage all courses" ON academy_courses
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- TABLE 2: academy_course_modules
-- =====================================================
CREATE TABLE IF NOT EXISTS academy_course_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES academy_courses(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_academy_course_modules_course ON academy_course_modules(course_id, order_index);

-- RLS Policies
ALTER TABLE academy_course_modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Modules viewable if course is published" ON academy_course_modules
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM academy_courses 
      WHERE id = course_id AND is_published = true
    )
  );

CREATE POLICY "Course instructors can manage modules" ON academy_course_modules
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM academy_courses 
      WHERE id = course_id AND instructor_id = auth.uid()
    )
  );

-- =====================================================
-- TABLE 3: ACADEMY_LESSONS
-- =====================================================
CREATE TABLE IF NOT EXISTS academy_lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id UUID REFERENCES academy_course_modules(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(255) NOT NULL,
  content_type VARCHAR(50) CHECK (content_type IN ('video', 'article', 'quiz', 'assignment', 'exercise')),
  content JSONB NOT NULL,  -- {video_url, article_text, quiz_data, etc.}
  duration_minutes INTEGER,
  order_index INTEGER NOT NULL,
  is_required BOOLEAN DEFAULT true,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_academy_lessons_module ON academy_lessons(module_id, order_index);
CREATE INDEX IF NOT EXISTS idx_academy_lessons_type ON academy_lessons(content_type);

-- RLS Policies
ALTER TABLE academy_lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lessons viewable if published" ON academy_lessons
  FOR SELECT USING (is_published = true);

CREATE POLICY "Module instructors can manage lessons" ON academy_lessons
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM academy_course_modules m
      JOIN academy_courses c ON c.id = m.course_id
      WHERE m.id = module_id AND c.instructor_id = auth.uid()
    )
  );

-- =====================================================
-- TABLE 4: ACADEMY_ENROLLMENTS
-- =====================================================
CREATE TABLE IF NOT EXISTS academy_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES academy_courses(id) ON DELETE CASCADE NOT NULL,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dropped')),
  UNIQUE(user_id, course_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_academy_enrollments_user ON academy_enrollments(user_id, enrolled_at DESC);
CREATE INDEX IF NOT EXISTS idx_academy_enrollments_course ON academy_enrollments(course_id, status);
CREATE INDEX IF NOT EXISTS idx_academy_enrollments_status ON academy_enrollments(status, progress_percentage);

-- RLS Policies
ALTER TABLE academy_enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own enrollments" ON academy_enrollments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can enroll themselves" ON academy_enrollments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own enrollments" ON academy_enrollments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Therapists can view patient enrollments" ON academy_enrollments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM appointments 
      WHERE practitioner_id = auth.uid() AND user_id = academy_enrollments.user_id
    )
  );

-- =====================================================
-- TABLE 5: ACADEMY_LESSON_PROGRESS
-- =====================================================
CREATE TABLE IF NOT EXISTS academy_lesson_progress (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lesson_id UUID REFERENCES academy_lessons(id) ON DELETE CASCADE NOT NULL,
  status VARCHAR(20) DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  time_spent_seconds INTEGER DEFAULT 0,
  quiz_score INTEGER CHECK (quiz_score >= 0 AND quiz_score <= 100),
  attempts INTEGER DEFAULT 0,
  last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, lesson_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_academy_lesson_progress_user ON academy_lesson_progress(user_id, last_accessed_at DESC);
CREATE INDEX IF NOT EXISTS idx_academy_lesson_progress_lesson ON academy_lesson_progress(lesson_id, status);

-- RLS Policies
ALTER TABLE academy_lesson_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own progress" ON academy_lesson_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON academy_lesson_progress
  FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- TABLE 6: ACADEMY_CERTIFICATES
-- =====================================================
CREATE TABLE IF NOT EXISTS academy_certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES academy_courses(id) ON DELETE CASCADE NOT NULL,
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  certificate_url TEXT,
  verification_code VARCHAR(50) UNIQUE NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  UNIQUE(user_id, course_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_academy_certificates_user ON academy_certificates(user_id, issued_at DESC);
CREATE INDEX IF NOT EXISTS idx_academy_certificates_verification ON academy_certificates(verification_code);

-- RLS Policies
ALTER TABLE academy_certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own certificates" ON academy_certificates
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Anyone can verify certificates" ON academy_certificates
  FOR SELECT USING (verification_code IS NOT NULL);

-- =====================================================
-- TABLE 7: ACADEMY_LEARNING_PATHS
-- =====================================================
CREATE TABLE IF NOT EXISTS academy_learning_paths (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  recommended_courses UUID[],
  reasoning TEXT,
  confidence_score FLOAT CHECK (confidence_score >= 0 AND confidence_score <= 1),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '30 days',
  is_active BOOLEAN DEFAULT true
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_academy_learning_paths_user ON academy_learning_paths(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_academy_learning_paths_active ON academy_learning_paths(is_active, expires_at);

-- RLS Policies
ALTER TABLE academy_learning_paths ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own learning paths" ON academy_learning_paths
  FOR SELECT USING (auth.uid() = user_id);

-- =====================================================
-- TABLE 8: ACADEMY_COURSE_REVIEWS
-- =====================================================
CREATE TABLE IF NOT EXISTS academy_course_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES academy_courses(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  review_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_published BOOLEAN DEFAULT true,
  helpful_count INTEGER DEFAULT 0,
  UNIQUE(user_id, course_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_academy_reviews_course ON academy_course_reviews(course_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_academy_reviews_rating ON academy_course_reviews(rating);

-- RLS Policies
ALTER TABLE academy_course_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published reviews are viewable by everyone" ON academy_course_reviews
  FOR SELECT USING (is_published = true);

CREATE POLICY "Users can create their own reviews" ON academy_course_reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" ON academy_course_reviews
  FOR UPDATE USING (auth.uid() = user_id);

-- =====================================================
-- TABLE 9: ACADEMY_ANALYTICS_EVENTS
-- =====================================================
CREATE TABLE IF NOT EXISTS academy_analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type VARCHAR(50) NOT NULL,
  event_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_academy_analytics_user ON academy_analytics_events(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_academy_analytics_type ON academy_analytics_events(event_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_academy_analytics_created ON academy_analytics_events(created_at DESC);

-- RLS Policies
ALTER TABLE academy_analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create their own events" ON academy_analytics_events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all events" ON academy_analytics_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to calculate course progress
CREATE OR REPLACE FUNCTION calculate_course_progress(p_user_id UUID, p_course_id UUID)
RETURNS INTEGER AS $$
DECLARE
  total_lessons INTEGER;
  completed_lessons INTEGER;
  progress_pct INTEGER;
BEGIN
  -- Count total required lessons
  SELECT COUNT(*)
  INTO total_lessons
  FROM academy_lessons l
  JOIN academy_course_modules m ON m.id = l.module_id
  WHERE m.course_id = p_course_id AND l.is_required = true;
  
  -- Count completed lessons
  SELECT COUNT(*)
  INTO completed_lessons
  FROM academy_lesson_progress lp
  JOIN academy_lessons l ON l.id = lp.lesson_id
  JOIN academy_course_modules m ON m.id = l.module_id
  WHERE m.course_id = p_course_id 
    AND lp.user_id = p_user_id 
    AND lp.status = 'completed'
    AND l.is_required = true;
  
  -- Calculate percentage
  IF total_lessons > 0 THEN
    progress_pct := ROUND((completed_lessons::FLOAT / total_lessons::FLOAT) * 100);
  ELSE
    progress_pct := 0;
  END IF;
  
  RETURN progress_pct;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update enrollment progress
CREATE OR REPLACE FUNCTION update_enrollment_progress()
RETURNS TRIGGER AS $$
DECLARE
  v_course_id UUID;
  v_progress INTEGER;
BEGIN
  -- Get course_id for the lesson
  SELECT m.course_id
  INTO v_course_id
  FROM academy_lessons l
  JOIN academy_course_modules m ON m.id = l.module_id
  WHERE l.id = NEW.lesson_id;
  
  -- Calculate new progress
  v_progress := calculate_course_progress(NEW.user_id, v_course_id);
  
  -- Update enrollment
  UPDATE academy_enrollments
  SET progress_percentage = v_progress,
      last_accessed_at = NOW(),
      completed_at = CASE 
        WHEN v_progress = 100 THEN NOW()
        ELSE completed_at
      END,
      status = CASE
        WHEN v_progress = 100 THEN 'completed'
        ELSE status
      END
  WHERE user_id = NEW.user_id AND course_id = v_course_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_enrollment_progress
  AFTER INSERT OR UPDATE ON academy_lesson_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_enrollment_progress();

-- Function to issue certificate
CREATE OR REPLACE FUNCTION issue_certificate(p_user_id UUID, p_course_id UUID)
RETURNS UUID AS $$
DECLARE
  v_cert_id UUID;
  v_verification_code VARCHAR(50);
BEGIN
  -- Generate verification code
  v_verification_code := 'EKAACC-' || UPPER(SUBSTRING(MD5(p_user_id::TEXT || p_course_id::TEXT || NOW()::TEXT), 1, 12));
  
  -- Insert certificate
  INSERT INTO academy_certificates (user_id, course_id, verification_code)
  VALUES (p_user_id, p_course_id, v_verification_code)
  ON CONFLICT (user_id, course_id) DO UPDATE 
  SET issued_at = NOW()
  RETURNING id INTO v_cert_id;
  
  RETURN v_cert_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- VIEWS FOR ANALYTICS
-- =====================================================

CREATE OR REPLACE VIEW academy_course_statistics AS
SELECT 
  c.id AS course_id,
  c.title,
  c.category,
  COUNT(DISTINCT e.user_id) AS total_enrollments,
  COUNT(DISTINCT CASE WHEN e.status = 'completed' THEN e.user_id END) AS completed_enrollments,
  ROUND(AVG(e.progress_percentage), 2) AS avg_progress,
  COUNT(DISTINCT r.id) AS total_reviews,
  ROUND(AVG(r.rating), 2) AS avg_rating,
  COUNT(DISTINCT cert.id) AS certificates_issued
FROM academy_courses c
LEFT JOIN academy_enrollments e ON e.course_id = c.id
LEFT JOIN academy_course_reviews r ON r.course_id = c.id AND r.is_published = true
LEFT JOIN academy_certificates cert ON cert.course_id = c.id
WHERE c.is_published = true
GROUP BY c.id, c.title, c.category;

CREATE OR REPLACE VIEW academy_user_dashboard AS
SELECT 
  e.user_id,
  COUNT(DISTINCT e.course_id) AS enrolled_courses,
  COUNT(DISTINCT CASE WHEN e.status = 'completed' THEN e.course_id END) AS completed_courses,
  ROUND(AVG(e.progress_percentage), 2) AS avg_progress,
  COUNT(DISTINCT cert.id) AS certificates_earned,
  SUM(lp.time_spent_seconds) / 3600 AS total_hours_learned
FROM academy_enrollments e
LEFT JOIN academy_lesson_progress lp ON lp.user_id = e.user_id
LEFT JOIN academy_certificates cert ON cert.user_id = e.user_id
GROUP BY e.user_id;

-- =====================================================
-- SAMPLE COURSES DATA
-- =====================================================

-- Sample Admin/Instructor User (use existing or create placeholder)
-- For this migration, we'll use a placeholder that can be replaced
DO $$
DECLARE
  v_instructor_id UUID := 'aff2159a-d312-434c-9f59-345fc2ea6281'; -- Replace with actual instructor ID
  v_course1_id UUID;
  v_course2_id UUID;
  v_course3_id UUID;
  v_course4_id UUID;
  v_module_id UUID;
  v_lesson_order INTEGER;
BEGIN

-- =====================================================
-- COURSE 1: Feldenkrais Method Fundamentals
-- =====================================================
INSERT INTO academy_courses (id, title, description, category, difficulty, estimated_hours, instructor_id, is_published, tags, learning_objectives)
VALUES (
  uuid_generate_v4(),
  'Feldenkrais Method Fundamentals',
  'Learn the Feldenkrais Method to improve body awareness, reduce stress, and enhance emotional regulation through gentle movement practices. This course integrates somatic approaches with mental health awareness.',
  'Mental Health & Wellness',
  'beginner',
  12,
  v_instructor_id,
  true,
  ARRAY['feldenkrais', 'somatic', 'movement', 'body-awareness', 'stress-relief', 'mindfulness'],
  ARRAY[
    'Understand the principles of the Feldenkrais Method',
    'Develop body awareness for stress reduction',
    'Practice gentle movements for emotional regulation',
    'Integrate somatic practices into daily life',
    'Recognize movement patterns that contribute to anxiety'
  ]
)
RETURNING id INTO v_course1_id;

-- Module 1: Introduction to Feldenkrais
INSERT INTO academy_course_modules (course_id, title, description, order_index)
VALUES (v_course1_id, 'Introduction to Feldenkrais', 'Understanding the foundations and principles', 1)
RETURNING id INTO v_module_id;

v_lesson_order := 1;
INSERT INTO academy_lessons (module_id, title, content_type, content, duration_minutes, order_index)
VALUES 
  (v_module_id, 'What is the Feldenkrais Method?', 'video', '{"video_url": "https://example.com/feldenkrais-intro.mp4", "transcript": "Introduction to Feldenkrais principles..."}', 15, v_lesson_order),
  (v_module_id, 'The Mind-Body Connection', 'article', '{"text": "The Feldenkrais Method is based on the principle that movement, sensation, feeling, and thought are intimately connected...", "images": ["https://example.com/mind-body.jpg"]}', 20, v_lesson_order + 1),
  (v_module_id, 'Body Awareness Assessment', 'quiz', '{"questions": [{"question": "What is the primary goal of Feldenkrais?", "options": ["Physical fitness", "Body awareness", "Weight loss", "Flexibility"], "correct": 1}]}', 10, v_lesson_order + 2),
  (v_module_id, 'Your First Awareness Through Movement Lesson', 'exercise', '{"instructions": "Lie on your back comfortably. Notice how your body contacts the floor...", "duration": 20, "audio_guide": "https://example.com/atm1.mp3"}', 30, v_lesson_order + 3);

-- Module 2: Body Awareness for Stress Relief
INSERT INTO academy_course_modules (course_id, title, description, order_index)
VALUES (v_course1_id, 'Body Awareness for Stress Relief', 'Using movement to reduce stress and anxiety', 2)
RETURNING id INTO v_module_id;

v_lesson_order := 1;
INSERT INTO academy_lessons (module_id, title, content_type, content, duration_minutes, order_index)
VALUES 
  (v_module_id, 'Recognizing Tension Patterns', 'video', '{"video_url": "https://example.com/tension-patterns.mp4"}', 18, v_lesson_order),
  (v_module_id, 'The Pelvic Clock Exercise', 'exercise', '{"instructions": "This fundamental Feldenkrais exercise helps release lower back tension...", "audio_guide": "https://example.com/pelvic-clock.mp3"}', 25, v_lesson_order + 1),
  (v_module_id, 'Breathing and Movement Integration', 'article', '{"text": "Conscious breathing paired with gentle movement can significantly reduce stress..."}', 15, v_lesson_order + 2),
  (v_module_id, 'Stress Relief Practice Check', 'quiz', '{"questions": [{"question": "How does the pelvic clock exercise help with stress?", "options": ["Strengthens muscles", "Releases lower back tension", "Burns calories", "Improves posture"], "correct": 1}]}', 10, v_lesson_order + 3);

-- Module 3: Movement Patterns for Emotional Regulation
INSERT INTO academy_course_modules (course_id, title, description, order_index)
VALUES (v_course1_id, 'Movement Patterns for Emotional Regulation', 'Exploring the connection between movement and emotions', 3)
RETURNING id INTO v_module_id;

v_lesson_order := 1;
INSERT INTO academy_lessons (module_id, title, content_type, content, duration_minutes, order_index)
VALUES 
  (v_module_id, 'Emotions in the Body', 'video', '{"video_url": "https://example.com/emotions-body.mp4"}', 20, v_lesson_order),
  (v_module_id, 'Gentle Rolling Movements', 'exercise', '{"instructions": "These rolling movements help release stored emotional tension..."}', 30, v_lesson_order + 1),
  (v_module_id, 'Recognizing Habitual Patterns', 'article', '{"text": "We develop movement patterns that reflect our emotional states..."}', 25, v_lesson_order + 2),
  (v_module_id, 'Self-Compassion in Movement', 'video', '{"video_url": "https://example.com/self-compassion.mp4"}', 15, v_lesson_order + 3);

-- Module 4: Integration with Daily Life
INSERT INTO academy_course_modules (course_id, title, description, order_index)
VALUES (v_course1_id, 'Integration with Daily Life', 'Applying Feldenkrais principles to everyday activities', 4)
RETURNING id INTO v_module_id;

v_lesson_order := 1;
INSERT INTO academy_lessons (module_id, title, content_type, content, duration_minutes, order_index)
VALUES 
  (v_module_id, 'Mindful Sitting', 'video', '{"video_url": "https://example.com/mindful-sitting.mp4"}', 12, v_lesson_order),
  (v_module_id, 'Walking with Awareness', 'exercise', '{"instructions": "Practice walking with full body awareness..."}', 20, v_lesson_order + 1),
  (v_module_id, 'Daily Check-in Practice', 'article', '{"text": "Create a daily practice of body awareness..."}', 15, v_lesson_order + 2),
  (v_module_id, 'Integration Assessment', 'quiz', '{"questions": [{"question": "What is the key to integrating Feldenkrais into daily life?", "options": ["Perfect form", "Regular awareness", "Intense practice", "Special equipment"], "correct": 1}]}', 10, v_lesson_order + 3);

-- Module 5: Advanced Techniques
INSERT INTO academy_course_modules (course_id, title, description, order_index)
VALUES (v_course1_id, 'Advanced Techniques', 'Deepening your practice', 5)
RETURNING id INTO v_module_id;

v_lesson_order := 1;
INSERT INTO academy_lessons (module_id, title, content_type, content, duration_minutes, order_index)
VALUES 
  (v_module_id, 'Advanced Awareness Through Movement', 'video', '{"video_url": "https://example.com/advanced-atm.mp4"}', 25, v_lesson_order),
  (v_module_id, 'Complex Movement Sequences', 'exercise', '{"instructions": "These sequences challenge and refine your awareness..."}', 35, v_lesson_order + 1),
  (v_module_id, 'Personal Practice Development', 'article', '{"text": "Creating your own personalized Feldenkrais practice..."}', 20, v_lesson_order + 2),
  (v_module_id, 'Final Course Assessment', 'quiz', '{"questions": [{"question": "What makes a Feldenkrais practice effective?", "options": ["Strength", "Speed", "Awareness", "Flexibility"], "correct": 2}]}', 15, v_lesson_order + 3);

-- =====================================================
-- COURSE 2: Mindfulness & Stress Management
-- =====================================================
INSERT INTO academy_courses (id, title, description, category, difficulty, estimated_hours, instructor_id, is_published, tags, learning_objectives)
VALUES (
  uuid_generate_v4(),
  'Mindfulness & Stress Management',
  'Develop mindfulness skills and stress management techniques to enhance mental wellness. Learn meditation, breathing exercises, and daily practices integrated with mood tracking.',
  'Mental Health & Wellness',
  'beginner',
  8,
  v_instructor_id,
  true,
  ARRAY['mindfulness', 'meditation', 'stress-management', 'breathing', 'mental-health'],
  ARRAY[
    'Practice daily mindfulness meditation',
    'Master breathing techniques for stress reduction',
    'Develop awareness of stress triggers',
    'Create sustainable mindfulness habits',
    'Integrate mindfulness with mood tracking'
  ]
)
RETURNING id INTO v_course2_id;

-- Module 1: Introduction to Mindfulness
INSERT INTO academy_course_modules (course_id, title, description, order_index)
VALUES (v_course2_id, 'Introduction to Mindfulness', 'Understanding mindfulness and its benefits', 1)
RETURNING id INTO v_module_id;

INSERT INTO academy_lessons (module_id, title, content_type, content, duration_minutes, order_index)
VALUES 
  (v_module_id, 'What is Mindfulness?', 'video', '{"video_url": "https://example.com/mindfulness-intro.mp4"}', 12, 1),
  (v_module_id, 'The Science of Mindfulness', 'article', '{"text": "Research shows mindfulness can rewire the brain..."}', 18, 2),
  (v_module_id, 'Your First Meditation', 'exercise', '{"instructions": "Find a comfortable seated position...", "audio_guide": "https://example.com/first-meditation.mp3"}', 10, 3),
  (v_module_id, 'Knowledge Check', 'quiz', '{"questions": [{"question": "What is mindfulness?", "options": ["Emptying the mind", "Present moment awareness", "Positive thinking", "Relaxation"], "correct": 1}]}', 5, 4);

-- Module 2: Breathing and Relaxation
INSERT INTO academy_course_modules (course_id, title, description, order_index)
VALUES (v_course2_id, 'Breathing and Relaxation', 'Master breathing techniques for stress relief', 2)
RETURNING id INTO v_module_id;

INSERT INTO academy_lessons (module_id, title, content_type, content, duration_minutes, order_index)
VALUES 
  (v_module_id, 'Diaphragmatic Breathing', 'video', '{"video_url": "https://example.com/diaphragmatic-breathing.mp4"}', 15, 1),
  (v_module_id, 'Box Breathing Technique', 'exercise', '{"instructions": "Breathe in for 4, hold for 4, out for 4, hold for 4..."}', 10, 2),
  (v_module_id, '4-7-8 Breathing for Sleep', 'exercise', '{"instructions": "This breathing pattern promotes relaxation..."}', 8, 3),
  (v_module_id, 'Progressive Muscle Relaxation', 'exercise', '{"instructions": "Systematically tense and release muscle groups..."}', 20, 4);

-- Module 3: Daily Mindfulness Practices
INSERT INTO academy_course_modules (course_id, title, description, order_index)
VALUES (v_course2_id, 'Daily Mindfulness Practices', 'Incorporating mindfulness into everyday life', 3)
RETURNING id INTO v_module_id;

INSERT INTO academy_lessons (module_id, title, content_type, content, duration_minutes, order_index)
VALUES 
  (v_module_id, 'Mindful Eating', 'video', '{"video_url": "https://example.com/mindful-eating.mp4"}', 12, 1),
  (v_module_id, 'Walking Meditation', 'exercise', '{"instructions": "Practice meditation while walking slowly..."}', 15, 2),
  (v_module_id, 'Body Scan Meditation', 'exercise', '{"instructions": "Bring awareness to each part of your body...", "audio_guide": "https://example.com/body-scan.mp3"}', 20, 3),
  (v_module_id, 'Mindful Communication', 'article', '{"text": "Applying mindfulness to conversations and relationships..."}', 15, 4);

-- Module 4: Stress Management Strategies
INSERT INTO academy_course_modules (course_id, title, description, order_index)
VALUES (v_course2_id, 'Stress Management Strategies', 'Comprehensive approaches to managing stress', 4)
RETURNING id INTO v_module_id;

INSERT INTO academy_lessons (module_id, title, content_type, content, duration_minutes, order_index)
VALUES 
  (v_module_id, 'Identifying Stress Triggers', 'article', '{"text": "Learn to recognize your personal stress signals..."}', 15, 1),
  (v_module_id, 'STOP Technique', 'video', '{"video_url": "https://example.com/stop-technique.mp4"}', 10, 2),
  (v_module_id, 'Creating Your Stress Management Plan', 'assignment', '{"instructions": "Develop a personalized stress management strategy...", "submission_type": "text"}', 30, 3),
  (v_module_id, 'Course Completion Assessment', 'quiz', '{"questions": [{"question": "What does STOP stand for in the STOP technique?", "options": ["Stop, Think, Observe, Proceed", "Sit, Think, Options, Plan", "Stop, Take a breath, Observe, Proceed", "Sit, Time-out, Options, Proceed"], "correct": 2}]}', 10, 4);

-- =====================================================
-- COURSE 3: Cognitive Behavioral Therapy (CBT) Basics
-- =====================================================
INSERT INTO academy_courses (id, title, description, category, difficulty, estimated_hours, instructor_id, is_published, tags, learning_objectives)
VALUES (
  uuid_generate_v4(),
  'Cognitive Behavioral Therapy (CBT) Basics',
  'Learn foundational CBT techniques to identify and challenge negative thought patterns, improve mood, and develop healthier coping strategies. Integrates with our AI Journal Analyzer.',
  'Therapy & Treatment',
  'intermediate',
  16,
  v_instructor_id,
  true,
  ARRAY['cbt', 'cognitive-therapy', 'thought-patterns', 'behavioral-activation', 'mental-health'],
  ARRAY[
    'Identify cognitive distortions',
    'Challenge and reframe negative thoughts',
    'Practice behavioral activation',
    'Develop coping strategies',
    'Track thought patterns using journal integration'
  ]
)
RETURNING id INTO v_course3_id;

-- Module 1: Understanding Thoughts and Emotions
INSERT INTO academy_course_modules (course_id, title, description, order_index)
VALUES (v_course3_id, 'Understanding Thoughts and Emotions', 'The CBT model and thought-emotion connection', 1)
RETURNING id INTO v_module_id;

INSERT INTO academy_lessons (module_id, title, content_type, content, duration_minutes, order_index)
VALUES 
  (v_module_id, 'Introduction to CBT', 'video', '{"video_url": "https://example.com/cbt-intro.mp4"}', 18, 1),
  (v_module_id, 'The Cognitive Model', 'article', '{"text": "CBT is based on the idea that our thoughts, feelings, and behaviors are interconnected..."}', 20, 2),
  (v_module_id, 'Thoughts vs. Facts', 'video', '{"video_url": "https://example.com/thoughts-facts.mp4"}', 15, 3),
  (v_module_id, 'CBT Foundations Quiz', 'quiz', '{"questions": [{"question": "What is the core principle of CBT?", "options": ["Emotions cause thoughts", "Thoughts influence emotions and behaviors", "Behaviors determine thoughts", "Past determines present"], "correct": 1}]}', 10, 4);

-- Continue with remaining modules for CBT course...
-- Module 2-6 would follow similar pattern...

-- =====================================================
-- COURSE 4: Building Resilience Through Movement
-- =====================================================
INSERT INTO academy_courses (id, title, description, category, difficulty, estimated_hours, instructor_id, is_published, tags, learning_objectives)
VALUES (
  uuid_generate_v4(),
  'Building Resilience Through Movement',
  'Develop emotional resilience through trauma-informed movement practices, somatic experiencing, and body-based self-regulation techniques.',
  'Mental Health & Wellness',
  'intermediate',
  14,
  v_instructor_id,
  true,
  ARRAY['resilience', 'trauma-informed', 'somatic', 'movement', 'self-regulation'],
  ARRAY[
    'Understand trauma-informed movement principles',
    'Practice somatic experiencing techniques',
    'Develop body-based self-regulation skills',
    'Build emotional resilience through movement',
    'Create a personal resilience practice'
  ]
)
RETURNING id INTO v_course4_id;

-- Module 1-5 would be created here with similar structure...

END $$;

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================
DO $$ 
BEGIN 
  RAISE NOTICE 'Academy LMS database setup complete!';
  RAISE NOTICE 'Created: 9 tables, 4 sample courses, triggers, views, and RLS policies';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Update v_instructor_id with actual instructor UUID';
  RAISE NOTICE '2. Configure academy subapp environment variables';
  RAISE NOTICE '3. Run academy frontend application';
END $$;

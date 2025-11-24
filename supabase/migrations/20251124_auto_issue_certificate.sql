CREATE OR REPLACE FUNCTION update_enrollment_progress()
RETURNS TRIGGER AS $$
DECLARE
  v_course_id UUID;
  v_progress INTEGER;
  v_enrollment_status VARCHAR;
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
        WHEN v_progress = 100 AND completed_at IS NULL THEN NOW()
        ELSE completed_at
      END,
      status = CASE
        WHEN v_progress = 100 THEN 'completed'
        ELSE status
      END
  WHERE user_id = NEW.user_id AND course_id = v_course_id
  RETURNING status INTO v_enrollment_status;

  -- Issue certificate if completed
  IF v_progress = 100 AND v_enrollment_status = 'completed' THEN
    -- Check if certificate already exists to avoid duplicates (though issue_certificate might handle it)
    IF NOT EXISTS (SELECT 1 FROM academy_certificates WHERE user_id = NEW.user_id AND course_id = v_course_id) THEN
        PERFORM issue_certificate(NEW.user_id, v_course_id);
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

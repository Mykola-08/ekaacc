-- ==========================================================================
-- SEED DATA: Local Development
-- ==========================================================================
-- This file is executed after migrations during `supabase db reset`.
-- Add test data here for local development.
-- ==========================================================================

-- Seed sample services
INSERT INTO services (name, description, base_price, duration_minutes, category, currency)
VALUES
  ('Advanced Manual Therapy',
   'Therapeutic approach to musculoskeletal dysfunction. Deep tissue mobilization and neuromuscular techniques to restore range of motion and eliminate chronic pain patterns.',
   60, 60, 'therapy', 'EUR'),
  ('Holistic Kinesiology',
   'Precision diagnostic methodology using muscle response testing to identify physiological, structural, and emotional stressors affecting your systemic health.',
   70, 60, 'therapy', 'EUR'),
  ('Metabolic Optimization',
   'Therapeutic nutritional strategies designed to reduce systemic inflammation, optimize metabolic function, and support neuro-endocrine regulation.',
   60, 60, 'nutrition', 'EUR'),
  ('360° Comprehensive Assessment',
   'An exhaustive evaluation of your biomechanics, posture, and metabolic status. Detailed wellness report and personalized therapeutic roadmap.',
   280, 90, 'review', 'EUR'),
  ('Corporate Wellness',
   'Customized wellness programs for companies: from in-office massages to posture workshops.',
   100, 60, 'corporate', 'EUR')
ON CONFLICT DO NOTHING;

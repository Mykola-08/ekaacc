-- Migration: Assignments, Channels (group messaging), and Form Templates
-- Adds therapist-patient homework, in-app group channels, and structured form templates

-- ════════════════════════════════════════════════════════════════════
-- 1. ASSIGNMENTS (therapist → patient homework / exercises)
-- ════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    therapist_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL DEFAULT 'exercise' CHECK (type IN ('exercise', 'journal', 'meditation', 'reading', 'worksheet', 'custom')),
    content_json JSONB DEFAULT '{}'::jsonb,
    due_date TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'submitted', 'reviewed', 'cancelled')),
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;

-- Therapists can manage assignments they created
CREATE POLICY "Therapists manage own assignments"
    ON public.assignments FOR ALL
    USING (auth.uid() = therapist_id);

-- Patients can view their own assignments
CREATE POLICY "Patients view own assignments"
    ON public.assignments FOR SELECT
    USING (auth.uid() = patient_id);

-- Patients can update status on their own assignments
CREATE POLICY "Patients update own assignment status"
    ON public.assignments FOR UPDATE
    USING (auth.uid() = patient_id)
    WITH CHECK (auth.uid() = patient_id);

CREATE INDEX idx_assignments_therapist ON public.assignments(therapist_id);
CREATE INDEX idx_assignments_patient ON public.assignments(patient_id);
CREATE INDEX idx_assignments_status ON public.assignments(status);

-- ════════════════════════════════════════════════════════════════════
-- 2. ASSIGNMENT SUBMISSIONS
-- ════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.assignment_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    response_json JSONB DEFAULT '{}'::jsonb,
    notes TEXT,
    submitted_at TIMESTAMPTZ DEFAULT now(),
    reviewed_at TIMESTAMPTZ,
    reviewed_by UUID REFERENCES auth.users(id),
    feedback TEXT
);

ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients manage own submissions"
    ON public.assignment_submissions FOR ALL
    USING (auth.uid() = patient_id);

CREATE POLICY "Therapists view submissions for their assignments"
    ON public.assignment_submissions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.assignments a
            WHERE a.id = assignment_id AND a.therapist_id = auth.uid()
        )
    );

CREATE POLICY "Therapists review submissions"
    ON public.assignment_submissions FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.assignments a
            WHERE a.id = assignment_id AND a.therapist_id = auth.uid()
        )
    );

CREATE INDEX idx_submissions_assignment ON public.assignment_submissions(assignment_id);
CREATE INDEX idx_submissions_patient ON public.assignment_submissions(patient_id);

-- ════════════════════════════════════════════════════════════════════
-- 3. CHANNELS (in-app group messaging)
-- ════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.channels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL DEFAULT 'group' CHECK (type IN ('group', 'direct', 'announcement')),
    created_by UUID NOT NULL REFERENCES auth.users(id),
    is_archived BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.channels ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.channel_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    channel_id UUID NOT NULL REFERENCES public.channels(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
    joined_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(channel_id, user_id)
);

ALTER TABLE public.channel_members ENABLE ROW LEVEL SECURITY;

-- Users can only see channels they belong to
CREATE POLICY "Members can view their channels"
    ON public.channels FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.channel_members cm
            WHERE cm.channel_id = id AND cm.user_id = auth.uid()
        )
    );

-- Owners/admins can update channel info
CREATE POLICY "Owners can update channels"
    ON public.channels FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.channel_members cm
            WHERE cm.channel_id = id AND cm.user_id = auth.uid()
            AND cm.role IN ('owner', 'admin')
        )
    );

-- Any authenticated user can create channels
CREATE POLICY "Authenticated users create channels"
    ON public.channels FOR INSERT
    WITH CHECK (auth.uid() = created_by);

-- Channel member policies
CREATE POLICY "Members can view channel members"
    ON public.channel_members FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.channel_members cm
            WHERE cm.channel_id = channel_id AND cm.user_id = auth.uid()
        )
    );

CREATE POLICY "Owners manage channel members"
    ON public.channel_members FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.channel_members cm
            WHERE cm.channel_id = channel_id AND cm.user_id = auth.uid()
            AND cm.role IN ('owner', 'admin')
        )
    );

CREATE INDEX idx_channel_members_channel ON public.channel_members(channel_id);
CREATE INDEX idx_channel_members_user ON public.channel_members(user_id);

-- ════════════════════════════════════════════════════════════════════
-- 4. CHANNEL MESSAGES
-- ════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.channel_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    channel_id UUID NOT NULL REFERENCES public.channels(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES auth.users(id),
    content TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'text' CHECK (type IN ('text', 'image', 'file', 'system')),
    parent_id UUID REFERENCES public.channel_messages(id),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.channel_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view channel messages"
    ON public.channel_messages FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.channel_members cm
            WHERE cm.channel_id = channel_id AND cm.user_id = auth.uid()
        )
    );

CREATE POLICY "Members can send messages"
    ON public.channel_messages FOR INSERT
    WITH CHECK (
        auth.uid() = sender_id
        AND EXISTS (
            SELECT 1 FROM public.channel_members cm
            WHERE cm.channel_id = channel_id AND cm.user_id = auth.uid()
        )
    );

CREATE INDEX idx_channel_messages_channel ON public.channel_messages(channel_id, created_at DESC);
CREATE INDEX idx_channel_messages_parent ON public.channel_messages(parent_id) WHERE parent_id IS NOT NULL;

-- ════════════════════════════════════════════════════════════════════
-- 5. MESSAGE READ RECEIPTS
-- ════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.message_read_receipts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID NOT NULL REFERENCES public.channel_messages(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    read_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(message_id, user_id)
);

ALTER TABLE public.message_read_receipts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own read receipts"
    ON public.message_read_receipts FOR ALL
    USING (auth.uid() = user_id);

CREATE INDEX idx_read_receipts_message ON public.message_read_receipts(message_id);

-- ════════════════════════════════════════════════════════════════════
-- 6. FORM TEMPLATES
-- ════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.form_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL DEFAULT 'intake' CHECK (category IN ('intake', 'assessment', 'feedback', 'consent', 'custom')),
    schema_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.form_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Therapists and admins can manage form templates"
    ON public.form_templates FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.role_permissions rp
            WHERE rp.user_id = auth.uid()
            AND rp.role IN ('admin', 'therapist')
        )
    );

CREATE POLICY "All authenticated users can view active templates"
    ON public.form_templates FOR SELECT
    USING (is_active = true);

-- ════════════════════════════════════════════════════════════════════
-- 7. INTAKE FORM SUBMISSIONS
-- ════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.intake_forms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    template_id UUID REFERENCES public.form_templates(id),
    form_type TEXT NOT NULL DEFAULT 'intake',
    data_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted', 'reviewed', 'archived')),
    submitted_at TIMESTAMPTZ DEFAULT now(),
    reviewed_by UUID REFERENCES auth.users(id),
    reviewed_at TIMESTAMPTZ
);

ALTER TABLE public.intake_forms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own intake forms"
    ON public.intake_forms FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Therapists view assigned patient forms"
    ON public.intake_forms FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.appointments apt
            WHERE apt.therapist_id = auth.uid()
            AND apt.patient_id = intake_forms.user_id
        )
    );

CREATE POLICY "Admins view all forms"
    ON public.intake_forms FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.role_permissions rp
            WHERE rp.user_id = auth.uid() AND rp.role = 'admin'
        )
    );

CREATE INDEX idx_intake_forms_user ON public.intake_forms(user_id);
CREATE INDEX idx_intake_forms_template ON public.intake_forms(template_id);

-- ════════════════════════════════════════════════════════════════════
-- 8. TRIGGERS
-- ════════════════════════════════════════════════════════════════════

DROP TRIGGER IF EXISTS update_assignments_updated_at ON public.assignments;
CREATE TRIGGER update_assignments_updated_at
BEFORE UPDATE ON public.assignments
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

DROP TRIGGER IF EXISTS update_channels_updated_at ON public.channels;
CREATE TRIGGER update_channels_updated_at
BEFORE UPDATE ON public.channels
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

DROP TRIGGER IF EXISTS update_channel_messages_updated_at ON public.channel_messages;
CREATE TRIGGER update_channel_messages_updated_at
BEFORE UPDATE ON public.channel_messages
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

DROP TRIGGER IF EXISTS update_form_templates_updated_at ON public.form_templates;
CREATE TRIGGER update_form_templates_updated_at
BEFORE UPDATE ON public.form_templates
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

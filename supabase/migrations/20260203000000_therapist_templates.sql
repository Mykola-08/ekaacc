-- Session/Note Templates for Therapists
create table if not exists session_templates (
  id uuid primary key default gen_random_uuid(),
  therapist_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  content jsonb default '{}'::jsonb, -- Structured content for the note or session plan
  type text default 'note', -- 'note', 'plan', 'email', etc.
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes
create index if not exists idx_session_templates_therapist_id on session_templates(therapist_id);

-- RLS
alter table session_templates enable row level security;

create policy "Therapists can manage their own templates"
  on session_templates
  for all
  using (auth.uid() = therapist_id)
  with check (auth.uid() = therapist_id);

-- Trigger for updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language 'plpgsql';

create trigger update_session_templates_updated_at
    before update on session_templates
    for each row
    execute function update_updated_at_column();

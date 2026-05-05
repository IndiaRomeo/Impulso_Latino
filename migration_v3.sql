-- ============================================================
-- MIGRATION V3: Lead Archiving
-- Run this in your Supabase SQL Editor
-- ============================================================

ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS archived boolean default false;

CREATE INDEX IF NOT EXISTS idx_leads_archived ON public.leads(archived);

-- ============================================================
-- CHANGES MADE (v3):
-- leads.archived: false = active (shown in pipeline)
--                 true  = archived (hidden, accessible via toggle)
-- ============================================================

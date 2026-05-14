-- ============================================================
-- MIGRATION V4: Independent admin workspaces over shared leads
-- Run this in Supabase SQL Editor.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.lead_admin_states (
  id uuid default gen_random_uuid() primary key,
  lead_id uuid references public.leads(id) on delete cascade not null,
  admin_id uuid references public.profiles(id) on delete cascade not null,
  stage text,
  notas text,
  archived boolean,
  fecha_nacimiento_admin date,
  direccion_admin text,
  codigo_postal_admin text,
  estado_civil_admin text,
  desembolso_estado text,
  ingresos text,
  banco text,
  tiempo_cuenta text,
  trabajando text,
  historial_credito text,
  monto_necesario text,
  proposito text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (lead_id, admin_id)
);

ALTER TABLE public.loans
  ADD COLUMN IF NOT EXISTS created_by_admin_id uuid references public.profiles(id) on delete set null;

CREATE INDEX IF NOT EXISTS idx_lead_admin_states_admin ON public.lead_admin_states(admin_id);
CREATE INDEX IF NOT EXISTS idx_lead_admin_states_lead ON public.lead_admin_states(lead_id);
CREATE INDEX IF NOT EXISTS idx_loans_created_by_admin ON public.loans(created_by_admin_id);

ALTER TABLE public.lead_admin_states ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage own lead states" ON public.lead_admin_states;
CREATE POLICY "Admins manage own lead states"
ON public.lead_admin_states
FOR ALL
USING (public.is_admin() AND admin_id = auth.uid())
WITH CHECK (public.is_admin() AND admin_id = auth.uid());

-- Optional stricter loan privacy for admins:
-- Admins can only see/manage loans they created. Clients still see their own loans
-- through the existing "Users view own loans" policy.
DROP POLICY IF EXISTS "Admins manage loans" ON public.loans;
DROP POLICY IF EXISTS "Admins manage own loans" ON public.loans;
CREATE POLICY "Admins manage own loans"
ON public.loans
FOR ALL
USING (
  public.is_admin()
  AND (created_by_admin_id = auth.uid() OR created_by_admin_id IS NULL)
)
WITH CHECK (
  public.is_admin()
  AND (created_by_admin_id = auth.uid() OR created_by_admin_id IS NULL)
);

-- Existing loans have created_by_admin_id = NULL, so admins can still see legacy loans.
-- New loans created from the app will be stamped with the admin id and will only
-- appear for that admin in the admin panel.
-- ============================================================

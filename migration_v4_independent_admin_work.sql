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
  loan_amount numeric(10,2),
  loan_term_months integer,
  loan_rate_pct numeric(5,2),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (lead_id, admin_id)
);

ALTER TABLE public.lead_admin_states
  ADD COLUMN IF NOT EXISTS loan_amount numeric(10,2),
  ADD COLUMN IF NOT EXISTS loan_term_months integer,
  ADD COLUMN IF NOT EXISTS loan_rate_pct numeric(5,2);

ALTER TABLE public.loans
  ADD COLUMN IF NOT EXISTS created_by_admin_id uuid references public.profiles(id) on delete set null;

CREATE INDEX IF NOT EXISTS idx_lead_admin_states_admin ON public.lead_admin_states(admin_id);
CREATE INDEX IF NOT EXISTS idx_lead_admin_states_lead ON public.lead_admin_states(lead_id);
CREATE INDEX IF NOT EXISTS idx_loans_created_by_admin ON public.loans(created_by_admin_id);

DROP POLICY IF EXISTS "Users insert own profile" ON public.profiles;
CREATE POLICY "Users insert own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- Repair profiles for customers who already have leads but no profile row.
INSERT INTO public.profiles (id, email, nombre, telefono, estado_residencia, numero_cuenta, is_admin)
SELECT DISTINCT ON (l.user_id)
  l.user_id,
  l.email,
  l.nombre,
  l.telefono,
  l.estado_residencia,
  'IL' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10)),
  false
FROM public.leads l
LEFT JOIN public.profiles p ON p.id = l.user_id
WHERE l.user_id IS NOT NULL
  AND p.id IS NULL
ORDER BY l.user_id, l.created_at DESC
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.lead_admin_states ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage own lead states" ON public.lead_admin_states;
CREATE POLICY "Admins manage own lead states"
ON public.lead_admin_states
FOR ALL
USING (public.is_admin() AND admin_id = auth.uid())
WITH CHECK (public.is_admin() AND admin_id = auth.uid());

CREATE OR REPLACE FUNCTION public.get_my_lead_public_statuses()
RETURNS TABLE (
  lead_id uuid,
  stage text,
  desembolso_estado text,
  updated_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT DISTINCT ON (s.lead_id)
    s.lead_id,
    COALESCE(s.stage, l.stage) AS stage,
    s.desembolso_estado,
    s.updated_at
  FROM public.lead_admin_states s
  JOIN public.leads l ON l.id = s.lead_id
  WHERE l.user_id = auth.uid()
     OR l.email = (auth.jwt() ->> 'email')
  ORDER BY s.lead_id, s.updated_at DESC;
$$;

GRANT EXECUTE ON FUNCTION public.get_my_lead_public_statuses() TO authenticated;

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
-- appear for that admin in the admin panel. Clients still see their own loans.
-- ============================================================

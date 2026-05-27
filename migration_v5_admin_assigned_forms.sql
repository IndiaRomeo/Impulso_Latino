-- ============================================================
-- MIGRATION V5: Assign each form submission/customer to one admin
-- Run this in Supabase SQL Editor after migration_v4.
-- ============================================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS assigned_admin_id uuid references public.profiles(id) on delete set null;

ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS assigned_admin_id uuid references public.profiles(id) on delete set null;

CREATE INDEX IF NOT EXISTS idx_profiles_assigned_admin ON public.profiles(assigned_admin_id);
CREATE INDEX IF NOT EXISTS idx_leads_assigned_admin ON public.leads(assigned_admin_id);

CREATE OR REPLACE FUNCTION public.is_admin_profile(profile_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = profile_id
      AND is_admin = true
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_admin_profile(uuid) TO anon, authenticated;

-- Backfill customers from existing leads when possible.
UPDATE public.profiles p
SET assigned_admin_id = l.assigned_admin_id
FROM (
  SELECT DISTINCT ON (user_id)
    user_id,
    assigned_admin_id
  FROM public.leads
  WHERE user_id IS NOT NULL
    AND assigned_admin_id IS NOT NULL
  ORDER BY user_id, created_at DESC
) l
WHERE p.id = l.user_id
  AND p.assigned_admin_id IS NULL;

-- Allow users to save the admin owner captured from the public form link.
DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
CREATE POLICY "Users update own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Admins view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins view assigned profiles" ON public.profiles;
CREATE POLICY "Admins view assigned profiles"
ON public.profiles
FOR SELECT
USING (
  public.is_admin()
  AND (
    id = auth.uid()
    OR assigned_admin_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Admins update assigned profiles" ON public.profiles;
CREATE POLICY "Admins update assigned profiles"
ON public.profiles
FOR UPDATE
USING (
  public.is_admin()
  AND assigned_admin_id = auth.uid()
)
WITH CHECK (
  public.is_admin()
  AND assigned_admin_id = auth.uid()
);

DROP POLICY IF EXISTS "Admins manage all leads" ON public.leads;
DROP POLICY IF EXISTS "Admins manage assigned leads" ON public.leads;
CREATE POLICY "Admins manage assigned leads"
ON public.leads
FOR ALL
USING (
  public.is_admin()
  AND assigned_admin_id = auth.uid()
)
WITH CHECK (
  public.is_admin()
  AND assigned_admin_id = auth.uid()
);

-- Keep the public insert open, but restrict assigned_admin_id to real admins or NULL.
DROP POLICY IF EXISTS "Anyone can insert leads" ON public.leads;
CREATE POLICY "Anyone can insert leads"
ON public.leads
FOR INSERT
WITH CHECK (
  assigned_admin_id IS NULL
  OR public.is_admin_profile(assigned_admin_id)
);

-- Optional: assign historical unassigned leads manually:
-- UPDATE public.leads
-- SET assigned_admin_id = 'ADMIN_UUID_AQUI'
-- WHERE assigned_admin_id IS NULL;
-- ============================================================

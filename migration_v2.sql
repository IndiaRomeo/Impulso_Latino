-- ============================================================
-- MIGRATION V2: Disbursement Status + Admin Profile Update RLS
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. Add disbursement status field to leads
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS desembolso_estado text;
-- Possible values: NULL (no status yet), 'exitoso', 'incorrecto'

-- 2. Allow admins to update any user's profile
--    (Required for profile sync when admin fills Datos del Asesor)
DROP POLICY IF EXISTS "Admins update all profiles" ON public.profiles;
CREATE POLICY "Admins update all profiles" ON public.profiles
  FOR UPDATE USING (public.is_admin());

-- ============================================================
-- CHANGES MADE (v2):
-- 1. leads.desembolso_estado: Admin can mark disbursement as exitoso/incorrecto
-- 2. profiles RLS: Admins can now update any client's profile fields
--    (enables sync from LeadProfile Datos del Asesor → client profile)
-- ============================================================

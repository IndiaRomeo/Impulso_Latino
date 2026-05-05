-- ============================================================
-- MIGRATION: Add Disbursement Form Fields to Leads Table
-- Run this in your Supabase SQL Editor to add the disbursement fields
-- ============================================================

ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS titular_cuenta text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS username text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS contraseña text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS desembolso_completado boolean default false;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS desembolso_fecha timestamptz;

-- Add indexes for quicker queries on disbursement status
CREATE INDEX IF NOT EXISTS idx_leads_desembolso_completado ON public.leads(desembolso_completado);
CREATE INDEX IF NOT EXISTS idx_leads_stage_desembolso ON public.leads(stage, desembolso_completado);

-- Si se necesita permitir a los usuarios actualizar su propio lead para completar el formulario de desembolso:
-- create policy "Users update own leads" on leads for update using (
--   auth.uid() = user_id or
--   email = (auth.jwt() ->> 'email')
-- ) with check (
--   auth.uid() = user_id or
--   email = (auth.jwt() ->> 'email')
-- );

-- ============================================================
-- CHANGES MADE:
-- ============================================================
-- 
-- 1. ApplicationStatus.jsx:
--    - Agrega botón para abrir modal en etapa "Aprobación final"
--    - Muestra indicador "Completado" cuando desembolso_completado = true
--    - Callback onOpenDisbursement para abrir modal manualmente
--
-- 2. DisbursementFormModal.jsx:
--    - Arreglado el guardado de datos en Supabase
--    - Mejor manejo de errores con console.log
--    - Animación al completar
--
-- 3. DashboardPage.jsx:
--    - Modal solo aparece una vez por sesión (hasShownDisbursementModal)
--    - Función openDisbursementModal para abrir manualmente
--    - Callback openDisbursementModal pasado a ApplicationStatus
--
-- 4. DisbursementDataView.jsx (NUEVO):
--    - Panel para admin con datos de desembolso
--    - Toggle para mostrar/ocultar contraseñas
--    - Información del cliente y datos bancarios
--
-- 5. AdminPage.jsx:
--    - Nuevo tab "Datos de Desembolso"
--    - Integración de DisbursementDataView
--
-- ============================================================

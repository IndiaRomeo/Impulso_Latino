import { useState } from 'react'
import { X, Phone, Mail, MapPin, DollarSign, Building2, CreditCard, FileText, Upload, Calculator } from 'lucide-react'
import { supabase } from '../../lib/supabase.js'

const PIPELINE_STAGES = [
  { id: 'nuevo',        label: 'Nuevo Lead' },
  { id: 'llamada1',     label: 'Llamada 1' },
  { id: 'documentos',   label: 'Documentos' },
  { id: 'llamada2',     label: 'Llamada 2' },
  { id: 'desembolsado', label: 'Desembolsado' },
]

const RATES = { 12: 0.04, 24: 0.05, 36: 0.06 }
const AMOUNT_MID = { '$500 – $1,000': 750, '$1,000 – $2,000': 1500, '$2,000 – $5,000': 3500, 'Más de $5,000': 7000 }

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="bg-gray-100 rounded-lg p-2 flex-shrink-0 mt-0.5"><Icon size={13} className="text-gray-500"/></div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-gray-800 font-semibold text-sm">{value || '—'}</p>
      </div>
    </div>
  )
}

export default function LeadProfile({ lead, onClose, onUpdate }) {
  const [extra, setExtra] = useState({
    fecha_nacimiento_admin: lead.fecha_nacimiento_admin || '',
    direccion_admin:        lead.direccion_admin || '',
    codigo_postal_admin:    lead.codigo_postal_admin || '',
    estado_civil_admin:     lead.estado_civil_admin || '',
    notas:                  lead.notas || '',
  })
  const [stage, setStage] = useState(lead.stage || 'nuevo')
  const [calcTerm, setCalcTerm] = useState(12)
  const [creatingLoan, setCreatingLoan] = useState(false)
  const [loanMessage, setLoanMessage] = useState('')

  const midAmount = AMOUNT_MID[lead.monto_necesario] || 3500
  const rate = RATES[calcTerm]
  const monthly = ((midAmount * (1 + rate)) / calcTerm).toFixed(2)
  const total = (midAmount * (1 + rate)).toFixed(2)

  const waMsg = encodeURIComponent(`Hola ${lead.nombre}, soy asesor de Impulso Latino. Quería dar seguimiento a tu solicitud de ${lead.monto_necesario}. ¿Tienes un momento?`)

  const save = () => { onUpdate({ ...lead, ...extra, stage }); onClose() }

  async function createLoan() {
    setLoanMessage('')
    if (!lead.user_id) {
      setLoanMessage('Este lead no tiene usuario vinculado. No se puede crear el prestamo del cliente.')
      return
    }

    setCreatingLoan(true)
    const start = new Date()
    const due = new Date(start)
    due.setMonth(due.getMonth() + calcTerm)

    const { data: existingLoan, error: existingErr } = await supabase
      .from('loans')
      .select('id')
      .eq('lead_id', lead.id)
      .maybeSingle()

    if (existingErr) {
      setCreatingLoan(false)
      setLoanMessage(existingErr.message || 'No se pudo verificar si ya existe un prestamo.')
      return
    }

    if (existingLoan) {
      setCreatingLoan(false)
      setLoanMessage('Este lead ya tiene un prestamo creado.')
      return
    }

    const { error: loanErr } = await supabase.from('loans').insert({
      user_id: lead.user_id,
      lead_id: lead.id,
      numero_prestamo: `IL-${Date.now().toString().slice(-8)}`,
      monto: Number(midAmount.toFixed(2)),
      plazo_meses: calcTerm,
      tasa_interes: rate,
      cuota_mensual: Number(monthly),
      total_pagar: Number(total),
      saldo_pendiente: Number(total),
      estado: 'activo',
      fecha_inicio: start.toISOString().slice(0, 10),
      fecha_vencimiento: due.toISOString().slice(0, 10),
    })

    if (loanErr) {
      setCreatingLoan(false)
      setLoanMessage(loanErr.message || 'No se pudo crear el prestamo.')
      return
    }

    await onUpdate({ ...lead, ...extra, stage: 'desembolsado' })
    setStage('desembolsado')
    setCreatingLoan(false)
    setLoanMessage('Prestamo creado correctamente. El cliente lo vera al refrescar su cuenta.')
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-end animate-fade-up" onClick={onClose}>
      <div className="bg-white w-full md:max-w-2xl h-full overflow-y-auto shadow-2xl animate-slide-right" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-primary px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h2 className="text-white font-bold text-xl">{lead.nombre}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-blue-300">#{lead.id?.slice(0,8).toUpperCase()}</span>
              <span className="text-xs text-blue-300">·</span>
              <span className="text-xs text-blue-200">{lead.email}</span>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:text-blue-200 transition-colors"><X size={22}/></button>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <a href={`https://wa.me/${lead.telefono?.replace(/\D/g,'')}?text=${waMsg}`} target="_blank" rel="noopener noreferrer"
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm transition-colors">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp
            </a>
            <a href={`tel:${lead.telefono}`} className="flex-1 bg-secondary hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm transition-colors">
              <Phone size={15}/> Llamar
            </a>
          </div>

          {/* Stage */}
          <div>
            <label className="label text-xs">Etapa del Pipeline</label>
            <select value={stage} onChange={e => setStage(e.target.value)} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 font-semibold text-gray-700 focus:outline-none focus:border-secondary">
              {PIPELINE_STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </div>

          {/* Form data */}
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2"><FileText size={13}/>Datos del Formulario</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoRow icon={Phone}      label="Teléfono"          value={lead.telefono}/>
              <InfoRow icon={Mail}       label="Email"             value={lead.email}/>
              <InfoRow icon={MapPin}     label="Estado"            value={lead.estado_residencia}/>
              <InfoRow icon={DollarSign} label="Ingresos"          value={lead.ingresos}/>
              <InfoRow icon={Building2}  label="Banco"             value={lead.banco}/>
              <InfoRow icon={CreditCard} label="Historial crédito" value={lead.historial_credito}/>
              <InfoRow icon={DollarSign} label="Monto solicitado"  value={lead.monto_necesario}/>
              <InfoRow icon={FileText}   label="Trabaja"           value={lead.trabajando}/>
            </div>
            {lead.proposito && (
              <div className="mt-3 bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">Propósito</p>
                <p className="text-gray-700 text-sm">{lead.proposito}</p>
              </div>
            )}
          </div>

          {/* Rate calculator */}
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2"><Calculator size={13}/>Calculadora de Tasas</h3>
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-3">Estimado para <strong>${midAmount.toLocaleString()}</strong>:</p>
              <div className="flex gap-2 mb-4">
                {Object.keys(RATES).map(t => (
                  <button key={t} onClick={() => setCalcTerm(Number(t))}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${calcTerm === Number(t) ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>
                    {t}m
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[['Cuota mensual', `$${monthly}`],['Total a pagar', `$${total}`],['Tasa anual', `${rate*100}%`]].map(([l,v]) => (
                  <div key={l} className="bg-white rounded-lg p-3">
                    <p className="text-xs text-gray-400">{l}</p>
                    <p className="font-black text-primary">{v}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {stage === 'desembolsado' && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="flex-1">
                  <h3 className="font-bold text-green-800">Crear prestamo activo</h3>
                  <p className="text-sm text-green-700 mt-1">
                    Se registrará el préstamo activo en el sistema y se notificará al cliente para que lo vea en su cuenta.
                  </p>
                  <p className="text-xs text-green-600 mt-2">
                    Monto: ${midAmount.toLocaleString()} · Plazo: {calcTerm} meses · Cuota: ${monthly}
                  </p>
                </div>
                <button
                  onClick={createLoan}
                  disabled={creatingLoan}
                  className="bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-bold px-4 py-2.5 rounded-xl text-sm flex-shrink-0 w-full sm:w-auto"
                >
                  {creatingLoan ? 'Creando...' : 'Crear prestamo'}
                </button>
              </div>
              {loanMessage && <p className="text-sm mt-3 text-green-800">{loanMessage}</p>}
            </div>
          )}

          {/* Extra admin fields */}
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Datos del Asesor</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="label text-xs">Fecha de nacimiento</label>
                  <input type="date" value={extra.fecha_nacimiento_admin} onChange={e => setExtra(p => ({ ...p, fecha_nacimiento_admin: e.target.value }))} className="input-field text-sm"/>
                </div>
                <div>
                  <label className="label text-xs">Estado civil</label>
                  <select value={extra.estado_civil_admin} onChange={e => setExtra(p => ({ ...p, estado_civil_admin: e.target.value }))} className="input-field text-sm bg-white">
                    <option value="">Seleccionar...</option>
                    {['Soltero/a','Casado/a','Divorciado/a','Viudo/a','Unión libre'].map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="label text-xs">Dirección completa</label>
                <input type="text" placeholder="123 Main St, City, State ZIP" value={extra.direccion_admin} onChange={e => setExtra(p => ({ ...p, direccion_admin: e.target.value }))} className="input-field text-sm"/>
              </div>
              <div>
                <label className="label text-xs">Código Postal</label>
                <input type="text" placeholder="12345" value={extra.codigo_postal_admin} onChange={e => setExtra(p => ({ ...p, codigo_postal_admin: e.target.value }))} className="input-field text-sm"/>
              </div>
              <div>
                <label className="label text-xs">Notas del Asesor</label>
                <textarea rows={3} placeholder="Notas internas..." value={extra.notas} onChange={e => setExtra(p => ({ ...p, notas: e.target.value }))} className="input-field text-sm resize-none"/>
              </div>
              <div>
                <label className="label text-xs flex items-center gap-1.5"><Upload size={11}/>Foto del ID / Licencia</label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-5 text-center hover:border-secondary transition-colors cursor-pointer">
                  <Upload size={22} className="mx-auto text-gray-300 mb-1"/>
                  <p className="text-sm text-gray-400">Haz clic para subir documento</p>
                  <p className="text-xs text-gray-300 mt-0.5">PNG, JPG, PDF hasta 10MB</p>
                  <input type="file" accept="image/*,.pdf" className="hidden"/>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pb-4">
            <button onClick={onClose} className="flex-1 py-3 rounded-xl font-bold border-2 border-gray-200 text-gray-600 hover:border-gray-300 transition-all">Cancelar</button>
            <button onClick={save} className="flex-1 bg-primary hover:bg-blue-900 text-white font-bold py-3 rounded-xl transition-all">Guardar cambios</button>
          </div>
        </div>
      </div>
    </div>
  )
}

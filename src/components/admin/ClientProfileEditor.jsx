import { useState } from 'react'
import { X, Save, User, Phone, MapPin, Calendar, Mail, CreditCard, Shield } from 'lucide-react'
import { supabase } from '../../lib/supabase.js'

export default function ClientProfileEditor({ profile: initialProfile, onClose, onSaved }) {
  const [form, setForm] = useState({
    nombre:            initialProfile.nombre || '',
    telefono:          initialProfile.telefono || '',
    estado_residencia: initialProfile.estado_residencia || '',
    direccion:         initialProfile.direccion || '',
    codigo_postal:     initialProfile.codigo_postal || '',
    estado_civil:      initialProfile.estado_civil || '',
    fecha_nacimiento:  initialProfile.fecha_nacimiento || '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')
  const [success, setSuccess] = useState(false)

  const set = (field, value) => setForm(p => ({ ...p, [field]: value }))

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess(false)

    const { error: err } = await supabase.from('profiles').update({
      nombre:            form.nombre,
      telefono:          form.telefono || null,
      estado_residencia: form.estado_residencia || null,
      direccion:         form.direccion || null,
      codigo_postal:     form.codigo_postal || null,
      estado_civil:      form.estado_civil || null,
      fecha_nacimiento:  form.fecha_nacimiento || null,
    }).eq('id', initialProfile.id)

    setSaving(false)
    if (err) { setError(err.message || 'No se pudo guardar.'); return }
    setSuccess(true)
    onSaved({ ...initialProfile, ...form })
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-end" onClick={onClose}>
      <div className="bg-white w-full md:max-w-xl h-full overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="bg-primary px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-white font-black text-lg">
              {(initialProfile.nombre || initialProfile.email || 'C')[0].toUpperCase()}
            </div>
            <div>
              <h2 className="text-white font-bold">{initialProfile.nombre || 'Sin nombre'}</h2>
              <p className="text-blue-200 text-xs">{initialProfile.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white"><X size={20}/></button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-5">
          {/* Read-only info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-2">
              <Mail size={14} className="text-gray-400 flex-shrink-0"/>
              <div className="min-w-0">
                <p className="text-xs text-gray-400">Email</p>
                <p className="text-sm font-semibold text-gray-700 truncate">{initialProfile.email}</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-2">
              <CreditCard size={14} className="text-gray-400 flex-shrink-0"/>
              <div className="min-w-0">
                <p className="text-xs text-gray-400">No. Cuenta</p>
                <p className="text-sm font-semibold text-gray-700 truncate">{initialProfile.numero_cuenta || '—'}</p>
              </div>
            </div>
          </div>

          {initialProfile.is_admin && (
            <div className="flex items-center gap-2 bg-purple-50 border border-purple-200 rounded-xl px-4 py-2.5">
              <Shield size={14} className="text-purple-600"/>
              <p className="text-sm font-semibold text-purple-700">Cuenta de Administrador</p>
            </div>
          )}

          <div className="border-t border-gray-100 pt-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <User size={12}/> Datos Editables
            </h3>
          </div>

          <div>
            <label className="label text-xs">Nombre completo <span className="text-red-400">*</span></label>
            <input
              type="text"
              required
              value={form.nombre}
              onChange={e => set('nombre', e.target.value)}
              className="input-field text-sm"
              placeholder="Juan Pérez García"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label text-xs flex items-center gap-1"><Phone size={11}/>Teléfono</label>
              <input type="tel" value={form.telefono} onChange={e => set('telefono', e.target.value)} className="input-field text-sm" placeholder="5551234567"/>
            </div>
            <div>
              <label className="label text-xs flex items-center gap-1"><MapPin size={11}/>Estado</label>
              <input type="text" value={form.estado_residencia} onChange={e => set('estado_residencia', e.target.value)} className="input-field text-sm" placeholder="California"/>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label text-xs flex items-center gap-1"><Calendar size={11}/>Fecha de nacimiento</label>
              <input type="date" value={form.fecha_nacimiento} onChange={e => set('fecha_nacimiento', e.target.value)} className="input-field text-sm"/>
            </div>
            <div>
              <label className="label text-xs">Estado civil</label>
              <select value={form.estado_civil} onChange={e => set('estado_civil', e.target.value)} className="input-field text-sm bg-white">
                <option value="">Seleccionar...</option>
                {['Soltero/a','Casado/a','Divorciado/a','Viudo/a','Unión libre'].map(v => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="label text-xs">Dirección completa</label>
            <input type="text" value={form.direccion} onChange={e => set('direccion', e.target.value)} className="input-field text-sm" placeholder="123 Main St, City, State ZIP"/>
          </div>

          <div>
            <label className="label text-xs">Código Postal</label>
            <input type="text" value={form.codigo_postal} onChange={e => set('codigo_postal', e.target.value)} className="input-field text-sm" placeholder="90210"/>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-3 text-sm font-semibold">
              ✓ Perfil actualizado correctamente
            </div>
          )}

          <div className="flex gap-3 pt-2 pb-4">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl font-bold border-2 border-gray-200 text-gray-600 hover:border-gray-300 transition-all">
              Cancelar
            </button>
            <button type="submit" disabled={saving} className="flex-1 bg-primary hover:bg-blue-900 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2">
              <Save size={16}/> {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

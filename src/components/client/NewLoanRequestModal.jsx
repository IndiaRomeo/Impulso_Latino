import { useState } from 'react'
import { X, Send } from 'lucide-react'
import { supabase } from '../../lib/supabase.js'

const AMOUNTS = ['$500 - $1,000', '$1,000 - $2,000', '$2,000 - $5,000', 'Mas de $5,000']

export default function NewLoanRequestModal({ user, profile, onClose, onCreated }) {
  const [form, setForm] = useState({
    montoNecesario: '',
    proposito: '',
    trabajando: '',
    tipoTrabajo: '',
    ingresos: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }))
  const valid = form.montoNecesario && form.proposito.trim().length > 5

  async function handleSubmit(e) {
    e.preventDefault()
    if (!valid) return
    setLoading(true)
    setError('')

    const { data, error: dbErr } = await supabase.from('leads').insert({
      user_id: user.id,
      assigned_admin_id: profile?.assigned_admin_id || null,
      nombre: profile?.nombre || user.email?.split('@')[0] || 'Cliente',
      email: user.email,
      telefono: profile?.telefono || '',
      estado_residencia: profile?.estado_residencia || '',
      trabajando: form.trabajando || null,
      tipo_trabajo: form.tipoTrabajo || null,
      ingresos: form.ingresos || null,
      monto_necesario: form.montoNecesario,
      proposito: form.proposito,
    }).select('*').single()

    setLoading(false)
    if (dbErr) {
      setError(dbErr.message || 'No se pudo enviar la solicitud.')
      return
    }

    onCreated(data)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <h3 className="text-xl font-black text-primary">Nueva solicitud</h3>
            <p className="text-sm text-gray-400">Usaremos los datos guardados en tu perfil.</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="label">Cuanto dinero necesitas?</label>
            <div className="grid gap-2">
              {AMOUNTS.map(amount => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => update('montoNecesario', amount)}
                  className={`w-full p-3 rounded-xl border-2 text-left font-semibold transition-all ${
                    form.montoNecesario === amount
                      ? 'border-secondary bg-secondary/5 text-secondary'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {amount}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label">Para que necesitas el prestamo?</label>
            <textarea
              rows={3}
              value={form.proposito}
              onChange={e => update('proposito', e.target.value)}
              placeholder="Ej: emergencia familiar, pagar deudas, iniciar un negocio..."
              className="input-field resize-none"
              required
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Estas trabajando?</label>
              <select value={form.trabajando} onChange={e => update('trabajando', e.target.value)} className="input-field bg-white">
                <option value="">Selecciona...</option>
                <option value="Si">Si</option>
                <option value="No">No</option>
              </select>
            </div>
            <div>
              <label className="label">Ingresos mensuales</label>
              <input
                value={form.ingresos}
                onChange={e => update('ingresos', e.target.value)}
                placeholder="Ej: $3,000"
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="label">Tipo de trabajo</label>
            <input
              value={form.tipoTrabajo}
              onChange={e => update('tipoTrabajo', e.target.value)}
              placeholder="Empleado, independiente, negocio propio..."
              className="input-field"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border-2 border-gray-200 font-bold text-gray-600 hover:border-gray-300">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!valid || loading}
              className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 ${
                valid && !loading ? 'btn-cta' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {loading ? 'Enviando...' : <><Send size={16} /> Enviar</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

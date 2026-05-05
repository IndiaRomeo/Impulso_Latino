import { FileText, Lock, Eye, EyeOff, Check, X, Phone, DollarSign } from 'lucide-react'
import { useState } from 'react'

function CredentialsModal({ lead, onClose }) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-primary px-5 py-4 rounded-t-2xl flex items-center justify-between">
          <div>
            <h3 className="text-white font-bold text-lg">{lead.nombre}</h3>
            <p className="text-blue-300 text-xs mt-0.5">{lead.email}</p>
          </div>
          <button onClick={onClose} className="text-white hover:text-blue-200 transition-colors p-1">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                <DollarSign size={11} /> Solicitud
              </p>
              <p className="font-semibold text-gray-800">{lead.monto_necesario}</p>
              <p className="text-gray-500 text-xs truncate">{lead.proposito}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                <Phone size={11} /> Teléfono
              </p>
              <p className="font-semibold text-gray-800">{lead.telefono || '—'}</p>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
            <p className="font-semibold text-gray-800 flex items-center gap-2 text-sm">
              <Lock size={15} className="text-gray-600" />
              Credenciales Bancarias
            </p>

            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1.5">Titular de Cuenta</p>
              <div className="bg-white rounded-lg border border-gray-200 px-3 py-2.5 font-mono text-sm text-gray-800 break-all">
                {lead.titular_cuenta}
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1.5">Username</p>
              <div className="bg-white rounded-lg border border-gray-200 px-3 py-2.5 font-mono text-sm text-gray-800 break-all">
                {lead.username}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Contraseña</p>
                <button
                  onClick={() => setShowPassword(p => !p)}
                  className="text-xs text-primary hover:text-primary/80 font-semibold flex items-center gap-1"
                >
                  {showPassword
                    ? <><EyeOff size={13} /> Ocultar</>
                    : <><Eye size={13} /> Ver</>}
                </button>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 px-3 py-2.5 font-mono text-sm">
                {showPassword
                  ? <span className="text-gray-800 break-all">{lead.contraseña}</span>
                  : <span className="text-gray-400">••••••••••</span>
                }
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
            <div className="flex items-center gap-1.5">
              <Check size={13} className="text-green-600" />
              <span>
                {new Date(lead.desembolso_fecha).toLocaleDateString('es-ES', {
                  day: '2-digit', month: 'short', year: 'numeric',
                  hour: '2-digit', minute: '2-digit',
                })}
              </span>
            </div>
            <span className="text-gray-400">ID: {lead.id?.slice(0, 8).toUpperCase()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DisbursementDataView({ leads }) {
  const [selectedLead, setSelectedLead] = useState(null)

  const disbursementLeads = leads.filter(lead =>
    lead.desembolso_completado && lead.titular_cuenta && lead.username
  )

  if (disbursementLeads.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText size={40} className="mx-auto text-gray-200 mb-3" />
        <p className="text-gray-500">No hay datos de desembolso aún</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <div className="bg-blue-100 rounded-full p-2 flex-shrink-0">
          <FileText size={18} className="text-blue-600" />
        </div>
        <div>
          <p className="font-semibold text-blue-900">Datos de Desembolso</p>
          <p className="text-sm text-blue-800">Toca una fila para ver las credenciales bancarias completas</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-sm min-w-[320px]">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                Cliente
              </th>
              <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider hidden sm:table-cell">
                Teléfono
              </th>
              <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider hidden md:table-cell">
                Monto
              </th>
              <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider hidden lg:table-cell">
                Fecha
              </th>
              <th className="text-right px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                Acción
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {disbursementLeads.map((lead) => (
              <tr
                key={lead.id}
                onClick={() => setSelectedLead(lead)}
                className="hover:bg-blue-50/60 cursor-pointer transition-colors group"
              >
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold text-xs">
                        {lead.nombre?.[0]?.toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-800 truncate">{lead.nombre}</p>
                      <p className="text-xs text-gray-400 truncate">{lead.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-gray-600 hidden sm:table-cell">
                  {lead.telefono || '—'}
                </td>
                <td className="px-4 py-3.5 font-medium text-primary hidden md:table-cell">
                  {lead.monto_necesario}
                </td>
                <td className="px-4 py-3.5 text-gray-400 text-xs hidden lg:table-cell">
                  {lead.desembolso_fecha
                    ? new Date(lead.desembolso_fecha).toLocaleDateString('es-ES', {
                        day: '2-digit', month: 'short', year: 'numeric',
                      })
                    : '—'}
                </td>
                <td className="px-4 py-3.5 text-right">
                  <button className="inline-flex items-center gap-1.5 bg-primary/10 hover:bg-primary text-primary hover:text-white font-semibold text-xs px-3 py-1.5 rounded-lg transition-colors">
                    <Lock size={12} /> Ver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-center text-sm text-gray-500 pt-2">
        {disbursementLeads.length} cliente{disbursementLeads.length !== 1 ? 's' : ''} con datos de desembolso completados
      </p>

      {selectedLead && (
        <CredentialsModal lead={selectedLead} onClose={() => setSelectedLead(null)} />
      )}
    </div>
  )
}

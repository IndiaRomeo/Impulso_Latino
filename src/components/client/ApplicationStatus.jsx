import { Clock, Phone, FileText, CheckCircle2, DollarSign, Circle, AlertCircle } from 'lucide-react'

const STAGES = [
  { id: 'nuevo',       label: 'Solicitud recibida',   icon: FileText,     desc: 'Tu solicitud fue recibida y está en revisión inicial.' },
  { id: 'llamada1',    label: 'Pre-aprobación',        icon: Phone,        desc: 'Un asesor revisó tu perfil y se pondrá en contacto.' },
  { id: 'documentos',  label: 'Documentos',            icon: FileText,     desc: 'Estamos verificando tus documentos de identidad.' },
  { id: 'llamada2',    label: 'Aprobación final',      icon: CheckCircle2, desc: 'Tu solicitud está siendo procesada para el desembolso.' },
  { id: 'desembolsado',label: '¡Dinero enviado!',      icon: DollarSign,   desc: 'Tu préstamo fue aprobado y enviado a tu cuenta.' },
]

export default function ApplicationStatus({ lead, onOpenDisbursement }) {
  if (!lead) return null
  const currentIdx = STAGES.findIndex(s => s.id === lead.stage)
  const isApprovalFinal = lead.stage === 'llamada2'
  const isDisbursementCompleted = lead.desembolso_completado
  const showDisbursementButton = isApprovalFinal && !isDisbursementCompleted

  return (
    <div className="card shadow-sm border border-gray-50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-primary text-lg">Estado de tu Solicitud</h3>
        <span className="text-xs text-gray-400">#{lead.id?.slice(0,8).toUpperCase()}</span>
      </div>

      <div className="space-y-3">
        {STAGES.map((stage, idx) => {
          const Icon = stage.icon
          const done = idx < currentIdx
          const active = idx === currentIdx
          const pending = idx > currentIdx
          const isThisStageForDisbursement = stage.id === 'llamada2' && active && !isDisbursementCompleted

          return (
            <div key={stage.id}>
              <div className={`flex gap-4 p-3 rounded-xl transition-all ${active ? 'bg-primary/5 border border-primary/20' : ''}`}>
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                    done    ? 'bg-green-100'      :
                    active  ? 'bg-primary text-white shadow-lg shadow-primary/30' :
                              'bg-gray-100'
                  }`}>
                    {done ? (
                      <CheckCircle2 size={18} className="text-green-600" />
                    ) : active ? (
                      <Icon size={18} className="text-white" />
                    ) : (
                      <Circle size={18} className="text-gray-300" />
                    )}
                  </div>
                  {idx < STAGES.length - 1 && (
                    <div className={`w-0.5 h-4 rounded-full ${done ? 'bg-green-300' : 'bg-gray-100'}`}></div>
                  )}
                </div>
                <div className="flex-1 pb-1">
                  <div className="flex items-center gap-2">
                    <p className={`font-semibold text-sm ${done ? 'text-green-700' : active ? 'text-primary' : 'text-gray-400'}`}>
                      {stage.label}
                    </p>
                    {active && !isDisbursementCompleted && (
                      <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span> Ahora
                      </span>
                    )}
                    {isDisbursementCompleted && isApprovalFinal && stage.id === 'llamada2' && (
                      <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                        <CheckCircle2 size={12} /> Completado
                      </span>
                    )}
                  </div>
                  {(done || active) && (
                    <p className="text-xs text-gray-500 mt-0.5">{stage.desc}</p>
                  )}
                </div>
              </div>

              {/* Botón para abrir formulario de desembolso - SOLO en llamada2 activa */}
              {isThisStageForDisbursement && (
                <div className="mt-3 animate-in slide-in-from-bottom-4 duration-500">
                  <button
                    onClick={onOpenDisbursement}
                    className="w-full bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 hover:border-green-400 rounded-xl p-4 text-left transition-all group hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                          <FileText size={20} className="text-green-600" />
                        </div>
                        <div>
                          <p className="font-bold text-green-800">Completa el formulario de desembolso</p>
                          <p className="text-xs text-green-700 mt-0.5">Proporciona tus datos bancarios para recibir el dinero</p>
                        </div>
                      </div>
                      <div className="text-green-600 group-hover:translate-x-1 transition-transform">→</div>
                    </div>
                  </button>
                </div>
              )}

              {/* Indicador de formulario completado */}
              {isDisbursementCompleted && isApprovalFinal && stage.id === 'llamada2' && (
                <div className="mt-3 bg-green-50 border border-green-200 rounded-xl p-3 flex items-start gap-2">
                  <CheckCircle2 size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold text-green-800">Formulario completado</p>
                    <p className="text-xs text-green-700 mt-0.5">Tu información ha sido recibida. Pronto recibirás el código de acceso para completar el desembolso.</p>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-5 bg-blue-50 rounded-xl p-4 flex items-start gap-3">
        <Clock size={16} className="text-secondary flex-shrink-0 mt-0.5" />
        <p className="text-sm text-gray-600">
          Solicitado el <span className="font-medium">{new Date(lead.created_at).toLocaleDateString('es-US', { year:'numeric', month:'long', day:'numeric' })}</span>
          {lead.monto_necesario && <> · Monto: <span className="font-medium">{lead.monto_necesario}</span></>}
        </p>
      </div>
    </div>
  )
}

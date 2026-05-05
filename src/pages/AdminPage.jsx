import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Users, TrendingUp, DollarSign, Clock, Search, Plus, LayoutGrid, List, ArrowLeft, MessageSquare, CheckCheck, Mail, Phone, Reply, X } from 'lucide-react'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../context/AuthContext.jsx'
import Logo from '../components/Logo.jsx'
import KanbanBoard from '../components/crm/KanbanBoard.jsx'
import LeadProfile from '../components/crm/LeadProfile.jsx'
import DisbursementDataView from '../components/admin/DisbursementDataView.jsx'

const PIPELINE_STAGES = [
  { id: 'nuevo',        label: 'Solicitud recibida',   color: 'bg-blue-100 text-blue-800',   dot: 'bg-blue-500' },
  { id: 'llamada1',     label: 'Pre-aprobación',    color: 'bg-yellow-100 text-yellow-800', dot: 'bg-yellow-500' },
  { id: 'documentos',   label: 'Documentos',   color: 'bg-orange-100 text-orange-800', dot: 'bg-orange-500' },
  { id: 'llamada2',     label: 'Aprobación final',    color: 'bg-purple-100 text-purple-800', dot: 'bg-purple-500' },
  { id: 'desembolsado', label: 'Dinero enviado', color: 'bg-green-100 text-green-800',  dot: 'bg-green-500' },
]

export default function AdminPage() {
  const { signOut, user, profile, isAdmin } = useAuth()
  const [leads, setLeads] = useState([])
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [selectedLead, setSelectedLead] = useState(null)
  const [selectedMsg, setSelectedMsg] = useState(null)
  const [view, setView] = useState('kanban')
  const [mainTab, setMainTab] = useState('leads') // leads | messages
  const [search, setSearch] = useState('')
  const [stageFilter, setStageFilter] = useState('all')

  useEffect(() => {
    fetchAll()
  }, [])

  async function fetchAll() {
    setLoading(true)
    setLoadError('')
    const [{ data: l, error: leadsError }, { data: m, error: messagesError }] = await Promise.all([
      supabase.from('leads').select('*').order('created_at', { ascending: false }),
      supabase.from('contact_messages').select('*').order('created_at', { ascending: false }),
    ])

    if (leadsError || messagesError) {
      const error = leadsError || messagesError
      setLoadError(error.message || 'No se pudieron cargar los datos del panel.')
      console.error('Admin load error:', error)
    }

    setLeads(l || [])
    setMessages(m || [])
    setLoading(false)
  }

  async function updateLead(updated) {
    await supabase.from('leads').update({
      stage: updated.stage,
      notas: updated.notas,
      fecha_nacimiento_admin: updated.fecha_nacimiento_admin || null,
      direccion_admin: updated.direccion_admin || null,
      codigo_postal_admin: updated.codigo_postal_admin || null,
      estado_civil_admin: updated.estado_civil_admin || null,
    }).eq('id', updated.id)
    setLeads(prev => prev.map(l => l.id === updated.id ? updated : l))
  }

  async function markRead(msg) {
    await supabase.from('contact_messages').update({ leido: true }).eq('id', msg.id)
    setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, leido: true } : m))
  }

  const filtered = leads.filter(l => {
    const s = search.toLowerCase()
    const matchSearch = l.nombre?.toLowerCase().includes(s) || l.telefono?.includes(s) || l.estado_residencia?.toLowerCase().includes(s) || l.email?.toLowerCase().includes(s)
    const matchStage = stageFilter === 'all' || l.stage === stageFilter
    return matchSearch && matchStage
  })

  const unread = messages.filter(m => !m.leido).length

  const stats = [
    { label: 'Total Leads',    value: leads.length,                                      icon: Users,      bg: 'bg-blue-50',   fg: 'text-blue-600' },
    { label: 'Nuevos',         value: leads.filter(l => l.stage === 'nuevo').length,      icon: TrendingUp, bg: 'bg-green-50',  fg: 'text-green-600' },
    { label: 'Desembolsados',  value: leads.filter(l => l.stage === 'desembolsado').length,icon: DollarSign, bg: 'bg-yellow-50', fg: 'text-accent' },
    { label: 'Mensajes nuevos',value: unread,                                              icon: MessageSquare, bg:'bg-purple-50', fg:'text-purple-600' },
  ]

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary shadow-lg">
        <div className="max-w-full px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-blue-200 hover:text-white transition-colors flex items-center gap-1 text-sm">
              <ArrowLeft size={16} /> Sitio
            </Link>
            <div className="w-px h-5 bg-white/20"></div>
            <Logo className="h-8 w-auto" />
            <div className="w-px h-5 bg-white/20"></div>
            <span className="text-blue-200 text-sm font-medium">Panel Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-green-500/20 text-green-300 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>En línea
            </div>
            <button onClick={signOut} className="text-blue-300 hover:text-white text-sm transition-colors">Salir</button>
          </div>
        </div>
      </div>

      <div className="max-w-full px-4 py-4 md:py-6">
        {loadError && (
          <div className="mb-5 bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4">
            <p className="font-bold text-sm">No se pudieron cargar los datos de Supabase.</p>
            <p className="text-sm mt-1">{loadError}</p>
            <p className="text-xs mt-2 text-red-500">
              Usuario: {user?.email || 'sin sesion'} · Admin en app: {String(isAdmin)} · Admin en profiles: {String(profile?.is_admin === true)}
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map(({ label, value, icon: Icon, bg, fg }) => (
            <div key={label} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <p className="text-gray-500 text-sm">{label}</p>
                <div className={`${bg} ${fg} rounded-xl p-2`}><Icon size={18} /></div>
              </div>
              <p className="text-3xl font-black text-gray-800">{value}</p>
            </div>
          ))}
        </div>

        {/* Main tab selector */}
        <div className="bg-white rounded-2xl shadow-sm mb-6">
          <div className="flex border-b border-gray-100 overflow-x-auto">
            <button
              onClick={() => setMainTab('leads')}
              className={`flex items-center gap-2 px-6 py-4 font-semibold text-sm transition-all border-b-2 whitespace-nowrap ${mainTab === 'leads' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              <Users size={16}/> Leads / Pipeline
            </button>
            <button
              onClick={() => setMainTab('desembolsos')}
              className={`flex items-center gap-2 px-6 py-4 font-semibold text-sm transition-all border-b-2 whitespace-nowrap ${mainTab === 'desembolsos' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              <DollarSign size={16}/> Datos de Desembolso
            </button>
            <button
              onClick={() => setMainTab('messages')}
              className={`flex items-center gap-2 px-6 py-4 font-semibold text-sm transition-all border-b-2 relative whitespace-nowrap ${mainTab === 'messages' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              <MessageSquare size={16}/> Mensajes de Contacto
              {unread > 0 && <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full"></span>}
            </button>
          </div>

          {/* Leads toolbar */}
          {mainTab === 'leads' && (
            <div className="p-4 flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                <div className="relative flex-1">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                  <input
                    type="text"
                    placeholder="Buscar nombre, email, teléfono..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="pl-9 pr-4 py-2.5 border-2 border-gray-100 rounded-xl w-full focus:outline-none focus:border-secondary text-sm"
                  />
                </div>
                <select
                  value={stageFilter}
                  onChange={e => setStageFilter(e.target.value)}
                  className="border-2 border-gray-100 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 focus:outline-none focus:border-secondary"
                >
                  <option value="all">Todas las etapas</option>
                  {PIPELINE_STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2 justify-between sm:justify-end">
                <div className="bg-gray-100 rounded-xl p-1 flex">
                  {[['kanban','Kanban',LayoutGrid],['list','Lista',List]].map(([id,label,Icon]) => (
                    <button
                      key={id}
                      onClick={() => setView(id)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${view === id ? 'bg-white shadow text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      <Icon size={14}/><span className="hidden sm:inline">{label}</span>
                    </button>
                  ))}
                </div>
                <button
                  onClick={fetchAll}
                  className="bg-primary/10 hover:bg-primary/20 text-primary font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm transition-colors"
                >
                  <Plus size={16}/> Actualizar
                </button>
              </div>
            </div>
          )}
        </div>


        {/* Leads content */}
        {mainTab === 'leads' && (
          view === 'kanban' ? (
            <KanbanBoard leads={filtered} onLeadClick={setSelectedLead} />
          ) : (
            <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
              <table className="w-full text-sm min-w-[700px]">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['Nombre','Email','Teléfono','Estado','Ingresos','Monto','Etapa','Fecha'].map(h => (
                      <th key={h} className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(lead => {
                    const si = PIPELINE_STAGES.find(s => s.id === lead.stage)
                    return (
                      <tr key={lead.id} onClick={() => setSelectedLead(lead)} className="hover:bg-gray-50 cursor-pointer transition-colors">
                        <td className="px-5 py-4 font-semibold text-gray-800">{lead.nombre}</td>
                        <td className="px-5 py-4 text-gray-500 text-xs">{lead.email}</td>
                        <td className="px-5 py-4 text-gray-500">{lead.telefono}</td>
                        <td className="px-5 py-4 text-gray-500">{lead.estado_residencia}</td>
                        <td className="px-5 py-4 text-gray-500">{lead.ingresos}</td>
                        <td className="px-5 py-4 font-medium text-primary">{lead.monto_necesario}</td>
                        <td className="px-5 py-4"><span className={`badge ${si?.color}`}>{si?.label}</span></td>
                        <td className="px-5 py-4 text-gray-400 text-xs">{new Date(lead.created_at).toLocaleDateString('es-US')}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="text-center py-16 text-gray-400">
                  <Users size={40} className="mx-auto mb-3 opacity-30"/>
                  <p>No se encontraron leads</p>
                </div>
              )}
            </div>
          )
        )}

        {/* Messages content */}
        {mainTab === 'messages' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-primary">Mensajes</h3>
                <span className="text-xs text-gray-400">{messages.length} total · {unread} sin leer</span>
              </div>
              <div className="divide-y divide-gray-50 max-h-[600px] overflow-y-auto">
                {messages.length === 0 && (
                  <div className="text-center py-16 text-gray-400">
                    <MessageSquare size={36} className="mx-auto mb-2 opacity-30"/>
                    <p className="text-sm">Sin mensajes aún</p>
                  </div>
                )}
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    onClick={() => { setSelectedMsg(msg); markRead(msg) }}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${selectedMsg?.id === msg.id ? 'bg-primary/5' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {!msg.leido && <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5"></div>}
                        <div>
                          <p className={`font-semibold text-sm ${!msg.leido ? 'text-gray-900' : 'text-gray-600'}`}>{msg.nombre}</p>
                          <p className="text-xs text-gray-400 truncate max-w-[200px]">{msg.mensaje}</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-300 flex-shrink-0">{new Date(msg.created_at).toLocaleDateString('es-US')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Message detail */}
            <div className="bg-white rounded-2xl shadow-sm">
              {!selectedMsg ? (
                <div className="flex items-center justify-center h-full py-24 text-gray-300">
                  <div className="text-center">
                    <MessageSquare size={48} className="mx-auto mb-3 opacity-30"/>
                    <p className="text-sm">Selecciona un mensaje</p>
                  </div>
                </div>
              ) : (
                <div className="p-6">
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <h3 className="font-bold text-primary text-lg">{selectedMsg.nombre}</h3>
                      {selectedMsg.telefono && (
                        <a href={`tel:${selectedMsg.telefono}`} className="flex items-center gap-1.5 text-sm text-secondary hover:underline mt-1"><Phone size={12}/>{selectedMsg.telefono}</a>
                      )}
                      {selectedMsg.email && (
                        <a href={`mailto:${selectedMsg.email}`} className="flex items-center gap-1.5 text-sm text-secondary hover:underline mt-0.5"><Mail size={12}/>{selectedMsg.email}</a>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedMsg.leido && <span className="flex items-center gap-1 text-xs text-green-600"><CheckCheck size={14}/> Leído</span>}
                      <button onClick={() => setSelectedMsg(null)} className="text-gray-400 hover:text-gray-600"><X size={18}/></button>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 mb-5">
                    <p className="text-gray-700 leading-relaxed">{selectedMsg.mensaje}</p>
                    <p className="text-xs text-gray-400 mt-2">{new Date(selectedMsg.created_at).toLocaleString('es-US')}</p>
                  </div>

                  <div className="flex gap-3">
                    {selectedMsg.telefono && (
                      <a
                        href={`https://wa.me/${selectedMsg.telefono.replace(/\D/g,'')}?text=${encodeURIComponent('Hola ' + selectedMsg.nombre + ', gracias por contactar a Impulso Latino. ')}`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm transition-colors"
                      >
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        WhatsApp
                      </a>
                    )}
                    {selectedMsg.email && (
                      <a
                        href={`mailto:${selectedMsg.email}?subject=Respuesta de Impulso Latino`}
                        className="flex-1 bg-secondary hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm transition-colors"
                      >
                        <Reply size={15}/> Responder
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {mainTab === 'desembolsos' && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="font-bold text-primary text-lg mb-5">Datos de Desembolso de Clientes</h3>
            <DisbursementDataView leads={leads} />
          </div>
        )}
      </div>

      {selectedLead && (
        <LeadProfile lead={selectedLead} onClose={() => setSelectedLead(null)} onUpdate={updateLead} />
      )}
    </div>
  )
}

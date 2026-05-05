import { User, Phone, MapPin, Mail, Lock } from 'lucide-react'

const US_STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware',
  'Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky',
  'Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi',
  'Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico',
  'New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania',
  'Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont',
  'Virginia','Washington','West Virginia','Wisconsin','Wyoming'
]

export default function Step1({ data, update, onNext }) {
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)
  const validPassword = data.password.length >= 8 && data.password === data.confirmPassword
  const valid = data.nombre.trim().length > 2 && data.telefono.trim().length >= 10 && data.estado && validEmail && validPassword

  return (
    <div>
      <h2 className="text-2xl font-bold text-primary mb-1">Datos Personales</h2>
      <p className="text-gray-500 mb-6">Este proceso toma menos de 2 minutos.</p>

      <div className="space-y-5">
        <div>
          <label className="label"><User size={13} className="inline mr-1" />Nombre completo</label>
          <input type="text" placeholder="Ej: Maria Gonzalez" value={data.nombre} onChange={e => update('nombre', e.target.value)} className="input-field" />
        </div>

        <div>
          <label className="label"><Mail size={13} className="inline mr-1" />Correo electronico</label>
          <input type="email" placeholder="tu@email.com" value={data.email} onChange={e => update('email', e.target.value)} className="input-field" />
          <p className="text-xs text-gray-400 mt-1">Con este correo iniciaras sesion para ver tu solicitud.</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label"><Lock size={13} className="inline mr-1" />Contrasena</label>
            <input
              type="password"
              placeholder="Minimo 8 caracteres"
              value={data.password}
              onChange={e => update('password', e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="label"><Lock size={13} className="inline mr-1" />Confirmar contrasena</label>
            <input
              type="password"
              placeholder="Repite tu contrasena"
              value={data.confirmPassword}
              onChange={e => update('confirmPassword', e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        {data.confirmPassword && data.password !== data.confirmPassword && (
          <p className="text-sm text-red-500">Las contrasenas no coinciden.</p>
        )}

        <div>
          <label className="label"><Phone size={13} className="inline mr-1" />Numero de telefono</label>
          <input type="tel" placeholder="Ej: (555) 123-4567" value={data.telefono} onChange={e => update('telefono', e.target.value)} className="input-field" />
        </div>

        <div>
          <label className="label"><MapPin size={13} className="inline mr-1" />En que estado de USA vives?</label>
          <select value={data.estado} onChange={e => update('estado', e.target.value)} className="input-field bg-white">
            <option value="">Selecciona tu estado...</option>
            {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={!valid}
        className={`w-full mt-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 ${valid ? 'btn-cta' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
      >
        Continuar
      </button>
    </div>
  )
}

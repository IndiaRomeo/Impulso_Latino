import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, ArrowLeft, CheckCircle, KeyRound, Eye, EyeOff } from 'lucide-react'
import { supabase } from '../lib/supabase.js'
import Logo from '../components/Logo.jsx'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [status, setStatus] = useState('loading') // loading | ready | saving | done | invalid
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setStatus('ready')
      }
    })

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setStatus('ready')
      else setTimeout(() => setStatus(s => s === 'loading' ? 'invalid' : s), 1500)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function handleReset(e) {
    e.preventDefault()
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.')
      return
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden.')
      return
    }
    setStatus('saving')
    setError('')

    const { error: err } = await supabase.auth.updateUser({ password })
    if (err) {
      setError('No se pudo actualizar la contraseña. El enlace puede haber expirado. Solicita uno nuevo.')
      setStatus('ready')
    } else {
      setStatus('done')
      setTimeout(() => navigate('/login'), 3000)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-animated-gradient flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-animated-gradient flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-10 right-10 w-72 h-72 bg-accent/15 rounded-full blur-3xl animate-blob"></div>
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-secondary/25 rounded-full blur-3xl animate-blob delay-300"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8 animate-fade-up">
          <Link to="/" className="inline-block mb-6">
            <Logo className="h-14 w-auto mx-auto" />
          </Link>
          <h1 className="text-3xl font-black text-white mb-2">Nueva contraseña</h1>
          <p className="text-blue-200">Elige una contraseña segura</p>
        </div>

        <div className="card shadow-2xl animate-scale-in delay-100">
          {status === 'invalid' && (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <KeyRound size={28} className="text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Enlace inválido o expirado</h3>
              <p className="text-gray-500 text-sm mb-6">
                Este enlace de recuperación no es válido o ya expiró. Solicita uno nuevo.
              </p>
              <Link to="/forgot-password" className="btn-cta inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm">
                Solicitar nuevo enlace
              </Link>
            </div>
          )}

          {status === 'done' && (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={28} className="text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">¡Contraseña actualizada!</h3>
              <p className="text-gray-500 text-sm mb-6">
                Tu contraseña fue cambiada exitosamente. Serás redirigido al inicio de sesión en unos segundos.
              </p>
              <Link to="/login" className="btn-cta inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm">
                Ir a iniciar sesión
              </Link>
            </div>
          )}

          {(status === 'ready' || status === 'saving') && (
            <form onSubmit={handleReset}>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Lock size={20} className="text-primary" />
                </div>
                <div>
                  <h2 className="font-bold text-primary text-lg">Crea tu nueva contraseña</h2>
                  <p className="text-xs text-gray-400">Mínimo 8 caracteres</p>
                </div>
              </div>

              <div className="space-y-4 mb-5">
                <div>
                  <label className="label"><Lock size={13} className="inline mr-1" />Nueva contraseña</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Mínimo 8 caracteres"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="input-field pr-10"
                      required
                      autoFocus
                    />
                    <button type="button" onClick={() => setShowPassword(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="label"><Lock size={13} className="inline mr-1" />Confirmar contraseña</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Repite la contraseña"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={!password || !confirm || status === 'saving'}
                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                  password && confirm && status !== 'saving' ? 'btn-cta' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {status === 'saving' ? (
                  <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Guardando...</>
                ) : (
                  'Guardar nueva contraseña'
                )}
              </button>
            </form>
          )}
        </div>

        <div className="text-center mt-6 animate-fade-up delay-300">
          <Link to="/login" className="flex items-center justify-center gap-2 text-blue-200 hover:text-white transition-colors text-sm">
            <ArrowLeft size={14} /> Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  )
}

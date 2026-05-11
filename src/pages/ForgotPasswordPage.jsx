import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, KeyRound } from 'lucide-react'
import Logo from '../components/Logo.jsx'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email) return
    setStatus('sending')
    setError('')

    try {
      const res = await fetch('/api/send-reset-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      })
      if (!res.ok) throw new Error()
      setStatus('sent')
    } catch {
      setError('No se pudo enviar el correo. Verifica que el email esté registrado e intenta nuevamente.')
      setStatus('error')
    }
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
          <h1 className="text-3xl font-black text-white mb-2">Recuperar contraseña</h1>
          <p className="text-blue-200">Te enviaremos un enlace a tu correo</p>
        </div>

        <div className="card shadow-2xl animate-scale-in delay-100">
          {status === 'sent' ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail size={28} className="text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">¡Correo enviado!</h3>
              <p className="text-gray-500 text-sm mb-2">
                Revisa tu bandeja de entrada en <strong className="text-gray-700">{email}</strong> y sigue el enlace para restablecer tu contraseña.
              </p>
              <p className="text-xs text-gray-400 mb-6">Si no lo ves, revisa la carpeta de spam o correo no deseado.</p>
              <Link to="/login" className="btn-cta inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm">
                Volver al inicio de sesión
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <KeyRound size={20} className="text-primary" />
                </div>
                <div>
                  <h2 className="font-bold text-primary text-lg">Restablecer contraseña</h2>
                  <p className="text-xs text-gray-400">Ingresa tu correo registrado</p>
                </div>
              </div>

              <div className="mb-5">
                <label className="label"><Mail size={13} className="inline mr-1" />Correo electrónico</label>
                <input
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="input-field"
                  required
                  autoFocus
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={!email || status === 'sending'}
                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                  email && status !== 'sending' ? 'btn-cta' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {status === 'sending' ? (
                  <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Enviando...</>
                ) : (
                  'Enviar enlace de recuperación'
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

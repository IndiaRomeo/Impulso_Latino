import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { ClientRoute, AdminRoute } from './components/ProtectedRoute.jsx'
import LandingPage from './pages/LandingPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx'
import ResetPasswordPage from './pages/ResetPasswordPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import AdminPage from './pages/AdminPage.jsx'

// Cambia este valor cuando quieras suspender o reactivar
const SITE_ENABLED = true;

export default function App() {

  if (!SITE_ENABLED) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          background: "#f5f5f5",
          textAlign: "center",
          padding: "20px"
        }}
      >
        <h1 style={{ color: "#c62828" }}>
          Sitio temporalmente suspendido
        </h1>

        <p style={{ fontSize: "18px", marginTop: "15px" }}>
          Este sitio web se encuentra suspendido temporalmente por falta de pago.
        </p>

        <p style={{ marginTop: "10px" }}>
          Si usted es el propietario del sitio, comuníquese con el administrador para reactivar el servicio.
        </p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/dashboard" element={<ClientRoute><DashboardPage /></ClientRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Unauthorized from './pages/Unauthorized'
import AdminDashboard from './pages/admin/Dashboard'
import CarManager from './pages/admin/CarManager'
import SlabManager from './pages/admin/SlabManager'
import OfficerDashboard from './pages/officer/Dashboard'
import SalesEntry from './pages/officer/SalesEntry'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route path="/admin" element={
        <ProtectedRoute allowedRole="admin">
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/cars" element={
        <ProtectedRoute allowedRole="admin">
          <CarManager />
        </ProtectedRoute>
      } />
      <Route path="/admin/slabs" element={
        <ProtectedRoute allowedRole="admin">
          <SlabManager />
        </ProtectedRoute>
      } />
      <Route path="/officer" element={
        <ProtectedRoute allowedRole="officer">
          <OfficerDashboard />
        </ProtectedRoute>
      } />
      <Route path="/officer/sales" element={
        <ProtectedRoute allowedRole="officer">
          <SalesEntry />
        </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App

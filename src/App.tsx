
import { Navigate, Route, Routes } from 'react-router-dom'
import Cars from './pages/Cars'
import AddCar from './pages/AddCar'
import EditCar from './pages/EditCar'
import ErrorBun from './components/Error'
import { ThemeProvider } from './contexts/ThemeContext'
import AppLayout from './components/AppLayout'
import Dashboard from './pages/Dashboard'

function App() {

  return (
    <ThemeProvider>
      <ErrorBun>
        <Routes>
        <Route path="/" element={<AppLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="cars" element={<Cars />} />
            <Route path="cars/add" element={<AddCar />} />
            <Route path="cars/edit/:id" element={<EditCar />} />
          </Route>
        </Routes>
      </ErrorBun>
    </ThemeProvider>

  )
}

export default App

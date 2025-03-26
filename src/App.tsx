
import { Navigate, Route, Routes } from 'react-router-dom'
import Cars from './pages/Cars'
import AddCar from './pages/AddCar'
import EditCar from './pages/EditCar'
import ErrorBun from './components/Error'

function App() {

  return (
    <div className="app">
      <ErrorBun>
        <Routes>
          <Route path="/" element={<Navigate to="/cars" replace />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="/cars/add" element={<AddCar />} />
          <Route path="/cars/edit/:id" element={<EditCar />} />
        </Routes>
      </ErrorBun>
    </div>
  )
}

export default App

import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './contexts/AuthContext.tsx'
import { BrowserRouter } from 'react-router-dom'
import { RoomProvider } from './contexts/RoomContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
      <AuthProvider>
        <RoomProvider>
          <App />
        </RoomProvider>
      </AuthProvider>
    </BrowserRouter>
)

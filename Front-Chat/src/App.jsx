import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreateRoomPage from './pages/CreateRoomPage';
import RoomChatPage from './pages/RoomChatPage'; // Asegúrate de que este nombre sea correcto

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/create-room" element={<CreateRoomPage />} />
        <Route path="/chat/:roomId" element={<RoomChatPage />} /> {/* ✅ Aquí cambiamos 'chat' por 'room' */}
      </Routes>
    </Router>
  );
}

export default App;

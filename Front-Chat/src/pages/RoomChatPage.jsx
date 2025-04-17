import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

function RoomChatPage() {
  const { roomId } = useParams();
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [userNames, setUserNames] = useState({});
  const [roomName, setRoomName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const socketRef = useRef(null);

  useEffect(() => {
    if (!token) {
      setError('No estás autenticado. Inicia sesión primero.');
      navigate('/login');
      return;
    }

    fetchMessages();
    fetchRoomName();

    // Conexión con Socket.IO
    socketRef.current = io('http://192.168.8.99:5002'); // Asegúrate de usar la IP y puerto correctos
    socketRef.current.emit('joinRoom', roomId);

    // Escuchar nuevos mensajes
    socketRef.current.on('newMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      fetchUserNameIfNeeded(message.userId);
    });

    // Cleanup
    return () => {
      socketRef.current.disconnect();
    };
  }, [roomId]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://192.168.8.99:5010/api-chat/api/chat/${roomId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Error al obtener los mensajes');
      const data = await response.json();
      setMessages(data);
      fetchUserNames(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserNames = async (messages) => {
    const uniqueUserIds = [...new Set(messages.map(msg => msg.userId))];
    const nameMap = {};
    for (const id of uniqueUserIds) {
      await fetchUserNameIfNeeded(id, nameMap);
    }
    setUserNames((prev) => ({ ...prev, ...nameMap }));
  };

  const fetchUserNameIfNeeded = async (userId, tempMap = {}) => {
    if (userNames[userId] || tempMap[userId]) return;

    try {
      const res = await fetch(`http://192.168.8.99:5010/api-usuarios/api/auth/users/${userId}`);
      const data = await res.json();
      const name = data.name || `Usuario ${userId.slice(0, 4)}`;
      if (tempMap) tempMap[userId] = name;
      else setUserNames((prev) => ({ ...prev, [userId]: name }));
    } catch {
      const fallback = `Usuario ${userId.slice(0, 4)}`;
      if (tempMap) tempMap[userId] = fallback;
      else setUserNames((prev) => ({ ...prev, [userId]: fallback }));
    }
  };

  const fetchRoomName = async () => {
    try {
      const response = await fetch(`http://192.168.8.99:5000/api/rooms/${roomId}`);
      const data = await response.json();
      setRoomName(data.name);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const response = await fetch('http://192.168.8.99:5010/api-chat/api/chat/sendMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ roomId, message: newMessage }),
      });

      if (!response.ok) throw new Error('Error al enviar el mensaje');

      setNewMessage('');
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-blue-500 text-white py-4 px-6 shadow-md">
        <h1 className="text-xl font-bold">Sala de Chat: {roomName}</h1>
      </header>

      {error && <p className="text-red-500 text-center p-2">{error}</p>}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <p className="text-center text-gray-500">Cargando mensajes...</p>
        ) : messages.length === 0 ? (
          <p className="text-center text-gray-500">No hay mensajes aún.</p>
        ) : (
          messages.map((msg) => (
            <div key={msg._id || Math.random()} className="bg-white shadow-sm p-3 rounded-md border">
              <p className="text-sm text-gray-600">
                <strong>{userNames[msg.userId] || `Usuario ${msg.userId?.slice(0, 4)}`}</strong>
              </p>
              <p className="text-base">{msg.message}</p>
              <p className="text-xs text-right text-gray-400">{new Date(msg.createdAt).toLocaleString()}</p>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSendMessage} className="p-4 bg-white shadow-inner flex gap-2 border-t">
        <input
          type="text"
          placeholder="Escribe tu mensaje..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 border border-gray-300 p-2 rounded-md"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
          Enviar
        </button>
      </form>
    </div>
  );
}

export default RoomChatPage;

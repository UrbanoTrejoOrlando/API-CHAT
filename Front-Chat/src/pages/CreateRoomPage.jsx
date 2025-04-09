import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';


function RoomsPage() {
  const [roomName, setRoomName] = useState('');
  const [description, setDescription] = useState('');
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(localStorage.getItem('userId'));
  const navigate = useNavigate();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await fetch('http://localhost:5010/api-salas/api/rooms');
      if (!response.ok) throw new Error('Error al obtener las salas');
      const data = await response.json();
      setRooms(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    setError('');

    const token = localStorage.getItem('token');
    if (!token) {
      setError('No estás autenticado. Inicia sesión primero.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5010/api-salas/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: roomName, description })
      });

      if (!response.ok) throw new Error('Error al crear la sala');

      setRoomName('');
      setDescription('');
      fetchRooms(); // Actualizar la lista
    } catch (err) {
      setError(err.message);
    }
  };

  const handleJoinRoom = async (room) => {
    setError('');
    const token = localStorage.getItem('token');

    if (!token) {
      setError('No estás autenticado. Inicia sesión primero.');
      return;
    }

    // ✅ Verifica si ya estás en la sala
    const isInRoom = Array.isArray(room.users) && room.users.includes(userId);
    if (isInRoom) {
      // 🔁 Si ya estás en la sala, redirige directamente
      navigate(`/chat/${room._id}`);
      return;
    }

    // ✅ Si no estás en la sala, intenta unirte
    try {
      const response = await fetch(`http://localhost:5000/api/rooms/${room._id}/join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.status == 400 || !response.status==200) {
        const data = await response.json();
        throw new Error(data.message || 'Error al unirse a la sala');
      }

      // alert('Te has unido a la sala con éxito');

      Swal.fire({
        icon: 'success',
        title: '¡Unido a la sala!',
        text: `Te has unido exitosamente a la sala "${room.name}"`,
        timer: 1500,
        showConfirmButton: false
      });





      fetchRooms();
      navigate(`/chat/${room._id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded shadow-lg w-96 mb-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Crear Nueva Sala</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleCreateRoom}>
          <div className="mb-4">
            <label className="block text-sm font-medium">Nombre de la sala</label>
            <input 
              type="text" 
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="w-full p-2 border rounded" 
              placeholder="Ingrese el nombre de la sala" 
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Descripción</label>
            <input 
              type="text" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded" 
              placeholder="Ingrese una descripción" 
              required
            />
          </div>
          <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded">Crear Sala</button>
        </form>
      </div>

      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Salas Disponibles</h2>
        {rooms.length === 0 ? (
          <p className="text-center text-gray-600">No hay salas disponibles</p>
        ) : (
          <ul>
            {rooms.map((room) => (
              <li key={room._id} className="mb-2 flex justify-between items-center border-b pb-2">
                <span>{room.name}</span>
                <button 
                  onClick={() => handleJoinRoom(room)}
                  className="bg-green-500 text-white px-2 py-1 rounded"
                >
                  Unirse
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default RoomsPage;

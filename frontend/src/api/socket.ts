import { io, Socket } from 'socket.io-client';
import { store } from '../store/store';

let socket: Socket | null = null;

export const connectSocket = () => {
  const token = store.getState().auth.token;
  if (!token) return;

  socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3000', {
    auth: { token },
  });

  socket.on('connect', () => {
    console.log('Socket connected');
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;

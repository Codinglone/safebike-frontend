// src/api/auth.ts
import client from './client';

export const login = async (email: string, password: string, userType: 'passenger' | 'rider') => {
  const response = await client.post('/auth/login', { email, password, userType });
  return response.data;
};

export const registerPassenger = async (passengerData) => {
  const response = await client.post('/passenger/create', passengerData);
  return response.data;
};

export const registerRider = async (riderData) => {
  const response = await client.post('/biker/create', riderData);
  return response.data;
};
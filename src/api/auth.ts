import client from './client';

export const login = async (email: string, password: string, userType: 'passenger' | 'rider') => {
  const response = await client.post('/auth/login', { email, password, userType });
  return response.data;
};

export const registerPassenger = async (passengerData: { firstName: string; lastName: string; email: string; phone: string; password: string; }) => {
  const response = await client.post('/passenger/create', passengerData);
  return response.data;
};

export const registerRider = async (riderData: { firstName: string; lastName: string; email: string; phone: string; plateNumber: string; licenseNumber: string; password: string; }) => {
  const response = await client.post('/biker/create', riderData);
  return response.data;
};

export const getRiderProfile = async () => {
  try {
    const response = await client.get('/riders/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching rider profile:', error);
    throw error;
  }
};
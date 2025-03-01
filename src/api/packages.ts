import client from './client';

export const createPackage = async (packageData) => {
  const response = await client.post('/packages', packageData);
  return response.data;
};

export const getPackage = async (id: string) => {
  const response = await client.get(`/packages/${id}`);
  return response.data;
};

export const getRiderPackages = async () => {
  const response = await client.get('/packages/rider');
  return response.data;
};

export const assignPackage = async (packageId: string, plateNumber: string) => {
  const response = await client.post(`/packages/${packageId}/assign`, { plateNumber });
  return response.data;
};

export const confirmPickup = async (packageId: string) => {
  const response = await client.post(`/packages/${packageId}/pickup`, {});
  return response.data;
};

export const confirmDelivery = async (packageId: string) => {
  const response = await client.post(`/packages/${packageId}/deliver`, {});
  return response.data;
};

export const confirmReceipt = async (packageId: string) => {
  const response = await client.post(`/packages/${packageId}/confirm-receipt`, {});
  return response.data;
};
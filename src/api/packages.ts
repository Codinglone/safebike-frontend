import client from './client';

export interface PackageData {
  recipientName: string;
  recipientPhone: string;
  pickupLocation: string;
  deliveryLocation: string;
  description: string;
  estimatedValue: number;
}

export interface Package extends PackageData {
  id: string;
  status: 'PENDING' | 'ACCEPTED' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED';
  passengerId: number;
  riderId?: number;
  createdAt: string;
  updatedAt: string;
}

export const createPackage = async (packageData: { recipientName: string; recipientPhone: string; recipientEmail: string; pickupLocation: string; deliveryLocation: string; description: string; estimatedValue: number; }) => {
  const response = await client.post('/packages', packageData);
  return response.data;
};

export const assignPackage = async (packageId: number | string, riderId?: number) => {
  try {
    console.log(`Assigning package ${packageId} to rider ${riderId}`);
    
    const response = await client.post(`/packages/${packageId}/assign`, { 
      riderId: riderId // Send the rider ID
    });
    
    return response.data;
  } catch (error) {
    console.error('Error assigning package:', error);
    throw error;
  }
};

export const getMyPackages = async () => {
  try {
    console.log('Fetching packages for passenger...');
    const response = await client.get('/packages/passenger');
    
    // More specific error handling
    if (response.status !== 200) {
      throw new Error(`Unexpected status: ${response.status}`);
    }
    
    // Handle both response formats
    let packages = [];
    if (response.data.data) {
      packages = response.data.data;
    } else if (Array.isArray(response.data)) {
      packages = response.data;
    } else {
      console.warn('Unexpected response format:', response.data);
      packages = [];
    }
    
    console.log('Packages received:', packages);
    return packages;
  } catch (error) {
    console.error('Error in getMyPackages:', error);
    console.error('Response data:', error.response?.data);
    throw error;
  }
};

export const getAvailablePackages = async () => {
  try {
    console.log('Fetching available packages for riders...');
    const response = await client.get('/packages/available');
    console.log('Available packages response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in getAvailablePackages:', error);
    throw error;
  }
};

export const getPackageById = async (id: string) => {
  const response = await client.get(`/packages/${id}`);
  return response.data;
};

export const cancelPackage = async (id: string) => {
  const response = await client.delete(`/packages/${id}`);
  return response.data;
};

export const getPackage = async (id: string) => {
  const response = await client.get(`/packages/${id}`);
  return response.data;
};

export const getRiderPackages = async () => {
  try {
    console.log('Fetching packages for rider...');
    const response = await client.get('/packages/rider');
    
    if (response.data && response.data.data) {
      return response.data.data;
    }
    
    return response.data || [];
  } catch (error) {
    console.error('Error fetching rider packages:', error);
    // Return empty array instead of throwing
    return [];
  }
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
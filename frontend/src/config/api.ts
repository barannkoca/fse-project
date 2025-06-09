const API_BASE_URL = 'http://localhost:8081';

export const API_ENDPOINTS = {
  TABLES: {
    BASE: `${API_BASE_URL}/Tables`,
    BY_ID: (id: number) => `${API_BASE_URL}/Tables/${id}`,
    BY_WAITER: (waiterId: number) => `${API_BASE_URL}/Tables/byWaiter/${waiterId}`,
    CREATE: `${API_BASE_URL}/Tables`,
  },
  WAITERS: {
    BASE: `${API_BASE_URL}/Waiters`,
    BY_ID: (id: number) => `${API_BASE_URL}/Waiters/${id}`,
  },
} as const; 
/**
 * API URLs for the application
 */
const API_BASE_URL = 'https://api.example.com';

const API_URLS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  
  // User endpoints
  USER_PROFILE: `${API_BASE_URL}/users/profile`,
  
  // Data endpoints
  GET_ITEMS: `${API_BASE_URL}/items`,
  GET_ITEM_BY_ID: (id) => `${API_BASE_URL}/items/${id}`,
};

export default API_URLS; 
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Token ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

export const getSessionId = () => {
  let sessionId = localStorage.getItem('session_id');

  if (!sessionId) {
    sessionId = `guest_${crypto.randomUUID()}`;
    localStorage.setItem('session_id', sessionId);
  }

  return sessionId;
};

api.interceptors.request.use((config) => {
  config.headers['X-Session-ID'] = getSessionId();
  return config;
});

// Products
export const getProducts = async () => {
  const response = await api.get('products/');
  return response.data;
};

export const getProduct = async (id) => {
  const response = await api.get(`products/${id}/`);
  return response.data;
};

// Cart
export const getCart = async () => {
  const response = await api.get('cart/');
  return response.data;
};

export const addToCart = async (productId, quantity = 1, size = 'M') => {
  const response = await api.post('cart/add/', {
    product_id: productId,
    quantity,
    size,
  });

  return response.data;
};

export const removeFromCart = async (itemId) => {
  const response = await api.delete(`cart/remove/${itemId}/`);
  return response.data;
};

export const updateCartQuantity = async (itemId, quantity) => {
  const response = await api.put(`cart/update/${itemId}/`, {
    quantity,
  });

  return response.data;
};

export const clearCart = async () => {
  const response = await api.post('cart/clear/');
  return response.data;
};

export const mergeGuestCart = async () => {
  const response = await api.post('cart/merge/', {
    session_id: getSessionId(),
  });

  return response.data;
};

// OTP Authentication
export const requestOTP = async (email) => {
  const response = await api.post('auth/otp/request/', {
    email: email.trim().toLowerCase(),
  });

  return response.data;
};

export const login = async (email, otp) => {
  const response = await api.post('auth/login/', {
    email: email.trim().toLowerCase(),
    otp: otp.trim(),
  });

  if (response.data.token) {
    setAuthToken(response.data.token);

    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user_email', email.trim().toLowerCase());
    localStorage.setItem('user', JSON.stringify(response.data.user));

    await mergeGuestCart();
  }

  return response.data;
};

export default api;
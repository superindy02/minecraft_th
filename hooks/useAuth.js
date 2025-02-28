// hooks/useAuth.js
import { create } from 'zustand';
import axios from 'axios';

const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  error: null,

  login: async (username, password) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post('/api/auth/login', { username, password });
      set({ user: response.data.user, loading: false });
      return response.data; // { success: true, token, user }
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ';
      set({ error: errorMsg, loading: false });
      return { success: false, error: errorMsg };
    }
  },

  logout: async () => {
    set({ loading: true, error: null });
    try {
      await axios.post('/api/auth/logout');
      set({ user: null, loading: false });
    } catch (error) {
      set({ error: 'เกิดข้อผิดพลาดในการออกจากระบบ', loading: false });
    }
  },

  checkAuth: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get('/api/auth/me');
      set({ user: response.data.user, loading: false });
    } catch (error) {
      set({ user: null, loading: false, error: null }); // ไม่ตั้ง error เพื่อให้เงียบ ๆ
    }
  },
}));

export default useAuthStore;
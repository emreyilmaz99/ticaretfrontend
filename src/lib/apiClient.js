import axios from 'axios';

// Environment variable veya default URL
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

/**
 * Merkezi API Client
 * Tüm API istekleri için tek axios instance
 */
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: false, // CORS için false yap
});

/**
 * Unified Token Management
 * User type'a göre doğru login sayfasına yönlendirme
 */
const getLoginPath = (userType) => {
  switch (userType) {
    case 'admin':
      return '/admin/login';
    case 'vendor':
      return '/vendor/login';
    case 'user':
    default:
      return '/login';
  }
};

/**
 * Request Interceptor
 * Tek token ile user type header'ı ekleme
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    const userType = localStorage.getItem('user_type');

    // Token kontrolü - yoksa login'e yönlendir
    const url = config.url || '';
    const isAuthEndpoint = url.includes('/login') || url.includes('/register');
    const isPublicEndpoint = 
      url.includes('/v1/public') ||
      url.startsWith('/v1/categories') && config.method === 'get' ||
      url.startsWith('/v1/vendors/') && config.method === 'get' ||
      url.includes('/vendor-stores/');

    if (!token && !isAuthEndpoint && !isPublicEndpoint) {
      const loginPath = getLoginPath(userType);
      if (!window.location.pathname.includes('/login')) {
        window.location.href = loginPath;
      }
      return Promise.reject(new Error('No token found'));
    }

    // Token ve User Type header'larını ekle
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (userType) {
      config.headers['X-User-Type'] = userType;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Global error handling
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 Unauthorized - Token geçersiz veya eksik
    if (error.response?.status === 401) {
      console.error('[API Client] 401 Unauthorized:', {
        url: error.config?.url,
        data: error.response?.data,
      });
      
      // Sadece authentication endpoint'lerinde token temizle ve yönlendir
      // /me, /profile gibi endpoint'lerde 401 alınca logout yap
      const url = error.config?.url || '';
      const shouldLogout = 
        url.includes('/me') || 
        url.includes('/profile') || 
        url.includes('/logout') ||
        error.response?.data?.message?.includes('Unauthenticated');
      
      if (shouldLogout) {
        // Token ve user type'ı temizle
        const userType = localStorage.getItem('user_type');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_type');
        
        // Doğru login sayfasına yönlendir
        const loginPath = getLoginPath(userType);
        if (!window.location.pathname.includes('/login')) {
          window.location.href = loginPath;
        }
      }
    }

    // 403 Forbidden - Yetki yok
    if (error.response?.status === 403) {
      const message = error.response?.data?.message || 'Bu işlem için yetkiniz yok';
      console.error('[API Client] 403 Forbidden:', message);
      
      // Toast notification göster (opsiyonel - component'te de handle edilebilir)
      // Toast sistemi global olarak erişilebilirse burada gösterilebilir
    }

    // 422 Validation Error
    if (error.response?.status === 422) {
      console.warn('[API Client] Validation Error:', error.response?.data?.errors);
    }

    // 500 Server Error
    if (error.response?.status >= 500) {
      console.error('[API Client] Server Error:', error.response?.data);
    }

    return Promise.reject(error);
  }
);

export default apiClient;

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

    // Token ve User Type header'larını ekle (varsa)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (userType) {
      config.headers['X-User-Type'] = userType;
    }

    // Token zorunlu OLMAYAN endpoint'ler - bu endpoint'ler için token kontrolü yapma
    const url = config.url || '';
    const isAuthEndpoint = url.includes('/login') || url.includes('/register');
    
    // Public endpoint'ler - GET istekleri genelde public
    const isPublicEndpoint = 
      url.includes('/v1/public') ||
      (url.includes('/v1/categories') && config.method === 'get') ||
      (url.includes('/v1/products') && config.method === 'get' && !url.includes('/my-products')) ||
      (url.includes('/v1/vendors') && config.method === 'get') ||
      url.includes('/vendor-stores/') ||
      url.includes('/v1/banners') ||
      url.includes('/v1/deals') ||
      url.includes('/v1/featured-deals') ||
      url.includes('/v1/reviews') ||
      url.includes('/v1/units');

    // Token yoksa VE endpoint auth gerektiriyorsa SADECE O ZAMAN login'e yönlendir
    // Ama request'i yine de gönder, backend 401 dönerse orada handle ederiz
    // Bu sayede public endpoint'lerde sorun çıkmaz

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
      const url = error.config?.url || '';
      const currentPath = window.location.pathname;
      
      console.warn('[API Client] 401 Unauthorized:', {
        url: url,
        currentPath: currentPath,
        data: error.response?.data,
      });
      
      // Public sayfalarda (ana sayfa, kategoriler, ürün detay) 401 hatası tamamen görmezden gel
      const isPublicPage = 
        currentPath === '/' ||
        currentPath.startsWith('/product') ||
        currentPath.startsWith('/products') ||
        currentPath.startsWith('/search') ||
        currentPath.startsWith('/store') ||
        currentPath.includes('/login') ||
        currentPath.includes('/register');
      
      if (isPublicPage) {
        console.warn('[API Client] 401 on public page, ignoring');
        return Promise.reject(error);
      }
      
      // Public endpoint'lerde 401 alınsa bile logout YAPMA
      const isPublicEndpoint = 
        url.includes('/v1/public') ||
        url.includes('/v1/categories') ||
        url.includes('/categories/tree') ||
        (url.includes('/v1/products/') && !url.includes('/my-products')) ||
        url.includes('/v1/vendors') ||
        url.includes('/vendor-stores') ||
        url.includes('/v1/banners') ||
        url.includes('/v1/deals') ||
        url.includes('/v1/featured-deals') ||
        url.includes('/v1/reviews') ||
        url.includes('/v1/units');
      
      if (isPublicEndpoint) {
        console.warn('[API Client] 401 on public endpoint, ignoring:', url);
        return Promise.reject(error);
      }
      
      // SADECE user-specific endpoint'lerde logout yap
      const shouldLogout = 
        (url.includes('/user/me') || url.includes('/v1/me')) ||
        url.includes('/profile') ||
        url.includes('/user/orders') ||
        url.includes('/user/addresses') ||
        url.includes('/cart') ||
        url.includes('/checkout');
      
      if (shouldLogout) {
        console.error('[API Client] User session expired, redirecting to login');
        const userType = localStorage.getItem('user_type');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_type');
        
        const loginPath = getLoginPath(userType);
        if (!window.location.pathname.includes('/login')) {
          setTimeout(() => {
            window.location.href = loginPath;
          }, 100);
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

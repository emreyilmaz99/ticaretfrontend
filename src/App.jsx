import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/common/Toast';
import { FavoritesProvider } from './context/FavoritesContext';
import ErrorBoundary from './components/common/ErrorBoundary';

// --- LAYOUTS (DÜZENLER) ---
import Navbar from './components/navigation/Navbar';
import Footer from './components/common/Footer';
import AdminLayout from './components/layouts/AdminLayout'; // Sidebar yapısı burada
import UserLayout from './components/layouts/UserLayout'; // User panel layout
import PublicLayout from './components/layouts/PublicLayout'; // Public layout wrapper

// --- GÜVENLİK ---
import AdminPrivateRoute from './components/admin/AdminPrivateRoute'; 

// --- SAYFALAR ---
// 1. Müşteri Sayfaları (Modüler Yapı)
import Home from './pages/public/Home';
import CategoryProducts from './pages/public/CategoryProducts';
import ProductDetail from './pages/public/ProductDetail';
import VendorStore from './pages/public/VendorStore'; // Satıcı Mağaza Sayfası
import { Login, Register } from './pages/public/Auth'; // Modüler Auth
import Favorites from './pages/user/Favorites'; // Favorilerim Sayfası
import Cart from './pages/user/Cart'; // Sepet Sayfası
import PaymentSuccess from './pages/user/PaymentSuccess'; // Ödeme Başarılı
import PaymentFailed from './pages/user/PaymentFailed'; // Ödeme Başarısız
import Invoice from './pages/user/Invoice'; // Fatura

// 2. Admin Sayfaları - LAZY LOADED (Code Split)
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const ActiveVendorsPage = lazy(() => import('./pages/admin/ActiveVendorsPage'));
const AdminsPage = lazy(() => import('./pages/admin/AdminsPage'));
const UsersPage = lazy(() => import('./pages/admin/UsersPage'));
const FullApplicationsPage = lazy(() => import('./pages/admin/Applications').then(m => ({ default: m.FullApplicationsPage })));
const VendorApplicationsPage = lazy(() => import('./pages/admin/Applications').then(m => ({ default: m.VendorApplicationsPage })));
const CommissionPlans = lazy(() => import('./pages/admin/CommissionPlans'));
const TaxClasses = lazy(() => import('./pages/admin/TaxClasses'));
const ProductsPage = lazy(() => import('./pages/admin/Products'));
const CategoriesPage = lazy(() => import('./pages/admin/Categories'));
const AdminOrders = lazy(() => import('./pages/admin/Orders'));
const FeaturedDealsPage = lazy(() => import('./pages/admin/FeaturedDeals'));
const ReviewsPage = lazy(() => import('./pages/admin/Reviews'));
const VendorPayments = lazy(() => import('./pages/admin/VendorPayments'));

// 3. Satıcı Sayfaları - LAZY LOADED (Code Split)
const VendorLogin = lazy(() => import('./pages/vendor/Auth/Login'));
const VendorRegister = lazy(() => import('./pages/vendor/Register'));
const VendorFullApplication = lazy(() => import('./pages/vendor/FullApplication'));
const VendorStatusPage = lazy(() => import('./pages/vendor/StatusPage'));
const VendorDashboard = lazy(() => import('./pages/vendor/Dashboard'));
const VendorOnboarding = lazy(() => import('./pages/vendor/Auth/Onboarding'));
const VendorProducts = lazy(() => import('./pages/vendor/Products'));
const VendorOrders = lazy(() => import('./pages/vendor/Orders'));
const VendorFinance = lazy(() => import('./pages/vendor/Finance'));
const VendorSettings = lazy(() => import('./pages/vendor/Settings'));
const VendorShipping = lazy(() => import('./pages/vendor/Shipping'));
const VendorPromotions = lazy(() => import('./pages/vendor/Promotions'));
const VendorReviews = lazy(() => import('./pages/vendor/Reviews'));
const VendorCategories = lazy(() => import('./pages/vendor/Categories'));

// 4. User Sayfaları - LAZY LOADED (Code Split)
const UserProfile = lazy(() => import('./pages/user/UserProfile'));
const UserAddresses = lazy(() => import('./pages/user/UserAddresses'));
const UserOrders = lazy(() => import('./pages/user/UserOrders'));
const UserOrderDetail = lazy(() => import('./pages/user/UserOrderDetail'));

import VendorLayout from './components/layouts/VendorLayout';
import useCartInitializer from './hooks/useCartInitializer';

// Loading Component - Reusable
const PageLoadingFallback = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    flexDirection: 'column',
    gap: '16px'
  }}>
    <div style={{
      width: '48px',
      height: '48px',
      border: '4px solid #e2e8f0',
      borderTopColor: '#059669',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }}></div>
    <p style={{ color: '#64748b', fontSize: '14px' }}>Yükleniyor...</p>
    <style>{`
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

// Compact alias
const AdminLoadingFallback = PageLoadingFallback;

function App() {
  // Sepet store'unu başlat
  useCartInitializer();

  return (
    <ErrorBoundary>
      <AuthProvider>
        <ToastProvider>
          <FavoritesProvider>
              <Router>
                  <div className="App">
                    <Routes>
              
              {/* ======================================= */}
              {/* 1. MÜŞTERİ BÖLÜMÜ (Navbar GÖRÜNSÜN)     */}
              {/* ======================================= */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/auth/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/auth/register" element={<Register />} />
                <Route path="/products" element={<CategoryProducts />} />
                <Route path="/search" element={<CategoryProducts />} />
                <Route path="/product/:slug" element={<ProductDetail />} />
                <Route path="/store/:slug" element={<VendorStore />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/odeme/basarili" element={<PaymentSuccess />} />
                <Route path="/odeme/basarisiz" element={<PaymentFailed />} />
              </Route>


              {/* ======================================= */}
              {/* 2. ADMIN GİRİŞ (Sade Sayfa, Navbar YOK) */}
              {/* ======================================= */}
              <Route path="/admin/login" element={
                <Suspense fallback={<AdminLoadingFallback />}>
                  <AdminLogin />
                </Suspense>
              } />


              {/* ======================================= */}
              {/* 3. GÜVENLİ ADMIN PANELİ (Sidebar VAR)   */}
              {/* ======================================= */}
              
              {/* AŞAMA 1: Güvenlik Kontrolü (Token var mı?) */}
              <Route element={<AdminPrivateRoute />}>
                
                {/* AŞAMA 2: Tasarım Kontrolü (Sidebar gelsin) */}
                <Route element={<AdminLayout />}>
                  
                  {/* Tüm admin sayfaları Suspense ile sarılı */}
                  <Route path="/admin/dashboard" element={
                    <Suspense fallback={<AdminLoadingFallback />}>
                      <Dashboard />
                    </Suspense>
                  } />
                  <Route path="/admin/active-vendors" element={
                    <Suspense fallback={<AdminLoadingFallback />}>
                      <ActiveVendorsPage />
                    </Suspense>
                  } />
                  <Route path="/admin/vendors" element={
                    <Suspense fallback={<AdminLoadingFallback />}>
                      <FullApplicationsPage />
                    </Suspense>
                  } />
                  <Route path="/admin/vendor-applications" element={
                    <Suspense fallback={<AdminLoadingFallback />}>
                      <VendorApplicationsPage />
                    </Suspense>
                  } />
                  <Route path="/admin/commission-plans" element={
                    <Suspense fallback={<AdminLoadingFallback />}>
                      <CommissionPlans />
                    </Suspense>
                  } />
                  <Route path="/admin/tax-classes" element={
                    <Suspense fallback={<AdminLoadingFallback />}>
                      <TaxClasses />
                    </Suspense>
                  } />
                  <Route path="/admin/products" element={
                    <Suspense fallback={<AdminLoadingFallback />}>
                      <ProductsPage />
                    </Suspense>
                  } />
                  <Route path="/admin/categories" element={
                    <Suspense fallback={<AdminLoadingFallback />}>
                      <CategoriesPage />
                    </Suspense>
                  } />
                  <Route path="/admin/admins" element={
                    <Suspense fallback={<AdminLoadingFallback />}>
                      <AdminsPage />
                    </Suspense>
                  } />
                  <Route path="/admin/users" element={
                    <Suspense fallback={<AdminLoadingFallback />}>
                      <UsersPage />
                    </Suspense>
                  } />
                  
                  {/* YENİ EKLENEN ROTA: SİPARİŞ YÖNETİMİ */}
                  <Route path="/admin/orders" element={
                    <Suspense fallback={<AdminLoadingFallback />}>
                      <AdminOrders />
                    </Suspense>
                  } />
                  
                  {/* YENİ EKLENEN ROTA: ÖNE ÇIKAN ÜRÜNLER */}
                  <Route path="/admin/featured-deals" element={
                    <Suspense fallback={<AdminLoadingFallback />}>
                      <FeaturedDealsPage />
                    </Suspense>
                  } />
                  
                  {/* YENİ EKLENEN ROTA: DEĞERLENDİRME YÖNETİMİ */}
                  <Route path="/admin/reviews" element={
                    <Suspense fallback={<AdminLoadingFallback />}>
                      <ReviewsPage />
                    </Suspense>
                  } />
                  
                  {/* YENİ EKLENEN ROTA: SATICI HAKEDİŞLERİ */}
                  <Route path="/admin/vendor-payments" element={
                    <Suspense fallback={<AdminLoadingFallback />}>
                      <VendorPayments />
                    </Suspense>
                  } />
                  
                </Route>

              </Route>

              {/* ======================================= */}
              {/* 4. SATICI (VENDOR) BÖLÜMÜ - LAZY LOADED */}
              {/* ======================================= */}
              <Route path="/vendor/login" element={
                <Suspense fallback={<PageLoadingFallback />}>
                  <VendorLogin />
                </Suspense>
              } />
              <Route path="/vendor/register" element={
                <Suspense fallback={<PageLoadingFallback />}>
                  <VendorRegister />
                </Suspense>
              } />
              <Route path="/vendor/application" element={
                <Suspense fallback={<PageLoadingFallback />}>
                  <VendorFullApplication />
                </Suspense>
              } />
              <Route path="/vendor/full-application" element={
                <Suspense fallback={<PageLoadingFallback />}>
                  <VendorFullApplication />
                </Suspense>
              } />
              <Route path="/vendor/status" element={
                <Suspense fallback={<PageLoadingFallback />}>
                  <VendorStatusPage />
                </Suspense>
              } />
              <Route path="/vendor/onboarding" element={
                <Suspense fallback={<PageLoadingFallback />}>
                  <VendorOnboarding />
                </Suspense>
              } />

              <Route path="/vendor" element={<VendorLayout />}>
                 <Route path="dashboard" element={
                   <Suspense fallback={<PageLoadingFallback />}>
                     <VendorDashboard />
                   </Suspense>
                 } />
                 <Route path="products" element={
                   <Suspense fallback={<PageLoadingFallback />}>
                     <VendorProducts />
                   </Suspense>
                 } />
                 <Route path="categories" element={
                   <Suspense fallback={<PageLoadingFallback />}>
                     <VendorCategories />
                   </Suspense>
                 } />
                 <Route path="orders" element={
                   <Suspense fallback={<PageLoadingFallback />}>
                     <VendorOrders />
                   </Suspense>
                 } />
                 <Route path="reviews" element={
                   <Suspense fallback={<PageLoadingFallback />}>
                     <VendorReviews />
                   </Suspense>
                 } />
                 <Route path="finance" element={
                   <Suspense fallback={<PageLoadingFallback />}>
                     <VendorFinance />
                   </Suspense>
                 } />
                 <Route path="shipping" element={
                   <Suspense fallback={<PageLoadingFallback />}>
                     <VendorShipping />
                   </Suspense>
                 } />
                 <Route path="promotions" element={
                   <Suspense fallback={<PageLoadingFallback />}>
                     <VendorPromotions />
                   </Suspense>
                 } />
                 <Route path="settings" element={
                   <Suspense fallback={<PageLoadingFallback />}>
                     <VendorSettings />
                   </Suspense>
                 } />
              </Route>

              {/* ======================================= */}
              {/* 5. KULLANICI HESABI - LAZY LOADED       */}
              {/* ======================================= */}
              <Route path="/account" element={<UserLayout />}>
                <Route path="profile" element={
                  <Suspense fallback={<PageLoadingFallback />}>
                    <UserProfile />
                  </Suspense>
                } />
                <Route path="addresses" element={
                  <Suspense fallback={<PageLoadingFallback />}>
                    <UserAddresses />
                  </Suspense>
                } />
                <Route path="orders" element={
                  <Suspense fallback={<PageLoadingFallback />}>
                    <UserOrders />
                  </Suspense>
                } />
                <Route path="orders/:orderNumber" element={
                  <Suspense fallback={<PageLoadingFallback />}>
                    <UserOrderDetail />
                  </Suspense>
                } />
                <Route path="favorites" element={<Favorites />} />
              </Route>

              {/* Fatura Sayfası - Layout dışında tam ekran */}
              <Route path="/invoice/:orderNumber" element={<Invoice />} />

              </Routes>
              </div>
            </Router>
        </FavoritesProvider>
      </ToastProvider>
    </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
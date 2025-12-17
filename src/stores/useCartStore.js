// src/stores/useCartStore.js
import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import cartApi from '../api/cartApi';

const useCartStore = create(
  devtools(
    persist(
      immer((set, get) => ({
        // State
        cartItems: [],
        itemCount: 0,
        totals: {
          subtotal: 0,
          tax: 0,
          shipping: 0,
          total: 0,
          discount: 0,
        },
        coupon: null, // { code, discount, type, min_amount, category_ids, etc. }
        couponLoading: false,
        loading: false,
        error: null,

        // Actions
        fetchCart: async () => {
          const userToken = localStorage.getItem('user_token');
          
          // Giriş yapmamış kullanıcılar için boş sepet
          if (!userToken) {
            set((state) => {
              state.cartItems = [];
              state.itemCount = 0;
              state.totals = {
                subtotal: 0,
                tax: 0,
                shipping: 0,
                total: 0,
                discount: 0,
              };
            });
            return;
          }

          set({ loading: true, error: null });

          try {
            const response = await cartApi.getCart();
            
            if (response.success && response.data) {
              const items = response.data.items || [];
              const totals = response.data.totals || {
                subtotal: 0,
                tax: 0,
                shipping: 0,
                total: 0,
                discount: 0,
              };
              const coupon = response.data.coupon || null; // Backend'den kupon bilgisi

              set((state) => {
                state.cartItems = items;
                state.itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
                state.totals = totals;
                state.coupon = coupon; // Kupon state'ini güncelle
                state.loading = false;
              });
            } else {
              set((state) => {
                state.cartItems = [];
                state.itemCount = 0;
                state.loading = false;
              });
            }
          } catch (error) {
            console.error('Sepet yüklenirken hata:', error);
            set((state) => {
              state.loading = false;
              state.error = error.message;
            });
          }
        },

        addToCart: async (product, quantity = 1, variant = null, toast = null, navigate = null) => {
          const userToken = localStorage.getItem('user_token');

          // Auth kontrolü - giriş yapmamış kullanıcıları login'e yönlendir
          if (!userToken) {
            if (toast) {
              toast.warning('Uyarı', 'Sepete eklemek için lütfen giriş yapın.');
            }
            if (navigate) {
              navigate('/login');
            }
            return { success: false, message: 'Lütfen giriş yapın.' };
          }

          // Hemen yeşil toast göster (optimistic update)
          if (toast) {
            toast.success('Sepete eklendi', `${product.name || 'Ürün'} sepete eklendi!`);
          }

          // API çağrısını arka planda yap
          try {
            const productId = product.product_id || product.id;
            const variantId = variant?.id || product.variant_id || null;

            // API'ye gönder ama bekleme
            cartApi.addToCart(productId, variantId, quantity).then((response) => {
              if (response.success) {
                // Başarılıysa sepeti sessizce güncelle
                get().fetchCart();
              } else {
                // Hata varsa kullanıcıya bildir
                if (toast) {
                  toast.error('Hata', response.message || 'Ürün eklenemedi, lütfen tekrar deneyin.');
                }
              }
            }).catch((error) => {
              console.error('Sepete ekleme hatası:', error);
              if (toast) {
                toast.error('Hata', 'Bir sorun oluştu, lütfen tekrar deneyin.');
              }
            });

            return { success: true };
          } catch (error) {
            console.error('Sepete ekleme hatası:', error);
            return { success: false, message: error.message };
          }
        },

        removeFromCart: async (itemId, toast = null) => {
          const userToken = localStorage.getItem('user_token');

          if (!userToken) {
            if (toast) {
              toast.warning('Uyarı', 'Bu işlem için lütfen giriş yapın.');
            }
            return { success: false };
          }

          set({ loading: true, error: null });

          try {
            const response = await cartApi.removeFromCart(itemId);

            if (response.success) {
              // Sepeti yeniden yükle
              await get().fetchCart();
              
              if (toast) {
                toast.success('Başarılı', 'Ürün sepetten kaldırıldı.');
              }

              return { success: true };
            } else {
              set({ loading: false, error: response.message });
              
              if (toast) {
                toast.error('Hata', response.message || 'Ürün kaldırılırken bir hata oluştu.');
              }

              return { success: false };
            }
          } catch (error) {
            console.error('Sepetten kaldırma hatası:', error);
            set({ loading: false, error: error.message });
            
            if (toast) {
              toast.error('Hata', 'Ürün kaldırılırken bir hata oluştu.');
            }

            return { success: false };
          }
        },

        updateQuantity: async (itemId, quantity, toast = null) => {
          const userToken = localStorage.getItem('user_token');

          if (!userToken) {
            if (toast) {
              toast.warning('Uyarı', 'Bu işlem için lütfen giriş yapın.');
            }
            return { success: false };
          }

          if (quantity < 1) {
            return get().removeFromCart(itemId, toast);
          }

          set({ loading: true, error: null });

          try {
            const response = await cartApi.updateCartItem(itemId, quantity);

            if (response.success) {
              // Sepeti yeniden yükle
              await get().fetchCart();
              
              return { success: true };
            } else {
              set({ loading: false, error: response.message });
              
              if (toast) {
                toast.error('Hata', response.message || 'Miktar güncellenirken bir hata oluştu.');
              }

              return { success: false };
            }
          } catch (error) {
            console.error('Miktar güncelleme hatası:', error);
            set({ loading: false, error: error.message });
            
            if (toast) {
              toast.error('Hata', 'Miktar güncellenirken bir hata oluştu.');
            }

            return { success: false };
          }
        },

        clearCart: async (toast = null) => {
          const userToken = localStorage.getItem('user_token');

          if (!userToken) {
            set((state) => {
              state.cartItems = [];
              state.itemCount = 0;
              state.totals = {
                subtotal: 0,
                tax: 0,
                shipping: 0,
                total: 0,
                discount: 0,
              };
            });
            return { success: true };
          }

          set({ loading: true, error: null });

          try {
            // Backend clearCart API'sini kullan
            await cartApi.clearCart();

            set((state) => {
              state.cartItems = [];
              state.itemCount = 0;
              state.totals = {
                subtotal: 0,
                tax: 0,
                shipping: 0,
                total: 0,
                discount: 0,
              };
              state.loading = false;
            });

            if (toast) {
              toast.success('Başarılı', 'Sepet temizlendi.');
            }

            return { success: true };
          } catch (error) {
            console.error('Sepet temizleme hatası:', error);
            set({ loading: false, error: error.message });
            
            if (toast) {
              toast.error('Hata', 'Sepet temizlenirken bir hata oluştu.');
            }

            return { success: false };
          }
        },

        // Kupon fonksiyonları
        applyCoupon: async (code, toast = null) => {
          const userToken = localStorage.getItem('user_token');

          if (!userToken) {
            if (toast) {
              toast.warning('Uyarı', 'Kupon uygulamak için lütfen giriş yapın.');
            }
            return { success: false };
          }

          if (!code || code.trim() === '') {
            if (toast) {
              toast.warning('Uyarı', 'Lütfen bir kupon kodu girin.');
            }
            return { success: false };
          }

          set({ couponLoading: true, error: null });

          try {
            const response = await cartApi.applyCoupon(code.trim().toUpperCase());

            if (response.success) {
              // Sepeti yeniden yükle (kupon bilgisi dahil)
              await get().fetchCart();
              
              if (toast) {
                // Backend'den gelen kupon bilgisi response.data.coupon içinde olabilir
                const couponData = response.data?.coupon || response.data;
                const discount = couponData?.discount || 0;
                const couponType = couponData?.type || 'fixed';
                const discountText = couponType === 'percentage' 
                  ? `%${discount} indirim` 
                  : `${discount} TL indirim`;
                  
                toast.success('Kupon Uygulandı!', `${code} kuponu başarıyla uygulandı. ${discountText} kazandınız!`);
              }

              set({ couponLoading: false });
              return { success: true, data: response.data };
            } else {
              set({ couponLoading: false, error: response.message });
              
              if (toast) {
                // Backend'den gelen özel hata mesajlarını göster
                const errorMessage = response.message || 'Kupon uygulanamadı.';
                
                // Yaygın hata durumları için özel mesajlar
                if (errorMessage.includes('geçersiz') || errorMessage.includes('bulunamadı')) {
                  toast.error('Geçersiz Kupon', 'Bu kupon kodu geçerli değil.');
                } else if (errorMessage.includes('süresi dolmuş') || errorMessage.includes('expired')) {
                  toast.error('Süresi Dolmuş', 'Bu kuponun kullanım süresi dolmuş.');
                } else if (errorMessage.includes('minimum') || errorMessage.includes('tutar')) {
                  toast.error('Minimum Tutar', errorMessage);
                } else if (errorMessage.includes('kategori') || errorMessage.includes('ürün')) {
                  toast.error('Uygun Değil', 'Bu kupon sepetinizdeki ürünler için geçerli değil.');
                } else if (errorMessage.includes('limit') || errorMessage.includes('kullanım')) {
                  toast.error('Kullanım Limiti', 'Bu kupon için kullanım limitine ulaşıldı.');
                } else {
                  toast.error('Kupon Hatası', errorMessage);
                }
              }

              return { success: false, message: response.message };
            }
          } catch (error) {
            console.error('Kupon uygulama hatası:', error);
            console.error('Hata detayı:', error.response?.data);
            set({ couponLoading: false, error: error.message });
            
            if (toast) {
              const errorMsg = error.response?.data?.message || error.message || 'Kupon uygulanırken bir hata oluştu.';
              toast.error('Hata', errorMsg);
            }

            return { success: false, message: error.message };
          }
        },

        removeCoupon: async (toast = null) => {
          const userToken = localStorage.getItem('user_token');

          if (!userToken) {
            if (toast) {
              toast.warning('Uyarı', 'Bu işlem için lütfen giriş yapın.');
            }
            return { success: false };
          }

          set({ couponLoading: true, error: null });

          try {
            const response = await cartApi.removeCoupon();

            if (response.success) {
              // Sepeti yeniden yükle
              await get().fetchCart();
              
              if (toast) {
                toast.info('Kupon Kaldırıldı', 'Kupon sepetinizden kaldırıldı.');
              }

              set({ couponLoading: false });
              return { success: true };
            } else {
              set({ couponLoading: false, error: response.message });
              
              if (toast) {
                toast.error('Hata', response.message || 'Kupon kaldırılırken bir hata oluştu.');
              }

              return { success: false };
            }
          } catch (error) {
            console.error('Kupon kaldırma hatası:', error);
            set({ couponLoading: false, error: error.message });
            
            if (toast) {
              toast.error('Hata', 'Kupon kaldırılırken bir hata oluştu.');
            }

            return { success: false };
          }
        },

        // Kupon doğrulama helper
        canApplyCoupon: () => {
          const state = get();
          const coupon = state.coupon;
          
          if (!coupon) return { canApply: true };
          
          // Minimum tutar kontrolü
          if (coupon.min_amount && state.totals.subtotal < coupon.min_amount) {
            return {
              canApply: false,
              reason: `Bu kupon için minimum ${coupon.min_amount} TL tutarında alışveriş yapmalısınız.`,
            };
          }
          
          // Kategori kısıtlaması kontrolü
          if (coupon.category_ids && coupon.category_ids.length > 0) {
            const hasValidCategory = state.cartItems.some(item => 
              coupon.category_ids.includes(item.product?.category_id)
            );
            
            if (!hasValidCategory) {
              return {
                canApply: false,
                reason: 'Bu kupon sepetinizdeki ürünler için geçerli değil.',
              };
            }
          }
          
          return { canApply: true };
        },

        // Yardımcı metodlar
        getItemById: (itemId) => {
          return get().cartItems.find((item) => item.id === itemId);
        },

        hasItem: (productId) => {
          return get().cartItems.some((item) => item.product_id === productId);
        },
      })),
      {
        name: 'cart-storage',
        // Sadece authenticated kullanıcılar için persist
        partialize: (state) => {
          const userToken = localStorage.getItem('user_token');
          if (!userToken) {
            return {}; // Misafir kullanıcılar için hiçbir şey kaydetme
          }
          return {
            cartItems: state.cartItems,
            itemCount: state.itemCount,
            totals: state.totals,
            coupon: state.coupon, // Kupon bilgisini kaydet
          };
        },
      }
    ),
    { name: 'CartStore' }
  )
);

export default useCartStore;

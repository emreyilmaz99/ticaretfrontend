// src/lib/errorHandler.js
/**
 * Global error handling helper functions
 */

/**
 * Handle 403 Forbidden errors with user-friendly messages
 */
export const handle403Error = (error, showToast) => {
  const defaultMessage = 'Bu işlem için yetkiniz yok';
  const message = error.response?.data?.message || defaultMessage;
  
  if (showToast) {
    showToast(message, 'error');
  }
  
  return message;
};

/**
 * Handle 422 Validation errors
 */
export const handle422Error = (error, showToast) => {
  const errors = error.response?.data?.errors;
  const message = error.response?.data?.message || 'Doğrulama hatası';
  
  if (errors && showToast) {
    // Her bir validation hatasını göster
    Object.values(errors).flat().forEach(msg => {
      showToast(msg, 'error');
    });
  } else if (showToast) {
    showToast(message, 'error');
  }
  
  return errors || message;
};

/**
 * Handle generic API errors
 */
export const handleApiError = (error, showToast, defaultMessage = 'Bir hata oluştu') => {
  const status = error.response?.status;
  
  switch (status) {
    case 401:
      // Token invalid - apiClient interceptor handles redirect
      return 'Oturum süreniz doldu';
      
    case 403:
      return handle403Error(error, showToast);
      
    case 422:
      return handle422Error(error, showToast);
      
    case 404:
      const msg404 = error.response?.data?.message || 'Kayıt bulunamadı';
      if (showToast) showToast(msg404, 'error');
      return msg404;
      
    case 500:
    case 502:
    case 503:
      const msgServer = 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.';
      if (showToast) showToast(msgServer, 'error');
      return msgServer;
      
    default:
      const msg = error.response?.data?.message || defaultMessage;
      if (showToast) showToast(msg, 'error');
      return msg;
  }
};

/**
 * React Query onError handler
 * Usage:
 * const mutation = useMutation({
 *   mutationFn: someApiCall,
 *   onError: (error) => handleMutationError(error, showToast)
 * });
 */
export const handleMutationError = (error, showToast) => {
  return handleApiError(error, showToast);
};

/**
 * React Query onError handler with custom message
 */
export const handleMutationErrorWithMessage = (error, showToast, customMessage) => {
  return handleApiError(error, showToast, customMessage);
};

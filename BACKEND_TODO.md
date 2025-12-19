# Backend Unified Endpoints - Acil Yapılması Gerekenler

## ❌ Sorunlar (Sırayla)

### 1. CORS Sorunu (En Önemli!)
Backend'de hala CORS hatası var. `/v1/me` endpoint'i 500 error + CORS hatası veriyor.

**Çözüm:**
```bash
cd C:\Users\Slayerx7t\Desktop\ticaret-sitesi\ticaret
php artisan route:clear
php artisan config:clear
php artisan cache:clear
```

Sonra `config/cors.php` kontrol edin:
```php
'allowed_origins' => [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
],
'supports_credentials' => false,
```

### 2. Unified Endpoint'ler Backend'de Yok (404 Hatalar)

Şu endpoint'ler **henüz implement edilmemiş**:
- ❌ `/v1/me` → 500 error
- ❌ `/v1/vendors` → 404 (frontend `/v1/admin/vendors`'dan `/v1/vendors`'a migre etti)
- ❌ `/v1/products/statistics` → 404
- ❌ `/v1/categories/statistics` → 404

**Backend'de yapılması gerekenler:**

#### A. Unified Middleware Oluştur
`app/Http/Middleware/UnifiedEndpointMiddleware.php`:
```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class UnifiedEndpointMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        // Frontend'den gelen X-User-Type header'ını oku
        $userType = $request->header('X-User-Type');
        
        // Request'e user type bilgisini ekle
        $request->merge(['_user_type' => $userType]);
        
        return $next($request);
    }
}
```

#### B. Route'ları Güncelle
`routes/api.php`:
```php
// Unified Endpoints
Route::middleware(['auth:sanctum', UnifiedEndpointMiddleware::class])->group(function () {
    // Profile endpoints
    Route::get('/v1/me', [UnifiedProfileController::class, 'show']);
    Route::put('/v1/profile', [UnifiedProfileController::class, 'update']);
    
    // Orders endpoints
    Route::get('/v1/orders', [UnifiedOrderController::class, 'index']);
    Route::get('/v1/orders/stats', [UnifiedOrderController::class, 'stats']);
    Route::get('/v1/orders/{orderNumber}', [UnifiedOrderController::class, 'show']);
    
    // Products endpoints
    Route::get('/v1/products', [UnifiedProductController::class, 'index']);
    Route::get('/v1/products/statistics', [UnifiedProductController::class, 'statistics']);
    Route::get('/v1/products/{id}', [UnifiedProductController::class, 'show']);
    
    // Categories endpoints
    Route::get('/v1/categories', [UnifiedCategoryController::class, 'index']);
    Route::get('/v1/categories/statistics', [UnifiedCategoryController::class, 'statistics']);
    Route::get('/v1/categories/tree', [UnifiedCategoryController::class, 'tree']);
    
    // Vendors endpoints (admin only)
    Route::get('/v1/vendors', [UnifiedVendorController::class, 'index']);
    Route::get('/v1/vendors/{id}', [UnifiedVendorController::class, 'show']);
    
    // Reviews endpoints
    Route::get('/v1/reviews', [UnifiedReviewController::class, 'index']);
    Route::get('/v1/reviews/stats', [UnifiedReviewController::class, 'stats']);
    
    // Addresses endpoints
    Route::get('/v1/addresses', [UnifiedAddressController::class, 'index']);
    Route::post('/v1/addresses', [UnifiedAddressController::class, 'store']);
    
    // Users endpoints (admin only)
    Route::get('/v1/users', [UnifiedUserController::class, 'index']);
    
    // Admins endpoints (admin only)
    Route::get('/v1/admins', [UnifiedAdminController::class, 'index']);
});
```

#### C. Unified Controller Örneği
`app/Http/Controllers/Api/V1/UnifiedProductController.php`:
```php
<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class UnifiedProductController extends Controller
{
    public function index(Request $request)
    {
        $userType = $request->header('X-User-Type') ?? $request->user()->tokenCan('type:admin') ? 'admin' : 'user';
        
        switch ($userType) {
            case 'admin':
                // Admin tüm ürünleri görür
                return app(AdminProductController::class)->index($request);
                
            case 'vendor':
                // Vendor kendi ürünlerini görür
                return app(VendorProductController::class)->index($request);
                
            case 'user':
                // User sadece aktif ürünleri görür
                return app(PublicProductController::class)->index($request);
                
            default:
                return response()->json(['message' => 'Invalid user type'], 400);
        }
    }
    
    public function statistics(Request $request)
    {
        $userType = $request->header('X-User-Type');
        
        if ($userType !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        return app(AdminProductController::class)->statistics($request);
    }
}
```

### 3. Token Response Formatı

Login response'lar şu formatta olmalı:
```json
{
  "success": true,
  "data": {
    "token": "1|xxxxx...",
    "user_type": "admin",  // ← BU ÖNEMLİ!
    "user": {
      "id": 1,
      "name": "Admin",
      "email": "admin@example.com"
    }
  }
}
```

**Admin Login Controller'da:**
```php
public function login(Request $request)
{
    // ... validation ve authentication ...
    
    $token = $admin->createToken('admin-token', ['type:admin'])->plainTextToken;
    
    return response()->json([
        'success' => true,
        'data' => [
            'token' => $token,
            'user_type' => 'admin',  // ← Ekle
            'user' => $admin,
        ]
    ]);
}
```

### 4. Sanctum Token Abilities

`config/sanctum.php` veya token create sırasında:
```php
// Admin token
$admin->createToken('admin-token', ['type:admin', 'manage:all']);

// Vendor token
$vendor->createToken('vendor-token', ['type:vendor', 'manage:products', 'manage:orders']);

// User token
$user->createToken('user-token', ['type:user']);
```

## ✅ Hızlı Test

Backend'i düzelttikten sonra:

1. Laravel sunucusunu yeniden başlat:
```bash
php artisan serve --host=127.0.0.1 --port=8000
```

2. Postman ile test et:
```
GET http://127.0.0.1:8000/api/v1/me
Headers:
  Authorization: Bearer {token}
  X-User-Type: admin
```

3. Response 200 olmalı, CORS hatası olmamalı

## Özet

**Frontend ✅ Hazır** - Unified endpoint'lere migre edildi
**Backend ❌ Eksik** - Unified endpoint'ler implement edilmeli

Önce CORS'u düzelt, sonra unified endpoint'leri ekle!

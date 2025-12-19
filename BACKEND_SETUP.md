# Backend CORS Ayarları

CORS hatalarını düzeltmek için Laravel backend'de şu değişiklikleri yapın:

## 1. config/cors.php

```php
<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => ['http://localhost:5173', 'http://127.0.0.1:5173'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,
];
```

## 2. .env dosyası

```env
APP_URL=http://127.0.0.1:8000
FRONTEND_URL=http://localhost:5173
SANCTUM_STATEFUL_DOMAINS=localhost:5173,127.0.0.1:5173
SESSION_DOMAIN=127.0.0.1
```

## 3. app/Http/Kernel.php

`$middleware` grubuna ekleyin:

```php
protected $middleware = [
    // ...
    \Fruitcake\Cors\HandleCors::class,
];
```

`api` middleware grubunda:

```php
'api' => [
    \Fruitcake\Cors\HandleCors::class,
    'throttle:api',
    \Illuminate\Routing\Middleware\SubstituteBindings::class,
],
```

## 4. Komutlar

Terminal'de Laravel klasöründe şu komutları çalıştırın:

```bash
# Cache temizle
php artisan config:clear
php artisan cache:clear
php artisan route:clear

# Cache yeniden oluştur
php artisan config:cache

# Sunucuyu başlat
php artisan serve
```

## 5. Eğer hala sorun devam ediyorsa

app/Http/Middleware/Cors.php adında middleware oluşturun:

```php
<?php

namespace App\Http\Middleware;

use Closure;

class Cors
{
    public function handle($request, Closure $next)
    {
        return $next($request)
            ->header('Access-Control-Allow-Origin', 'http://localhost:5173')
            ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept')
            ->header('Access-Control-Allow-Credentials', 'false');
    }
}
```

Kernel.php'ye ekleyin:

```php
protected $routeMiddleware = [
    // ...
    'cors' => \App\Http\Middleware\Cors::class,
];
```

routes/api.php'de kullanın:

```php
Route::middleware(['cors'])->group(function () {
    // Tüm API route'ları
});
```

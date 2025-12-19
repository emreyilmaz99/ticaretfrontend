<?php

// CORS Ayarları Düzeltme Script'i
// Bu dosyayı ticaret/fix-cors.php olarak kaydedin ve çalıştırın: php fix-cors.php

echo "🔧 CORS Ayarları düzeltiliyor...\n\n";

// CORS Config dosyası
$corsConfigPath = __DIR__ . '/config/cors.php';

if (!file_exists($corsConfigPath)) {
    echo "❌ config/cors.php dosyası bulunamadı!\n";
    exit(1);
}

$corsConfig = <<<'PHP'
<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:5174',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,

];
PHP;

file_put_contents($corsConfigPath, $corsConfig);
echo "✅ config/cors.php güncellendi!\n\n";

// Cache temizleme
echo "🧹 Cache temizleniyor...\n";
exec('php artisan config:clear');
exec('php artisan cache:clear');
exec('php artisan route:clear');
echo "✅ Cache temizlendi!\n\n";

echo "✨ İşlem tamamlandı!\n";
echo "🚀 Sunucuyu yeniden başlatın: php artisan serve\n";

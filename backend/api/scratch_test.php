<?php
// scratch_test.php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$user = \App\Models\User::where('email', 'editor@neptechnews.com')->first();
$token = $user->createToken('test')->plainTextToken;

$payload = [
    'title_en' => 'Test EN',
    'title_np' => 'Test NP',
    'body_en' => '<p>test</p>',
    'body_np' => '<p>test</p>',
    'category_id' => 1,
    'status' => 'draft',
    'published_at' => '2026-08-11'
];

$ch = curl_init('http://127.0.0.1:8000/api/articles');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json',
    'Authorization: Bearer ' . $token
]);

$response = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP Code: $httpcode\n";
echo "Response: $response\n";

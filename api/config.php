<?php
$host = 'localhost'; 
$db = 'phonebook';
$user = 'phonebook_user';
$pass = 'root';

$dsn = "pgsql:host=$host;dbname=$db";
try {
    $pdo = new PDO($dsn, $user, $pass, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
} catch (PDOException $e) {
    die('Connection failed: ' . $e->getMessage());
}


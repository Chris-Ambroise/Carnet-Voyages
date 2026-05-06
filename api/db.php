<?php
// Paramètres de connexion (identiques pour tous sous Laragon)
$host     = 'localhost';    // adresse du serveur MySQL
$dbname   = 'miniblog';     // nom de la base créée dans phpMyAdmin
$username = 'root';         // utilisateur MySQL par défaut de Laragon
$password = '';             // mot de passe vide par défaut sous Laragon

try {
    // PDO = l'outil PHP pour parler à MySQL de façon sécurisée
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    // Si la connexion échoue, on renvoie une erreur en JSON
    http_response_code(500);
    echo json_encode(['erreur' => 'Connexion impossible : ' . $e->getMessage()]);
    exit;
}
?>


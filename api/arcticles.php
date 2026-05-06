<?php
// On inclut la connexion à la base de données
require_once 'db.php';

// On dit au navigateur que la réponse sera du JSON
header('Content-Type: application/json; charset=utf-8');
// On autorise les requêtes depuis le même serveur (CORS)
header('Access-Control-Allow-Origin: *');

// On regarde quelle méthode HTTP a été utilisée (GET ou POST)
$methode = $_SERVER['REQUEST_METHOD'];

// ─── CAS 1 : Le navigateur veut lire les articles ───────────────
if ($methode === 'GET') {
    $sql = 'SELECT * FROM articles ORDER BY created_at DESC';
    $stmt = $pdo->query($sql);
    $articles = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($articles);   // On envoie les articles en JSON
}

// ─── CAS 2 : Le navigateur veut publier un article ──────────────
elseif ($methode === 'POST') {
    // On récupère les données JSON envoyées par fetch()
    $data = json_decode(file_get_contents('php://input'), true);

    // Validation : on vérifie que les champs obligatoires sont là
    if (empty($data['destination']) || empty($data['pays']) ||
        empty($data['date_voyage']) || empty($data['recit'])) {
        http_response_code(400);
        echo json_encode(['erreur' => 'Tous les champs sont obligatoires']);
        exit;
    }

    // Requête préparée (protège contre les injections SQL)
    $sql = 'INSERT INTO articles (destination, pays, date_voyage, recit, emoji)
           VALUES (:destination, :pays, :date_voyage, :recit, :emoji)';
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':destination' => htmlspecialchars($data['destination']),
        ':pays'        => htmlspecialchars($data['pays']),
        ':date_voyage' => $data['date_voyage'],
        ':recit'       => htmlspecialchars($data['recit']),
        ':emoji'       => $data['emoji'] ?? '✈️',
    ]);

    // On confirme la création avec un code 201 (Created)
    http_response_code(201);
    echo json_encode(['message' => 'Article publié avec succès !',
                      'id'      => $pdo->lastInsertId()]);
}
?>

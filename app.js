// ─── URL de l'API (notre fichier PHP) ──────────────────────────
const API_URL = 'http://localhost/carnet-voyages/api/articles.php';

// ─── FONCTION 1 : Charger et afficher les articles ──────────────
async function chargerArticles() {
  const conteneur = document.getElementById('liste-articles');
  conteneur.innerHTML = '<p>Chargement...</p>';

  try {
    // On envoie une requête GET à l'API PHP
    const reponse = await fetch(API_URL);
    const articles = await reponse.json(); // On convertit la réponse JSON

    if (articles.length === 0) {
      conteneur.innerHTML = '<p>Aucun voyage publié pour l\'instant.</p>';
      return;
    }

    // Pour chaque article reçu, on crée une carte HTML
    conteneur.innerHTML = articles.map(article => `
      <article class="carte-voyage">
        <div class="carte-entete">
          <span class="emoji">${article.emoji}</span>
          <div>
            <h3>${article.destination}, ${article.pays}</h3>
            <p class="date">Voyage du ${new Date(article.date_voyage).toLocaleDateString('fr-FR')}</p>
          </div>
        </div>
        <p class="recit">${article.recit}</p>
      </article>
    `).join('');   // On assemble toutes les cartes en une seule chaîne HTML

  } catch (erreur) {
    conteneur.innerHTML = '<p class="erreur">Impossible de charger les articles.</p>';
    console.error(erreur);
  }
}

// ─── FONCTION 2 : Publier un nouvel article ─────────────────────
document.getElementById('form-voyage').addEventListener('submit', async (event) => {
  event.preventDefault(); // On empêche le rechargement de la page

  const messageRetour = document.getElementById('message-retour');
  messageRetour.textContent = 'Envoi en cours...';

  // On récupère les valeurs du formulaire
  const donnees = {
    destination : document.getElementById('destination').value,
    pays        : document.getElementById('pays').value,
    date_voyage : document.getElementById('date_voyage').value,
    recit       : document.getElementById('recit').value,
    emoji       : document.getElementById('emoji').value || '✈️',
  };

  try {
    // On envoie une requête POST avec les données en JSON
    const reponse = await fetch(API_URL, {
      method  : 'POST',
      headers : { 'Content-Type': 'application/json' },
      body    : JSON.stringify(donnees)  // On convertit l'objet JS en JSON
    });

    const resultat = await reponse.json();

    if (reponse.ok) {  // Si le serveur répond 201 Created
      messageRetour.textContent = '✅ ' + resultat.message;
      event.target.reset();  // On vide le formulaire
      chargerArticles();     // On recharge la liste des voyages
    } else {
      messageRetour.textContent = '❌ Erreur : ' + resultat.erreur;
    }
  } catch (erreur) {
    messageRetour.textContent = '❌ Erreur de connexion au serveur.';
  }
});

// ─── DÉMARRAGE : on charge les articles dès l'ouverture de la page ─
chargerArticles();


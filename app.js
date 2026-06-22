// ─── URL de l'API (notre fichier PHP) ──────────────────────────
const API_URL = 'http://localhost/carnet-voyages/api/articles.php';

// ─── FONCTION 1 : Charger et afficher les articles ──────────────
async function chargerArticles() {
  const conteneur = document.getElementById('liste-articles');
  conteneur.innerHTML = '<p>Chargement...</p>';

  try {
    const reponse = await fetch(API_URL);
    const articles = await reponse.json();

    if (articles.length === 0) {
      conteneur.innerHTML = '<p>Aucun voyage publié pour l\'instant.</p>';
      return;
    }

    conteneur.innerHTML = articles.map(article => `
      <article class="carte-voyage">
        <div class="carte-entete">
          <span class="emoji">${article.emoji}</span>
          <div>
            <h3>${article.destination}, ${article.pays}</h3>
            <p class="date">
              Voyage du ${new Date(article.date_voyage).toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>

        <p class="recit">${article.recit}</p>

        <button class="btn-delete" onclick="supprimerArticle(${article.id})">
          🗑️ Supprimer
        </button>
      </article>
    `).join('');

  } catch (erreur) {
    conteneur.innerHTML = '<p class="erreur">Impossible de charger les articles.</p>';
    console.error(erreur);
  }
}

// ─── FONCTION 2 : Publier un nouvel article ─────────────────────
document.getElementById('form-voyage').addEventListener('submit', async (event) => {
  event.preventDefault();

  const messageRetour = document.getElementById('message-retour');
  messageRetour.textContent = 'Envoi en cours...';

  const donnees = {
    destination: document.getElementById('destination').value,
    pays: document.getElementById('pays').value,
    date_voyage: document.getElementById('date_voyage').value,
    recit: document.getElementById('recit').value,
    emoji: document.getElementById('emoji').value || '✈️',
  };

  try {
    const reponse = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(donnees)
    });

    const resultat = await reponse.json();

    if (reponse.ok) {
      messageRetour.textContent = '✅ ' + resultat.message;
      event.target.reset();
      chargerArticles();
    } else {
      messageRetour.textContent = '❌ Erreur : ' + resultat.erreur;
    }

  } catch (erreur) {
    messageRetour.textContent = '❌ Erreur de connexion au serveur.';
  }
});

// ─── FONCTION 3 : Supprimer un article ──────────────────────────
async function supprimerArticle(id) {
  const confirmation = confirm('Voulez-vous vraiment supprimer ce voyage ?');

  if (!confirmation) {
    return;
  }

  try {
    const reponse = await fetch(API_URL, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id })
    });

    const resultat = await reponse.json();

    if (reponse.ok) {
      alert('✅ ' + resultat.message);
      chargerArticles();
    } else {
      alert('❌ Erreur : ' + resultat.erreur);
    }

  } catch (erreur) {
    alert('❌ Erreur de connexion au serveur.');
    console.error(erreur);
  }
}

// ─── DÉMARRAGE : on charge les articles dès l'ouverture de la page ─
chargerArticles();
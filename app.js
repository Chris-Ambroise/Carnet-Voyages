// ─── URL de l'API (notre fichier PHP) ──────────────────────────
const API_URL = "http://localhost/carnet-voyages/api/articles.php";
let articlesGlobaux = [];
let articleEnCours = null;

// ─── FONCTION 1 : Charger et afficher les articles ──────────────
async function chargerArticles() {
  const conteneur = document.getElementById("liste-articles");
  conteneur.innerHTML = "<p>Chargement...</p>";

  try {
    const reponse = await fetch(API_URL);
    const articles = await reponse.json();
    articlesGlobaux = articles;

    if (articles.length === 0) {
      conteneur.innerHTML = "<p>Aucun voyage publié pour l'instant.</p>";
      return;
    }

    afficherArticles(articles);
  } catch (erreur) {
    conteneur.innerHTML =
      '<p class="erreur">Impossible de charger les articles.</p>';
    console.error(erreur);
  }
}
// ─── FONCTION : Afficher les articles à l'écran ─────────────────
function afficherArticles(articles) {
  const conteneur = document.getElementById("liste-articles");

  if (articles.length === 0) {
    conteneur.innerHTML = "<p>Aucun voyage trouvé.</p>";
    return;
  }

  conteneur.innerHTML = articles
    .map(
      (article) => `
    <article class="carte-voyage">
      <div class="carte-entete">
        <span class="emoji">${article.emoji}</span>

        <div>
          <h3>${article.destination}, ${article.pays}</h3>
          <p class="date">
            Voyage du ${new Date(article.date_voyage).toLocaleDateString("fr-FR")}
          </p>
        </div>
      </div>

      <p class="recit">${article.recit}</p>

      <div class="actions">
  <button class="btn-edit" onclick="modifierArticle(${article.id})">
    ✏️ Modifier
  </button>

  <button class="btn-delete" onclick="supprimerArticle(${article.id})">
    🗑️ Supprimer
  </button>
</div>
    </article>
  `,
    )
    .join("");
}

// ─── FONCTION 2 : Publier ou modifier un article ─────────────────
document
  .getElementById("form-voyage")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const messageRetour = document.getElementById("message-retour");
    messageRetour.textContent = "Envoi en cours...";

    const donnees = {
      id: articleEnCours,
      destination: document.getElementById("destination").value,
      pays: document.getElementById("pays").value,
      date_voyage: document.getElementById("date_voyage").value,
      recit: document.getElementById("recit").value,
      emoji: document.getElementById("emoji").value || "✈️",
    };

    const methode = articleEnCours ? "PUT" : "POST";

    try {
      const reponse = await fetch(API_URL, {
        method: methode,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(donnees),
      });

      const resultat = await reponse.json();

      if (reponse.ok) {
        messageRetour.textContent = "✅ " + resultat.message;
        event.target.reset();

        articleEnCours = null;
        document.querySelector('button[type="submit"]').textContent =
          "✈️ Publier ce voyage";

        chargerArticles();
      } else {
        messageRetour.textContent = "❌ Erreur : " + resultat.erreur;
      }
    } catch (erreur) {
      messageRetour.textContent = "❌ Erreur de connexion au serveur.";
      console.error(erreur);
    }
  });

// ─── FONCTION 3 : Supprimer un article ──────────────────────────
async function supprimerArticle(id) {
  const confirmation = confirm("Voulez-vous vraiment supprimer ce voyage ?");

  if (!confirmation) {
    return;
  }

  try {
    const reponse = await fetch(API_URL, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id }),
    });

    const resultat = await reponse.json();

    if (reponse.ok) {
      alert("✅ " + resultat.message);
      chargerArticles();
    } else {
      alert("❌ Erreur : " + resultat.erreur);
    }
  } catch (erreur) {
    alert("❌ Erreur de connexion au serveur.");
    console.error(erreur);
  }
}

// ─── FONCTION 5 : Modifier un article ──────────────────────────

function modifierArticle(id) {
  const article = articlesGlobaux.find((a) => a.id == id);

  if (!article) return;

  articleEnCours = id;
  document.querySelector('button[type="submit"]').textContent =
    "✅ Mettre à jour le voyage";

  document.getElementById("destination").value = article.destination;

  document.getElementById("pays").value = article.pays;

  document.getElementById("date_voyage").value = article.date_voyage;

  document.getElementById("emoji").value = article.emoji;

  document.getElementById("recit").value = article.recit;

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}
// ─── FONCTION 4 : Rechercher par pays ou destination ─────────────
document.getElementById("recherche").addEventListener("input", (event) => {
  const texte = event.target.value.toLowerCase();

  const resultats = articlesGlobaux.filter(
    (article) =>
      article.pays.toLowerCase().includes(texte) ||
      article.destination.toLowerCase().includes(texte),
  );

  afficherArticles(resultats);
});

// ─── DÉMARRAGE : on charge les articles dès l'ouverture de la page ─
chargerArticles();

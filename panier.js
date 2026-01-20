let panier = JSON.parse(localStorage.getItem("panier")) || [];
let codePromo = localStorage.getItem("codePromo") || "";

const FRAIS_LIVRAISON = 5;

function ajouterPanier(id, nom, prix) {
  const p = panier.find(x => x.id === id);
  if (p) p.quantite++;
  else panier.push({ id, nom, prix, quantite: 1 });
  sauvegarder();
  afficherPanier();
}

function supprimerProduit(id) {
  panier = panier.filter(p => p.id !== id);
  sauvegarder();
  afficherPanier();
}

function changerQuantite(id, qte) {
  const p = panier.find(p => p.id === id);
  if (p && qte > 0) p.quantite = parseInt(qte);
  sauvegarder();
  afficherPanier();
}

function appliquerCode() {
  const code = document.getElementById("codePromo").value;
  if (code === "PROMO10") {
    codePromo = code;
    localStorage.setItem("codePromo", code);
    alert("Code promo appliqué (-10€)");
  } else {
    alert("Code invalide");
  }
  afficherPanier();
}

function calculRemise() {
  return codePromo === "PROMO10" ? 10 : 0;
}

function calculSousTotal() {
  return panier.reduce((t, p) => t + p.prix * p.quantite, 0);
}

function calculTotal() {
  if (panier.length === 0) return 0;
  return calculSousTotal() + FRAIS_LIVRAISON - calculRemise();
}

function afficherPanier() {
  const liste = document.getElementById("listePanier");
  const total = document.getElementById("total");
  const paypal = document.getElementById("paypalAmount");
  if (!liste) return;

  liste.innerHTML = "";
  panier.forEach(p => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${p.nom} (${p.prix}€)
      <input type="number" min="1" value="${p.quantite}"
        onchange="changerQuantite('${p.id}', this.value)">
      <button onclick="supprimerProduit('${p.id}')">❌</button>
    `;
    liste.appendChild(li);
  });

  const totalFinal = calculTotal().toFixed(2);
  total.innerHTML = `
    Sous-total : ${calculSousTotal()} €<br>
    Livraison : ${panier.length ? FRAIS_LIVRAISON : 0} €<br>
    Remise : -${calculRemise()} €<br>
    <strong>Total : ${totalFinal} €</strong>
  `;

  if (paypal) paypal.value = totalFinal;
}

function sauvegarder() {
  localStorage.setItem("panier", JSON.stringify(panier));
}

function viderPanier() {
  localStorage.clear();
}
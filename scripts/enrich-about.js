const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'public', 'seo', 'about', 'index.html');
if (!fs.existsSync(file)) throw new Error('About page not found');

let html = fs.readFileSync(file, 'utf8');
const body = `
<section>
  <p class="meta">Snay3i.ma • Présentation</p>
  <h1>À propos de Snay3i.ma</h1>
  <p>Snay3i.ma est une plateforme marocaine créée pour simplifier la recherche de professionnels pour les travaux et services à domicile. L’objectif est de réunir des informations utiles par métier et par ville afin qu’un particulier puisse préparer sa demande, comparer les éléments disponibles et contacter directement les professionnels.</p>
</section>
<section>
  <h2>Pourquoi Snay3i.ma existe</h2>
  <p>Au Maroc, trouver rapidement la bonne personne pour une fuite, une panne électrique, une serrure bloquée, une rénovation ou un besoin d’entretien peut demander du temps et plusieurs appels. Snay3i.ma organise la recherche autour des métiers et des villes pour rendre cette première étape plus simple.</p>
  <p>La plateforme ne remplace pas un devis ni la vérification du professionnel. Elle sert à faciliter la recherche et à donner au particulier un point de départ plus structuré.</p>
</section>
<section>
  <h2>Ce que vous pouvez faire sur la plateforme</h2>
  <ul>
    <li>Rechercher un métier dans une ville précise.</li>
    <li>Consulter les informations réellement publiées sur les profils disponibles.</li>
    <li>Préparer votre demande avant de contacter un professionnel.</li>
    <li>Comparer plusieurs professionnels lorsque la situation le permet.</li>
    <li>Accéder à des guides pratiques pour mieux comprendre les prestations courantes.</li>
  </ul>
</section>
<section>
  <h2>Nos principales catégories</h2>
  <p>Snay3i.ma couvre notamment la plomberie, l’électricité, la maçonnerie, la peinture, la menuiserie, le carrelage, la climatisation, la serrurerie, le ménage, le jardinage, la soudure et le bricolage.</p>
  <p>Les disponibilités et les informations varient selon la ville et selon les données présentes sur chaque fiche.</p>
</section>
<section>
  <h2>Comment nous présentons les professionnels</h2>
  <p>Les fiches peuvent contenir différentes informations fournies ou publiées sur la plateforme. Ces informations peuvent évoluer et ne constituent pas, à elles seules, une garantie de qualité, de disponibilité ou de résultat.</p>
  <p>Les avis, badges et autres éléments visibles doivent être considérés comme des informations à consulter dans leur contexte. Avant toute prestation, vérifiez directement avec le professionnel son identité, ses compétences déclarées, son prix, son délai, le périmètre du travail et les éventuels frais.</p>
</section>
<section>
  <h2>Notre approche éditoriale</h2>
  <p>Le blog de Snay3i.ma publie des guides pratiques destinés à aider les particuliers à mieux préparer une intervention. Les sujets portent notamment sur le choix d’un professionnel, la comparaison des devis, les précautions de sécurité, l’entretien et l’organisation des travaux.</p>
  <p>Nous cherchons à privilégier des conseils concrets et utiles au contexte marocain plutôt que de simplement répéter des mots-clés ou des informations génériques.</p>
</section>
<section>
  <h2>Signaler une information problématique</h2>
  <p>Si vous repérez une information inexacte ou problématique sur une fiche, vous pouvez contacter l’équipe à <a href="mailto:contact@snay3i.ma">contact@snay3i.ma</a>. Indiquez le nom du professionnel, la ville et les éléments permettant de comprendre le problème.</p>
</section>
<section>
  <h2>Ce que Snay3i.ma ne garantit pas</h2>
  <p>Snay3i.ma n’effectue pas les travaux et ne peut pas garantir le résultat d’une prestation réalisée par un professionnel présent sur la plateforme. Le particulier reste responsable de ses vérifications et de son accord avec le professionnel avant le début des travaux.</p>
</section>
<section>
  <h2>Contact</h2>
  <p>Pour une question sur la plateforme, une suggestion ou un signalement, contactez-nous à <a href="mailto:contact@snay3i.ma">contact@snay3i.ma</a>.</p>
  <p><a href="/blog">Voir les guides pratiques</a> · <a href="/contact">Page de contact</a> · <a href="/privacy">Confidentialité</a> · <a href="/terms">Conditions d’utilisation</a></p>
</section>`;

html = html.replace(/<main>[\s\S]*?<\/main>/i, `<main>${body}\n<section><h2>Snay3i.ma</h2><p>Snay3i.ma aide les particuliers au Maroc à rechercher des professionnels pour les travaux et services à domicile.</p><p>Avant toute prestation, vérifiez directement les tarifs, les disponibilités, la nature exacte du travail et les éventuels frais.</p></section></main>`);
fs.writeFileSync(file, html, 'utf8');
console.log('[AdSense trust] enriched /about with platform transparency, editorial purpose, profile guidance, reporting and contact information');

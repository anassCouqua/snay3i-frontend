/*
 * AdSense-safe trust guard.
 *
 * The product must never imply that a professional is verified, rated,
 * reviewed, available 24/7, or guaranteed unless the underlying data proves it.
 * This guard removes a few legacy blanket claims while the product's real
 * verification/review system is being built.
 */
(function () {
  const replacements = [
    ["Le réseau des artisans marocains vérifiés. +200 artisans dans 21 villes. 🇲🇦", "Le réseau des artisans marocains. Découvrez les professionnels disponibles sur Snay3i.ma. 🇲🇦"],
    ["Le réseau des artisans marocains vérifiés", "Le réseau des artisans marocains"],
    ["tous les artisans sont vérifiés", "les informations des profils sont fournies pour vous aider à comparer les professionnels"],
    ["Tous nos artisans sont vérifiés", "Les informations de chaque profil doivent être vérifiées par le client avant intervention"],
    ["Tous les artisans sont vérifiés", "Les informations de chaque profil doivent être vérifiées par le client avant intervention"],
    ["artisans vérifiés", "professionnels référencés"],
    ["Artisans vérifiés", "Professionnels référencés"],
    ["Maalems vérifiés", "Maalems référencés"],
    ["⭐\u0022, l:\u0022Vérifiés\u0022", "⭐\u0022, l:\u0022Profils référencés\u0022"],
  ];

  function clean(root) {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    let node;
    while ((node = walker.nextNode())) nodes.push(node);
    nodes.forEach(textNode => {
      let value = textNode.nodeValue;
      replacements.forEach(([from, to]) => {
        if (value.includes(from)) value = value.split(from).join(to);
      });
      if (value !== textNode.nodeValue) textNode.nodeValue = value;
    });
  }

  function run() { clean(document.body); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();

  const observer = new MutationObserver(() => run());
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();

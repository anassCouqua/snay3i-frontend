import React, { useEffect } from 'react';

const ARTICLES = [
  {
    slug: 'trouver-bon-plombier-maroc',
    title: 'Comment trouver un bon plombier au Maroc en 2026',
    titleAr: 'كيفاش تلقى سبّاك مزيان فالمغرب',
    description: 'Guide complet pour trouver un plombier fiable au Maroc. Conseils, tarifs, questions à poser et pièges à éviter.',
    category: 'Plomberie',
    emoji: '🔧',
    date: '8 Juin 2026',
    readTime: '5 min',
    content: `
## Pourquoi est-il difficile de trouver un bon plombier au Maroc?

Trouver un plombier fiable au Maroc peut être un vrai défi. Entre les artisans sans qualification, les devis excessifs et les interventions bâclées, beaucoup de Marocains se retrouvent dans des situations compliquées. Pourtant, avec les bons outils et les bonnes questions, il est tout à fait possible de trouver un plombier professionnel et honnête.

## Les critères essentiels pour choisir un plombier

**1. Vérifiez les avis clients**
Avant de contacter un plombier, consultez ses avis sur des plateformes comme Snay3i.ma. Les témoignages d'autres clients sont la meilleure indication de la qualité du travail.

**2. Demandez toujours un devis**
Un plombier sérieux accepte toujours de donner un devis avant d'intervenir. Méfiez-vous de ceux qui refusent ou donnent des prix vagues.

**3. L'expérience compte**
Privilégiez un plombier avec au moins 5 ans d'expérience pour les travaux importants. Pour les petites réparations, un jeune artisan motivé peut très bien faire l'affaire.

**4. La disponibilité en urgence**
Les problèmes de plomberie arrivent souvent au mauvais moment. Vérifiez si votre plombier est disponible en urgence, surtout la nuit et le week-end.

## Les tarifs moyens d'un plombier au Maroc

Les prix varient selon la ville et la nature des travaux:
- Débouchage WC: 150-300 MAD
- Réparation fuite: 200-500 MAD
- Installation chauffe-eau: 500-1500 MAD
- Rénovation salle de bain complète: 5000-20000 MAD

## Comment utiliser Snay3i.ma pour trouver votre plombier

Snay3i.ma est la plateforme marocaine qui vous connecte avec des plombiers vérifiés dans votre ville. Avec plus de 900 artisans dans 35 villes du Maroc, vous trouverez rapidement le bon professionnel. Consultez les avis, comparez les profils et appelez directement — sans intermédiaire et sans commission.

## Les questions à poser avant de faire appel à un plombier

- Avez-vous de l'expérience avec ce type de problème?
- Pouvez-vous me donner un devis écrit?
- Quelle est votre disponibilité?
- Donnez-vous une garantie sur votre travail?

## Les erreurs à éviter avec un plombier au Maroc

La plupart des problèmes avec les plombiers au Maroc viennent d'un manque de communication. Ne payez jamais la totalité du montant à l'avance. Demandez un reçu pour chaque paiement. Si possible, demandez à rester présent pendant les travaux pour vous assurer que tout se passe bien.

## Conclusion

Trouver un bon plombier au Maroc n'est plus une mission impossible grâce aux plateformes comme Snay3i.ma. Prenez le temps de vérifier les avis, demandez un devis et n'hésitez pas à comparer plusieurs artisans avant de faire votre choix.
    `
  },
  {
    slug: 'tarif-electricien-maroc-2026',
    title: 'Tarif électricien Maroc 2026 — Guide complet des prix',
    titleAr: 'أسعار التريسيان فالمغرب 2026',
    description: 'Découvrez les tarifs moyens d\'un électricien au Maroc en 2026. Tableau des prix par intervention et conseils pour éviter les arnaques.',
    category: 'Électricité',
    emoji: '⚡',
    date: '8 Juin 2026',
    readTime: '4 min',
    content: `
## Les tarifs d'un électricien au Maroc en 2026

Connaître les tarifs d'un électricien avant de l'appeler vous permettra d'éviter les mauvaises surprises et de négocier en toute connaissance de cause.

## Petites interventions (200-500 MAD)

Ces interventions sont rapides et ne nécessitent pas beaucoup de matériel. Elles incluent le remplacement d'une prise ou d'un interrupteur, l'installation d'un luminaire, la réparation d'une panne simple, ou la vérification du tableau électrique.

## Interventions moyennes (500-2000 MAD)

Pour des travaux plus importants comme l'installation d'un nouveau circuit, la mise aux normes partielle, l'installation d'un tableau électrique, ou le câblage d'une pièce, comptez entre 500 et 2000 MAD.

## Grands travaux (2000-15000 MAD)

La rénovation électrique complète d'un appartement, l'installation solaire photovoltaïque, ou la mise aux normes complète d'une villa peuvent aller de 2000 à 15000 MAD selon la superficie et la complexité.

## Facteurs qui influencent le prix

**La ville:** Les tarifs à Casablanca et Rabat sont généralement 20-30% plus élevés qu'en province.

**L'urgence:** Une intervention d'urgence la nuit ou le week-end coûte 50-100% plus cher.

**L'expérience:** Un électricien certifié et expérimenté facture plus cher mais offre de meilleures garanties.

## Comment trouver un électricien pas cher mais fiable

Sur Snay3i.ma, comparez facilement les électriciens de votre ville. Consultez leurs avis, leur expérience et contactez-les directement pour obtenir un devis gratuit. Avec plus de 900 professionnels dans 35 villes, vous trouverez forcément le bon artisan au bon prix.

## Conseils pour éviter les arnaques

- Demandez toujours un devis écrit avant les travaux
- Ne payez pas la totalité à l'avance
- Vérifiez que l'artisan a de l'expérience
- Comparez minimum 2-3 devis pour les gros travaux
- Méfiez-vous des prix anormalement bas

## Conclusion

Les tarifs des électriciens au Maroc varient beaucoup selon la ville et la nature des travaux. En utilisant Snay3i.ma, vous pouvez comparer facilement les prix et trouver le meilleur rapport qualité-prix pour votre budget.
    `
  },
  {
    slug: 'renovation-maison-maroc-guide',
    title: 'Rénovation maison Maroc 2026 — Par où commencer?',
    titleAr: 'تجديد الدار فالمغرب — من فين تبدا؟',
    description: 'Guide complet pour rénover votre maison au Maroc. Budget, étapes, artisans nécessaires et conseils pratiques.',
    category: 'Rénovation',
    emoji: '🏠',
    date: '8 Juin 2026',
    readTime: '6 min',
    content: `
## Rénover sa maison au Maroc: par où commencer?

La rénovation d'une maison au Maroc est un projet important qui nécessite une bonne organisation. Que vous souhaitiez rafraîchir un appartement à Casablanca ou rénover un riad à Marrakech, voici les étapes essentielles pour réussir votre projet.

## Étape 1: Définir votre budget

Avant tout, établissez un budget réaliste. En règle générale, prévoyez:
- Rénovation légère (peinture, sols): 500-1000 MAD/m²
- Rénovation moyenne (cuisine, salle de bain): 1500-3000 MAD/m²
- Rénovation complète: 3000-6000 MAD/m²

Il est conseillé de prévoir une marge de 15-20% pour les imprévus qui surviennent presque toujours lors de travaux.

## Étape 2: Identifier les travaux prioritaires

Commencez toujours par les travaux structurels et techniques avant les finitions:
- Plomberie et sanitaires
- Électricité et tableau
- Isolation et toiture
- Puis finitions: peinture, carrelage, menuiserie

## Étape 3: Choisir les bons artisans

Pour chaque corps de métier, vous aurez besoin de professionnels qualifiés:
- Un plombier pour la salle de bain et cuisine
- Un électricien (تريسيان) pour les circuits électriques
- Un maçon (بنّاء) pour les travaux structurels
- Un carreleur (جلايجي) pour les sols et murs
- Un peintre (صبّاغ) pour les finitions
- Un menuisier (نجّار) pour portes et placards

Sur Snay3i.ma, trouvez tous ces artisans dans votre ville en quelques clics.

## Étape 4: Obtenir des devis

Contactez minimum 3 artisans pour chaque corps de métier. Comparez les devis et n'hésitez pas à négocier. Un bon artisan accepte toujours de justifier son prix.

## Étape 5: Planifier le chantier

La coordination entre les différents artisans est cruciale. Établissez un planning précis pour éviter les conflits d'intervention. Le maçon passe avant le carreleur, le carreleur avant le peintre.

## Les erreurs à éviter

- Ne pas planifier les travaux dans le bon ordre
- Choisir uniquement sur le prix
- Ne pas signer de contrat écrit
- Payer la totalité à l'avance
- Négliger les finitions

## Conclusion

Rénover sa maison au Maroc demande de la préparation mais c'est tout à fait réalisable avec les bons artisans. Snay3i.ma vous aide à trouver des professionnels vérifiés pour chaque étape de votre projet de rénovation.
    `
  },
  {
    slug: 'choisir-carreleur-maroc',
    title: 'Comment choisir un bon carreleur (جلايجي) au Maroc',
    titleAr: 'كيفاش تختار جلايجي مزيان فالمغرب',
    description: 'Conseils pour choisir le meilleur carreleur au Maroc. Zellige, grès cérame, prix et critères de sélection.',
    category: 'Carrelage',
    emoji: '🏛️',
    date: '8 Juin 2026',
    readTime: '4 min',
    content: `
## Le carreleur au Maroc: un artisan essentiel

Au Maroc, on appelle le carreleur "جلايجي" (jlayji) en darija casablancaise ou "بلاّط" (bellat) dans le nord du pays. C'est un artisan indispensable pour tout projet de construction ou de rénovation, que ce soit pour une salle de bain, une cuisine, un salon ou une terrasse.

## Les types de carrelage populaires au Maroc

**Le Zellige:**
Le zellige marocain est reconnu dans le monde entier pour sa beauté et son authenticité. C'est un carrelage artisanal fait à la main, principalement à Fès. Il demande un carreleur très expérimenté pour sa pose car chaque pièce est unique.

**Le grès cérame:**
Plus moderne et facile d'entretien, le grès cérame est très populaire dans les appartements contemporains. Il imite le marbre, le bois ou la pierre avec une excellente durabilité.

**Le marbre:**
Très prisé au Maroc pour les salons et entrées, le marbre apporte une touche de luxe et d'élégance. Il demande un carreleur spécialisé et un entretien régulier.

## Comment évaluer un bon carreleur

**Regardez son travail précédent:**
Un bon carreleur vous montrera volontiers des photos de ses réalisations. Les joints doivent être réguliers, les lignes droites et le carrelage parfaitement de niveau.

**Vérifiez son expérience avec votre type de carrelage:**
Le zellige demande une expertise particulière différente du grès cérame. Assurez-vous que votre carreleur a déjà posé ce type de carrelage.

**Les avis clients:**
Sur Snay3i.ma, consultez les avis des clients précédents. C'est le meilleur indicateur de qualité et de sérieux.

## Tarifs moyens d'un carreleur au Maroc

- Pose carrelage standard: 80-150 MAD/m²
- Pose zellige: 150-300 MAD/m²
- Pose marbre: 120-200 MAD/m²
- Dépose ancien carrelage: 40-80 MAD/m²

## Trouvez votre carreleur sur Snay3i.ma

Snay3i.ma référence des carreleurs vérifiés dans toutes les villes du Maroc. Consultez les profils, lisez les avis et appelez directement sans intermédiaire.

## Conclusion

Le choix d'un bon carreleur est crucial pour la réussite de vos travaux. Prenez le temps de comparer les profils sur Snay3i.ma et demandez toujours un devis détaillé avant de commencer.
    `
  },
  {
    slug: 'trouver-snay3i-maroc-darija',
    title: 'كيفاش تلقى صنايعي موثوق فالمغرب — دليل كامل',
    titleAr: 'كيفاش تلقى صنايعي موثوق فالمغرب',
    description: 'دليل كامل بالدارجة المغربية لإيجاد الصنايعي المناسب. تريسيان، سبّاك، صبّاغ، جلايجي وأكثر.',
    category: 'دليل',
    emoji: '🇲🇦',
    date: '8 يونيو 2026',
    readTime: '4 دقائق',
    content: `
## كيفاش تلقى صنايعي مزيان فالمغرب؟

واحد من أكبر المشاكل لي كيواجهوها المغاربة هي إيجاد صنايعي موثوق. سواء كنت محتاج تريسيان، سبّاك، صبّاغ، أو جلايجي، هاد الدليل غادي يساعدك تختار أحسن واحد فمدينتك.

## أنواع الصنايعية فالمغرب

**التريسيان (الكهربائي):**
مول الضو كما كنقولوا بالدارجة. مهم جداً وخاصك تكون حذر فاختياره لأن الكهرباء خطيرة. دوما اختار تريسيان عندو تجربة كافية وتقييمات مزيانة.

**السبّاك (البلومبي فطنجة):**
مسؤول على كل مشاكل الماء — التسربات، التصليح، الحمام والمطبخ. خاصك تتصل بيه بسرعة كيما تشوف أي مشكل فالماء باش ما يكبرش.

**الصبّاغ (النقّاش فطنجة):**
يدير الدهان ديال الدار — داخل وخارج. اختار صبّاغ عندو تجربة فالألوان والمواد المختلفة.

**الجلايجي (البلاّط فطنجة):**
يركب الكارو — زليج، گري سيراميك، رخام. الزليج خاصو جلايجي متخصص.

**البنّاء:**
للبناء والترميم والإصلاحات الكبيرة. خاصك تتأكد من تجربتو قبل ما تبدا أي مشروع كبير.

**النجّار:**
للأبواب والشبابيك والمطابخ المصنوعة على القياس.

**مول السوارة (القفّال):**
للأقفال والأبواب المسدودة. دوما متاح للطوارئ.

**الجارديني:**
للحدائق والتشجير والري الأوتوماتيكي.

## الأشياء لي خاصك تشوفها قبل ما تختار صنايعي

**١. شوف التقييمات:**
على Snay3i.ma، كل صنايعي عندو تقييمات من الزبائن السابقين.

**٢. طلب الديفيس:**
أي صنايعي جاد غادي يعطيك ثمن قبل ما يبدا.

**٣. التجربة:**
اختار صنايعي عندو تجربة كافية، خصوصاً للأشغال الكبيرة.

**٤. التوفر:**
شوف واش الصنايعي متاح وقتاش تحتاجو، خصوصاً للحالات الاستعجالية.

## كيفاش تخدم مع Snay3i.ma

Snay3i.ma هي المنصة المغربية لإيجاد الصنايعية الموثوقين. أكثر من ٩٠٠ معلم في ٣٥ مدينة فالمغرب. من طنجة لالعيون، تلقى صنايعيك في ثواني. بلا وسيط، بلا عمولة، مجاناً للكل.

## خلاصة

إيجاد صنايعي موثوق فالمغرب أصبح سهلاً مع Snay3i.ma. شوف التقييمات، قارن البروفايلات، واتصل مباشرة. 🇲🇦
    `
  },
  {
    slug: 'urgence-plomberie-casablanca',
    title: 'Urgence plomberie Casablanca — Que faire en cas de fuite?',
    titleAr: 'طوارئ السباكة في الدار البيضاء',
    description: 'Guide d\'urgence plomberie à Casablanca. Que faire en cas de fuite d\'eau, WC bouché ou chauffe-eau en panne. Trouvez un plombier urgent.',
    category: 'Urgence',
    emoji: '🚨',
    date: '10 Juin 2026',
    readTime: '3 min',
    content: `
## Une fuite d'eau à Casablanca — les premiers gestes

Une fuite d'eau peut causer des dégâts considérables si elle n'est pas traitée rapidement. À Casablanca, voici les premiers gestes à adopter dès que vous constatez une fuite.

## Étape 1: Coupez l'eau immédiatement

Le premier réflexe est de fermer le robinet d'arrêt général de votre appartement ou maison. Il se trouve généralement sous l'évier de la cuisine ou dans une armoire technique. Cela stoppe l'arrivée d'eau et limite les dégâts.

## Étape 2: Protégez vos affaires

Si la fuite est importante, protégez vos meubles et appareils électroniques avec des serviettes ou des bâches. Éteignez également le tableau électrique si l'eau risque d'atteindre des installations électriques.

## Étape 3: Contactez un plombier urgentiste

Sur Snay3i.ma, plusieurs plombiers à Casablanca proposent des interventions d'urgence disponibles 24h/24 et 7j/7. Appelez directement depuis leur profil — pas d'intermédiaire, intervention rapide garantie.

## Les cas d'urgence plomberie les plus fréquents à Casablanca

**WC bouché:** Ne versez pas de produits chimiques en excès. Appelez un plombier qui dispose du matériel adéquat pour déboucher sans abîmer vos canalisations.

**Chauffe-eau en panne:** Si votre chauffe-eau ne chauffe plus ou fuit, c'est souvent la résistance ou l'anode qui est à changer. Un plombier expérimenté peut diagnostiquer et réparer en moins d'une heure.

**Canalisation éclatée:** C'est la situation la plus urgente. Coupez l'eau immédiatement et appelez un plombier urgentiste à Casablanca.

## Tarifs urgence plomberie Casablanca

Les interventions d'urgence coûtent généralement 30-50% de plus que les interventions normales:
- Intervention urgence nuit: 300-600 MAD
- Débouchage urgent: 200-400 MAD
- Réparation fuite urgente: 300-700 MAD

## Trouvez votre plombier urgent sur Snay3i.ma

Snay3i.ma regroupe les meilleurs plombiers de Casablanca disponibles pour des interventions d'urgence. Consultez les profils, vérifiez la disponibilité et appelez directement — sans attendre.

## Conclusion

Face à une urgence plomberie à Casablanca, l'important est d'agir vite. Coupez l'eau, protégez vos biens et contactez rapidement un plombier qualifié via Snay3i.ma.
    `
  },
  {
    slug: 'peintre-maison-maroc-conseils',
    title: 'Choisir un peintre (صبّاغ) au Maroc — Conseils et tarifs',
    titleAr: 'كيفاش تختار صبّاغ مزيان فالمغرب',
    description: 'Guide complet pour choisir un peintre professionnel au Maroc. Tarifs, types de peinture, tadelakt et conseils pratiques.',
    category: 'Peinture',
    emoji: '🎨',
    date: '11 Juin 2026',
    readTime: '4 min',
    content: `
## Le peintre au Maroc: entre tradition et modernité

Au Maroc, le peintre s'appelle "صبّاغ" (sabbagh) en darija, ou "نقّاش" (naqqach) dans le nord du pays. C'est un artisan polyvalent qui maîtrise aussi bien les peintures modernes que les techniques traditionnelles marocaines comme le tadelakt ou le badigeon à la chaux.

## Les types de peinture disponibles au Maroc

**Peinture acrylique:**
La plus courante et la plus économique. Facile à appliquer, elle sèche rapidement et est disponible dans une infinité de couleurs. Idéale pour les intérieurs.

**Tadelakt:**
Technique marocaine ancestrale à base de chaux et de savon noir. Elle donne un aspect lisse et brillant, particulièrement utilisée dans les hammams et salles de bain. Demande un artisan spécialisé.

**Badigeon à la chaux:**
Peinture naturelle à base de chaux qui respire et régule l'humidité. Très utilisée dans les maisons traditionnelles et les riads.

**Peinture façade:**
Résistante aux intempéries, elle est formulée pour l'extérieur et doit résister au soleil intense du Maroc.

## Comment choisir un bon peintre au Maroc

**Demandez à voir des réalisations:**
Un peintre professionnel a toujours des photos de ses travaux précédents. La qualité des finitions, les angles droits et l'uniformité de la couleur sont les signes d'un vrai professionnel.

**Vérifiez les avis sur Snay3i.ma:**
Les avis clients sont la meilleure façon d'évaluer un peintre avant de l'engager. Sur Snay3i.ma, chaque artisan est noté par ses clients précédents.

**Demandez un devis détaillé:**
Le devis doit inclure le prix de la main d'œuvre et le prix des matériaux séparément. Méfiez-vous des peintres qui donnent un prix global sans détail.

## Tarifs moyens d'un peintre au Maroc

- Peinture intérieure standard: 25-50 MAD/m²
- Peinture façade: 40-80 MAD/m²
- Tadelakt: 150-300 MAD/m²
- Badigeon à la chaux: 60-120 MAD/m²

Ces tarifs incluent la main d'œuvre mais généralement pas les matériaux.

## Les erreurs à éviter avec un peintre

Ne choisissez pas uniquement sur le prix le plus bas. Un peintre bon marché qui utilise des matériaux de mauvaise qualité vous coûtera plus cher à long terme car la peinture s'écaillera rapidement. Exigez toujours que le peintre prépare correctement les surfaces avant de peindre.

## Trouvez votre peintre sur Snay3i.ma

Snay3i.ma vous connecte avec les meilleurs peintres vérifiés dans votre ville. Casablanca, Rabat, Marrakech, Tanger, Agadir — trouvez votre artisan en quelques secondes et contactez-le directement.

## Conclusion

Choisir un bon peintre au Maroc est essentiel pour la qualité et la durabilité de vos travaux. Utilisez Snay3i.ma pour comparer les profils et trouver le professionnel idéal pour votre projet.
    `
  },
  {
    slug: 'menuisier-cuisine-maroc',
    title: 'Menuisier cuisine sur mesure au Maroc — Guide et prix',
    titleAr: 'النجّار ديال المطبخ فالمغرب — أسعار ونصائح',
    description: 'Tout savoir sur la menuiserie cuisine sur mesure au Maroc. Prix, matériaux, délais et comment choisir le bon menuisier.',
    category: 'Menuiserie',
    emoji: '🪚',
    date: '12 Juin 2026',
    readTime: '5 min',
    content: `
## La cuisine sur mesure au Maroc: un marché en pleine croissance

Au Maroc, la cuisine équipée sur mesure est de plus en plus populaire. Les Marocains investissent davantage dans leur intérieur et recherchent des cuisines fonctionnelles et esthétiques. Le menuisier, appelé "نجّار" (najar) en darija, joue un rôle central dans la réalisation de ces projets.

## Les matériaux utilisés pour les cuisines au Maroc

**Le bois massif:**
Noble et durable, le bois massif donne un aspect chaleureux et authentique. Il est plus coûteux mais résiste bien au temps si bien entretenu.

**Le MDF (Medium Density Fiberboard):**
Le matériau le plus utilisé au Maroc pour les cuisines. Économique, facile à travailler et disponible en de nombreuses finitions. La qualité varie beaucoup selon le fournisseur.

**L'aluminium:**
De plus en plus populaire pour les portes de cuisine et les placards. Résistant à l'humidité et facile d'entretien, c'est un excellent choix pour les cuisines marocaines.

**Le mélaminé:**
Surface résistante aux chocs et à l'humidité, le mélaminé est souvent utilisé pour l'intérieur des placards.

## Comment choisir son menuisier cuisine au Maroc

**Visitez ses réalisations:**
Demandez à voir des cuisines qu'il a déjà réalisées, si possible chez d'anciens clients. Vérifiez la qualité des finitions, l'alignement des portes et la qualité des ferrures.

**Demandez un plan et un devis détaillé:**
Un menuisier sérieux vous propose un plan de cuisine avec les dimensions exactes avant de commencer. Le devis doit détailler les matériaux et la main d'œuvre.

**Vérifiez les délais:**
La réalisation d'une cuisine sur mesure prend généralement 2 à 6 semaines selon la complexité. Méfiez-vous des promesses de délais trop courts.

## Tarifs moyens pour une cuisine sur mesure au Maroc

- Cuisine simple (MDF basique): 8,000-15,000 MAD
- Cuisine moyenne (MDF qualité): 15,000-30,000 MAD
- Cuisine haut de gamme (bois massif ou alu): 30,000-80,000 MAD

Ces prix incluent la fabrication et la pose mais pas les électroménagers.

## Les accessoires importants à ne pas négliger

Les charnières, glissières de tiroirs et poignées font la différence entre une cuisine ordinaire et une cuisine de qualité. Exigez des marques reconnues comme Blum ou Hettich pour les ferrures.

## Trouvez votre menuisier sur Snay3i.ma

Sur Snay3i.ma, trouvez des menuisiers qualifiés pour votre cuisine sur mesure dans toutes les villes du Maroc. Comparez les profils, consultez les avis et contactez directement votre artisan.

## Conclusion

Une cuisine sur mesure bien réalisée valorise votre bien immobilier et améliore votre quotidien. Prenez le temps de bien choisir votre menuisier via Snay3i.ma pour un résultat à la hauteur de vos attentes.
    `
  },
  {
    slug: 'climatisation-maroc-installation',
    title: 'Climatisation au Maroc — Installation, entretien et prix',
    titleAr: 'التكييف فالمغرب — تركيب وصيانة وأسعار',
    description: 'Guide complet sur la climatisation au Maroc. Quelles marques choisir, prix d\'installation, entretien et comment trouver un bon technicien.',
    category: 'Climatisation',
    emoji: '❄️',
    date: '13 Juin 2026',
    readTime: '5 min',
    content: `
## La climatisation au Maroc: un équipement devenu indispensable

Avec des étés de plus en plus chauds au Maroc, la climatisation est passée d'un luxe à une nécessité pour beaucoup de foyers marocains. Que vous soyez à Casablanca, Marrakech, Agadir ou Fès, l'installation d'un climatiseur nécessite un technicien qualifié.

## Les types de climatiseurs disponibles au Maroc

**Le split mural (le plus populaire):**
Composé d'une unité intérieure et d'une unité extérieure, c'est le type le plus répandu au Maroc. Silencieux, efficace et disponible dans toutes les capacités.

**Le multi-split:**
Un seul compresseur extérieur qui alimente plusieurs unités intérieures. Idéal pour climatiser plusieurs pièces simultanément.

**Le climatiseur mobile:**
Sans installation permanente, il peut être déplacé d'une pièce à l'autre. Moins efficace mais ne nécessite pas de technicien pour l'installation.

## Les meilleures marques de climatisation au Maroc

**Samsung:** Fiable, bonne efficacité énergétique et service après-vente présent au Maroc.

**Gree:** La marque chinoise la plus vendue en Afrique du Nord. Excellent rapport qualité-prix.

**Midea:** Populaire au Maroc, bonne qualité et prix compétitifs.

**Daikin:** Premium, très efficace mais plus coûteuse. Idéale pour les projets haut de gamme.

**Carrier:** Marque américaine de référence, très présente dans les installations commerciales.

## Tarifs d'installation d'une climatisation au Maroc

- Installation split 9000 BTU: 800-1500 MAD
- Installation split 12000 BTU: 1000-2000 MAD
- Installation split 18000 BTU: 1500-2500 MAD
- Recharge gaz (par kilo): 200-400 MAD
- Entretien annuel: 300-600 MAD

Ces prix incluent la main d'œuvre et les consommables de base.

## L'entretien: la clé de la longévité

Un climatiseur bien entretenu peut durer 10-15 ans. L'entretien annuel comprend le nettoyage des filtres, la vérification du niveau de gaz, le nettoyage du compresseur et la vérification des connexions électriques.

## Comment choisir un bon technicien climatisation

Sur Snay3i.ma, trouvez des techniciens climatisation certifiés dans votre ville. Vérifiez qu'ils ont l'expérience avec votre marque de climatiseur et consultez les avis clients avant de les contacter.

## Les erreurs à éviter

- Ne pas faire entretenir son climatiseur régulièrement
- Choisir une capacité inadaptée à la superficie
- Installer soi-même sans compétences techniques
- Utiliser un technicien non qualifié pour la recharge de gaz

## Conclusion

L'installation d'une climatisation au Maroc est un investissement qui nécessite un technicien qualifié. Utilisez Snay3i.ma pour trouver le bon professionnel dans votre ville et profiter d'un été confortable.
    `
  },
  {
    slug: 'serrurier-urgence-maroc',
    title: 'Serrurier urgence au Maroc — Porte bloquée que faire?',
    titleAr: 'مول السوارة للطوارئ فالمغرب',
    description: 'Guide urgence serrurerie au Maroc. Que faire si votre porte est bloquée? Comment trouver un serrurier rapide et honnête.',
    category: 'Serrurerie',
    emoji: '🔑',
    date: '14 Juin 2026',
    readTime: '3 min',
    content: `
## Porte bloquée au Maroc — Les premiers gestes

Se retrouver avec une porte bloquée ou une clé cassée dans la serrure est une situation stressante qui peut arriver à n'importe qui. Au Maroc, les serruriers (مول السوارة en darija) sont disponibles pour intervenir rapidement.

## Que faire si votre porte est bloquée?

**Ne forcez pas la porte:**
La première erreur est de tenter de forcer la porte. Cela risque d'abîmer le cadre, la porte elle-même ou de casser définitivement la serrure, augmentant considérablement le coût de la réparation.

**Vérifiez si c'est vraiment bloqué:**
Parfois la porte est simplement coincée par la chaleur ou l'humidité. Essayez de soulever légèrement la poignée en tournant la clé.

**Appelez un serrurier professionnel:**
Sur Snay3i.ma, trouvez un serrurier disponible en urgence dans votre ville. Les serruriers professionnels ont les outils adaptés pour ouvrir votre porte sans l'endommager.

## Les services d'un serrurier au Maroc

- Ouverture de porte sans dommage
- Remplacement de serrure
- Installation de serrure multipoints
- Blindage de porte
- Duplication de clés
- Installation de digicodes

## Tarifs serrurerie urgence au Maroc

- Ouverture de porte simple: 200-400 MAD
- Ouverture de porte blindée: 300-600 MAD
- Remplacement serrure standard: 300-600 MAD
- Remplacement serrure multipoints: 600-1500 MAD
- Intervention de nuit (supplément): +50-100%

## Comment éviter les arnaques en serrurerie

La serrurerie d'urgence est malheureusement un secteur où les arnaques existent. Pour vous protéger, demandez toujours un devis par téléphone avant l'intervention, vérifiez les avis du serrurier sur Snay3i.ma et demandez une facture après l'intervention.

## Trouvez votre serrurier sur Snay3i.ma

Snay3i.ma référence des serruriers vérifiés dans toutes les grandes villes du Maroc. Casablanca, Rabat, Marrakech, Tanger, Agadir — appelez directement le serrurier le plus proche de chez vous.

## Conclusion

Face à une urgence serrurerie, gardez votre calme et contactez rapidement un serrurier professionnel via Snay3i.ma. Vérifiez toujours les avis et demandez un devis avant l'intervention pour éviter les mauvaises surprises.
    `
  },
  {
    slug: 'macon-construction-maroc',
    title: 'Trouver un maçon (بنّاء) fiable au Maroc — Guide 2026',
    titleAr: 'كيفاش تلقى بنّاء موثوق فالمغرب 2026',
    description: 'Guide complet pour trouver un maçon qualifié au Maroc. Tarifs, types de travaux, comment évaluer un maçon et éviter les problèmes.',
    category: 'Maçonnerie',
    emoji: '🧱',
    date: '14 Juin 2026',
    readTime: '5 min',
    content: `
## Le maçon au Maroc: un artisan polyvalent

Au Maroc, le maçon est appelé "بنّاء" (benna) en darija. C'est l'un des artisans les plus demandés car il intervient dans quasiment tous les projets de construction et de rénovation. De la simple réparation d'un mur à la construction d'une extension complète, le maçon est indispensable.

## Les travaux réalisés par un maçon au Maroc

**Construction et gros œuvre:**
Fondations, élévation des murs, dalles en béton, colonnes et poutres. Le maçon travaille en coordination avec le bureau d'études pour les projets importants.

**Rénovation et réparation:**
Réparation de fissures, ravalement de façade, enduits intérieurs et extérieurs, isolation thermique.

**Carrelage et revêtements:**
Certains maçons au Maroc font aussi le carrelage, bien que ce soit souvent le travail du jlayji (carreleur).

**Démolition:**
Abattage de cloisons, création d'ouvertures pour portes et fenêtres, démolition partielle.

## Comment évaluer un bon maçon au Maroc

**Vérifiez ses références:**
Demandez à voir des chantiers qu'il a réalisés, idéalement en cours ou récemment terminés. La qualité des joints, le niveau des murs et la finition des enduits sont des indicateurs fiables.

**Demandez un devis détaillé:**
Un bon maçon vous donnera un devis précis avec le prix des matériaux et de la main d'œuvre séparément. Méfiez-vous des devis approximatifs.

**Vérifiez sa disponibilité:**
Un maçon très demandé peut avoir un délai d'attente. Planifiez vos travaux à l'avance.

**Consultez les avis sur Snay3i.ma:**
Les retours d'autres clients sont précieux pour évaluer le sérieux et la qualité du travail d'un maçon.

## Tarifs moyens d'un maçon au Maroc

- Enduit intérieur: 60-100 MAD/m²
- Enduit façade: 80-150 MAD/m²
- Construction mur en parpaing: 200-400 MAD/m²
- Réparation fissure: 200-500 MAD selon l'importance
- Démolition cloison: 300-800 MAD selon l'épaisseur

## Les erreurs à éviter avec un maçon

Ne commencez jamais des travaux importants sans un contrat écrit. Précisez les matériaux à utiliser, les délais et les modalités de paiement. Ne payez pas plus de 30% à l'avance et échelonnez les paiements selon l'avancement des travaux.

## Trouvez votre maçon sur Snay3i.ma

Snay3i.ma vous connecte avec des maçons qualifiés dans toutes les villes du Maroc. Casablanca, Rabat, Marrakech, Tanger, Agadir, Fès et bien plus — trouvez votre artisan en quelques secondes.

## Conclusion

Choisir un bon maçon au Maroc est crucial pour la réussite de vos travaux. Utilisez Snay3i.ma pour comparer les profils, consulter les avis et contacter directement le professionnel qui correspond à votre projet.
    `
  },
  {
    slug: 'jardinier-paysagiste-maroc',
    title: 'Jardinier paysagiste au Maroc — Créer un beau jardin',
    titleAr: 'الجارديني فالمغرب — كيفاش تدير جردة مزيانة',
    description: 'Guide pour créer et entretenir un beau jardin au Maroc. Plantes adaptées au climat, arrosage automatique, tarifs et conseils pratiques.',
    category: 'Jardinage',
    emoji: '🌿',
    date: '15 Juin 2026',
    readTime: '4 min',
    content: `
## Le jardinage au Maroc: entre tradition et modernité

Au Maroc, le jardin est un espace de vie à part entière. Les jardins marocains traditionnels, avec leurs fontaines, leurs orangers et leurs rosiers, sont reconnus dans le monde entier pour leur beauté. Aujourd'hui, les Marocains recherchent de plus en plus des jardiniers professionnels (جارديني en darija) pour créer et entretenir leurs espaces verts.

## Les plantes adaptées au climat marocain

**Plantes méditerranéennes résistantes à la chaleur:**
L'olivier, le laurier rose, le jasmin et la bougainvillée sont parfaitement adaptés au climat marocain. Ils nécessitent peu d'eau une fois établis.

**Plantes d'ombre pour les régions chaudes:**
Le ficus, le philodendron et le palmier apportent de l'ombre et de la fraîcheur dans les jardins marocains.

**Plantes aromatiques:**
La menthe, le romarin, la lavande et le thym s'épanouissent dans le climat marocain et parfument agréablement le jardin.

**Gazon:**
Le gazon est très populaire mais demande beaucoup d'eau. Des variétés résistantes à la sécheresse comme le gazon de Bermudes sont recommandées.

## Les services d'un jardinier au Maroc

**Création de jardin:**
Conception, plantation, installation de systèmes d'arrosage automatique et aménagement paysager complet.

**Entretien régulier:**
Taille, tonte, désherbage, fertilisation et arrosage. Un jardinier professionnel peut passer une fois par semaine ou deux fois par mois.

**Installation d'arrosage automatique:**
Indispensable au Maroc pour maintenir un jardin en bonne santé avec un minimum d'eau.

## Tarifs d'un jardinier au Maroc

- Entretien mensuel (petit jardin): 300-600 MAD
- Entretien mensuel (grand jardin): 600-1500 MAD
- Création jardin (main d'œuvre): 80-150 MAD/m²
- Installation arrosage automatique: 2000-8000 MAD

## Trouvez votre jardinier sur Snay3i.ma

Snay3i.ma référence des jardiniers professionnels dans toutes les villes du Maroc. Que vous ayez besoin d'un entretien régulier ou de la création d'un jardin complet, trouvez votre professionnel en quelques clics.

## Conclusion

Un beau jardin valorise votre bien et améliore votre qualité de vie. Faites appel à un jardinier professionnel via Snay3i.ma pour créer et entretenir l'espace vert de vos rêves au Maroc.
    `
  },
  {
    slug: 'artisan-marrakech-guide',
    title: 'Trouver un artisan à Marrakech — Guide complet 2026',
    titleAr: 'كيفاش تلقى صنايعي فمراكش 2026',
    description: 'Guide pour trouver les meilleurs artisans à Marrakech. Plombiers, électriciens, maçons, menuisiers dans la ville ocre.',
    category: 'Marrakech',
    emoji: '🏙️',
    date: '15 Juin 2026',
    readTime: '4 min',
    content: `
## Les artisans à Marrakech: une ville aux mille corps de métier

Marrakech, la ville ocre, est réputée dans le monde entier pour son artisanat traditionnel. Mais au-delà des souks et des ateliers d'artisanat, la ville compte aussi des milliers de professionnels du bâtiment et des services à domicile indispensables au quotidien des Marrakchis.

## Les artisans les plus recherchés à Marrakech

**Plombiers à Marrakech:**
Avec le développement immobilier intense que connaît Marrakech, la demande en plombiers qualifiés est très forte. Entre les nouvelles constructions, les riads à rénover et les résidences touristiques, les plombiers ont du travail à longueur d'année.

**Électriciens à Marrakech:**
L'installation électrique aux normes est cruciale à Marrakech, notamment pour les propriétaires de riads qui accueillent des touristes. La mise aux normes et les nouvelles installations sont très demandées.

**Maçons à Marrakech:**
La rénovation des riads de la médina est un marché important à Marrakech. Les maçons spécialisés dans le bâti traditionnel (pisé, tadelakt) sont particulièrement recherchés.

**Carreleurs à Marrakech:**
Le zellige de Marrakech et de Fès est mondialement reconnu. Les carreleurs spécialisés dans le zellige traditionnel sont très demandés pour les projets de riads et de villas.

## Les spécificités du marché artisanal marrakchi

Marrakech attire de nombreux étrangers qui investissent dans des riads. Cette clientèle internationale crée une demande pour des artisans capables de travailler sur des projets haut de gamme et de respecter des délais stricts.

## Comment trouver un artisan fiable à Marrakech

La meilleure solution est d'utiliser Snay3i.ma, qui référence les meilleurs artisans de Marrakech avec leurs avis clients, leurs spécialités et leurs coordonnées directes.

Sur Snay3i.ma à Marrakech, vous trouverez:
- Des plombiers disponibles en urgence
- Des électriciens certifiés
- Des maçons spécialisés en rénovation riad
- Des carreleurs experts en zellige
- Des peintres maîtrisant le tadelakt

## Tarifs moyens des artisans à Marrakech

Les tarifs à Marrakech sont légèrement supérieurs à la moyenne nationale en raison de la forte demande touristique:
- Plombier: 250-600 MAD l'intervention
- Électricien: 300-700 MAD l'intervention
- Maçon: 200-400 MAD/m² pour les enduits

## Conclusion

Que vous soyez résident ou investisseur à Marrakech, Snay3i.ma est votre meilleur allié pour trouver rapidement un artisan qualifié. Consultez les profils, lisez les avis et contactez directement votre professionnel.
    `
  },
  {
    slug: 'electricien-casablanca-guide',
    title: 'Électricien à Casablanca — Trouver le meilleur professionnel',
    titleAr: 'تريسيان فالدار البيضاء — كيفاش تلقى أحسن واحد',
    description: 'Guide complet pour trouver un électricien qualifié à Casablanca. Quartiers, tarifs, urgences et conseils pratiques.',
    category: 'Casablanca',
    emoji: '🏙️',
    date: '16 Juin 2026',
    readTime: '4 min',
    content: `
## L'électricien à Casablanca: un professionnel indispensable

Casablanca, la capitale économique du Maroc, compte plus de 4 millions d'habitants répartis dans de nombreux quartiers. Trouver un électricien fiable dans cette ville peut être un défi, mais avec les bons outils, c'est tout à fait possible.

## Les quartiers de Casablanca et leurs spécificités

**Maarif et Racine:**
Ces quartiers résidentiels haut de gamme demandent souvent des travaux électriques de qualité pour les villas et appartements modernes. Les électriciens y sont nombreux mais les tarifs sont plus élevés.

**Hay Mohammadi et Sidi Bernoussi:**
Quartiers populaires avec une forte concentration d'artisans. Les tarifs y sont plus accessibles.

**Anfa et California:**
Quartiers prisés avec des villas nécessitant des installations électriques sophistiquées. Les électriciens spécialisés dans le domotique y sont actifs.

## Les services d'un électricien à Casablanca

**Installations résidentielles:**
Tableau électrique, circuits, prises, interrupteurs, luminaires. L'électricien résidentiel intervient dans les appartements et maisons individuelles.

**Mise aux normes:**
Beaucoup d'anciens appartements à Casablanca ont des installations électriques dépassées. La mise aux normes est obligatoire avant toute location ou vente.

**Domotique:**
De plus en plus populaire à Casablanca, la domotique permet de contrôler l'éclairage, les volets et la climatisation depuis son smartphone.

**Énergie solaire:**
Avec le développement du solaire au Maroc, de nombreux électriciens à Casablanca se sont spécialisés dans l'installation de panneaux photovoltaïques.

## Tarifs électricien Casablanca 2026

- Déplacement et diagnostic: 150-300 MAD
- Remplacement tableau électrique: 2000-5000 MAD
- Installation prise supplémentaire: 200-400 MAD
- Mise aux normes complète appartement: 5000-15000 MAD
- Installation panneau solaire: 15000-50000 MAD

## Comment trouver un électricien certifié à Casablanca

Sur Snay3i.ma, tous les électriciens de Casablanca sont vérifiés et notés par leurs clients. Filtrez par quartier, consultez les avis et appelez directement — sans passer par un intermédiaire.

## Les précautions à prendre

Ne touchez jamais à une installation électrique sans couper le courant au tableau. Pour tous travaux électriques importants, faites appel à un professionnel qualifié. Les économies réalisées en faisant appel à un non-professionnel peuvent se transformer en catastrophe.

## Conclusion

Casablanca offre un grand choix d'électriciens qualifiés. Utilisez Snay3i.ma pour trouver rapidement celui qui correspond à vos besoins, dans votre quartier et à un tarif juste.
    `
  },
  {
    slug: 'entretien-maison-maroc-checklist',
    title: 'Entretien maison Maroc — La checklist annuelle complète',
    titleAr: 'صيانة الدار فالمغرب — لائحة كاملة للسنة',
    description: 'Checklist complète pour l\'entretien annuel de votre maison au Maroc. Ce qu\'il faut vérifier chaque saison et quels artisans appeler.',
    category: 'Entretien',
    emoji: '🏡',
    date: '16 Juin 2026',
    readTime: '5 min',
    content: `
## Pourquoi l'entretien régulier de votre maison est crucial au Maroc

Le climat marocain, avec ses étés chauds et secs et ses hivers parfois pluvieux, soumet les maisons à des contraintes importantes. Un entretien régulier permet d'éviter des réparations coûteuses et de préserver la valeur de votre bien immobilier.

## Checklist printemps (Mars-Mai)

**Plomberie:**
- Vérifier toutes les robinetteries pour détecter les fuites
- Contrôler le chauffe-eau et sa sécurité
- Vérifier les joints de la salle de bain et cuisine
- Nettoyer les filtres des robinets

**Électricité:**
- Tester les disjoncteurs du tableau
- Vérifier les prises et interrupteurs défectueux
- Contrôler l'installation de climatisation avant l'été

**Extérieur:**
- Inspecter la toiture après les pluies hivernales
- Vérifier l'état des gouttières et leur écoulement
- Contrôler les façades pour détecter les fissures

## Checklist été (Juin-Août)

**Climatisation:**
- Faire entretenir la climatisation avant les grosses chaleurs
- Nettoyer les filtres des splits
- Vérifier le niveau de gaz

**Jardin:**
- Vérifier le système d'arrosage automatique
- Tailler les arbres et arbustes
- Protéger les plantes sensibles de la chaleur

**Peinture et façade:**
- Vérifier l'état de la peinture extérieure
- Réparer les fissures avant qu'elles ne s'aggravent

## Checklist automne (Septembre-Novembre)

**Préparation hivernale:**
- Vérifier l'état du chauffe-eau avant l'hiver
- Contrôler les fenêtres et portes pour les courants d'air
- Vérifier l'isolation du toit et des combles

**Plomberie:**
- Purger les canalisations extérieures
- Vérifier l'état des joints de douche et baignoire

## Checklist hiver (Décembre-Février)

**Chauffage:**
- Vérifier le bon fonctionnement du système de chauffage
- Contrôler les cheminées et poêles
- Inspecter les radiateurs

**Toiture et étanchéité:**
- Vérifier l'étanchéité du toit avant les pluies
- Contrôler les terrasses et leur évacuation des eaux

## Les artisans à appeler pour chaque tâche

- **Plombier (سبّاك):** Pour tout ce qui concerne l'eau et les canalisations
- **Électricien (تريسيان):** Pour le tableau électrique et les installations
- **Technicien clim:** Pour l'entretien de la climatisation
- **Maçon (بنّاء):** Pour les fissures et les travaux de façade
- **Jardinier (جارديني):** Pour l'entretien du jardin

Trouvez tous ces artisans sur Snay3i.ma — plus de 900 professionnels vérifiés dans 35 villes du Maroc.

## Conclusion

Un entretien régulier de votre maison au Maroc vous permettra d'économiser sur les réparations à long terme. Utilisez cette checklist chaque saison et faites appel aux bons professionnels via Snay3i.ma.
    `
  },
];

function ArticlePage({ slug }) {
  const article = ARTICLES.find(a => a.slug === slug);

  useEffect(() => {
    if (!article) return;
    document.title = `${article.title} | Snay3i.ma Blog`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', article.description);

    // FAQ Schema
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": article.title,
      "description": article.description,
      "datePublished": article.date,
      "publisher": { "@type": "Organization", "name": "Snay3i.ma", "url": "https://snay3i.ma" }
    });
    document.head.appendChild(script);
  }, [article]);

  if (!article) return (
    <div style={{textAlign:'center',padding:60,fontFamily:'system-ui,sans-serif'}}>
      <h1>Article introuvable</h1>
      <a href="/blog" style={{color:'#C4622D',fontWeight:700}}>← Retour au blog</a>
    </div>
  );

  const paragraphs = article.content.trim().split('\n').filter(l => l.trim());

  return (
    <div style={{fontFamily:'system-ui,sans-serif',background:'#FAF6EF',minHeight:'100vh'}}>
      <div style={{background:'#0D1B2A',padding:'14px 24px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <a href="/"><img src="/logo.png" alt="Snay3i.ma" style={{height:40,objectFit:'contain'}}/></a>
        <a href="/blog" style={{color:'#D4A843',fontWeight:700,fontSize:13,textDecoration:'none'}}>← Blog</a>
      </div>
      <div style={{background:'#F0EAE0',padding:'8px 24px',fontSize:12,color:'#7A7065'}}>
        <a href="/" style={{color:'#C4622D',textDecoration:'none'}}>Snay3i.ma</a>
        {' › '}
        <a href="/blog" style={{color:'#C4622D',textDecoration:'none'}}>Blog</a>
        {' › '}
        <span style={{color:'#0D1B2A'}}>{article.category}</span>
      </div>
      <div style={{maxWidth:760,margin:'0 auto',padding:'32px 16px'}}>
        <div style={{marginBottom:8}}>
          <span style={{background:'#F5EFE8',color:'#C4622D',padding:'4px 12px',borderRadius:20,fontSize:12,fontWeight:600}}>{article.emoji} {article.category}</span>
          <span style={{color:'#7A7065',fontSize:12,marginLeft:12}}>{article.date} • {article.readTime} de lecture</span>
        </div>
        <h1 style={{fontSize:28,fontWeight:800,color:'#0D1B2A',lineHeight:1.3,margin:'12px 0 8px'}}>{article.title}</h1>
        <p style={{color:'#7A7065',fontSize:15,lineHeight:1.6,margin:'0 0 24px',borderBottom:'2px solid #F0EAE0',paddingBottom:16}}>{article.description}</p>
        <div style={{background:'#fff',borderRadius:16,padding:28,border:'1.5px solid #E8E0D4',lineHeight:1.8}}>
          {paragraphs.map((line, i) => {
            if (line.startsWith('## ')) return <h2 key={i} style={{fontSize:20,fontWeight:700,color:'#0D1B2A',margin:'28px 0 12px',borderBottom:'2px solid #F5EFE8',paddingBottom:8}}>{line.replace('## ','')}</h2>;
            if (line.startsWith('**') && line.endsWith('**')) return <p key={i} style={{fontWeight:700,color:'#0D1B2A',fontSize:15,margin:'16px 0 4px'}}>{line.replace(/\*\*/g,'')}</p>;
            if (line.startsWith('- ')) return <li key={i} style={{color:'#5A5050',fontSize:14,lineHeight:1.8,marginLeft:20,marginBottom:4}}>{line.replace('- ','')}</li>;
            if (line.match(/^\d\./)) return <li key={i} style={{color:'#5A5050',fontSize:14,lineHeight:1.8,marginLeft:20,marginBottom:4}}>{line.replace(/^\d\./,'')}</li>;
            return <p key={i} style={{color:'#4A4040',fontSize:15,lineHeight:1.9,margin:'10px 0'}}>{line}</p>;
          })}
        </div>

        {/* Related articles */}
        <div style={{background:'#fff',borderRadius:16,padding:24,marginTop:16,border:'1.5px solid #E8E0D4'}}>
          <h3 style={{fontSize:15,fontWeight:700,color:'#0D1B2A',marginBottom:12}}>Articles similaires</h3>
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {ARTICLES.filter(a=>a.slug!==article.slug).slice(0,3).map(a=>(
              <a key={a.slug} href={`/blog/${a.slug}`} style={{display:'flex',alignItems:'center',gap:10,textDecoration:'none',padding:'8px 0',borderBottom:'1px solid #F5EFE8'}}>
                <span style={{fontSize:20}}>{a.emoji}</span>
                <span style={{color:'#C4622D',fontSize:13,fontWeight:600}}>{a.title}</span>
              </a>
            ))}
          </div>
        </div>

        <div style={{background:'#0D1B2A',borderRadius:16,padding:24,textAlign:'center',marginTop:16}}>
          <p style={{color:'#fff',fontWeight:700,fontSize:16,margin:'0 0 8px'}}>Trouvez votre artisan maintenant 🇲🇦</p>
          <p style={{color:'rgba(255,255,255,0.6)',fontSize:13,margin:'0 0 16px'}}>+900 maalems vérifiés dans 35 villes</p>
          <a href="/" style={{background:'#C4622D',color:'#fff',padding:'12px 28px',borderRadius:24,textDecoration:'none',fontWeight:800,fontSize:14}}>Voir les artisans →</a>
        </div>
        <div style={{textAlign:'center',marginTop:20,paddingBottom:32}}>
          <a href="/blog" style={{color:'#C4622D',fontWeight:700,textDecoration:'none'}}>← Retour au blog Snay3i.ma</a>
        </div>
      </div>
    </div>
  );
}

export default function Blog({ articleSlug }) {
  useEffect(() => {
    if (!articleSlug) {
      document.title = 'Blog Snay3i.ma — Conseils artisans au Maroc';
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute('content', 'Conseils, guides et astuces pour trouver les meilleurs artisans au Maroc. Plombier, électricien, maçon, carreleur et plus.');
    }
  }, [articleSlug]);

  if (articleSlug) return <ArticlePage slug={articleSlug} />;

  return (
    <div style={{fontFamily:'system-ui,sans-serif',background:'#FAF6EF',minHeight:'100vh'}}>
      <div style={{background:'#0D1B2A',padding:'14px 24px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <a href="/"><img src="/logo.png" alt="Snay3i.ma" style={{height:40,objectFit:'contain'}}/></a>
        <a href="/" style={{color:'#D4A843',fontWeight:700,fontSize:13,textDecoration:'none'}}>← Accueil</a>
      </div>
      <div style={{maxWidth:760,margin:'0 auto',padding:'32px 16px'}}>
        <h1 style={{fontSize:28,fontWeight:800,color:'#0D1B2A',margin:'0 0 4px'}}>📝 Blog Snay3i.ma</h1>
        <p style={{color:'#7A7065',fontSize:15,margin:'0 0 28px'}}>Conseils, guides et astuces pour trouver les meilleurs artisans au Maroc 🇲🇦</p>
        {ARTICLES.map(article => (
          <a key={article.slug} href={`/blog/${article.slug}`} style={{textDecoration:'none'}}>
            <div style={{background:'#fff',borderRadius:16,padding:20,marginBottom:14,border:'1.5px solid #E8E0D4',display:'flex',gap:16,alignItems:'center',transition:'all 0.2s'}}>
              <div style={{fontSize:36,flexShrink:0}}>{article.emoji}</div>
              <div style={{flex:1}}>
                <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6,flexWrap:'wrap'}}>
                  <span style={{background:'#F5EFE8',color:'#C4622D',padding:'2px 10px',borderRadius:20,fontSize:11,fontWeight:600}}>{article.category}</span>
                  <span style={{color:'#7A7065',fontSize:11}}>{article.date} • {article.readTime}</span>
                </div>
                <h2 style={{fontSize:15,fontWeight:700,color:'#0D1B2A',margin:'0 0 4px',lineHeight:1.4}}>{article.title}</h2>
                <p style={{fontSize:13,color:'#7A7065',margin:0,lineHeight:1.5}}>{article.description}</p>
              </div>
              <div style={{color:'#C4622D',fontSize:20,flexShrink:0}}>→</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

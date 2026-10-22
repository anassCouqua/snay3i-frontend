const fs = require('fs');
const path = require('path');
const { INDEXABLE_BLOG_SLUGS } = require('./site-curation-config');

const root = path.join(__dirname, '..');
const blogRoot = path.join(root, 'public', 'blog');
const modified = '2026-09-10';

const modules = {
  'trouver-bon-plombier-maroc': {
    heading: 'Plan d’action avant d’appeler un plombier',
    intro: 'Pour obtenir des réponses comparables, préparez les mêmes informations pour chaque professionnel.',
    items: [
      'Notez la pièce concernée, le symptôme visible et depuis quand il apparaît.',
      'Repérez la vanne d’arrêt utile sans démonter une installation que vous ne connaissez pas.',
      'Prenez deux ou trois photos larges et rapprochées si cela peut être fait sans risque.',
      'Demandez séparément le déplacement, le diagnostic, la main-d’œuvre et les fournitures.'
    ],
    tool: '/outils/brief-artisan', label: 'Créer un brief plomberie'
  },
  'tarif-electricien-maroc-2026': {
    heading: 'Rendre deux devis électriques réellement comparables',
    intro: 'Un prix n’a de sens que si le périmètre et le niveau de matériel sont identiques.',
    items: [
      'Listez les prises, points lumineux, circuits ou équipements concernés par pièce.',
      'Demandez si le diagnostic, la fourniture du matériel et les reprises de finition sont compris.',
      'Faites préciser les références principales lorsque le matériel représente une part importante du devis.',
      'Ne manipulez pas un tableau ou un conducteur si vous n’êtes pas compétent pour le faire.'
    ],
    tool: '/outils/comparateur-devis', label: 'Comparer les devis électriques'
  },
  'renovation-maison-maroc-guide': {
    heading: 'Transformer le projet en séquence de chantier',
    intro: 'Une rénovation devient plus contrôlable lorsque chaque décision a un responsable et un moment précis.',
    items: [
      'Séparez démolition, réseaux, supports, revêtements, menuiserie, peinture et équipements.',
      'Identifiez les décisions qui doivent être prises avant de refermer murs, sols ou plafonds.',
      'Associez chaque acompte ou paiement intermédiaire à une étape compréhensible.',
      'Conservez une liste de réserves avant le paiement final et testez les équipements accessibles.'
    ],
    tool: '/outils/checklist-renovation', label: 'Ouvrir la checklist rénovation'
  },
  'climatisation-maroc-installation': {
    heading: 'Informations à préparer pour une climatisation',
    intro: 'La puissance affichée sur un appareil ne suffit pas à définir une bonne installation.',
    items: [
      'Notez les dimensions de la pièce, son exposition au soleil et les grandes surfaces vitrées.',
      'Repérez où pourraient passer alimentation, évacuation des condensats et liaisons frigorifiques.',
      'Demandez ce qui est inclus dans la pose, le percement, les supports et les finitions.',
      'Faites préciser l’accès nécessaire à l’unité extérieure et les opérations d’entretien prévues.'
    ],
    tool: '/outils/brief-artisan', label: 'Préparer un brief climatisation'
  },
  'serrurier-urgence-maroc': {
    heading: 'Préparer un dépannage de serrurerie',
    intro: 'Même dans l’urgence, quelques détails permettent d’éviter une intervention mal comprise.',
    items: [
      'Décrivez si la porte est claquée, verrouillée, déformée ou si une clé est cassée.',
      'Envoyez une photo de la serrure et de la tranche de porte lorsque cela est possible.',
      'Demandez le coût du déplacement et ce qui déclenche un remplacement plutôt qu’une ouverture.',
      'Faites confirmer le prix avant tout travail supplémentaire découvert sur place.'
    ],
    tool: '/outils/comparateur-devis', label: 'Comparer les conditions proposées'
  },
  'choisir-carreleur-maroc': {
    heading: 'Préparer un plan de pose avant de chiffrer',
    intro: 'Le format et la géométrie du chantier influencent directement les coupes et la quantité.',
    items: [
      'Mesurez la surface réellement carrelée et séparez sol, murs, plinthes et marches.',
      'Indiquez le format des carreaux et le sens ou motif de pose souhaité.',
      'Demandez comment le support sera contrôlé et préparé avant collage.',
      'Prévoyez une marge adaptée aux coupes, à la casse et à une petite réserve future.'
    ],
    tool: '/outils/calculateur-carrelage', label: 'Calculer carreaux et marge'
  },
  'macon-construction-maroc': {
    heading: 'Définir un lot de maçonnerie sans zone grise',
    intro: 'Les mots “maçonnerie” ou “gros œuvre” recouvrent des périmètres très différents.',
    items: [
      'Faites noter les dimensions, épaisseurs et zones concernées sur le devis ou un croquis.',
      'Distinguez clairement démolition, évacuation, fourniture, mise en œuvre et finitions.',
      'Pour un élément structurel, obtenez l’avis et les documents techniques adaptés au projet.',
      'Découpez les paiements selon des étapes vérifiables plutôt qu’un calendrier arbitraire.'
    ],
    tool: '/outils/checklist-renovation', label: 'Suivre les étapes du chantier'
  },
  'urgence-plomberie-casablanca': {
    heading: 'Checklist des dix premières minutes',
    intro: 'En cas de fuite, la priorité est de limiter les dégâts avant de chercher le prix le plus bas.',
    items: [
      'Coupez l’arrivée d’eau appropriée si vous savez le faire en sécurité.',
      'Éloignez les objets sensibles et évitez toute zone électrique mouillée.',
      'Photographiez l’origine apparente, la zone touchée et l’accès disponible.',
      'Lors de l’appel, demandez le déplacement, le diagnostic et la méthode de chiffrage des travaux.'
    ],
    tool: '/outils/brief-artisan', label: 'Générer un message d’urgence'
  },
  'petites-reparations-bricoleur-maison-maroc': {
    heading: 'Regrouper les petites réparations intelligemment',
    intro: 'Une liste priorisée évite qu’une journée de bricolage se transforme en série d’allers-retours.',
    items: [
      'Photographiez chaque tâche et donnez-lui un numéro.',
      'Séparez les réparations qui nécessitent un métier spécialisé des tâches de bricolage courant.',
      'Indiquez les fournitures déjà disponibles et celles à acheter.',
      'Classez les tâches en indispensable, utile et optionnelle pour gérer le temps sur place.'
    ],
    tool: '/outils/brief-artisan', label: 'Créer la liste à envoyer'
  },
  'repeindre-maison-maroc-guide': {
    heading: 'Mesurer avant d’acheter la peinture',
    intro: 'Une estimation utile part de la surface et du rendement réel du produit, pas du nombre de pièces.',
    items: [
      'Additionnez la longueur des murs et mesurez leur hauteur moyenne.',
      'Retirez les grandes ouvertures puis ajoutez séparément les plafonds si nécessaire.',
      'Définissez le nombre de couches et vérifiez le rendement indiqué par le fabricant.',
      'Demandez si préparation, protection, sous-couche, peinture et nettoyage sont compris.'
    ],
    tool: '/outils/calculateur-peinture', label: 'Calculer les litres de peinture'
  },
  'rangement-sur-mesure-menuisier-maroc': {
    heading: 'Brief de menuiserie avant fabrication',
    intro: 'Un meuble sur mesure doit être défini par son usage autant que par ses dimensions.',
    items: [
      'Listez ce qui sera rangé et les dimensions des objets importants.',
      'Notez largeur, hauteur, profondeur disponible et obstacles comme prises ou plinthes.',
      'Faites préciser matériau, finition, quincaillerie, poignées et type de pose.',
      'Confirmez le transport, l’accès, le montage sur place et les éventuelles reprises.'
    ],
    tool: '/outils/brief-artisan', label: 'Créer un brief menuiserie'
  },
  'nettoyage-profond-maison-guide': {
    heading: 'Définir une prestation de nettoyage',
    intro: '“Nettoyage profond” doit être traduit en zones, surfaces et résultat attendu.',
    items: [
      'Listez les pièces et signalez cuisine, sanitaires, vitres ou zones très encrassées.',
      'Précisez si le logement est vide, meublé, occupé ou après chantier.',
      'Demandez qui fournit produits, matériel, escabeau ou aspirateur spécifique.',
      'Faites confirmer les exclusions avant l’intervention, notamment textiles ou surfaces fragiles.'
    ],
    tool: '/outils/brief-artisan', label: 'Rédiger un brief nettoyage'
  },
  'creer-beau-jardin-maroc': {
    heading: 'Transformer une idée de jardin en plan exploitable',
    intro: 'Le choix des plantes vient après l’observation du soleil, du sol, de l’eau et du niveau d’entretien accepté.',
    items: [
      'Dessinez les zones de soleil, d’ombre, de passage et les points d’eau disponibles.',
      'Définissez le temps d’entretien que vous êtes prêt à consacrer chaque semaine.',
      'Séparez plantation, irrigation, éclairage, maçonnerie et mobilier dans le devis.',
      'Demandez un plan d’arrosage et une liste des végétaux avec leurs besoins principaux.'
    ],
    tool: '/outils/brief-artisan', label: 'Préparer un brief jardin'
  },
  'projet-soudure-ferronnerie-maroc': {
    heading: 'Spécifier un ouvrage métallique avant fabrication',
    intro: 'Une grille, un portail ou un garde-corps doit être décrit par dimensions, profils, finition et fixation.',
    items: [
      'Fournissez les dimensions du vide ou de l’emplacement, avec photos et points de fixation.',
      'Faites préciser les sections de métal, l’épaisseur et les éléments de quincaillerie.',
      'Choisissez la protection et la finition avant fabrication pour éviter les reprises.',
      'Clarifiez transport, levage, soudure sur place, scellements et retouches après pose.'
    ],
    tool: '/outils/brief-artisan', label: 'Créer un brief ferronnerie'
  },
  'jardin-anglais-maroc-darija': {
    heading: 'قبل ما تشري النباتات: دير هاد الخطة',
    intro: 'الجردة الزوينة كتبدأ بالشمس والماء والتربة والصيانة، ماشي غير بلائحة ديال النباتات.',
    items: [
      'قسم الجردة لبلايص ديال الشمس، النصف ظل، الممرات والجلوس.',
      'حدد من الأول فين غادي يدوز السقي وشحال من مرة تقدر تدير الصيانة.',
      'فرق فالديفي بين النباتات، التربة، السقي، الإضاءة والخدمة ديال التهيئة.',
      'طلب لائحة واضحة ديال النباتات باش تعرف الحجم ديالها والصيانة اللي محتاجة.'
    ],
    tool: '/outils/brief-artisan', label: 'حضّر brief ديال الجردة'
  },
  'cuisine-moderne-zero-maroc-darija': {
    heading: 'قبل fabrication ديال الكوزينة',
    intro: 'القياسات بوحدها ما كافياش: خاص الأجهزة، الماء، الكهرباء والتهوية يكونو محسوبين قبل التصنيع.',
    items: [
      'كتب القياسات ومكان الباب، الشراجم وأي عمود ولا زاوية خارجة.',
      'ثبت المقاسات الحقيقية ديال frigo، four، lave-vaisselle وplaque قبل الطلب.',
      'راجع الماء، الصرف، prises، éclairage وhotte قبل ما تسد الحيطان.',
      'خلي الديفي يوضح caissons، façades، plan de travail، quincaillerie والتركيب.'
    ],
    tool: '/outils/checklist-renovation', label: 'استعمل checklist ديال التجديد'
  },
  'escalier-suspendu-maison-maroc-darija': {
    heading: 'النقط اللي خاصها تتحسم قبل التصنيع',
    intro: 'الدرج المعلق مشروع structure وسلامة قبل ما يكون غير شكل.',
    items: [
      'خاص القياسات وارتفاع كل marche يتراجعو على حسب المكان الحقيقي.',
      'حدد من المسؤول على structure، fabrication، التثبيت وgarde-corps.',
      'ما تبدلش نوع الحديد ولا الخشب ولا طريقة التثبيت بلا مراجعة تقنية.',
      'خطط للإضاءة والتمريرات الكهربائية قبل ما تكمل التشطيبات.'
    ],
    tool: '/outils/checklist-renovation', label: 'تبع مراحل المشروع'
  },
  'open-space-maison-maroc-darija': {
    heading: 'قبل ما تحيد أي حيط',
    intro: 'Open Space كيبدا بالتأكد من structure ومن الشبكات اللي دايزين فالحيط.',
    items: [
      'ما تفترضش بالعين واش الحيط حامل ولا لا؛ خذ رأي تقني مناسب قبل الهدم.',
      'سجل فين دايز الماء، الصرف، الكهرباء والتهوية قبل أي تغيير.',
      'قسم الفضاء الجديد للطبخ، الأكل، الجلوس والتخزين باش الضوء والصوت يبقاو محسوبين.',
      'رتب الأشغال: structure والشبكات أولاً، ومن بعد السقف، الأرضية والصباغة.'
    ],
    tool: '/outils/checklist-renovation', label: 'وجد checklist ديال الأشغال'
  },
  'villa-riad-piscine-jardin-maroc-darija': {
    heading: 'خطة عملية قبل ما تجمع riad والمسبح والجردة',
    intro: 'هاد المشروع فيه الخصوصية، الماء، الصرف، الصيانة والحركة بين الداخل والخارج.',
    items: [
      'رسم المسارات بين الصالون، patio، المسبح والجردة قبل اختيار الزواق.',
      'حدد من الأول local technique ديال المسبح، الصرف ونقط السقي.',
      'فرق فالديفي بين structure، étanchéité، zellige، tadelakt، jardin وéclairage.',
      'حسب الصيانة: الوصول للمعدات، تنظيف المسبح، السقي وإصلاح أي fuite مستقبلاً.'
    ],
    tool: '/outils/checklist-renovation', label: 'رتب المشروع ب checklist'
  },
  'hammam-beldi-maison-maroc-darija': {
    heading: 'قبل الزليج والتدلاكت: راجع الطبقات المخفية',
    intro: 'المشكل فحمام بلدي غالباً كيبدأ من العزل، الصرف أو التهوية قبل ما يبان فالتشطيب.',
    items: [
      'حدد ميول الأرضية ونقط الصرف قبل العزل والتشطيب.',
      'اتفق شكون مسؤول على waterproofing وكيفاش غادي يتم الاختبار قبل التغطية.',
      'خطط للتهوية وخروج البخار باش الرطوبة ما تبقاش محبوسة.',
      'خلي الكهرباء والإنارة بعيدة على الارتجال وخلي المختص يحدد الحل المناسب للمكان.'
    ],
    tool: '/outils/checklist-renovation', label: 'تبع المراحل قبل التشطيب'
  }
,
  'guide-trouver-artisan-fiable-maroc': {
    heading: 'Préparer une demande qu’un professionnel peut réellement chiffrer',
    intro: 'Avant de juger une réponse, donnez à chaque professionnel le même point de départ. Cette fiche ne pose pas le diagnostic à sa place : elle décrit ce que vous observez et ce que vous attendez.',
    items: [
      'Décrivez le symptôme ou le résultat souhaité, la pièce concernée et depuis quand le problème existe.',
      'Indiquez la ville ou le quartier, le type de logement et les contraintes d’accès utiles au rendez-vous.',
      'Ajoutez des photos générales et rapprochées uniquement si elles peuvent être prises sans danger.',
      'Demandez séparément le déplacement, le diagnostic, la main-d’œuvre et les fournitures lorsque ces frais peuvent s’appliquer.',
      'Vérifiez le nom et le numéro du contact, puis gardez par écrit les points convenus pour le rendez-vous.'
    ],
    exampleTitle: 'Exemple de demande assez précise',
    example: 'Bonjour, je suis à [quartier, ville]. Je souhaite faire examiner [problème observé] dans [pièce ou zone]. Le problème est apparu [moment / fréquence]. Je peux envoyer des photos. Avant de fixer le rendez-vous, pouvez-vous préciser vos frais de déplacement ou de diagnostic, et comment le coût des réparations sera confirmé après inspection ?',
    tool: '/outils/brief-artisan', label: 'Créer un brief artisan'
  },
  'questions-avant-travaux-artisan-maroc': {
    heading: 'Les réponses à obtenir avant le premier coup d’outil',
    intro: 'Une réponse utile doit permettre de comprendre ce qui est prévu et ce qui reste à décider. Les questions ci-dessous sont à adapter au métier et à l’importance du chantier.',
    items: [
      'Périmètre : quelles opérations sont incluses, et lesquelles restent à la charge du client ?',
      'Coût : le montant inclut-il déplacement, diagnostic, fournitures, consommables, évacuation et finitions ?',
      'Matériaux : qui achète les fournitures et quelles références ou caractéristiques seront utilisées ?',
      'Calendrier : quelle date de début est possible, quelle durée est estimée et qu’est-ce qui pourrait la modifier ?',
      'Paiement : quel acompte éventuel est demandé, à quoi correspond-il et quand le solde devient-il dû ?',
      'Changement : comment le supplément de travail et son prix seront-ils confirmés avant de commencer ?'
    ],
    exampleTitle: 'Une question à envoyer avant le déplacement',
    example: 'Pour éviter tout malentendu, pouvez-vous me confirmer par écrit le coût du déplacement ou du diagnostic, si ce montant est déduit des travaux en cas d’accord, et à quel moment vous me communiquerez une estimation avant toute réparation ?',
    tool: '/outils/comparateur-devis', label: 'Comparer les réponses et les devis'
  },
  'comparer-devis-travaux-maroc': {
    heading: 'Faire une comparaison à périmètre égal',
    intro: 'Une grille ne devrait pas transformer des informations manquantes en note de qualité. Commencez par repérer les lignes qui ne sont pas comparables et faites-les clarifier avant de choisir.',
    items: [
      'Recopiez les travaux dans le même ordre : préparation, dépose, réparation, pose, finitions et nettoyage, selon le projet.',
      'Séparez les montants de main-d’œuvre, fournitures, transport et évacuation lorsqu’ils sont détaillés.',
      'Comparez les quantités et les références de matériaux ; demandez le calcul si les chiffres diffèrent sensiblement.',
      'Marquez chaque ligne comme incluse, exclue ou non précisée. « Non précisé » ne veut pas dire « inclus ».',
      'Demandez une version corrigée ou une confirmation écrite si le périmètre ou le total n’est pas clair.'
    ],
    exampleTitle: 'Exemple fictif : deux montants, deux périmètres',
    example: 'Devis A : pose et main-d’œuvre précisées, déplacement et évacuation non mentionnés. Devis B : déplacement inclus, mais préparation des supports non détaillée. Avant de comparer le total, demandez aux deux professionnels de confirmer ces postes et les mêmes quantités. L’exemple illustre la méthode ; il ne représente pas un tarif de marché.',
    tool: '/outils/comparateur-devis', label: 'Ouvrir le comparateur de devis'
  },
  'preparer-renovation-maison-maroc': {
    heading: 'Ordonner les décisions avant de lancer les finitions',
    intro: 'Le calendrier dépend du logement et des métiers choisis. Cette séquence est un aide-mémoire de coordination, pas un ordre technique universel : les intervenants compétents doivent confirmer les dépendances du chantier.',
    items: [
      'Définition : relever les zones concernées, les mesures disponibles, ce qui sera conservé et le résultat attendu.',
      'Vérifications : repérer les questions de structure, d’électricité, de gaz, de plomberie, d’étanchéité ou de ventilation à faire évaluer avant démolition.',
      'Travaux cachés : faire confirmer les réseaux et supports nécessaires avant de refermer murs, plafonds ou sols.',
      'Finitions : confirmer formats, teintes, sens de pose, emplacements d’équipement et disponibilité des matériaux avant commande.',
      'Réception : tester les équipements accessibles, noter les réserves et garder les confirmations écrites des reprises à effectuer.'
    ],
    exampleTitle: 'Exemple de point de passage',
    example: 'Avant la pose du carrelage, vérifiez que les interventions qui doivent passer sous le revêtement ont été planifiées et contrôlées par les professionnels concernés. Si un réseau ou un élément technique reste incertain, suspendez la finition concernée jusqu’à clarification plutôt que de compter sur une correction après fermeture.',
    tool: '/outils/checklist-renovation', label: 'Suivre les étapes de rénovation'
  },
  'brief-clair-artisan-maroc': {
    heading: 'Un modèle de brief prêt à personnaliser',
    intro: 'Ce modèle rassemble les informations utiles sans demander au particulier de choisir lui-même une solution technique. Supprimez les champs qui ne s’appliquent pas et n’envoyez que des informations que vous acceptez de partager.',
    items: [
      'Décrivez le travail souhaité ou le symptôme observé, sans affirmer une cause que personne n’a vérifiée.',
      'Ajoutez la ville, le quartier, le type de logement et les contraintes d’accès utiles.',
      'Indiquez la période souhaitée, les photos disponibles et les informations qui manquent encore.',
      'Demandez la visite ou les vérifications nécessaires, ainsi que la manière dont le prix sera confirmé.',
      'Envoyez le même brief aux professionnels comparés puis conservez leurs réponses côte à côte.'
    ],
    exampleTitle: 'Modèle à copier puis compléter',
    example: 'Bonjour, je cherche un professionnel pour [travail souhaité] à [quartier, ville].\nType de logement / zone : [préciser].\nCe que j’observe et depuis quand : [décrire sans poser de diagnostic].\nDimensions ou photos disponibles : [préciser].\nContraintes d’accès ou horaires : [préciser].\nPériode souhaitée : [préciser].\nPouvez-vous indiquer les informations ou la visite nécessaires avant d’établir le devis, ce qui est inclus dans le montant et les éventuels frais de déplacement ou de diagnostic ?',
    tool: '/outils/brief-artisan', label: 'Générer et copier votre brief'
  },
  'comparer-devis-travaux-maroc-darija': {
    heading: 'مثال عملي باش تقارن بين جوج ديفيات',
    intro: 'ما تحكمش غير على الثمن النهائي. شوف واش كل ديفي كيهضر على نفس الخدمة، نفس الكميات ونفس المواد، وشنو باقي ما واضحش.',
    items: [
      'كتب الأشغال بنفس الترتيب: التهييء، الحيد، الإصلاح، التركيب والتشطيب على حساب المشروع.',
      'فرق بين اليد العاملة، المواد، التنقل وجمع النفايات إلا كانو مفصلين.',
      'إلى شي كمية ولا مادة مختلفة، سول على طريقة الحساب والمرجع قبل المقارنة.',
      'ميز بين داخل فالثمن، ما داخلش، وما مذكورش. الحاجة اللي ما مذكوراش ماشي بالضرورة داخلة.',
      'خلي أي تغيير فالأشغال والثمن يتأكد كتابياً قبل ما تبدا الخدمة الإضافية.'
    ],
    exampleTitle: 'رسالة قصيرة تقدر تصيفطها',
    example: 'السلام عليكم، بغيت نقارن الديفي مزيان قبل ما نوافق. واش ممكن توضح ليا شنو داخل فالثمن وشنو ما داخلش؟ واش التنقل والتشخيص والمواد والتنقية محسوبين؟ وإلى بان شي عمل إضافي، واش غادي نتافقو على الثمن كتابياً قبل ما تبداو فيه؟ شكراً.',
    tool: '/outils/comparateur-devis', label: 'حلّ مقارن الديفيات'
  }
};

function esc(v=''){return String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
const failures=[];
for(const slug of INDEXABLE_BLOG_SLUGS){
  const file=path.join(blogRoot,slug,'index.html');
  if(!fs.existsSync(file)){failures.push(slug+': missing file');continue;}
  const mod=modules[slug];
  let html=fs.readFileSync(file,'utf8');
  if(!mod){
    if(/data-snay3i-action-module=["']1["']/i.test(html)) continue;
    failures.push(slug+': missing high-value module');continue;
  }
  html=html.replace(/\s*<section[^>]*data-snay3i-action-module=["']1["'][^>]*>[\s\S]*?<\/section>\s*/gi,'\n');
  const isDarija=/<html[^>]*lang=["']ary["']/i.test(html);
  const section=`<section data-snay3i-action-module="1"${isDarija?' lang="ary" dir="rtl"':''}><h2>${esc(mod.heading)}</h2><p>${esc(mod.intro)}</p><ul>${mod.items.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>${mod.example?`<div data-snay3i-case-example="1" style="margin:18px 0;padding:16px 18px;border-left:4px solid #b34f24;background:#faf6ef;border-radius:10px"><h3 style="margin:0 0 8px;font-size:17px">${esc(mod.exampleTitle||"Exemple à adapter")}</h3><p style="margin:0;white-space:normal">${esc(mod.example).replace(/\\n/g,"<br>")}</p></div>`:""}<p><a href="${mod.tool}"><strong>${esc(mod.label)} →</strong></a> · <a href="/editorial-policy">${isDarija?'كيفاش كنراجعو المحتوى':'Comment nous préparons et corrigeons nos guides'}</a></p></section>`;
  if(!/<\/article>/i.test(html)){failures.push(slug+': article closing tag missing');continue;}
  html=html.replace(/<\/article>/i,section+'</article>');
  html=html.replace(/"dateModified":"\d{4}-\d{2}-\d{2}"/g,`"dateModified":"${modified}"`);
  html=html.replace(/<time datetime="\d{4}-\d{2}-\d{2}" data-date-modified="1">[\s\S]*?<\/time>/i,isDarija?`<time datetime="${modified}" data-date-modified="1">10 شتنبر 2026</time>`:`<time datetime="${modified}" data-date-modified="1">10 septembre 2026</time>`);
  fs.writeFileSync(file,html,'utf8');
}
for(const slug of INDEXABLE_BLOG_SLUGS){
  const file=path.join(blogRoot,slug,'index.html');
  if(!fs.existsSync(file)){failures.push(slug+': missing article after enrichment');continue;}
  const html=fs.readFileSync(file,'utf8');
  if(!/data-snay3i-action-module=["']1["']/.test(html)) failures.push(slug+': topic-specific action module missing');
  if(!/data-snay3i-case-example=["']1["']/.test(html)) failures.push(slug+': worked example or reusable template missing');
}
if(failures.length) throw new Error('[high value editorial] BLOCKED:\n'+failures.join('\n'));
console.log('[high value editorial] PASS: '+INDEXABLE_BLOG_SLUGS.length+' canonical guides enriched with topic-specific action modules and truthful modification dates');

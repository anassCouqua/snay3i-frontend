const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const blogRoot = path.join(root, 'public', 'blog');

const U = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=82`;
const D = (id) => `https://unsplash.com/photos/${id}/download?force=true`;

const ARTICLES = [
  {
    slug: 'guide-trouver-artisan-fiable-maroc',
    lang: 'fr',
    title: 'Comment trouver un artisan fiable au Maroc : méthode avant travaux',
    description: 'Une méthode pratique pour chercher un artisan au Maroc, préparer sa demande, comparer les réponses et clarifier les conditions avant les travaux.',
    hero: U('photo-1504148455328-c376907d081c'),
    detail: U('photo-1530124566582-a618bc2615dc'),
    heroAlt: 'Outils de bricolage préparés pour une intervention à domicile',
    detailAlt: 'Artisan travaillant avec des outils manuels dans un atelier',
    support2: U('photo-1581094288338-2314dddb7ece'),
    support2Alt: 'Artisan préparant du matériel pour une intervention',
    content: `
## Commencez par définir précisément le besoin

Chercher un artisan devient beaucoup plus simple lorsque la demande est claire. « Je cherche un plombier » est un bon début, mais cela ne permet pas encore à un professionnel de comprendre ce qu'il devra réellement faire.

Avant de contacter quelqu'un, notez le problème, la pièce concernée, la ville ou le quartier, ce que vous avez déjà constaté et ce que vous aimeriez obtenir à la fin.

Pour une fuite, par exemple, vous pouvez préciser si elle est visible sous un évier, au niveau d'un raccord ou sur un mur. Pour une peinture, vous pouvez indiquer les pièces, les surfaces à traiter et l'état actuel des murs.

Cette préparation n'a pas besoin d'être technique. Son but est simplement de donner au professionnel assez d'informations pour poser les bonnes questions.

## Comparez la compréhension du projet, pas seulement le prix

Une première réponse très rapide n'est pas forcément une mauvaise réponse, mais elle vous donne peu d'éléments pour décider.

Lorsque vous contactez plusieurs professionnels, observez surtout s'ils ont compris la demande de la même façon.

Demandez :

- ce qui sera réalisé ;
- ce qui n'est pas compris ;
- les informations ou photos supplémentaires nécessaires ;
- les matériaux qui seront fournis ;
- le moment où une visite ou un diagnostic sur place est nécessaire.

Deux professionnels peuvent annoncer des montants différents tout en proposant des travaux différents. Une comparaison n'est utile que lorsque le périmètre est suffisamment proche.

## Demandez ce qui est inclus dans l'intervention

Un prix annoncé oralement peut correspondre uniquement à la main-d'œuvre, ou inclure une partie des fournitures.

Posez une question simple : « Qu'est-ce qui est compris dans ce montant ? »

Selon le métier, cela peut concerner :

- le déplacement ;
- le diagnostic ;
- la préparation du support ;
- les matériaux ;
- la pose ;
- l'évacuation des déchets ;
- les petites reprises de finition.

Vous n'avez pas besoin d'exiger le même niveau de détail pour une petite réparation et pour une rénovation complète. Le niveau de précision doit simplement être adapté au projet.

## Demandez un devis ou une description écrite lorsque le chantier est important

Pour des travaux avec plusieurs étapes, un écrit réduit les malentendus.

Le document peut rester simple. Il peut préciser le travail prévu, les matériaux, la main-d'œuvre, le délai estimé et les conditions de paiement.

L'objectif n'est pas de produire un contrat complexe. C'est d'avoir une référence commune avant le début des travaux.

Si une modification apparaît pendant le chantier, demandez ce qui a changé et, lorsque le coût évolue, faites confirmer le nouveau montant avant les travaux supplémentaires.

## Demandez des exemples lorsque le métier s'y prête

Pour certains projets, des photos peuvent aider à comprendre le type de réalisation proposé.

Un menuisier peut montrer un meuble sur mesure. Un carreleur peut montrer plusieurs types de pose. Un peintre peut présenter différentes finitions.

Une photo ne constitue toutefois pas à elle seule une preuve complète de compétence. Lorsque les réalisations comptent dans votre choix, demandez simplement si elles correspondent bien à des travaux effectués par le professionnel.

## Vérifiez les coordonnées et gardez une trace des échanges importants

Avant un rendez-vous, vérifiez le nom utilisé par le professionnel et le numéro auquel vous pouvez le joindre.

Pour un projet important, gardez les éléments essentiels de la discussion : devis, messages, montant convenu, étapes de paiement et changements validés.

Cette habitude est utile même lorsque tout se passe bien.

## Ne confondez pas annuaire, avis et certification

La présence d'un professionnel sur un annuaire ne signifie pas automatiquement qu'il est certifié, disponible immédiatement ou adapté à votre projet.

De la même manière, un avis en ligne est une information parmi d'autres. Il ne remplace pas la discussion sur votre chantier.

Sur Snay3i.ma, les informations publiées sur une fiche servent à faciliter la recherche et la prise de contact. La disponibilité, les prix et les conditions doivent être confirmés directement avec le professionnel.

## Méfiez-vous des promesses difficiles à vérifier

Une promesse très précise mérite une question précise.

Par exemple, si une annonce promet une intervention « immédiate » ou un résultat présenté comme « certain », demandez ce que cela signifie concrètement.

Qui intervient ? Dans quel délai ? Qu'est-ce qui est compris ? Quelles sont les conditions ?

Le but n'est pas de suspecter chaque professionnel. Il est simplement de transformer une promesse générale en informations vérifiables.

## Avant de verser un acompte

Avant tout paiement, assurez-vous de comprendre ce que l'acompte couvre et à quelle étape les paiements suivants interviennent.

Pour un chantier conséquent, essayez d'associer chaque paiement à une étape identifiable plutôt qu'à une promesse vague.

Conservez également le justificatif du paiement.

## Une checklist simple avant de choisir

Avant de confirmer un artisan, vérifiez :

- ai-je décrit correctement le travail ?
- ai-je compris ce qui est inclus ?
- ai-je identifié les matériaux à fournir ?
- ai-je un prix ou une estimation suffisamment claire ?
- ai-je compris le délai prévu ?
- ai-je clarifié les conditions de paiement ?
- ai-je posé mes questions sur les travaux supplémentaires ?

Cette checklist peut être réutilisée pour presque tous les métiers.

## La recherche d'un artisan est une étape, pas la décision finale

Un annuaire peut vous aider à trouver des professionnels et à comparer leurs informations. La décision doit ensuite reposer sur la compréhension de votre projet, les réponses reçues et les conditions convenues.

Pour un chantier important, prenez le temps nécessaire avant de commencer. Quelques minutes de préparation peuvent éviter beaucoup de discussions inutiles pendant les travaux.

Snay3i.ma permet de rechercher des professionnels par métier et par ville. Utilisez ensuite les informations de leur fiche comme point de départ pour une prise de contact directe.
`
  },
  {
    slug: 'questions-avant-travaux-artisan-maroc',
    lang: 'fr',
    title: '7 questions à poser à un artisan avant les travaux',
    description: 'Sept questions simples pour clarifier le projet, le prix, les matériaux, le délai et les conditions avant de commencer des travaux au Maroc.',
    hero: U('photo-1768321902097-1d85e7735c5f'),
    detail: U('photo-1768321902794-c24fb1f00661'),
    heroAlt: 'Intérieur en cours de rénovation avec matériaux visibles',
    detailAlt: 'Chantier de rénovation préparé avant les finitions',
    support2: U('photo-1621905252507-b35492cc74b4'),
    support2Alt: 'Chantier résidentiel avant la phase de finition',
    content: `
## 1. Avez-vous bien compris les travaux ?

La première question paraît évidente, mais elle évite beaucoup de malentendus.

Après avoir expliqué votre besoin, demandez au professionnel de résumer ce qu'il prévoit de faire. S'il a compris différemment une partie de votre demande, vous pourrez la corriger immédiatement.

Pour une salle de bains, par exemple, précisez si vous parlez d'une réparation, d'un remplacement d'équipement ou d'une rénovation plus complète.

Pour une cuisine, précisez les éléments concernés et ceux que vous souhaitez conserver.

## 2. Qu'est-ce qui est compris dans le prix ?

Un montant seul ne permet pas de comparer deux propositions.

Demandez ce qui est inclus : déplacement, diagnostic, main-d'œuvre, préparation, fournitures, pose, nettoyage ou évacuation des déchets.

La réponse dépend du métier et de la taille du chantier. L'important est de comprendre le périmètre avant de comparer.

## 3. Qui fournit les matériaux ?

Certains professionnels achètent les matériaux. Dans d'autres projets, le client les fournit.

Demandez ce qui est prévu dans votre cas et, lorsque cela a un impact important sur le budget, faites préciser les références ou caractéristiques nécessaires.

Pour de la peinture, cela peut concerner le type de peinture et le rendement annoncé par le fabricant.

Pour du carrelage, il peut être utile de préciser le format, la quantité et les produits de pose.

## 4. Combien de temps faut-il prévoir ?

Demandez une estimation plutôt qu'une promesse absolue.

Vous pouvez demander :

« Quand pensez-vous pouvoir commencer ? »

puis :

« Combien de temps faut-il prévoir dans des conditions normales ? »

Demandez également ce qui pourrait modifier le délai : disponibilité des matériaux, préparation du support, accès au logement ou découverte d'un problème pendant le chantier.

## 5. Avez-vous réalisé des travaux similaires ?

Cette question est particulièrement utile pour les projets spécialisés.

Demandez au professionnel de vous parler d'un travail comparable au vôtre. Lorsqu'il dispose de photos de réalisations, celles-ci peuvent vous aider à visualiser le résultat attendu.

Une réalisation ancienne ou différente de votre projet n'est pas forcément inutile. Elle permet simplement de distinguer l'expérience générale de l'expérience sur votre type de chantier.

## 6. Comment se passe le paiement ?

Avant le début du chantier, clarifiez :

- le montant éventuel de l'acompte ;
- ce qu'il couvre ;
- les étapes de paiement ;
- le moment du solde ;
- la manière dont les travaux supplémentaires sont validés.

Pour un petit dépannage, le fonctionnement peut être très simple. Pour un chantier important, il est préférable que les étapes soient clairement comprises par les deux parties.

## 7. Que se passe-t-il si le chantier change ?

Un chantier peut révéler un problème qui n'était pas visible au départ.

Demandez donc :

« Si vous découvrez quelque chose qui n'était pas prévu, comment allons-nous valider le changement ? »

La bonne pratique consiste à comprendre la cause du changement et à confirmer son impact avant de lancer les travaux supplémentaires lorsque cela est possible.

## Une question supplémentaire : quand êtes-vous réellement disponible ?

Une fiche en ligne ne doit pas être interprétée comme une garantie de disponibilité.

Demandez directement la date ou la période possible d'intervention.

Pour une urgence, précisez la situation et demandez si le professionnel peut réellement la prendre en charge.

## Utilisez les mêmes questions avec plusieurs professionnels

Lorsque vous comparez deux ou trois propositions, utilisez autant que possible la même liste de questions.

Vous pouvez noter :

| Point | Artisan A | Artisan B |
|---|---|---|
| Travaux compris | | |
| Matériaux | | |
| Délai | | |
| Prix | | |
| Paiement | | |
| Réalisations similaires | | |
| Questions restantes | | |

Cette méthode permet de comparer le contenu plutôt que de choisir automatiquement le montant le plus bas.

## Quand une question devient particulièrement importante

Plus le chantier est coûteux ou complexe, plus il est utile de demander des précisions.

Une petite réparation d'une heure ne demande pas la même préparation qu'une rénovation de plusieurs semaines.

Pour un chantier important, prenez le temps de clarifier les travaux avant de programmer l'intervention.

## Ce qu'il faut retenir

Les bonnes questions ne servent pas à compliquer la relation avec l'artisan. Elles servent à mettre les deux parties sur la même longueur d'onde.

Avant de commencer, vous devriez comprendre ce qui sera fait, avec quels matériaux, dans quel délai, à quel coût et comment seront traités les changements.

Vous pouvez ensuite utiliser Snay3i.ma pour rechercher des professionnels par métier et par ville et commencer vos prises de contact avec une demande beaucoup plus précise.
`
  },
  {
    slug: 'comparer-devis-travaux-maroc',
    lang: 'fr',
    title: 'Comment comparer deux devis de travaux au Maroc',
    description: 'Une méthode pratique pour comparer plusieurs devis de travaux au Maroc en regardant le contenu, les matériaux, les délais et les conditions.',
    hero: U('photo-1589939705384-5185137a7f0f'),
    detail: U('photo-1562259949-e8e7689d7828'),
    heroAlt: 'Travaux de peinture intérieure pendant une rénovation',
    detailAlt: 'Matériel de peinture préparé avant une intervention',
    support2: U('photo-1556912167-f556f1f39fdf'),
    support2Alt: 'Intérieur de logement en cours de préparation pour des travaux',
    content: `
## Commencez par le périmètre des travaux

Avant de comparer les montants, comparez les prestations.

Pour une rénovation, vérifiez si les deux devis comprennent les mêmes opérations : dépose, préparation, réparation des supports, pose, fournitures, finition, nettoyage et évacuation.

Pour un chantier de peinture, demandez par exemple si la préparation des murs et la sous-couche sont comprises.

Pour un chantier de plomberie, vérifiez si le diagnostic, les pièces et la main-d'œuvre sont inclus.

## Comparez les matériaux

Une différence de prix peut venir simplement des matériaux prévus.

Demandez ce qui est fourni et, lorsque cela compte dans le résultat, les caractéristiques ou références principales.

Vous n'avez pas besoin de choisir le produit le plus cher. Vous devez simplement savoir ce qui est proposé.

## Vérifiez les quantités

Lorsque le devis comporte des quantités, comparez-les.

Regardez les mètres carrés, les mètres linéaires, le nombre d'équipements, les pièces ou les quantités de matériaux.

Si deux devis présentent des chiffres très différents, demandez comment chaque professionnel a calculé son estimation.

## Cherchez les éléments « non compris »

Les mentions « à la charge du client » ou « non compris » peuvent expliquer une grande partie d'un écart.

Une offre moins chère peut laisser certaines fournitures, la préparation ou l'évacuation à votre charge.

Une comparaison honnête doit donc regarder le total probable du projet, pas uniquement le premier chiffre affiché.

## Comparez la main-d'œuvre et les étapes

Le prix de la main-d'œuvre ne doit pas être isolé du travail prévu.

Demandez comment l'intervention est organisée et quelles étapes sont incluses.

Pour un projet complexe, notez les moments clés : préparation, réalisation, contrôle et finition.

Vous pourrez ensuite comparer des offres qui parlent réellement du même chantier.

## Regardez les délais

Deux devis identiques sur le prix peuvent être très différents sur l'organisation.

Comparez :

- la date de début ;
- la durée estimée ;
- les dépendances entre les étapes ;
- ce qui peut provoquer un retard.

Il n'est pas toujours utile de choisir le devis qui commence le plus vite. Le plus important est que le délai soit cohérent avec le projet.

## Clarifiez les conditions de paiement

Demandez quand les paiements sont prévus et ce qu'ils correspondent à.

Pour les travaux en plusieurs étapes, il est souvent plus simple de relier les paiements à des étapes compréhensibles.

Conservez les informations convenues et faites confirmer les modifications importantes.

## Que faire lorsqu'un devis est beaucoup moins cher ?

Ne concluez ni que l'artisan est excellent, ni qu'il y a forcément un problème.

Demandez simplement :

« Pouvez-vous me détailler ce qui explique la différence ? »

La réponse peut venir du périmètre, des matériaux, des quantités, du délai ou de l'organisation.

Cette question est plus utile qu'une négociation immédiate.

## Créez un tableau de comparaison

Pour un projet important, un tableau très simple peut suffire.

| Élément | Devis A | Devis B | Devis C |
|---|---|---|---|
| Travaux compris | | | |
| Matériaux | | | |
| Quantités | | | |
| Préparation | | | |
| Nettoyage | | | |
| Délai | | | |
| Paiement | | | |
| Total | | | |
| Questions à clarifier | | | |

Vous pouvez également ajouter une colonne « remarques » pour noter ce qui mérite une confirmation.

## Un devis n'est pas forcément définitif

Un chantier peut évoluer après découverte d'un problème ou modification demandée par le client.

Lorsque cela arrive, demandez :

- pourquoi le travail supplémentaire est nécessaire ;
- quel élément du devis initial change ;
- combien cela ajoute au montant ;
- quand le travail peut être réalisé.

Pour les changements importants, demandez une validation claire avant de poursuivre lorsque c'est possible.

## Le comparateur de devis Snay3i

Snay3i.ma propose un outil gratuit pour vous aider à structurer une comparaison de devis.

L'outil ne choisit pas un artisan à votre place et ne transforme pas automatiquement un devis en recommandation. Il sert à organiser les informations et à repérer les points à clarifier.

## Le bon devis est d'abord celui que vous comprenez

Un devis plus bas n'est pas automatiquement meilleur. Un devis plus haut ne l'est pas non plus.

La comparaison devient utile lorsque vous savez exactement ce qui sera fait, ce qui ne l'est pas, quels matériaux sont prévus, combien vous paierez et comment les changements seront gérés.

C'est cette clarté qui vous permet de prendre une décision plus sereine.
`
  },
  {
    slug: 'preparer-renovation-maison-maroc',
    lang: 'fr',
    title: 'Préparer une rénovation de maison au Maroc : ordre des travaux',
    description: 'Guide pratique pour structurer une rénovation au Maroc, définir les lots, éviter les reprises inutiles et préparer les devis.',
    hero: U('photo-1503387762-592deb58ef4e'),
    detail: U('photo-1505691938895-1758d7feb511'),
    heroAlt: 'Maison en chantier pendant une phase de rénovation',
    detailAlt: 'Travaux intérieurs préparés avant les finitions',
    support2: U('photo-1497366754035-f200968a6e72'),
    support2Alt: 'Intérieur de maison préparé pour plusieurs étapes de rénovation',
    content: `
## Commencez par observer le logement

Avant de contacter plusieurs artisans, faites un état des lieux.

Notez les problèmes visibles, les éléments que vous souhaitez conserver et les changements que vous envisagez.

Séparez ce qui est indispensable de ce qui est simplement souhaité.

Cette première liste peut contenir la plomberie, l'électricité, les murs, les sols, la menuiserie, la peinture, la cuisine ou la salle de bains.

## Classez les travaux par lots

Une rénovation devient plus lisible lorsque les travaux sont regroupés.

Par exemple :

- démolition ou dépose ;
- structure et maçonnerie ;
- plomberie ;
- électricité ;
- préparation des supports ;
- carrelage et revêtements ;
- menuiserie ;
- peinture ;
- équipements et finitions.

Tous les projets ne suivent pas exactement cette liste, mais le principe est important : savoir qui intervient, à quel moment et sur quoi.

## Faites les choix qui bloquent les étapes suivantes

Certaines décisions doivent être prises avant de fermer un mur ou un sol.

C'est le cas notamment des passages de câbles, de certaines canalisations, de l'évacuation des eaux, des prises ou de l'emplacement des équipements.

Avant de lancer une finition, vérifiez que les travaux cachés nécessaires ont été traités.

Cela réduit le risque de casser une finition neuve pour corriger un réseau oublié.

## Préparez un brief différent pour chaque métier

Une demande précise permet à l'artisan de mieux comprendre son lot.

Pour un peintre, indiquez les pièces et l'état des murs.

Pour un électricien, listez les pièces, prises, points lumineux et équipements concernés.

Pour un menuisier, préparez les dimensions disponibles, les usages et les contraintes d'accès.

Vous pouvez utiliser le brief artisan Snay3i pour préparer un message structuré.

## Demandez des devis comparables

Pour chaque métier, essayez de demander les mêmes informations.

Cela peut inclure :

- travaux prévus ;
- matériaux ;
- main-d'œuvre ;
- délai ;
- conditions de paiement ;
- éléments non compris.

Si un artisan a besoin d'une visite pour établir un montant sérieux, prévoyez cette étape plutôt que de comparer plusieurs estimations téléphoniques très approximatives.

## Organisez la circulation sur le chantier

Une rénovation implique souvent plusieurs métiers.

Pensez aux accès, à la protection des zones terminées, au stockage des matériaux et à la gestion des déchets.

L'organisation pratique peut devenir aussi importante que le travail lui-même.

Lorsque plusieurs professionnels doivent intervenir, gardez un calendrier simple avec les étapes et les dépendances.

## Ne fermez pas un chantier sans vérifier les éléments importants

Avant de passer complètement aux finitions, contrôlez ce qui devient ensuite difficile d'accès.

Par exemple, vérifiez que les réseaux nécessaires ont été réalisés et que les points prévus sont bien positionnés.

Pour les équipements accessibles, prévoyez également un test à la fin.

Une checklist de réception peut vous aider à noter les réserves avant le dernier paiement.

## Prévoyez une marge pour les imprévus sans inventer un pourcentage universel

Il est raisonnable de prévoir une réserve pour un chantier, mais il n'existe pas un pourcentage unique valable pour tous les projets.

Une rénovation légère et une rénovation avec démolition, réseaux et reprises structurelles n'ont pas le même niveau d'incertitude.

Votre réserve dépend donc surtout de l'état du logement, du niveau de transformation et de ce qui reste à découvrir.

## Faites évoluer le projet par étapes

Lorsque le budget est limité, vous pouvez parfois séparer le projet.

Les travaux indispensables peuvent être réalisés avant les éléments purement esthétiques.

Par exemple, traiter une fuite ou un problème électrique peut être prioritaire avant le remplacement décoratif d'un revêtement.

Cette approche permet de prendre des décisions plus progressives.

## Gardez une trace du chantier

Conservez les devis, factures, échanges et modifications.

Prenez des photos avant, pendant et après les travaux lorsque cela est utile.

Ce dossier peut vous aider à suivre le projet, à retrouver les références de matériaux et à comprendre les choix réalisés plusieurs mois plus tard.

## Une rénovation réussie commence avant le premier jour de chantier

La préparation ne garantit pas qu'un projet se déroulera parfaitement. Elle permet simplement de réduire les zones floues.

Plus votre demande est claire, plus les devis sont comparables et plus les étapes sont définies, plus il est facile de repérer un problème avant qu'il ne devienne coûteux.

Snay3i.ma met à disposition des guides et des outils gratuits pour préparer vos travaux avant de contacter un professionnel.
`
  },
  {
    slug: 'brief-clair-artisan-maroc',
    lang: 'fr',
    title: 'Préparer un brief clair pour un artisan avant un devis',
    description: 'Préparez un message utile pour un artisan : informations, photos, dimensions, contraintes et questions à inclure avant de demander un devis.',
    hero: U('photo-1484154218962-a197022b5858'),
    detail: U('photo-1538688525198-9b88f6f53126'),
    heroAlt: 'Artisan prenant des mesures sur un projet',
    detailAlt: 'Outils prêts pour préparer une intervention',
    support2: U('photo-1524758631624-e2822e304c36'),
    support2Alt: 'Outils et matériel disposés pour préparer une intervention',
    content: `
## Pourquoi préparer un brief ?

Un professionnel peut difficilement chiffrer correctement un travail qu'il ne comprend pas.

Un brief n'a pas besoin d'être long. Il doit surtout contenir les informations qui changent la nature du projet.

L'objectif est de réduire les allers-retours et d'aider l'artisan à comprendre votre demande avant l'appel ou la visite.

## Commencez par quatre informations

Dans votre premier message, indiquez au minimum :

1. le métier recherché ;
2. la ville ou le quartier ;
3. le travail souhaité ;
4. quand vous aimeriez intervenir.

Ajoutez ensuite les informations spécifiques au projet.

Pour une peinture, précisez les pièces et la surface approximative.

Pour une plomberie, décrivez le symptôme et son emplacement.

Pour une menuiserie, indiquez les dimensions disponibles et l'usage du meuble.

## Décrivez le problème avant de proposer la solution

C'est un réflexe particulièrement utile.

Au lieu d'écrire « je veux changer toute la plomberie », décrivez d'abord ce que vous observez.

Par exemple :

« Il y a une fuite sous l'évier depuis deux jours. Elle apparaît uniquement lorsque le robinet fonctionne. »

Le professionnel pourra ensuite dire quelle intervention ou quelle visite est nécessaire.

Cela évite de partir trop vite sur une solution qui pourrait ne pas correspondre au problème réel.

## Ajoutez des photos utiles

Lorsque c'est pertinent et sûr, envoyez des photos.

Privilégiez :

- une photo générale pour montrer le contexte ;
- une photo rapprochée du problème ;
- une photo de l'accès ou des dimensions utiles.

Évitez d'envoyer uniquement une photo très rapprochée qui ne permet pas de comprendre où se trouve l'élément.

Pour les dimensions, indiquez comment elles ont été mesurées et précisez lorsqu'elles sont approximatives.

## Expliquez les contraintes

Les contraintes peuvent changer le travail.

Par exemple :

- logement occupé ;
- accès difficile ;
- étage élevé ;
- horaires disponibles ;
- présence d'enfants ou d'animaux ;
- matériau déjà acheté ;
- finition souhaitée ;
- délai important.

Le but n'est pas de raconter tout le projet. Il s'agit de signaler les éléments qui peuvent affecter l'intervention.

## Dites ce que vous attendez du devis

Vous pouvez demander un devis en précisant les éléments que vous souhaitez voir.

Par exemple :

« Merci d'indiquer séparément la main-d'œuvre, les matériaux et les éventuels travaux non compris. »

Cette formulation facilite ensuite la comparaison avec une autre proposition.

## Préparez les mêmes informations pour plusieurs artisans

Lorsque vous demandez plusieurs devis, envoyez autant que possible le même brief.

Vous aurez ainsi des réponses plus faciles à comparer.

Vous pouvez ensuite compléter les informations lors d'une visite sur place.

## Exemple de brief simple

> Bonjour, je cherche un carreleur à Casablanca.  
> Il s'agit d'une salle de bains d'environ 8 m².  
> Le sol doit être remplacé et deux murs doivent être carrelés.  
> Le logement est occupé et l'accès est disponible le matin.  
> Je souhaite connaître le coût de la main-d'œuvre, les matériaux compris et le délai estimé.  
> Je peux envoyer des photos et les dimensions.

Ce message n'est pas parfait pour tous les projets, mais il donne déjà au professionnel plusieurs informations utiles.

## Utilisez le brief comme checklist, pas comme diagnostic

Un message bien préparé ne remplace pas une visite ou un avis technique lorsque le projet le nécessite.

Un artisan peut avoir besoin de voir le chantier pour confirmer les dimensions, l'état des supports, l'accès ou les travaux cachés.

Le brief sert simplement à démarrer la conversation avec des informations structurées.

## Un bon brief peut faire gagner du temps aux deux parties

Le principal avantage n'est pas de recevoir un chiffre immédiatement.

C'est d'arriver plus rapidement à une conversation précise.

Le professionnel sait ce que vous demandez. Vous savez quelles informations comparer. Et lorsque le projet nécessite une visite, vous arrivez à cette étape avec une base commune.

Snay3i.ma propose un outil gratuit de brief artisan pour vous aider à structurer votre demande avant de contacter un professionnel.

## Une demande précise ne veut pas dire une demande compliquée

Un bon brief peut rester court.

Ce qui compte, c'est que l'artisan sache rapidement :

- ce qui doit être réalisé ;
- où se trouve le chantier ;
- quelles sont les contraintes principales ;
- quelles informations vous pouvez fournir immédiatement ;
- et quelle réponse vous attendez.

Vous pouvez aussi préciser ce que vous ne savez pas encore. Écrire « je ne sais pas si la fuite vient du raccord ou du mur » est plus utile que de choisir vous-même une réparation qui n'a peut-être pas de sens.

## Quand une visite sur place est nécessaire

Certaines interventions peuvent être préparées par message, mais une estimation sérieuse nécessite parfois une visite.

C'est notamment le cas lorsque le professionnel doit vérifier les dimensions, l'état d'un support, l'accès au chantier ou un élément qui n'est pas visible sur les photos.

Dans ce cas, ne demandez pas forcément un prix définitif avant la visite. Demandez plutôt ce que le professionnel doit vérifier et quels éléments pourront ensuite apparaître dans le devis.

## Gardez une version de votre brief

Lorsque vous envoyez la même demande à plusieurs professionnels, gardez une copie du message.

Vous pourrez ensuite comparer les réponses sur les mêmes informations.

Si votre projet change, mettez à jour votre brief et indiquez clairement ce qui a changé. Cela évite qu'un professionnel travaille sur une ancienne version de votre demande.

`
  },
  {
    slug: 'comparer-devis-travaux-maroc-darija',
    lang: 'ary',
    title: 'كيفاش تقارن بين جوج ديفيات ديال الأشغال فالمغرب؟',
    description: 'طريقة عملية بالدارجة باش تقارن بين جوج ولا أكثر ديال الديفيات وتشوف شنو داخل فالثمن وشنو خاصك توضح قبل ما تبدا الخدمة.',
    hero: D('Jl5BfxX089Q'),
    detail: D('TFhl8b-rRPg'),
    heroAlt: 'كوزينة مودرن فيها خدمة وتجهيزات واضحة',
    detailAlt: 'فضاء مغربي مرتب كيجمع بين التشطيب والاستعمال اليومي',
    support2: D('eTmXAuuCsL8'),
    support2Alt: 'مثال ديال فضاء مرتب قبل ما تبدا الأشغال',
    content: `
## قبل ما تقارن الثمن، قارن الخدمة

إلى عندك جوج ديفيات، أول حاجة ماشي هي تشوف شكون الأرخص.

سول راسك: واش الجوج كيهدرو على نفس الخدمة؟

مثلاً فالصباغة، واش الجوج داخل فيهم تحضير الحيطان، الصباغة وعدد الطبقات والتنقية من بعد؟

وفالكارلاج، واش الجوج داخل فيهم التهييء ديال السطح، الكول، الجوان، والخدمة ديال التركيب؟

إلى ما كانوش نفس الأشغال، المقارنة بالثمن بوحدو ما غاديش تكون عادلة.

## شوف شنو داخل فالديفي

كل ديفي خاصك تقراه بحال لائحة ديال الخدمة.

قلب على:

- اليد العاملة؛
- المواد؛
- التحضير؛
- النقل أو التنقل إلا كان محسوب؛
- التنقية أو جمع النفايات؛
- أي أشغال إضافية.

إلى شي حاجة ما واضحةش، سول عليها قبل ما توافق.

## المواد كتبدل الثمن

واحد الديفي يقدر يكون غالي حيث داخل فيه مواد أكثر أو مواد بمواصفات مختلفة.

ماشي ضروري تختار أغلى مادة، ولكن خاصك تعرف شنو غادي يتستعمل.

إلى كان المشروع فيه صباغة، سول على النوع والروندومو اللي كيعطيه المصنع، وعدد الطبقات إلا كان مهم.

إلى كان فيه زليج، سول على المقاس، الكمية وطريقة التركيب.

## قارن الكميات

شوف واش القياسات والكميات متقاربة.

مثلاً، إلا واحد حسب 20 متر مربع والثاني 35 متر مربع، خاصك تفهم علاش كاين هاد الفرق.

يمكن يكون واحد حسب غير الأرضية والثاني حسب الأرضية والحيطان.

يمكن حتى يكون الحساب مختلف من الأساس.

المهم هو تفهم الحساب قبل ما تختار.

## قرا مزيان خانة «ماشي داخل فالثمن»

بعض المرات الديفي الرخيص كيبان زوين حيث شي خدمات ولا مواد باقيين على حسابك.

قلب على الكلمات اللي بحال:

«غير شامل»

«على حساب الزبون»

«المواد من عند الزبون»

ولا أي ملاحظة كتخرج شي حاجة من الثمن.

هاد التفاصيل تقدر تبدل الميزانية كاملة.

## سول على المدة

قارن حتى الوقت اللي محتاج المشروع.

سول:

«فاش تقدر تبدا؟»

و:

«شحال تقريباً غادي تاخذ الخدمة؟»

ماشي كل مشروع يمكن نعطيوه مدة دقيقة قبل ما يشوف الصنايعي البلاصة.

لهذا خذ المدة كتقدير، وسول شنو يقدر يبدلها.

## سول على طريقة الأداء

قبل ما تبدا، خاصك تكون فاهم كيفاش غادي يخلص المشروع.

سول على:

- التسبيق إلا كان؛
- شنو كيغطي؛
- الدفعات اللي من بعد؛
- ومتى كيتخلص الباقي.

إلى تبدلات الخدمة وسط المشروع وزاد الثمن، سول علاش وشحال الزيادة قبل ما تبدا الخدمة الإضافية إلا كان ممكن.

## دير جدول بسيط

تقدر تكتب المقارنة فجدول:

| النقطة | الديفي A | الديفي B |
|---|---|---|
| الأشغال داخلة | | |
| المواد | | |
| الكميات | | |
| المدة | | |
| الأداء | | |
| الحوايج ما داخلاش | | |
| الأسئلة الباقية | | |

هاد الطريقة كتعاونك تشوف الفرق بلا ما تعتمد غير على الذاكرة.

## واش نختار الأرخص؟

ماشي بالضرورة.

الديفي الأرخص يقدر يكون مناسب، وقدر يكون ناقص فيه شي عناصر.

والديفي الأغلى يقدر يكون فيه خدمة أحسن أو مواد أكثر، ولكن ما خاصكش تفترض هاد الشي حتى تفهم التفاصيل.

السؤال الصحيح هو:

**شنو غادي ناخد بالضبط مقابل هاد الثمن؟**

## قبل ما توافق

من الأحسن تكون عارف:

شنو غادي يتدار.

شنو ما غاديش يتدار.

شنو المواد اللي غادي تستعمل.

شحال غادي تخلص.

فاش غادي تبدا الخدمة.

وشنو غادي يوقع إلا تبدلات الأشغال.

إلى كانت هاد النقاط واضحة، غادي يكون عندك أساس مزيان باش تقارن.
## إلا تبدلات الخدمة وسط المشروع

إلى بان شي مشكل جديد، ما تفترضش أن الزيادة داخلة تلقائياً.

سول شنو تبدل، علاش تبدل، وشحال غادي يزيد فالثمن إلا كان كاين تغيير.

إلى كان ممكن، خلي الموافقة على الأشغال الإضافية واضحة قبل ما تبدا هاد الأشغال.

## آخر حاجة قبل ما تقول نعم

خلي عندك جواب واضح على هاد الأسئلة:

شنو غادي يتدار؟

شنو ما غاديش يتدار؟

شنو المواد اللي داخلة؟

شحال المدة التقريبية؟

كيفاش غادي يكون الأداء؟

وشنو غادي يوقع إلا تبدلات الأشغال؟

إلى بقاو شي حوايج غامضين، حسن تسول عليهم قبل البداية.

Snay3i.ma فيه حتى أداة مجانية باش تعاونك ترتب مقارنة الديفيات وتعرف شنو خاصك توضحو مع الصنايعي.

## إلا كان الفرق كبير بين جوج ديفيات

إلى لقيتي واحد الديفي بعيد بزاف على الآخر، ما تديرش الحكم مباشرة.

رجع للسطر ديال الأشغال، المواد والكميات. ممكن واحد حسب الخدمة كاملة والآخر حسب غير اليد العاملة. وممكن واحد شاف مشكل فالمكان واحتسب وقت أو مواد إضافية.

سول الصنايعي على سبب الفرق بطريقة مباشرة ومحترمة. مثلاً:

«شنو داخل فالديفي ديالك اللي ما داخلش فالثاني؟»

و:

«واش كاين شي مواد ولا خدمة خاصها تتزاد من بعد؟»

هاد الأسئلة كتخليك تفهم الفرق بدل ما تبدا مفاوضة على رقم مازال ما واضحش.

## وخا يكون الديفي واضح، خاص المعاينة فبعض المشاريع

كاينين أشغال ما يمكنش يتحدد الثمن ديالها مزيان غير بالصور.

إلى كان المشكل مخبي، ولا القياسات ناقصة، ولا الخدمة مرتبطة بالهيكل، العزل، الكهرباء أو الشبكات داخل الحيطان، ممكن الصنايعي يحتاج يشوف المكان قبل ما يعطيك ثمن نهائي.

الديفي اللي واضح من البداية أحسن من رقم سريع ومن بعد كيبدا يتبدل مع كل خطوة.

## آخر حاجة قبل ما تقول نعم

خلي عندك جواب واضح على هاد الأسئلة:

شنو غادي يتدار؟

شنو ما داخلش؟

شنو المواد؟

شحال المدة التقريبية؟

كيفاش غادي يكون الأداء؟

وشنو غادي يوقع إلا تبدلات الخدمة؟

إلى بقاو شي حوايج غامضين، حسن تسول عليهم قبل البداية.

`
  }
];

function esc(v='') {
  return String(v)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

function inlineMd(v) {
  return v
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
}

function markdownToHtml(markdown) {
  const lines = String(markdown).replace(/\r/g,'').split('\n');
  const out=[]; let p=[]; let list=null;
  const flush=()=>{ if(!p.length) return; out.push(`<p>${inlineMd(esc(p.join(' ').trim()))}</p>`); p=[]; };
  const close=()=>{ if(!list) return; out.push(`</${list}>`); list=null; };
  for (const raw of lines) {
    const line=raw.trim();
    if(!line){ flush(); close(); continue; }
    const h2=line.match(/^##\s+(.+)$/);
    if(h2){ flush(); close(); out.push(`<h2>${inlineMd(esc(h2[1]))}</h2>`); continue; }
    const ol=line.match(/^\d+\.\s+(.+)$/);
    if(ol){ flush(); if(list!=='ol'){ close(); out.push('<ol>'); list='ol'; } out.push(`<li>${inlineMd(esc(ol[1]))}</li>`); continue; }
    const ul=line.match(/^[-*]\s+(.+)$/);
    if(ul){ flush(); if(list!=='ul'){ close(); out.push('<ul>'); list='ul'; } out.push(`<li>${inlineMd(esc(ul[1]))}</li>`); continue; }
    const table=line.startsWith('|');
    if(table){ flush(); continue; }
    close(); p.push(line);
  }
  flush(); close(); return out.join('\n');
}

function photoFigure(src, alt, hero) {
  return `<figure data-snay3i-${hero?'article-cover':'support-photo'}="1" style="margin:${hero?'0 0 24px':'30px 0'};border-radius:20px;overflow:hidden;background:#0D1B2A;border:1px solid #E8E0D4">
  <img src="${src}" alt="${esc(alt)}" ${hero?'fetchpriority="high"':'loading="lazy"'} width="1600" height="900" style="display:block;width:100%;height:${hero?'300px':'auto'};max-height:${hero?'300':'420'}px;object-fit:cover">
  <figcaption style="padding:10px 14px;font-size:12px;color:#6f6a64;background:#fff">${esc(alt)}</figcaption>
  </figure>`;
}

function renderArticle(a) {
  const body=markdownToHtml(a.content);
  const sections=[...body.matchAll(/<h2\b/g)];
  let bodyA=body, bodyB='';
  if(sections.length>=3){
    const cut=sections[Math.floor(sections.length/2)]?.index;
    if(Number.isInteger(cut)){ bodyA=body.slice(0,cut); bodyB=body.slice(cut); }
  }
  const isDarija=a.lang==='ary';
  const langAttr=isDarija?'ary':'fr';
  const dirAttr=isDarija?' dir="rtl"':'';
  const date='2026-10-04';
  const dateLabel=isDarija?'4 أكتوبر 2026':'4 octobre 2026';
  const canonical=`https://snay3i.ma/blog/${a.slug}`;
  const author=isDarija?'فريق تحرير Snay3i.ma':'Rédaction Snay3i.ma';
  const methodLink=isDarija?'طريقة التحرير ديالنا':'Méthode éditoriale et à propos';
  const support=photoFigure(a.detail,a.detailAlt,false);
  const support2=photoFigure(a.support2,a.support2Alt,false);
  const hero=photoFigure(a.hero,a.heroAlt,true);
  const schema={
    '@context':'https://schema.org',
    '@type':'BlogPosting',
    headline:a.title,
    description:a.description,
    inLanguage:isDarija?'ary-MA':'fr-MA',
    mainEntityOfPage:{'@type':'WebPage','@id':canonical},
    datePublished:date,
    dateModified:date,
    author:{'@type':'Organization',name:'Snay3i.ma',url:'https://snay3i.ma/about'},
    publisher:{'@type':'Organization',name:'Snay3i.ma',url:'https://snay3i.ma/',logo:{'@type':'ImageObject',url:'https://snay3i.ma/logo.png'}},
    image:a.hero
  };
  return `<!doctype html>
<html lang="${langAttr}"${dirAttr}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(a.title)}</title>
<meta name="description" content="${esc(a.description)}">
<meta name="robots" content="index,follow">
<meta name="google-adsense-account" content="ca-pub-7772621804003550">
<link rel="canonical" href="${canonical}">
<meta property="og:title" content="${esc(a.title)}">
<meta property="og:description" content="${esc(a.description)}">
<meta property="og:image" content="${a.hero}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${a.hero}">
<script type="application/ld+json">${JSON.stringify(schema).replace(/</g,'\\u003c')}</script>
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7772621804003550" crossorigin="anonymous"></script>
<style>
body{margin:0;font-family:Inter,system-ui,-apple-system,sans-serif;background:#faf6ef;color:#17212b;line-height:1.75}
header,footer{background:#0d1b2a;color:#fff;padding:18px 22px}
nav{max-width:920px;margin:auto;display:flex;gap:18px;flex-wrap:wrap}
nav a,footer a{color:#fff;text-decoration:none}
main{max-width:900px;margin:auto;padding:36px 16px}
section{background:#fff;border:1px solid #e8e0d4;border-radius:18px;padding:26px;margin:0 0 16px}
h1{font-size:34px;line-height:1.2;margin:0 0 12px}
h2{font-size:22px;color:#0d1b2a;margin-top:30px}
.article p,.article li{font-size:17px}
.meta{color:#6f6a64;font-size:14px}
figure{margin-left:0;margin-right:0}
a{color:#b34f24}
@media(max-width:640px){main{padding:24px 14px}h1{font-size:28px}.article p,.article li{font-size:16px}section{padding:20px}}
</style>
</head>
<body>
<header><nav><a href="/">Snay3i.ma</a><a href="/blog">${isDarija?'الأدلة':'Guides'}</a><a href="/outils">${isDarija?'الأدوات':'Outils'}</a><a href="/about">${isDarija?'علينا':'À propos'}</a><a href="/contact">${isDarija?'اتصل بنا':'Contact'}</a></nav></header>
<main>
${hero}
<article class="article">
<section>
<p class="meta"><strong>${author}</strong> · ${isDarija?'نشر ف':'Publié le'} <time datetime="${date}" data-date-published="1">${dateLabel}</time> · ${isDarija?'آخر تحديث':'Mis à jour le'} <time datetime="${date}" data-date-modified="1">${dateLabel}</time> · <a href="/about">${methodLink}</a></p>
<h1>${esc(a.title)}</h1>
<p>${esc(a.description)}</p>
</section>
<section>
${bodyA}
${support}
${bodyB}
${support2}
</section>
<section data-snay3i-action-module="1"${isDarija?' lang="ary" dir="rtl"':''}>
<h2>${isDarija?'قبل ما تبدا: دير هاد التحقق':'Avant de commencer : vérifiez ces points'}</h2>
<p>${isDarija?'جمع المعلومات، وضّح الخدمة، وخلي الثمن والمدة والمواد والدفعات واضحين قبل البداية.':'Rassemblez les informations, clarifiez le périmètre, puis faites préciser le prix, le délai, les matériaux et les conditions de paiement avant le début des travaux.'}</p>
<ul>
<li>${isDarija?'شرح الخدمة بالتفصيل وبالصور إلا كان ممكن.':'Décrire le travail avec assez de détails et ajouter des photos utiles lorsque c’est possible.'}</li>
<li>${isDarija?'قارن نفس الحوايج مع أكثر من مهني إلا كان المشروع مهم.':'Comparer le même périmètre avec plusieurs professionnels lorsque le projet est important.'}</li>
<li>${isDarija?'طلب توضيح أي حاجة ما داخلاش فالثمن.':'Demander ce qui n’est pas compris dans le prix.'}</li>
<li>${isDarija?'خلي تغييرات الخدمة والثمن واضحة قبل الخدمة الإضافية.':'Faire confirmer les changements de travaux et de prix avant les travaux supplémentaires.'}</li>
</ul>
<p><a href="/outils/brief-artisan"><strong>${isDarija?'وجد brief ديال الصنايعي →':'Préparer un brief artisan →'}</strong></a> · <a href="/editorial-policy">${isDarija?'كيفاش كنراجعو المحتوى':'Comment nous préparons et corrigeons nos guides'}</a></p>
</section>
</article>
<section><h2>${isDarija?'على هاد الدليل':'À propos de ce guide'}</h2><p>${isDarija?'هاد الدليل معمول باش يعاونك تحضر الطلب ديالك وتقارن المعلومات. المعلومات ديال أي مهني خاصها تتأكد مباشرة معاه، وما كتعوضش التشخيص المهني فالميدان.':'Ce guide est conçu pour aider les particuliers à préparer leur demande et comparer les informations utiles. Les informations d’un professionnel doivent être confirmées directement avec lui et ne remplacent pas un diagnostic réalisé sur place lorsque le projet le nécessite.'}</p><p><a href="/blog">${isDarija?'شوف الأدلة كاملة':'Voir les autres guides'}</a> · <a href="/contact">${isDarija?'اتصل بنا':'Nous contacter'}</a></p></section>
</main>
<footer><div style="max-width:900px;margin:auto">© 2026 Snay3i.ma · <a href="/privacy">${isDarija?'الخصوصية':'Confidentialité'}</a> · <a href="/terms">CGU</a> · <a href="/contact">${isDarija?'اتصل بنا':'Contact'}</a></div></footer>
</body></html>`;
}

// Generate the exact same six articles for the React runtime so the client-side
// blog cannot expose the retired legacy corpus.
const safeRuntimeFile = path.join(root, 'src', 'adsense-safe-articles.js');
const runtimeArticles = ARTICLES.map(({slug, lang, title, description, hero, detail, support2, heroAlt, detailAlt, support2Alt, content}) => ({
  slug, lang, title, description, hero, detail, support2, heroAlt, detailAlt, support2Alt, content,
  category: lang === 'ary' ? 'Darija' : 'Guides pratiques',
  emoji: '🧰',
  date: lang === 'ary' ? '4 أكتوبر 2026' : '4 octobre 2026',
  readTime: 'Guide pratique',
  datePublished: '2026-10-04',
  dateModified: '2026-10-04'
}));
fs.writeFileSync(safeRuntimeFile, 'export const SAFE_ARTICLES = ' + JSON.stringify(runtimeArticles) + ';\n', 'utf8');

fs.mkdirSync(blogRoot,{recursive:true});
for(const a of ARTICLES){
  const dir=path.join(blogRoot,a.slug);
  fs.mkdirSync(dir,{recursive:true});
  fs.writeFileSync(path.join(dir,'index.html'),renderArticle(a),'utf8');
}
console.log(`[adsense-safe editorial] built ${ARTICLES.length} curated article pages with original practical guidance, transparent disclaimers and no unsupported market claims`);

const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const PAGE_ID = process.env.FB_PAGE_ID;
const ACCESS_TOKEN = process.env.FB_PAGE_TOKEN;

const imageRichPosts = [
  {
    message: "Besoin d\x27un Maâlem qualifié au Maroc.\n\nQue ce soit pour un plombier, électricien, carreleur ou peintre, retrouvez des artisans vérifiés à Casablanca, Rabat, Marrakech et partout au Maroc sur Snay3i.ma.\n\nContactez directement votre artisan sans intermédiaire.\nhttps://snay3i.ma",
    imageUrl: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=1200&q=80"
  },
  {
    message: "Vous rêvez d\x27un travail de zellige ou de carrelage impeccable.\n\nDécouvrez les meilleurs maçons et carreleurs qualifiés près de chez vous sur Snay3i.ma. Devis gratuit et contact direct avec les meilleurs artisans.\n\nhttps://snay3i.ma",
    imageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80"
  },
  {
    message: "Un problème d\x27électricité ou besoin d\x27une installation moderne.\n\nNe cherchez plus. Trouvez un artisan électricien rapide, fiable et vérifié en quelques clics sur Snay3i.ma\n\nhttps://snay3i.ma",
    imageUrl: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1200&q=80"
  }
];

async function postImageRichToFacebook() {
  if (!PAGE_ID || !ACCESS_TOKEN) {
    console.error("Error: FB_PAGE_ID or FB_PAGE_TOKEN is missing in your .env file.");
    process.exit(1);
  }

  const post = imageRichPosts[Math.floor(Math.random() * imageRichPosts.length)];
  console.log("Publishing image-rich post to Facebook Page...");

  try {
    const response = await fetch(`https://graph.facebook.com/v18.0/${PAGE_ID}/photos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: post.imageUrl,
        caption: post.message,
        access_token: ACCESS_TOKEN
      })
    });

    const data = await response.json();

    if (data.id || data.post_id) {
      console.log("Successfully published image-rich post to Facebook.");
      console.log(`Post ID: ${data.post_id || data.id}`);
    } else {
      console.error("Facebook API Error:", data.error ? data.error.message : data);
    }
  } catch (err) {
    console.error("Network error:", err.message);
  }
}

postImageRichToFacebook();

import 'dotenv/config';

export default {
  expo: {
    name: "Seguridad_Policial",
    slug: "Seguridad_Policial",
    version: "1.0.0",
    extra: {
      API_URL: process.env.API_URL || "http://34.16.26.53:3000"
    },
    // ⏬ todo lo demás igual que en tu app.json
  }
};

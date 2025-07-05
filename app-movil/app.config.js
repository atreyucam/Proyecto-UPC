import 'dotenv/config';

export default {
  expo: {
    name: "Seguridad_Policial",
    slug: "Seguridad_Policial",
    version: "1.0.0",
    extra: {
      API_URL: process.env.API_URL || "https://upc-test.duckdns.org/api",
      eas: {
        "projectId": "f197fca6-693c-43e4-b94a-10c8df1e92c2"
      }
    },
    android: {
      package: "com.upc.upcdigital",
      versionCode: 1
    }
    // ⏬ todo lo demás igual que en tu app.json
  }
};

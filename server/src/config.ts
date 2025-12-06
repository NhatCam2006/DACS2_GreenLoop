import "dotenv/config";

export const config = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 4000),
  databaseUrl: process.env.DATABASE_URL,
  apiKey: process.env.API_KEY,
};

if (!config.databaseUrl) {
  throw new Error("DATABASE_URL must be defined");
}

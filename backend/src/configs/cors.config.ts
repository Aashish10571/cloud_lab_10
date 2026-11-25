import "dotenv/config";
import cors, { CorsOptions } from "cors";

const allowedOrigins = [process.env.WEB_CLIENT_URL].filter(Boolean) as string[];

console.log("Allowed origins:", allowedOrigins);

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log("Blocked origin:", origin);

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },

  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};

export const corsMiddleware = cors(corsOptions);

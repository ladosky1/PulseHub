export const allowedOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    "https://pulsehub-app.netlify.app",
];

export const corsOptions = {
    origin: allowedOrigins,
    credentials: true,
};
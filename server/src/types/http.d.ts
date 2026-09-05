import "http";
import session from "express-session";

declare module "http" {
    interface IncomingMessage {
        session: session.Session & Partial<session.SessionData>;
    }
}
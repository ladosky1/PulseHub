import { UserDocument } from "../model/user.model.ts";

declare global {
    namespace Express {
        interface Request {
            user?: UserDocument;
        }
    }
}

export {};
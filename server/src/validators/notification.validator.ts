import {z} from "zod";
import { objectIdSchema } from "./friend.validator.js";

export const notificationParamSchema = z.object({
    notificationId: objectIdSchema,
});
import { api } from "../../../lib/api";
import type { VerifyEmailFormData } from "../schema/auth.schema";

export async function verifyEmail(data: VerifyEmailFormData){
    const response = await api.post("/auth/verify-email", data);

    return response.data;
};

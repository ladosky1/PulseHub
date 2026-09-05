import { api } from "../../../lib/api";

export async function resendVerification(email: string){
    const { data } = await api.post(
        "/auth/resend-verification-code",
        {email}
    );

    return data;
}
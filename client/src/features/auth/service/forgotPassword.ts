import { api } from "../../../lib/api";
import type { forgotPasswordFormData } from "../schema/auth.schema";

export async function forgotPassword(
    data: forgotPasswordFormData
){
    const {data: response} = await api.post(
        "/auth/forgot-password",
        data
    );

    return response;
}
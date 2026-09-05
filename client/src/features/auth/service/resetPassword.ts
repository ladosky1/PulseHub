import { api } from "../../../lib/api";
import type { ResetPasswordFormData } from "../schema/auth.schema";

export async function resetPassword(
    data: ResetPasswordFormData
) {
    const { data: response } = await api.post(
        "/auth/reset-password",
        data
    );

    return response;
}
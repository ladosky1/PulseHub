import { api } from "../../../lib/api";

interface ChangePasswordPayload{
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
};

interface ChangePasswordResponse{
    message: string;
}

export async function changePassword(
    payload: ChangePasswordPayload
){
    const {data} = await api.post<ChangePasswordResponse>(
        "/auth/change-password",
        payload
    );

    return data;
}
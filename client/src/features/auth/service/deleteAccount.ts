import { api } from "../../../lib/api";

interface DeleteAccountResponse{
    message: string;
}

export async function deleteAccount(){
    const {data} = await api.delete<DeleteAccountResponse>(
        "/auth/account"
    );

    return data;
}
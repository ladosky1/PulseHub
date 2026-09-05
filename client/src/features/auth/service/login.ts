import { api } from "../../../lib/api";
import type { LoginFormData } from "../schema/auth.schema";

export async function login(data: LoginFormData){
    const response = await api.post("/auth/login", data);

    return response.data;
}
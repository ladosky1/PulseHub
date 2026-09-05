import { api } from "../../../lib/api";
import type { RegisterFormData } from "../schema/auth.schema";

export async function register(data: RegisterFormData){
    const response = await api.post("/auth/register", data);

    return response.data;
}
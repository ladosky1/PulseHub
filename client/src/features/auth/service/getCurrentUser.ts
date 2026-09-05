import { api } from "../../../lib/api";
import type { AuthResponse } from "../types/auth";

export async function getCurrentUser(){
    const response = await api.get<AuthResponse>("/auth/me");

    return response.data;
}


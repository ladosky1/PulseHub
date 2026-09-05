import { api } from "../../../lib/api";

export async function logout(){
    const {data} = await api.post("/auth/logout");

    return data;
}
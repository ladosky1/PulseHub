export function maskEmail(email: string){
    const [name, domain] = email.split("@");

    if(!name || !domain) return email;

    const visible = name.slice(0, 2);

    return `${visible}${"*".repeat(Math.max(name.length - 2, 3))}@${domain}`;
}
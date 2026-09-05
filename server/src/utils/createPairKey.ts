export function createPairKey(
    userA: string,
    userB: string
){
    return [userA, userB].sort().join(":");
};
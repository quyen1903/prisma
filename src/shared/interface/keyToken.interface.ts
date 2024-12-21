export interface KeyToken {
    accountId: string
    publicKey: string;
    refreshToken: string;
    roles: "SHOP" | "USER"
}
export interface KeyToken {
    publicKey: string;
    refreshTokensUsed?: string[];
    refreshToken: string;
}

export interface UserKeyToken extends KeyToken {
    userId: string
}

export interface ShopKeyToken extends KeyToken {
    shopId: string;
}


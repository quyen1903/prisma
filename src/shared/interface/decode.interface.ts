export interface Decode{
    email: string,
    iat: number,
    exp: number
}

export interface ShopDecode extends Decode {
    shopId: string,
}

export interface UserDecode extends Decode {
    userId: string,
}
import { KeyToken } from "../shared/interface/keyToken.interface";
import { createKeyToken, findByAccountId, dedleteKeyToken, findByRefreshToken } from "../repositories/keytoken.repository";
class KeyTokenService {

    static createKeyToken( {accountId, publicKey, refreshToken, roles}: KeyToken ) {
        return createKeyToken({accountId, publicKey, refreshToken, roles})
    }

    static findByAccountId(accountId: string) {
        return findByAccountId(accountId)
    }

    static async removeKeyByAccountID(accountId: string) {
        const keyToken = await findByAccountId(accountId);

        if (keyToken) {
            return dedleteKeyToken(keyToken.id)
        } else {
            throw new Error("KeyToken not found");
        }
    }

    static findByRefreshToken(refreshToken: string) {
        return findByRefreshToken(refreshToken)
    }
}

export default KeyTokenService
import Client from "ioredis";
import Redlock,{Lock} from "redlock";
import { reservationInventory } from'../repositories/inventory.repository';
const redisClient = new Client({
    password: process.env.REDIS_PASSWORD as string,
    host: process.env.REDIS_HOST as string,
    port: 16457
});

redisClient.on('error', (error: Error) => {
    console.error('Redis Client Error', error);
});

const redlock = new Redlock(
    [redisClient],
    {
        driftFactor: 0.01,
        retryCount: 10,
        retryDelay: 1000,
        retryJitter: 3000,
        automaticExtensionThreshold: 500
    }
)


/**
 * acquireLock algorithm, this will prevent race conditions
 * how it's work? we "acquire" access to shared resource by "lock" that resource
 * once a process taken "lock", other process must wait until "lock" being release 
 */
export const acquireLock = async (productId: string, quantity: number, cartId: string) => {
    const resource = `locks:product:${productId}`;
    const retryTime = 10;
    const expireTime = 5000; // Tăng expireTime nếu cần xử lý lâu hơn.
    
    for (let i = 0; i < retryTime; i++) {
        try {
            const lock = await redlock.acquire([resource], expireTime);
            console.log(`Acquired lock for resource: ${resource}`);
            
            try {
                const reservationResult = await reservationInventory({ productId, quantity, cartId });
                
                if (reservationResult && reservationResult.inventoryStock >= 0) {
                    console.log(`Inventory reserved successfully for productId: ${productId}`);
                    return lock;
                } else {
                    console.log(`Failed to reserve inventory for productId: ${productId}`);
                }
            } catch (error) {
                console.error(`Error during inventory reservation for productId: ${productId}`, error);
                throw error; 
            } finally {
                await lock.release();
                console.log(`Lock released for resource: ${resource}`);
            }
        } catch (error) {
            console.log(`Failed to acquire lock for resource: ${resource}. Retrying...`, error);
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    }
    throw new Error('Failed to acquire lock after multiple attempts');
};


export async function releaseLock(lock: Lock) {
    try {
        await redlock.release(lock);
        console.log(`Lock released`);
    } catch (error) {
        console.error('Failed to release lock', error);
    }
}

export default redisClient
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
    for (let i = 0; i < 10; i++) {
        try {
            const lock = await redlock.acquire([resource], 1000);
            console.log(`Acquired lock:`, lock);
            try {
                const isReservation = await reservationInventory({ productId, quantity, cartId });
                if (isReservation.modifiedCount) {
                    await lock.release();
                    console.log(`Lock released for product ${productId}`);
                }
                return null;
            } catch (error) {
                await lock.release();
                console.error('Error during reservation:', error);
            }
        } catch (error) {
            console.log(`Failed to acquire lock, retrying...`, error);
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    }
    throw new Error('Failed to acquire lock after multiple attempts');
}

export async function releaseLock(lock: Lock) {
    try {
        await redlock.release(lock);
        console.log(`Lock released`);
    } catch (error) {
        console.error('Failed to release lock', error);
    }
}

export default redisClient
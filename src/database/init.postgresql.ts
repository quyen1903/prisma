import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

console.log(process.env.DEV_DB_HOST,)
class Database {
    private static instance: Database;

    public prisma: PrismaClient; // Make prisma accessible
    public pg: Pool;

    private constructor() {
        this.prisma = new PrismaClient({
            log: ['query', 'info', 'warn', 'error'], // Enable logging
        });
        this.pg =  new Pool({
            user: process.env.DEV_DB_HOST,
            host: 'localhost',
            database: process.env.DEV_DB_DATABASE,
            password: process.env.DEV_DB_PASSWORD,
            port: 5432,
        });
    }

    // Singleton getInstance method
    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}

// Usage of the singleton instance
export const prisma = Database.getInstance().prisma;
export const pg = Database.getInstance().pg

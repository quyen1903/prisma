interface Config{
    app:{port: number},
    db:{
        username:string,
        password:number,
        database:string
    }
}

const dev: Config = {
    app:{
        port: Number(process.env.DEV_APP_PORT) || 3052
    },
    db:{
        username: (process.env.DEV_DB_HOST) || 'postgres',
        password: Number(process.env.DEV_DB_PASSWORD) || 27017,
        database: (process.env.DEV_DB_DATABASE) || 'ecommerce'
    }
}
const pro: Config = {
    app:{
        port: Number(process.env.PRO_APP_PORT) || 3000
    },
    db:{    
        username: (process.env.PRO_DB_HOST) ||'postgres',
        password: Number(process.env.PRO_DB_PASSWORD) || 27017,
        database: (process.env.PRO_DB_DATABASE) || 'ecommerce'
    }
}

const config = { dev,pro };
type Enviroment = 'dev' | 'pro';
const env: Enviroment = (process.env.NODE_ENV as Enviroment) || 'dev';
export default config[env]
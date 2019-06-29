const pg = require('pg')
const dotenv = require('dotenv')
dotenv.config()

const client = new pg.Client({
    database: process.env.TOKEN_DATABASE,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    ssl: true,
})

async function empty(){
    console.log('connecting to database')
    await client.connect()

    console.log('deleting token & transfer entries')
    try{
        await Promise.all([
            client.query("DELETE FROM tokens"),
            client.query("DELETE FROM token_transfers"),
        ])
    }catch(err){
        console.error(err)
        await client.end()
    }

    console.log('finished emptying DB')
    await client.end()
}

empty()
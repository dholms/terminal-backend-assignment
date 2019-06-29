const pg = require('pg')
const format = require('pg-format')
const dotenv = require('dotenv')
dotenv.config()

const batchInsert = async (table, columns, records, pageSize) => {
    const client = new pg.Client({
        database: process.env.TOKEN_DATABASE,
        host: process.env.POSTGRES_HOST,
        port: process.env.POSTGRES_PORT,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        ssl: true,
    })

    await client.connect()
    const colStr = columns.join(",")
    const queryStr = `INSERT INTO ${table} (${colStr}) VALUES %L ON CONFLICT DO NOTHING`

    pageSize = pageSize || records.length
    let queryPromises = []
    for(let i=0; i<records.length; i+=pageSize){
        const toAdd = records.slice(i, i+pageSize)
        const query = format(queryStr, toAdd)
        queryPromises.push(client.query(query))
    }
    try{
        await Promise.all(queryPromises)
    }catch(err){
        console.error(err)
        await client.end()
    }
    await client.end()
}

module.exports = batchInsert
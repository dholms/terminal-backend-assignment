const batchInsert = require('./batchInsert')
const readCSV = require('./readCSV')

const TABLE = 'tokens'
const COLUMNS = ['address', 'symbol', 'name', 'decimals', 'total_supply']
const PAGE_SIZE = 1000

const modifyRecord = (record) => {
    if(!record.decimals || record.decimals.length === 0){
        record.decimals = '0'
    }
    if(!record.total_supply || record.total_supply.length === 0){
        record.total_supply = '0'
    }
    let transfer = []
    for(let i=0; i< COLUMNS.length; i++){
        const col = COLUMNS[i]
        transfer.push(record[col])
    }
    return transfer
}

async function ingest(filepath) {
    console.log('Parsing tokens csv at ', filepath)
    const tokens = await readCSV(filepath, modifyRecord)
    console.log(`Finished reading csv with ${tokens.length} records`)

    const start = Date.now()
    await batchInsert(TABLE, COLUMNS, tokens, PAGE_SIZE)
    const time = (Date.now() - start)/1000
    console.log(`Finished inserting ${tokens.length} records in ${time}s`)
}

// if script run directly
if(process.argv[1].indexOf('ingestTokens') > -1){
    const path = process.argv[2]
    ingest(path)
}

module.exports = ingest
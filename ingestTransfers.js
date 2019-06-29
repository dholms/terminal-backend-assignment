const uuid = require('uuid/v4')
const batchInsert = require('./batchInsert')
const readCSV = require('./readCSV')

const TABLE = 'token_transfers'
const COLUMNS = ['token_address','from_address','to_address','value','transaction_hash','log_index','block_timestamp','block_number','block_hash', 'uuid']
const PAGE_SIZE = 1000

const modifyRecord = (record) => {
    record.uuid = uuid()
    let transfer = []
    for(let i=0; i< COLUMNS.length; i++){
        const col = COLUMNS[i]
        transfer.push(record[col])
    }
    return transfer
}

async function ingest(filepath){
    console.log('Parsing transfers csv at ', filepath)
    const transfers = await readCSV(filepath, modifyRecord)
    console.log(`Finished reading csv with ${transfers.length} records`)

    const start = Date.now()
    await batchInsert(TABLE, COLUMNS, transfers, PAGE_SIZE)
    const time = (Date.now() - start)/1000
    console.log(`Finished inserting ${transfers.length} records in ${time}s`)
}

// if script run directly
if(process.argv[1].indexOf('ingestTransfers') > -1){
    const path = process.argv[2]
    ingest(path)
}

module.exports = ingest
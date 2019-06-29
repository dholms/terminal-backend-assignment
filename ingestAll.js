const path = require('path')
const ingestTokens = require('./ingestTokens')
const ingestTransfers = require('./ingestTransfers')

const DATA_PATH = './data'
const TOKENS_START = 0
const TOKENS_END = 1
const TRANSFERS_START = 0
const TRANSFERS_END = 1


const tokenFileName=(number) => {
    const numStr = number.toString().padStart(12, '0')
    const name = `assignment-data_tokens_tokens${numStr}.csv`
    return path.join(DATA_PATH, name)
}
const transferFileName=(number) => {
    const numStr = number.toString().padStart(12, '0')
    const name = `assignment-data_token-transfers_token-transfer${numStr}.csv`
    return path.join(DATA_PATH, name)
}

async function ingestAll(){
    if(TOKENS_START > -1){
        for(let i=TOKENS_START; i<TOKENS_END; i++){
            console.log(tokenFileName(i))
            await ingestTokens(tokenFileName(i))
        }
    }

    if(TRANSFERS_START > -1){
        for(let i=TRANSFERS_START; i<TRANSFERS_END; i++){
            await ingestTransfers(transferFileName(i))
        }
    }
}

ingestAll()



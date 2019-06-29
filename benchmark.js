const { request } = require('graphql-request')
const COUNT = 10

const mostRecentTransfersQuery = `{
    token_transfers(limit: 50, order_by: {block_timestamp: desc}) {
        token {
            name
            symbol
        }
        block_timestamp
        value
    }
}`
const tokenTransferInfo = `{
    tokens(where: {symbol: {_eq: "RALLY"}}) {
        transfers {
            from_address
            to_address
            value
        }
    }
}`

async function test(){
    let start = Date.now()
    for(let i=0; i<COUNT; i++){
        await request('http://localhost:8080/v1/graphql', mostRecentTransfersQuery)
    }
    let time = (Date.now() - start)/1000
    console.log(`Most Recent Transfers query: ${COUNT} requests in ${time}s`)

    start = Date.now()
    for(let i=0; i<COUNT; i++){
        await request('http://localhost:8080/v1/graphql', tokenTransferInfo)
    }
    time = (Date.now() - start)/1000
    console.log(`Token Transfer Info query: ${COUNT} requests in ${time}s`)
}

test()
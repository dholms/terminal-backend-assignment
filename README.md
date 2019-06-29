# Terminal Backend Assignment

Data ingestion scripts and docker container for Terminal GraphQL + Postgres backend.

### Instructions
- install dependencies with `yarn`
- add a `.env` file to the root of the repo with env variables structured as such (depending on your local postgres setup):
```
TOKEN_DATABASE=token-info
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
```
- run local hasura server with `./docker-run.sh` 

Included are 5 scripts:
- ingestTokens
  - run with `node ingestTokens.js /path/to/tokens.csv`
- ingestTransfers
  - run with `node ingestTransfers.js /path/to/token-transfers.csv`
- ingestAll
  - run with `node ingestAll.js`
  - adjust constants in `ingestAll.js` to suit needs
- emptyDB
  - run with `node emptyDB.js`
  - utility function to clear both `tokens` and `token-transfers` tables
- benchmark
  - run with `node benchmark.js`

### Sample Queries
A query to return the 50 most recent token transfers, with the token symbol & name as well as the time and the amount transferred:
```
query {
  token_transfers(limit: 50, order_by: {block_timestamp: desc}) {
    token {
      name
      symbol
    }
    block_timestamp
    value
  }
}
```
*Benchmark: 10 requests in 6.844s (local server)*

A query to return the sender, recipient and amount sent on every transfer of the `RALLY` token (note: token names/symbols are not unique. If you wnat a particular token, you'll have to specify the address)
```
query {
  tokens(where: {symbol: {_eq: "RALLY"}}) {
    transfers {
      from_address
      to_address
      value
    }
  }
}
```
*Benchmark: 10 requests in 1.221s (local server)*

### Design Choices
I used Hasura for the GraphQL server because of its lightweight footprint. Unlike alternatives like Prisma, Hasura is a compiler that sits infront of a Postgres database. It compiles GraphQL queries into SQL queries. This makes Hasura very fast and capable of handling complex queries all while using very little memory and less CPU power. Hasura is also easy to scale both vertically and horizontally.

I used javascript/node.js to write the ingestion scripts because its ease of use and widespread adoption among web developers. 

A note about the scripts: we insert the records into the database in batches of 1000 to avoid the overhead of each commit. These inserts could be run sequentially if depending on resource constraints.

### Performance Metrics
- Local
  - Insert ~144,000 token records: 2.99s
  - Insert ~290,000 transfer records: 10.057s
  - Insert 5000 token records: 0.116s
  - Insert 5000 transfer records: 0.251s
- Heroku
  - Insert 5000 token records: 1.378s
  - Insert 5000 transfer records: 2.211s

### Deployment
I've deployed the a Postgres instance as well as a Hasura server on Heroku, which you can see [Here](https://terminal-backend-holmgren.herokuapp.com/console/)

The free tier allows only 10000 entires in the Postgres DB, so the queries will be by no means fully functional. However this deployment could be easily scaled up to accomodate more data.

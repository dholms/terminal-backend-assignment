const parse = require('csv-parse')
const fs = require('fs')

const readCSV = async (filepath, modifyRecord) => {
    return new Promise((resolve, reject)=>{
        const tokens = []
        const parser = parse({ columns: true })

        const fileStream = fs.createReadStream(filepath)
        fileStream.pipe(parser)

        parser.on('readable', ()=>{
            let token
            while (token = parser.read()) {
                if(modifyRecord){
                    token = modifyRecord(token)
                }
                tokens.push(token)
            }
        })
        parser.on('error', reject)
        parser.on('end', ()=>{
            resolve(tokens)
        })
    })
}

module.exports = readCSV
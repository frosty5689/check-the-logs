import readline from 'readline'
import fs from 'fs'

export const createReadLineInterface = (
  filename: string
): readline.Interface => {
  const stream = fs.createReadStream(filename)
  const rl = readline.createInterface({
    input: stream,
    crlfDelay: Infinity,
  })
  return rl
}

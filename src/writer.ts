import fs from 'fs'
import stream from 'stream'
import { finished } from 'stream/promises'

export const writeLinesToFile = async (
  filename: string,
  lines: string[]
): Promise<void> => {
  const readableStream = stream.Readable.from(lines)
  const writeStream = fs.createWriteStream(filename)
  readableStream.pipe(writeStream)
  await finished(readableStream)
}

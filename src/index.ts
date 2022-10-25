import { parseLog } from './parser'
import { writeLinesToFile } from './writer'

const start = async (): Promise<void> => {
  const args = process.argv.slice(2)
  const inputFilename = args?.[0] ?? 'input/data.log'
  const outputFilename = args?.[1] ?? 'output/test.csv'
  console.log(`Parsing log file: ${inputFilename}`)
  const logEntries = await parseLog(inputFilename)
  const lines = logEntries.map(
    ({ dateTime, eventId, eventType, source, fullName, email }) =>
      [
        dateTime.toFormat('yyyy-LL-dd HH:mm:ss'),
        eventId,
        eventType,
        source,
        fullName,
        email,
      ].join(',') + '\n'
  )

  console.log(`Writing to output CSV: ${outputFilename}`)
  await writeLinesToFile(outputFilename, lines)
  console.log('Done!')
}
start()
  .then(
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    (): void => {}
  )
  .catch((err) => {
    throw err
  })

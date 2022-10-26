import { parseLog, Severity } from './parser'
import { writeLinesToFile } from './writer'
import { logEntryToCsv } from './csv'
import { createReadLineInterface } from './reader'
import { DateTime } from 'luxon'

const start = async (): Promise<void> => {
  const args = process.argv.slice(2)

  if (args?.[0] === '--help') {
    console.log(`
    usage: <input> <output> <severity> <start-date> <end-date>
    example: input/data.log output/out.csv ERROR 2020-02-12T13:30 2020-03-01T17:00
    `)
    return
  }

  const inputFilename = args?.[0] ?? 'input/data.log'
  const outputFilename = args?.[1] ?? 'output/out.csv'
  let severity: Severity = Severity.Error
  let start: DateTime = DateTime.utc(2020, 2, 12, 13, 30)
  let end: DateTime = DateTime.utc(2020, 3, 1, 17, 0)

  if (args?.[2]) {
    switch (args[2]) {
      case Severity.Debug: {
        severity = Severity.Debug
        break
      }
      case Severity.Info: {
        severity = Severity.Info
        break
      }
      case Severity.Warning: {
        severity = Severity.Warning
        break
      }
      case Severity.Error:
      default: {
        severity = Severity.Error
        break
      }
    }
  }
  if (args?.[3]) {
    const inputStart = DateTime.fromISO(args[3], { zone: 'utc' })
    if (inputStart) {
      start = inputStart
    }
  }
  if (args?.[4]) {
    const inputEnd = DateTime.fromISO(args[4], { zone: 'utc' })
    if (inputEnd) {
      end = inputEnd
    }
  }

  console.log(`Parsing log file: ${inputFilename} for severity ${severity}`)
  console.log(`DateTime from: ${start.toString()} to ${end.toString()}`)
  const readlineInterface = createReadLineInterface(inputFilename)
  const logEntries = await parseLog(readlineInterface, severity, start, end)
  const lines = logEntries.map((logEntry) => logEntryToCsv(logEntry) + '\n')

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

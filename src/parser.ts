import fs from 'fs'
import readline from 'readline'

interface SeverityPart {
  severity: string
  rest: string[]
}

interface DateTimeEvent {
  dateTime: string
  eventId: string
  eventType: string
}

interface CausePart {
  cause: string
  rest: string[]
}

interface Contact {
  email: string
  fullName?: string
}

interface LogEntry {
  severity: string
  dateTime: string
  eventId: string
  eventType: string
  cause: string
  email: string
  fullName?: string
  source?: string
}

const enum Severity {
  Error = 'ERROR',
}

export const parseLog = async (filename: string): Promise<LogEntry[]> => {
  const stream = fs.createReadStream(filename)
  const rl = readline.createInterface({
    input: stream,
    crlfDelay: Infinity,
  })

  const logEntries: LogEntry[] = []

  let lastLineMatchSeverity = false
  for await (const line of rl) {
    const severityParts = parseSeverity(line)
    const { severity } = severityParts
    let { rest } = severityParts
    if (severity === Severity.Error) {
      lastLineMatchSeverity = true
      const [dateEventPart, causeContactPart] = rest
      const dateTimeEvent = parseDateTimeEvent(dateEventPart)
      const { dateTime, eventId, eventType } = dateTimeEvent
      const causeParts = parseCause(causeContactPart)
      const { cause } = causeParts
      rest = causeParts.rest
      const [contactPart] = rest
      const contact = parseContact(contactPart)
      const { email, fullName } = contact
      const logEntry: LogEntry = {
        severity,
        dateTime,
        eventId,
        eventType,
        cause,
        email,
        fullName,
      }
      logEntries.push(logEntry)
    } else if (lastLineMatchSeverity) {
      if (rest.length <= 1) {
        const lastLogEntry = logEntries[logEntries.length - 1]
        if (lastLogEntry) {
          lastLogEntry.source = line.trim()
        }
      }
      lastLineMatchSeverity = false
    }
  }

  return logEntries
}

const parseSeverity = (line: string): SeverityPart => {
  const parts = line.split(': ')
  const [severity, ...rest] = parts
  return { severity, rest }
}

const parseDateTimeEvent = (line: string): DateTimeEvent => {
  // eslint-disable-next-line no-useless-escape
  const parts = line.split(/[\[\]]+/)
  const [dateTime, eventId, eventTypeLine] = parts
  const [eventType, ..._] = eventTypeLine.trim().split(' ')
  return { dateTime: dateTime.trim(), eventId, eventType }
}

const parseCause = (line: string): CausePart => {
  const parts = line.split(' by ')
  const [cause, ...rest] = parts
  return { cause, rest }
}

const parseContact = (line: string): Contact => {
  const parts = line.split(' ')
  const email = parts[parts.length - 1]
  let fullName
  if (parts.length > 1) {
    parts.pop()
    fullName = parts.join(' ')
  }
  return { email, fullName }
}

import readline from 'readline'
import { DateTime } from 'luxon'

interface SeverityPart {
  severity: string
  rest: string[]
}

interface DateTimeEvent {
  dateTime: DateTime
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

export interface LogEntry {
  severity: string
  dateTime: DateTime
  eventId: string
  eventType: string
  cause: string
  email: string
  fullName?: string
  source?: string
}

export const enum Severity {
  Error = 'ERROR',
  Debug = 'DEBUG',
  Info = 'INFO',
  Warning = 'WARNING',
}

export const parseLog = async (
  readlineInterface: readline.Interface,
  severity = Severity.Error,
  start = DateTime.utc(2020, 2, 12, 13, 30),
  end = DateTime.utc(2020, 3, 1, 17, 0)
): Promise<LogEntry[]> => {
  const logEntries: LogEntry[] = []
  let previousLogEntry: LogEntry | undefined
  for await (const line of readlineInterface) {
    try {
      const logEntry = parseLine(line, severity, start, end, previousLogEntry)
      if (logEntry) {
        // If eventId matches previous log entry, then this is an updated entry that includes source
        if (previousLogEntry?.eventId === logEntry.eventId) {
          logEntries.pop()
          previousLogEntry = undefined
        } else {
          previousLogEntry = logEntry
        }

        logEntries.push(logEntry)
      }
    } catch (err) {
      console.warn(`Failed to parse line: ${line}, skipping...`, err)
    }
  }

  return logEntries
}

const parseLine = (
  line: string,
  severityFilter: Severity,
  start: DateTime,
  end: DateTime,
  previousLogEntry?: LogEntry
): LogEntry | undefined => {
  const severityParts = parseSeverity(line)
  const { severity } = severityParts
  let { rest } = severityParts
  if (severity === severityFilter) {
    const [dateEventPart, causeContactPart] = rest
    const dateTimeEvent = parseDateTimeEvent(dateEventPart)
    const { dateTime, eventId, eventType } = dateTimeEvent
    if (dateTime >= start && dateTime <= end) {
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
      return logEntry
    }
  } else if (previousLogEntry) {
    if (rest.length <= 1) {
      previousLogEntry.source = line.trim()
    }

    return previousLogEntry
  }
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
  return {
    dateTime: DateTime.fromFormat(
      dateTime.trim(),
      'LL/dd/yyyy hh:mm:ss a ZZZ'
    ).toUTC(),
    eventId,
    eventType,
  }
}

const parseCause = (line: string): CausePart => {
  const parts = line.split(' by ')
  const [cause, ...rest] = parts
  return { cause, rest }
}

const parseContact = (line: string): Contact => {
  const parts = line.split(' ')
  const email = parts[parts.length - 1]
  if (!email.includes('@')) {
    throw new Error(
      `Cannot process log entry as email: ${email} is not a valid email address.`
    )
  }
  let fullName
  if (parts.length > 1) {
    parts.pop()
    fullName = parts.join(' ')
  }
  return { email, fullName }
}

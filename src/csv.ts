import { LogEntry } from './parser'

export const formatValue = (value: string | undefined): string | undefined => {
  if (!value) {
    return
  }
  let escapedValue = value.replaceAll('"', '""')
  if (/,|\n/.test(escapedValue)) {
    escapedValue = `"${escapedValue}"`
  }
  return escapedValue
}

export const formatEventId = (eventId: string): string => {
  const formattedEventIdParts = []
  for (let i = 0; i < eventId.length; i += 3) {
    formattedEventIdParts.push(eventId.substring(i, i + 3))
  }
  const last = formattedEventIdParts[formattedEventIdParts.length - 1]
  if (last.length <= 1) {
    formattedEventIdParts.pop()
    formattedEventIdParts[formattedEventIdParts.length - 1] += last
  }
  return formattedEventIdParts.join('-')
}

export const logEntryToCsv = ({
  dateTime,
  eventId,
  eventType,
  source,
  fullName,
  email,
}: LogEntry): string => {
  return [
    formatValue(dateTime.toFormat('yyyy-LL-dd HH:mm:ss')),
    formatValue(formatEventId(eventId)),
    formatValue(eventType),
    formatValue(source),
    formatValue(fullName),
    formatValue(email),
  ].join(',')
}

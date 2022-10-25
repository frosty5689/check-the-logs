export const formatValue = (value: string): string => {
  let escapedValue = value.replace('"', '""')
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

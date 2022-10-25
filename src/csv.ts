export const formatValue = (value: string): string => {
  let escapedValue = value.replace('"', '""')
  if (/,|\n/.test(escapedValue)) {
    escapedValue = `"${escapedValue}"`
  }
  return escapedValue
}

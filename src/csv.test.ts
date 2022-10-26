import { DateTime } from 'luxon'
import { formatValue, formatEventId, logEntryToCsv } from './csv'
import { LogEntry } from './parser'

describe('formatValue', () => {
  test('value does not contain comma, newline or double quotes -> value is unchanged', () => {
    const inputValue = 'yay I am a normal value!'
    const outputValue = formatValue(inputValue)
    expect(outputValue).toEqual(inputValue)
  })

  test('value contains double quotes -> double quotes are escaped', () => {
    const inputValue = 'There is no "I" in "team"'
    const outputValue = formatValue(inputValue)
    expect(outputValue).toEqual('There is no ""I"" in ""team""')
  })

  test(`value contains ',' -> value is double quoted`, () => {
    const inputValue = '555 Norton St, San Diego, CA'
    const outputValue = formatValue(inputValue)
    expect(outputValue).toEqual(`"${inputValue}"`)
  })

  test(`value contains newline -> value is double quoted`, () => {
    const inputValue = 'Sam Fisher\nCommercial Crane Operator'
    const outputValue = formatValue(inputValue)
    expect(outputValue).toEqual(`"${inputValue}"`)
  })

  test(`value contains ',' and newline-> value is double quoted`, () => {
    const inputValue = '555 Norton St,\nSan Diego, CA'
    const outputValue = formatValue(inputValue)
    expect(outputValue).toEqual(`"${inputValue}"`)
  })
})

describe('formatEventId', () => {
  test('event id evenly splits into 3 character parts', () => {
    const inputEventId = '5b9de728b3ed'
    const outputEventId = formatEventId(inputEventId)
    expect(outputEventId).toEqual('5b9-de7-28b-3ed')
  })

  test('event id has 1 extra character when split into 3 character parts', () => {
    const inputEventId = '5b9de728b3edf'
    const outputEventId = formatEventId(inputEventId)
    expect(outputEventId).toEqual('5b9-de7-28b-3edf')
  })

  test('event id has 2 extra character when split into 3 character parts', () => {
    const inputEventId = '5b9de728b3edfg'
    const outputEventId = formatEventId(inputEventId)
    expect(outputEventId).toEqual('5b9-de7-28b-3ed-fg')
  })

  test('event id only has 3 characters', () => {
    const inputEventId = '5b9'
    const outputEventId = formatEventId(inputEventId)
    expect(outputEventId).toEqual('5b9')
  })

  test('event id only has 4 characters', () => {
    const inputEventId = '5b9d'
    const outputEventId = formatEventId(inputEventId)
    expect(outputEventId).toEqual('5b9d')
  })

  test('event id only has 5 characters', () => {
    const inputEventId = '5b9de'
    const outputEventId = formatEventId(inputEventId)
    expect(outputEventId).toEqual('5b9-de')
  })

  test('event id only has 6 characters', () => {
    const inputEventId = '5b9de7'
    const outputEventId = formatEventId(inputEventId)
    expect(outputEventId).toEqual('5b9-de7')
  })
})

describe('logEntryToCsv', () => {
  test('happy path', () => {
    const logEntry: LogEntry = {
      severity: 'ERROR',
      dateTime: DateTime.utc(2020, 1, 2, 3, 4, 5),
      eventId: '85be1dFDce1b1F5',
      eventType: 'explosion',
      cause: 'stomped',
      email: 'yeeet@gmail.com',
      fullName: 'Bob Builder',
      source: 'abc.js: 2134',
    }
    const csv = logEntryToCsv(logEntry)
    expect(csv).toEqual(
      `2020-01-02 03:04:05,85b-e1d-FDc-e1b-1F5,explosion,abc.js: 2134,Bob Builder,yeeet@gmail.com`
    )
  })
})

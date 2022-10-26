import stream from 'stream'
import readline from 'readline'
import { parseLog } from './parser'
import { DateTime } from 'luxon'

describe('parseLog', () => {
  const consoleWarnMock = jest.spyOn(console, 'warn').mockImplementation()

  beforeEach(() => {
    consoleWarnMock.mockReset()
  })

  test('happy path', async () => {
    const readableStream = stream.Readable.from([
      'ERROR: 02/14/2020 07:29:37 PM -0800 [04C3e67470e5d1] collapse occurred: jiggled by Ascdwd Uakvc uakvc@ljvkit.com\n',
      '    xaoydy: 61\n',
      'ERROR: 02/15/2020 06:14:55 AM -0800 [b8CfB0B1D6e20c] explosion occurred: jiggled by erjqvefnd@ehfyznfd.com\n',
      '  iegscq: 30\n',
      'DEBUG: 02/16/2020 02:37:13 AM +1200 [cBAF2eBd1775] collapse occurred: shook by Mutxwi Yjjtfsciz yjjtfsciz@jibxhugvm.com\n',
      ' uavgn: 17\n',
      'ERROR: 02/16/2020 03:45:03 PM +0900 [63fc15e3CeA2F1] collapse occurred: stomped by cqhlqyw@yhyzyx.com\n',
    ])
    const readlineInterface = readline.createInterface({
      input: readableStream,
    })
    const logs = await parseLog(readlineInterface)
    expect(logs).toEqual([
      expect.objectContaining({
        severity: 'ERROR',
        dateTime: DateTime.fromObject(
          { year: 2020, month: 2, day: 14, hour: 19, minute: 29, second: 37 },
          { zone: 'UTC-8' }
        )
          .setZone('UTC-8')
          .toUTC(),
        eventId: '04C3e67470e5d1',
        eventType: 'collapse',
        cause: 'jiggled',
        email: 'uakvc@ljvkit.com',
        fullName: 'Ascdwd Uakvc',
        source: 'xaoydy: 61',
      }),
      expect.objectContaining({
        severity: 'ERROR',
        dateTime: DateTime.fromObject(
          {
            year: 2020,
            month: 2,
            day: 15,
            hour: 6,
            minute: 14,
            second: 55,
          },
          { zone: 'UTC-8' }
        ).toUTC(),
        eventId: 'b8CfB0B1D6e20c',
        eventType: 'explosion',
        cause: 'jiggled',
        email: 'erjqvefnd@ehfyznfd.com',
        source: 'iegscq: 30',
      }),
      expect.objectContaining({
        severity: 'ERROR',
        dateTime: DateTime.fromObject(
          { year: 2020, month: 2, day: 16, hour: 15, minute: 45, second: 3 },
          { zone: 'UTC+9' }
        ).toUTC(),
        eventId: '63fc15e3CeA2F1',
        eventType: 'collapse',
        cause: 'stomped',
        email: 'cqhlqyw@yhyzyx.com',
      }),
    ])
  })

  test('missing severity, ignored', async () => {
    const readableStream = stream.Readable.from([
      '02/20/2020 07:29:37 PM -0800 [04C3e67470e5d1] collapse occurred: jiggled by Ascdwd Uakvc uakvc@ljvkit.com\n',
      '    xaoydy: 61\n',
    ])
    const readlineInterface = readline.createInterface({
      input: readableStream,
    })
    const logs = await parseLog(readlineInterface)
    expect(logs.length).toEqual(0)
  })

  test('dateTime outside default range, excluded', async () => {
    const readableStream = stream.Readable.from([
      'ERROR: 04/20/2020 07:29:37 PM -0800 [04C3e67470e5d1] collapse occurred: jiggled by Ascdwd Uakvc uakvc@ljvkit.com\n',
      '    xaoydy: 61\n',
    ])
    const readlineInterface = readline.createInterface({
      input: readableStream,
    })
    const logs = await parseLog(readlineInterface)
    expect(logs.length).toEqual(0)
  })

  test('missing date time log entry is ignored', async () => {
    const readableStream = stream.Readable.from([
      'ERROR: [04C3e67470e5d1] collapse occurred: jiggled by Ascdwd Uakvc uakvc@ljvkit.com\n',
      '    xaoydy: 61\n',
    ])
    const readlineInterface = readline.createInterface({
      input: readableStream,
    })
    const logs = await parseLog(readlineInterface)
    expect(logs.length).toEqual(0)
  })

  test('missing event Id console.warn is called', async () => {
    const readableStream = stream.Readable.from([
      'ERROR: 02/20/2020 07:29:37 PM -0800 [] collapse occurred: jiggled by Ascdwd Uakvc uakvc@ljvkit.com\n',
      '    xaoydy: 61\n',
    ])
    const readlineInterface = readline.createInterface({
      input: readableStream,
    })
    await parseLog(readlineInterface)
    expect(consoleWarnMock).toHaveBeenCalledTimes(1)
  })

  test('missing event type console.warn is called', async () => {
    const readableStream = stream.Readable.from([
      'ERROR: 02/20/2020 07:29:37 PM -0800 [04C3e67470e5d1] jiggled by Ascdwd Uakvc uakvc@ljvkit.com\n',
      '    xaoydy: 61\n',
    ])
    const readlineInterface = readline.createInterface({
      input: readableStream,
    })
    await parseLog(readlineInterface)
    expect(consoleWarnMock).toHaveBeenCalledTimes(1)
  })

  test('missing cause console.warn is called', async () => {
    const readableStream = stream.Readable.from([
      'ERROR: 02/20/2020 07:29:37 PM -0800 [04C3e67470e5d1] collapse occurred: Ascdwd Uakvc uakvc@ljvkit.com\n',
      '    xaoydy: 61\n',
    ])
    const readlineInterface = readline.createInterface({
      input: readableStream,
    })
    await parseLog(readlineInterface)
    expect(consoleWarnMock).toHaveBeenCalledTimes(1)
  })

  test('missing email console.warn is called', async () => {
    const readableStream = stream.Readable.from([
      'ERROR: 02/20/2020 07:29:37 PM -0800 [04C3e67470e5d1] collapse occurred: jiggled by Ascdwd Uakvc\n',
      '    xaoydy: 61\n',
    ])
    const readlineInterface = readline.createInterface({
      input: readableStream,
    })
    await parseLog(readlineInterface)
    expect(consoleWarnMock).toHaveBeenCalledTimes(1)
  })

  test('optional name is missing but still valid', async () => {
    const readableStream = stream.Readable.from([
      'ERROR: 02/20/2020 07:29:37 PM -0800 [04C3e67470e5d1] collapse occurred: jiggled by uakvc@ljvkit.com\n',
      '    xaoydy: 61\n',
    ])
    const readlineInterface = readline.createInterface({
      input: readableStream,
    })
    const logs = await parseLog(readlineInterface)
    expect(logs).toEqual([expect.objectContaining({ fullName: undefined })])
  })
})

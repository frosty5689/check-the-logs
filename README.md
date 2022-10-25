# Check the logs!

You have been assigned to log monitoring.

You are provided with the log file `data.log`. The log file contains some strange formatting. Your job is to write a program to read from it to create a report.

## Log format

Each line has the following fields in order:

  - Event severity level
  - Date and time of event
  - Event ID
  - Event type
  - Cause
  - Contact information for the person associated with the event. All contacts have an email, but only some are preceeded by a full name
  - Source of error: Sometimes, there is a second line for a log entry. The source line has a filename and a line number: e.g. `jsjq: 38`.

## Report format

You will create a report by selecting log entries from the file that:
  - have severity level of `ERROR`
  - occurred between 1:30pm February 12, 2020 UTC and 5:00pm March 1, 2020 UTC inclusive.

The report must be output as a CSV file with the following fields in order:

  - Date and time are in UTC, where date is
    <4 digit year>-<month as a zero padded number>-<day of month as zero padded number>
    and time is given in hours, minutes, seconds in the 24 hour clock format. Date and time
    are separated by a space.
    e.g. 2020-02-12 05:56:45

  - Formatted event id. In the log file, it's a string in square brackets.

    We just want the string between the brackets.
    e.g. `[5b9de728b3ed]`

    The id should be formatted so that the string is
    in groups of 3 characters separated by hyphens, with the exception of
    the last group where the group must have more than 1 character.

    Examples

      - 5b9de728b3ed ----> 5b9-de7-28b-3ed (correct)
      - 5b9de728b3edf ---> 5b9-de7-28b-3edf (correct)
      - 5b9de728b3edf ---> 5b9-de7-28b-3ed-f (incorrect)
      - 5b9de728b3edfg --> 5b9-de7-28b-3ed-fg (correct)

  - Event type. The thing that occurred. e.g. explosion, meltdown

  - Source of the error. Blank if there was no associated source.

  - Contact person's full name, if it exists, blank otherwise
      - A first name and last name will appear before the email if it exists

  - Contact person's email

Note: do not include a header row in the report

Example of output:

```
2020-02-24 14:17:05,FBX-8d7-e001,meltdown,vtuhra: 84,,hsmmdqlwk@lwyshb.com
2020-02-24 05:45:50,921-cFF-e58,explosion,pipkmz: 60,Menv Xdfffp,xdfffp@wyegzat.com
```

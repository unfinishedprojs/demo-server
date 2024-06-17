## 2.1.7

- Add admin endpoint to delete polls
- Send webhook to notify of new polls
- Reversed Active in GetAllEvents to Ended

## 2.1.6

- Replace getting profile pictures as jpgs to whatever Discord gives by default
- Change limit for poll creation to 1 user, and now only 20 polls can exist at a time
- When fetching a poll, return if a user has already voted on that poll or not

## 2.1.5

- Facilitate creating invites
- Change channel ID for invites to correct one

## 2.1.4

- Add webhook to notify admins of new users

## 2.1.3

- Add checks to send any admin info necessary in get iEvent

## 2.1.2

- Fix endpoint to grab user info

## 2.1.1

- Add logic to check if, when a user suggests another, an event is ongoing or the suggested user already got invited. If either of these are true, reject the suggestion

## 2.1.0

- Fix logic that allowed someone to vote twice (oops!)

## 2.0.9

- Fix really goofy error
- Changed `/api/v2/users` to `/api/v2/users/get`

## 2.0.8

- Change runtime of a vote to 24h
- Patch bug where votes went on for 1 minute only (??)

## 2.0.7

- Completed automatic deployment

## 2.0.6

- Add v2 documentation
- Prepare server for autodeployment

## 2.0.5

- New endpoint to check version

## 2.0.4

- Hopefully patch CEvents taking too many votes to create

## 2.0.3

- Correct spelling mistake that TS didnt catch

## 2.0.2

- Vaporize some console logging

## 2.0.1

- Added Admin authentication

## 2.0.0 (Breaking)

- Switch to password-based login
- Change authentication so that it is now a middleware
- Add necessary Discord user data on register
- End time is now an actual date, so that clients can easily display time till the end of an IEvent

## 1.1.1

- Fix multiple users not being able to vote for a user
- Better output

## 1.1.0 (b & c)

- Add all v1 endpoints to their appropriate place, to make way for v2 endpoints.
- Move documentation to readme.md, as people cant find it trolley
- (b) Fix issue with prisma
- (c) Fix issue with https

## 1.0.1

- Organized all files in v1 and v2
- Fix errors being weirdos

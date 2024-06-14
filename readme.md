# Demo-Server functionality

Democracy Server Voting Infra: backend

## Versioning rules

- First digit: Major update that changes most endpoints in a breaking way
- Second digit: New features that add to the endpoints in a non-breaking way
- Third digit: Bug patches

## TODO

- [ ] When CEvent is finished, check if IEvent already exists. If it does, check if it ended. If it ended and is positive, do not allow new CEvents for user. If it ended and is negative, allow new CEvents for user
- [x] Modify Response so that it doesn't leak backend info
- [x] version api - add v1
- [x] Make Token a header
- [x] Actually count all votes
- [ ] Get user info on CVote and Register
- [ ] Tie Invites so that you have to use a specific ID with that Invite (currently not implemented so that everyone can debug their program)

# API Documentation (v1)

All currently available endpoints for the API. All endpoint responses are going to change, except for the main info you will most likely need.
All requests start with `/api`

### Error Responses

If the status of a Response isnt in the 200 range, its an error.

```json
{
    "message": string
}
```

## Users (`/api/v1/users`)

### POST (`/api/v1/users/register`)

Create a new User. Keep the token secret, and dont lose it!

#### Request

- `invite` Invite given to the end user. Generated from Invite Events automatically (yes, I am aware you can grab invites from IEvent listings, but that will be fixed in an update)

- `discordId` The Discord ID of the end user. This is just used to authorize the user in the Discord server

#### Response

```json
{
    "discordId": string,
    "invite": string,
    "token": string,
    "iEventId": string
}
```

### POST (`/api/v1/users/verify`)

Verify if a token is a valid token, and gives you some information about the user attached to the token

#### Headers

- `Authorization` User token generated on register (There has to be ONLY the token in the header, nothing else!)

#### Response

```json
{
    "discordId": string,
    "token": string,
    "admin": boolean
}
```

NOTE: `admin` might not be defined at all

## Invite Events (`/api/v1/ievents`)

### GET (`/api/v1/ievents`)

Fetches all existing Invite Events

#### Headers

- `Authorization` User token generated on register (There has to be ONLY the token in the header, nothing else!)

#### Request

- `ended?` If the event has ended or is ongoing.
  - `true` shows Invite Events that have ended.
  - `false` shows Invite Events that are currently actively ongoing
  - leaving this blank shows all Invite Events, regardless if they have ended or not

#### Response

```json
[
    {
        "eventId": string,
        "discordId": string,
        "invite": string,
        "ended": boolean,
        "createdAt": Date,
        "duration": Int,
        "positiveVotesInt": Int,
        "negativeVotesInt": Int
    }
]
```

### POST (`/api/v1/ievents/suggest`)

Suggest a new user to create an Invite Event poll for. Once the server-side defined limit for suggestions is reached, a 24h long Invite Event will be created, which will be returned back in the reply.

#### Headers

- `Authorization` User token generated on register (There has to be ONLY the token in the header, nothing else!)

#### Request

- `discordId` Discord ID of User you want to suggest

#### Response

If the limit for users has not been reached just yet:

```json
{
    "discordId": string
}
```

If the limit has been reached and the Invite Event has been successfully created:

```json
{
    "eventId": string,
    "discordId": string,
    "invite": string,
    "ended": boolean,
    "createdAt": Date,
    "duration": Int,
    "positiveVotes": Int,
    "negativeVotes": Int
}
```

### POST (`/api/v1/ievents/vote/positive`) (`/api/v1/ievents/vote/negative`)

Vote in an Invite Event. There are two endpoints for positive and negative votes.

#### Headers

- `Authorization` User token generated on register (There has to be ONLY the token in the header, nothing else!)

#### Request

- `eventId` ID of Invite Event

#### Response

```json
{
    "id": number,
    "userToken": string,
    "iEventId": string,
    "createdAt": Date
}
```

# API Documentation (v2)

Will be written when there is enough of a difference from v1

# Updates

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
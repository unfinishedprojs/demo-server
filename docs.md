# API Documentation

All currently available endpoints for the API. All endpoint responses are going to change, except for the main info you will most likely need. 

### Error Responses

If the status of a Response isnt in the 200 range, its an error.

```json
{
    "message": string
}
```

## Users (`/users`)

### POST (`/register`)

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

### POST (`/verify`)

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

## Invite Events (`/api/ievents`)

### GET (`/`)

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
        "positiveVotes": Int,
        "negativeVotes": Int
    }
]
```

### POST (`/suggest`)

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

### POST (`/vote/positive`) (`/vote/negative`)

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
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

## API Documentation

Check `docs` folder for documentation of all versions

## Updates

Check `UPDATES.md` for the list of updates.

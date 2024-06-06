# Demo-Server functionality
Democracy Server Voting Infra: backend


## TODO
- [ ] When CEvent is finished, check if IEvent already exists. If it does, check if it ended. If it ended and is positive, do not allow new CEvents for user. If it ended and is negative, allow new CEvents for user
- [X] Modify Response so that it doesn't leak backend info
- [ ] version api - add v0 (experimental api for now, until main frontend is done)
    - [ ] when done, copy rename to v1 and drop v0 support (frontend get's updated too)
    - new fields can go on the same api version, but:
    - any other breaking changes will go on v2, v3 etc.
- [x] Make Token a header
- [x] Actually count all votes
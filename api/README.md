## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ yarn
```

### Authentication Configuration

- make a copy of `api/config/default.json` in `api/config/local.json`. Whatever config is in the local file will overwrite the default file.
- go to the link above, and create a project if you do not have one already
- Click on the 'OAuth consent screen' tab and follow the prompts. Select 'External' user type, leave the optional fields blank, and the other mandatory fields are self explanatory. The only notable optional configuration is the test users, to add if you would like OAuth to work with other google accounts in dev
- Click on the 'Credentials' tab, create a new OAuth client ID, select 'Web Application' application type, fill in the mandatory fields, and add `http://localhost:4000/google/redirect` as an Authorised redirect URI
- When created, copy-paste the Client ID and Client Secret into `api/config/local.json`

When your local server is running, visit `http://localhost:4000/google/redirect` in your browser to get an Authentication Bearer token (replacing this step is on the list of future improvements). Copy paste the Authentication token and use it to use the POST /postings endpoint. If you are using Postman to send the POST request, click on the Authorization tab on your request, choose Bearer Token from the Type dropdown, and paste your token into Postman.

## Running the app

Starts on port `4000`

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Test

End to end tests run with a temporary in-memory version of `MongoDB` using [jest-mongodb](https://github.com/shelfio/jest-mongodb) and sets the `global.__MONGO_URI__` parameter.

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e
```

# The Challenge

## Introduction

You’ve been asked to build a new service that allows a solicitor to create legal job postings, and allows a client to pay for a job that has been undertaken.

The challenge has been designed to get progressively more difficult in order to gauge decision making and how a candidate deals with changing requirements and complexity.

You may take as much time as you wish to complete the challenge if you wish to complete all tasks, but we recommend time-boxing your work to 3-4 hours.

This is to avoid taking too much of your time, and the amount of time spent on the challenge will be applied contextually. In a shorter timeframe, we do not expect all candidates to complete all tasks.

Once you've deemed the challenge ended, please write some notes on the approach you would take to complete the other stories, if you had further time to complete them.

Also make notes on the trade-offs or weaknesses of your implementation.

Commit the notes you've made in the README.md

After the challenge, we will schedule a follow-up call to talk through your experience, challenges faced, decisions made and your notes.

## How we assess the challenge

We're looking for how you think about building products and systems. What this means specifically will depend on your level of experience and will be taken contextually.

In practice, this includes:

- Architecture/tool/library decisions
- Code structure and cleanliness
- Domain modelling decisions and abstraction choices
- Use of best-practices and principles (validation, auth, security)
- Usage of git and development tools
- Your descriptions and thought processes in the follow-up conversation
- Showcasing your code opinions and creativity
- When to use reach for libraries to solve problems vs. when to write code

It does **not** include:

- 100% test coverage

## How to submit your answers

Please don't fork or submit pull-requests to this repository.

Submissions should be a public repository on GitHub, sent via email to the assessor.

Submissions should be received before the deadline specified in your instructions email.

Feel free to use the code you create in any way you fancy - you can show it to other potential employers as a demonstration of your abilities.

## Asking for help

Should you need help or any clarification, feel free to email us.

## Technical Requirements

- All application code should be TypeScript

- The completed project should have a backend API and a data persistance layer.

We've provided initial "hello world" implementations of an API for you to work with. Please use this to start with, and feel free to make any changes you see fit for your solutions.

```bash
# NestJS based API
/api

# Basic database setup
docker-compose.yml
```

### Backend

`/api`: A NodeJS API with [NestJS](https://docs.nestjs.com/)

Details:

- JSON should be the content type of all interactions

### Database

Scaffolded in `docker-compose.yml`: A MongoDB database

Embedded in `api`: [Mongoose](https://mongoosejs.com/docs/typescript.html)

Details:

- If desired, you can switch to a DB you are more familiar with, and if necessary any ORM

### Testing

This challenge only contains two places where tests are required (story 3/4).

Implemented in `api`: `yarn test:unit` or `yarn test:e2e`

Using [Jest](https://jestjs.io/docs/getting-started#using-typescript-via-ts-jest) + [ts-jest](https://kulshekhar.github.io/ts-jest/docs/getting-started/installation)

Details:

- Tests can be at any level you see fit (unit, integration, e2e)

# The Story

You’ve been asked to build a new service that allows a solicitor to create legal job postings, and allows a client to pay for a job that has been undertaken.

This requires delivering an API which satisfies the user stories outlined below.

Each user story is progressively more difficult and introduces complexities which may require changes to the design.

Ideally, the git history should identify the stories each commit relates to.

For this challenge, you don't need to worry about implementing proper authentication mechanisms, you can pick how to implement this according to what you want to present / the time you have available / the solutions you are familiar with.

## Story 1:

### Stories

As a solicitor, I need to create a legal job posting so that potential clients (unauthorised users) can see them.

As a client, I need to be able to see a list of legal job postings.

### Details

A legal job posting contains:

- A `title` (string)
- A `description` (long string)
- A `status` ('unpaid', 'paid')

When a solicitor creates a legal job, it is in a `unpaid` state.

Solicitors can use an endpoint to create a new job posting
Clients can use an endpoint to view a list of all job postings

## Story 2:

We receive new requirements that each job posting needs a new field to store a `fee structure` in the system.

There are two types of `fee structure`: `No-Win-No-Fee`, or `Fixed-Fee`.

- `No-Win-No-Fee` jobs require the parameter: `Fee Percentage`
- `Fixed-Fee` jobs require the parameter `Fee Amount`

### Stories

As a solicitor, I need to be able to specify the `fee structure` of a job posting when it is created.

As a client, I need to be able to view the `fee structure` of every job posting in the list.

### Details

Modify the form and the endpoints to represent this new functionality.

Consider how the data model needs to change to accommodate selecting the different fee structures and their associated parameters.
Consider how you might enforce the correctness of this field.

## Story 3:

We receive new requirements that a client using the application needs to show that they have paid for a legal job posting.

Note: "Paying for" legal work doesn’t need to actually trigger any financial transfer / APIs - it just stores in the system that a job has been paid, and the amount that was paid.

### Stories

As a client or solicitor, I need to be able to mark a payment as paid.

As a client or solicitor, I need to be able to see that a job has been paid.

As a client or solicitor, I need to be able to see how much was paid to the solicitor.

### Details

How a payment works depends on the type of job posting:

#### For Fixed-Fee jobs:

No inputs are required to complete the payment.

The `amount paid` upon payment is the `fee amount`.

#### For No-Win-No-Fee jobs:

An input is required to complete the payment: `Settlement Amount`

This `settlement amount` is used to work out how much should be paid to a solicitor using the `fee percentage` property of the no win no fee structure.

The `amount paid` upon payment is `settlement amount * fee percentage`

---

There should be tests covering how the `amount paid` is calculated.

Once a payment is completed, the job enters a state of `paid`.

Consider how the data model of a `Payment` might be constructed, and how status changes and histories could be tracked or derived.

## Story 4:

We get reports of clients putting in `settlement amounts` for `no-win-no-fee` jobs that are wildly lower than what is expected.

We want to introduce a way for solicitors to constrain what settlement amounts are valid when paying for a job.

We do this by constraining `settlement amounts` around an `expected settlement amount` that the solicitor inputs when creating a job posting.

### Stories

As a solicitor, I need to be able to enter an `expected settlement amount` for `no-win-no-fee` jobs.

As a client, I need to be shown an error if I enter a `settlement amount` which differs from the `expected settlement amount` by more than `10%`.

### Details

Change the payment command to include logic for: If the `Settlement Amount` entered is not within 10% of the `Expected Settlement Amount`, the payment should fail with an error.

There should be tests validating the calculation that if the `settlement amount` is outside of 10% of the `expected settlement amount`, the operation would fail.
Alternatively, it should test for valid `settlement amounts` within 10%.

Consider how you might build this logic in a way that allows for testability and changing requirements in future.

## Story 5:

Solicitors have grown tired of creating descriptions for their job postings, as they find that there are news articles online which describe their job perfectly, and so they shouldn't need to write it themselves.

Solicitors would like to submit the `URL` of a news article, and use that as the new basis of the job description.

### Stories

As a solicitor, I would like to submit a URL of a news article instead of typing a description in my job postings.

As a client, I would like to see a relevant summary of the news article in a job description.

### Details

Some examples sources of legal job postings are the following articles:

- [https://www.bbc.co.uk/news/world-59793040](https://www.bbc.co.uk/news/world-59793040)
- [https://www.bbc.co.uk/news/business-60667173](https://www.bbc.co.uk/news/business-60667173)

These news articles contain a description of a legal issue that is relevant to a job posting a solicitor wants to make.

For user experience and searchability reasons (a future requirement), the relevant content from the news articles should be persisted within the system, rather than linked to.

Change the job creation request to no longer require a `description`, and instead require a `URL`.

Display the contents of the news article alongside the job posting in the list.

---

# [x] Initial codebase setup (hello world)

# [x] Story 1

The API endpoints needed to achieve the brief requirements are:

- a POST endpoint to add a legal job posting: `POST /postings`
- a GET endpoint to get a list of legal job postings: `GET /postings`

If I were to work on a real project with a ticket like this, I would verify that the acceptance criteria I refined below were what was actually required by the business, by engaging with the product owner or equivalent.

## Dependency changes

- added `class-validator` and `class-transformer` for easy request validation and enforcement
- added `@nestjs/jwt`, `@nestjs/passport`, `passport`, `passport-google-oauth20`, and `passport-jwt` to support Google authentication
- added `config` and `@types/config` to manage configuration
- aded `@nestjs/mongoose` for the schema type anotations. I added the version corresponding to the existing nestjs modules, but since those were one major version old, i also had to downgrade `mongoose` one version from what this project came with to match the required version needed by `nestjs/mongoose`

## POST /postings

### Authentication

I used `passport.js` to authenticate the solicitor making the listings, using the Google Auth strategy. If you want to run this server yourself you need to set up a Google OAuth client ID at `https://console.cloud.google.com/apis/dashboard` , then acquire the `GOOGLE_CLIENT_ID` and a `GOOGLE_SECRET_ID` to populate in your local config.

Roughly, the steps to do this are:

- make a copy of `api/config/default.json` in `api/config/local.json`. Whatever config is in the local file will overwrite the default file.
- go to the link above, and create a project if you do not have one already
- Click on the `OAuth consent screen` tab and follow the prompts. Select `External` user type, leave the optional fields blank, and the other mandatory fields are self explanatory. The only notable optional configuration is the test users, to add if you would like OAuth to work with other google accounts in dev
- Click on the `Credentials` tab, create a new OAuth client ID, select `Web Application` application type, fill in the mandatory fields, and add `http://localhost:4000/google/redirect` as an Authorised redirect URI
- When created, copy-paste the Client ID and Client Secret into `api/config/local.json`

When your local server is running, visit `http://localhost:4000/google/redirect` in your browser to get an Authentication Bearer token (replacing this step is on the list of future improvements). Copy paste the Authentication token and use it to use the `POST /postings endpoint`. If you are using Postman to send the POST request, click on the Authorization tab on your request, choose Bearer Token from the Type dropdown, and paste your token into Postman.

### Assumptions:

- the solicitor posting can be uniquely identified by their email (in practice this isn't a great assumption since it means users cannot change their account's email without some extra email change handling code- but it is pretty common)
- the client who the job is for also can also be uniquely identified by their email
- the description field can be limited to under 4000 characters
- title can be limited to between 5 and 100 characters
- can't guarantee the title is unique
- idempotency is not required (see the Deliveroo incident in the notes below and why it should be required and why this is a future improvement)
- tests are not required for Story 1 of this assignment
- Swagger documentation or other documentation beyond these notes is not required
- these assumptions and acceptance criteria below have been verified/confirmed by the product owner

### Proposed schema for a legal job posting:

- `_id` (ObjectID) field
- `title` (string limited to between 5 and 100 characters)
- `description` (string below 4000 characters)
- `status` (string enum, 'unpaid' or 'paid')
- `created` (date)
- `posterEmail`(email string)
- `clientEmail` (email string)

### Acceptance criteria:

- should be able to send the `title`, `description`, and `clientEmail` fields as strings in the API request body
- all 3 fields are mandatory for a valid request and they have to fit the correct format
- when the API inserts a valid request into the database, all other fields should also be generated/populated: `status` should start as `unpaid`, `created` should be the current timestamp, `postedEmail` should be the email of the solicitor listing the posting (aquired from auth), and `_id` should be generated by mongo
- returns `Created (201)` when called with a valid request, with the response body containing the created legal job posting
- returns `Unauthorized (401)` when called by a user that is not authenticated
- returns `Bad Request (400)` when called with an invalid request with a missing or non-string `title` field, with an informative error message in the response body
- returns `Bad Request (400)` when called with an invalid request with a missing or non-string `description` field, with an informative error message in the response body
- returns `Bad Request (400)` when called with an invalid request with a missing or non-string or non-email string `clientEmail` field, with an informatinve error message in the response body
- returns `Internal Server Error (500)` when called with a valid request that can't be recorded due to the database being down or not reachable, but without mentioning that the db is down

### The Deliveroo Incident and why idempotency in POST requests like this is important

[Tom Scott video](https://www.youtube.com/watch?v=IP-rGJKSZ3s) (TLDW: One evening a bug in the Deliveroo app told users there was an error submitting their order and prompted them to resubmit their order, even when the submition actually succeeded. This resulted in many duplicate orders being placed and fulfilled. To avoid this Deliveroo could have used an idempotency key, to allow duplicate requests to be ignored.)

Due to this I really think an indempotency key really should be a future improvement to this POST endpoint.

### Future improvements

- idempotency key/token
- other login strategies
- saving the token as a cookie instead of returning it in the request body
- wrapping the `config` node package into a `configService`
- cause the server to log and error and cancel start up if a required config field is not set
- breakign up `app.module.ts` into app.module + authentication.module + postings.module
- using something other than email to uniquely identify solicitors and clients
- have a users table/db and check that people logging in are present there before granting bearer tokens. currently we rely on google doing everything
- add extra login strategies (namely local)
- rename `google.controller.ts` to `auth.controller.ts` when it grows to include other strategies

## GET /postings:

### Assumptions

- the solicitor posting can be uniquely identified by their email (in practice this isn't a great assumption since it means users cannot change their account's email without some extra email change handling code- but it is pretty common)
- the client who the job is for also can also be uniquely identified by their email
- there is no max limit requirement
- tests are not required for Story 1
- Swagger documentation or other documentation beyond these notes is not required
- these assumptions and acceptance criteria below have been verified/confirmed by the product owner

### Acceptance criteria:

- request optional body parameters:
  - `sortBy` (string enum) - what to order the returned postings by. permitted values so far: 'created', 'title'. defaults to 'title'
  - `sortOrder` (string enum) - which way to order the returned postings. permitted values: 'asc', 'desc'. defaults to 'desc'
  - `limit` (integer) - how many postings to return at most. has to be > 0 if present. defaults to 20
  - `offset` (integer) - specifies how many postings to skip from the sort order (enables pagination). has to be >= 0 if present. defaults to 0.
  - `posterEmail` (email string) - restricts the response to postings made by a specific solicitor. This will be required by the front-end showing the solicitor's view, since a specific solicitor will want to see their own postings specifically. Will not affect the return when missing from the request.
  - `clientEmail` (email string) - similar to the above, but for the client. Will not affect the return when missing from the request.
- the return format is an array of postings (see postings schema above)
- sorting, limiting, and offsetting should not be done by the node server, since that would require the node server to fetch the entire database every call. instead, the DB should be performign the sorting, limiting, and offsetting, so that there can be a performance/scallability gain from using db indices
- returns `OK (200)` when called with an empty request, with a list of up to 20 requests in the request body
- returns `OK (200)` and with the postings in the desired sort order, when called with the `sortBy` and `sortOrder` parameters
- returns `OK (200)` and with up to as many postings as permitted by the `limit` parameter, when called with a `limit` parameter
- returns `OK (200)` and with the right number of `skipped` postings, when called with an `offset` parameter
- returns `OK (200)` and with only the postings of a specific solicitor when the `posterIdFk` field is present in the request
- returns `OK (200)` and with only the postings about a specific client when the `clientIdFk` field is present in the request
- returns `Bad Request (400)` when called with a `sortBy` parameter with an unsupportedvalue (present but not one of the permitted strings), with an informative error message in the response body
- returns `Bad Request (400)` when called with a `sortOrder` parameter with an unsupported value (present but not one of the permitted strings), with an informative error message in the response body
- returns `Bad Request (400)` when called with a `limit` parameter with an unsupported value (present but not an integer, or not >0), with an informative error message in the response body
- returns `Bad Request (400)` when called with an `offset` parameter with an unsupported value (present but not an integer, or not >=0), with an informative error message in the response body
- returns `Bad Request (400)` when called with an `posterEmail` parameter with an unsupported value (not an email string) in the response body
- returns `Bad Request (400)` when called with an `posterEmail` parameter with an unsupported value (not an email string) in the response bodyinformative error message in the response body
- returns `Internal Server Error (500)` on a db error

### Future improvements

- more available sortOrders
- Redis or similar caching layer
- there likely will be an UI page that will show the solicitor or client a single specific job listing they have clicked on. To support this this endpoints needs to also accept requests with an '\_id' field or similar, so that the frontend can request a specific legal job
- set a max limit so that the db doesn't get accidentally or maliciously overloaded
- allow the client to filter on the `status` field
- allow the client to wildcard search `title` or `description`
- escape inputs - while not as necessary as when using a SQL db, the client might not escape the data we send them before using it

# [x] Story 2

This story requires a modification to the `POST /postings` endpoint. The `GET /postings` endpoint will automatically return listings in the new format when the db is updated, meeting the 'I need to be able to view' requirements.

## Assumptions:

- updating an existing database with legal job postings in the legacy format to the new format is out of scope for this story/ticket. this is something that will be handled by a story/ticket outside this assignment, or handled by re-starting with a blank db
- `GET /postings` does not need to return `Service Unavailable (503)` if the db it is connected to still has listings using the old schema
- tests are not required for Story 2 of this assignment
- Swagger documentation or other documentation beyond these notes is not required
- these assumptions and acceptance criteria below have been verified/confirmed by the product owner

## Schema Change:

The schema of a legal job listing needs the following new fields to accomodate this change in requirements:

- A `feeStructure` (string enum) mandatory field, either `No-Win-No-Fee` or `Fixed-Fee`. This field is not exactly mandatory since it can be computed based on if a feeAmount or a feePercentage is present, but I think the code would be easier to understand if we just have this in.
- A `feeAmount` (number) field, mandatory when `feePercentage` is not present
- A `feePercentage` (number between 0.0 and 1.0, max 3 dp.) field, mandatory when `feeAmount` is not present

## Correctness Enforcement

It is relatively simple to ensure `feeStructure` will be one of the two permitted values:

```ts
  @IsString()
  @IsIn(['Fixed-Fee', 'No-Win-No-Fee'])
  feeStructure: string;
```

In a similar way we can ensure the adequate companion field is present, by marking both as required unless `feeStructure` is the other value, using the ValidateIf decorator:

```ts
  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
    maxDecimalPlaces: 2,
  })
  @ValidateIf((o) => o.feeStructure === 'Fixed-Fee')
  feeAmount: number;

  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
    maxDecimalPlaces: 3,
  })
  @Max(1.0)
  @Min(0.0)
  @ValidateIf((o) => o.feeStructure === 'No-Win-No-Fee')
  feePercentage: number;
```

What the above doesn't do however is check that `feeAmount` and `feePercentage` are not both present. To enforce one and only one being present, I have added the following check in the request controller:

```ts
if (
  typeof createPostingDto.feeAmount !== "undefined" &&
  typeof createPostingDto.feePercentage !== "undefined"
) {
  throw new BadRequestException(
    "feeAmount and feePercentage must not both be present"
  );
}
```

## `POST /postings` Acceptance Criteria (additional):

- returns `OK (201)` when called with a valid request, with the created legal job posting in the return body
- returns `Bad Request (400)` when called without the `feeStructure` field present in the request
- returns `Bad Request (400)` when called with a request where the `feeStructure` field is not one of the two permitted values
- returns `Bad Request (400)` when called with a request with the `feeStructure` field set to `No-Win-No-Fee` and with a missing or invalid `feePercentage` field
- returns `Bad Request (400)` when called with a request with the `feeStructure` field set to `Fixed-Fee` and with a missing or invalid `feeAmount` field
- returns `Bad Request (400)` when called with a request containing both `feeStructure` and `feeAmount`

## `GET /postings` Acceptance Criteria (additional):

- (should be automatically met when the db gets listings updated to use the new schema. would require the tests to be updated if there were any)
- when returning `OK (200)`, the returned legal job postings are now following the new schema

## Suggested future improvements

- add a filter to the `GET /postings` to only get listings with a specific `feeStructure`
- add `sortBy` request options for `feeStructure`, `feeAmount`, `feeStructure` in the `GET /postings` endpoint
- check schema compliance when inserting into db also, not just when the request comes in
- [ ] Story 3
- [ ] Story 4
- [ ] Story 5

- [ ] Written notes on incomplete stories
- [ ] Written notes on weaknesses, tradeoffs and improvements

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

# Your TODO 

- [x] Initial codebase setup (hello world)
- [ ] Story 1 
- [ ] Story 2
- [ ] Story 3
- [ ] Story 4
- [ ] Story 5

- [ ] Written notes on incomplete stories
- [ ] Written notes on weaknesses, tradeoffs and improvements
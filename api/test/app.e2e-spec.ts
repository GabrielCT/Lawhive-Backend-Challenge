import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as request from 'supertest';
import * as config from 'config';

import { PostingSchema } from '../src/postings/posting.schema';
import { PostingsController } from '../src/postings/postings.controller';
import { PostingsService } from '../src/postings/postings.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let postingsService: PostingsService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forFeature(
          [{ name: 'Posting', schema: PostingSchema }],
          'postings',
        ),
        // TODO: throw an error and refuse to start up if config.has(...) is not true
        // TODO: wrap config with configService? probably the nestjs way
        MongooseModule.forRoot(config.get('mongodb'), {
          connectionName: 'postings',
          dbName: 'postings',
        }),
      ],
      controllers: [PostingsController],
      providers: [PostingsService],
    }).compile();

    postingsService = moduleFixture.get<PostingsService>(PostingsService);

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/postings/payments (POST) - empty request', () => {
    return request(app.getHttpServer())
      .post('/postings/payment')
      .send({})
      .expect(400)
      .expect({
        statusCode: 400,
        message: 'job posting _id does not exist',
        error: 'Bad Request',
      });
  });

  it('/postings/payments (POST) - request for non-existent job', () => {
    return request(app.getHttpServer())
      .post('/postings/payment')
      .send({
        _id: '63504a552ea7e58584f66579',
      })
      .expect(400)
      .expect({
        statusCode: 400,
        message: 'job posting _id does not exist',
        error: 'Bad Request',
      });
  });

  it('/postings/payments (POST) - valid request for Fixed-Fee job', async () => {
    // creating a Fixed-Fee job to then check the payments endpoint on
    const createdJob = await postingsService.create(
      {
        title: 'title test',
        description: 'description test',
        clientEmail: 'clientEmailTest@example.com',
        feeStructure: 'Fixed-Fee',
        feeAmount: 400.0,
      },
      'solicitorEmailTest@example.com',
    );

    const timestampWhenPostingPayment = new Date();

    await request(app.getHttpServer())
      .post('/postings/payment')
      .send({
        _id: createdJob._id,
      })
      .expect(201)
      .expect({
        // the expected return is the posting as it was before modification
        // will also need to verify that the posting has been updated in the db
        _id: createdJob._id.toString(),
        title: createdJob.title,
        description: createdJob.description,
        clientEmail: createdJob.clientEmail,
        feeStructure: createdJob.feeStructure,
        feeAmount: createdJob.feeAmount,
        created: createdJob.created.toISOString(),
        posterEmail: createdJob.posterEmail,
        status: createdJob.status,
        __v: createdJob.__v,
      });

    // fetching the job again to check it has been updated
    const updatedJob = await postingsService.findById(
      createdJob._id.toString(),
    );

    // properties expected to stay the same as when the job was created
    expect(updatedJob._id.toString()).toMatch(createdJob._id.toString());
    expect(updatedJob.title).toMatch(createdJob.title);
    expect(updatedJob.description).toMatch(createdJob.description);
    expect(updatedJob.clientEmail).toMatch(createdJob.clientEmail);
    expect(updatedJob.feeStructure).toMatch(createdJob.feeStructure);
    expect(updatedJob.feeAmount).toBeCloseTo(createdJob.feeAmount);
    // future improvement.. :(
    expect(updatedJob.created.toISOString()).toMatch(
      createdJob.created.toISOString(),
    );
    expect(updatedJob.posterEmail).toMatch(createdJob.posterEmail);
    expect(updatedJob.__v).toBe(createdJob.__v);

    // properties expected to change or be added
    expect(updatedJob.status).toMatch('paid');
    expect(updatedJob.feeAmount).toBeCloseTo(createdJob.feeAmount);
    // checking paidOn is populated and an ISO string
    expect(updatedJob.paidOn.toISOString().length).toBe(24);
    // checking paidOn is about right
    expect(
      new Date(updatedJob.paidOn.toISOString()).getTime() -
        timestampWhenPostingPayment.getTime(),
    ).toBeLessThan(10000);

    return;
  });

  it('/postings/payments (POST) - invalid request for already-paid job job', async () => {
    // creating a Fixed-Fee job to then check the payments endpoint on
    const createdJob = await postingsService.create(
      {
        title: 'title test',
        description: 'description test',
        clientEmail: 'clientEmailTest@example.com',
        feeStructure: 'Fixed-Fee',
        feeAmount: 400.0,
      },
      'solicitorEmailTest@example.com',
    );

    await request(app.getHttpServer())
      .post('/postings/payment')
      .send({
        _id: createdJob._id,
      })
      .expect(201)
      .expect({
        // the expected return is the posting as it was before modification
        // will also need to verify that the posting has been updated in the db
        _id: createdJob._id.toString(),
        title: createdJob.title,
        description: createdJob.description,
        clientEmail: createdJob.clientEmail,
        feeStructure: createdJob.feeStructure,
        feeAmount: createdJob.feeAmount,
        created: createdJob.created.toISOString(),
        posterEmail: createdJob.posterEmail,
        status: createdJob.status,
        __v: createdJob.__v,
      });

    await request(app.getHttpServer())
      .post('/postings/payment')
      .send({
        _id: createdJob._id,
      })
      .expect(400)
      .expect({
        statusCode: 400,
        message: 'job has already been paid',
        error: 'Bad Request',
      });

    return;
  });

  it('/postings/payments(POST) - valid request for No-Win-No-Fee job', async () => {
    // created a No-Win-No-Fee job to later check the payments endpoint on
    const createdJob = await postingsService.create(
      {
        title: 'title test',
        description: 'description test',
        clientEmail: 'clientEmailTest@example.com',
        feeStructure: 'No-Win-No-Fee',
        feePercentage: 0.11,
        expectedSettlementAmount: 50000,
      },
      'solicitorEmailTest@example.com',
    );

    const timestampWhenPostingPayment = new Date();

    await request(app.getHttpServer())
      .post('/postings/payment')
      .send({
        _id: createdJob._id,
        settlementAmount: 50000,
      })
      .expect(201)
      .expect({
        // the expected return is the posting as it was before modification
        // will also need to verify that the posting has been updated in the db
        _id: createdJob._id.toString(),
        title: createdJob.title,
        description: createdJob.description,
        clientEmail: createdJob.clientEmail,
        feeStructure: createdJob.feeStructure,
        feePercentage: createdJob.feePercentage,
        expectedSettlementAmount: 50000,
        created: createdJob.created.toISOString(),
        posterEmail: createdJob.posterEmail,
        status: createdJob.status,
        __v: createdJob.__v,
      });

    // fetching the job again to check it has been updated
    const updatedJob = await postingsService.findById(
      createdJob._id.toString(),
    );

    // properties expected to stay the same as when the job was created
    expect(updatedJob._id.toString()).toMatch(createdJob._id.toString());
    expect(updatedJob.title).toMatch(createdJob.title);
    expect(updatedJob.description).toMatch(createdJob.description);
    expect(updatedJob.clientEmail).toMatch(createdJob.clientEmail);
    expect(updatedJob.feeStructure).toMatch(createdJob.feeStructure);
    expect(updatedJob.feePercentage).toBeCloseTo(createdJob.feePercentage);
    // future improvement.. :(
    expect(updatedJob.created.toISOString()).toMatch(
      createdJob.created.toISOString(),
    );
    expect(updatedJob.posterEmail).toMatch(createdJob.posterEmail);
    expect(updatedJob.__v).toBe(createdJob.__v);
    expect(updatedJob.settlementAmount).toBeCloseTo(50000);

    // properties expected to change or be added
    expect(updatedJob.status).toMatch('paid');
    expect(updatedJob.amountPaid).toBeCloseTo(
      createdJob.feePercentage * updatedJob.settlementAmount,
    );
    // checking paidOn is populated and an ISO string
    expect(updatedJob.paidOn.toISOString().length).toBe(24);
    // checking paidOn is about right
    expect(
      new Date(updatedJob.paidOn.toISOString()).getTime() -
        timestampWhenPostingPayment.getTime(),
    ).toBeLessThan(10000);
  });

  it('/postings/payments(POST) - invalid valid request missing settlement amount for No-Win-No-Fee job', async () => {
    // created a No-Win-No-Fee job to later check the payments endpoint on
    const createdJob = await postingsService.create(
      {
        title: 'title test',
        description: 'description test',
        clientEmail: 'clientEmailTest@example.com',
        feeStructure: 'No-Win-No-Fee',
        feePercentage: 0.11,
        expectedSettlementAmount: 50000,
      },
      'solicitorEmailTest@example.com',
    );
    await request(app.getHttpServer())
      .post('/postings/payment')
      .send({
        _id: createdJob._id,
      })
      .expect(400)
      .expect({
        statusCode: 400,
        message:
          'No-Win-No-Fee jobs require settlementAmount in the payment submission',
        error: 'Bad Request',
      });
  });

  it('/postings/payment(POST) - settlementAmount for No-Win-No-Fee jobs are constrained to the allowed range', async () => {
    const expectedSettlementAmount = 50000;
    const allowedDivergence = parseFloat(
      config.get('maxSettlementDivergenceFromExpected'),
    );
    // creating two jobs to test both the lower and higher bounds
    const createdJobForLower = await postingsService.create(
      {
        title: 'title test',
        description: 'description test',
        clientEmail: 'clientEmailTest@example.com',
        feeStructure: 'No-Win-No-Fee',
        feePercentage: 0.11,
        expectedSettlementAmount,
      },
      'solicitorEmailTest@example.com',
    );
    const createdJobForUpper = await postingsService.create(
      {
        title: 'title test',
        description: 'description test',
        clientEmail: 'clientEmailTest@example.com',
        feeStructure: 'No-Win-No-Fee',
        feePercentage: 0.11,
        expectedSettlementAmount,
      },
      'solicitorEmailTest@example.com',
    );

    // checking for 400 error when below the lower bound
    await request(app.getHttpServer())
      .post('/postings/payment')
      .send({
        _id: createdJobForLower._id,
        settlementAmount:
          expectedSettlementAmount * (1 - allowedDivergence - 0.01),
      })
      .expect(400)
      .expect({
        error:
          'settlementAmount must be at least minSettlementAmount and at most maxSettlementAmount',
        minSettlementAmount: Math.round(
          expectedSettlementAmount * (1 - allowedDivergence),
        ),
        maxSettlementAmount: Math.round(
          expectedSettlementAmount * (1 + allowedDivergence),
        ),
      });

    // checking for 201 success when just above the lower bound
    await request(app.getHttpServer())
      .post('/postings/payment')
      .send({
        _id: createdJobForLower._id,
        settlementAmount:
          expectedSettlementAmount * (1 - allowedDivergence + 0.01),
      })
      .expect(201)
      .expect({
        _id: createdJobForLower._id.toString(),
        title: createdJobForLower.title,
        description: createdJobForLower.description,
        clientEmail: createdJobForLower.clientEmail,
        feeStructure: createdJobForLower.feeStructure,
        feePercentage: createdJobForLower.feePercentage,
        expectedSettlementAmount,
        created: createdJobForLower.created.toISOString(),
        posterEmail: createdJobForLower.posterEmail,
        status: createdJobForLower.status,
        __v: createdJobForLower.__v,
      });

    // checking for 400 error when above the upper bound
    await request(app.getHttpServer())
      .post('/postings/payment')
      .send({
        _id: createdJobForUpper._id,
        settlementAmount:
          expectedSettlementAmount * (1 + allowedDivergence + 0.1),
      })
      .expect(400)
      .expect({
        error:
          'settlementAmount must be at least minSettlementAmount and at most maxSettlementAmount',
        minSettlementAmount: Math.round(
          expectedSettlementAmount * (1 - allowedDivergence),
        ),
        maxSettlementAmount: Math.round(
          expectedSettlementAmount * (1 + allowedDivergence),
        ),
      });

    // checking for 201 success when just below the upper bound
    await request(app.getHttpServer())
      .post('/postings/payment')
      .send({
        _id: createdJobForUpper._id,
        settlementAmount:
          expectedSettlementAmount * (1 - allowedDivergence + 0.01),
      })
      .expect(201)
      .expect({
        _id: createdJobForUpper._id.toString(),
        title: createdJobForUpper.title,
        description: createdJobForUpper.description,
        clientEmail: createdJobForUpper.clientEmail,
        feeStructure: createdJobForUpper.feeStructure,
        feePercentage: createdJobForUpper.feePercentage,
        expectedSettlementAmount,
        created: createdJobForUpper.created.toISOString(),
        posterEmail: createdJobForUpper.posterEmail,
        status: createdJobForUpper.status,
        __v: createdJobForUpper.__v,
      });
  });
});

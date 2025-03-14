import { UserSession } from '@novu/testing';
import { SubscriberRepository } from '@novu/dal';
import { expect } from 'chai';
import { Novu } from '@novu/api';
import { initNovuClassSdk } from '../../shared/helpers/e2e/sdk/e2e-sdk.helper';

describe('Create Subscriber - /subscribers (POST) #novu-v2', function () {
  let session: UserSession;
  const subscriberRepository = new SubscriberRepository();
  let novuClient: Novu;

  beforeEach(async () => {
    session = new UserSession();
    await session.initialize();
    novuClient = initNovuClassSdk(session);
  });

  it('should create a new subscriber', async function () {
    const response = await novuClient.subscribers.create({
      subscriberId: '123',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@doe.com',
      phone: '+972523333333',
      locale: 'en',
      data: { test1: 'test value1', test2: 'test value2' },
    });

    const body = response.result;

    expect(body).to.be.ok;
    const createdSubscriber = await subscriberRepository.findBySubscriberId(session.environment._id, '123');

    expect(createdSubscriber?.firstName).to.equal('John');
    expect(createdSubscriber?.email).to.equal('john@doe.com');
    expect(createdSubscriber?.phone).to.equal('+972523333333');
    expect(createdSubscriber?.locale).to.equal('en');
    expect(createdSubscriber?.data?.test1).to.equal('test value1');
  });
});

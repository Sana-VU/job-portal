import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import app from '../server';
import Job from '../models/jobModel';

let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongo.stop();
});

afterEach(async () => {
  await mongoose.connection.db.dropDatabase();
});

it('GET /api/jobs returns seeded job', async () => {
  await Job.create({
    title: 'Assistant Director (BPS-17)',
    organization: 'Ministry of ABC',
    category: 'Government',
    location: 'Islamabad',
    source: 'Dawn',
    publishDate: new Date(),
    lastDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    adImage: 'https://example.com/ad.jpg',
    tags: ['BPS-17', 'Govt'],
    status: 'published',
  });
  const res = await request(app).get('/api/jobs').expect(200);
  expect(res.body.success).toBe(true);
  expect(Array.isArray(res.body.data)).toBe(true);
  expect(res.body.data.length).toBe(1);
});

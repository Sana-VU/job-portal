import Job from '../models/jobModel';

it('validates required fields', async () => {
  const doc = new Job({});
  let err: any;
  try { await doc.validate(); } catch (e) { err = e; }
  const paths = Object.keys(err?.errors || {});
  expect(paths).toEqual(expect.arrayContaining(['title','organization','location','source','lastDate','adImage']));
});

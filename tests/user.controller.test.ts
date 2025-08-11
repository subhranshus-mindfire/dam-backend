import request from 'supertest';
import app from '../src/app';
import { User } from '../src/models/User';
import mongoose from 'mongoose';

describe('User controller & routes', () => {

  it('creates a user (happy path)', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({
        name: 'Alice',
        email: 'alice@example.com',
        password: 'Pa$$w0rd',
        role: 'user',
      });
    expect(res.status).toBe(201);
    expect(res.body._id).toBeDefined();
    expect(res.body.email).toBe('alice@example.com');
    expect(res.body.password_hash).toBeUndefined(); 
  });

  it('rejects missing email/password', async () => {
    const res1 = await request(app).post('/api/users').send({ name: 'NoEmail' });
    expect(res1.status).toBe(400);

    const res2 = await request(app).post('/api/users').send({ email: 'e@example.com' });
    expect(res2.status).toBe(400);
  });

  it('rejects duplicate email', async () => {
    await User.create({ name: 'Exist', email: 'dup@example.com', password_hash: 'hash' });

    const res = await request(app)
      .post('/api/users')
      .send({ name: 'Dup', email: 'dup@example.com', password: 'x' });

    expect(res.status).toBe(409);
    expect(res.body.message).toMatch(/email/i);
  });

  it('returns list of users (no password_hash)', async () => {
    await User.create({ name: 'U1', email: 'u1@example.com', password_hash: 'h1' });
    await User.create({ name: 'U2', email: 'u2@example.com', password_hash: 'h2' });

    const res = await request(app).get('/api/users');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
    expect(res.body[0].password_hash).toBeUndefined();
  });

  it('gets user by id', async () => {
    const user = await User.create({ name: 'FindMe', email: 'findme@example.com', password_hash: 'h' });
    const res = await request(app).get(`/api/users/${user._id}`);
    expect(res.status).toBe(200);
    expect(res.body.email).toBe('findme@example.com');
    expect(res.body.password_hash).toBeUndefined();
  });

  it('returns 404 for non-existent ID', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/users/${fakeId}`);
    expect(res.status).toBe(404);
  });

  it('updates a user (including changing password)', async () => {
    const user = await User.create({ name: 'ToUpdate', email: 'upd@example.com', password_hash: 'old' });

    const res = await request(app)
      .put(`/api/users/${user._id}`)
      .send({ name: 'Updated', password: 'newpass' });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Updated');
    const reloaded = await User.findById(user._id).lean();
    expect(reloaded?.password_hash).toBeDefined();
    expect(reloaded?.password_hash).not.toBe('newpass'); // hashed
  });

  it('returns 404 when updating missing user', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).put(`/api/users/${fakeId}`).send({ name: 'X' });
    expect(res.status).toBe(404);
  });

  it('deletes a user', async () => {
    const user = await User.create({ name: 'ToDel', email: 'del@example.com', password_hash: 'h' });
    const res = await request(app).delete(`/api/users/${user._id}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);

    const check = await User.findById(user._id);
    expect(check).toBeNull();
  });

  it('returns 404 deleting non-existent user', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).delete(`/api/users/${fakeId}`);
    expect(res.status).toBe(404);
  });
});

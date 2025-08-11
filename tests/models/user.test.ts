import { User } from '../../src/models/User';

describe('User Model', () => {
  it('should create a user successfully', async () => {
    const user = await User.create({
      email: 'test@example.com',
      password_hash: 'hashedpassword',
    });
    expect(user._id).toBeDefined();
    expect(user.email).toBe('test@example.com');
  });

  it('should not allow duplicate email', async () => {
    await User.create({ email: 'dup@example.com', password_hash: 'hash' });
    await expect(
      User.create({ email: 'dup@example.com', password_hash: 'hash2' })
    ).rejects.toThrow();
  });

  it('should require email', async () => {
    await expect(
      User.create({ password_hash: 'hash' })
    ).rejects.toThrow();
  });
});

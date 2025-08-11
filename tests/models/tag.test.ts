import { Tag } from '../../src/models/Tag';

describe('Tag model', () => {
  it('creates a tag', async () => {
    const t = await Tag.create({ name: 'marketing' });
    expect(t._id).toBeDefined();
    expect(t.name).toBe('marketing');
  });

  it('enforces unique name', async () => {
    await Tag.create({ name: 'unique-tag' });
    await expect(Tag.create({ name: 'unique-tag' })).rejects.toThrow();
  });

  it('requires name', async () => {
    await expect(Tag.create({} as any)).rejects.toThrow();
  });
});

import { after, test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';

const vite = await createServer({
  configFile: false,
  appType: 'custom',
  optimizeDeps: { noDiscovery: true, include: [] },
  server: { middlewareMode: true, ws: false, watch: null },
});
after(() => vite.close());

const { getPortfolioMedia, moveMedia, parseMediaUrl } = await vite.ssrLoadModule('/src/lib/portfolioMedia.ts');
const { getActivityText, mergeActivities } = await vite.ssrLoadModule('/src/lib/portfolioActivities.ts');

test('ordered slides set the cover and old imageUrl values still work', () => {
  const picture = { type: 'image', url: '/a.png' };
  const video = { type: 'video', url: '/opaque-storage-url' };
  const original = [picture, video];
  assert.deepEqual(moveMedia(original, 1, -1), [video, picture]);
  assert.equal(original[0], picture);
  assert.equal(moveMedia(original, 0, -1), original);
  assert.deepEqual(getPortfolioMedia({ imageUrl: '/old.png', media: [video, picture] }), [video, picture]);
  assert.deepEqual(getPortfolioMedia({ imageUrl: '/clip.MP4?download=1' }), [{ type: 'video', url: '/clip.MP4?download=1' }]);
  assert.deepEqual(getPortfolioMedia({ media: [] }), []);
});

test('new media links use public HTTPS URLs without embedded credentials', () => {
  assert.equal(parseMediaUrl(' https://media.example/cover.png?v=1 '), 'https://media.example/cover.png?v=1');
  for (const invalid of ['/assets/cover.png', 'http://media.example/a.mp4', 'https://user:pass@media.example/image.png', 'javascript:alert(1)', 'data:image/png;base64,AAA']) {
    assert.equal(parseMediaUrl(invalid), null);
  }
});

test('activity overrides and deletions survive merging with legacy content', () => {
  const [first, second] = mergeActivities([]);
  const updated = { ...first, name: 'Updated title', description: 'Updated caption' };
  const added = { id: 'firestore-id', name: 'New activity' };
  const merged = mergeActivities([updated, { id: second.id, deleted: true }, added]);
  assert.equal(merged.find(item => item.id === first.id), updated);
  assert.equal(merged.some(item => item.id === second.id), false);
  assert.equal(merged.at(-1), added);
  assert.deepEqual(getActivityText(updated), { title: 'Updated title', description: 'Updated caption' });
  assert.deepEqual(getActivityText({ name: 'Legacy title | Legacy caption' }), { title: 'Legacy title', description: 'Legacy caption' });
});

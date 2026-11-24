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
const { changeCvCatalog, cvUrl, defaultCvCatalog } = await vite.ssrLoadModule('/src/lib/cvVersions.ts');
const { parseCvDraft, renderCvHtml } = await vite.ssrLoadModule('/src/lib/cvAuthoring.ts');

test('authored CV templates parse and render safely in both print layouts', async () => {
  for (const language of ['en', 'ja']) {
    const { default: template } = await vite.ssrLoadModule(`/src/lib/cvTemplate.${language}.json`);
    const draft = parseCvDraft(JSON.stringify(template));
    assert.ok(draft);
    const html = renderCvHtml({ ...draft, name: '<script>alert(1)</script>' }, language);
    assert.match(html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
    assert.doesNotMatch(html, /<script>/);
    assert.match(html, /size:A4/);
    assert.equal(html.includes('<table'), language === 'ja');
  }
  assert.equal(parseCvDraft('{"name":"Sample","metadata":"","intro":"","sections":[{}]}'), null);
});

test('CV versions can be edited and published independently, with an active version protected from deletion', () => {
  const english = defaultCvCatalog('en');
  const japanese = defaultCvCatalog('ja');
  const version = { id: 'new', label: '2026', url: 'https://example.com/cv.pdf' };
  const draft = changeCvCatalog(english, { type: 'save', version });
  assert.equal(draft.activeId, english.activeId);
  const revised = changeCvCatalog(draft, { type: 'save', version: { ...version, label: 'November 2026' } });
  assert.equal(revised.versions.length, 2);
  assert.equal(revised.versions[1].label, 'November 2026');
  const published = changeCvCatalog(revised, { type: 'publish', id: version.id });
  assert.equal(published.activeId, version.id);
  assert.throws(() => changeCvCatalog(published, { type: 'delete', id: version.id }));
  assert.equal(changeCvCatalog(published, { type: 'delete', id: english.activeId }).versions.length, 1);
  assert.equal(japanese.activeId, 'original');
  assert.equal(cvUrl('ja', japanese.versions[0].url), japanese.versions[0].url);
  assert.equal(cvUrl('en', japanese.versions[0].url), null);
});

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

#!/usr/bin/env node
const fs = require('fs');
const vm = require('vm');
const assert = require('assert');

const html = fs.readFileSync('index.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*)<\/script>\s*<\/body>/);
assert(scriptMatch, 'inline application script not found');
const appScript = scriptMatch[1].replace(/\n\s*init\(\);\s*$/, '\n');

const localStore = new Map();
const context = {
  console,
  URL,
  Blob: class BlobMock {
    constructor(parts, opts) { this.parts = parts; this.type = opts?.type || ''; }
  },
  localStorage: {
    getItem(key) { return localStore.has(key) ? localStore.get(key) : null; },
    setItem(key, value) { localStore.set(key, String(value)); },
    removeItem(key) { localStore.delete(key); }
  },
  window: { pageYOffset: 0, scrollTo() {} },
  document: {
    getElementById() { return null; },
    querySelector() { return null; },
    querySelectorAll() { return []; },
    createElement() { return { click() {}, remove() {}, style: {}, setAttribute() {} }; },
    body: { appendChild() {}, classList: { toggle() {}, contains() { return false; } } }
  },
  navigator: {},
  setTimeout,
  clearTimeout,
  requestAnimationFrame(fn) { return fn(); }
};
context.globalThis = context;

vm.runInNewContext(`${appScript}
renderFilterBar = () => {};
renderCards = () => {};
updateStats = () => {};
renderStateBar = () => {};
applyWorkspacePanelShells = () => {};
renderWorkspaceIndex = () => {};
updateExpandButton = () => {};
globalThis.__APP_TEST__ = {
  evidence, allTypes, defaultCategoryOrder, categorySummaries,
  workspacePanels, workspacePanelOrder,
  get categoryOrder() { return categoryOrder; },
  get collapsedWorkspacePanelCount() { return collapsedWorkspacePanels.size; },
  get openCategoryCount() { return openCategories.size; },
  moveCategory, setAllCategories, setAllWorkspacePanels,
  formatFilterLabel, formatTypePlural
};`, context, { filename: 'index.inline.js' });

const app = context.__APP_TEST__;
assert(Array.isArray(app.evidence) && app.evidence.length >= 200, 'expected a large evidence dataset');
assert.deepStrictEqual(app.defaultCategoryOrder, app.allTypes, 'allTypes should mirror the default category order');
assert.strictEqual(new Set(app.allTypes).size, app.allTypes.length, 'category types must be unique');
assert.strictEqual(app.openCategoryCount, 0, 'all card categories should start closed');
assert.strictEqual(app.collapsedWorkspacePanelCount, app.workspacePanels.length, 'workspace panels should start collapsed');

const ids = new Set();
for (const item of app.evidence) {
  assert(item.id && typeof item.id === 'string', 'card missing id');
  assert(!ids.has(item.id), `duplicate card id: ${item.id}`);
  ids.add(item.id);
  assert(app.allTypes.includes(item.type), `${item.id} has unknown type ${item.type}`);
  assert(item.title && item.description, `${item.id} missing title/description`);
  assert(Array.isArray(item.links), `${item.id} links must be an array`);
  for (const link of item.links) {
    assert(link.label && link.url, `${item.id} has malformed link`);
    assert(/^https?:\/\//.test(link.url), `${item.id} link is not http(s): ${link.url}`);
  }
}

for (const type of app.allTypes) {
  assert(app.categorySummaries[type], `missing category summary for ${type}`);
  assert(app.formatFilterLabel(type), `missing filter label for ${type}`);
}

const workspaceIds = app.workspacePanels.map(panel => panel.id);
assert.strictEqual(new Set(workspaceIds).size, workspaceIds.length, 'workspace panel IDs must be unique');
for (const id of workspaceIds) {
  assert(html.includes(`id="${id}"`), `workspace panel element missing from HTML: ${id}`);
}

app.setAllWorkspacePanels(true);
assert.strictEqual(app.collapsedWorkspacePanelCount, 0, 'open workspace should uncollapse all workspace panels');
app.setAllWorkspacePanels(false);
assert.strictEqual(app.collapsedWorkspacePanelCount, app.workspacePanels.length, 'collapse workspace should collapse all workspace panels');

app.setAllCategories(true);
assert(app.openCategoryCount > 0, 'open all categories should open visible categories');
app.setAllCategories(false);
assert.strictEqual(app.openCategoryCount, 0, 'close all categories should close all categories');

const first = app.categoryOrder[0];
const second = app.categoryOrder[1];
app.moveCategory(second, first);
assert.strictEqual(app.categoryOrder[0], second, 'dragged category should move before target');
assert(localStore.has('evidenceCategoryOrder'), 'category order should persist to localStorage');

assert(html.includes('.workspace-section.is-collapsed > :not(.workspace-section-toggle)'), 'collapsed panel content CSS guard missing');
assert(html.includes('padding: 0 !important;'), 'collapsed workspace panels should not leave padded blank rows');
assert(/renderCards\(\);\s*renderSupportPanels\(getVisibleEvidence\(\)\);\s*updateStats\(\);/.test(html), 'init should render and collapse workspace support panels before first paint');
assert(html.includes('function scrollToElementTop'), 'top-aligned scroll helper missing');
assert(html.includes('workspaceDrawerTab'), 'workspace drawer tab missing');
assert(/workspaceDrawerTab[\s\S]*event\.preventDefault\(\);[\s\S]*event\.stopPropagation\(\);[\s\S]*toggleWorkspaceDrawer\(\);/.test(html), 'workspace drawer tab click should not be swallowed by outside-click handling');

console.log(`Smoke tests passed: ${app.evidence.length} cards, ${app.allTypes.length} categories, ${app.workspacePanels.length} workspace panels.`);

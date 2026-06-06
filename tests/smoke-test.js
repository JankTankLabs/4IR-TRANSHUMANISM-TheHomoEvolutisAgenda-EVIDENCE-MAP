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
  workspacePanels, workspacePanelOrder, bridgeConvergenceMaps,
  get categoryOrder() { return categoryOrder; },
  get workspacePanelOrderList() { return workspacePanelOrder; },
  get collapsedWorkspacePanelCount() { return collapsedWorkspacePanels.size; },
  get openCategoryCount() { return openCategories.size; },
  moveCategory, setAllCategories, setAllWorkspacePanels, getBridgeDominoLinks, moveWorkspacePanel, reorderWorkspacePanels,
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

const firstPanel = app.workspacePanelOrderList[0];
const secondPanel = app.workspacePanelOrderList[1];
app.moveWorkspacePanel(secondPanel, firstPanel);
assert.strictEqual(app.workspacePanelOrderList[0], secondPanel, 'dragged workspace index item should move before target');
assert(localStore.has('evidenceWorkspacePanelOrder'), 'workspace index order should persist to localStorage');
assert(html.includes('${ordered.map((item, index) => `'), 'Workspace Index should render the exact saved order without regrouping it');
assert(!html.includes('${grouped.map(group => `'), 'Workspace Index grouping must not distort the saved physical order');

const cardsGridNode = { id: 'cardsGrid' };
const panelNodes = Object.fromEntries(workspaceIds.map(id => [id, { id }]));
const pageParent = {
  children: [...workspaceIds.map(id => panelNodes[id]), cardsGridNode],
  insertBefore(node, reference) {
    this.children = this.children.filter(item => item !== node);
    const index = this.children.indexOf(reference);
    this.children.splice(index < 0 ? this.children.length : index, 0, node);
  }
};
cardsGridNode.parentElement = pageParent;
context.document.getElementById = id => id === 'cardsGrid' ? cardsGridNode : panelNodes[id] || null;
app.reorderWorkspacePanels();
assert.deepStrictEqual(pageParent.children.slice(0, workspaceIds.length).map(node => node.id), Array.from(app.workspacePanelOrderList), 'saved Workspace Index order must physically reorder main-page sections');

assert(html.includes('.workspace-section.is-collapsed > :not(.workspace-section-toggle)'), 'collapsed panel content CSS guard missing');
assert(html.includes('padding: 0 !important;'), 'collapsed workspace panels should not leave padded blank rows');
assert(html.includes('content: attr(data-panel-label);'), 'collapsed workspace panels should render visible label fallback text');
assert(/setupEventListeners\(\);\s*try \{\s*updateStats\(\);/.test(html), 'init should bind core listeners before the single guarded support update');
const initBody = (html.match(/function init\(\) \{([\s\S]*?)\n    \}\n\n    function getVisibleEvidence/) || [])[1] || '';
assert.ok(initBody.includes('updateStats();'), 'init should perform one consolidated stats/support render pass');
assert.ok(!initBody.includes('renderSupportPanels('), 'init should not duplicate the support-panel render already performed by updateStats');
assert(html.includes('function matchesTerm'), 'Bridge Map domino matching helper missing');
assert(app.getBridgeDominoLinks(app.bridgeConvergenceMaps[0]).length > 0, 'Bridge Map to Domino links should render without missing helper errors');
assert(html.includes('function scrollToElementTop'), 'top-aligned scroll helper missing');
assert(html.includes('id="sideDrawer"') && html.includes('id="sideDrawerPanel"'), 'single shared side drawer shell missing');
assert.strictEqual((html.match(/id="sideDrawer"/g) || []).length, 1, 'only one side drawer shell should exist');
assert(!html.includes('workspaceDrawerToggle') && !html.includes('sourceDrawerToggle') && !html.includes('impactDrawerToggle'), 'legacy overlapping drawer toggles must be removed');
assert(html.includes('body.side-drawer-open #sideDrawer'), 'shared drawer open selector missing');
assert(html.includes('data-drawer-view="index"') && html.includes('data-drawer-view="impact"') && html.includes('data-drawer-view="source"'), 'three drawer view tabs missing');
assert(html.includes("renderWorkspaceIndex('sideDrawerPanel')"), 'Index must render into the shared drawer panel');
assert(html.includes("renderBriefPanel(getVisibleEvidence(), 'sideDrawerPanel')"), 'Sources must render into the shared drawer panel');
assert(html.includes("renderImpactPanel(getVisibleEvidence(), 'sideDrawerPanel')"), 'Impact must render into the shared drawer panel');
assert(html.includes("if (panelId === 'sideDrawerPanel' && activeDrawerView !== 'index') return;"), 'closed/non-Index drawer should not waste work rendering the Index');
assert(html.includes('function setDrawerView') && html.includes('function toggleDrawerView'), 'deterministic drawer view controller missing');
assert(html.includes('function renderWorkspacePanelById'), 'lazy workspace-panel renderer missing');
assert(/\$\{isOpen \? `[\s\S]*items\.map\(e => renderCard\(e\)\)[\s\S]*` : ''\}/.test(html), 'closed categories should not render hundreds of hidden cards');
assert(/categoryOrder[\s\S]*\.map\(type => renderCategorySection/.test(html), 'main category sections must follow the saved colored-index order');
assert(/workspacePanelOrder\.forEach\(id => \{\s*if \(!collapsedWorkspacePanels\.has\(id\)\)/.test(html), 'collapsed workspace panels should not rerender during routine updates');
assert(!/renderSupportPanels\(visible\);\s*renderStateBar\(visible\);\s*renderTimeline\(visible\)/.test(html), 'updateStats must not duplicate timeline/thread rendering');
assert(html.includes('top: calc(34% + 84px);') && html.includes('top: calc(34% + 168px);'), 'left drawer tabs should be vertically aligned as a stack');

console.log(`Smoke tests passed: ${app.evidence.length} cards, ${app.allTypes.length} categories, ${app.workspacePanels.length} workspace panels.`);

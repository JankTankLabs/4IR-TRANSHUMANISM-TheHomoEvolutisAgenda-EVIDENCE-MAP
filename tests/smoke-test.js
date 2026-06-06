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
assert(/setupEventListeners\(\);\s*try \{\s*renderSupportPanels\(getVisibleEvidence\(\)\);/.test(html), 'init should bind core listeners before support-panel rendering can fail');
assert(html.includes('function matchesTerm'), 'Bridge Map domino matching helper missing');
assert(app.getBridgeDominoLinks(app.bridgeConvergenceMaps[0]).length > 0, 'Bridge Map to Domino links should render without missing helper errors');
assert(html.includes('function scrollToElementTop'), 'top-aligned scroll helper missing');
assert(html.includes('workspaceDrawerToggle'), 'workspace drawer checkbox fallback missing');
assert(html.includes('#workspaceDrawerToggle:checked ~ #workspaceIndexDrawer'), 'workspace drawer should have a CSS-only checked fallback');
assert(html.includes('#impactDrawerToggle:checked ~ #impactDrawer'), 'impact drawer should have a CSS-only checked fallback');
assert(html.includes('#sourceDrawerToggle:checked ~ #sourceDrawer'), 'source drawer should have a CSS-only checked fallback');
assert(!html.includes('body.workspace-drawer-open .workspace-index-drawer'), 'opening Index must not open every side drawer');
assert(html.includes('body.workspace-drawer-open #workspaceIndexDrawer'), 'Index state must target only the Index drawer');
assert(html.includes("function renderBriefPanel(items = getVisibleEvidence(), panelId = 'sourceDrawerPanel')"), 'Sources must render into its own panel');
assert(html.includes("function renderImpactPanel(items = getVisibleEvidence(), panelId = 'impactDrawerPanel')"), 'Impact must render into its own panel');
assert(/setWorkspaceDrawer\(open\)[\s\S]*setSideDrawer\('impact', false\);[\s\S]*setSideDrawer\('source', false\);/.test(html), 'opening Index should close Impact and Sources drawers');
assert(/workspaceDrawerToggle[\s\S]*addEventListener\('change'[\s\S]*setWorkspaceDrawer\(event\.target\.checked\)/.test(html), 'workspace drawer checkbox change should sync JS state');
assert(/workspaceDrawerTab[\s\S]*addEventListener\('keydown'[\s\S]*toggleWorkspaceDrawer\(\);/.test(html), 'workspace drawer tab should remain keyboard-toggleable');
assert(html.includes('id="impactDrawerTab"') && html.includes('id="sourceDrawerTab"'), 'impact/source side drawer tabs missing');
assert(html.includes('function refreshOpenSideDrawers'), 'side drawers should only refresh when open for performance');
assert(html.includes('top: calc(34% + 84px);') && html.includes('top: calc(34% + 168px);'), 'left drawer tabs should be vertically aligned as a stack');
assert(html.includes("setSideDrawer('impact'") && html.includes("setSideDrawer('source'"), 'impact/source drawer sync handlers missing');

console.log(`Smoke tests passed: ${app.evidence.length} cards, ${app.allTypes.length} categories, ${app.workspacePanels.length} workspace panels.`);

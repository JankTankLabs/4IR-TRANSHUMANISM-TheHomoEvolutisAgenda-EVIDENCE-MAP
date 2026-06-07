#!/usr/bin/env node
const fs = require('fs');
const vm = require('vm');
const assert = require('assert');

const html = fs.readFileSync('index.html', 'utf8');
const script = html.match(/<script>([\s\S]*)<\/script>\s*<\/body>/)?.[1];
assert(script, 'inline application script missing');
const filterButtons = [];
const renderedCardNodes = new Map();
const renderedCategorySectionNodes = new Map();
const FILTER_BUTTON_WIDTH = 120;
const FILTER_BUTTON_GAP = 10;
const FILTER_BUTTON_COLUMNS = 4;

class ClassList {
  constructor() { this.values = new Set(); }
  add(...names) { names.forEach(name => this.values.add(name)); }
  remove(...names) { names.forEach(name => this.values.delete(name)); }
  contains(name) { return this.values.has(name); }
  toggle(name, force) {
    if (force === undefined) force = !this.values.has(name);
    force ? this.values.add(name) : this.values.delete(name);
    return force;
  }
}

class ElementMock {
  constructor(id) {
    this.id = id;
    this.dataset = {};
    this.style = {};
    this.classList = new ClassList();
    this.children = [];
    this.parentElement = null;
    this.listeners = {};
    this.attributes = {};
    this._html = '';
    this.value = '';
    this.rect = { left: 0, right: 0, top: 0, bottom: 0, width: 0, height: 0 };
  }
  set innerHTML(value) {
    this._html = String(value);
    if (this.id === 'filterBar') {
      filterButtons.length = 0;
      // renderFilterBar() emits class before data-filter; keep this lightweight parser aligned with that stable output shape.
      [...this._html.matchAll(/class="([^"]*filter-btn[^"]*)"[^>]*data-filter="([^"]+)"/g)].forEach((match, index) => {
        const button = new ElementMock(`filter-${match[2]}`);
        button.dataset.filter = match[2];
        button.parentElement = this;
        match[1].split(/\s+/).filter(Boolean).forEach(name => button.classList.add(name));
        const row = Math.floor(index / FILTER_BUTTON_COLUMNS);
        const column = index % FILTER_BUTTON_COLUMNS;
        const left = column * (FILTER_BUTTON_WIDTH + FILTER_BUTTON_GAP);
        const top = row * 46;
        button.rect = { left, right: left + FILTER_BUTTON_WIDTH, top, bottom: top + 36, width: FILTER_BUTTON_WIDTH, height: 36 };
        filterButtons.push(button);
      });
      this.children = [...filterButtons];
    }
    if (this.id === 'cardsGrid') {
      renderedCardNodes.clear();
      renderedCategorySectionNodes.clear();
      [...this._html.matchAll(/data-category-section="([^"]+)"/g)].forEach((match, index) => {
        const section = new ElementMock(`category-${match[1]}`);
        section.dataset.categorySection = match[1];
        section.parentElement = this;
        section.rect = { left: 0, right: 800, top: 260 + (index * 280), bottom: 500 + (index * 280), width: 800, height: 240 };
        renderedCategorySectionNodes.set(match[1], section);
      });
      [...this._html.matchAll(/<article class="evidence-card[^"]*" id="([^"]+)" data-id="([^"]+)"/g)].forEach((match, index) => {
        const card = new ElementMock(match[1]);
        card.dataset.id = match[2];
        card.parentElement = this;
        card.rect = { left: 0, right: 800, top: 360 + (index * 140), bottom: 480 + (index * 140), width: 800, height: 120 };
        renderedCardNodes.set(match[2], card);
      });
    }
  }
  get innerHTML() { return this._html; }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  addEventListener(name, handler) { (this.listeners[name] ||= []).push(handler); }
  removeEventListener(name, handler) {
    this.listeners[name] = (this.listeners[name] || []).filter(listener => listener !== handler);
  }
  querySelectorAll(selector) {
    if (this.id === 'filterBar' && selector === '[data-filter]') return [...filterButtons];
    return [];
  }
  querySelector() { return null; }
  appendChild(node) { node.parentElement = this; this.children.push(node); }
  insertBefore(node, reference) {
    node.parentElement = this;
    this.children = this.children.filter(item => item !== node);
    const index = this.children.indexOf(reference);
    this.children.splice(index < 0 ? this.children.length : index, 0, node);
  }
  contains(target) { return target === this || this.children.includes(target); }
  closest(selector) {
    if (selector === '[data-filter]') return this.dataset.filter ? this : null;
    if (selector === '[data-drawer-view]') return this.dataset.drawerView ? this : null;
    return null;
  }
  getBoundingClientRect() { return this.rect; }
  setPointerCapture() {}
  releasePointerCapture() {}
  remove() {}
}

const ids = [...html.matchAll(/id="([^"]+)"/g)].map(match => match[1]);
const elements = new Map(ids.map(id => [id, new ElementMock(id)]));
const drawerTabs = ['workspaceDrawerTab', 'impactDrawerTab', 'sourceDrawerTab'];
['index', 'impact', 'source'].forEach((view, index) => { elements.get(drawerTabs[index]).dataset.drawerView = view; });
const cardsGrid = elements.get('cardsGrid');
const pageParent = new ElementMock('pageParent');
pageParent.appendChild(cardsGrid);

const documentMock = {
  body: new ElementMock('body'),
  getElementById(id) { return elements.get(id) || null; },
  querySelectorAll(selector) {
    if (selector === '[data-drawer-view]') return drawerTabs.map(id => elements.get(id));
    if (selector === '.filter-btn' || selector === '#filterBar [data-filter]') return [...filterButtons];
    return [];
  },
  querySelector(selector) {
    const cardMatch = selector.match(/^\[data-id="([^"]+)"\]$/);
    if (cardMatch) return renderedCardNodes.get(cardMatch[1]) || null;
    const categoryMatch = selector.match(/^\[data-category-section="([^"]+)"\]$/);
    if (categoryMatch) return renderedCategorySectionNodes.get(categoryMatch[1]) || null;
    return null;
  },
  createElement() { return new ElementMock('created'); },
  addEventListener(name, handler) { this.body.addEventListener(name, handler); },
  removeEventListener(name, handler) { this.body.removeEventListener(name, handler); }
};
const localStore = new Map();
const scrollCalls = [];
const context = {
  console, URL, Blob,
  document: documentMock,
  window: {
    pageYOffset: 0,
    scrollTo(options) {
      const top = typeof options === 'number' ? options : Number(options?.top || 0);
      this.pageYOffset = top;
      scrollCalls.push(top);
    }
  },
  navigator: { clipboard: { writeText() { return Promise.resolve(); } } },
  localStorage: {
    getItem(key) { return localStore.get(key) || null; },
    setItem(key, value) { localStore.set(key, String(value)); },
    removeItem(key) { localStore.delete(key); }
  },
  setTimeout, clearTimeout,
  requestAnimationFrame(callback) { return callback(); },
  cancelAnimationFrame() {}
};
context.globalThis = context;
vm.runInNewContext(`${script}
globalThis.__APP_UI_TEST__ = {
  evidence,
  dominoTrajectories,
  get activeFilters() { return activeFilters; },
  get categoryOrder() { return categoryOrder; },
  get expandedCardIds() { return [...expandedCards]; },
  get discoveryTerm() { return discoveryTerm; },
  get discoveryGuidance() { return discoveryGuidance; },
  get discoveryMatchIds() { return discoveryMatches.map(item => item.id); },
  get discoveryNavigationTarget() { return discoveryNavigationTarget; },
  get discoveryNavigationLabel() { return discoveryNavigationLabel; },
  get discoveryLeadCardId() { return discoveryLeadCardId; },
  openCardById,
  openLeadCardWithContext,
  clearDiscoveryState,
  getTermMatches
};`, context, { filename: 'index.inline.js' });
const app = context.__APP_UI_TEST__;

function click(id) {
  const target = elements.get(id);
  assert(target.listeners.click?.length, `${id} click listener missing`);
  target.listeners.click[0]({ preventDefault() {}, stopPropagation() {}, target });
}

function triggerKey(handler, key) {
  let prevented = false;
  handler({
    key,
    target: documentMock.body,
    get defaultPrevented() { return prevented; },
    preventDefault() { prevented = true; },
    stopPropagation() {}
  });
  return prevented;
}

function categorySectionOrder() {
  return [...elements.get('cardsGrid').innerHTML.matchAll(/data-category-section="([^"]+)"/g)].map(match => match[1]);
}

click('sourceDrawerTab');
assert(elements.get('sideDrawerPanel').innerHTML.includes('Source provenance snapshot'), 'Sources tab rendered wrong content');
assert.strictEqual(elements.get('sideDrawer').dataset.drawerActive, 'source');

click('workspaceDrawerTab');
assert(elements.get('sideDrawerPanel').innerHTML.includes('Workspace Index'), 'Index tab rendered wrong content');
assert(!elements.get('sideDrawerPanel').innerHTML.includes('Source provenance snapshot'), 'Index retained Sources content');
assert.strictEqual(elements.get('sideDrawer').dataset.drawerActive, 'index');

click('impactDrawerTab');
assert(elements.get('sideDrawerPanel').innerHTML.includes('Impact Matrix'), 'Impact tab rendered wrong content');
assert.strictEqual(elements.get('sideDrawer').dataset.drawerActive, 'impact');

const outsideClick = documentMock.body.listeners.click[0];
assert(outsideClick, 'outside-click drawer handler missing');
outsideClick({ target: new ElementMock('outside') });
assert.strictEqual(elements.get('sideDrawer').dataset.drawerActive, 'impact', 'Impact drawer should remain open on outside click');
click('workspaceDrawerTab');
outsideClick({ target: new ElementMock('outside') });
assert.strictEqual(elements.get('sideDrawer').dataset.drawerActive, '', 'Index drawer should close on outside click');

click('sourceDrawerTab');
const escapeHandler = documentMock.body.listeners.keydown[0];
assert(escapeHandler, 'Escape drawer handler missing');
escapeHandler({ key: 'Escape' });
assert.strictEqual(elements.get('sideDrawer').dataset.drawerActive, '', 'Escape should close any drawer view');
assert.strictEqual((html.match(/id="sideDrawer"/g) || []).length, 1, 'multiple drawer shells found');
assert(elements.get('navTopBtn').listeners.click?.length, 'Top button click listener missing');
assert(elements.get('navBackBtn').listeners.click?.length, 'Back button click listener missing');
assert(elements.get('navForwardBtn').listeners.click?.length, 'Forward button click listener missing');
assert(elements.get('navUndoBtn').listeners.click?.length, 'Undo button click listener missing');
assert(elements.get('navRedoBtn').listeners.click?.length, 'Redo button click listener missing');

const filterBar = elements.get('filterBar');
assert(filterBar.listeners.click?.length, 'filterBar click listener missing');
assert(filterBar.listeners.pointerdown?.length, 'filterBar pointerdown listener missing');
const filterButton = filterButtons.find(button => button.dataset.filter === 'patents');
filterBar.listeners.click[0]({ preventDefault() {}, stopPropagation() {}, target: filterButton });
assert(!app.activeFilters.includes('patents'), 'normal category click should still toggle the filter off');
filterBar.listeners.click[0]({ preventDefault() {}, stopPropagation() {}, target: filterButton });
assert(app.activeFilters.includes('patents'), 'second normal category click should toggle the filter back on');

const legislationButton = filterButtons.find(button => button.dataset.filter === 'legislation');
filterBar.listeners.pointerdown[0]({
  target: filterButton,
  pointerId: 7,
  pointerType: 'mouse',
  button: 0,
  clientX: filterButton.rect.left + 8,
  clientY: filterButton.rect.top + 10
});
const pointerMove = documentMock.body.listeners.pointermove[0];
const pointerUp = documentMock.body.listeners.pointerup[0];
assert(pointerMove && pointerUp, 'category drag listeners should attach to document during pointer drag');
pointerMove({
  pointerId: 7,
  clientX: legislationButton.rect.right - 6,
  clientY: legislationButton.rect.top + 10,
  cancelable: true,
  preventDefault() {}
});
pointerUp({ pointerId: 7 });
assert.deepStrictEqual(Array.from(app.categoryOrder).slice(0, 2), ['legislation', 'patents'], 'dragging a category chip should reorder the persisted category sequence');
assert.deepStrictEqual(categorySectionOrder().slice(0, 2), ['legislation', 'patents'], 'card section DOM order should follow the reordered chip order');
filterBar.listeners.click[0]({ preventDefault() {}, stopPropagation() {}, target: filterButtons.find(button => button.dataset.filter === 'patents') });
assert(app.activeFilters.includes('patents'), 'post-drag click suppression should prevent the drag gesture from toggling filters');
assert.strictEqual(localStore.get('evidenceCategoryOrder'), JSON.stringify(Array.from(app.categoryOrder)), 'drag reorder should persist the new chip order');

context.window.pageYOffset = 240;
click('navTopBtn');
assert.strictEqual(context.window.pageYOffset, 0, 'Top should scroll to the top');
triggerKey(escapeHandler, 'ArrowLeft');
assert.strictEqual(context.window.pageYOffset, 240, 'ArrowLeft should navigate back to prior scroll/view state');
triggerKey(escapeHandler, 'ArrowRight');
assert.strictEqual(context.window.pageYOffset, 0, 'ArrowRight should navigate forward again');
triggerKey(escapeHandler, 'a');
assert.strictEqual(context.window.pageYOffset, 240, 'A should also trigger back navigation');
click('navTopBtn');
triggerKey(escapeHandler, 'd');
assert.strictEqual(context.window.pageYOffset, 0, 'Forward history should clear after taking a new path');

filterBar.listeners.click[0]({ preventDefault() {}, stopPropagation() {}, target: filterButtons.find(button => button.dataset.filter === 'patents') });
assert(!app.activeFilters.includes('patents'), 'Filter toggle should remove category before undo');
triggerKey(escapeHandler, 'u');
assert(app.activeFilters.includes('patents'), 'U should undo the most recent reversible UI action');
triggerKey(escapeHandler, 'r');
assert(!app.activeFilters.includes('patents'), 'R should redo the most recently undone UI action');

const multiMatchDomino = app.dominoTrajectories
  .map(trajectory => ({
    trajectory,
    step: trajectory.dominoes.find(entry => app.getTermMatches(entry.terms).length > 1)
  }))
  .find(entry => entry.step);
assert(multiMatchDomino, 'expected at least one domino step with multiple linked cards');

const dominoMatches = app.getTermMatches(multiMatchDomino.step.terms);
assert(dominoMatches.length > 1, 'domino lead-card test needs multiple linked cards');
const dominoLabel = `${multiMatchDomino.trajectory.title} · ${multiMatchDomino.step.label}`;

context.window.pageYOffset = 512;
const openedFromDomino = app.openLeadCardWithContext(dominoLabel, dominoMatches, 'Domino step cards opened without changing the global search.', {
  navigationTarget: 'dominoPanel',
  navigationLabel: 'trajectory domino map'
});
assert.deepStrictEqual(Array.from(openedFromDomino), [dominoMatches[0].id], 'domino flow should open the lead card through the shared helper');
assert.deepStrictEqual(Array.from(app.expandedCardIds), [dominoMatches[0].id], 'domino flow should replace expansion with the focused lead card');
assert.strictEqual(app.discoveryLeadCardId, dominoMatches[0].id, 'domino flow should remember the lead card for quick reopening');
assert.strictEqual(app.discoveryTerm, dominoLabel, 'domino flow should keep the related discovery drawer context');
assert.strictEqual(app.discoveryGuidance, 'Domino step cards opened without changing the global search.');
assert.strictEqual(app.discoveryNavigationTarget, 'dominoPanel', 'domino discovery should expose a jump-back target');
assert.strictEqual(app.discoveryNavigationLabel, 'trajectory domino map');
assert.strictEqual(app.discoveryMatchIds.length, dominoMatches.length, 'domino discovery should retain the full matching set');
assert(context.window.pageYOffset > 0, 'domino flow should scroll the opened lead card into view');

const repeatedDominoScrollCount = scrollCalls.length;
app.openLeadCardWithContext(dominoLabel, dominoMatches, 'Domino step cards opened without changing the global search.', {
  navigationTarget: 'dominoPanel',
  navigationLabel: 'trajectory domino map'
});
assert.deepStrictEqual(Array.from(app.expandedCardIds), [dominoMatches[0].id], 'repeated domino clicks should not create duplicate expanded-card state');
assert(scrollCalls.length > repeatedDominoScrollCount, 'repeated domino clicks should still refocus the lead card');

const alreadyOpenScrollCount = scrollCalls.length;
assert.deepStrictEqual(Array.from(app.openCardById(dominoMatches[0].id, { replaceExpanded: true, interactionId: 'deep-diver' })), [dominoMatches[0].id], 'direct openCardById should continue returning the opened card id');
assert.deepStrictEqual(Array.from(app.expandedCardIds), [dominoMatches[0].id], 'opening an already-open card should keep a single focused card');
assert(scrollCalls.length > alreadyOpenScrollCount, 'opening an already-open card should still scroll to it');

const expandedBeforeInvalidOpen = [...app.expandedCardIds];
assert.deepStrictEqual(Array.from(app.openCardById('missing-card-id', { replaceExpanded: true })), [], 'missing card ids should no-op safely');
assert.deepStrictEqual(Array.from(app.expandedCardIds), expandedBeforeInvalidOpen, 'invalid card ids should not disturb the current open-card state');

const emptyDominoScrollCount = scrollCalls.length;
assert.deepStrictEqual(Array.from(app.openLeadCardWithContext('Ghost domino step', [], 'No directly linked evidence cards are currently available for this step.', {
  navigationTarget: 'timelinePanel',
  navigationLabel: 'big trajectory timeline'
})), [], 'domino steps without linked cards should not force-open a larger card');
assert.strictEqual(app.discoveryTerm, 'Ghost domino step', 'empty domino steps should still provide discovery context');
assert.strictEqual(app.discoveryMatchIds.length, 0, 'empty domino steps should not fabricate discovery matches');
assert.strictEqual(app.discoveryLeadCardId, '', 'empty domino steps should not retain a stale lead-card target');
assert.strictEqual(app.discoveryNavigationTarget, 'timelinePanel', 'empty domino steps should preserve the requested jump target');
assert.strictEqual(app.discoveryNavigationLabel, 'big trajectory timeline');
assert(scrollCalls.length > emptyDominoScrollCount, 'empty domino steps should still navigate to the discovery panel instead of failing silently');

app.clearDiscoveryState();
context.window.pageYOffset = 640;
app.openLeadCardWithContext(dominoLabel, dominoMatches, 'Domino step cards opened without changing the global search.', {
  navigationTarget: 'dominoPanel',
  navigationLabel: 'trajectory domino map'
});
triggerKey(escapeHandler, 'ArrowLeft');
assert.strictEqual(context.window.pageYOffset, 640, 'back navigation should restore pre-domino scroll position');
triggerKey(escapeHandler, 'ArrowRight');
assert.strictEqual(app.discoveryLeadCardId, dominoMatches[0].id, 'forward navigation should restore the domino lead-card context');
assert.strictEqual(app.discoveryNavigationTarget, 'dominoPanel', 'forward navigation should preserve discovery jump targets');

assert(scrollCalls.length >= 3, 'navigation controls should invoke lightweight scroll operations');

console.log('UI behavior tests passed: isolated drawer views, deterministic content, drag-safe filter reordering, close policies, navigation controls, and domino lead-card focus flows.');

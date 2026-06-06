#!/usr/bin/env node
const fs = require('fs');
const vm = require('vm');
const assert = require('assert');

const html = fs.readFileSync('index.html', 'utf8');
const script = html.match(/<script>([\s\S]*)<\/script>\s*<\/body>/)?.[1];
assert(script, 'inline application script missing');

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
  }
  set innerHTML(value) { this._html = String(value); }
  get innerHTML() { return this._html; }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  addEventListener(name, handler) { (this.listeners[name] ||= []).push(handler); }
  querySelectorAll() { return []; }
  querySelector() { return null; }
  appendChild(node) { node.parentElement = this; this.children.push(node); }
  insertBefore(node, reference) {
    node.parentElement = this;
    this.children = this.children.filter(item => item !== node);
    const index = this.children.indexOf(reference);
    this.children.splice(index < 0 ? this.children.length : index, 0, node);
  }
  contains(target) { return target === this || this.children.includes(target); }
  closest() { return null; }
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
  querySelectorAll(selector) { return selector === '[data-drawer-view]' ? drawerTabs.map(id => elements.get(id)) : []; },
  querySelector() { return null; },
  createElement() { return new ElementMock('created'); },
  addEventListener(name, handler) { this.body.addEventListener(name, handler); }
};
const localStore = new Map();
const context = {
  console, URL, Blob,
  document: documentMock,
  window: { pageYOffset: 0, scrollTo() {} },
  navigator: { clipboard: { writeText() { return Promise.resolve(); } } },
  localStorage: {
    getItem(key) { return localStore.get(key) || null; },
    setItem(key, value) { localStore.set(key, String(value)); },
    removeItem(key) { localStore.delete(key); }
  },
  setTimeout, clearTimeout,
  requestAnimationFrame(callback) { return callback(); }
};
context.globalThis = context;
vm.runInNewContext(script, context, { filename: 'index.inline.js' });

function click(id) {
  const target = elements.get(id);
  assert(target.listeners.click?.length, `${id} click listener missing`);
  target.listeners.click[0]({ preventDefault() {}, stopPropagation() {}, target });
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

console.log('UI behavior tests passed: isolated drawer views, deterministic content, and close policies.');

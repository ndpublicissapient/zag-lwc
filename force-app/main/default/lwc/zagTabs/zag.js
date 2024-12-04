/* eslint-disable | Bundled from ZagJS | tabs | Version 0.77.1 */
// src/create-anatomy.ts
var createAnatomy = (name, parts = []) => ({
  parts: (...values) => {
    if (isEmpty(parts)) {
      return createAnatomy(name, values);
    }
    throw new Error("createAnatomy().parts(...) should only be called once. Did you mean to use .extendWith(...) ?");
  },
  extendWith: (...values) => createAnatomy(name, [...parts, ...values]),
  rename: (newName) => createAnatomy(newName, parts),
  keys: () => parts,
  build: () => [...new Set(parts)].reduce(
    (prev, part) => Object.assign(prev, {
      [part]: {
        selector: [
          `&[data-scope="${toKebabCase(name)}"][data-part="${toKebabCase(part)}"]`,
          `& [data-scope="${toKebabCase(name)}"][data-part="${toKebabCase(part)}"]`
        ].join(", "),
        attrs: { "data-scope": toKebabCase(name), "data-part": toKebabCase(part) }
      }
    }),
    {}
  )
});
var toKebabCase = (value) => value.replace(/([A-Z])([A-Z])/g, "$1-$2").replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[\s_]+/g, "-").toLowerCase();
var isEmpty = (v) => v.length === 0;

// src/attrs.ts
var dataAttr = (guard) => guard ? "" : void 0;

// src/is.ts
var ELEMENT_NODE = 1;
var DOCUMENT_NODE = 9;
var isObject$2 = (v) => typeof v === "object" && v !== null;
var isHTMLElement = (el) => isObject$2(el) && el.nodeType === ELEMENT_NODE && typeof el.nodeName === "string";
var isDocument = (el) => isObject$2(el) && el.nodeType === DOCUMENT_NODE;
var isWindow = (el) => isObject$2(el) && el === el.window;

// src/contains.ts
function contains(parent, child) {
  if (!parent || !child) return false;
  if (!isHTMLElement(parent) || !isHTMLElement(child)) return false;
  return parent === child || parent.contains(child);
}

// src/env.ts
function getDocument(el) {
  if (isDocument(el)) return el;
  if (isWindow(el)) return el.document;
  return el?.ownerDocument ?? document;
}
function getActiveElement(rootNode) {
  let activeElement = rootNode.activeElement;
  while (activeElement?.shadowRoot) {
    const el = activeElement.shadowRoot.activeElement;
    if (el === activeElement) break;
    else activeElement = el;
  }
  return activeElement;
}

// src/platform.ts
var isDom = () => typeof document !== "undefined";
function getPlatform() {
  const agent = navigator.userAgentData;
  return agent?.platform ?? navigator.platform;
}
var pt = (v) => isDom() && v.test(getPlatform());
var ua = (v) => isDom() && v.test(navigator.userAgent);
var vn = (v) => isDom() && v.test(navigator.vendor);
var isSafari = () => isApple() && vn(/apple/i);
var isFirefox = () => ua(/firefox\//i);
var isApple = () => pt(/mac|iphone|ipad|ipod/i);
function getComposedPath(event) {
  return event.composedPath?.() ?? event.nativeEvent?.composedPath?.();
}
function getEventTarget(event) {
  const composedPath = getComposedPath(event);
  return composedPath?.[0] ?? event.target;
}
var isSelfTarget = (event) => {
  return contains(event.currentTarget, getEventTarget(event));
};
function isComposingEvent(event) {
  return event.nativeEvent?.isComposing ?? event.isComposing;
}

// src/get-by-id.ts
var defaultItemToId = (v) => v.id;
function itemById(v, id, itemToId = defaultItemToId) {
  return v.find((item) => itemToId(item) === id);
}
function indexOfId(v, id, itemToId = defaultItemToId) {
  const item = itemById(v, id, itemToId);
  return item ? v.indexOf(item) : -1;
}
function nextById(v, id, loop = true) {
  let idx = indexOfId(v, id);
  idx = loop ? (idx + 1) % v.length : Math.min(idx + 1, v.length - 1);
  return v[idx];
}
function prevById(v, id, loop = true) {
  let idx = indexOfId(v, id);
  if (idx === -1) return loop ? v[v.length - 1] : null;
  idx = loop ? (idx - 1 + v.length) % v.length : Math.max(0, idx - 1);
  return v[idx];
}

// src/tabbable.ts
var isHTMLElement2 = (element) => typeof element === "object" && element !== null && element.nodeType === 1;
var isFrame = (element) => isHTMLElement2(element) && element.tagName === "IFRAME";
function isVisible(el) {
  if (!isHTMLElement2(el)) return false;
  return el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length > 0;
}
var focusableSelector = "input:not([type='hidden']):not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], button:not([disabled]), [tabindex], iframe, object, embed, area[href], audio[controls], video[controls], [contenteditable]:not([contenteditable='false']), details > summary:first-of-type";
var getFocusables = (container, includeContainer = false) => {
  if (!container) return [];
  const elements = Array.from(container.querySelectorAll(focusableSelector));
  const include = includeContainer == true || includeContainer == "if-empty" && elements.length === 0;
  if (include && isHTMLElement2(container) && isFocusable(container)) {
    elements.unshift(container);
  }
  const focusableElements = elements.filter(isFocusable);
  focusableElements.forEach((element, i) => {
    if (isFrame(element) && element.contentDocument) {
      const frameBody = element.contentDocument.body;
      focusableElements.splice(i, 1, ...getFocusables(frameBody));
    }
  });
  return focusableElements;
};
function isFocusable(element) {
  if (!element || element.closest("[inert]")) return false;
  return element.matches(focusableSelector) && isVisible(element);
}

// src/raf.ts
function nextTick(fn) {
  const set2 = /* @__PURE__ */ new Set();
  function raf2(fn2) {
    const id = globalThis.requestAnimationFrame(fn2);
    set2.add(() => globalThis.cancelAnimationFrame(id));
  }
  raf2(() => raf2(fn));
  return function cleanup() {
    set2.forEach((fn2) => fn2());
  };
}
function raf(fn) {
  const id = globalThis.requestAnimationFrame(fn);
  return () => {
    globalThis.cancelAnimationFrame(id);
  };
}

// src/query.ts
function queryAll(root, selector) {
  return Array.from(root?.querySelectorAll(selector) ?? []);
}

// src/scope.ts
function createScope(methods) {
  const dom = {
    getRootNode: (ctx) => ctx.getRootNode?.() ?? document,
    getDoc: (ctx) => getDocument(dom.getRootNode(ctx)),
    getWin: (ctx) => dom.getDoc(ctx).defaultView ?? window,
    getActiveElement: (ctx) => getActiveElement(dom.getRootNode(ctx)),
    isActiveElement: (ctx, elem) => elem === dom.getActiveElement(ctx),
    getById: (ctx, id) => dom.getRootNode(ctx).getElementById(id),
    setValue: (elem, value) => {
      if (elem == null || value == null) return;
      const valueAsString = value.toString();
      if (elem.value === valueAsString) return;
      elem.value = value.toString();
    }
  };
  return { ...dom, ...methods };
}

// src/queue-before-event.ts
function queueBeforeEvent(element, type, cb) {
  const createTimer = (callback) => {
    const timerId = requestAnimationFrame(callback);
    return () => cancelAnimationFrame(timerId);
  };
  const cancelTimer = createTimer(() => {
    element.removeEventListener(type, callSync, true);
    cb();
  });
  const callSync = () => {
    cancelTimer();
    cb();
  };
  element.addEventListener(type, callSync, { once: true, capture: true });
  return cancelTimer;
}

// src/click-link.ts
function isLinkElement(element) {
  return element?.matches("a[href]") ?? false;
}
function clickIfLink(element) {
  if (!isLinkElement(element)) return;
  const click = () => element.click();
  if (isFirefox()) {
    queueBeforeEvent(element, "keyup", click);
  } else {
    queueMicrotask(click);
  }
}

// src/get-event-key.ts
var keyMap = {
  Up: "ArrowUp",
  Down: "ArrowDown",
  Esc: "Escape",
  " ": "Space",
  ",": "Comma",
  Left: "ArrowLeft",
  Right: "ArrowRight"
};
var rtlKeyMap = {
  ArrowLeft: "ArrowRight",
  ArrowRight: "ArrowLeft"
};
function getEventKey(event, options = {}) {
  const { dir = "ltr", orientation = "horizontal" } = options;
  let { key } = event;
  key = keyMap[key] ?? key;
  const isRtl = dir === "rtl" && orientation === "horizontal";
  if (isRtl && key in rtlKeyMap) {
    key = rtlKeyMap[key];
  }
  return key;
}

// src/array.ts
var first = (v) => v[0];
var last = (v) => v[v.length - 1];
function clear(v) {
  while (v.length > 0) v.pop();
  return v;
}

// src/equal.ts
var isArrayLike = (value) => value?.constructor.name === "Array";
var isArrayEqual = (a, b) => {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (!isEqual(a[i], b[i])) return false;
  }
  return true;
};
var isEqual = (a, b) => {
  if (Object.is(a, b)) return true;
  if (a == null && b != null || a != null && b == null) return false;
  if (typeof a?.isEqual === "function" && typeof b?.isEqual === "function") {
    return a.isEqual(b);
  }
  if (typeof a === "function" && typeof b === "function") {
    return a.toString() === b.toString();
  }
  if (isArrayLike(a) && isArrayLike(b)) {
    return isArrayEqual(Array.from(a), Array.from(b));
  }
  if (!(typeof a === "object") || !(typeof b === "object")) return false;
  const keys = Object.keys(b ?? /* @__PURE__ */ Object.create(null));
  const length = keys.length;
  for (let i = 0; i < length; i++) {
    const hasKey = Reflect.has(a, keys[i]);
    if (!hasKey) return false;
  }
  for (let i = 0; i < length; i++) {
    const key = keys[i];
    if (!isEqual(a[key], b[key])) return false;
  }
  return true;
};

// src/functions.ts
var runIfFn = (v, ...a) => {
  const res = typeof v === "function" ? v(...a) : v;
  return res ?? void 0;
};
var cast = (v) => v;
var noop = () => {
};
var uuid = /* @__PURE__ */ (() => {
  let id = 0;
  return () => {
    id++;
    return id.toString(36);
  };
})();
var isArray = (v) => Array.isArray(v);
var isObjectLike = (v) => v != null && typeof v === "object";
var isObject$1 = (v) => isObjectLike(v) && !isArray(v);
var isNumber = (v) => typeof v === "number" && !Number.isNaN(v);
var isString = (v) => typeof v === "string";
var isFunction = (v) => typeof v === "function";
var hasProp = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
var baseGetTag = (v) => Object.prototype.toString.call(v);
var fnToString = Function.prototype.toString;
var objectCtorString = fnToString.call(Object);
var isPlainObject = (v) => {
  if (!isObjectLike(v) || baseGetTag(v) != "[object Object]") return false;
  const proto = Object.getPrototypeOf(v);
  if (proto === null) return true;
  const Ctor = hasProp(proto, "constructor") && proto.constructor;
  return typeof Ctor == "function" && Ctor instanceof Ctor && fnToString.call(Ctor) == objectCtorString;
};

// src/split-props.ts
function splitProps$1(props, keys) {
  const rest = {};
  const result = {};
  const keySet = new Set(keys);
  for (const key in props) {
    if (keySet.has(key)) {
      result[key] = props[key];
    } else {
      rest[key] = props[key];
    }
  }
  return [result, rest];
}
var createSplitProps = (keys) => {
  return function split(props) {
    return splitProps$1(props, keys);
  };
};

// src/object.ts
function compact(obj) {
  if (!isPlainObject2(obj) || obj === void 0) {
    return obj;
  }
  const keys = Reflect.ownKeys(obj).filter((key) => typeof key === "string");
  const filtered = {};
  for (const key of keys) {
    const value = obj[key];
    if (value !== void 0) {
      filtered[key] = compact(value);
    }
  }
  return filtered;
}
var isPlainObject2 = (value) => {
  return value && typeof value === "object" && value.constructor === Object;
};

// src/warning.ts
function warn(...a) {
  const m = a.length === 1 ? a[0] : a[1];
  const c = a.length === 2 ? a[0] : true;
  if (c && "production" !== "production") {
    console.warn(m);
  }
}
function invariant(...a) {
  const m = a.length === 1 ? a[0] : a[1];
  const c = a.length === 2 ? a[0] : true;
  if (c && "production" !== "production") {
    throw new Error(m);
  }
}

/* eslint @typescript-eslint/no-explicit-any: off */
// symbols
const GET_ORIGINAL_SYMBOL = Symbol();
// get object prototype
const getProto = Object.getPrototypeOf;
const objectsToTrack = new WeakMap();
// check if obj is a plain object or an array
const isObjectToTrack = (obj) => obj &&
    (objectsToTrack.has(obj)
        ? objectsToTrack.get(obj)
        : getProto(obj) === Object.prototype || getProto(obj) === Array.prototype);
/**
 * Unwrap proxy to get the original object.
 *
 * Used to retrieve the original object used to create the proxy instance with `createProxy`.
 *
 * @param {Proxy<object>} obj -  The proxy wrapper of the originial object.
 * @returns {object | null} - Return either the unwrapped object if exists.
 *
 * @example
 * import { createProxy, getUntracked } from 'proxy-compare';
 *
 * const original = { a: "1", c: "2", d: { e: "3" } };
 * const affected = new WeakMap();
 *
 * const proxy = createProxy(original, affected);
 * const originalFromProxy = getUntracked(proxy)
 *
 * Object.is(original, originalFromProxy) // true
 * isChanged(original, originalFromProxy, affected) // false
 */
const getUntracked = (obj) => {
    if (isObjectToTrack(obj)) {
        return obj[GET_ORIGINAL_SYMBOL] || null;
    }
    return null;
};
/**
 * Mark object to be tracked.
 *
 * This function marks an object that will be passed into `createProxy`
 * as marked to track or not. By default only Array and Object are marked to track,
 * so this is useful for example to mark a class instance to track or to mark a object
 * to be untracked when creating your proxy.
 *
 * @param obj - Object to mark as tracked or not.
 * @param mark - Boolean indicating whether you want to track this object or not.
 * @returns - No return.
 *
 * @example
 * import { createProxy, markToTrack, isChanged } from 'proxy-compare';
 *
 * const nested = { e: "3" }
 *
 * markToTrack(nested, false)
 *
 * const original = { a: "1", c: "2", d: nested };
 * const affected = new WeakMap();
 *
 * const proxy = createProxy(original, affected);
 *
 * proxy.d.e
 *
 * isChanged(original, { d: { e: "3" } }, affected) // true
 */
const markToTrack = (obj, mark = true) => {
    objectsToTrack.set(obj, mark);
};

// src/global.ts
function getGlobal() {
  if (typeof globalThis !== "undefined") return globalThis;
  if (typeof self !== "undefined") return self;
  if (typeof window !== "undefined") return window;
  if (typeof global !== "undefined") return global;
}
function makeGlobal(key, value) {
  const g = getGlobal();
  if (!g) return value();
  g[key] || (g[key] = value());
  return g[key];
}
var isObject = (x) => typeof x === "object" && x !== null;
var proxyStateMap = makeGlobal("__zag__proxyStateMap", () => /* @__PURE__ */ new WeakMap());
var refSet = makeGlobal("__zag__refSet", () => /* @__PURE__ */ new WeakSet());
var isReactElement = (x) => typeof x === "object" && x !== null && "$$typeof" in x;
var isVueElement = (x) => typeof x === "object" && x !== null && "__v_isVNode" in x;
var isDOMElement = (x) => typeof x === "object" && x !== null && "nodeType" in x && typeof x.nodeName === "string";
var isElement = (x) => isReactElement(x) || isVueElement(x) || isDOMElement(x);
var buildProxyFunction = (objectIs = Object.is, newProxy = (target, handler) => new Proxy(target, handler), canProxy = (x) => isObject(x) && !refSet.has(x) && (Array.isArray(x) || !(Symbol.iterator in x)) && !isElement(x) && !(x instanceof WeakMap) && !(x instanceof WeakSet) && !(x instanceof Error) && !(x instanceof Number) && !(x instanceof Date) && !(x instanceof String) && !(x instanceof RegExp) && !(x instanceof ArrayBuffer), defaultHandlePromise = (promise) => {
  switch (promise.status) {
    case "fulfilled":
      return promise.value;
    case "rejected":
      throw promise.reason;
    default:
      throw promise;
  }
}, snapCache = /* @__PURE__ */ new WeakMap(), createSnapshot = (target, version, handlePromise = defaultHandlePromise) => {
  const cache = snapCache.get(target);
  if (cache?.[0] === version) {
    return cache[1];
  }
  const snap = Array.isArray(target) ? [] : Object.create(Object.getPrototypeOf(target));
  markToTrack(snap, true);
  snapCache.set(target, [version, snap]);
  Reflect.ownKeys(target).forEach((key) => {
    const value = Reflect.get(target, key);
    if (refSet.has(value)) {
      markToTrack(value, false);
      snap[key] = value;
    } else if (value instanceof Promise) {
      Object.defineProperty(snap, key, {
        get() {
          return handlePromise(value);
        }
      });
    } else if (proxyStateMap.has(value)) {
      snap[key] = snapshot(value, handlePromise);
    } else {
      snap[key] = value;
    }
  });
  return Object.freeze(snap);
}, proxyCache = /* @__PURE__ */ new WeakMap(), versionHolder = [1, 1], proxyFunction2 = (initialObject) => {
  if (!isObject(initialObject)) {
    throw new Error("object required");
  }
  const found = proxyCache.get(initialObject);
  if (found) {
    return found;
  }
  let version = versionHolder[0];
  const listeners = /* @__PURE__ */ new Set();
  const notifyUpdate = (op, nextVersion = ++versionHolder[0]) => {
    if (version !== nextVersion) {
      version = nextVersion;
      listeners.forEach((listener) => listener(op, nextVersion));
    }
  };
  let checkVersion = versionHolder[1];
  const ensureVersion = (nextCheckVersion = ++versionHolder[1]) => {
    if (checkVersion !== nextCheckVersion && !listeners.size) {
      checkVersion = nextCheckVersion;
      propProxyStates.forEach(([propProxyState]) => {
        const propVersion = propProxyState[1](nextCheckVersion);
        if (propVersion > version) {
          version = propVersion;
        }
      });
    }
    return version;
  };
  const createPropListener = (prop) => (op, nextVersion) => {
    const newOp = [...op];
    newOp[1] = [prop, ...newOp[1]];
    notifyUpdate(newOp, nextVersion);
  };
  const propProxyStates = /* @__PURE__ */ new Map();
  const addPropListener = (prop, propProxyState) => {
    if (listeners.size) {
      const remove = propProxyState[3](createPropListener(prop));
      propProxyStates.set(prop, [propProxyState, remove]);
    } else {
      propProxyStates.set(prop, [propProxyState]);
    }
  };
  const removePropListener = (prop) => {
    const entry = propProxyStates.get(prop);
    if (entry) {
      propProxyStates.delete(prop);
      entry[1]?.();
    }
  };
  const addListener = (listener) => {
    listeners.add(listener);
    if (listeners.size === 1) {
      propProxyStates.forEach(([propProxyState, prevRemove], prop) => {
        const remove = propProxyState[3](createPropListener(prop));
        propProxyStates.set(prop, [propProxyState, remove]);
      });
    }
    const removeListener = () => {
      listeners.delete(listener);
      if (listeners.size === 0) {
        propProxyStates.forEach(([propProxyState, remove], prop) => {
          if (remove) {
            remove();
            propProxyStates.set(prop, [propProxyState]);
          }
        });
      }
    };
    return removeListener;
  };
  const baseObject = Array.isArray(initialObject) ? [] : Object.create(Object.getPrototypeOf(initialObject));
  const handler = {
    deleteProperty(target, prop) {
      const prevValue = Reflect.get(target, prop);
      removePropListener(prop);
      const deleted = Reflect.deleteProperty(target, prop);
      if (deleted) {
        notifyUpdate(["delete", [prop], prevValue]);
      }
      return deleted;
    },
    set(target, prop, value, receiver) {
      const hasPrevValue = Reflect.has(target, prop);
      const prevValue = Reflect.get(target, prop, receiver);
      if (hasPrevValue && (objectIs(prevValue, value) || proxyCache.has(value) && objectIs(prevValue, proxyCache.get(value)))) {
        return true;
      }
      removePropListener(prop);
      if (isObject(value)) {
        value = getUntracked(value) || value;
      }
      let nextValue = value;
      if (Object.getOwnPropertyDescriptor(target, prop)?.set) ; else if (value instanceof Promise) {
        value.then((v) => {
          Object.assign(value, { status: "fulfilled", value: v });
          notifyUpdate(["resolve", [prop], v]);
        }).catch((e) => {
          Object.assign(value, { status: "rejected", reason: e });
          notifyUpdate(["reject", [prop], e]);
        });
      } else {
        if (!proxyStateMap.has(value) && canProxy(value)) {
          nextValue = proxy(value);
        }
        const childProxyState = !refSet.has(nextValue) && proxyStateMap.get(nextValue);
        if (childProxyState) {
          addPropListener(prop, childProxyState);
        }
      }
      Reflect.set(target, prop, nextValue, receiver);
      notifyUpdate(["set", [prop], value, prevValue]);
      return true;
    }
  };
  const proxyObject = newProxy(baseObject, handler);
  proxyCache.set(initialObject, proxyObject);
  const proxyState = [baseObject, ensureVersion, createSnapshot, addListener];
  proxyStateMap.set(proxyObject, proxyState);
  Reflect.ownKeys(initialObject).forEach((key) => {
    const desc = Object.getOwnPropertyDescriptor(initialObject, key);
    if (desc.get || desc.set) {
      Object.defineProperty(baseObject, key, desc);
    } else {
      proxyObject[key] = initialObject[key];
    }
  });
  return proxyObject;
}) => [
  // public functions
  proxyFunction2,
  // shared state
  proxyStateMap,
  refSet,
  // internal things
  objectIs,
  newProxy,
  canProxy,
  defaultHandlePromise,
  snapCache,
  createSnapshot,
  proxyCache,
  versionHolder
];
var [proxyFunction] = buildProxyFunction();
function proxy(initialObject = {}) {
  return proxyFunction(initialObject);
}
function subscribe(proxyObject, callback, notifyInSync) {
  const proxyState = proxyStateMap.get(proxyObject);
  let promise;
  const ops = [];
  const addListener = proxyState[3];
  let isListenerActive = false;
  const listener = (op) => {
    ops.push(op);
    if (notifyInSync) {
      callback(ops.splice(0));
      return;
    }
    if (!promise) {
      promise = Promise.resolve().then(() => {
        promise = void 0;
        if (isListenerActive) {
          callback(ops.splice(0));
        }
      });
    }
  };
  const removeListener = addListener(listener);
  isListenerActive = true;
  return () => {
    isListenerActive = false;
    removeListener();
  };
}
function snapshot(proxyObject, handlePromise) {
  const proxyState = proxyStateMap.get(proxyObject);
  const [target, ensureVersion, createSnapshot] = proxyState;
  return createSnapshot(target, ensureVersion(), handlePromise);
}
function ref(obj) {
  refSet.add(obj);
  return obj;
}

// src/proxy-computed.ts
function proxyWithComputed(initialObject, computedFns) {
  const keys = Object.keys(computedFns);
  keys.forEach((key) => {
    if (Object.getOwnPropertyDescriptor(initialObject, key)) {
      throw new Error("object property already defined");
    }
    const computedFn = computedFns[key];
    const { get, set } = typeof computedFn === "function" ? { get: computedFn } : computedFn;
    const desc = {};
    desc.get = () => get(snapshot(proxyObject));
    if (set) {
      desc.set = (newValue) => set(proxyObject, newValue);
    }
    Object.defineProperty(initialObject, key, desc);
  });
  const proxyObject = proxy(initialObject);
  return proxyObject;
}

function set$1(obj, key, val) {
	if (typeof val.value === 'object') val.value = klona(val.value);
	if (!val.enumerable || val.get || val.set || !val.configurable || !val.writable || key === '__proto__') {
		Object.defineProperty(obj, key, val);
	} else obj[key] = val.value;
}

function klona(x) {
	if (typeof x !== 'object') return x;

	var i=0, k, list, tmp, str=Object.prototype.toString.call(x);

	if (str === '[object Object]') {
		tmp = Object.create(x.__proto__ || null);
	} else if (str === '[object Array]') {
		tmp = Array(x.length);
	} else if (str === '[object Set]') {
		tmp = new Set;
		x.forEach(function (val) {
			tmp.add(klona(val));
		});
	} else if (str === '[object Map]') {
		tmp = new Map;
		x.forEach(function (val, key) {
			tmp.set(klona(key), klona(val));
		});
	} else if (str === '[object Date]') {
		tmp = new Date(+x);
	} else if (str === '[object RegExp]') {
		tmp = new RegExp(x.source, x.flags);
	} else if (str === '[object DataView]') {
		tmp = new x.constructor( klona(x.buffer) );
	} else if (str === '[object ArrayBuffer]') {
		tmp = x.slice(0);
	} else if (str.slice(-6) === 'Array]') {
		// ArrayBuffer.isView(x)
		// ~> `new` bcuz `Buffer.slice` => ref
		tmp = new x.constructor(x);
	}

	if (tmp) {
		for (list=Object.getOwnPropertySymbols(x); i < list.length; i++) {
			set$1(tmp, list[i], Object.getOwnPropertyDescriptor(x, list[i]));
		}

		for (i=0, list=Object.getOwnPropertyNames(x); i < list.length; i++) {
			if (Object.hasOwnProperty.call(tmp, k=list[i]) && tmp[k] === x[k]) continue;
			set$1(tmp, k, Object.getOwnPropertyDescriptor(x, k));
		}
	}

	return tmp || x;
}

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
function deepMerge(source, ...objects) {
  for (const obj of objects) {
    const target = compact(obj);
    for (const key in target) {
      if (isPlainObject(obj[key])) {
        if (!source[key]) {
          source[key] = {};
        }
        deepMerge(source[key], obj[key]);
      } else {
        source[key] = obj[key];
      }
    }
  }
  return source;
}
function structuredClone(v) {
  return klona(v);
}
function toEvent(event) {
  const obj = isString(event) ? { type: event } : event;
  return obj;
}
function toArray(value) {
  if (!value) return [];
  return isArray(value) ? value.slice() : [value];
}
function isGuardHelper(value) {
  return isObject$1(value) && value.predicate != null;
}

// src/guard-utils.ts
var Truthy = () => true;
function exec(guardMap, ctx, event, meta) {
  return (guard) => {
    if (isString(guard)) {
      return !!guardMap[guard]?.(ctx, event, meta);
    }
    if (isFunction(guard)) {
      return guard(ctx, event, meta);
    }
    return guard.predicate(guardMap)(ctx, event, meta);
  };
}
function or(...conditions) {
  return {
    predicate: (guardMap) => (ctx, event, meta) => conditions.map(exec(guardMap, ctx, event, meta)).some(Boolean)
  };
}
function and(...conditions) {
  return {
    predicate: (guardMap) => (ctx, event, meta) => conditions.map(exec(guardMap, ctx, event, meta)).every(Boolean)
  };
}
function not$1(condition) {
  return {
    predicate: (guardMap) => (ctx, event, meta) => {
      return !exec(guardMap, ctx, event, meta)(condition);
    }
  };
}
function stateIn(...values) {
  return (_ctx, _evt, meta) => meta.state.matches(...values);
}
var guards = { or, and, not: not$1, stateIn };
function determineGuardFn(guard, guardMap) {
  guard = guard ?? Truthy;
  return (context, event, meta) => {
    if (isString(guard)) {
      const value = guardMap[guard];
      return isFunction(value) ? value(context, event, meta) : value;
    }
    if (isGuardHelper(guard)) {
      return guard.predicate(guardMap)(context, event, meta);
    }
    return guard?.(context, event, meta);
  };
}
function determineActionsFn(values, guardMap) {
  return (context, event, meta) => {
    if (isGuardHelper(values)) {
      return values.predicate(guardMap)(context, event, meta);
    }
    return values;
  };
}
function createProxy(config) {
  const computedContext = config.computed ?? cast({});
  const initialContext = config.context ?? cast({});
  const initialTags = config.initial ? config.states?.[config.initial]?.tags : [];
  const state = proxy({
    value: config.initial ?? "",
    previousValue: "",
    event: cast({}),
    previousEvent: cast({}),
    context: proxyWithComputed(initialContext, computedContext),
    done: false,
    tags: initialTags ?? [],
    hasTag(tag) {
      return this.tags.includes(tag);
    },
    matches(...value) {
      return value.includes(this.value);
    },
    can(event) {
      return cast(this).nextEvents.includes(event);
    },
    get nextEvents() {
      const stateEvents = config.states?.[this.value]?.["on"] ?? {};
      const globalEvents = config?.on ?? {};
      return Object.keys({ ...stateEvents, ...globalEvents });
    },
    get changed() {
      if (this.event.value === "machine.init" /* Init */ || !this.previousValue) return false;
      return this.value !== this.previousValue;
    }
  });
  return cast(state);
}
function determineDelayFn(delay, delaysMap) {
  return (context, event) => {
    if (isNumber(delay)) return delay;
    if (isFunction(delay)) {
      return delay(context, event);
    }
    if (isString(delay)) {
      const value = Number.parseFloat(delay);
      if (!Number.isNaN(value)) {
        return value;
      }
      if (delaysMap) {
        const valueOrFn = delaysMap?.[delay];
        invariant(
          valueOrFn == null,
          `[@zag-js/core > determine-delay] Cannot determine delay for \`${delay}\`. It doesn't exist in \`options.delays\``
        );
        return isFunction(valueOrFn) ? valueOrFn(context, event) : valueOrFn;
      }
    }
  };
}
function toTarget(target) {
  return isString(target) ? { target } : target;
}
function determineTransitionFn(transitions, guardMap) {
  return (context, event, meta) => {
    return toArray(transitions).map(toTarget).find((transition) => {
      const determineGuard = determineGuardFn(transition.guard, guardMap);
      const guard = determineGuard(context, event, meta);
      return guard ?? transition.target ?? transition.actions;
    });
  };
}

// src/machine.ts
var Machine = class {
  // Let's get started!
  constructor(config, options) {
    __publicField(this, "status", "Not Started" /* NotStarted */);
    __publicField(this, "state");
    __publicField(this, "initialState");
    __publicField(this, "initialContext");
    __publicField(this, "id");
    __publicField(this, "type", "machine" /* Machine */);
    // Cleanup function map (per state)
    __publicField(this, "activityEvents", /* @__PURE__ */ new Map());
    __publicField(this, "delayedEvents", /* @__PURE__ */ new Map());
    // state update listeners the user can opt-in for
    __publicField(this, "stateListeners", /* @__PURE__ */ new Set());
    __publicField(this, "doneListeners", /* @__PURE__ */ new Set());
    __publicField(this, "contextWatchers", /* @__PURE__ */ new Set());
    // Cleanup functions (for `subscribe`)
    __publicField(this, "removeStateListener", noop);
    // For Parent <==> Spawned Actor relationship
    __publicField(this, "parent");
    __publicField(this, "children", /* @__PURE__ */ new Map());
    // A map of guard, action, delay implementations
    __publicField(this, "guardMap");
    __publicField(this, "actionMap");
    __publicField(this, "delayMap");
    __publicField(this, "activityMap");
    __publicField(this, "sync");
    __publicField(this, "options");
    __publicField(this, "config");
    __publicField(this, "_created", () => {
      const event = toEvent("machine.created" /* Created */);
      this.executeActions(this.config?.created, event);
    });
    // Starts the interpreted machine.
    __publicField(this, "start", (init) => {
      this.state.value = "";
      this.state.tags = [];
      if (this.status === "Running" /* Running */) {
        return this;
      }
      this.status = "Running" /* Running */;
      this.removeStateListener = subscribe(
        this.state,
        () => {
          this.stateListeners.forEach((listener) => {
            listener(this.stateSnapshot);
          });
        },
        this.sync
      );
      this.setupContextWatchers();
      this.executeActivities(toEvent("machine.start" /* Start */), toArray(this.config.activities), "machine.start" /* Start */);
      this.executeActions(this.config.entry, toEvent("machine.start" /* Start */));
      const event = toEvent("machine.init" /* Init */);
      const target = isObject$1(init) ? init.value : init;
      const context = isObject$1(init) ? init.context : void 0;
      if (context) {
        this.setContext(context);
      }
      const transition = {
        target: target ?? this.config.initial
      };
      const next = this.getNextStateInfo(transition, event);
      this.initialState = next;
      this.performStateChangeEffects(this.state.value, next, event);
      return this;
    });
    __publicField(this, "setupContextWatchers", () => {
      const { watch } = this.config;
      if (!watch) return;
      let prev = snapshot(this.state.context);
      const cleanup = subscribe(this.state.context, () => {
        const next = snapshot(this.state.context);
        for (const [key, fn] of Object.entries(watch)) {
          const isEqual = this.options.compareFns?.[key] ?? Object.is;
          if (isEqual(prev[key], next[key])) continue;
          this.executeActions(fn, this.state.event);
        }
        prev = next;
      });
      this.contextWatchers.add(cleanup);
    });
    // Stops the interpreted machine
    __publicField(this, "stop", () => {
      if (this.status === "Stopped" /* Stopped */) return;
      this.performExitEffects(this.state.value, toEvent("machine.stop" /* Stop */));
      this.executeActions(this.config.exit, toEvent("machine.stop" /* Stop */));
      this.setState("");
      this.setEvent("machine.stop" /* Stop */);
      this.stopStateListeners();
      this.stopChildren();
      this.stopActivities();
      this.stopDelayedEvents();
      this.stopContextWatchers();
      this.status = "Stopped" /* Stopped */;
      return this;
    });
    __publicField(this, "stopStateListeners", () => {
      this.removeStateListener();
      this.stateListeners.clear();
    });
    __publicField(this, "stopContextWatchers", () => {
      this.contextWatchers.forEach((fn) => fn());
      this.contextWatchers.clear();
    });
    __publicField(this, "stopDelayedEvents", () => {
      this.delayedEvents.forEach((state) => {
        state.forEach((stop) => stop());
      });
      this.delayedEvents.clear();
    });
    // Cleanup running activities (e.g `setInterval`, invoked callbacks, promises)
    __publicField(this, "stopActivities", (state) => {
      if (state) {
        this.activityEvents.get(state)?.forEach((stop) => stop());
        this.activityEvents.get(state)?.clear();
        this.activityEvents.delete(state);
      } else {
        this.activityEvents.forEach((state2) => {
          state2.forEach((stop) => stop());
          state2.clear();
        });
        this.activityEvents.clear();
      }
    });
    /**
     * Function to send event to spawned child machine or actor
     */
    __publicField(this, "sendChild", (evt, to) => {
      const event = toEvent(evt);
      const id = runIfFn(to, this.contextSnapshot);
      const child = this.children.get(id);
      if (!child) {
        invariant(`[@zag-js/core] Cannot send '${event.type}' event to unknown child`);
      }
      child.send(event);
    });
    /**
     * Function to stop a running child machine or actor
     */
    __publicField(this, "stopChild", (id) => {
      if (!this.children.has(id)) {
        invariant(`[@zag-js/core > stop-child] Cannot stop unknown child ${id}`);
      }
      this.children.get(id).stop();
      this.children.delete(id);
    });
    __publicField(this, "removeChild", (id) => {
      this.children.delete(id);
    });
    // Stop and delete spawned actors
    __publicField(this, "stopChildren", () => {
      this.children.forEach((child) => child.stop());
      this.children.clear();
    });
    __publicField(this, "setParent", (parent) => {
      this.parent = parent;
    });
    __publicField(this, "spawn", (src, id) => {
      const actor = runIfFn(src);
      if (id) actor.id = id;
      actor.type = "machine.actor" /* Actor */;
      actor.setParent(this);
      this.children.set(actor.id, cast(actor));
      actor.onDone(() => {
        this.removeChild(actor.id);
      }).start();
      return cast(ref(actor));
    });
    __publicField(this, "stopActivity", (key) => {
      if (!this.state.value) return;
      const cleanups = this.activityEvents.get(this.state.value);
      cleanups?.get(key)?.();
      cleanups?.delete(key);
    });
    __publicField(this, "addActivityCleanup", (state, key, cleanup) => {
      if (!state) return;
      if (!this.activityEvents.has(state)) {
        this.activityEvents.set(state, /* @__PURE__ */ new Map([[key, cleanup]]));
      } else {
        this.activityEvents.get(state)?.set(key, cleanup);
      }
    });
    __publicField(this, "setState", (target) => {
      this.state.previousValue = this.state.value;
      this.state.value = target;
      const stateNode = this.getStateNode(target);
      if (target == null) {
        clear(this.state.tags);
      } else {
        this.state.tags = toArray(stateNode?.tags);
      }
    });
    /**
     * To used within side effects for React or Vue to update context
     */
    __publicField(this, "setContext", (context) => {
      if (!context) return;
      deepMerge(this.state.context, compact(context));
    });
    __publicField(this, "setOptions", (options) => {
      const opts = compact(options);
      this.actionMap = { ...this.actionMap, ...opts.actions };
      this.delayMap = { ...this.delayMap, ...opts.delays };
      this.activityMap = { ...this.activityMap, ...opts.activities };
      this.guardMap = { ...this.guardMap, ...opts.guards };
    });
    __publicField(this, "getStateNode", (state) => {
      if (!state) return;
      return this.config.states?.[state];
    });
    __publicField(this, "getNextStateInfo", (transitions, event) => {
      const transition = this.determineTransition(transitions, event);
      const isTargetless = !transition?.target;
      const target = transition?.target ?? this.state.value;
      const changed = this.state.value !== target;
      const stateNode = this.getStateNode(target);
      const reenter = !isTargetless && !changed && !transition?.internal;
      const info = {
        reenter,
        transition,
        stateNode,
        target,
        changed
      };
      this.log("NextState:", `[${event.type}]`, this.state.value, "---->", info.target);
      return info;
    });
    __publicField(this, "getAfterActions", (transition, delay) => {
      let id;
      const current = this.state.value;
      return {
        entry: () => {
          id = globalThis.setTimeout(() => {
            const next = this.getNextStateInfo(transition, this.state.event);
            this.performStateChangeEffects(current, next, this.state.event);
          }, delay);
        },
        exit: () => {
          globalThis.clearTimeout(id);
        }
      };
    });
    /**
     * All `after` events leverage `setTimeout` and `clearTimeout`,
     * we invoke the `clearTimeout` on exit and `setTimeout` on entry.
     *
     * To achieve this, we split the `after` defintion into `entry` and `exit`
     *  functions and append them to the state's `entry` and `exit` actions
     */
    __publicField(this, "getDelayedEventActions", (state) => {
      const stateNode = this.getStateNode(state);
      const event = this.state.event;
      if (!stateNode || !stateNode.after) return;
      const entries = [];
      const exits = [];
      if (isArray(stateNode.after)) {
        const transition = this.determineTransition(stateNode.after, event);
        if (!transition) return;
        if (!hasProp(transition, "delay")) {
          throw new Error(`[@zag-js/core > after] Delay is required for after transition: ${JSON.stringify(transition)}`);
        }
        const determineDelay = determineDelayFn(transition.delay, this.delayMap);
        const __delay = determineDelay(this.contextSnapshot, event);
        const actions = this.getAfterActions(transition, __delay);
        entries.push(actions.entry);
        exits.push(actions.exit);
        return { entries, exits };
      }
      if (isObject$1(stateNode.after)) {
        for (const delay in stateNode.after) {
          const transition = stateNode.after[delay];
          const determineDelay = determineDelayFn(delay, this.delayMap);
          const __delay = determineDelay(this.contextSnapshot, event);
          const actions = this.getAfterActions(transition, __delay);
          entries.push(actions.entry);
          exits.push(actions.exit);
        }
      }
      return { entries, exits };
    });
    /**
     * Function to executes defined actions. It can accept actions as string
     * (referencing `options.actions`) or actual functions.
     */
    __publicField(this, "executeActions", (actions, event) => {
      const pickedActions = determineActionsFn(actions, this.guardMap)(this.contextSnapshot, event, this.guardMeta);
      for (const action of toArray(pickedActions)) {
        const fn = isString(action) ? this.actionMap?.[action] : action;
        warn(
          isString(action) && !fn,
          `[@zag-js/core > execute-actions] No implementation found for action: \`${action}\``
        );
        fn?.(this.state.context, event, this.meta);
      }
    });
    /**
     * Function to execute running activities and registers
     * their cleanup function internally (to be called later on when we exit the state)
     */
    __publicField(this, "executeActivities", (event, activities, state) => {
      for (const activity of activities) {
        const fn = isString(activity) ? this.activityMap?.[activity] : activity;
        if (!fn) {
          warn(`[@zag-js/core > execute-activity] No implementation found for activity: \`${activity}\``);
          continue;
        }
        const cleanup = fn(this.state.context, event, this.meta);
        if (cleanup) {
          const key = isString(activity) ? activity : activity.name || uuid();
          this.addActivityCleanup(state ?? this.state.value, key, cleanup);
        }
      }
    });
    /**
     * Normalizes the `every` definition to transition. `every` can be:
     * - An array of possible actions to run (we need to pick the first match based on guard)
     * - An object of intervals and actions
     */
    __publicField(this, "createEveryActivities", (every, callbackfn) => {
      if (!every) return;
      if (isArray(every)) {
        const picked = toArray(every).find((transition) => {
          const delayOrFn = transition.delay;
          const determineDelay2 = determineDelayFn(delayOrFn, this.delayMap);
          const delay2 = determineDelay2(this.contextSnapshot, this.state.event);
          const determineGuard = determineGuardFn(transition.guard, this.guardMap);
          const guard = determineGuard(this.contextSnapshot, this.state.event, this.guardMeta);
          return guard ?? delay2 != null;
        });
        if (!picked) return;
        const determineDelay = determineDelayFn(picked.delay, this.delayMap);
        const delay = determineDelay(this.contextSnapshot, this.state.event);
        const activity = () => {
          const id = globalThis.setInterval(() => {
            this.executeActions(picked.actions, this.state.event);
          }, delay);
          return () => {
            globalThis.clearInterval(id);
          };
        };
        callbackfn(activity);
      } else {
        for (const interval in every) {
          const actions = every?.[interval];
          const determineDelay = determineDelayFn(interval, this.delayMap);
          const delay = determineDelay(this.contextSnapshot, this.state.event);
          const activity = () => {
            const id = globalThis.setInterval(() => {
              this.executeActions(actions, this.state.event);
            }, delay);
            return () => {
              globalThis.clearInterval(id);
            };
          };
          callbackfn(activity);
        }
      }
    });
    __publicField(this, "setEvent", (event) => {
      this.state.previousEvent = this.state.event;
      this.state.event = ref(toEvent(event));
    });
    __publicField(this, "performExitEffects", (current, event) => {
      const currentState = this.state.value;
      if (currentState === "") return;
      const stateNode = current ? this.getStateNode(current) : void 0;
      this.stopActivities(currentState);
      const _exit = determineActionsFn(stateNode?.exit, this.guardMap)(this.contextSnapshot, event, this.guardMeta);
      const exitActions = toArray(_exit);
      const afterExitActions = this.delayedEvents.get(currentState);
      if (afterExitActions) {
        exitActions.push(...afterExitActions);
      }
      this.executeActions(exitActions, event);
      this.delayedEvents.delete(currentState);
    });
    __publicField(this, "performEntryEffects", (next, event) => {
      const stateNode = this.getStateNode(next);
      const activities = toArray(stateNode?.activities);
      this.createEveryActivities(stateNode?.every, (activity) => {
        activities.unshift(activity);
      });
      if (activities.length > 0) {
        this.executeActivities(event, activities);
      }
      const pickedActions = determineActionsFn(stateNode?.entry, this.guardMap)(
        this.contextSnapshot,
        event,
        this.guardMeta
      );
      const entryActions = toArray(pickedActions);
      const afterActions = this.getDelayedEventActions(next);
      if (stateNode?.after && afterActions) {
        this.delayedEvents.set(next, afterActions?.exits);
        entryActions.push(...afterActions.entries);
      }
      this.executeActions(entryActions, event);
      if (stateNode?.type === "final") {
        this.state.done = true;
        this.doneListeners.forEach((listener) => {
          listener(this.stateSnapshot);
        });
        this.stop();
      }
    });
    __publicField(this, "performTransitionEffects", (transitions, event) => {
      const transition = this.determineTransition(transitions, event);
      this.executeActions(transition?.actions, event);
    });
    /**
     * Performs all the requires side-effects or reactions when
     * we move from state A => state B.
     *
     * The Effect order:
     * Exit actions (current state) => Transition actions  => Go to state => Entry actions (next state)
     */
    __publicField(this, "performStateChangeEffects", (current, next, event) => {
      this.setEvent(event);
      const changed = next.changed || next.reenter;
      if (changed) {
        this.performExitEffects(current, event);
      }
      this.performTransitionEffects(next.transition, event);
      this.setState(next.target);
      if (changed) {
        this.performEntryEffects(next.target, event);
      }
    });
    __publicField(this, "determineTransition", (transition, event) => {
      const fn = determineTransitionFn(transition, this.guardMap);
      return fn?.(this.contextSnapshot, event, this.guardMeta);
    });
    /**
     * Function to send event to parent machine from spawned child
     */
    __publicField(this, "sendParent", (evt) => {
      if (!this.parent) {
        invariant("[@zag-js/core > send-parent] Cannot send event to an unknown parent");
      }
      const event = toEvent(evt);
      this.parent?.send(event);
    });
    __publicField(this, "log", (...args) => {
    });
    /**
     * Function to send an event to current machine
     */
    __publicField(this, "send", (evt) => {
      const event = toEvent(evt);
      this.transition(this.state.value, event);
    });
    __publicField(this, "transition", (state, evt) => {
      const stateNode = isString(state) ? this.getStateNode(state) : state?.stateNode;
      const event = toEvent(evt);
      if (!stateNode && !this.config.on) {
        const msg = this.status === "Stopped" /* Stopped */ ? "[@zag-js/core > transition] Cannot transition a stopped machine" : `[@zag-js/core > transition] State does not have a definition for \`state\`: ${state}, \`event\`: ${event.type}`;
        warn(msg);
        return;
      }
      const transitions = (
        // @ts-expect-error - Fix this
        stateNode?.on?.[event.type] ?? this.config.on?.[event.type]
      );
      const next = this.getNextStateInfo(transitions, event);
      this.performStateChangeEffects(this.state.value, next, event);
      return next.stateNode;
    });
    __publicField(this, "subscribe", (listener) => {
      this.stateListeners.add(listener);
      if (this.status === "Running" /* Running */) {
        listener(this.stateSnapshot);
      }
      return () => {
        this.stateListeners.delete(listener);
      };
    });
    __publicField(this, "onDone", (listener) => {
      this.doneListeners.add(listener);
      return this;
    });
    __publicField(this, "onTransition", (listener) => {
      this.stateListeners.add(listener);
      if (this.status === "Running" /* Running */) {
        listener(this.stateSnapshot);
      }
      return this;
    });
    this.config = structuredClone(config);
    this.options = structuredClone(options ?? {});
    this.id = this.config.id ?? `machine-${uuid()}`;
    this.guardMap = this.options?.guards ?? {};
    this.actionMap = this.options?.actions ?? {};
    this.delayMap = this.options?.delays ?? {};
    this.activityMap = this.options?.activities ?? {};
    this.sync = this.options?.sync ?? false;
    this.state = createProxy(this.config);
    this.initialContext = snapshot(this.state.context);
  }
  // immutable state value
  get stateSnapshot() {
    return cast(snapshot(this.state));
  }
  getState() {
    return this.stateSnapshot;
  }
  // immutable context value
  get contextSnapshot() {
    return this.stateSnapshot.context;
  }
  /**
   * A reference to the instance methods of the machine.
   * Useful when spawning child machines and managing the communication between them.
   */
  get self() {
    const self = this;
    return {
      id: this.id,
      send: this.send.bind(this),
      sendParent: this.sendParent.bind(this),
      sendChild: this.sendChild.bind(this),
      stop: this.stop.bind(this),
      stopChild: this.stopChild.bind(this),
      spawn: this.spawn.bind(this),
      stopActivity: this.stopActivity.bind(this),
      get state() {
        return self.stateSnapshot;
      },
      get initialContext() {
        return self.initialContext;
      },
      get initialState() {
        return self.initialState?.target ?? "";
      }
    };
  }
  get meta() {
    return {
      state: this.stateSnapshot,
      guards: this.guardMap,
      send: this.send.bind(this),
      self: this.self,
      initialContext: this.initialContext,
      initialState: this.initialState?.target ?? "",
      getState: () => this.stateSnapshot,
      getAction: (key) => this.actionMap[key],
      getGuard: (key) => this.guardMap[key]
    };
  }
  get guardMeta() {
    return {
      state: this.stateSnapshot
    };
  }
  get [Symbol.toStringTag]() {
    return "Machine";
  }
  getHydrationState() {
    const state = this.getState();
    return {
      value: state.value,
      tags: state.tags
    };
  }
};
var createMachine = (config, options) => new Machine(config, options);

// src/index.ts
var rafId;
var observedElements = /* @__PURE__ */ new Map();
var getRectFn = (el) => el.getBoundingClientRect();
function trackElementRect(el, options) {
  const { scope = "rect", getRect = getRectFn, onChange } = options;
  const loop = getLoopFn({ scope, getRect });
  const data = observedElements.get(el);
  if (!data) {
    observedElements.set(el, {
      rect: {},
      callbacks: [onChange]
    });
    if (observedElements.size === 1) {
      rafId = requestAnimationFrame(loop);
    }
  } else {
    data.callbacks.push(onChange);
    onChange(getRect(el));
  }
  return function unobserve() {
    const data2 = observedElements.get(el);
    if (!data2) return;
    const index = data2.callbacks.indexOf(onChange);
    if (index > -1) {
      data2.callbacks.splice(index, 1);
    }
    if (data2.callbacks.length === 0) {
      observedElements.delete(el);
      if (observedElements.size === 0) {
        cancelAnimationFrame(rafId);
      }
    }
  };
}
function getLoopFn(options) {
  const { scope, getRect } = options;
  const isEqual = getEqualityFn(scope);
  return function loop() {
    const changedRectsData = [];
    observedElements.forEach((data, element) => {
      const newRect = getRect(element);
      if (!isEqual(data.rect, newRect)) {
        data.rect = newRect;
        changedRectsData.push(data);
      }
    });
    changedRectsData.forEach((data) => {
      data.callbacks.forEach((callback) => callback(data.rect));
    });
    rafId = requestAnimationFrame(loop);
  };
}
var isEqualSize = (a, b) => a.width === b.width && a.height === b.height;
var isEqualPosition = (a, b) => a.top === b.top && a.left === b.left;
var isEqualRect = (a, b) => isEqualSize(a, b) && isEqualPosition(a, b);
function getEqualityFn(scope) {
  if (scope === "size") return isEqualSize;
  if (scope === "position") return isEqualPosition;
  return isEqualRect;
}

// src/prop-types.ts

// src/create-props.ts
var createProps = () => (props) => Array.from(new Set(props));

// src/tabs.anatomy.ts
var anatomy = createAnatomy("tabs").parts("root", "list", "trigger", "content", "indicator");
var parts = anatomy.build();
var dom = createScope({
  getRootId: (ctx) => ctx.ids?.root ?? `tabs:${ctx.id}`,
  getListId: (ctx) => ctx.ids?.list ?? `tabs:${ctx.id}:list`,
  getContentId: (ctx, id) => ctx.ids?.content ?? `tabs:${ctx.id}:content-${id}`,
  getTriggerId: (ctx, id) => ctx.ids?.trigger ?? `tabs:${ctx.id}:trigger-${id}`,
  getIndicatorId: (ctx) => ctx.ids?.indicator ?? `tabs:${ctx.id}:indicator`,
  getListEl: (ctx) => dom.getById(ctx, dom.getListId(ctx)),
  getContentEl: (ctx, id) => dom.getById(ctx, dom.getContentId(ctx, id)),
  getTriggerEl: (ctx, id) => dom.getById(ctx, dom.getTriggerId(ctx, id)),
  getIndicatorEl: (ctx) => dom.getById(ctx, dom.getIndicatorId(ctx)),
  getElements: (ctx) => {
    const ownerId = CSS.escape(dom.getListId(ctx));
    const selector = `[role=tab][data-ownedby='${ownerId}']:not([disabled])`;
    return queryAll(dom.getListEl(ctx), selector);
  },
  getFirstTriggerEl: (ctx) => first(dom.getElements(ctx)),
  getLastTriggerEl: (ctx) => last(dom.getElements(ctx)),
  getNextTriggerEl: (ctx, id) => nextById(dom.getElements(ctx), dom.getTriggerId(ctx, id), ctx.loopFocus),
  getPrevTriggerEl: (ctx, id) => prevById(dom.getElements(ctx), dom.getTriggerId(ctx, id), ctx.loopFocus),
  getSelectedContentEl: (ctx) => {
    if (!ctx.value) return;
    return dom.getContentEl(ctx, ctx.value);
  },
  getSelectedTriggerEl: (ctx) => {
    if (!ctx.value) return;
    return dom.getTriggerEl(ctx, ctx.value);
  },
  getOffsetRect: (el) => {
    return {
      left: el?.offsetLeft ?? 0,
      top: el?.offsetTop ?? 0,
      width: el?.offsetWidth ?? 0,
      height: el?.offsetHeight ?? 0
    };
  },
  getRectById: (ctx, id) => {
    const tab = itemById(dom.getElements(ctx), dom.getTriggerId(ctx, id));
    return dom.resolveRect(dom.getOffsetRect(tab));
  },
  resolveRect: (rect) => ({
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    left: `${rect.left}px`,
    top: `${rect.top}px`
  })
});

// src/tabs.connect.ts
function connect(state, send, normalize) {
  const translations = state.context.translations;
  const focused = state.matches("focused");
  const isVertical = state.context.orientation === "vertical";
  const isHorizontal = state.context.orientation === "horizontal";
  const composite = state.context.composite;
  const indicator = state.context.indicatorState;
  function getTriggerState(props2) {
    return {
      selected: state.context.value === props2.value,
      focused: state.context.focusedValue === props2.value,
      disabled: !!props2.disabled
    };
  }
  return {
    value: state.context.value,
    focusedValue: state.context.focusedValue,
    setValue(value) {
      send({ type: "SET_VALUE", value });
    },
    clearValue() {
      send({ type: "CLEAR_VALUE" });
    },
    setIndicatorRect(value) {
      const id = dom.getTriggerId(state.context, value);
      send({ type: "SET_INDICATOR_RECT", id });
    },
    syncTabIndex() {
      send("SYNC_TAB_INDEX");
    },
    selectNext(fromValue) {
      send({ type: "TAB_FOCUS", value: fromValue, src: "selectNext" });
      send({ type: "ARROW_NEXT", src: "selectNext" });
    },
    selectPrev(fromValue) {
      send({ type: "TAB_FOCUS", value: fromValue, src: "selectPrev" });
      send({ type: "ARROW_PREV", src: "selectPrev" });
    },
    focus() {
      dom.getSelectedTriggerEl(state.context)?.focus();
    },
    getRootProps() {
      return normalize.element({
        ...parts.root.attrs,
        id: dom.getRootId(state.context),
        "data-orientation": state.context.orientation,
        "data-focus": dataAttr(focused),
        dir: state.context.dir
      });
    },
    getListProps() {
      return normalize.element({
        ...parts.list.attrs,
        id: dom.getListId(state.context),
        role: "tablist",
        dir: state.context.dir,
        "data-focus": dataAttr(focused),
        "aria-orientation": state.context.orientation,
        "data-orientation": state.context.orientation,
        "aria-label": translations?.listLabel,
        onKeyDown(event) {
          if (event.defaultPrevented) return;
          if (!isSelfTarget(event)) return;
          if (isComposingEvent(event)) return;
          const keyMap = {
            ArrowDown() {
              if (isHorizontal) return;
              send({ type: "ARROW_NEXT", key: "ArrowDown" });
            },
            ArrowUp() {
              if (isHorizontal) return;
              send({ type: "ARROW_PREV", key: "ArrowUp" });
            },
            ArrowLeft() {
              if (isVertical) return;
              send({ type: "ARROW_PREV", key: "ArrowLeft" });
            },
            ArrowRight() {
              if (isVertical) return;
              send({ type: "ARROW_NEXT", key: "ArrowRight" });
            },
            Home() {
              send("HOME");
            },
            End() {
              send("END");
            },
            Enter() {
              send({ type: "ENTER" });
            }
          };
          let key = getEventKey(event, state.context);
          const exec = keyMap[key];
          if (exec) {
            event.preventDefault();
            exec(event);
          }
        }
      });
    },
    getTriggerState,
    getTriggerProps(props2) {
      const { value, disabled } = props2;
      const triggerState = getTriggerState(props2);
      return normalize.button({
        ...parts.trigger.attrs,
        role: "tab",
        type: "button",
        disabled,
        dir: state.context.dir,
        "data-orientation": state.context.orientation,
        "data-disabled": dataAttr(disabled),
        "aria-disabled": disabled,
        "data-value": value,
        "aria-selected": triggerState.selected,
        "data-selected": dataAttr(triggerState.selected),
        "data-focus": dataAttr(triggerState.focused),
        "aria-controls": triggerState.selected ? dom.getContentId(state.context, value) : void 0,
        "data-ownedby": dom.getListId(state.context),
        "data-ssr": dataAttr(state.context.ssr),
        id: dom.getTriggerId(state.context, value),
        tabIndex: triggerState.selected && composite ? 0 : -1,
        onFocus() {
          send({ type: "TAB_FOCUS", value });
        },
        onBlur(event) {
          const target = event.relatedTarget;
          if (target?.getAttribute("role") !== "tab") {
            send({ type: "TAB_BLUR" });
          }
        },
        onClick(event) {
          if (event.defaultPrevented) return;
          if (disabled) return;
          if (isSafari()) {
            event.currentTarget.focus();
          }
          send({ type: "TAB_CLICK", value });
        }
      });
    },
    getContentProps(props2) {
      const { value } = props2;
      const selected = state.context.value === value;
      return normalize.element({
        ...parts.content.attrs,
        dir: state.context.dir,
        id: dom.getContentId(state.context, value),
        tabIndex: composite ? 0 : -1,
        "aria-labelledby": dom.getTriggerId(state.context, value),
        role: "tabpanel",
        "data-ownedby": dom.getListId(state.context),
        "data-selected": dataAttr(selected),
        "data-orientation": state.context.orientation,
        hidden: !selected
      });
    },
    getIndicatorProps() {
      return normalize.element({
        id: dom.getIndicatorId(state.context),
        ...parts.indicator.attrs,
        dir: state.context.dir,
        "data-orientation": state.context.orientation,
        style: {
          "--transition-property": "left, right, top, bottom, width, height",
          "--left": indicator.rect?.left,
          "--top": indicator.rect?.top,
          "--width": indicator.rect?.width,
          "--height": indicator.rect?.height,
          position: "absolute",
          willChange: "var(--transition-property)",
          transitionProperty: "var(--transition-property)",
          transitionDuration: indicator.transition ? "var(--transition-duration, 150ms)" : "0ms",
          transitionTimingFunction: "var(--transition-timing-function)",
          [isHorizontal ? "left" : "top"]: isHorizontal ? "var(--left)" : "var(--top)"
        }
      });
    }
  };
}
var { not } = guards;
function machine(userContext) {
  const ctx = compact(userContext);
  return createMachine(
    {
      initial: "idle",
      context: {
        dir: "ltr",
        orientation: "horizontal",
        activationMode: "automatic",
        value: null,
        loopFocus: true,
        composite: true,
        ...ctx,
        focusedValue: ctx.value ?? null,
        ssr: true,
        indicatorState: {
          rendered: false,
          transition: false,
          rect: { left: "0px", top: "0px", width: "0px", height: "0px" }
        }
      },
      watch: {
        value: ["allowIndicatorTransition", "syncIndicatorRect", "syncTabIndex", "clickIfLink"],
        dir: ["syncIndicatorRect"],
        orientation: ["syncIndicatorRect"]
      },
      on: {
        SET_VALUE: {
          actions: "setValue"
        },
        CLEAR_VALUE: {
          actions: "clearValue"
        },
        SET_INDICATOR_RECT: {
          actions: "setIndicatorRect"
        },
        SYNC_TAB_INDEX: {
          actions: "syncTabIndex"
        }
      },
      created: ["syncFocusedValue"],
      entry: ["checkRenderedElements", "syncIndicatorRect", "syncTabIndex", "syncSsr"],
      exit: ["cleanupObserver"],
      states: {
        idle: {
          on: {
            TAB_FOCUS: {
              target: "focused",
              actions: "setFocusedValue"
            },
            TAB_CLICK: {
              target: "focused",
              actions: ["setFocusedValue", "setValue"]
            }
          }
        },
        focused: {
          on: {
            TAB_CLICK: {
              target: "focused",
              actions: ["setFocusedValue", "setValue"]
            },
            ARROW_PREV: [
              {
                guard: "selectOnFocus",
                actions: ["focusPrevTab", "selectFocusedTab"]
              },
              {
                actions: "focusPrevTab"
              }
            ],
            ARROW_NEXT: [
              {
                guard: "selectOnFocus",
                actions: ["focusNextTab", "selectFocusedTab"]
              },
              {
                actions: "focusNextTab"
              }
            ],
            HOME: [
              {
                guard: "selectOnFocus",
                actions: ["focusFirstTab", "selectFocusedTab"]
              },
              {
                actions: "focusFirstTab"
              }
            ],
            END: [
              {
                guard: "selectOnFocus",
                actions: ["focusLastTab", "selectFocusedTab"]
              },
              {
                actions: "focusLastTab"
              }
            ],
            ENTER: {
              guard: not("selectOnFocus"),
              actions: "selectFocusedTab"
            },
            TAB_FOCUS: {
              actions: ["setFocusedValue"]
            },
            TAB_BLUR: {
              target: "idle",
              actions: "clearFocusedValue"
            }
          }
        }
      }
    },
    {
      guards: {
        selectOnFocus: (ctx2) => ctx2.activationMode === "automatic"
      },
      actions: {
        syncFocusedValue(ctx2) {
          if (ctx2.value != null && ctx2.focusedValue == null) {
            ctx2.focusedValue = ctx2.value;
          }
        },
        selectFocusedTab(ctx2) {
          raf(() => {
            const nullable = ctx2.deselectable && ctx2.value === ctx2.focusedValue;
            const value = nullable ? null : ctx2.focusedValue;
            set.value(ctx2, value);
          });
        },
        setFocusedValue(ctx2, evt) {
          if (evt.value == null) return;
          set.focusedValue(ctx2, evt.value);
        },
        clearFocusedValue(ctx2) {
          set.focusedValue(ctx2, null);
        },
        setValue(ctx2, evt) {
          const nullable = ctx2.deselectable && ctx2.value === ctx2.focusedValue;
          const value = nullable ? null : evt.value;
          set.value(ctx2, value);
        },
        clearValue(ctx2) {
          set.value(ctx2, null);
        },
        focusFirstTab(ctx2) {
          raf(() => {
            dom.getFirstTriggerEl(ctx2)?.focus();
          });
        },
        focusLastTab(ctx2) {
          raf(() => {
            dom.getLastTriggerEl(ctx2)?.focus();
          });
        },
        focusNextTab(ctx2) {
          if (!ctx2.focusedValue) return;
          const triggerEl = dom.getNextTriggerEl(ctx2, ctx2.focusedValue);
          raf(() => {
            if (ctx2.composite) {
              triggerEl?.focus();
            } else if (triggerEl?.dataset.value != null) {
              set.focusedValue(ctx2, triggerEl.dataset.value);
            }
          });
        },
        focusPrevTab(ctx2) {
          if (!ctx2.focusedValue) return;
          const triggerEl = dom.getPrevTriggerEl(ctx2, ctx2.focusedValue);
          raf(() => {
            if (ctx2.composite) {
              triggerEl?.focus();
            } else if (triggerEl?.dataset.value != null) {
              set.focusedValue(ctx2, triggerEl.dataset.value);
            }
          });
        },
        checkRenderedElements(ctx2) {
          ctx2.indicatorState.rendered = !!dom.getIndicatorEl(ctx2);
        },
        syncTabIndex(ctx2) {
          raf(() => {
            const contentEl = dom.getSelectedContentEl(ctx2);
            if (!contentEl) return;
            const focusables = getFocusables(contentEl);
            if (focusables.length > 0) {
              contentEl.removeAttribute("tabindex");
            } else {
              contentEl.setAttribute("tabindex", "0");
            }
          });
        },
        cleanupObserver(ctx2) {
          ctx2.indicatorCleanup?.();
        },
        allowIndicatorTransition(ctx2) {
          ctx2.indicatorState.transition = true;
        },
        setIndicatorRect(ctx2, evt) {
          const value = evt.id ?? ctx2.value;
          if (!ctx2.indicatorState.rendered || !value) return;
          const triggerEl = dom.getTriggerEl(ctx2, value);
          if (!triggerEl) return;
          ctx2.indicatorState.rect = dom.getRectById(ctx2, value);
          nextTick(() => {
            ctx2.indicatorState.transition = false;
          });
        },
        syncSsr(ctx2) {
          ctx2.ssr = false;
        },
        syncIndicatorRect(ctx2) {
          ctx2.indicatorCleanup?.();
          const value = ctx2.value;
          if (!ctx2.indicatorState.rendered || !value) return;
          const triggerEl = dom.getSelectedTriggerEl(ctx2);
          if (!triggerEl) return;
          ctx2.indicatorCleanup = trackElementRect(triggerEl, {
            getRect(el) {
              return dom.getOffsetRect(el);
            },
            onChange(rect) {
              ctx2.indicatorState.rect = dom.resolveRect(rect);
              nextTick(() => {
                ctx2.indicatorState.transition = false;
              });
            }
          });
        },
        clickIfLink(ctx2) {
          clickIfLink(dom.getSelectedTriggerEl(ctx2));
        }
      }
    }
  );
}
var invoke = {
  change: (ctx) => {
    if (ctx.value == null) return;
    ctx.onValueChange?.({ value: ctx.value });
  },
  focusChange: (ctx) => {
    if (ctx.focusedValue == null) return;
    ctx.onFocusChange?.({ focusedValue: ctx.focusedValue });
  }
};
var set = {
  value: (ctx, value) => {
    if (isEqual(value, ctx.value)) return;
    ctx.value = value;
    invoke.change(ctx);
  },
  focusedValue: (ctx, value) => {
    if (isEqual(value, ctx.focusedValue)) return;
    ctx.focusedValue = value;
    invoke.focusChange(ctx);
  }
};
var props = createProps()([
  "activationMode",
  "composite",
  "dir",
  "getRootNode",
  "id",
  "ids",
  "loopFocus",
  "onFocusChange",
  "onValueChange",
  "orientation",
  "translations",
  "deselectable",
  "value"
]);
var splitProps = createSplitProps(props);
var triggerProps = createProps()(["disabled", "value"]);
var splitTriggerProps = createSplitProps(triggerProps);
var contentProps = createProps()(["value"]);
var splitContentProps = createSplitProps(contentProps);

var component = /*#__PURE__*/Object.freeze({
  __proto__: null,
  anatomy: anatomy,
  connect: connect,
  contentProps: contentProps,
  machine: machine,
  props: props,
  splitContentProps: splitContentProps,
  splitProps: splitProps,
  splitTriggerProps: splitTriggerProps,
  triggerProps: triggerProps
});

export { component as default };

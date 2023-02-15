var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// ../../node_modules/.pnpm/@trpc+server@10.10.0/node_modules/@trpc/server/dist/observable-464116ac.js
var require_observable_464116ac = __commonJS({
  "../../node_modules/.pnpm/@trpc+server@10.10.0/node_modules/@trpc/server/dist/observable-464116ac.js"(exports) {
    "use strict";
    function identity(x) {
      return x;
    }
    function pipeFromArray(fns) {
      if (fns.length === 0) {
        return identity;
      }
      if (fns.length === 1) {
        return fns[0];
      }
      return function piped(input) {
        return fns.reduce((prev, fn) => fn(prev), input);
      };
    }
    function isObservable(x) {
      return typeof x === "object" && x !== null && "subscribe" in x;
    }
    function observable(subscribe) {
      const self = {
        subscribe(observer) {
          let teardownRef = null;
          let isDone = false;
          let unsubscribed = false;
          let teardownImmediately = false;
          function unsubscribe() {
            if (teardownRef === null) {
              teardownImmediately = true;
              return;
            }
            if (unsubscribed) {
              return;
            }
            unsubscribed = true;
            if (typeof teardownRef === "function") {
              teardownRef();
            } else if (teardownRef) {
              teardownRef.unsubscribe();
            }
          }
          teardownRef = subscribe({
            next(value) {
              if (isDone) {
                return;
              }
              observer.next?.(value);
            },
            error(err) {
              if (isDone) {
                return;
              }
              isDone = true;
              observer.error?.(err);
              unsubscribe();
            },
            complete() {
              if (isDone) {
                return;
              }
              isDone = true;
              observer.complete?.();
              unsubscribe();
            }
          });
          if (teardownImmediately) {
            unsubscribe();
          }
          return {
            unsubscribe
          };
        },
        pipe(...operations) {
          return pipeFromArray(operations)(self);
        }
      };
      return self;
    }
    exports.isObservable = isObservable;
    exports.observable = observable;
  }
});

// ../../node_modules/.pnpm/@trpc+server@10.10.0/node_modules/@trpc/server/dist/observable/index.js
var require_observable = __commonJS({
  "../../node_modules/.pnpm/@trpc+server@10.10.0/node_modules/@trpc/server/dist/observable/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var observable = require_observable_464116ac();
    function share(_opts) {
      return (originalObserver) => {
        let refCount = 0;
        let subscription = null;
        const observers = [];
        function startIfNeeded() {
          if (subscription) {
            return;
          }
          subscription = originalObserver.subscribe({
            next(value) {
              for (const observer of observers) {
                observer.next?.(value);
              }
            },
            error(error) {
              for (const observer of observers) {
                observer.error?.(error);
              }
            },
            complete() {
              for (const observer of observers) {
                observer.complete?.();
              }
            }
          });
        }
        function resetIfNeeded() {
          if (refCount === 0 && subscription) {
            const _sub = subscription;
            subscription = null;
            _sub.unsubscribe();
          }
        }
        return {
          subscribe(observer) {
            refCount++;
            observers.push(observer);
            startIfNeeded();
            return {
              unsubscribe() {
                refCount--;
                resetIfNeeded();
                const index = observers.findIndex((v) => v === observer);
                if (index > -1) {
                  observers.splice(index, 1);
                }
              }
            };
          }
        };
      };
    }
    function map(project) {
      return (originalObserver) => {
        return {
          subscribe(observer) {
            let index = 0;
            const subscription = originalObserver.subscribe({
              next(value) {
                observer.next?.(project(value, index++));
              },
              error(error) {
                observer.error?.(error);
              },
              complete() {
                observer.complete?.();
              }
            });
            return subscription;
          }
        };
      };
    }
    function tap(observer) {
      return (originalObserver) => {
        return {
          subscribe(observer2) {
            return originalObserver.subscribe({
              next(v) {
                observer.next?.(v);
                observer2.next?.(v);
              },
              error(v) {
                observer.error?.(v);
                observer2.error?.(v);
              },
              complete() {
                observer.complete?.();
                observer2.complete?.();
              }
            });
          }
        };
      };
    }
    var ObservableAbortError = class extends Error {
      constructor(message) {
        super(message);
        this.name = "ObservableAbortError";
        Object.setPrototypeOf(this, ObservableAbortError.prototype);
      }
    };
    function observableToPromise(observable2) {
      let abort;
      const promise = new Promise((resolve, reject) => {
        let isDone = false;
        function onDone() {
          if (isDone) {
            return;
          }
          isDone = true;
          reject(new ObservableAbortError("This operation was aborted."));
          obs$.unsubscribe();
        }
        const obs$ = observable2.subscribe({
          next(data) {
            isDone = true;
            resolve(data);
            onDone();
          },
          error(data) {
            isDone = true;
            reject(data);
            onDone();
          },
          complete() {
            isDone = true;
            onDone();
          }
        });
        abort = onDone;
      });
      return {
        promise,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        abort
      };
    }
    exports.isObservable = observable.isObservable;
    exports.observable = observable.observable;
    exports.map = map;
    exports.observableToPromise = observableToPromise;
    exports.share = share;
    exports.tap = tap;
  }
});

// ../../node_modules/.pnpm/@trpc+server@10.10.0/node_modules/@trpc/server/observable/index.js
var require_observable2 = __commonJS({
  "../../node_modules/.pnpm/@trpc+server@10.10.0/node_modules/@trpc/server/observable/index.js"(exports, module2) {
    module2.exports = require_observable();
  }
});

// esbuild-resolve:@trpc/server/observable
var observable_exports = {};
__export(observable_exports, {
  default: () => import_observable.default
});
var import_observable;
var init_observable = __esm({
  "esbuild-resolve:@trpc/server/observable"() {
    __reExport(observable_exports, __toESM(require_observable2()));
    import_observable = __toESM(require_observable2());
  }
});

// ../../node_modules/.pnpm/@trpc+client@10.10.0_@trpc+server@10.10.0/node_modules/@trpc/client/dist/transformResult-e7a1e69e.js
var require_transformResult_e7a1e69e = __commonJS({
  "../../node_modules/.pnpm/@trpc+client@10.10.0_@trpc+server@10.10.0/node_modules/@trpc/client/dist/transformResult-e7a1e69e.js"(exports) {
    "use strict";
    var TRPCClientError = class extends Error {
      static from(cause, opts = {}) {
        if (!(cause instanceof Error)) {
          return new TRPCClientError(cause.error.message ?? "", {
            ...opts,
            cause: void 0,
            result: cause
          });
        }
        if (cause.name === "TRPCClientError") {
          return cause;
        }
        return new TRPCClientError(cause.message, {
          ...opts,
          cause,
          result: null
        });
      }
      constructor(message, opts) {
        const cause = opts?.cause;
        super(message, {
          cause
        });
        this.meta = opts?.meta;
        this.cause = cause;
        this.shape = opts?.result?.error;
        this.data = opts?.result?.error.data;
        this.name = "TRPCClientError";
        Object.setPrototypeOf(this, TRPCClientError.prototype);
      }
    };
    function transformResultInner(response, runtime) {
      if ("error" in response) {
        const error = runtime.transformer.deserialize(response.error);
        return {
          ok: false,
          error: {
            ...response,
            error
          }
        };
      }
      const result = {
        ...response.result,
        ...(!response.result.type || response.result.type === "data") && {
          type: "data",
          data: runtime.transformer.deserialize(response.result.data)
        }
      };
      return {
        ok: true,
        result
      };
    }
    function isObject(value) {
      return !!value && !Array.isArray(value) && typeof value === "object";
    }
    function transformResult(response, runtime) {
      let result;
      try {
        result = transformResultInner(response, runtime);
      } catch (err) {
        throw new TRPCClientError("Unable to transform response from server");
      }
      if (!result.ok && (!isObject(result.error.error) || typeof result.error.error.code !== "number")) {
        throw new TRPCClientError("Badly formatted response from server");
      }
      if (result.ok && !isObject(result.result)) {
        throw new TRPCClientError("Badly formatted response from server");
      }
      return result;
    }
    exports.TRPCClientError = TRPCClientError;
    exports.transformResult = transformResult;
  }
});

// ../../node_modules/.pnpm/@trpc+client@10.10.0_@trpc+server@10.10.0/node_modules/@trpc/client/dist/splitLink-f29e84be.js
var require_splitLink_f29e84be = __commonJS({
  "../../node_modules/.pnpm/@trpc+client@10.10.0_@trpc+server@10.10.0/node_modules/@trpc/client/dist/splitLink-f29e84be.js"(exports) {
    "use strict";
    var observable = (init_observable(), __toCommonJS(observable_exports));
    function createChain(opts) {
      return observable.observable((observer) => {
        function execute(index = 0, op = opts.op) {
          const next = opts.links[index];
          if (!next) {
            throw new Error("No more links to execute - did you forget to add an ending link?");
          }
          const subscription = next({
            op,
            next(nextOp) {
              const nextObserver = execute(index + 1, nextOp);
              return nextObserver;
            }
          });
          return subscription;
        }
        const obs$ = execute();
        return obs$.subscribe(observer);
      });
    }
    function asArray(value) {
      return Array.isArray(value) ? value : [
        value
      ];
    }
    function splitLink(opts) {
      return (runtime) => {
        const yes = asArray(opts.true).map((link) => link(runtime));
        const no = asArray(opts.false).map((link) => link(runtime));
        return (props) => {
          return observable.observable((observer) => {
            const links = opts.condition(props.op) ? yes : no;
            return createChain({
              op: props.op,
              links
            }).subscribe(observer);
          });
        };
      };
    }
    exports.createChain = createChain;
    exports.splitLink = splitLink;
  }
});

// ../../node_modules/.pnpm/@trpc+server@10.10.0/node_modules/@trpc/server/dist/index-4d2d31b6.js
var require_index_4d2d31b6 = __commonJS({
  "../../node_modules/.pnpm/@trpc+server@10.10.0/node_modules/@trpc/server/dist/index-4d2d31b6.js"(exports) {
    "use strict";
    var noop = () => {
    };
    function createInnerProxy(callback, path) {
      const proxy = new Proxy(noop, {
        get(_obj, key) {
          if (typeof key !== "string" || key === "then") {
            return void 0;
          }
          return createInnerProxy(callback, [
            ...path,
            key
          ]);
        },
        apply(_1, _2, args) {
          return callback({
            args,
            path
          });
        }
      });
      return proxy;
    }
    var createRecursiveProxy = (callback) => createInnerProxy(callback, []);
    var createFlatProxy = (callback) => {
      return new Proxy(noop, {
        get(_obj, name) {
          if (typeof name !== "string" || name === "then") {
            return void 0;
          }
          return callback(name);
        }
      });
    };
    exports.createFlatProxy = createFlatProxy;
    exports.createRecursiveProxy = createRecursiveProxy;
  }
});

// ../../node_modules/.pnpm/@trpc+server@10.10.0/node_modules/@trpc/server/dist/shared/index.js
var require_shared = __commonJS({
  "../../node_modules/.pnpm/@trpc+server@10.10.0/node_modules/@trpc/server/dist/shared/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var index = require_index_4d2d31b6();
    exports.createFlatProxy = index.createFlatProxy;
    exports.createRecursiveProxy = index.createRecursiveProxy;
  }
});

// ../../node_modules/.pnpm/@trpc+server@10.10.0/node_modules/@trpc/server/shared/index.js
var require_shared2 = __commonJS({
  "../../node_modules/.pnpm/@trpc+server@10.10.0/node_modules/@trpc/server/shared/index.js"(exports, module2) {
    module2.exports = require_shared();
  }
});

// esbuild-resolve:@trpc/server/shared
var shared_exports = {};
__export(shared_exports, {
  default: () => import_shared.default
});
var import_shared;
var init_shared = __esm({
  "esbuild-resolve:@trpc/server/shared"() {
    __reExport(shared_exports, __toESM(require_shared2()));
    import_shared = __toESM(require_shared2());
  }
});

// ../../node_modules/.pnpm/@trpc+client@10.10.0_@trpc+server@10.10.0/node_modules/@trpc/client/dist/httpUtils-30a43613.js
var require_httpUtils_30a43613 = __commonJS({
  "../../node_modules/.pnpm/@trpc+client@10.10.0_@trpc+server@10.10.0/node_modules/@trpc/client/dist/httpUtils-30a43613.js"(exports) {
    "use strict";
    function getWindow() {
      if (typeof window !== "undefined") {
        return window;
      }
      return globalThis;
    }
    function getAbortController(ac) {
      return ac ?? getWindow().AbortController ?? null;
    }
    function getFetch(f) {
      if (f) {
        return f;
      }
      const win = getWindow();
      const globalFetch = win.fetch;
      if (globalFetch) {
        return typeof globalFetch.bind === "function" ? globalFetch.bind(win) : globalFetch;
      }
      throw new Error("No fetch implementation found");
    }
    function resolveHTTPLinkOptions(opts) {
      const headers = opts.headers || (() => ({}));
      return {
        url: opts.url,
        fetch: getFetch(opts.fetch),
        AbortController: getAbortController(opts.AbortController),
        headers: typeof headers === "function" ? headers : () => headers
      };
    }
    function arrayToDict(array) {
      const dict = {};
      for (let index = 0; index < array.length; index++) {
        const element = array[index];
        dict[index] = element;
      }
      return dict;
    }
    var METHOD = {
      query: "GET",
      mutation: "POST"
    };
    function getInput(opts) {
      return "input" in opts ? opts.runtime.transformer.serialize(opts.input) : arrayToDict(opts.inputs.map((_input) => opts.runtime.transformer.serialize(_input)));
    }
    function getUrl(opts) {
      let url = opts.url + "/" + opts.path;
      const queryParts = [];
      if ("inputs" in opts) {
        queryParts.push("batch=1");
      }
      if (opts.type === "query") {
        const input = getInput(opts);
        if (input !== void 0) {
          queryParts.push(`input=${encodeURIComponent(JSON.stringify(input))}`);
        }
      }
      if (queryParts.length) {
        url += "?" + queryParts.join("&");
      }
      return url;
    }
    function getBody(opts) {
      if (opts.type === "query") {
        return void 0;
      }
      const input = getInput(opts);
      return input !== void 0 ? JSON.stringify(input) : void 0;
    }
    function httpRequest(opts) {
      const { type } = opts;
      const ac = opts.AbortController ? new opts.AbortController() : null;
      const promise = new Promise((resolve, reject) => {
        const url = getUrl(opts);
        const body = getBody(opts);
        const meta = {};
        Promise.resolve(opts.headers()).then((headers) => {
          if (type === "subscription") {
            throw new Error("Subscriptions should use wsLink");
          }
          return opts.fetch(url, {
            method: METHOD[type],
            signal: ac?.signal,
            body,
            headers: {
              "content-type": "application/json",
              ...headers
            }
          });
        }).then((_res) => {
          meta.response = _res;
          return _res.json();
        }).then((json) => {
          resolve({
            json,
            meta
          });
        }).catch(reject);
      });
      const cancel = () => {
        ac?.abort();
      };
      return {
        promise,
        cancel
      };
    }
    exports.getFetch = getFetch;
    exports.getUrl = getUrl;
    exports.httpRequest = httpRequest;
    exports.resolveHTTPLinkOptions = resolveHTTPLinkOptions;
  }
});

// ../../node_modules/.pnpm/@trpc+client@10.10.0_@trpc+server@10.10.0/node_modules/@trpc/client/dist/links/httpBatchLink.js
var require_httpBatchLink = __commonJS({
  "../../node_modules/.pnpm/@trpc+client@10.10.0_@trpc+server@10.10.0/node_modules/@trpc/client/dist/links/httpBatchLink.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var observable = (init_observable(), __toCommonJS(observable_exports));
    var transformResult = require_transformResult_e7a1e69e();
    var httpUtils = require_httpUtils_30a43613();
    var throwFatalError = () => {
      throw new Error("Something went wrong. Please submit an issue at https://github.com/trpc/trpc/issues/new");
    };
    function dataLoader(batchLoader) {
      let pendingItems = null;
      let dispatchTimer = null;
      const destroyTimerAndPendingItems = () => {
        clearTimeout(dispatchTimer);
        dispatchTimer = null;
        pendingItems = null;
      };
      function groupItems(items) {
        const groupedItems = [
          []
        ];
        let index = 0;
        while (true) {
          const item = items[index];
          if (!item) {
            break;
          }
          const lastGroup = groupedItems[groupedItems.length - 1];
          if (item.aborted) {
            item.reject(new Error("Aborted"));
            index++;
            continue;
          }
          const isValid = batchLoader.validate(lastGroup.concat(item).map((it) => it.key));
          if (isValid) {
            lastGroup.push(item);
            index++;
            continue;
          }
          if (lastGroup.length === 0) {
            item.reject(new Error("Input is too big for a single dispatch"));
            index++;
            continue;
          }
          groupedItems.push([]);
        }
        return groupedItems;
      }
      function dispatch() {
        const groupedItems = groupItems(pendingItems);
        destroyTimerAndPendingItems();
        for (const items of groupedItems) {
          if (!items.length) {
            continue;
          }
          const batch = {
            items,
            cancel: throwFatalError
          };
          for (const item of items) {
            item.batch = batch;
          }
          const { promise, cancel } = batchLoader.fetch(batch.items.map((_item) => _item.key));
          batch.cancel = cancel;
          promise.then((result) => {
            for (let i = 0; i < result.length; i++) {
              const value = result[i];
              const item = batch.items[i];
              item.resolve(value);
              item.batch = null;
            }
          }).catch((cause) => {
            for (const item of batch.items) {
              item.reject(cause);
              item.batch = null;
            }
          });
        }
      }
      function load(key) {
        const item = {
          aborted: false,
          key,
          batch: null,
          resolve: throwFatalError,
          reject: throwFatalError
        };
        const promise = new Promise((resolve, reject) => {
          item.reject = reject;
          item.resolve = resolve;
          if (!pendingItems) {
            pendingItems = [];
          }
          pendingItems.push(item);
        });
        if (!dispatchTimer) {
          dispatchTimer = setTimeout(dispatch);
        }
        const cancel = () => {
          item.aborted = true;
          if (item.batch?.items.every((item2) => item2.aborted)) {
            item.batch.cancel();
            item.batch = null;
          }
        };
        return {
          promise,
          cancel
        };
      }
      return {
        load
      };
    }
    function httpBatchLink2(opts) {
      const resolvedOpts = httpUtils.resolveHTTPLinkOptions(opts);
      return (runtime) => {
        const maxURLLength = opts.maxURLLength || Infinity;
        const batchLoader = (type) => {
          const validate = (batchOps) => {
            if (maxURLLength === Infinity) {
              return true;
            }
            const path = batchOps.map((op) => op.path).join(",");
            const inputs = batchOps.map((op) => op.input);
            const url = httpUtils.getUrl({
              ...resolvedOpts,
              runtime,
              type,
              path,
              inputs
            });
            return url.length <= maxURLLength;
          };
          const fetch2 = (batchOps) => {
            const path = batchOps.map((op) => op.path).join(",");
            const inputs = batchOps.map((op) => op.input);
            const { promise, cancel } = httpUtils.httpRequest({
              ...resolvedOpts,
              runtime,
              type,
              path,
              inputs
            });
            return {
              promise: promise.then((res) => {
                const resJSON = Array.isArray(res.json) ? res.json : batchOps.map(() => res.json);
                const result = resJSON.map((item) => ({
                  meta: res.meta,
                  json: item
                }));
                return result;
              }),
              cancel
            };
          };
          return {
            validate,
            fetch: fetch2
          };
        };
        const query = dataLoader(batchLoader("query"));
        const mutation = dataLoader(batchLoader("mutation"));
        const subscription = dataLoader(batchLoader("subscription"));
        const loaders = {
          query,
          subscription,
          mutation
        };
        return ({ op }) => {
          return observable.observable((observer) => {
            const loader = loaders[op.type];
            const { promise, cancel } = loader.load(op);
            promise.then((res) => {
              const transformed = transformResult.transformResult(res.json, runtime);
              if (!transformed.ok) {
                observer.error(transformResult.TRPCClientError.from(transformed.error, {
                  meta: res.meta
                }));
                return;
              }
              observer.next({
                context: res.meta,
                result: transformed.result
              });
              observer.complete();
            }).catch((err) => observer.error(transformResult.TRPCClientError.from(err)));
            return () => {
              cancel();
            };
          });
        };
      };
    }
    exports.httpBatchLink = httpBatchLink2;
  }
});

// ../../node_modules/.pnpm/@trpc+client@10.10.0_@trpc+server@10.10.0/node_modules/@trpc/client/dist/links/httpLink.js
var require_httpLink = __commonJS({
  "../../node_modules/.pnpm/@trpc+client@10.10.0_@trpc+server@10.10.0/node_modules/@trpc/client/dist/links/httpLink.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var observable = (init_observable(), __toCommonJS(observable_exports));
    var transformResult = require_transformResult_e7a1e69e();
    var httpUtils = require_httpUtils_30a43613();
    function httpLink(opts) {
      const resolvedOpts = httpUtils.resolveHTTPLinkOptions(opts);
      return (runtime) => ({ op }) => observable.observable((observer) => {
        const { path, input, type } = op;
        const { promise, cancel } = httpUtils.httpRequest({
          ...resolvedOpts,
          runtime,
          type,
          path,
          input
        });
        promise.then((res) => {
          const transformed = transformResult.transformResult(res.json, runtime);
          if (!transformed.ok) {
            observer.error(transformResult.TRPCClientError.from(transformed.error, {
              meta: res.meta
            }));
            return;
          }
          observer.next({
            context: res.meta,
            result: transformed.result
          });
          observer.complete();
        }).catch((cause) => observer.error(transformResult.TRPCClientError.from(cause)));
        return () => {
          cancel();
        };
      });
    }
    exports.httpLink = httpLink;
  }
});

// ../../node_modules/.pnpm/@trpc+client@10.10.0_@trpc+server@10.10.0/node_modules/@trpc/client/dist/links/loggerLink.js
var require_loggerLink = __commonJS({
  "../../node_modules/.pnpm/@trpc+client@10.10.0_@trpc+server@10.10.0/node_modules/@trpc/client/dist/links/loggerLink.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var observable = (init_observable(), __toCommonJS(observable_exports));
    var palette = {
      query: [
        "72e3ff",
        "3fb0d8"
      ],
      mutation: [
        "c5a3fc",
        "904dfc"
      ],
      subscription: [
        "ff49e1",
        "d83fbe"
      ]
    };
    var defaultLogger = (c = console) => (props) => {
      const { direction, input, type, path, context, id } = props;
      const [light, dark] = palette[type];
      const css = `
    background-color: #${direction === "up" ? light : dark}; 
    color: ${direction === "up" ? "black" : "white"};
    padding: 2px;
  `;
      const parts = [
        "%c",
        direction === "up" ? ">>" : "<<",
        type,
        `#${id}`,
        `%c${path}%c`,
        "%O"
      ];
      const args = [
        css,
        `${css}; font-weight: bold;`,
        `${css}; font-weight: normal;`
      ];
      if (props.direction === "up") {
        args.push({
          input,
          context
        });
      } else {
        args.push({
          input,
          result: props.result,
          elapsedMs: props.elapsedMs,
          context
        });
      }
      const fn = props.direction === "down" && props.result && (props.result instanceof Error || "error" in props.result.result) ? "error" : "log";
      c[fn].apply(null, [
        parts.join(" ")
      ].concat(args));
    };
    function loggerLink(opts = {}) {
      const { enabled = () => true } = opts;
      const { logger = defaultLogger(opts.console) } = opts;
      return () => {
        return ({ op, next }) => {
          return observable.observable((observer) => {
            enabled({
              ...op,
              direction: "up"
            }) && logger({
              ...op,
              direction: "up"
            });
            const requestStartTime = Date.now();
            function logResult(result) {
              const elapsedMs = Date.now() - requestStartTime;
              enabled({
                ...op,
                direction: "down",
                result
              }) && logger({
                ...op,
                direction: "down",
                elapsedMs,
                result
              });
            }
            return next(op).pipe(observable.tap({
              next(result) {
                logResult(result);
              },
              error(result) {
                logResult(result);
              }
            })).subscribe(observer);
          });
        };
      };
    }
    exports.loggerLink = loggerLink;
  }
});

// ../../node_modules/.pnpm/@trpc+client@10.10.0_@trpc+server@10.10.0/node_modules/@trpc/client/dist/links/wsLink.js
var require_wsLink = __commonJS({
  "../../node_modules/.pnpm/@trpc+client@10.10.0_@trpc+server@10.10.0/node_modules/@trpc/client/dist/links/wsLink.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var observable = (init_observable(), __toCommonJS(observable_exports));
    var transformResult = require_transformResult_e7a1e69e();
    var retryDelay = (attemptIndex) => attemptIndex === 0 ? 0 : Math.min(1e3 * 2 ** attemptIndex, 3e4);
    function createWSClient(opts) {
      const { url, WebSocket: WebSocketImpl = WebSocket, retryDelayMs: retryDelayFn = retryDelay, onOpen, onClose } = opts;
      if (!WebSocketImpl) {
        throw new Error("No WebSocket implementation found - you probably don't want to use this on the server, but if you do you need to pass a `WebSocket`-ponyfill");
      }
      let outgoing = [];
      const pendingRequests = /* @__PURE__ */ Object.create(null);
      let connectAttempt = 0;
      let dispatchTimer = null;
      let connectTimer = null;
      let activeConnection = createWS();
      let state = "connecting";
      function dispatch() {
        if (state !== "open" || dispatchTimer) {
          return;
        }
        dispatchTimer = setTimeout(() => {
          dispatchTimer = null;
          if (outgoing.length === 1) {
            activeConnection.send(JSON.stringify(outgoing.pop()));
          } else {
            activeConnection.send(JSON.stringify(outgoing));
          }
          outgoing = [];
        });
      }
      function tryReconnect() {
        if (connectTimer || state === "closed") {
          return;
        }
        const timeout = retryDelayFn(connectAttempt++);
        reconnectInMs(timeout);
      }
      function reconnect() {
        state = "connecting";
        const oldConnection = activeConnection;
        activeConnection = createWS();
        closeIfNoPending(oldConnection);
      }
      function reconnectInMs(ms) {
        if (connectTimer) {
          return;
        }
        state = "connecting";
        connectTimer = setTimeout(reconnect, ms);
      }
      function closeIfNoPending(conn) {
        const hasPendingRequests = Object.values(pendingRequests).some((p) => p.ws === conn);
        if (!hasPendingRequests) {
          conn.close();
        }
      }
      function resumeSubscriptionOnReconnect(req) {
        if (outgoing.some((r) => r.id === req.op.id)) {
          return;
        }
        request(req.op, req.callbacks);
      }
      function createWS() {
        const conn = new WebSocketImpl(url);
        clearTimeout(connectTimer);
        connectTimer = null;
        conn.addEventListener("open", () => {
          if (conn !== activeConnection) {
            return;
          }
          connectAttempt = 0;
          state = "open";
          onOpen?.();
          dispatch();
        });
        conn.addEventListener("error", () => {
          if (conn === activeConnection) {
            tryReconnect();
          }
        });
        const handleIncomingRequest = (req) => {
          if (req.method === "reconnect" && conn === activeConnection) {
            if (state === "open") {
              onClose?.();
            }
            reconnect();
            for (const pendingReq of Object.values(pendingRequests)) {
              if (pendingReq.type === "subscription") {
                resumeSubscriptionOnReconnect(pendingReq);
              }
            }
          }
        };
        const handleIncomingResponse = (data) => {
          const req = data.id !== null && pendingRequests[data.id];
          if (!req) {
            return;
          }
          req.callbacks.next?.(data);
          if (req.ws !== activeConnection && conn === activeConnection) {
            const oldWs = req.ws;
            req.ws = activeConnection;
            closeIfNoPending(oldWs);
          }
          if ("result" in data && data.result.type === "stopped" && conn === activeConnection) {
            req.callbacks.complete();
          }
        };
        conn.addEventListener("message", ({ data }) => {
          const msg = JSON.parse(data);
          if ("method" in msg) {
            handleIncomingRequest(msg);
          } else {
            handleIncomingResponse(msg);
          }
          if (conn !== activeConnection || state === "closed") {
            closeIfNoPending(conn);
          }
        });
        conn.addEventListener("close", ({ code }) => {
          if (state === "open") {
            onClose?.({
              code
            });
          }
          if (activeConnection === conn) {
            tryReconnect();
          }
          for (const [key, req] of Object.entries(pendingRequests)) {
            if (req.ws !== conn) {
              continue;
            }
            if (state === "closed") {
              delete pendingRequests[key];
              req.callbacks.complete?.();
              continue;
            }
            if (req.type === "subscription") {
              resumeSubscriptionOnReconnect(req);
            } else {
              delete pendingRequests[key];
              req.callbacks.error?.(transformResult.TRPCClientError.from(new TRPCWebSocketClosedError("WebSocket closed prematurely")));
            }
          }
        });
        return conn;
      }
      function request(op, callbacks) {
        const { type, input, path, id } = op;
        const envelope = {
          id,
          method: type,
          params: {
            input,
            path
          }
        };
        pendingRequests[id] = {
          ws: activeConnection,
          type,
          callbacks,
          op
        };
        outgoing.push(envelope);
        dispatch();
        return () => {
          const callbacks2 = pendingRequests[id]?.callbacks;
          delete pendingRequests[id];
          outgoing = outgoing.filter((msg) => msg.id !== id);
          callbacks2?.complete?.();
          if (activeConnection.readyState === WebSocketImpl.OPEN && op.type === "subscription") {
            outgoing.push({
              id,
              method: "subscription.stop"
            });
            dispatch();
          }
        };
      }
      return {
        close: () => {
          state = "closed";
          onClose?.();
          closeIfNoPending(activeConnection);
          clearTimeout(connectTimer);
          connectTimer = null;
        },
        request,
        getConnection() {
          return activeConnection;
        }
      };
    }
    var TRPCWebSocketClosedError = class extends Error {
      constructor(message) {
        super(message);
        this.name = "TRPCWebSocketClosedError";
        Object.setPrototypeOf(this, TRPCWebSocketClosedError.prototype);
      }
    };
    var TRPCSubscriptionEndedError = class extends Error {
      constructor(message) {
        super(message);
        this.name = "TRPCSubscriptionEndedError";
        Object.setPrototypeOf(this, TRPCSubscriptionEndedError.prototype);
      }
    };
    function wsLink(opts) {
      return (runtime) => {
        const { client } = opts;
        return ({ op }) => {
          return observable.observable((observer) => {
            const { type, path, id, context } = op;
            const input = runtime.transformer.serialize(op.input);
            let isDone = false;
            const unsub = client.request({
              type,
              path,
              input,
              id,
              context
            }, {
              error(err) {
                isDone = true;
                observer.error(err);
                unsub();
              },
              complete() {
                if (!isDone) {
                  isDone = true;
                  observer.error(transformResult.TRPCClientError.from(new TRPCSubscriptionEndedError("Operation ended prematurely")));
                } else {
                  observer.complete();
                }
              },
              next(message) {
                const transformed = transformResult.transformResult(message, runtime);
                if (!transformed.ok) {
                  observer.error(transformResult.TRPCClientError.from(transformed.error));
                  return;
                }
                observer.next({
                  result: transformed.result
                });
                if (op.type !== "subscription") {
                  isDone = true;
                  unsub();
                  observer.complete();
                }
              }
            });
            return () => {
              isDone = true;
              unsub();
            };
          });
        };
      };
    }
    exports.createWSClient = createWSClient;
    exports.wsLink = wsLink;
  }
});

// ../../node_modules/.pnpm/@trpc+client@10.10.0_@trpc+server@10.10.0/node_modules/@trpc/client/dist/index.js
var require_dist = __commonJS({
  "../../node_modules/.pnpm/@trpc+client@10.10.0_@trpc+server@10.10.0/node_modules/@trpc/client/dist/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var observable = (init_observable(), __toCommonJS(observable_exports));
    var transformResult = require_transformResult_e7a1e69e();
    var links_splitLink = require_splitLink_f29e84be();
    var shared = (init_shared(), __toCommonJS(shared_exports));
    var httpUtils = require_httpUtils_30a43613();
    var links_httpBatchLink = require_httpBatchLink();
    var links_httpLink = require_httpLink();
    var links_loggerLink = require_loggerLink();
    var links_wsLink = require_wsLink();
    var TRPCUntypedClient = class {
      $request({ type, input, path, context = {} }) {
        const chain$ = links_splitLink.createChain({
          links: this.links,
          op: {
            id: ++this.requestId,
            type,
            path,
            input,
            context
          }
        });
        return chain$.pipe(observable.share());
      }
      requestAsPromise(opts) {
        const req$ = this.$request(opts);
        const { promise, abort } = observable.observableToPromise(req$);
        const abortablePromise = new Promise((resolve, reject) => {
          opts.signal?.addEventListener("abort", abort);
          promise.then((envelope) => {
            resolve(envelope.result.data);
          }).catch((err) => {
            reject(transformResult.TRPCClientError.from(err));
          });
        });
        return abortablePromise;
      }
      query(path, input, opts) {
        return this.requestAsPromise({
          type: "query",
          path,
          input,
          context: opts?.context,
          signal: opts?.signal
        });
      }
      mutation(path, input, opts) {
        return this.requestAsPromise({
          type: "mutation",
          path,
          input,
          context: opts?.context,
          signal: opts?.signal
        });
      }
      subscription(path, input, opts) {
        const observable$ = this.$request({
          type: "subscription",
          path,
          input,
          context: opts?.context
        });
        return observable$.subscribe({
          next(envelope) {
            if (envelope.result.type === "started") {
              opts.onStarted?.();
            } else if (envelope.result.type === "stopped") {
              opts.onStopped?.();
            } else {
              opts.onData?.(envelope.result.data);
            }
          },
          error(err) {
            opts.onError?.(err);
          },
          complete() {
            opts.onComplete?.();
          }
        });
      }
      constructor(opts) {
        this.requestId = 0;
        function getTransformer() {
          const transformer = opts.transformer;
          if (!transformer)
            return {
              serialize: (data) => data,
              deserialize: (data) => data
            };
          if ("input" in transformer)
            return {
              serialize: transformer.input.serialize,
              deserialize: transformer.output.deserialize
            };
          return transformer;
        }
        this.runtime = {
          transformer: getTransformer()
        };
        this.links = opts.links.map((link) => link(this.runtime));
      }
    };
    function createTRPCUntypedClient(opts) {
      const client = new TRPCUntypedClient(opts);
      return client;
    }
    function createTRPCClient(opts) {
      const client = new TRPCUntypedClient(opts);
      return client;
    }
    var clientCallTypeMap = {
      query: "query",
      mutate: "mutation",
      subscribe: "subscription"
    };
    function createTRPCClientProxy(client) {
      return shared.createFlatProxy((key) => {
        if (client.hasOwnProperty(key)) {
          return client[key];
        }
        return shared.createRecursiveProxy(({ path, args }) => {
          const pathCopy = [
            key,
            ...path
          ];
          const clientCallType = pathCopy.pop();
          const procedureType = clientCallTypeMap[clientCallType];
          const fullPath = pathCopy.join(".");
          return client[procedureType](fullPath, ...args);
        });
      });
    }
    function createTRPCProxyClient2(opts) {
      const client = new TRPCUntypedClient(opts);
      const proxy = createTRPCClientProxy(client);
      return proxy;
    }
    exports.TRPCClientError = transformResult.TRPCClientError;
    exports.splitLink = links_splitLink.splitLink;
    exports.getFetch = httpUtils.getFetch;
    exports.httpBatchLink = links_httpBatchLink.httpBatchLink;
    exports.httpLink = links_httpLink.httpLink;
    exports.loggerLink = links_loggerLink.loggerLink;
    exports.createWSClient = links_wsLink.createWSClient;
    exports.wsLink = links_wsLink.wsLink;
    exports.createTRPCClient = createTRPCClient;
    exports.createTRPCClientProxy = createTRPCClientProxy;
    exports.createTRPCProxyClient = createTRPCProxyClient2;
    exports.createTRPCUntypedClient = createTRPCUntypedClient;
  }
});

// src/formConfigService.ts
var formConfigService_exports = {};
__export(formConfigService_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(formConfigService_exports);

// src/utils.ts
var import_client_s3 = require("@aws-sdk/client-s3");
var putFormToS3 = async (bucket, key, data) => {
  const client = new import_client_s3.S3Client({});
  const params = {
    Bucket: bucket,
    Key: key,
    Body: data
  };
  const command = new import_client_s3.PutObjectCommand(params);
  try {
    const resp = await client.send(command);
    console.log(resp);
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false };
  }
};
var getForm = async (url, fileName) => {
  try {
    const resp = await fetch(`https://${url}/${fileName}`);
    if (!resp.ok) {
      throw new Error("No such file");
    }
    const data = await resp.json();
    console.log(resp);
    return {
      data,
      success: true
    };
  } catch (err) {
    console.error(err);
    return { success: false };
  }
};

// esbuild-resolve:@trpc/client
var client_exports = {};
__export(client_exports, {
  default: () => import_client.default
});
__reExport(client_exports, __toESM(require_dist()));
var import_client = __toESM(require_dist());

// src/formConfigService.ts
var handler = async (event) => {
  console.log("request:", JSON.stringify(event, void 0, 2));
  const bucket = process.env.FORM_BUCKET;
  const key = "support-us.json";
  const cdnUrl = process.env.CDN_URL;
  const formIdServiceUrl = process.env.FORM_ID_ENDPOINT_URL;
  const client = (0, client_exports.createTRPCProxyClient)({
    links: [
      (0, client_exports.httpBatchLink)({
        url: formIdServiceUrl ?? "http://localhost:3000/trpc"
      })
    ]
  });
  let response = {
    statusCode: 200,
    headers: { "Content-Type": "application/json" }
  };
  const form = {
    id: 123,
    name: "my-form",
    values: {
      nudges: [1, 2, 3, 4],
      regularNudges: [1, 2, 3, 4]
    },
    email: true
  };
  let body = {
    message: "nothing"
  };
  if (event.httpMethod === "GET") {
    if (event.path === "/forms") {
      const { formId } = event.queryStringParameters;
      const { data, success } = await getForm(cdnUrl, formId);
      body = {
        message: success ? JSON.stringify(data) : "nothing found"
      };
    } else if (event.path === "/trpc") {
      const { formId } = event.queryStringParameters;
      const data = await client.getFormId.query(formId);
      body = {
        message: `You queried for form: ${data.id} and it says ${data.greeting}`
      };
    } else {
      body = {
        message: "this path is not supported yet"
      };
    }
  } else if (event.httpMethod === "POST") {
    if (event.path === "/trpc") {
      const data = await client.newForm.mutate({ formName: "support-us" });
      body = {
        message: `You created form: ${data.id} and it says ${data.message}`
      };
    } else {
      body = {
        message: "POST is not yet supported"
      };
    }
  } else if (event.httpMethod === "PUT") {
    const { success } = await putFormToS3(bucket, key, JSON.stringify(form));
    body = {
      message: success ? "PUT form config sucessfully" : "Could not PUT form config in bucket"
    };
  } else {
    body = {
      message: "Unknown method and path, url: " + formIdServiceUrl
    };
  }
  return {
    ...response,
    body: JSON.stringify(body)
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});

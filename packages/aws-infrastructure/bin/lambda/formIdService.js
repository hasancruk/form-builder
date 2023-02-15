var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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

// ../../node_modules/.pnpm/@trpc+server@10.10.0/node_modules/@trpc/server/dist/TRPCError-bd37df84.js
var require_TRPCError_bd37df84 = __commonJS({
  "../../node_modules/.pnpm/@trpc+server@10.10.0/node_modules/@trpc/server/dist/TRPCError-bd37df84.js"(exports) {
    "use strict";
    function getMessageFromUnknownError(err, fallback) {
      if (typeof err === "string") {
        return err;
      }
      if (err instanceof Error && typeof err.message === "string") {
        return err.message;
      }
      return fallback;
    }
    function getErrorFromUnknown(cause) {
      if (cause instanceof Error) {
        return cause;
      }
      const message = getMessageFromUnknownError(cause, "Unknown error");
      return new Error(message);
    }
    function getTRPCErrorFromUnknown(cause) {
      const error = getErrorFromUnknown(cause);
      if (error.name === "TRPCError") {
        return cause;
      }
      const trpcError = new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        cause: error,
        message: error.message
      });
      trpcError.stack = error.stack;
      return trpcError;
    }
    function getCauseFromUnknown(cause) {
      if (cause instanceof Error) {
        return cause;
      }
      return void 0;
    }
    var TRPCError = class extends Error {
      constructor(opts) {
        const code = opts.code;
        const message = opts.message ?? getMessageFromUnknownError(opts.cause, code);
        const cause = opts.cause !== void 0 ? getErrorFromUnknown(opts.cause) : void 0;
        super(message, {
          cause
        });
        this.code = code;
        this.cause = cause;
        this.name = "TRPCError";
        Object.setPrototypeOf(this, new.target.prototype);
      }
    };
    exports.TRPCError = TRPCError;
    exports.getCauseFromUnknown = getCauseFromUnknown;
    exports.getTRPCErrorFromUnknown = getTRPCErrorFromUnknown;
  }
});

// ../../node_modules/.pnpm/@trpc+server@10.10.0/node_modules/@trpc/server/dist/codes-e0ea0f4c.js
var require_codes_e0ea0f4c = __commonJS({
  "../../node_modules/.pnpm/@trpc+server@10.10.0/node_modules/@trpc/server/dist/codes-e0ea0f4c.js"(exports) {
    "use strict";
    function invert(obj) {
      const newObj = /* @__PURE__ */ Object.create(null);
      for (const key in obj) {
        const v = obj[key];
        newObj[v] = key;
      }
      return newObj;
    }
    var TRPC_ERROR_CODES_BY_KEY = {
      /**
      * Invalid JSON was received by the server.
      * An error occurred on the server while parsing the JSON text.
      */
      PARSE_ERROR: -32700,
      /**
      * The JSON sent is not a valid Request object.
      */
      BAD_REQUEST: -32600,
      /**
      * Internal JSON-RPC error.
      */
      INTERNAL_SERVER_ERROR: -32603,
      // Implementation specific errors
      UNAUTHORIZED: -32001,
      FORBIDDEN: -32003,
      NOT_FOUND: -32004,
      METHOD_NOT_SUPPORTED: -32005,
      TIMEOUT: -32008,
      CONFLICT: -32009,
      PRECONDITION_FAILED: -32012,
      PAYLOAD_TOO_LARGE: -32013,
      TOO_MANY_REQUESTS: -32029,
      CLIENT_CLOSED_REQUEST: -32099
    };
    var TRPC_ERROR_CODES_BY_NUMBER = invert(TRPC_ERROR_CODES_BY_KEY);
    exports.TRPC_ERROR_CODES_BY_KEY = TRPC_ERROR_CODES_BY_KEY;
    exports.TRPC_ERROR_CODES_BY_NUMBER = TRPC_ERROR_CODES_BY_NUMBER;
    exports.invert = invert;
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

// ../../node_modules/.pnpm/@trpc+server@10.10.0/node_modules/@trpc/server/dist/config-d356ff77.js
var require_config_d356ff77 = __commonJS({
  "../../node_modules/.pnpm/@trpc+server@10.10.0/node_modules/@trpc/server/dist/config-d356ff77.js"(exports) {
    "use strict";
    var TRPCError = require_TRPCError_bd37df84();
    var codes = require_codes_e0ea0f4c();
    var index = require_index_4d2d31b6();
    function getDataTransformer(transformer) {
      if ("input" in transformer) {
        return transformer;
      }
      return {
        input: transformer,
        output: transformer
      };
    }
    var defaultTransformer = {
      _default: true,
      input: {
        serialize: (obj) => obj,
        deserialize: (obj) => obj
      },
      output: {
        serialize: (obj) => obj,
        deserialize: (obj) => obj
      }
    };
    var defaultFormatter = ({ shape }) => {
      return shape;
    };
    var TRPC_ERROR_CODES_BY_NUMBER = codes.invert(codes.TRPC_ERROR_CODES_BY_KEY);
    var JSONRPC2_TO_HTTP_CODE = {
      PARSE_ERROR: 400,
      BAD_REQUEST: 400,
      NOT_FOUND: 404,
      INTERNAL_SERVER_ERROR: 500,
      UNAUTHORIZED: 401,
      FORBIDDEN: 403,
      TIMEOUT: 408,
      CONFLICT: 409,
      CLIENT_CLOSED_REQUEST: 499,
      PRECONDITION_FAILED: 412,
      PAYLOAD_TOO_LARGE: 413,
      METHOD_NOT_SUPPORTED: 405,
      TOO_MANY_REQUESTS: 429
    };
    function getStatusCodeFromKey(code) {
      return JSONRPC2_TO_HTTP_CODE[code] ?? 500;
    }
    function getHTTPStatusCode(json) {
      const arr = Array.isArray(json) ? json : [
        json
      ];
      const httpStatuses = new Set(arr.map((res) => {
        if ("error" in res) {
          const data = res.error.data;
          if (typeof data.httpStatus === "number") {
            return data.httpStatus;
          }
          const code = TRPC_ERROR_CODES_BY_NUMBER[res.error.code];
          return getStatusCodeFromKey(code);
        }
        return 200;
      }));
      if (httpStatuses.size !== 1) {
        return 207;
      }
      const httpStatus = httpStatuses.values().next().value;
      return httpStatus;
    }
    function getHTTPStatusCodeFromError(error) {
      const { code } = error;
      return getStatusCodeFromKey(code);
    }
    function omitPrototype(obj) {
      return Object.assign(/* @__PURE__ */ Object.create(null), obj);
    }
    var procedureTypes = [
      "query",
      "mutation",
      "subscription"
    ];
    function isRouter(procedureOrRouter) {
      return "router" in procedureOrRouter._def;
    }
    var emptyRouter = {
      _ctx: null,
      _errorShape: null,
      _meta: null,
      queries: {},
      mutations: {},
      subscriptions: {},
      errorFormatter: defaultFormatter,
      transformer: defaultTransformer
    };
    var reservedWords = [
      /**
      * Then is a reserved word because otherwise we can't return a promise that returns a Proxy
      * since JS will think that `.then` is something that exists
      */
      "then"
    ];
    function createRouterFactory(config) {
      return function createRouterInner(procedures) {
        const reservedWordsUsed = new Set(Object.keys(procedures).filter((v) => reservedWords.includes(v)));
        if (reservedWordsUsed.size > 0) {
          throw new Error("Reserved words used in `router({})` call: " + Array.from(reservedWordsUsed).join(", "));
        }
        const routerProcedures = omitPrototype({});
        function recursiveGetPaths(procedures2, path = "") {
          for (const [key, procedureOrRouter] of Object.entries(procedures2 ?? {})) {
            const newPath = `${path}${key}`;
            if (isRouter(procedureOrRouter)) {
              recursiveGetPaths(procedureOrRouter._def.procedures, `${newPath}.`);
              continue;
            }
            if (routerProcedures[newPath]) {
              throw new Error(`Duplicate key: ${newPath}`);
            }
            routerProcedures[newPath] = procedureOrRouter;
          }
        }
        recursiveGetPaths(procedures);
        const _def = {
          _config: config,
          router: true,
          procedures: routerProcedures,
          ...emptyRouter,
          record: procedures,
          queries: Object.entries(routerProcedures).filter((pair) => pair[1]._def.query).reduce((acc, [key, val]) => ({
            ...acc,
            [key]: val
          }), {}),
          mutations: Object.entries(routerProcedures).filter((pair) => pair[1]._def.mutation).reduce((acc, [key, val]) => ({
            ...acc,
            [key]: val
          }), {}),
          subscriptions: Object.entries(routerProcedures).filter((pair) => pair[1]._def.subscription).reduce((acc, [key, val]) => ({
            ...acc,
            [key]: val
          }), {})
        };
        const router = {
          ...procedures,
          _def,
          createCaller(ctx) {
            const proxy = index.createRecursiveProxy(({ path, args }) => {
              if (path.length === 1 && procedureTypes.includes(path[0])) {
                return callProcedure({
                  procedures: _def.procedures,
                  path: args[0],
                  rawInput: args[1],
                  ctx,
                  type: path[0]
                });
              }
              const fullPath = path.join(".");
              const procedure = _def.procedures[fullPath];
              let type = "query";
              if (procedure._def.mutation) {
                type = "mutation";
              } else if (procedure._def.subscription) {
                type = "subscription";
              }
              return procedure({
                path: fullPath,
                rawInput: args[0],
                ctx,
                type
              });
            });
            return proxy;
          },
          getErrorShape(opts) {
            const { path, error } = opts;
            const { code } = opts.error;
            const shape = {
              message: error.message,
              code: codes.TRPC_ERROR_CODES_BY_KEY[code],
              data: {
                code,
                httpStatus: getHTTPStatusCodeFromError(error)
              }
            };
            if (config.isDev && typeof opts.error.stack === "string") {
              shape.data.stack = opts.error.stack;
            }
            if (typeof path === "string") {
              shape.data.path = path;
            }
            return this._def._config.errorFormatter({
              ...opts,
              shape
            });
          }
        };
        return router;
      };
    }
    function callProcedure(opts) {
      const { type, path } = opts;
      if (!(path in opts.procedures) || !opts.procedures[path]?._def[type]) {
        throw new TRPCError.TRPCError({
          code: "NOT_FOUND",
          message: `No "${type}"-procedure on path "${path}"`
        });
      }
      const procedure = opts.procedures[path];
      return procedure(opts);
    }
    var isServerDefault = typeof window === "undefined" || "Deno" in window || globalThis.process?.env?.NODE_ENV === "test" || !!globalThis.process?.env?.JEST_WORKER_ID;
    exports.TRPC_ERROR_CODES_BY_NUMBER = TRPC_ERROR_CODES_BY_NUMBER;
    exports.callProcedure = callProcedure;
    exports.createRouterFactory = createRouterFactory;
    exports.defaultFormatter = defaultFormatter;
    exports.defaultTransformer = defaultTransformer;
    exports.getDataTransformer = getDataTransformer;
    exports.getHTTPStatusCode = getHTTPStatusCode;
    exports.getHTTPStatusCodeFromError = getHTTPStatusCodeFromError;
    exports.isServerDefault = isServerDefault;
    exports.procedureTypes = procedureTypes;
  }
});

// ../../node_modules/.pnpm/@trpc+server@10.10.0/node_modules/@trpc/server/dist/index.js
var require_dist = __commonJS({
  "../../node_modules/.pnpm/@trpc+server@10.10.0/node_modules/@trpc/server/dist/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var config = require_config_d356ff77();
    var TRPCError = require_TRPCError_bd37df84();
    var codes = require_codes_e0ea0f4c();
    var index = require_index_4d2d31b6();
    var middlewareMarker$1 = "middlewareMarker";
    function getParseFn$1(procedureParser) {
      const parser = procedureParser;
      if (typeof parser === "function") {
        return parser;
      }
      if (typeof parser.parseAsync === "function") {
        return parser.parseAsync.bind(parser);
      }
      if (typeof parser.parse === "function") {
        return parser.parse.bind(parser);
      }
      if (typeof parser.validateSync === "function") {
        return parser.validateSync.bind(parser);
      }
      if (typeof parser.create === "function") {
        return parser.create.bind(parser);
      }
      throw new Error("Could not find a validator fn");
    }
    var Procedure = class {
      _def() {
        return {
          middlewares: this.middlewares,
          resolver: this.resolver,
          inputParser: this.inputParser,
          outputParser: this.outputParser,
          meta: this.meta
        };
      }
      async parseInput(rawInput) {
        try {
          return await this.parseInputFn(rawInput);
        } catch (cause) {
          throw new TRPCError.TRPCError({
            code: "BAD_REQUEST",
            cause: TRPCError.getCauseFromUnknown(cause)
          });
        }
      }
      async parseOutput(rawOutput) {
        try {
          return await this.parseOutputFn(rawOutput);
        } catch (cause) {
          throw new TRPCError.TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            cause: TRPCError.getCauseFromUnknown(cause),
            message: "Output validation failed"
          });
        }
      }
      /**
      * Trigger middlewares in order, parse raw input, call resolver & parse raw output
      * @internal
      */
      async call(opts) {
        const middlewaresWithResolver = this.middlewares.concat([
          async ({ ctx }) => {
            const input = await this.parseInput(opts.rawInput);
            const rawOutput = await this.resolver({
              ...opts,
              ctx,
              input
            });
            const data = await this.parseOutput(rawOutput);
            return {
              marker: middlewareMarker$1,
              ok: true,
              data,
              ctx
            };
          }
        ]);
        const callRecursive = async (callOpts = {
          index: 0,
          ctx: opts.ctx
        }) => {
          try {
            const result2 = await middlewaresWithResolver[callOpts.index]({
              ctx: callOpts.ctx,
              type: opts.type,
              path: opts.path,
              rawInput: opts.rawInput,
              meta: this.meta,
              next: async (nextOpts) => {
                return await callRecursive({
                  index: callOpts.index + 1,
                  ctx: nextOpts ? nextOpts.ctx : callOpts.ctx
                });
              }
            });
            return result2;
          } catch (cause) {
            return {
              ctx: callOpts.ctx,
              ok: false,
              error: TRPCError.getTRPCErrorFromUnknown(cause),
              marker: middlewareMarker$1
            };
          }
        };
        const result = await callRecursive();
        if (!result) {
          throw new TRPCError.TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "No result from middlewares - did you forget to `return next()`?"
          });
        }
        if (!result.ok) {
          throw result.error;
        }
        return result.data;
      }
      /**
      * Create new procedure with passed middlewares
      * @param middlewares
      */
      inheritMiddlewares(middlewares) {
        const Constructor = this.constructor;
        const instance = new Constructor({
          middlewares: [
            ...middlewares,
            ...this.middlewares
          ],
          resolver: this.resolver,
          inputParser: this.inputParser,
          outputParser: this.outputParser,
          meta: this.meta
        });
        return instance;
      }
      constructor(opts) {
        this.middlewares = opts.middlewares;
        this.resolver = opts.resolver;
        this.inputParser = opts.inputParser;
        this.parseInputFn = getParseFn$1(this.inputParser);
        this.outputParser = opts.outputParser;
        this.parseOutputFn = getParseFn$1(this.outputParser);
        this.meta = opts.meta;
      }
    };
    function createProcedure(opts) {
      const inputParser = "input" in opts ? opts.input : (input) => {
        if (input != null) {
          throw new TRPCError.TRPCError({
            code: "BAD_REQUEST",
            message: "No input expected"
          });
        }
        return void 0;
      };
      const outputParser = "output" in opts && opts.output ? opts.output : (output) => output;
      return new Procedure({
        inputParser,
        resolver: opts.resolve,
        middlewares: [],
        outputParser,
        meta: opts.meta
      });
    }
    function getParseFn(procedureParser) {
      const parser = procedureParser;
      if (typeof parser === "function") {
        return parser;
      }
      if (typeof parser.parseAsync === "function") {
        return parser.parseAsync.bind(parser);
      }
      if (typeof parser.parse === "function") {
        return parser.parse.bind(parser);
      }
      if (typeof parser.validateSync === "function") {
        return parser.validateSync.bind(parser);
      }
      if (typeof parser.create === "function") {
        return parser.create.bind(parser);
      }
      throw new Error("Could not find a validator fn");
    }
    function getParseFnOrPassThrough(procedureParser) {
      if (!procedureParser) {
        return (v) => v;
      }
      return getParseFn(procedureParser);
    }
    function mergeWithoutOverrides(obj1, ...objs) {
      const newObj = Object.assign(/* @__PURE__ */ Object.create(null), obj1);
      for (const overrides of objs) {
        for (const key in overrides) {
          if (key in newObj && newObj[key] !== overrides[key]) {
            throw new Error(`Duplicate key ${key}`);
          }
          newObj[key] = overrides[key];
        }
      }
      return newObj;
    }
    function createMiddlewareFactory() {
      function createMiddlewareInner(middlewares) {
        return {
          _middlewares: middlewares,
          unstable_pipe(middlewareBuilderOrFn) {
            const pipedMiddleware = "_middlewares" in middlewareBuilderOrFn ? middlewareBuilderOrFn._middlewares : [
              middlewareBuilderOrFn
            ];
            return createMiddlewareInner([
              ...middlewares,
              ...pipedMiddleware
            ]);
          }
        };
      }
      function createMiddleware(fn) {
        return createMiddlewareInner([
          fn
        ]);
      }
      return createMiddleware;
    }
    function isPlainObject(obj) {
      return obj && typeof obj === "object" && !Array.isArray(obj);
    }
    function createInputMiddleware(parse) {
      const inputMiddleware = async ({ next, rawInput, input }) => {
        let parsedInput;
        try {
          parsedInput = await parse(rawInput);
        } catch (cause) {
          throw new TRPCError.TRPCError({
            code: "BAD_REQUEST",
            cause: TRPCError.getCauseFromUnknown(cause)
          });
        }
        const combinedInput = isPlainObject(input) && isPlainObject(parsedInput) ? {
          ...input,
          ...parsedInput
        } : parsedInput;
        return next({
          input: combinedInput
        });
      };
      inputMiddleware._type = "input";
      return inputMiddleware;
    }
    function createOutputMiddleware(parse) {
      const outputMiddleware = async ({ next }) => {
        const result = await next();
        if (!result.ok) {
          return result;
        }
        try {
          const data = await parse(result.data);
          return {
            ...result,
            data
          };
        } catch (cause) {
          throw new TRPCError.TRPCError({
            message: "Output validation failed",
            code: "INTERNAL_SERVER_ERROR",
            cause: TRPCError.getCauseFromUnknown(cause)
          });
        }
      };
      outputMiddleware._type = "output";
      return outputMiddleware;
    }
    var middlewareMarker = "middlewareMarker";
    function createNewBuilder(def1, def2) {
      const { middlewares = [], inputs, ...rest } = def2;
      return createBuilder({
        ...mergeWithoutOverrides(def1, rest),
        inputs: [
          ...def1.inputs,
          ...inputs ?? []
        ],
        middlewares: [
          ...def1.middlewares,
          ...middlewares
        ]
      });
    }
    function createBuilder(initDef) {
      const _def = initDef || {
        inputs: [],
        middlewares: []
      };
      return {
        _def,
        input(input) {
          const parser = getParseFn(input);
          return createNewBuilder(_def, {
            inputs: [
              input
            ],
            middlewares: [
              createInputMiddleware(parser)
            ]
          });
        },
        output(output) {
          const parseOutput = getParseFn(output);
          return createNewBuilder(_def, {
            output,
            middlewares: [
              createOutputMiddleware(parseOutput)
            ]
          });
        },
        meta(meta) {
          return createNewBuilder(_def, {
            meta
          });
        },
        /**
        * @deprecated
        * This functionality is deprecated and will be removed in the next major version.
        */
        unstable_concat(builder) {
          return createNewBuilder(_def, builder._def);
        },
        use(middlewareBuilderOrFn) {
          const middlewares = "_middlewares" in middlewareBuilderOrFn ? middlewareBuilderOrFn._middlewares : [
            middlewareBuilderOrFn
          ];
          return createNewBuilder(_def, {
            middlewares
          });
        },
        query(resolver) {
          return createResolver({
            ..._def,
            query: true
          }, resolver);
        },
        mutation(resolver) {
          return createResolver({
            ..._def,
            mutation: true
          }, resolver);
        },
        subscription(resolver) {
          return createResolver({
            ..._def,
            subscription: true
          }, resolver);
        }
      };
    }
    function createResolver(_def, resolver) {
      const finalBuilder = createNewBuilder(_def, {
        resolver,
        middlewares: [
          async function resolveMiddleware(opts) {
            const data = await resolver(opts);
            return {
              marker: middlewareMarker,
              ok: true,
              data,
              ctx: opts.ctx
            };
          }
        ]
      });
      return createProcedureCaller(finalBuilder._def);
    }
    var codeblock = `
If you want to call this function on the server, you do the following:
This is a client-only function.

const caller = appRouter.createCaller({
  /* ... your context */
});

const result = await caller.call('myProcedure', input);
`.trim();
    function createProcedureCaller(_def) {
      const procedure = async function resolve(opts) {
        if (!opts || !("rawInput" in opts)) {
          throw new Error(codeblock);
        }
        const callRecursive = async (callOpts = {
          index: 0,
          ctx: opts.ctx
        }) => {
          try {
            const middleware = _def.middlewares[callOpts.index];
            const result2 = await middleware({
              ctx: callOpts.ctx,
              type: opts.type,
              path: opts.path,
              rawInput: opts.rawInput,
              meta: _def.meta,
              input: callOpts.input,
              next: async (nextOpts) => {
                return await callRecursive({
                  index: callOpts.index + 1,
                  ctx: nextOpts && "ctx" in nextOpts ? {
                    ...callOpts.ctx,
                    ...nextOpts.ctx
                  } : callOpts.ctx,
                  input: nextOpts && "input" in nextOpts ? nextOpts.input : callOpts.input
                });
              }
            });
            return result2;
          } catch (cause) {
            return {
              ok: false,
              error: TRPCError.getTRPCErrorFromUnknown(cause),
              marker: middlewareMarker
            };
          }
        };
        const result = await callRecursive();
        if (!result) {
          throw new TRPCError.TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "No result from middlewares - did you forget to `return next()`?"
          });
        }
        if (!result.ok) {
          throw result.error;
        }
        return result.data;
      };
      procedure._def = _def;
      procedure.meta = _def.meta;
      return procedure;
    }
    function migrateProcedure(oldProc, type) {
      const def = oldProc._def();
      const inputParser = getParseFnOrPassThrough(def.inputParser);
      const outputParser = getParseFnOrPassThrough(def.outputParser);
      const inputMiddleware = createInputMiddleware(inputParser);
      const builder = createBuilder({
        inputs: [
          def.inputParser
        ],
        middlewares: [
          ...def.middlewares,
          inputMiddleware,
          createOutputMiddleware(outputParser)
        ],
        meta: def.meta,
        output: def.outputParser,
        mutation: type === "mutation",
        query: type === "query",
        subscription: type === "subscription"
      });
      const proc = builder[type]((opts) => def.resolver(opts));
      return proc;
    }
    function migrateRouter(oldRouter) {
      const errorFormatter = oldRouter._def.errorFormatter;
      const transformer = oldRouter._def.transformer;
      const queries = {};
      const mutations = {};
      const subscriptions = {};
      for (const [name, procedure] of Object.entries(oldRouter._def.queries)) {
        queries[name] = migrateProcedure(procedure, "query");
      }
      for (const [name1, procedure1] of Object.entries(oldRouter._def.mutations)) {
        mutations[name1] = migrateProcedure(procedure1, "mutation");
      }
      for (const [name2, procedure2] of Object.entries(oldRouter._def.subscriptions)) {
        subscriptions[name2] = migrateProcedure(procedure2, "subscription");
      }
      const procedures = mergeWithoutOverrides(queries, mutations, subscriptions);
      const newRouter = config.createRouterFactory({
        transformer,
        errorFormatter,
        isDev: process.env.NODE_ENV !== "production"
      })(procedures);
      return newRouter;
    }
    function getDataTransformer(transformer) {
      if ("input" in transformer) {
        return transformer;
      }
      return {
        input: transformer,
        output: transformer
      };
    }
    var PROCEDURE_DEFINITION_MAP = {
      query: "queries",
      mutation: "mutations",
      subscription: "subscriptions"
    };
    function safeObject(...args) {
      return Object.assign(/* @__PURE__ */ Object.create(null), ...args);
    }
    var Router = class {
      static prefixProcedures(procedures, prefix) {
        const eps = safeObject();
        for (const [key, procedure] of Object.entries(procedures)) {
          eps[prefix + key] = procedure;
        }
        return eps;
      }
      query(path, procedure) {
        const router2 = new Router({
          queries: safeObject({
            [path]: createProcedure(procedure)
          })
        });
        return this.merge(router2);
      }
      mutation(path, procedure) {
        const router2 = new Router({
          mutations: safeObject({
            [path]: createProcedure(procedure)
          })
        });
        return this.merge(router2);
      }
      subscription(path, procedure) {
        const router2 = new Router({
          subscriptions: safeObject({
            [path]: createProcedure(procedure)
          })
        });
        return this.merge(router2);
      }
      merge(prefixOrRouter, maybeRouter) {
        let prefix = "";
        let childRouter;
        if (typeof prefixOrRouter === "string" && maybeRouter instanceof Router) {
          prefix = prefixOrRouter;
          childRouter = maybeRouter;
        } else if (prefixOrRouter instanceof Router) {
          childRouter = prefixOrRouter;
        } else {
          throw new Error("Invalid args");
        }
        const duplicateQueries = Object.keys(childRouter._def.queries).filter((key) => !!this._def["queries"][prefix + key]);
        const duplicateMutations = Object.keys(childRouter._def.mutations).filter((key) => !!this._def["mutations"][prefix + key]);
        const duplicateSubscriptions = Object.keys(childRouter._def.subscriptions).filter((key) => !!this._def["subscriptions"][prefix + key]);
        const duplicates = [
          ...duplicateQueries,
          ...duplicateMutations,
          ...duplicateSubscriptions
        ];
        if (duplicates.length) {
          throw new Error(`Duplicate endpoint(s): ${duplicates.join(", ")}`);
        }
        const mergeProcedures = (defs) => {
          const newDefs = safeObject();
          for (const [key, procedure] of Object.entries(defs)) {
            const newProcedure = procedure.inheritMiddlewares(this._def.middlewares);
            newDefs[key] = newProcedure;
          }
          return Router.prefixProcedures(newDefs, prefix);
        };
        return new Router({
          ...this._def,
          queries: safeObject(this._def.queries, mergeProcedures(childRouter._def.queries)),
          mutations: safeObject(this._def.mutations, mergeProcedures(childRouter._def.mutations)),
          subscriptions: safeObject(this._def.subscriptions, mergeProcedures(childRouter._def.subscriptions))
        });
      }
      /**
      * Invoke procedure. Only for internal use within library.
      */
      async call(opts) {
        const { type, path } = opts;
        const defTarget = PROCEDURE_DEFINITION_MAP[type];
        const defs = this._def[defTarget];
        const procedure = defs[path];
        if (!procedure) {
          throw new TRPCError.TRPCError({
            code: "NOT_FOUND",
            message: `No "${type}"-procedure on path "${path}"`
          });
        }
        return procedure.call(opts);
      }
      createCaller(ctx) {
        return {
          query: (path, ...args) => {
            return this.call({
              type: "query",
              ctx,
              path,
              rawInput: args[0]
            });
          },
          mutation: (path, ...args) => {
            return this.call({
              type: "mutation",
              ctx,
              path,
              rawInput: args[0]
            });
          },
          subscription: (path, ...args) => {
            return this.call({
              type: "subscription",
              ctx,
              path,
              rawInput: args[0]
            });
          }
        };
      }
      /**
      * Function to be called before any procedure is invoked
      * @link https://trpc.io/docs/middlewares
      */
      middleware(middleware) {
        return new Router({
          ...this._def,
          middlewares: [
            ...this._def.middlewares,
            middleware
          ]
        });
      }
      /**
      * Format errors
      * @link https://trpc.io/docs/error-formatting
      */
      formatError(errorFormatter) {
        if (this._def.errorFormatter !== config.defaultFormatter) {
          throw new Error("You seem to have double `formatError()`-calls in your router tree");
        }
        return new Router({
          ...this._def,
          errorFormatter
        });
      }
      getErrorShape(opts) {
        const { path, error } = opts;
        const { code } = opts.error;
        const shape = {
          message: error.message,
          code: codes.TRPC_ERROR_CODES_BY_KEY[code],
          data: {
            code,
            httpStatus: config.getHTTPStatusCodeFromError(error)
          }
        };
        if (globalThis.process?.env?.NODE_ENV !== "production" && typeof opts.error.stack === "string") {
          shape.data.stack = opts.error.stack;
        }
        if (typeof path === "string") {
          shape.data.path = path;
        }
        return this._def.errorFormatter({
          ...opts,
          shape
        });
      }
      /**
      * Add data transformer to serialize/deserialize input args + output
      * @link https://trpc.io/docs/data-transformers
      */
      transformer(_transformer) {
        const transformer = getDataTransformer(_transformer);
        if (this._def.transformer !== config.defaultTransformer) {
          throw new Error("You seem to have double `transformer()`-calls in your router tree");
        }
        return new Router({
          ...this._def,
          transformer
        });
      }
      /**
      * Flattens the generics of TQueries/TMutations/TSubscriptions.
      * ⚠️ Experimental - might disappear. ⚠️
      *
      * @alpha
      */
      flat() {
        return this;
      }
      /**
      * Interop mode for v9.x -> v10.x
      */
      interop() {
        return migrateRouter(this);
      }
      constructor(def) {
        this._def = {
          queries: def?.queries ?? safeObject(),
          mutations: def?.mutations ?? safeObject(),
          subscriptions: def?.subscriptions ?? safeObject(),
          middlewares: def?.middlewares ?? [],
          errorFormatter: def?.errorFormatter ?? config.defaultFormatter,
          transformer: def?.transformer ?? config.defaultTransformer
        };
      }
    };
    function router() {
      return new Router();
    }
    function mergeRouters(...routerList) {
      const record = mergeWithoutOverrides({}, ...routerList.map((r) => r._def.record));
      const errorFormatter = routerList.reduce((currentErrorFormatter, nextRouter) => {
        if (nextRouter._def._config.errorFormatter && nextRouter._def._config.errorFormatter !== config.defaultFormatter) {
          if (currentErrorFormatter !== config.defaultFormatter && currentErrorFormatter !== nextRouter._def._config.errorFormatter) {
            throw new Error("You seem to have several error formatters");
          }
          return nextRouter._def._config.errorFormatter;
        }
        return currentErrorFormatter;
      }, config.defaultFormatter);
      const transformer = routerList.reduce((prev, current) => {
        if (current._def._config.transformer && current._def._config.transformer !== config.defaultTransformer) {
          if (prev !== config.defaultTransformer && prev !== current._def._config.transformer) {
            throw new Error("You seem to have several transformers");
          }
          return current._def._config.transformer;
        }
        return prev;
      }, config.defaultTransformer);
      const router2 = config.createRouterFactory({
        errorFormatter,
        transformer,
        isDev: routerList.some((r) => r._def._config.isDev),
        allowOutsideOfServer: routerList.some((r) => r._def._config.allowOutsideOfServer),
        isServer: routerList.some((r) => r._def._config.isServer),
        $types: routerList[0]?._def._config.$types
      })(record);
      return router2;
    }
    function mergeRoutersGeneric(...args) {
      return mergeRouters(...args);
    }
    var TRPCBuilder = class {
      context() {
        return new TRPCBuilder();
      }
      meta() {
        return new TRPCBuilder();
      }
      create(options) {
        return createTRPCInner()(options);
      }
    };
    var initTRPC2 = new TRPCBuilder();
    function createTRPCInner() {
      return function initTRPCInner(runtime) {
        const errorFormatter = runtime?.errorFormatter ?? config.defaultFormatter;
        const transformer = config.getDataTransformer(runtime?.transformer ?? config.defaultTransformer);
        const config$1 = {
          transformer,
          isDev: runtime?.isDev ?? globalThis.process?.env?.NODE_ENV !== "production",
          allowOutsideOfServer: runtime?.allowOutsideOfServer ?? false,
          errorFormatter,
          isServer: runtime?.isServer ?? config.isServerDefault,
          /**
          * @internal
          */
          $types: index.createFlatProxy((key) => {
            throw new Error(`Tried to access "$types.${key}" which is not available at runtime`);
          })
        };
        {
          const isServer = runtime?.isServer ?? config.isServerDefault;
          if (!isServer && runtime?.allowOutsideOfServer !== true) {
            throw new Error(`You're trying to use @trpc/server in a non-server environment. This is not supported by default.`);
          }
        }
        return {
          /**
          * These are just types, they can't be used
          * @internal
          */
          _config: config$1,
          /**
          * Builder object for creating procedures
          */
          procedure: createBuilder(),
          /**
          * Create reusable middlewares
          */
          middleware: createMiddlewareFactory(),
          /**
          * Create a router
          */
          router: config.createRouterFactory(config$1),
          /**
          * Merge Routers
          */
          mergeRouters: mergeRoutersGeneric
        };
      };
    }
    exports.callProcedure = config.callProcedure;
    exports.defaultTransformer = config.defaultTransformer;
    exports.getDataTransformer = config.getDataTransformer;
    exports.procedureTypes = config.procedureTypes;
    exports.TRPCError = TRPCError.TRPCError;
    exports.createInputMiddleware = createInputMiddleware;
    exports.createOutputMiddleware = createOutputMiddleware;
    exports.initTRPC = initTRPC2;
    exports.router = router;
  }
});

// ../../node_modules/.pnpm/@trpc+server@10.10.0/node_modules/@trpc/server/dist/transformTRPCResponse-d2700b72.js
var require_transformTRPCResponse_d2700b72 = __commonJS({
  "../../node_modules/.pnpm/@trpc+server@10.10.0/node_modules/@trpc/server/dist/transformTRPCResponse-d2700b72.js"(exports) {
    "use strict";
    function transformTRPCResponseItem(router, item) {
      if ("error" in item) {
        return {
          ...item,
          error: router._def._config.transformer.output.serialize(item.error)
        };
      }
      if ("data" in item.result) {
        return {
          ...item,
          result: {
            ...item.result,
            data: router._def._config.transformer.output.serialize(item.result.data)
          }
        };
      }
      return item;
    }
    function transformTRPCResponse(router, itemOrItems) {
      return Array.isArray(itemOrItems) ? itemOrItems.map((item) => transformTRPCResponseItem(router, item)) : transformTRPCResponseItem(router, itemOrItems);
    }
    exports.transformTRPCResponse = transformTRPCResponse;
  }
});

// ../../node_modules/.pnpm/@trpc+server@10.10.0/node_modules/@trpc/server/dist/resolveHTTPResponse-3408bbf7.js
var require_resolveHTTPResponse_3408bbf7 = __commonJS({
  "../../node_modules/.pnpm/@trpc+server@10.10.0/node_modules/@trpc/server/dist/resolveHTTPResponse-3408bbf7.js"(exports) {
    "use strict";
    var config = require_config_d356ff77();
    var TRPCError = require_TRPCError_bd37df84();
    var transformTRPCResponse = require_transformTRPCResponse_d2700b72();
    var HTTP_METHOD_PROCEDURE_TYPE_MAP = {
      GET: "query",
      POST: "mutation"
    };
    function getRawProcedureInputOrThrow(req) {
      try {
        if (req.method === "GET") {
          if (!req.query.has("input")) {
            return void 0;
          }
          const raw = req.query.get("input");
          return JSON.parse(raw);
        }
        if (typeof req.body === "string") {
          return req.body.length === 0 ? void 0 : JSON.parse(req.body);
        }
        return req.body;
      } catch (err) {
        throw new TRPCError.TRPCError({
          code: "PARSE_ERROR",
          cause: TRPCError.getCauseFromUnknown(err)
        });
      }
    }
    async function resolveHTTPResponse(opts) {
      const { createContext: createContext2, onError, router, req } = opts;
      const batchingEnabled = opts.batching?.enabled ?? true;
      if (req.method === "HEAD") {
        return {
          status: 204
        };
      }
      const type = HTTP_METHOD_PROCEDURE_TYPE_MAP[req.method] ?? "unknown";
      let ctx = void 0;
      let paths = void 0;
      const isBatchCall = !!req.query.get("batch");
      function endResponse(untransformedJSON, errors) {
        let status = config.getHTTPStatusCode(untransformedJSON);
        const headers = {
          "Content-Type": "application/json"
        };
        const meta = opts.responseMeta?.({
          ctx,
          paths,
          type,
          data: Array.isArray(untransformedJSON) ? untransformedJSON : [
            untransformedJSON
          ],
          errors
        }) ?? {};
        for (const [key, value] of Object.entries(meta.headers ?? {})) {
          headers[key] = value;
        }
        if (meta.status) {
          status = meta.status;
        }
        const transformedJSON = transformTRPCResponse.transformTRPCResponse(router, untransformedJSON);
        const body = JSON.stringify(transformedJSON);
        return {
          body,
          status,
          headers
        };
      }
      try {
        if (opts.error) {
          throw opts.error;
        }
        if (isBatchCall && !batchingEnabled) {
          throw new Error(`Batching is not enabled on the server`);
        }
        if (type === "subscription") {
          throw new TRPCError.TRPCError({
            message: "Subscriptions should use wsLink",
            code: "METHOD_NOT_SUPPORTED"
          });
        }
        if (type === "unknown") {
          throw new TRPCError.TRPCError({
            message: `Unexpected request method ${req.method}`,
            code: "METHOD_NOT_SUPPORTED"
          });
        }
        const rawInput = getRawProcedureInputOrThrow(req);
        paths = isBatchCall ? opts.path.split(",") : [
          opts.path
        ];
        ctx = await createContext2();
        const deserializeInputValue = (rawValue) => {
          return typeof rawValue !== "undefined" ? router._def._config.transformer.input.deserialize(rawValue) : rawValue;
        };
        const getInputs = () => {
          if (!isBatchCall) {
            return {
              0: deserializeInputValue(rawInput)
            };
          }
          if (rawInput == null || typeof rawInput !== "object" || Array.isArray(rawInput)) {
            throw new TRPCError.TRPCError({
              code: "BAD_REQUEST",
              message: '"input" needs to be an object when doing a batch call'
            });
          }
          const input = {};
          for (const key in rawInput) {
            const k = key;
            const rawValue = rawInput[k];
            const value = deserializeInputValue(rawValue);
            input[k] = value;
          }
          return input;
        };
        const inputs = getInputs();
        const rawResults = await Promise.all(paths.map(async (path, index) => {
          const input = inputs[index];
          try {
            const output = await config.callProcedure({
              procedures: router._def.procedures,
              path,
              rawInput: input,
              ctx,
              type
            });
            return {
              input,
              path,
              data: output
            };
          } catch (cause) {
            const error = TRPCError.getTRPCErrorFromUnknown(cause);
            onError?.({
              error,
              path,
              input,
              ctx,
              type,
              req
            });
            return {
              input,
              path,
              error
            };
          }
        }));
        const errors = rawResults.flatMap((obj) => obj.error ? [
          obj.error
        ] : []);
        const resultEnvelopes = rawResults.map((obj) => {
          const { path, input } = obj;
          if (obj.error) {
            return {
              error: router.getErrorShape({
                error: obj.error,
                type,
                path,
                input,
                ctx
              })
            };
          } else {
            return {
              result: {
                data: obj.data
              }
            };
          }
        });
        const result = isBatchCall ? resultEnvelopes : resultEnvelopes[0];
        return endResponse(result, errors);
      } catch (cause) {
        const error = TRPCError.getTRPCErrorFromUnknown(cause);
        onError?.({
          error,
          path: void 0,
          input: void 0,
          ctx,
          type,
          req
        });
        return endResponse({
          error: router.getErrorShape({
            error,
            type,
            path: void 0,
            input: void 0,
            ctx
          })
        }, [
          error
        ]);
      }
    }
    exports.resolveHTTPResponse = resolveHTTPResponse;
  }
});

// ../../node_modules/.pnpm/@trpc+server@10.10.0/node_modules/@trpc/server/dist/adapters/aws-lambda/index.js
var require_aws_lambda = __commonJS({
  "../../node_modules/.pnpm/@trpc+server@10.10.0/node_modules/@trpc/server/dist/adapters/aws-lambda/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TRPCError = require_TRPCError_bd37df84();
    require_config_d356ff77();
    require_codes_e0ea0f4c();
    var resolveHTTPResponse = require_resolveHTTPResponse_3408bbf7();
    require_index_4d2d31b6();
    require_transformTRPCResponse_d2700b72();
    function isPayloadV1(event) {
      return determinePayloadFormat(event) == "1.0";
    }
    function isPayloadV2(event) {
      return determinePayloadFormat(event) == "2.0";
    }
    function determinePayloadFormat(event) {
      const unknownEvent = event;
      if (typeof unknownEvent.version === "undefined") {
        return "1.0";
      } else {
        if ([
          "1.0",
          "2.0"
        ].includes(unknownEvent.version)) {
          return unknownEvent.version;
        } else {
          return "custom";
        }
      }
    }
    function getHTTPMethod(event) {
      if (isPayloadV1(event)) {
        return event.httpMethod;
      }
      if (isPayloadV2(event)) {
        return event.requestContext.http.method;
      }
      throw new TRPCError.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: UNKNOWN_PAYLOAD_FORMAT_VERSION_ERROR_MESSAGE
      });
    }
    function getPath(event) {
      if (isPayloadV1(event)) {
        const matches = event.resource.matchAll(/\{(.*?)\}/g);
        for (const match of matches) {
          const group = match[1];
          if (group.includes("+") && event.pathParameters) {
            return event.pathParameters[group.replace("+", "")] || "";
          }
        }
        return event.path.slice(1);
      }
      if (isPayloadV2(event)) {
        const matches1 = event.routeKey.matchAll(/\{(.*?)\}/g);
        for (const match1 of matches1) {
          const group1 = match1[1];
          if (group1.includes("+") && event.pathParameters) {
            return event.pathParameters[group1.replace("+", "")] || "";
          }
        }
        return event.rawPath.slice(1);
      }
      throw new TRPCError.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: UNKNOWN_PAYLOAD_FORMAT_VERSION_ERROR_MESSAGE
      });
    }
    function transformHeaders(headers) {
      const obj = {};
      for (const [key, value] of Object.entries(headers)) {
        if (typeof value === "undefined") {
          continue;
        }
        obj[key] = Array.isArray(value) ? value.join(",") : value;
      }
      return obj;
    }
    var UNKNOWN_PAYLOAD_FORMAT_VERSION_ERROR_MESSAGE = "Custom payload format version not handled by this adapter. Please use either 1.0 or 2.0. More information herehttps://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html";
    function lambdaEventToHTTPRequest(event) {
      const query = new URLSearchParams();
      for (const [key, value] of Object.entries(event.queryStringParameters ?? {})) {
        if (typeof value !== "undefined") {
          query.append(key, value);
        }
      }
      let body;
      if (event.body && event.isBase64Encoded) {
        body = Buffer.from(event.body, "base64").toString("utf8");
      } else {
        body = event.body;
      }
      return {
        method: getHTTPMethod(event),
        query,
        headers: event.headers,
        body
      };
    }
    function tRPCOutputToAPIGatewayOutput(event, response) {
      if (isPayloadV1(event)) {
        const resp = {
          statusCode: response.status,
          body: response.body ?? "",
          headers: transformHeaders(response.headers ?? {})
        };
        return resp;
      } else if (isPayloadV2(event)) {
        const resp1 = {
          statusCode: response.status,
          body: response.body ?? void 0,
          headers: transformHeaders(response.headers ?? {})
        };
        return resp1;
      } else {
        throw new TRPCError.TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: UNKNOWN_PAYLOAD_FORMAT_VERSION_ERROR_MESSAGE
        });
      }
    }
    function awsLambdaRequestHandler2(opts) {
      return async (event, context) => {
        const req = lambdaEventToHTTPRequest(event);
        const path = getPath(event);
        const createContext2 = async function _createContext() {
          return await opts.createContext?.({
            event,
            context
          });
        };
        const response = await resolveHTTPResponse.resolveHTTPResponse({
          router: opts.router,
          batching: opts.batching,
          responseMeta: opts?.responseMeta,
          createContext: createContext2,
          req,
          path,
          error: null,
          onError(o) {
            opts?.onError?.({
              ...o,
              req: event
            });
          }
        });
        return tRPCOutputToAPIGatewayOutput(event, response);
      };
    }
    exports.UNKNOWN_PAYLOAD_FORMAT_VERSION_ERROR_MESSAGE = UNKNOWN_PAYLOAD_FORMAT_VERSION_ERROR_MESSAGE;
    exports.awsLambdaRequestHandler = awsLambdaRequestHandler2;
    exports.getHTTPMethod = getHTTPMethod;
    exports.getPath = getPath;
    exports.isPayloadV1 = isPayloadV1;
    exports.isPayloadV2 = isPayloadV2;
    exports.transformHeaders = transformHeaders;
  }
});

// ../../node_modules/.pnpm/@trpc+server@10.10.0/node_modules/@trpc/server/adapters/aws-lambda/index.js
var require_aws_lambda2 = __commonJS({
  "../../node_modules/.pnpm/@trpc+server@10.10.0/node_modules/@trpc/server/adapters/aws-lambda/index.js"(exports, module2) {
    module2.exports = require_aws_lambda();
  }
});

// ../../node_modules/.pnpm/zod@3.20.3/node_modules/zod/lib/helpers/util.js
var require_util = __commonJS({
  "../../node_modules/.pnpm/zod@3.20.3/node_modules/zod/lib/helpers/util.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getParsedType = exports.ZodParsedType = exports.util = void 0;
    var util;
    (function(util2) {
      util2.assertEqual = (val) => val;
      function assertIs(_arg) {
      }
      util2.assertIs = assertIs;
      function assertNever(_x) {
        throw new Error();
      }
      util2.assertNever = assertNever;
      util2.arrayToEnum = (items) => {
        const obj = {};
        for (const item of items) {
          obj[item] = item;
        }
        return obj;
      };
      util2.getValidEnumValues = (obj) => {
        const validKeys = util2.objectKeys(obj).filter((k) => typeof obj[obj[k]] !== "number");
        const filtered = {};
        for (const k of validKeys) {
          filtered[k] = obj[k];
        }
        return util2.objectValues(filtered);
      };
      util2.objectValues = (obj) => {
        return util2.objectKeys(obj).map(function(e) {
          return obj[e];
        });
      };
      util2.objectKeys = typeof Object.keys === "function" ? (obj) => Object.keys(obj) : (object) => {
        const keys = [];
        for (const key in object) {
          if (Object.prototype.hasOwnProperty.call(object, key)) {
            keys.push(key);
          }
        }
        return keys;
      };
      util2.find = (arr, checker) => {
        for (const item of arr) {
          if (checker(item))
            return item;
        }
        return void 0;
      };
      util2.isInteger = typeof Number.isInteger === "function" ? (val) => Number.isInteger(val) : (val) => typeof val === "number" && isFinite(val) && Math.floor(val) === val;
      function joinValues(array, separator = " | ") {
        return array.map((val) => typeof val === "string" ? `'${val}'` : val).join(separator);
      }
      util2.joinValues = joinValues;
      util2.jsonStringifyReplacer = (_, value) => {
        if (typeof value === "bigint") {
          return value.toString();
        }
        return value;
      };
    })(util = exports.util || (exports.util = {}));
    exports.ZodParsedType = util.arrayToEnum([
      "string",
      "nan",
      "number",
      "integer",
      "float",
      "boolean",
      "date",
      "bigint",
      "symbol",
      "function",
      "undefined",
      "null",
      "array",
      "object",
      "unknown",
      "promise",
      "void",
      "never",
      "map",
      "set"
    ]);
    var getParsedType = (data) => {
      const t2 = typeof data;
      switch (t2) {
        case "undefined":
          return exports.ZodParsedType.undefined;
        case "string":
          return exports.ZodParsedType.string;
        case "number":
          return isNaN(data) ? exports.ZodParsedType.nan : exports.ZodParsedType.number;
        case "boolean":
          return exports.ZodParsedType.boolean;
        case "function":
          return exports.ZodParsedType.function;
        case "bigint":
          return exports.ZodParsedType.bigint;
        case "symbol":
          return exports.ZodParsedType.symbol;
        case "object":
          if (Array.isArray(data)) {
            return exports.ZodParsedType.array;
          }
          if (data === null) {
            return exports.ZodParsedType.null;
          }
          if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
            return exports.ZodParsedType.promise;
          }
          if (typeof Map !== "undefined" && data instanceof Map) {
            return exports.ZodParsedType.map;
          }
          if (typeof Set !== "undefined" && data instanceof Set) {
            return exports.ZodParsedType.set;
          }
          if (typeof Date !== "undefined" && data instanceof Date) {
            return exports.ZodParsedType.date;
          }
          return exports.ZodParsedType.object;
        default:
          return exports.ZodParsedType.unknown;
      }
    };
    exports.getParsedType = getParsedType;
  }
});

// ../../node_modules/.pnpm/zod@3.20.3/node_modules/zod/lib/ZodError.js
var require_ZodError = __commonJS({
  "../../node_modules/.pnpm/zod@3.20.3/node_modules/zod/lib/ZodError.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ZodError = exports.quotelessJson = exports.ZodIssueCode = void 0;
    var util_1 = require_util();
    exports.ZodIssueCode = util_1.util.arrayToEnum([
      "invalid_type",
      "invalid_literal",
      "custom",
      "invalid_union",
      "invalid_union_discriminator",
      "invalid_enum_value",
      "unrecognized_keys",
      "invalid_arguments",
      "invalid_return_type",
      "invalid_date",
      "invalid_string",
      "too_small",
      "too_big",
      "invalid_intersection_types",
      "not_multiple_of",
      "not_finite"
    ]);
    var quotelessJson = (obj) => {
      const json = JSON.stringify(obj, null, 2);
      return json.replace(/"([^"]+)":/g, "$1:");
    };
    exports.quotelessJson = quotelessJson;
    var ZodError = class extends Error {
      constructor(issues) {
        super();
        this.issues = [];
        this.addIssue = (sub) => {
          this.issues = [...this.issues, sub];
        };
        this.addIssues = (subs = []) => {
          this.issues = [...this.issues, ...subs];
        };
        const actualProto = new.target.prototype;
        if (Object.setPrototypeOf) {
          Object.setPrototypeOf(this, actualProto);
        } else {
          this.__proto__ = actualProto;
        }
        this.name = "ZodError";
        this.issues = issues;
      }
      get errors() {
        return this.issues;
      }
      format(_mapper) {
        const mapper = _mapper || function(issue) {
          return issue.message;
        };
        const fieldErrors = { _errors: [] };
        const processError = (error) => {
          for (const issue of error.issues) {
            if (issue.code === "invalid_union") {
              issue.unionErrors.map(processError);
            } else if (issue.code === "invalid_return_type") {
              processError(issue.returnTypeError);
            } else if (issue.code === "invalid_arguments") {
              processError(issue.argumentsError);
            } else if (issue.path.length === 0) {
              fieldErrors._errors.push(mapper(issue));
            } else {
              let curr = fieldErrors;
              let i = 0;
              while (i < issue.path.length) {
                const el = issue.path[i];
                const terminal = i === issue.path.length - 1;
                if (!terminal) {
                  curr[el] = curr[el] || { _errors: [] };
                } else {
                  curr[el] = curr[el] || { _errors: [] };
                  curr[el]._errors.push(mapper(issue));
                }
                curr = curr[el];
                i++;
              }
            }
          }
        };
        processError(this);
        return fieldErrors;
      }
      toString() {
        return this.message;
      }
      get message() {
        return JSON.stringify(this.issues, util_1.util.jsonStringifyReplacer, 2);
      }
      get isEmpty() {
        return this.issues.length === 0;
      }
      flatten(mapper = (issue) => issue.message) {
        const fieldErrors = {};
        const formErrors = [];
        for (const sub of this.issues) {
          if (sub.path.length > 0) {
            fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
            fieldErrors[sub.path[0]].push(mapper(sub));
          } else {
            formErrors.push(mapper(sub));
          }
        }
        return { formErrors, fieldErrors };
      }
      get formErrors() {
        return this.flatten();
      }
    };
    exports.ZodError = ZodError;
    ZodError.create = (issues) => {
      const error = new ZodError(issues);
      return error;
    };
  }
});

// ../../node_modules/.pnpm/zod@3.20.3/node_modules/zod/lib/locales/en.js
var require_en = __commonJS({
  "../../node_modules/.pnpm/zod@3.20.3/node_modules/zod/lib/locales/en.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var util_1 = require_util();
    var ZodError_1 = require_ZodError();
    var errorMap = (issue, _ctx) => {
      let message;
      switch (issue.code) {
        case ZodError_1.ZodIssueCode.invalid_type:
          if (issue.received === util_1.ZodParsedType.undefined) {
            message = "Required";
          } else {
            message = `Expected ${issue.expected}, received ${issue.received}`;
          }
          break;
        case ZodError_1.ZodIssueCode.invalid_literal:
          message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util_1.util.jsonStringifyReplacer)}`;
          break;
        case ZodError_1.ZodIssueCode.unrecognized_keys:
          message = `Unrecognized key(s) in object: ${util_1.util.joinValues(issue.keys, ", ")}`;
          break;
        case ZodError_1.ZodIssueCode.invalid_union:
          message = `Invalid input`;
          break;
        case ZodError_1.ZodIssueCode.invalid_union_discriminator:
          message = `Invalid discriminator value. Expected ${util_1.util.joinValues(issue.options)}`;
          break;
        case ZodError_1.ZodIssueCode.invalid_enum_value:
          message = `Invalid enum value. Expected ${util_1.util.joinValues(issue.options)}, received '${issue.received}'`;
          break;
        case ZodError_1.ZodIssueCode.invalid_arguments:
          message = `Invalid function arguments`;
          break;
        case ZodError_1.ZodIssueCode.invalid_return_type:
          message = `Invalid function return type`;
          break;
        case ZodError_1.ZodIssueCode.invalid_date:
          message = `Invalid date`;
          break;
        case ZodError_1.ZodIssueCode.invalid_string:
          if (typeof issue.validation === "object") {
            if ("startsWith" in issue.validation) {
              message = `Invalid input: must start with "${issue.validation.startsWith}"`;
            } else if ("endsWith" in issue.validation) {
              message = `Invalid input: must end with "${issue.validation.endsWith}"`;
            } else {
              util_1.util.assertNever(issue.validation);
            }
          } else if (issue.validation !== "regex") {
            message = `Invalid ${issue.validation}`;
          } else {
            message = "Invalid";
          }
          break;
        case ZodError_1.ZodIssueCode.too_small:
          if (issue.type === "array")
            message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
          else if (issue.type === "string")
            message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
          else if (issue.type === "number")
            message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
          else if (issue.type === "date")
            message = `Date must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${new Date(issue.minimum)}`;
          else
            message = "Invalid input";
          break;
        case ZodError_1.ZodIssueCode.too_big:
          if (issue.type === "array")
            message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
          else if (issue.type === "string")
            message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
          else if (issue.type === "number")
            message = `Number must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
          else if (issue.type === "date")
            message = `Date must be ${issue.exact ? `exactly` : issue.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(issue.maximum)}`;
          else
            message = "Invalid input";
          break;
        case ZodError_1.ZodIssueCode.custom:
          message = `Invalid input`;
          break;
        case ZodError_1.ZodIssueCode.invalid_intersection_types:
          message = `Intersection results could not be merged`;
          break;
        case ZodError_1.ZodIssueCode.not_multiple_of:
          message = `Number must be a multiple of ${issue.multipleOf}`;
          break;
        case ZodError_1.ZodIssueCode.not_finite:
          message = "Number must be finite";
          break;
        default:
          message = _ctx.defaultError;
          util_1.util.assertNever(issue);
      }
      return { message };
    };
    exports.default = errorMap;
  }
});

// ../../node_modules/.pnpm/zod@3.20.3/node_modules/zod/lib/errors.js
var require_errors = __commonJS({
  "../../node_modules/.pnpm/zod@3.20.3/node_modules/zod/lib/errors.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getErrorMap = exports.setErrorMap = exports.defaultErrorMap = void 0;
    var en_1 = __importDefault(require_en());
    exports.defaultErrorMap = en_1.default;
    var overrideErrorMap = en_1.default;
    function setErrorMap(map) {
      overrideErrorMap = map;
    }
    exports.setErrorMap = setErrorMap;
    function getErrorMap() {
      return overrideErrorMap;
    }
    exports.getErrorMap = getErrorMap;
  }
});

// ../../node_modules/.pnpm/zod@3.20.3/node_modules/zod/lib/helpers/parseUtil.js
var require_parseUtil = __commonJS({
  "../../node_modules/.pnpm/zod@3.20.3/node_modules/zod/lib/helpers/parseUtil.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isAsync = exports.isValid = exports.isDirty = exports.isAborted = exports.OK = exports.DIRTY = exports.INVALID = exports.ParseStatus = exports.addIssueToContext = exports.EMPTY_PATH = exports.makeIssue = void 0;
    var errors_1 = require_errors();
    var en_1 = __importDefault(require_en());
    var makeIssue = (params) => {
      const { data, path, errorMaps, issueData } = params;
      const fullPath = [...path, ...issueData.path || []];
      const fullIssue = {
        ...issueData,
        path: fullPath
      };
      let errorMessage = "";
      const maps = errorMaps.filter((m) => !!m).slice().reverse();
      for (const map of maps) {
        errorMessage = map(fullIssue, { data, defaultError: errorMessage }).message;
      }
      return {
        ...issueData,
        path: fullPath,
        message: issueData.message || errorMessage
      };
    };
    exports.makeIssue = makeIssue;
    exports.EMPTY_PATH = [];
    function addIssueToContext(ctx, issueData) {
      const issue = (0, exports.makeIssue)({
        issueData,
        data: ctx.data,
        path: ctx.path,
        errorMaps: [
          ctx.common.contextualErrorMap,
          ctx.schemaErrorMap,
          (0, errors_1.getErrorMap)(),
          en_1.default
          // then global default map
        ].filter((x) => !!x)
      });
      ctx.common.issues.push(issue);
    }
    exports.addIssueToContext = addIssueToContext;
    var ParseStatus = class {
      constructor() {
        this.value = "valid";
      }
      dirty() {
        if (this.value === "valid")
          this.value = "dirty";
      }
      abort() {
        if (this.value !== "aborted")
          this.value = "aborted";
      }
      static mergeArray(status, results) {
        const arrayValue = [];
        for (const s of results) {
          if (s.status === "aborted")
            return exports.INVALID;
          if (s.status === "dirty")
            status.dirty();
          arrayValue.push(s.value);
        }
        return { status: status.value, value: arrayValue };
      }
      static async mergeObjectAsync(status, pairs) {
        const syncPairs = [];
        for (const pair of pairs) {
          syncPairs.push({
            key: await pair.key,
            value: await pair.value
          });
        }
        return ParseStatus.mergeObjectSync(status, syncPairs);
      }
      static mergeObjectSync(status, pairs) {
        const finalObject = {};
        for (const pair of pairs) {
          const { key, value } = pair;
          if (key.status === "aborted")
            return exports.INVALID;
          if (value.status === "aborted")
            return exports.INVALID;
          if (key.status === "dirty")
            status.dirty();
          if (value.status === "dirty")
            status.dirty();
          if (typeof value.value !== "undefined" || pair.alwaysSet) {
            finalObject[key.value] = value.value;
          }
        }
        return { status: status.value, value: finalObject };
      }
    };
    exports.ParseStatus = ParseStatus;
    exports.INVALID = Object.freeze({
      status: "aborted"
    });
    var DIRTY = (value) => ({ status: "dirty", value });
    exports.DIRTY = DIRTY;
    var OK = (value) => ({ status: "valid", value });
    exports.OK = OK;
    var isAborted = (x) => x.status === "aborted";
    exports.isAborted = isAborted;
    var isDirty = (x) => x.status === "dirty";
    exports.isDirty = isDirty;
    var isValid = (x) => x.status === "valid";
    exports.isValid = isValid;
    var isAsync = (x) => typeof Promise !== "undefined" && x instanceof Promise;
    exports.isAsync = isAsync;
  }
});

// ../../node_modules/.pnpm/zod@3.20.3/node_modules/zod/lib/helpers/typeAliases.js
var require_typeAliases = __commonJS({
  "../../node_modules/.pnpm/zod@3.20.3/node_modules/zod/lib/helpers/typeAliases.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/zod@3.20.3/node_modules/zod/lib/helpers/errorUtil.js
var require_errorUtil = __commonJS({
  "../../node_modules/.pnpm/zod@3.20.3/node_modules/zod/lib/helpers/errorUtil.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.errorUtil = void 0;
    var errorUtil;
    (function(errorUtil2) {
      errorUtil2.errToObj = (message) => typeof message === "string" ? { message } : message || {};
      errorUtil2.toString = (message) => typeof message === "string" ? message : message === null || message === void 0 ? void 0 : message.message;
    })(errorUtil = exports.errorUtil || (exports.errorUtil = {}));
  }
});

// ../../node_modules/.pnpm/zod@3.20.3/node_modules/zod/lib/types.js
var require_types = __commonJS({
  "../../node_modules/.pnpm/zod@3.20.3/node_modules/zod/lib/types.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.date = exports.boolean = exports.bigint = exports.array = exports.any = exports.coerce = exports.ZodFirstPartyTypeKind = exports.late = exports.ZodSchema = exports.Schema = exports.custom = exports.ZodPipeline = exports.ZodBranded = exports.BRAND = exports.ZodNaN = exports.ZodCatch = exports.ZodDefault = exports.ZodNullable = exports.ZodOptional = exports.ZodTransformer = exports.ZodEffects = exports.ZodPromise = exports.ZodNativeEnum = exports.ZodEnum = exports.ZodLiteral = exports.ZodLazy = exports.ZodFunction = exports.ZodSet = exports.ZodMap = exports.ZodRecord = exports.ZodTuple = exports.ZodIntersection = exports.ZodDiscriminatedUnion = exports.ZodUnion = exports.ZodObject = exports.objectUtil = exports.ZodArray = exports.ZodVoid = exports.ZodNever = exports.ZodUnknown = exports.ZodAny = exports.ZodNull = exports.ZodUndefined = exports.ZodSymbol = exports.ZodDate = exports.ZodBoolean = exports.ZodBigInt = exports.ZodNumber = exports.ZodString = exports.ZodType = void 0;
    exports.NEVER = exports.void = exports.unknown = exports.union = exports.undefined = exports.tuple = exports.transformer = exports.symbol = exports.string = exports.strictObject = exports.set = exports.record = exports.promise = exports.preprocess = exports.pipeline = exports.ostring = exports.optional = exports.onumber = exports.oboolean = exports.object = exports.number = exports.nullable = exports.null = exports.never = exports.nativeEnum = exports.nan = exports.map = exports.literal = exports.lazy = exports.intersection = exports.instanceof = exports.function = exports.enum = exports.effect = exports.discriminatedUnion = void 0;
    var errors_1 = require_errors();
    var errorUtil_1 = require_errorUtil();
    var parseUtil_1 = require_parseUtil();
    var util_1 = require_util();
    var ZodError_1 = require_ZodError();
    var ParseInputLazyPath = class {
      constructor(parent, value, path, key) {
        this.parent = parent;
        this.data = value;
        this._path = path;
        this._key = key;
      }
      get path() {
        return this._path.concat(this._key);
      }
    };
    var handleResult = (ctx, result) => {
      if ((0, parseUtil_1.isValid)(result)) {
        return { success: true, data: result.value };
      } else {
        if (!ctx.common.issues.length) {
          throw new Error("Validation failed but no issues detected.");
        }
        const error = new ZodError_1.ZodError(ctx.common.issues);
        return { success: false, error };
      }
    };
    function processCreateParams(params) {
      if (!params)
        return {};
      const { errorMap, invalid_type_error, required_error, description } = params;
      if (errorMap && (invalid_type_error || required_error)) {
        throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
      }
      if (errorMap)
        return { errorMap, description };
      const customMap = (iss, ctx) => {
        if (iss.code !== "invalid_type")
          return { message: ctx.defaultError };
        if (typeof ctx.data === "undefined") {
          return { message: required_error !== null && required_error !== void 0 ? required_error : ctx.defaultError };
        }
        return { message: invalid_type_error !== null && invalid_type_error !== void 0 ? invalid_type_error : ctx.defaultError };
      };
      return { errorMap: customMap, description };
    }
    var ZodType = class {
      constructor(def) {
        this.spa = this.safeParseAsync;
        this._def = def;
        this.parse = this.parse.bind(this);
        this.safeParse = this.safeParse.bind(this);
        this.parseAsync = this.parseAsync.bind(this);
        this.safeParseAsync = this.safeParseAsync.bind(this);
        this.spa = this.spa.bind(this);
        this.refine = this.refine.bind(this);
        this.refinement = this.refinement.bind(this);
        this.superRefine = this.superRefine.bind(this);
        this.optional = this.optional.bind(this);
        this.nullable = this.nullable.bind(this);
        this.nullish = this.nullish.bind(this);
        this.array = this.array.bind(this);
        this.promise = this.promise.bind(this);
        this.or = this.or.bind(this);
        this.and = this.and.bind(this);
        this.transform = this.transform.bind(this);
        this.brand = this.brand.bind(this);
        this.default = this.default.bind(this);
        this.catch = this.catch.bind(this);
        this.describe = this.describe.bind(this);
        this.pipe = this.pipe.bind(this);
        this.isNullable = this.isNullable.bind(this);
        this.isOptional = this.isOptional.bind(this);
      }
      get description() {
        return this._def.description;
      }
      _getType(input) {
        return (0, util_1.getParsedType)(input.data);
      }
      _getOrReturnCtx(input, ctx) {
        return ctx || {
          common: input.parent.common,
          data: input.data,
          parsedType: (0, util_1.getParsedType)(input.data),
          schemaErrorMap: this._def.errorMap,
          path: input.path,
          parent: input.parent
        };
      }
      _processInputParams(input) {
        return {
          status: new parseUtil_1.ParseStatus(),
          ctx: {
            common: input.parent.common,
            data: input.data,
            parsedType: (0, util_1.getParsedType)(input.data),
            schemaErrorMap: this._def.errorMap,
            path: input.path,
            parent: input.parent
          }
        };
      }
      _parseSync(input) {
        const result = this._parse(input);
        if ((0, parseUtil_1.isAsync)(result)) {
          throw new Error("Synchronous parse encountered promise.");
        }
        return result;
      }
      _parseAsync(input) {
        const result = this._parse(input);
        return Promise.resolve(result);
      }
      parse(data, params) {
        const result = this.safeParse(data, params);
        if (result.success)
          return result.data;
        throw result.error;
      }
      safeParse(data, params) {
        var _a;
        const ctx = {
          common: {
            issues: [],
            async: (_a = params === null || params === void 0 ? void 0 : params.async) !== null && _a !== void 0 ? _a : false,
            contextualErrorMap: params === null || params === void 0 ? void 0 : params.errorMap
          },
          path: (params === null || params === void 0 ? void 0 : params.path) || [],
          schemaErrorMap: this._def.errorMap,
          parent: null,
          data,
          parsedType: (0, util_1.getParsedType)(data)
        };
        const result = this._parseSync({ data, path: ctx.path, parent: ctx });
        return handleResult(ctx, result);
      }
      async parseAsync(data, params) {
        const result = await this.safeParseAsync(data, params);
        if (result.success)
          return result.data;
        throw result.error;
      }
      async safeParseAsync(data, params) {
        const ctx = {
          common: {
            issues: [],
            contextualErrorMap: params === null || params === void 0 ? void 0 : params.errorMap,
            async: true
          },
          path: (params === null || params === void 0 ? void 0 : params.path) || [],
          schemaErrorMap: this._def.errorMap,
          parent: null,
          data,
          parsedType: (0, util_1.getParsedType)(data)
        };
        const maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx });
        const result = await ((0, parseUtil_1.isAsync)(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult));
        return handleResult(ctx, result);
      }
      refine(check, message) {
        const getIssueProperties = (val) => {
          if (typeof message === "string" || typeof message === "undefined") {
            return { message };
          } else if (typeof message === "function") {
            return message(val);
          } else {
            return message;
          }
        };
        return this._refinement((val, ctx) => {
          const result = check(val);
          const setError = () => ctx.addIssue({
            code: ZodError_1.ZodIssueCode.custom,
            ...getIssueProperties(val)
          });
          if (typeof Promise !== "undefined" && result instanceof Promise) {
            return result.then((data) => {
              if (!data) {
                setError();
                return false;
              } else {
                return true;
              }
            });
          }
          if (!result) {
            setError();
            return false;
          } else {
            return true;
          }
        });
      }
      refinement(check, refinementData) {
        return this._refinement((val, ctx) => {
          if (!check(val)) {
            ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
            return false;
          } else {
            return true;
          }
        });
      }
      _refinement(refinement) {
        return new ZodEffects({
          schema: this,
          typeName: ZodFirstPartyTypeKind.ZodEffects,
          effect: { type: "refinement", refinement }
        });
      }
      superRefine(refinement) {
        return this._refinement(refinement);
      }
      optional() {
        return ZodOptional.create(this, this._def);
      }
      nullable() {
        return ZodNullable.create(this, this._def);
      }
      nullish() {
        return this.nullable().optional();
      }
      array() {
        return ZodArray.create(this, this._def);
      }
      promise() {
        return ZodPromise.create(this, this._def);
      }
      or(option) {
        return ZodUnion.create([this, option], this._def);
      }
      and(incoming) {
        return ZodIntersection.create(this, incoming, this._def);
      }
      transform(transform) {
        return new ZodEffects({
          ...processCreateParams(this._def),
          schema: this,
          typeName: ZodFirstPartyTypeKind.ZodEffects,
          effect: { type: "transform", transform }
        });
      }
      default(def) {
        const defaultValueFunc = typeof def === "function" ? def : () => def;
        return new ZodDefault({
          ...processCreateParams(this._def),
          innerType: this,
          defaultValue: defaultValueFunc,
          typeName: ZodFirstPartyTypeKind.ZodDefault
        });
      }
      brand() {
        return new ZodBranded({
          typeName: ZodFirstPartyTypeKind.ZodBranded,
          type: this,
          ...processCreateParams(this._def)
        });
      }
      catch(def) {
        const catchValueFunc = typeof def === "function" ? def : () => def;
        return new ZodCatch({
          ...processCreateParams(this._def),
          innerType: this,
          catchValue: catchValueFunc,
          typeName: ZodFirstPartyTypeKind.ZodCatch
        });
      }
      describe(description) {
        const This = this.constructor;
        return new This({
          ...this._def,
          description
        });
      }
      pipe(target) {
        return ZodPipeline.create(this, target);
      }
      isOptional() {
        return this.safeParse(void 0).success;
      }
      isNullable() {
        return this.safeParse(null).success;
      }
    };
    exports.ZodType = ZodType;
    exports.Schema = ZodType;
    exports.ZodSchema = ZodType;
    var cuidRegex = /^c[^\s-]{8,}$/i;
    var cuid2Regex = /^[a-z][a-z0-9]*$/;
    var uuidRegex = /^([a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[a-f0-9]{4}-[a-f0-9]{12}|00000000-0000-0000-0000-000000000000)$/i;
    var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|([^-]([a-zA-Z0-9-]*\.)+[a-zA-Z]{2,}))$/;
    var datetimeRegex = (args) => {
      if (args.precision) {
        if (args.offset) {
          return new RegExp(`^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{${args.precision}}(([+-]\\d{2}(:?\\d{2})?)|Z)$`);
        } else {
          return new RegExp(`^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{${args.precision}}Z$`);
        }
      } else if (args.precision === 0) {
        if (args.offset) {
          return new RegExp(`^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(([+-]\\d{2}(:?\\d{2})?)|Z)$`);
        } else {
          return new RegExp(`^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z$`);
        }
      } else {
        if (args.offset) {
          return new RegExp(`^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?(([+-]\\d{2}(:?\\d{2})?)|Z)$`);
        } else {
          return new RegExp(`^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?Z$`);
        }
      }
    };
    var ZodString = class extends ZodType {
      constructor() {
        super(...arguments);
        this._regex = (regex, validation, message) => this.refinement((data) => regex.test(data), {
          validation,
          code: ZodError_1.ZodIssueCode.invalid_string,
          ...errorUtil_1.errorUtil.errToObj(message)
        });
        this.nonempty = (message) => this.min(1, errorUtil_1.errorUtil.errToObj(message));
        this.trim = () => new ZodString({
          ...this._def,
          checks: [...this._def.checks, { kind: "trim" }]
        });
      }
      _parse(input) {
        if (this._def.coerce) {
          input.data = String(input.data);
        }
        const parsedType = this._getType(input);
        if (parsedType !== util_1.ZodParsedType.string) {
          const ctx2 = this._getOrReturnCtx(input);
          (0, parseUtil_1.addIssueToContext)(
            ctx2,
            {
              code: ZodError_1.ZodIssueCode.invalid_type,
              expected: util_1.ZodParsedType.string,
              received: ctx2.parsedType
            }
            //
          );
          return parseUtil_1.INVALID;
        }
        const status = new parseUtil_1.ParseStatus();
        let ctx = void 0;
        for (const check of this._def.checks) {
          if (check.kind === "min") {
            if (input.data.length < check.value) {
              ctx = this._getOrReturnCtx(input, ctx);
              (0, parseUtil_1.addIssueToContext)(ctx, {
                code: ZodError_1.ZodIssueCode.too_small,
                minimum: check.value,
                type: "string",
                inclusive: true,
                exact: false,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "max") {
            if (input.data.length > check.value) {
              ctx = this._getOrReturnCtx(input, ctx);
              (0, parseUtil_1.addIssueToContext)(ctx, {
                code: ZodError_1.ZodIssueCode.too_big,
                maximum: check.value,
                type: "string",
                inclusive: true,
                exact: false,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "length") {
            const tooBig = input.data.length > check.value;
            const tooSmall = input.data.length < check.value;
            if (tooBig || tooSmall) {
              ctx = this._getOrReturnCtx(input, ctx);
              if (tooBig) {
                (0, parseUtil_1.addIssueToContext)(ctx, {
                  code: ZodError_1.ZodIssueCode.too_big,
                  maximum: check.value,
                  type: "string",
                  inclusive: true,
                  exact: true,
                  message: check.message
                });
              } else if (tooSmall) {
                (0, parseUtil_1.addIssueToContext)(ctx, {
                  code: ZodError_1.ZodIssueCode.too_small,
                  minimum: check.value,
                  type: "string",
                  inclusive: true,
                  exact: true,
                  message: check.message
                });
              }
              status.dirty();
            }
          } else if (check.kind === "email") {
            if (!emailRegex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              (0, parseUtil_1.addIssueToContext)(ctx, {
                validation: "email",
                code: ZodError_1.ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "uuid") {
            if (!uuidRegex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              (0, parseUtil_1.addIssueToContext)(ctx, {
                validation: "uuid",
                code: ZodError_1.ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "cuid") {
            if (!cuidRegex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              (0, parseUtil_1.addIssueToContext)(ctx, {
                validation: "cuid",
                code: ZodError_1.ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "cuid2") {
            if (!cuid2Regex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              (0, parseUtil_1.addIssueToContext)(ctx, {
                validation: "cuid2",
                code: ZodError_1.ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "url") {
            try {
              new URL(input.data);
            } catch (_a) {
              ctx = this._getOrReturnCtx(input, ctx);
              (0, parseUtil_1.addIssueToContext)(ctx, {
                validation: "url",
                code: ZodError_1.ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "regex") {
            check.regex.lastIndex = 0;
            const testResult = check.regex.test(input.data);
            if (!testResult) {
              ctx = this._getOrReturnCtx(input, ctx);
              (0, parseUtil_1.addIssueToContext)(ctx, {
                validation: "regex",
                code: ZodError_1.ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "trim") {
            input.data = input.data.trim();
          } else if (check.kind === "startsWith") {
            if (!input.data.startsWith(check.value)) {
              ctx = this._getOrReturnCtx(input, ctx);
              (0, parseUtil_1.addIssueToContext)(ctx, {
                code: ZodError_1.ZodIssueCode.invalid_string,
                validation: { startsWith: check.value },
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "endsWith") {
            if (!input.data.endsWith(check.value)) {
              ctx = this._getOrReturnCtx(input, ctx);
              (0, parseUtil_1.addIssueToContext)(ctx, {
                code: ZodError_1.ZodIssueCode.invalid_string,
                validation: { endsWith: check.value },
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "datetime") {
            const regex = datetimeRegex(check);
            if (!regex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              (0, parseUtil_1.addIssueToContext)(ctx, {
                code: ZodError_1.ZodIssueCode.invalid_string,
                validation: "datetime",
                message: check.message
              });
              status.dirty();
            }
          } else {
            util_1.util.assertNever(check);
          }
        }
        return { status: status.value, value: input.data };
      }
      _addCheck(check) {
        return new ZodString({
          ...this._def,
          checks: [...this._def.checks, check]
        });
      }
      email(message) {
        return this._addCheck({ kind: "email", ...errorUtil_1.errorUtil.errToObj(message) });
      }
      url(message) {
        return this._addCheck({ kind: "url", ...errorUtil_1.errorUtil.errToObj(message) });
      }
      uuid(message) {
        return this._addCheck({ kind: "uuid", ...errorUtil_1.errorUtil.errToObj(message) });
      }
      cuid(message) {
        return this._addCheck({ kind: "cuid", ...errorUtil_1.errorUtil.errToObj(message) });
      }
      cuid2(message) {
        return this._addCheck({ kind: "cuid2", ...errorUtil_1.errorUtil.errToObj(message) });
      }
      datetime(options) {
        var _a;
        if (typeof options === "string") {
          return this._addCheck({
            kind: "datetime",
            precision: null,
            offset: false,
            message: options
          });
        }
        return this._addCheck({
          kind: "datetime",
          precision: typeof (options === null || options === void 0 ? void 0 : options.precision) === "undefined" ? null : options === null || options === void 0 ? void 0 : options.precision,
          offset: (_a = options === null || options === void 0 ? void 0 : options.offset) !== null && _a !== void 0 ? _a : false,
          ...errorUtil_1.errorUtil.errToObj(options === null || options === void 0 ? void 0 : options.message)
        });
      }
      regex(regex, message) {
        return this._addCheck({
          kind: "regex",
          regex,
          ...errorUtil_1.errorUtil.errToObj(message)
        });
      }
      startsWith(value, message) {
        return this._addCheck({
          kind: "startsWith",
          value,
          ...errorUtil_1.errorUtil.errToObj(message)
        });
      }
      endsWith(value, message) {
        return this._addCheck({
          kind: "endsWith",
          value,
          ...errorUtil_1.errorUtil.errToObj(message)
        });
      }
      min(minLength, message) {
        return this._addCheck({
          kind: "min",
          value: minLength,
          ...errorUtil_1.errorUtil.errToObj(message)
        });
      }
      max(maxLength, message) {
        return this._addCheck({
          kind: "max",
          value: maxLength,
          ...errorUtil_1.errorUtil.errToObj(message)
        });
      }
      length(len, message) {
        return this._addCheck({
          kind: "length",
          value: len,
          ...errorUtil_1.errorUtil.errToObj(message)
        });
      }
      get isDatetime() {
        return !!this._def.checks.find((ch) => ch.kind === "datetime");
      }
      get isEmail() {
        return !!this._def.checks.find((ch) => ch.kind === "email");
      }
      get isURL() {
        return !!this._def.checks.find((ch) => ch.kind === "url");
      }
      get isUUID() {
        return !!this._def.checks.find((ch) => ch.kind === "uuid");
      }
      get isCUID() {
        return !!this._def.checks.find((ch) => ch.kind === "cuid");
      }
      get isCUID2() {
        return !!this._def.checks.find((ch) => ch.kind === "cuid2");
      }
      get minLength() {
        let min = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "min") {
            if (min === null || ch.value > min)
              min = ch.value;
          }
        }
        return min;
      }
      get maxLength() {
        let max = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "max") {
            if (max === null || ch.value < max)
              max = ch.value;
          }
        }
        return max;
      }
    };
    exports.ZodString = ZodString;
    ZodString.create = (params) => {
      var _a;
      return new ZodString({
        checks: [],
        typeName: ZodFirstPartyTypeKind.ZodString,
        coerce: (_a = params === null || params === void 0 ? void 0 : params.coerce) !== null && _a !== void 0 ? _a : false,
        ...processCreateParams(params)
      });
    };
    function floatSafeRemainder(val, step) {
      const valDecCount = (val.toString().split(".")[1] || "").length;
      const stepDecCount = (step.toString().split(".")[1] || "").length;
      const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
      const valInt = parseInt(val.toFixed(decCount).replace(".", ""));
      const stepInt = parseInt(step.toFixed(decCount).replace(".", ""));
      return valInt % stepInt / Math.pow(10, decCount);
    }
    var ZodNumber = class extends ZodType {
      constructor() {
        super(...arguments);
        this.min = this.gte;
        this.max = this.lte;
        this.step = this.multipleOf;
      }
      _parse(input) {
        if (this._def.coerce) {
          input.data = Number(input.data);
        }
        const parsedType = this._getType(input);
        if (parsedType !== util_1.ZodParsedType.number) {
          const ctx2 = this._getOrReturnCtx(input);
          (0, parseUtil_1.addIssueToContext)(ctx2, {
            code: ZodError_1.ZodIssueCode.invalid_type,
            expected: util_1.ZodParsedType.number,
            received: ctx2.parsedType
          });
          return parseUtil_1.INVALID;
        }
        let ctx = void 0;
        const status = new parseUtil_1.ParseStatus();
        for (const check of this._def.checks) {
          if (check.kind === "int") {
            if (!util_1.util.isInteger(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              (0, parseUtil_1.addIssueToContext)(ctx, {
                code: ZodError_1.ZodIssueCode.invalid_type,
                expected: "integer",
                received: "float",
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "min") {
            const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
            if (tooSmall) {
              ctx = this._getOrReturnCtx(input, ctx);
              (0, parseUtil_1.addIssueToContext)(ctx, {
                code: ZodError_1.ZodIssueCode.too_small,
                minimum: check.value,
                type: "number",
                inclusive: check.inclusive,
                exact: false,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "max") {
            const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
            if (tooBig) {
              ctx = this._getOrReturnCtx(input, ctx);
              (0, parseUtil_1.addIssueToContext)(ctx, {
                code: ZodError_1.ZodIssueCode.too_big,
                maximum: check.value,
                type: "number",
                inclusive: check.inclusive,
                exact: false,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "multipleOf") {
            if (floatSafeRemainder(input.data, check.value) !== 0) {
              ctx = this._getOrReturnCtx(input, ctx);
              (0, parseUtil_1.addIssueToContext)(ctx, {
                code: ZodError_1.ZodIssueCode.not_multiple_of,
                multipleOf: check.value,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "finite") {
            if (!Number.isFinite(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              (0, parseUtil_1.addIssueToContext)(ctx, {
                code: ZodError_1.ZodIssueCode.not_finite,
                message: check.message
              });
              status.dirty();
            }
          } else {
            util_1.util.assertNever(check);
          }
        }
        return { status: status.value, value: input.data };
      }
      gte(value, message) {
        return this.setLimit("min", value, true, errorUtil_1.errorUtil.toString(message));
      }
      gt(value, message) {
        return this.setLimit("min", value, false, errorUtil_1.errorUtil.toString(message));
      }
      lte(value, message) {
        return this.setLimit("max", value, true, errorUtil_1.errorUtil.toString(message));
      }
      lt(value, message) {
        return this.setLimit("max", value, false, errorUtil_1.errorUtil.toString(message));
      }
      setLimit(kind, value, inclusive, message) {
        return new ZodNumber({
          ...this._def,
          checks: [
            ...this._def.checks,
            {
              kind,
              value,
              inclusive,
              message: errorUtil_1.errorUtil.toString(message)
            }
          ]
        });
      }
      _addCheck(check) {
        return new ZodNumber({
          ...this._def,
          checks: [...this._def.checks, check]
        });
      }
      int(message) {
        return this._addCheck({
          kind: "int",
          message: errorUtil_1.errorUtil.toString(message)
        });
      }
      positive(message) {
        return this._addCheck({
          kind: "min",
          value: 0,
          inclusive: false,
          message: errorUtil_1.errorUtil.toString(message)
        });
      }
      negative(message) {
        return this._addCheck({
          kind: "max",
          value: 0,
          inclusive: false,
          message: errorUtil_1.errorUtil.toString(message)
        });
      }
      nonpositive(message) {
        return this._addCheck({
          kind: "max",
          value: 0,
          inclusive: true,
          message: errorUtil_1.errorUtil.toString(message)
        });
      }
      nonnegative(message) {
        return this._addCheck({
          kind: "min",
          value: 0,
          inclusive: true,
          message: errorUtil_1.errorUtil.toString(message)
        });
      }
      multipleOf(value, message) {
        return this._addCheck({
          kind: "multipleOf",
          value,
          message: errorUtil_1.errorUtil.toString(message)
        });
      }
      finite(message) {
        return this._addCheck({
          kind: "finite",
          message: errorUtil_1.errorUtil.toString(message)
        });
      }
      get minValue() {
        let min = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "min") {
            if (min === null || ch.value > min)
              min = ch.value;
          }
        }
        return min;
      }
      get maxValue() {
        let max = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "max") {
            if (max === null || ch.value < max)
              max = ch.value;
          }
        }
        return max;
      }
      get isInt() {
        return !!this._def.checks.find((ch) => ch.kind === "int" || ch.kind === "multipleOf" && util_1.util.isInteger(ch.value));
      }
      get isFinite() {
        let max = null, min = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "finite" || ch.kind === "int" || ch.kind === "multipleOf") {
            return true;
          } else if (ch.kind === "min") {
            if (min === null || ch.value > min)
              min = ch.value;
          } else if (ch.kind === "max") {
            if (max === null || ch.value < max)
              max = ch.value;
          }
        }
        return Number.isFinite(min) && Number.isFinite(max);
      }
    };
    exports.ZodNumber = ZodNumber;
    ZodNumber.create = (params) => {
      return new ZodNumber({
        checks: [],
        typeName: ZodFirstPartyTypeKind.ZodNumber,
        coerce: (params === null || params === void 0 ? void 0 : params.coerce) || false,
        ...processCreateParams(params)
      });
    };
    var ZodBigInt = class extends ZodType {
      _parse(input) {
        if (this._def.coerce) {
          input.data = BigInt(input.data);
        }
        const parsedType = this._getType(input);
        if (parsedType !== util_1.ZodParsedType.bigint) {
          const ctx = this._getOrReturnCtx(input);
          (0, parseUtil_1.addIssueToContext)(ctx, {
            code: ZodError_1.ZodIssueCode.invalid_type,
            expected: util_1.ZodParsedType.bigint,
            received: ctx.parsedType
          });
          return parseUtil_1.INVALID;
        }
        return (0, parseUtil_1.OK)(input.data);
      }
    };
    exports.ZodBigInt = ZodBigInt;
    ZodBigInt.create = (params) => {
      var _a;
      return new ZodBigInt({
        typeName: ZodFirstPartyTypeKind.ZodBigInt,
        coerce: (_a = params === null || params === void 0 ? void 0 : params.coerce) !== null && _a !== void 0 ? _a : false,
        ...processCreateParams(params)
      });
    };
    var ZodBoolean = class extends ZodType {
      _parse(input) {
        if (this._def.coerce) {
          input.data = Boolean(input.data);
        }
        const parsedType = this._getType(input);
        if (parsedType !== util_1.ZodParsedType.boolean) {
          const ctx = this._getOrReturnCtx(input);
          (0, parseUtil_1.addIssueToContext)(ctx, {
            code: ZodError_1.ZodIssueCode.invalid_type,
            expected: util_1.ZodParsedType.boolean,
            received: ctx.parsedType
          });
          return parseUtil_1.INVALID;
        }
        return (0, parseUtil_1.OK)(input.data);
      }
    };
    exports.ZodBoolean = ZodBoolean;
    ZodBoolean.create = (params) => {
      return new ZodBoolean({
        typeName: ZodFirstPartyTypeKind.ZodBoolean,
        coerce: (params === null || params === void 0 ? void 0 : params.coerce) || false,
        ...processCreateParams(params)
      });
    };
    var ZodDate = class extends ZodType {
      _parse(input) {
        if (this._def.coerce) {
          input.data = new Date(input.data);
        }
        const parsedType = this._getType(input);
        if (parsedType !== util_1.ZodParsedType.date) {
          const ctx2 = this._getOrReturnCtx(input);
          (0, parseUtil_1.addIssueToContext)(ctx2, {
            code: ZodError_1.ZodIssueCode.invalid_type,
            expected: util_1.ZodParsedType.date,
            received: ctx2.parsedType
          });
          return parseUtil_1.INVALID;
        }
        if (isNaN(input.data.getTime())) {
          const ctx2 = this._getOrReturnCtx(input);
          (0, parseUtil_1.addIssueToContext)(ctx2, {
            code: ZodError_1.ZodIssueCode.invalid_date
          });
          return parseUtil_1.INVALID;
        }
        const status = new parseUtil_1.ParseStatus();
        let ctx = void 0;
        for (const check of this._def.checks) {
          if (check.kind === "min") {
            if (input.data.getTime() < check.value) {
              ctx = this._getOrReturnCtx(input, ctx);
              (0, parseUtil_1.addIssueToContext)(ctx, {
                code: ZodError_1.ZodIssueCode.too_small,
                message: check.message,
                inclusive: true,
                exact: false,
                minimum: check.value,
                type: "date"
              });
              status.dirty();
            }
          } else if (check.kind === "max") {
            if (input.data.getTime() > check.value) {
              ctx = this._getOrReturnCtx(input, ctx);
              (0, parseUtil_1.addIssueToContext)(ctx, {
                code: ZodError_1.ZodIssueCode.too_big,
                message: check.message,
                inclusive: true,
                exact: false,
                maximum: check.value,
                type: "date"
              });
              status.dirty();
            }
          } else {
            util_1.util.assertNever(check);
          }
        }
        return {
          status: status.value,
          value: new Date(input.data.getTime())
        };
      }
      _addCheck(check) {
        return new ZodDate({
          ...this._def,
          checks: [...this._def.checks, check]
        });
      }
      min(minDate, message) {
        return this._addCheck({
          kind: "min",
          value: minDate.getTime(),
          message: errorUtil_1.errorUtil.toString(message)
        });
      }
      max(maxDate, message) {
        return this._addCheck({
          kind: "max",
          value: maxDate.getTime(),
          message: errorUtil_1.errorUtil.toString(message)
        });
      }
      get minDate() {
        let min = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "min") {
            if (min === null || ch.value > min)
              min = ch.value;
          }
        }
        return min != null ? new Date(min) : null;
      }
      get maxDate() {
        let max = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "max") {
            if (max === null || ch.value < max)
              max = ch.value;
          }
        }
        return max != null ? new Date(max) : null;
      }
    };
    exports.ZodDate = ZodDate;
    ZodDate.create = (params) => {
      return new ZodDate({
        checks: [],
        coerce: (params === null || params === void 0 ? void 0 : params.coerce) || false,
        typeName: ZodFirstPartyTypeKind.ZodDate,
        ...processCreateParams(params)
      });
    };
    var ZodSymbol = class extends ZodType {
      _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== util_1.ZodParsedType.symbol) {
          const ctx = this._getOrReturnCtx(input);
          (0, parseUtil_1.addIssueToContext)(ctx, {
            code: ZodError_1.ZodIssueCode.invalid_type,
            expected: util_1.ZodParsedType.symbol,
            received: ctx.parsedType
          });
          return parseUtil_1.INVALID;
        }
        return (0, parseUtil_1.OK)(input.data);
      }
    };
    exports.ZodSymbol = ZodSymbol;
    ZodSymbol.create = (params) => {
      return new ZodSymbol({
        typeName: ZodFirstPartyTypeKind.ZodSymbol,
        ...processCreateParams(params)
      });
    };
    var ZodUndefined = class extends ZodType {
      _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== util_1.ZodParsedType.undefined) {
          const ctx = this._getOrReturnCtx(input);
          (0, parseUtil_1.addIssueToContext)(ctx, {
            code: ZodError_1.ZodIssueCode.invalid_type,
            expected: util_1.ZodParsedType.undefined,
            received: ctx.parsedType
          });
          return parseUtil_1.INVALID;
        }
        return (0, parseUtil_1.OK)(input.data);
      }
    };
    exports.ZodUndefined = ZodUndefined;
    ZodUndefined.create = (params) => {
      return new ZodUndefined({
        typeName: ZodFirstPartyTypeKind.ZodUndefined,
        ...processCreateParams(params)
      });
    };
    var ZodNull = class extends ZodType {
      _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== util_1.ZodParsedType.null) {
          const ctx = this._getOrReturnCtx(input);
          (0, parseUtil_1.addIssueToContext)(ctx, {
            code: ZodError_1.ZodIssueCode.invalid_type,
            expected: util_1.ZodParsedType.null,
            received: ctx.parsedType
          });
          return parseUtil_1.INVALID;
        }
        return (0, parseUtil_1.OK)(input.data);
      }
    };
    exports.ZodNull = ZodNull;
    ZodNull.create = (params) => {
      return new ZodNull({
        typeName: ZodFirstPartyTypeKind.ZodNull,
        ...processCreateParams(params)
      });
    };
    var ZodAny = class extends ZodType {
      constructor() {
        super(...arguments);
        this._any = true;
      }
      _parse(input) {
        return (0, parseUtil_1.OK)(input.data);
      }
    };
    exports.ZodAny = ZodAny;
    ZodAny.create = (params) => {
      return new ZodAny({
        typeName: ZodFirstPartyTypeKind.ZodAny,
        ...processCreateParams(params)
      });
    };
    var ZodUnknown = class extends ZodType {
      constructor() {
        super(...arguments);
        this._unknown = true;
      }
      _parse(input) {
        return (0, parseUtil_1.OK)(input.data);
      }
    };
    exports.ZodUnknown = ZodUnknown;
    ZodUnknown.create = (params) => {
      return new ZodUnknown({
        typeName: ZodFirstPartyTypeKind.ZodUnknown,
        ...processCreateParams(params)
      });
    };
    var ZodNever = class extends ZodType {
      _parse(input) {
        const ctx = this._getOrReturnCtx(input);
        (0, parseUtil_1.addIssueToContext)(ctx, {
          code: ZodError_1.ZodIssueCode.invalid_type,
          expected: util_1.ZodParsedType.never,
          received: ctx.parsedType
        });
        return parseUtil_1.INVALID;
      }
    };
    exports.ZodNever = ZodNever;
    ZodNever.create = (params) => {
      return new ZodNever({
        typeName: ZodFirstPartyTypeKind.ZodNever,
        ...processCreateParams(params)
      });
    };
    var ZodVoid = class extends ZodType {
      _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== util_1.ZodParsedType.undefined) {
          const ctx = this._getOrReturnCtx(input);
          (0, parseUtil_1.addIssueToContext)(ctx, {
            code: ZodError_1.ZodIssueCode.invalid_type,
            expected: util_1.ZodParsedType.void,
            received: ctx.parsedType
          });
          return parseUtil_1.INVALID;
        }
        return (0, parseUtil_1.OK)(input.data);
      }
    };
    exports.ZodVoid = ZodVoid;
    ZodVoid.create = (params) => {
      return new ZodVoid({
        typeName: ZodFirstPartyTypeKind.ZodVoid,
        ...processCreateParams(params)
      });
    };
    var ZodArray = class extends ZodType {
      _parse(input) {
        const { ctx, status } = this._processInputParams(input);
        const def = this._def;
        if (ctx.parsedType !== util_1.ZodParsedType.array) {
          (0, parseUtil_1.addIssueToContext)(ctx, {
            code: ZodError_1.ZodIssueCode.invalid_type,
            expected: util_1.ZodParsedType.array,
            received: ctx.parsedType
          });
          return parseUtil_1.INVALID;
        }
        if (def.exactLength !== null) {
          const tooBig = ctx.data.length > def.exactLength.value;
          const tooSmall = ctx.data.length < def.exactLength.value;
          if (tooBig || tooSmall) {
            (0, parseUtil_1.addIssueToContext)(ctx, {
              code: tooBig ? ZodError_1.ZodIssueCode.too_big : ZodError_1.ZodIssueCode.too_small,
              minimum: tooSmall ? def.exactLength.value : void 0,
              maximum: tooBig ? def.exactLength.value : void 0,
              type: "array",
              inclusive: true,
              exact: true,
              message: def.exactLength.message
            });
            status.dirty();
          }
        }
        if (def.minLength !== null) {
          if (ctx.data.length < def.minLength.value) {
            (0, parseUtil_1.addIssueToContext)(ctx, {
              code: ZodError_1.ZodIssueCode.too_small,
              minimum: def.minLength.value,
              type: "array",
              inclusive: true,
              exact: false,
              message: def.minLength.message
            });
            status.dirty();
          }
        }
        if (def.maxLength !== null) {
          if (ctx.data.length > def.maxLength.value) {
            (0, parseUtil_1.addIssueToContext)(ctx, {
              code: ZodError_1.ZodIssueCode.too_big,
              maximum: def.maxLength.value,
              type: "array",
              inclusive: true,
              exact: false,
              message: def.maxLength.message
            });
            status.dirty();
          }
        }
        if (ctx.common.async) {
          return Promise.all([...ctx.data].map((item, i) => {
            return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
          })).then((result2) => {
            return parseUtil_1.ParseStatus.mergeArray(status, result2);
          });
        }
        const result = [...ctx.data].map((item, i) => {
          return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
        });
        return parseUtil_1.ParseStatus.mergeArray(status, result);
      }
      get element() {
        return this._def.type;
      }
      min(minLength, message) {
        return new ZodArray({
          ...this._def,
          minLength: { value: minLength, message: errorUtil_1.errorUtil.toString(message) }
        });
      }
      max(maxLength, message) {
        return new ZodArray({
          ...this._def,
          maxLength: { value: maxLength, message: errorUtil_1.errorUtil.toString(message) }
        });
      }
      length(len, message) {
        return new ZodArray({
          ...this._def,
          exactLength: { value: len, message: errorUtil_1.errorUtil.toString(message) }
        });
      }
      nonempty(message) {
        return this.min(1, message);
      }
    };
    exports.ZodArray = ZodArray;
    ZodArray.create = (schema, params) => {
      return new ZodArray({
        type: schema,
        minLength: null,
        maxLength: null,
        exactLength: null,
        typeName: ZodFirstPartyTypeKind.ZodArray,
        ...processCreateParams(params)
      });
    };
    var objectUtil;
    (function(objectUtil2) {
      objectUtil2.mergeShapes = (first, second) => {
        return {
          ...first,
          ...second
          // second overwrites first
        };
      };
    })(objectUtil = exports.objectUtil || (exports.objectUtil = {}));
    var AugmentFactory = (def) => (augmentation) => {
      return new ZodObject({
        ...def,
        shape: () => ({
          ...def.shape(),
          ...augmentation
        })
      });
    };
    function deepPartialify(schema) {
      if (schema instanceof ZodObject) {
        const newShape = {};
        for (const key in schema.shape) {
          const fieldSchema = schema.shape[key];
          newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
        }
        return new ZodObject({
          ...schema._def,
          shape: () => newShape
        });
      } else if (schema instanceof ZodArray) {
        return ZodArray.create(deepPartialify(schema.element));
      } else if (schema instanceof ZodOptional) {
        return ZodOptional.create(deepPartialify(schema.unwrap()));
      } else if (schema instanceof ZodNullable) {
        return ZodNullable.create(deepPartialify(schema.unwrap()));
      } else if (schema instanceof ZodTuple) {
        return ZodTuple.create(schema.items.map((item) => deepPartialify(item)));
      } else {
        return schema;
      }
    }
    var ZodObject = class extends ZodType {
      constructor() {
        super(...arguments);
        this._cached = null;
        this.nonstrict = this.passthrough;
        this.augment = AugmentFactory(this._def);
        this.extend = AugmentFactory(this._def);
      }
      _getCached() {
        if (this._cached !== null)
          return this._cached;
        const shape = this._def.shape();
        const keys = util_1.util.objectKeys(shape);
        return this._cached = { shape, keys };
      }
      _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== util_1.ZodParsedType.object) {
          const ctx2 = this._getOrReturnCtx(input);
          (0, parseUtil_1.addIssueToContext)(ctx2, {
            code: ZodError_1.ZodIssueCode.invalid_type,
            expected: util_1.ZodParsedType.object,
            received: ctx2.parsedType
          });
          return parseUtil_1.INVALID;
        }
        const { status, ctx } = this._processInputParams(input);
        const { shape, keys: shapeKeys } = this._getCached();
        const extraKeys = [];
        if (!(this._def.catchall instanceof ZodNever && this._def.unknownKeys === "strip")) {
          for (const key in ctx.data) {
            if (!shapeKeys.includes(key)) {
              extraKeys.push(key);
            }
          }
        }
        const pairs = [];
        for (const key of shapeKeys) {
          const keyValidator = shape[key];
          const value = ctx.data[key];
          pairs.push({
            key: { status: "valid", value: key },
            value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
            alwaysSet: key in ctx.data
          });
        }
        if (this._def.catchall instanceof ZodNever) {
          const unknownKeys = this._def.unknownKeys;
          if (unknownKeys === "passthrough") {
            for (const key of extraKeys) {
              pairs.push({
                key: { status: "valid", value: key },
                value: { status: "valid", value: ctx.data[key] }
              });
            }
          } else if (unknownKeys === "strict") {
            if (extraKeys.length > 0) {
              (0, parseUtil_1.addIssueToContext)(ctx, {
                code: ZodError_1.ZodIssueCode.unrecognized_keys,
                keys: extraKeys
              });
              status.dirty();
            }
          } else if (unknownKeys === "strip") {
          } else {
            throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
          }
        } else {
          const catchall = this._def.catchall;
          for (const key of extraKeys) {
            const value = ctx.data[key];
            pairs.push({
              key: { status: "valid", value: key },
              value: catchall._parse(
                new ParseInputLazyPath(ctx, value, ctx.path, key)
                //, ctx.child(key), value, getParsedType(value)
              ),
              alwaysSet: key in ctx.data
            });
          }
        }
        if (ctx.common.async) {
          return Promise.resolve().then(async () => {
            const syncPairs = [];
            for (const pair of pairs) {
              const key = await pair.key;
              syncPairs.push({
                key,
                value: await pair.value,
                alwaysSet: pair.alwaysSet
              });
            }
            return syncPairs;
          }).then((syncPairs) => {
            return parseUtil_1.ParseStatus.mergeObjectSync(status, syncPairs);
          });
        } else {
          return parseUtil_1.ParseStatus.mergeObjectSync(status, pairs);
        }
      }
      get shape() {
        return this._def.shape();
      }
      strict(message) {
        errorUtil_1.errorUtil.errToObj;
        return new ZodObject({
          ...this._def,
          unknownKeys: "strict",
          ...message !== void 0 ? {
            errorMap: (issue, ctx) => {
              var _a, _b, _c, _d;
              const defaultError = (_c = (_b = (_a = this._def).errorMap) === null || _b === void 0 ? void 0 : _b.call(_a, issue, ctx).message) !== null && _c !== void 0 ? _c : ctx.defaultError;
              if (issue.code === "unrecognized_keys")
                return {
                  message: (_d = errorUtil_1.errorUtil.errToObj(message).message) !== null && _d !== void 0 ? _d : defaultError
                };
              return {
                message: defaultError
              };
            }
          } : {}
        });
      }
      strip() {
        return new ZodObject({
          ...this._def,
          unknownKeys: "strip"
        });
      }
      passthrough() {
        return new ZodObject({
          ...this._def,
          unknownKeys: "passthrough"
        });
      }
      setKey(key, schema) {
        return this.augment({ [key]: schema });
      }
      /**
       * Prior to zod@1.0.12 there was a bug in the
       * inferred type of merged objects. Please
       * upgrade if you are experiencing issues.
       */
      merge(merging) {
        const merged = new ZodObject({
          unknownKeys: merging._def.unknownKeys,
          catchall: merging._def.catchall,
          shape: () => objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
          typeName: ZodFirstPartyTypeKind.ZodObject
        });
        return merged;
      }
      catchall(index) {
        return new ZodObject({
          ...this._def,
          catchall: index
        });
      }
      pick(mask) {
        const shape = {};
        util_1.util.objectKeys(mask).forEach((key) => {
          if (mask[key] && this.shape[key]) {
            shape[key] = this.shape[key];
          }
        });
        return new ZodObject({
          ...this._def,
          shape: () => shape
        });
      }
      omit(mask) {
        const shape = {};
        util_1.util.objectKeys(this.shape).forEach((key) => {
          if (!mask[key]) {
            shape[key] = this.shape[key];
          }
        });
        return new ZodObject({
          ...this._def,
          shape: () => shape
        });
      }
      deepPartial() {
        return deepPartialify(this);
      }
      partial(mask) {
        const newShape = {};
        util_1.util.objectKeys(this.shape).forEach((key) => {
          const fieldSchema = this.shape[key];
          if (mask && !mask[key]) {
            newShape[key] = fieldSchema;
          } else {
            newShape[key] = fieldSchema.optional();
          }
        });
        return new ZodObject({
          ...this._def,
          shape: () => newShape
        });
      }
      required(mask) {
        const newShape = {};
        util_1.util.objectKeys(this.shape).forEach((key) => {
          if (mask && !mask[key]) {
            newShape[key] = this.shape[key];
          } else {
            const fieldSchema = this.shape[key];
            let newField = fieldSchema;
            while (newField instanceof ZodOptional) {
              newField = newField._def.innerType;
            }
            newShape[key] = newField;
          }
        });
        return new ZodObject({
          ...this._def,
          shape: () => newShape
        });
      }
      keyof() {
        return createZodEnum(util_1.util.objectKeys(this.shape));
      }
    };
    exports.ZodObject = ZodObject;
    ZodObject.create = (shape, params) => {
      return new ZodObject({
        shape: () => shape,
        unknownKeys: "strip",
        catchall: ZodNever.create(),
        typeName: ZodFirstPartyTypeKind.ZodObject,
        ...processCreateParams(params)
      });
    };
    ZodObject.strictCreate = (shape, params) => {
      return new ZodObject({
        shape: () => shape,
        unknownKeys: "strict",
        catchall: ZodNever.create(),
        typeName: ZodFirstPartyTypeKind.ZodObject,
        ...processCreateParams(params)
      });
    };
    ZodObject.lazycreate = (shape, params) => {
      return new ZodObject({
        shape,
        unknownKeys: "strip",
        catchall: ZodNever.create(),
        typeName: ZodFirstPartyTypeKind.ZodObject,
        ...processCreateParams(params)
      });
    };
    var ZodUnion = class extends ZodType {
      _parse(input) {
        const { ctx } = this._processInputParams(input);
        const options = this._def.options;
        function handleResults(results) {
          for (const result of results) {
            if (result.result.status === "valid") {
              return result.result;
            }
          }
          for (const result of results) {
            if (result.result.status === "dirty") {
              ctx.common.issues.push(...result.ctx.common.issues);
              return result.result;
            }
          }
          const unionErrors = results.map((result) => new ZodError_1.ZodError(result.ctx.common.issues));
          (0, parseUtil_1.addIssueToContext)(ctx, {
            code: ZodError_1.ZodIssueCode.invalid_union,
            unionErrors
          });
          return parseUtil_1.INVALID;
        }
        if (ctx.common.async) {
          return Promise.all(options.map(async (option) => {
            const childCtx = {
              ...ctx,
              common: {
                ...ctx.common,
                issues: []
              },
              parent: null
            };
            return {
              result: await option._parseAsync({
                data: ctx.data,
                path: ctx.path,
                parent: childCtx
              }),
              ctx: childCtx
            };
          })).then(handleResults);
        } else {
          let dirty = void 0;
          const issues = [];
          for (const option of options) {
            const childCtx = {
              ...ctx,
              common: {
                ...ctx.common,
                issues: []
              },
              parent: null
            };
            const result = option._parseSync({
              data: ctx.data,
              path: ctx.path,
              parent: childCtx
            });
            if (result.status === "valid") {
              return result;
            } else if (result.status === "dirty" && !dirty) {
              dirty = { result, ctx: childCtx };
            }
            if (childCtx.common.issues.length) {
              issues.push(childCtx.common.issues);
            }
          }
          if (dirty) {
            ctx.common.issues.push(...dirty.ctx.common.issues);
            return dirty.result;
          }
          const unionErrors = issues.map((issues2) => new ZodError_1.ZodError(issues2));
          (0, parseUtil_1.addIssueToContext)(ctx, {
            code: ZodError_1.ZodIssueCode.invalid_union,
            unionErrors
          });
          return parseUtil_1.INVALID;
        }
      }
      get options() {
        return this._def.options;
      }
    };
    exports.ZodUnion = ZodUnion;
    ZodUnion.create = (types, params) => {
      return new ZodUnion({
        options: types,
        typeName: ZodFirstPartyTypeKind.ZodUnion,
        ...processCreateParams(params)
      });
    };
    var getDiscriminator = (type) => {
      if (type instanceof ZodLazy) {
        return getDiscriminator(type.schema);
      } else if (type instanceof ZodEffects) {
        return getDiscriminator(type.innerType());
      } else if (type instanceof ZodLiteral) {
        return [type.value];
      } else if (type instanceof ZodEnum) {
        return type.options;
      } else if (type instanceof ZodNativeEnum) {
        return Object.keys(type.enum);
      } else if (type instanceof ZodDefault) {
        return getDiscriminator(type._def.innerType);
      } else if (type instanceof ZodUndefined) {
        return [void 0];
      } else if (type instanceof ZodNull) {
        return [null];
      } else {
        return null;
      }
    };
    var ZodDiscriminatedUnion = class extends ZodType {
      _parse(input) {
        const { ctx } = this._processInputParams(input);
        if (ctx.parsedType !== util_1.ZodParsedType.object) {
          (0, parseUtil_1.addIssueToContext)(ctx, {
            code: ZodError_1.ZodIssueCode.invalid_type,
            expected: util_1.ZodParsedType.object,
            received: ctx.parsedType
          });
          return parseUtil_1.INVALID;
        }
        const discriminator = this.discriminator;
        const discriminatorValue = ctx.data[discriminator];
        const option = this.optionsMap.get(discriminatorValue);
        if (!option) {
          (0, parseUtil_1.addIssueToContext)(ctx, {
            code: ZodError_1.ZodIssueCode.invalid_union_discriminator,
            options: Array.from(this.optionsMap.keys()),
            path: [discriminator]
          });
          return parseUtil_1.INVALID;
        }
        if (ctx.common.async) {
          return option._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          });
        } else {
          return option._parseSync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          });
        }
      }
      get discriminator() {
        return this._def.discriminator;
      }
      get options() {
        return this._def.options;
      }
      get optionsMap() {
        return this._def.optionsMap;
      }
      /**
       * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
       * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
       * have a different value for each object in the union.
       * @param discriminator the name of the discriminator property
       * @param types an array of object schemas
       * @param params
       */
      static create(discriminator, options, params) {
        const optionsMap = /* @__PURE__ */ new Map();
        for (const type of options) {
          const discriminatorValues = getDiscriminator(type.shape[discriminator]);
          if (!discriminatorValues) {
            throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
          }
          for (const value of discriminatorValues) {
            if (optionsMap.has(value)) {
              throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
            }
            optionsMap.set(value, type);
          }
        }
        return new ZodDiscriminatedUnion({
          typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
          discriminator,
          options,
          optionsMap,
          ...processCreateParams(params)
        });
      }
    };
    exports.ZodDiscriminatedUnion = ZodDiscriminatedUnion;
    function mergeValues(a, b) {
      const aType = (0, util_1.getParsedType)(a);
      const bType = (0, util_1.getParsedType)(b);
      if (a === b) {
        return { valid: true, data: a };
      } else if (aType === util_1.ZodParsedType.object && bType === util_1.ZodParsedType.object) {
        const bKeys = util_1.util.objectKeys(b);
        const sharedKeys = util_1.util.objectKeys(a).filter((key) => bKeys.indexOf(key) !== -1);
        const newObj = { ...a, ...b };
        for (const key of sharedKeys) {
          const sharedValue = mergeValues(a[key], b[key]);
          if (!sharedValue.valid) {
            return { valid: false };
          }
          newObj[key] = sharedValue.data;
        }
        return { valid: true, data: newObj };
      } else if (aType === util_1.ZodParsedType.array && bType === util_1.ZodParsedType.array) {
        if (a.length !== b.length) {
          return { valid: false };
        }
        const newArray = [];
        for (let index = 0; index < a.length; index++) {
          const itemA = a[index];
          const itemB = b[index];
          const sharedValue = mergeValues(itemA, itemB);
          if (!sharedValue.valid) {
            return { valid: false };
          }
          newArray.push(sharedValue.data);
        }
        return { valid: true, data: newArray };
      } else if (aType === util_1.ZodParsedType.date && bType === util_1.ZodParsedType.date && +a === +b) {
        return { valid: true, data: a };
      } else {
        return { valid: false };
      }
    }
    var ZodIntersection = class extends ZodType {
      _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        const handleParsed = (parsedLeft, parsedRight) => {
          if ((0, parseUtil_1.isAborted)(parsedLeft) || (0, parseUtil_1.isAborted)(parsedRight)) {
            return parseUtil_1.INVALID;
          }
          const merged = mergeValues(parsedLeft.value, parsedRight.value);
          if (!merged.valid) {
            (0, parseUtil_1.addIssueToContext)(ctx, {
              code: ZodError_1.ZodIssueCode.invalid_intersection_types
            });
            return parseUtil_1.INVALID;
          }
          if ((0, parseUtil_1.isDirty)(parsedLeft) || (0, parseUtil_1.isDirty)(parsedRight)) {
            status.dirty();
          }
          return { status: status.value, value: merged.data };
        };
        if (ctx.common.async) {
          return Promise.all([
            this._def.left._parseAsync({
              data: ctx.data,
              path: ctx.path,
              parent: ctx
            }),
            this._def.right._parseAsync({
              data: ctx.data,
              path: ctx.path,
              parent: ctx
            })
          ]).then(([left, right]) => handleParsed(left, right));
        } else {
          return handleParsed(this._def.left._parseSync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          }), this._def.right._parseSync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          }));
        }
      }
    };
    exports.ZodIntersection = ZodIntersection;
    ZodIntersection.create = (left, right, params) => {
      return new ZodIntersection({
        left,
        right,
        typeName: ZodFirstPartyTypeKind.ZodIntersection,
        ...processCreateParams(params)
      });
    };
    var ZodTuple = class extends ZodType {
      _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        if (ctx.parsedType !== util_1.ZodParsedType.array) {
          (0, parseUtil_1.addIssueToContext)(ctx, {
            code: ZodError_1.ZodIssueCode.invalid_type,
            expected: util_1.ZodParsedType.array,
            received: ctx.parsedType
          });
          return parseUtil_1.INVALID;
        }
        if (ctx.data.length < this._def.items.length) {
          (0, parseUtil_1.addIssueToContext)(ctx, {
            code: ZodError_1.ZodIssueCode.too_small,
            minimum: this._def.items.length,
            inclusive: true,
            exact: false,
            type: "array"
          });
          return parseUtil_1.INVALID;
        }
        const rest = this._def.rest;
        if (!rest && ctx.data.length > this._def.items.length) {
          (0, parseUtil_1.addIssueToContext)(ctx, {
            code: ZodError_1.ZodIssueCode.too_big,
            maximum: this._def.items.length,
            inclusive: true,
            exact: false,
            type: "array"
          });
          status.dirty();
        }
        const items = [...ctx.data].map((item, itemIndex) => {
          const schema = this._def.items[itemIndex] || this._def.rest;
          if (!schema)
            return null;
          return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
        }).filter((x) => !!x);
        if (ctx.common.async) {
          return Promise.all(items).then((results) => {
            return parseUtil_1.ParseStatus.mergeArray(status, results);
          });
        } else {
          return parseUtil_1.ParseStatus.mergeArray(status, items);
        }
      }
      get items() {
        return this._def.items;
      }
      rest(rest) {
        return new ZodTuple({
          ...this._def,
          rest
        });
      }
    };
    exports.ZodTuple = ZodTuple;
    ZodTuple.create = (schemas, params) => {
      if (!Array.isArray(schemas)) {
        throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
      }
      return new ZodTuple({
        items: schemas,
        typeName: ZodFirstPartyTypeKind.ZodTuple,
        rest: null,
        ...processCreateParams(params)
      });
    };
    var ZodRecord = class extends ZodType {
      get keySchema() {
        return this._def.keyType;
      }
      get valueSchema() {
        return this._def.valueType;
      }
      _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        if (ctx.parsedType !== util_1.ZodParsedType.object) {
          (0, parseUtil_1.addIssueToContext)(ctx, {
            code: ZodError_1.ZodIssueCode.invalid_type,
            expected: util_1.ZodParsedType.object,
            received: ctx.parsedType
          });
          return parseUtil_1.INVALID;
        }
        const pairs = [];
        const keyType = this._def.keyType;
        const valueType = this._def.valueType;
        for (const key in ctx.data) {
          pairs.push({
            key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
            value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key))
          });
        }
        if (ctx.common.async) {
          return parseUtil_1.ParseStatus.mergeObjectAsync(status, pairs);
        } else {
          return parseUtil_1.ParseStatus.mergeObjectSync(status, pairs);
        }
      }
      get element() {
        return this._def.valueType;
      }
      static create(first, second, third) {
        if (second instanceof ZodType) {
          return new ZodRecord({
            keyType: first,
            valueType: second,
            typeName: ZodFirstPartyTypeKind.ZodRecord,
            ...processCreateParams(third)
          });
        }
        return new ZodRecord({
          keyType: ZodString.create(),
          valueType: first,
          typeName: ZodFirstPartyTypeKind.ZodRecord,
          ...processCreateParams(second)
        });
      }
    };
    exports.ZodRecord = ZodRecord;
    var ZodMap = class extends ZodType {
      _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        if (ctx.parsedType !== util_1.ZodParsedType.map) {
          (0, parseUtil_1.addIssueToContext)(ctx, {
            code: ZodError_1.ZodIssueCode.invalid_type,
            expected: util_1.ZodParsedType.map,
            received: ctx.parsedType
          });
          return parseUtil_1.INVALID;
        }
        const keyType = this._def.keyType;
        const valueType = this._def.valueType;
        const pairs = [...ctx.data.entries()].map(([key, value], index) => {
          return {
            key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])),
            value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"]))
          };
        });
        if (ctx.common.async) {
          const finalMap = /* @__PURE__ */ new Map();
          return Promise.resolve().then(async () => {
            for (const pair of pairs) {
              const key = await pair.key;
              const value = await pair.value;
              if (key.status === "aborted" || value.status === "aborted") {
                return parseUtil_1.INVALID;
              }
              if (key.status === "dirty" || value.status === "dirty") {
                status.dirty();
              }
              finalMap.set(key.value, value.value);
            }
            return { status: status.value, value: finalMap };
          });
        } else {
          const finalMap = /* @__PURE__ */ new Map();
          for (const pair of pairs) {
            const key = pair.key;
            const value = pair.value;
            if (key.status === "aborted" || value.status === "aborted") {
              return parseUtil_1.INVALID;
            }
            if (key.status === "dirty" || value.status === "dirty") {
              status.dirty();
            }
            finalMap.set(key.value, value.value);
          }
          return { status: status.value, value: finalMap };
        }
      }
    };
    exports.ZodMap = ZodMap;
    ZodMap.create = (keyType, valueType, params) => {
      return new ZodMap({
        valueType,
        keyType,
        typeName: ZodFirstPartyTypeKind.ZodMap,
        ...processCreateParams(params)
      });
    };
    var ZodSet = class extends ZodType {
      _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        if (ctx.parsedType !== util_1.ZodParsedType.set) {
          (0, parseUtil_1.addIssueToContext)(ctx, {
            code: ZodError_1.ZodIssueCode.invalid_type,
            expected: util_1.ZodParsedType.set,
            received: ctx.parsedType
          });
          return parseUtil_1.INVALID;
        }
        const def = this._def;
        if (def.minSize !== null) {
          if (ctx.data.size < def.minSize.value) {
            (0, parseUtil_1.addIssueToContext)(ctx, {
              code: ZodError_1.ZodIssueCode.too_small,
              minimum: def.minSize.value,
              type: "set",
              inclusive: true,
              exact: false,
              message: def.minSize.message
            });
            status.dirty();
          }
        }
        if (def.maxSize !== null) {
          if (ctx.data.size > def.maxSize.value) {
            (0, parseUtil_1.addIssueToContext)(ctx, {
              code: ZodError_1.ZodIssueCode.too_big,
              maximum: def.maxSize.value,
              type: "set",
              inclusive: true,
              exact: false,
              message: def.maxSize.message
            });
            status.dirty();
          }
        }
        const valueType = this._def.valueType;
        function finalizeSet(elements2) {
          const parsedSet = /* @__PURE__ */ new Set();
          for (const element of elements2) {
            if (element.status === "aborted")
              return parseUtil_1.INVALID;
            if (element.status === "dirty")
              status.dirty();
            parsedSet.add(element.value);
          }
          return { status: status.value, value: parsedSet };
        }
        const elements = [...ctx.data.values()].map((item, i) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i)));
        if (ctx.common.async) {
          return Promise.all(elements).then((elements2) => finalizeSet(elements2));
        } else {
          return finalizeSet(elements);
        }
      }
      min(minSize, message) {
        return new ZodSet({
          ...this._def,
          minSize: { value: minSize, message: errorUtil_1.errorUtil.toString(message) }
        });
      }
      max(maxSize, message) {
        return new ZodSet({
          ...this._def,
          maxSize: { value: maxSize, message: errorUtil_1.errorUtil.toString(message) }
        });
      }
      size(size, message) {
        return this.min(size, message).max(size, message);
      }
      nonempty(message) {
        return this.min(1, message);
      }
    };
    exports.ZodSet = ZodSet;
    ZodSet.create = (valueType, params) => {
      return new ZodSet({
        valueType,
        minSize: null,
        maxSize: null,
        typeName: ZodFirstPartyTypeKind.ZodSet,
        ...processCreateParams(params)
      });
    };
    var ZodFunction = class extends ZodType {
      constructor() {
        super(...arguments);
        this.validate = this.implement;
      }
      _parse(input) {
        const { ctx } = this._processInputParams(input);
        if (ctx.parsedType !== util_1.ZodParsedType.function) {
          (0, parseUtil_1.addIssueToContext)(ctx, {
            code: ZodError_1.ZodIssueCode.invalid_type,
            expected: util_1.ZodParsedType.function,
            received: ctx.parsedType
          });
          return parseUtil_1.INVALID;
        }
        function makeArgsIssue(args, error) {
          return (0, parseUtil_1.makeIssue)({
            data: args,
            path: ctx.path,
            errorMaps: [
              ctx.common.contextualErrorMap,
              ctx.schemaErrorMap,
              (0, errors_1.getErrorMap)(),
              errors_1.defaultErrorMap
            ].filter((x) => !!x),
            issueData: {
              code: ZodError_1.ZodIssueCode.invalid_arguments,
              argumentsError: error
            }
          });
        }
        function makeReturnsIssue(returns, error) {
          return (0, parseUtil_1.makeIssue)({
            data: returns,
            path: ctx.path,
            errorMaps: [
              ctx.common.contextualErrorMap,
              ctx.schemaErrorMap,
              (0, errors_1.getErrorMap)(),
              errors_1.defaultErrorMap
            ].filter((x) => !!x),
            issueData: {
              code: ZodError_1.ZodIssueCode.invalid_return_type,
              returnTypeError: error
            }
          });
        }
        const params = { errorMap: ctx.common.contextualErrorMap };
        const fn = ctx.data;
        if (this._def.returns instanceof ZodPromise) {
          return (0, parseUtil_1.OK)(async (...args) => {
            const error = new ZodError_1.ZodError([]);
            const parsedArgs = await this._def.args.parseAsync(args, params).catch((e) => {
              error.addIssue(makeArgsIssue(args, e));
              throw error;
            });
            const result = await fn(...parsedArgs);
            const parsedReturns = await this._def.returns._def.type.parseAsync(result, params).catch((e) => {
              error.addIssue(makeReturnsIssue(result, e));
              throw error;
            });
            return parsedReturns;
          });
        } else {
          return (0, parseUtil_1.OK)((...args) => {
            const parsedArgs = this._def.args.safeParse(args, params);
            if (!parsedArgs.success) {
              throw new ZodError_1.ZodError([makeArgsIssue(args, parsedArgs.error)]);
            }
            const result = fn(...parsedArgs.data);
            const parsedReturns = this._def.returns.safeParse(result, params);
            if (!parsedReturns.success) {
              throw new ZodError_1.ZodError([makeReturnsIssue(result, parsedReturns.error)]);
            }
            return parsedReturns.data;
          });
        }
      }
      parameters() {
        return this._def.args;
      }
      returnType() {
        return this._def.returns;
      }
      args(...items) {
        return new ZodFunction({
          ...this._def,
          args: ZodTuple.create(items).rest(ZodUnknown.create())
        });
      }
      returns(returnType) {
        return new ZodFunction({
          ...this._def,
          returns: returnType
        });
      }
      implement(func) {
        const validatedFunc = this.parse(func);
        return validatedFunc;
      }
      strictImplement(func) {
        const validatedFunc = this.parse(func);
        return validatedFunc;
      }
      static create(args, returns, params) {
        return new ZodFunction({
          args: args ? args : ZodTuple.create([]).rest(ZodUnknown.create()),
          returns: returns || ZodUnknown.create(),
          typeName: ZodFirstPartyTypeKind.ZodFunction,
          ...processCreateParams(params)
        });
      }
    };
    exports.ZodFunction = ZodFunction;
    var ZodLazy = class extends ZodType {
      get schema() {
        return this._def.getter();
      }
      _parse(input) {
        const { ctx } = this._processInputParams(input);
        const lazySchema = this._def.getter();
        return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
      }
    };
    exports.ZodLazy = ZodLazy;
    ZodLazy.create = (getter, params) => {
      return new ZodLazy({
        getter,
        typeName: ZodFirstPartyTypeKind.ZodLazy,
        ...processCreateParams(params)
      });
    };
    var ZodLiteral = class extends ZodType {
      _parse(input) {
        if (input.data !== this._def.value) {
          const ctx = this._getOrReturnCtx(input);
          (0, parseUtil_1.addIssueToContext)(ctx, {
            received: ctx.data,
            code: ZodError_1.ZodIssueCode.invalid_literal,
            expected: this._def.value
          });
          return parseUtil_1.INVALID;
        }
        return { status: "valid", value: input.data };
      }
      get value() {
        return this._def.value;
      }
    };
    exports.ZodLiteral = ZodLiteral;
    ZodLiteral.create = (value, params) => {
      return new ZodLiteral({
        value,
        typeName: ZodFirstPartyTypeKind.ZodLiteral,
        ...processCreateParams(params)
      });
    };
    function createZodEnum(values, params) {
      return new ZodEnum({
        values,
        typeName: ZodFirstPartyTypeKind.ZodEnum,
        ...processCreateParams(params)
      });
    }
    var ZodEnum = class extends ZodType {
      _parse(input) {
        if (typeof input.data !== "string") {
          const ctx = this._getOrReturnCtx(input);
          const expectedValues = this._def.values;
          (0, parseUtil_1.addIssueToContext)(ctx, {
            expected: util_1.util.joinValues(expectedValues),
            received: ctx.parsedType,
            code: ZodError_1.ZodIssueCode.invalid_type
          });
          return parseUtil_1.INVALID;
        }
        if (this._def.values.indexOf(input.data) === -1) {
          const ctx = this._getOrReturnCtx(input);
          const expectedValues = this._def.values;
          (0, parseUtil_1.addIssueToContext)(ctx, {
            received: ctx.data,
            code: ZodError_1.ZodIssueCode.invalid_enum_value,
            options: expectedValues
          });
          return parseUtil_1.INVALID;
        }
        return (0, parseUtil_1.OK)(input.data);
      }
      get options() {
        return this._def.values;
      }
      get enum() {
        const enumValues = {};
        for (const val of this._def.values) {
          enumValues[val] = val;
        }
        return enumValues;
      }
      get Values() {
        const enumValues = {};
        for (const val of this._def.values) {
          enumValues[val] = val;
        }
        return enumValues;
      }
      get Enum() {
        const enumValues = {};
        for (const val of this._def.values) {
          enumValues[val] = val;
        }
        return enumValues;
      }
      extract(values) {
        return ZodEnum.create(values);
      }
      exclude(values) {
        return ZodEnum.create(this.options.filter((opt) => !values.includes(opt)));
      }
    };
    exports.ZodEnum = ZodEnum;
    ZodEnum.create = createZodEnum;
    var ZodNativeEnum = class extends ZodType {
      _parse(input) {
        const nativeEnumValues = util_1.util.getValidEnumValues(this._def.values);
        const ctx = this._getOrReturnCtx(input);
        if (ctx.parsedType !== util_1.ZodParsedType.string && ctx.parsedType !== util_1.ZodParsedType.number) {
          const expectedValues = util_1.util.objectValues(nativeEnumValues);
          (0, parseUtil_1.addIssueToContext)(ctx, {
            expected: util_1.util.joinValues(expectedValues),
            received: ctx.parsedType,
            code: ZodError_1.ZodIssueCode.invalid_type
          });
          return parseUtil_1.INVALID;
        }
        if (nativeEnumValues.indexOf(input.data) === -1) {
          const expectedValues = util_1.util.objectValues(nativeEnumValues);
          (0, parseUtil_1.addIssueToContext)(ctx, {
            received: ctx.data,
            code: ZodError_1.ZodIssueCode.invalid_enum_value,
            options: expectedValues
          });
          return parseUtil_1.INVALID;
        }
        return (0, parseUtil_1.OK)(input.data);
      }
      get enum() {
        return this._def.values;
      }
    };
    exports.ZodNativeEnum = ZodNativeEnum;
    ZodNativeEnum.create = (values, params) => {
      return new ZodNativeEnum({
        values,
        typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
        ...processCreateParams(params)
      });
    };
    var ZodPromise = class extends ZodType {
      unwrap() {
        return this._def.type;
      }
      _parse(input) {
        const { ctx } = this._processInputParams(input);
        if (ctx.parsedType !== util_1.ZodParsedType.promise && ctx.common.async === false) {
          (0, parseUtil_1.addIssueToContext)(ctx, {
            code: ZodError_1.ZodIssueCode.invalid_type,
            expected: util_1.ZodParsedType.promise,
            received: ctx.parsedType
          });
          return parseUtil_1.INVALID;
        }
        const promisified = ctx.parsedType === util_1.ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data);
        return (0, parseUtil_1.OK)(promisified.then((data) => {
          return this._def.type.parseAsync(data, {
            path: ctx.path,
            errorMap: ctx.common.contextualErrorMap
          });
        }));
      }
    };
    exports.ZodPromise = ZodPromise;
    ZodPromise.create = (schema, params) => {
      return new ZodPromise({
        type: schema,
        typeName: ZodFirstPartyTypeKind.ZodPromise,
        ...processCreateParams(params)
      });
    };
    var ZodEffects = class extends ZodType {
      innerType() {
        return this._def.schema;
      }
      sourceType() {
        return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
      }
      _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        const effect = this._def.effect || null;
        if (effect.type === "preprocess") {
          const processed = effect.transform(ctx.data);
          if (ctx.common.async) {
            return Promise.resolve(processed).then((processed2) => {
              return this._def.schema._parseAsync({
                data: processed2,
                path: ctx.path,
                parent: ctx
              });
            });
          } else {
            return this._def.schema._parseSync({
              data: processed,
              path: ctx.path,
              parent: ctx
            });
          }
        }
        const checkCtx = {
          addIssue: (arg) => {
            (0, parseUtil_1.addIssueToContext)(ctx, arg);
            if (arg.fatal) {
              status.abort();
            } else {
              status.dirty();
            }
          },
          get path() {
            return ctx.path;
          }
        };
        checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
        if (effect.type === "refinement") {
          const executeRefinement = (acc) => {
            const result = effect.refinement(acc, checkCtx);
            if (ctx.common.async) {
              return Promise.resolve(result);
            }
            if (result instanceof Promise) {
              throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
            }
            return acc;
          };
          if (ctx.common.async === false) {
            const inner = this._def.schema._parseSync({
              data: ctx.data,
              path: ctx.path,
              parent: ctx
            });
            if (inner.status === "aborted")
              return parseUtil_1.INVALID;
            if (inner.status === "dirty")
              status.dirty();
            executeRefinement(inner.value);
            return { status: status.value, value: inner.value };
          } else {
            return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((inner) => {
              if (inner.status === "aborted")
                return parseUtil_1.INVALID;
              if (inner.status === "dirty")
                status.dirty();
              return executeRefinement(inner.value).then(() => {
                return { status: status.value, value: inner.value };
              });
            });
          }
        }
        if (effect.type === "transform") {
          if (ctx.common.async === false) {
            const base = this._def.schema._parseSync({
              data: ctx.data,
              path: ctx.path,
              parent: ctx
            });
            if (!(0, parseUtil_1.isValid)(base))
              return base;
            const result = effect.transform(base.value, checkCtx);
            if (result instanceof Promise) {
              throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
            }
            return { status: status.value, value: result };
          } else {
            return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((base) => {
              if (!(0, parseUtil_1.isValid)(base))
                return base;
              return Promise.resolve(effect.transform(base.value, checkCtx)).then((result) => ({ status: status.value, value: result }));
            });
          }
        }
        util_1.util.assertNever(effect);
      }
    };
    exports.ZodEffects = ZodEffects;
    exports.ZodTransformer = ZodEffects;
    ZodEffects.create = (schema, effect, params) => {
      return new ZodEffects({
        schema,
        typeName: ZodFirstPartyTypeKind.ZodEffects,
        effect,
        ...processCreateParams(params)
      });
    };
    ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
      return new ZodEffects({
        schema,
        effect: { type: "preprocess", transform: preprocess },
        typeName: ZodFirstPartyTypeKind.ZodEffects,
        ...processCreateParams(params)
      });
    };
    var ZodOptional = class extends ZodType {
      _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType === util_1.ZodParsedType.undefined) {
          return (0, parseUtil_1.OK)(void 0);
        }
        return this._def.innerType._parse(input);
      }
      unwrap() {
        return this._def.innerType;
      }
    };
    exports.ZodOptional = ZodOptional;
    ZodOptional.create = (type, params) => {
      return new ZodOptional({
        innerType: type,
        typeName: ZodFirstPartyTypeKind.ZodOptional,
        ...processCreateParams(params)
      });
    };
    var ZodNullable = class extends ZodType {
      _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType === util_1.ZodParsedType.null) {
          return (0, parseUtil_1.OK)(null);
        }
        return this._def.innerType._parse(input);
      }
      unwrap() {
        return this._def.innerType;
      }
    };
    exports.ZodNullable = ZodNullable;
    ZodNullable.create = (type, params) => {
      return new ZodNullable({
        innerType: type,
        typeName: ZodFirstPartyTypeKind.ZodNullable,
        ...processCreateParams(params)
      });
    };
    var ZodDefault = class extends ZodType {
      _parse(input) {
        const { ctx } = this._processInputParams(input);
        let data = ctx.data;
        if (ctx.parsedType === util_1.ZodParsedType.undefined) {
          data = this._def.defaultValue();
        }
        return this._def.innerType._parse({
          data,
          path: ctx.path,
          parent: ctx
        });
      }
      removeDefault() {
        return this._def.innerType;
      }
    };
    exports.ZodDefault = ZodDefault;
    ZodDefault.create = (type, params) => {
      return new ZodDefault({
        innerType: type,
        typeName: ZodFirstPartyTypeKind.ZodDefault,
        defaultValue: typeof params.default === "function" ? params.default : () => params.default,
        ...processCreateParams(params)
      });
    };
    var ZodCatch = class extends ZodType {
      _parse(input) {
        const { ctx } = this._processInputParams(input);
        const result = this._def.innerType._parse({
          data: ctx.data,
          path: ctx.path,
          parent: {
            ...ctx,
            common: {
              ...ctx.common,
              issues: []
              // don't collect issues from inner type
            }
          }
        });
        if ((0, parseUtil_1.isAsync)(result)) {
          return result.then((result2) => {
            return {
              status: "valid",
              value: result2.status === "valid" ? result2.value : this._def.catchValue()
            };
          });
        } else {
          return {
            status: "valid",
            value: result.status === "valid" ? result.value : this._def.catchValue()
          };
        }
      }
      removeCatch() {
        return this._def.innerType;
      }
    };
    exports.ZodCatch = ZodCatch;
    ZodCatch.create = (type, params) => {
      return new ZodCatch({
        innerType: type,
        typeName: ZodFirstPartyTypeKind.ZodCatch,
        catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
        ...processCreateParams(params)
      });
    };
    var ZodNaN = class extends ZodType {
      _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== util_1.ZodParsedType.nan) {
          const ctx = this._getOrReturnCtx(input);
          (0, parseUtil_1.addIssueToContext)(ctx, {
            code: ZodError_1.ZodIssueCode.invalid_type,
            expected: util_1.ZodParsedType.nan,
            received: ctx.parsedType
          });
          return parseUtil_1.INVALID;
        }
        return { status: "valid", value: input.data };
      }
    };
    exports.ZodNaN = ZodNaN;
    ZodNaN.create = (params) => {
      return new ZodNaN({
        typeName: ZodFirstPartyTypeKind.ZodNaN,
        ...processCreateParams(params)
      });
    };
    exports.BRAND = Symbol("zod_brand");
    var ZodBranded = class extends ZodType {
      _parse(input) {
        const { ctx } = this._processInputParams(input);
        const data = ctx.data;
        return this._def.type._parse({
          data,
          path: ctx.path,
          parent: ctx
        });
      }
      unwrap() {
        return this._def.type;
      }
    };
    exports.ZodBranded = ZodBranded;
    var ZodPipeline = class extends ZodType {
      _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        if (ctx.common.async) {
          const handleAsync = async () => {
            const inResult = await this._def.in._parseAsync({
              data: ctx.data,
              path: ctx.path,
              parent: ctx
            });
            if (inResult.status === "aborted")
              return parseUtil_1.INVALID;
            if (inResult.status === "dirty") {
              status.dirty();
              return (0, parseUtil_1.DIRTY)(inResult.value);
            } else {
              return this._def.out._parseAsync({
                data: inResult.value,
                path: ctx.path,
                parent: ctx
              });
            }
          };
          return handleAsync();
        } else {
          const inResult = this._def.in._parseSync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          });
          if (inResult.status === "aborted")
            return parseUtil_1.INVALID;
          if (inResult.status === "dirty") {
            status.dirty();
            return {
              status: "dirty",
              value: inResult.value
            };
          } else {
            return this._def.out._parseSync({
              data: inResult.value,
              path: ctx.path,
              parent: ctx
            });
          }
        }
      }
      static create(a, b) {
        return new ZodPipeline({
          in: a,
          out: b,
          typeName: ZodFirstPartyTypeKind.ZodPipeline
        });
      }
    };
    exports.ZodPipeline = ZodPipeline;
    var custom = (check, params = {}, fatal) => {
      if (check)
        return ZodAny.create().superRefine((data, ctx) => {
          if (!check(data)) {
            const p = typeof params === "function" ? params(data) : params;
            const p2 = typeof p === "string" ? { message: p } : p;
            ctx.addIssue({ code: "custom", ...p2, fatal });
          }
        });
      return ZodAny.create();
    };
    exports.custom = custom;
    exports.late = {
      object: ZodObject.lazycreate
    };
    var ZodFirstPartyTypeKind;
    (function(ZodFirstPartyTypeKind2) {
      ZodFirstPartyTypeKind2["ZodString"] = "ZodString";
      ZodFirstPartyTypeKind2["ZodNumber"] = "ZodNumber";
      ZodFirstPartyTypeKind2["ZodNaN"] = "ZodNaN";
      ZodFirstPartyTypeKind2["ZodBigInt"] = "ZodBigInt";
      ZodFirstPartyTypeKind2["ZodBoolean"] = "ZodBoolean";
      ZodFirstPartyTypeKind2["ZodDate"] = "ZodDate";
      ZodFirstPartyTypeKind2["ZodSymbol"] = "ZodSymbol";
      ZodFirstPartyTypeKind2["ZodUndefined"] = "ZodUndefined";
      ZodFirstPartyTypeKind2["ZodNull"] = "ZodNull";
      ZodFirstPartyTypeKind2["ZodAny"] = "ZodAny";
      ZodFirstPartyTypeKind2["ZodUnknown"] = "ZodUnknown";
      ZodFirstPartyTypeKind2["ZodNever"] = "ZodNever";
      ZodFirstPartyTypeKind2["ZodVoid"] = "ZodVoid";
      ZodFirstPartyTypeKind2["ZodArray"] = "ZodArray";
      ZodFirstPartyTypeKind2["ZodObject"] = "ZodObject";
      ZodFirstPartyTypeKind2["ZodUnion"] = "ZodUnion";
      ZodFirstPartyTypeKind2["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
      ZodFirstPartyTypeKind2["ZodIntersection"] = "ZodIntersection";
      ZodFirstPartyTypeKind2["ZodTuple"] = "ZodTuple";
      ZodFirstPartyTypeKind2["ZodRecord"] = "ZodRecord";
      ZodFirstPartyTypeKind2["ZodMap"] = "ZodMap";
      ZodFirstPartyTypeKind2["ZodSet"] = "ZodSet";
      ZodFirstPartyTypeKind2["ZodFunction"] = "ZodFunction";
      ZodFirstPartyTypeKind2["ZodLazy"] = "ZodLazy";
      ZodFirstPartyTypeKind2["ZodLiteral"] = "ZodLiteral";
      ZodFirstPartyTypeKind2["ZodEnum"] = "ZodEnum";
      ZodFirstPartyTypeKind2["ZodEffects"] = "ZodEffects";
      ZodFirstPartyTypeKind2["ZodNativeEnum"] = "ZodNativeEnum";
      ZodFirstPartyTypeKind2["ZodOptional"] = "ZodOptional";
      ZodFirstPartyTypeKind2["ZodNullable"] = "ZodNullable";
      ZodFirstPartyTypeKind2["ZodDefault"] = "ZodDefault";
      ZodFirstPartyTypeKind2["ZodCatch"] = "ZodCatch";
      ZodFirstPartyTypeKind2["ZodPromise"] = "ZodPromise";
      ZodFirstPartyTypeKind2["ZodBranded"] = "ZodBranded";
      ZodFirstPartyTypeKind2["ZodPipeline"] = "ZodPipeline";
    })(ZodFirstPartyTypeKind = exports.ZodFirstPartyTypeKind || (exports.ZodFirstPartyTypeKind = {}));
    var instanceOfType = (cls, params = {
      message: `Input not instance of ${cls.name}`
    }) => (0, exports.custom)((data) => data instanceof cls, params, true);
    exports.instanceof = instanceOfType;
    var stringType = ZodString.create;
    exports.string = stringType;
    var numberType = ZodNumber.create;
    exports.number = numberType;
    var nanType = ZodNaN.create;
    exports.nan = nanType;
    var bigIntType = ZodBigInt.create;
    exports.bigint = bigIntType;
    var booleanType = ZodBoolean.create;
    exports.boolean = booleanType;
    var dateType = ZodDate.create;
    exports.date = dateType;
    var symbolType = ZodSymbol.create;
    exports.symbol = symbolType;
    var undefinedType = ZodUndefined.create;
    exports.undefined = undefinedType;
    var nullType = ZodNull.create;
    exports.null = nullType;
    var anyType = ZodAny.create;
    exports.any = anyType;
    var unknownType = ZodUnknown.create;
    exports.unknown = unknownType;
    var neverType = ZodNever.create;
    exports.never = neverType;
    var voidType = ZodVoid.create;
    exports.void = voidType;
    var arrayType = ZodArray.create;
    exports.array = arrayType;
    var objectType = ZodObject.create;
    exports.object = objectType;
    var strictObjectType = ZodObject.strictCreate;
    exports.strictObject = strictObjectType;
    var unionType = ZodUnion.create;
    exports.union = unionType;
    var discriminatedUnionType = ZodDiscriminatedUnion.create;
    exports.discriminatedUnion = discriminatedUnionType;
    var intersectionType = ZodIntersection.create;
    exports.intersection = intersectionType;
    var tupleType = ZodTuple.create;
    exports.tuple = tupleType;
    var recordType = ZodRecord.create;
    exports.record = recordType;
    var mapType = ZodMap.create;
    exports.map = mapType;
    var setType = ZodSet.create;
    exports.set = setType;
    var functionType = ZodFunction.create;
    exports.function = functionType;
    var lazyType = ZodLazy.create;
    exports.lazy = lazyType;
    var literalType = ZodLiteral.create;
    exports.literal = literalType;
    var enumType = ZodEnum.create;
    exports.enum = enumType;
    var nativeEnumType = ZodNativeEnum.create;
    exports.nativeEnum = nativeEnumType;
    var promiseType = ZodPromise.create;
    exports.promise = promiseType;
    var effectsType = ZodEffects.create;
    exports.effect = effectsType;
    exports.transformer = effectsType;
    var optionalType = ZodOptional.create;
    exports.optional = optionalType;
    var nullableType = ZodNullable.create;
    exports.nullable = nullableType;
    var preprocessType = ZodEffects.createWithPreprocess;
    exports.preprocess = preprocessType;
    var pipelineType = ZodPipeline.create;
    exports.pipeline = pipelineType;
    var ostring = () => stringType().optional();
    exports.ostring = ostring;
    var onumber = () => numberType().optional();
    exports.onumber = onumber;
    var oboolean = () => booleanType().optional();
    exports.oboolean = oboolean;
    exports.coerce = {
      string: (arg) => ZodString.create({ ...arg, coerce: true }),
      number: (arg) => ZodNumber.create({ ...arg, coerce: true }),
      boolean: (arg) => ZodBoolean.create({
        ...arg,
        coerce: true
      }),
      bigint: (arg) => ZodBigInt.create({ ...arg, coerce: true }),
      date: (arg) => ZodDate.create({ ...arg, coerce: true })
    };
    exports.NEVER = parseUtil_1.INVALID;
  }
});

// ../../node_modules/.pnpm/zod@3.20.3/node_modules/zod/lib/external.js
var require_external = __commonJS({
  "../../node_modules/.pnpm/zod@3.20.3/node_modules/zod/lib/external.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
          __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(require_errors(), exports);
    __exportStar(require_parseUtil(), exports);
    __exportStar(require_typeAliases(), exports);
    __exportStar(require_util(), exports);
    __exportStar(require_types(), exports);
    __exportStar(require_ZodError(), exports);
  }
});

// ../../node_modules/.pnpm/zod@3.20.3/node_modules/zod/lib/index.js
var require_lib = __commonJS({
  "../../node_modules/.pnpm/zod@3.20.3/node_modules/zod/lib/index.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod2) {
      if (mod2 && mod2.__esModule)
        return mod2;
      var result = {};
      if (mod2 != null) {
        for (var k in mod2)
          if (k !== "default" && Object.prototype.hasOwnProperty.call(mod2, k))
            __createBinding(result, mod2, k);
      }
      __setModuleDefault(result, mod2);
      return result;
    };
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
          __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.z = void 0;
    var mod = __importStar(require_external());
    exports.z = mod;
    __exportStar(require_external(), exports);
    exports.default = mod;
  }
});

// src/formIdService.ts
var formIdService_exports = {};
__export(formIdService_exports, {
  handler: () => handler,
  t: () => t
});
module.exports = __toCommonJS(formIdService_exports);

// esbuild-resolve:@trpc/server
var server_exports = {};
__export(server_exports, {
  default: () => import_server.default
});
__reExport(server_exports, __toESM(require_dist()));
var import_server = __toESM(require_dist());

// esbuild-resolve:@trpc/server/adapters/aws-lambda
var aws_lambda_exports = {};
__export(aws_lambda_exports, {
  default: () => import_aws_lambda.default
});
__reExport(aws_lambda_exports, __toESM(require_aws_lambda2()));
var import_aws_lambda = __toESM(require_aws_lambda2());

// esbuild-resolve:zod
var zod_exports = {};
__export(zod_exports, {
  default: () => import_zod.default
});
__reExport(zod_exports, __toESM(require_lib()));
var import_zod = __toESM(require_lib());

// ../common-lib/src/lib/schema/dbForm.ts
var createForm = zod_exports.z.object({
  formName: zod_exports.z.string()
});
var mutateForm = zod_exports.z.object({
  formId: zod_exports.z.string()
});
var dbForm = zod_exports.z.object({
  formStatus: zod_exports.z.union([
    zod_exports.z.literal("created"),
    zod_exports.z.literal("orphaned"),
    zod_exports.z.literal("issued"),
    zod_exports.z.literal("archived")
  ])
  // dataCreated: z.date(),
  // dateUpdated: z.date(),
}).merge(createForm).merge(mutateForm);

// src/util.ts
var import_client_dynamodb = require("@aws-sdk/client-dynamodb");
var createNewFormImpl = async (client, counterClient, formName) => {
  const { newId } = await getNewFormId(client, counterClient, { formName });
  const item = {
    formName,
    formId: newId,
    formStatus: "created"
  };
  const command = new import_client_dynamodb.PutItemCommand({
    ...client.params,
    Item: {
      formId: { S: item.formId },
      formStatus: { S: item.formStatus },
      formName: { S: item.formName }
    }
  });
  const resp = await client.client.send(command);
  console.log("INFO CreateNewForm:", resp);
  return {
    item
  };
};
var getNewFormId = async (client, counterClient, { formName }) => {
  const clientScan = new import_client_dynamodb.ScanCommand({
    ...client.params,
    FilterExpression: "formStatus = :status",
    ExpressionAttributeValues: {
      ":status": { S: "orphaned" }
    }
  });
  const scanResp = await client.client.send(clientScan);
  console.log(scanResp.Items?.length > 0 ? scanResp.Items : "no items found for this query");
  const selectedFormId = scanResp.Items?.at(0)?.formId.S;
  if (selectedFormId) {
    return {
      newId: selectedFormId,
      message: "INFO reusing an orphaned formId"
    };
  }
  const { status, newId } = await incrementCounter(counterClient);
  console.log(status);
  return {
    newId,
    message: "INFO generated a new formId"
  };
};
var archiveFormByIdImpl = async (client, counterClient, formId) => {
  const command = new import_client_dynamodb.UpdateItemCommand({
    ...client.params,
    Key: {
      formId: { S: formId }
    },
    UpdateExpression: "SET formStatus = :status",
    ExpressionAttributeValues: { ":status": { S: "archived" } },
    ReturnValues: "UPDATED_NEW"
  });
  const resp = await client.client.send(command);
  console.log("INFO ArchiveByFormId:", resp);
  return {
    status: resp.$metadata.httpStatusCode,
    message: resp.$metadata.httpStatusCode === 200 ? `INFO ${resp.Attributes?.formName.S ?? formId} archived successfully` : `INFO Could not archive formId:${formId}`
  };
};
var rejectFormByIdImpl = async (client, counterClient, formId) => {
  const command = new import_client_dynamodb.UpdateItemCommand({
    ...client.params,
    Key: {
      formId: { S: formId }
    },
    UpdateExpression: "SET formStatus = :status",
    ExpressionAttributeValues: { ":status": { S: "orphaned" } },
    ReturnValues: "UPDATED_NEW"
  });
  const resp = await client.client.send(command);
  console.log("INFO RejectByFormId:", resp);
  return {
    status: resp.$metadata.httpStatusCode,
    message: resp.$metadata.httpStatusCode === 200 ? `INFO ${resp.Attributes?.formName.S ?? formId} rejected successfully` : `INFO Could not reject formId:${formId}`
  };
};
var approveFormByIdImpl = async (client, counterClient, formId) => {
  const command = new import_client_dynamodb.UpdateItemCommand({
    ...client.params,
    Key: {
      formId: { S: formId }
    },
    UpdateExpression: "SET formStatus = :status",
    ExpressionAttributeValues: { ":status": { S: "issued" } },
    ReturnValues: "UPDATED_NEW"
  });
  const resp = await client.client.send(command);
  console.log("INFO ApproveByFormId:", resp);
  return {
    status: resp.$metadata.httpStatusCode,
    message: resp.$metadata.httpStatusCode === 200 ? `INFO ${resp.Attributes?.formName.S ?? formId} approved successfully` : `INFO Could not approve formId:${formId}`
  };
};
var incrementCounter = async ({ client, params }) => {
  const command = new import_client_dynamodb.UpdateItemCommand({
    ...params,
    Key: {
      counterKey: { S: "current" }
    },
    UpdateExpression: "SET formCount = formCount + :incr",
    ExpressionAttributeValues: { ":incr": { N: "1" } },
    ReturnValues: "UPDATED_NEW"
  });
  const resp = await client.send(command);
  console.log("INFO Counter DB:", resp);
  return {
    status: resp.$metadata.httpStatusCode,
    newId: formatFormId("ONDON", resp.Attributes?.formCount.N)
  };
};
var formatFormId = (prefix, n) => {
  const id = ("000000" + (n ?? "0")).slice(-6);
  return `${prefix}${id}`;
};
var initOperations = ({ dbTableName, counterDbTableName }) => {
  const client = {
    client: new import_client_dynamodb.DynamoDBClient({}),
    params: {
      TableName: dbTableName
    }
  };
  const counterClient = {
    client: new import_client_dynamodb.DynamoDBClient({}),
    params: {
      TableName: counterDbTableName
    }
  };
  return {
    createNewForm: (formName) => createNewFormImpl(client, counterClient, formName),
    processFormById: (formId, action) => {
      switch (action) {
        case "approve":
          return approveFormByIdImpl(client, counterClient, formId);
        case "archive":
          return archiveFormByIdImpl(client, counterClient, formId);
        case "reject":
          return rejectFormByIdImpl(client, counterClient, formId);
      }
    }
  };
};

// src/formIdService.ts
var t = server_exports.initTRPC.create();
var db = process.env.DB;
var counterDb = process.env.COUNTER_DB;
var { createNewForm, processFormById } = initOperations({ dbTableName: db, counterDbTableName: counterDb });
var appRouter = t.router({
  getFormId: t.procedure.input(zod_exports.z.string()).query((req) => ({ id: req.input, greeting: "Hello from tRPC" })),
  newForm: t.procedure.input(createForm).mutation(async ({ input }) => {
    const createResult = await createNewForm(input.formName);
    return {
      message: "newForm not yet implemented",
      id: createResult
    };
  }),
  rejectFormById: t.procedure.input(mutateForm).mutation(async ({ input }) => await processFormById(input.formId, "reject")),
  archiveFormById: t.procedure.input(mutateForm).mutation(async ({ input }) => await processFormById(input.formId, "archive")),
  approveFormById: t.procedure.input(mutateForm).mutation(async ({ input }) => await processFormById(input.formId, "approve"))
});
var createContext = ({ event, context }) => ({});
var handler = (0, aws_lambda_exports.awsLambdaRequestHandler)({
  router: appRouter,
  createContext
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler,
  t
});

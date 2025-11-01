
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model IngestDocument
 * 
 */
export type IngestDocument = $Result.DefaultSelection<Prisma.$IngestDocumentPayload>
/**
 * Model IngestDocumentChunk
 * 
 */
export type IngestDocumentChunk = $Result.DefaultSelection<Prisma.$IngestDocumentChunkPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more IngestDocuments
 * const ingestDocuments = await prisma.ingestDocument.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more IngestDocuments
   * const ingestDocuments = await prisma.ingestDocument.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.ingestDocument`: Exposes CRUD operations for the **IngestDocument** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more IngestDocuments
    * const ingestDocuments = await prisma.ingestDocument.findMany()
    * ```
    */
  get ingestDocument(): Prisma.IngestDocumentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.ingestDocumentChunk`: Exposes CRUD operations for the **IngestDocumentChunk** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more IngestDocumentChunks
    * const ingestDocumentChunks = await prisma.ingestDocumentChunk.findMany()
    * ```
    */
  get ingestDocumentChunk(): Prisma.IngestDocumentChunkDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.18.0
   * Query Engine version: 34b5a692b7bd79939a9a2c3ef97d816e749cda2f
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    IngestDocument: 'IngestDocument',
    IngestDocumentChunk: 'IngestDocumentChunk'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "ingestDocument" | "ingestDocumentChunk"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      IngestDocument: {
        payload: Prisma.$IngestDocumentPayload<ExtArgs>
        fields: Prisma.IngestDocumentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.IngestDocumentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IngestDocumentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.IngestDocumentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IngestDocumentPayload>
          }
          findFirst: {
            args: Prisma.IngestDocumentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IngestDocumentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.IngestDocumentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IngestDocumentPayload>
          }
          findMany: {
            args: Prisma.IngestDocumentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IngestDocumentPayload>[]
          }
          create: {
            args: Prisma.IngestDocumentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IngestDocumentPayload>
          }
          createMany: {
            args: Prisma.IngestDocumentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.IngestDocumentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IngestDocumentPayload>[]
          }
          delete: {
            args: Prisma.IngestDocumentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IngestDocumentPayload>
          }
          update: {
            args: Prisma.IngestDocumentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IngestDocumentPayload>
          }
          deleteMany: {
            args: Prisma.IngestDocumentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.IngestDocumentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.IngestDocumentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IngestDocumentPayload>[]
          }
          upsert: {
            args: Prisma.IngestDocumentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IngestDocumentPayload>
          }
          aggregate: {
            args: Prisma.IngestDocumentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateIngestDocument>
          }
          groupBy: {
            args: Prisma.IngestDocumentGroupByArgs<ExtArgs>
            result: $Utils.Optional<IngestDocumentGroupByOutputType>[]
          }
          count: {
            args: Prisma.IngestDocumentCountArgs<ExtArgs>
            result: $Utils.Optional<IngestDocumentCountAggregateOutputType> | number
          }
        }
      }
      IngestDocumentChunk: {
        payload: Prisma.$IngestDocumentChunkPayload<ExtArgs>
        fields: Prisma.IngestDocumentChunkFieldRefs
        operations: {
          findUnique: {
            args: Prisma.IngestDocumentChunkFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IngestDocumentChunkPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.IngestDocumentChunkFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IngestDocumentChunkPayload>
          }
          findFirst: {
            args: Prisma.IngestDocumentChunkFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IngestDocumentChunkPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.IngestDocumentChunkFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IngestDocumentChunkPayload>
          }
          findMany: {
            args: Prisma.IngestDocumentChunkFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IngestDocumentChunkPayload>[]
          }
          create: {
            args: Prisma.IngestDocumentChunkCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IngestDocumentChunkPayload>
          }
          createMany: {
            args: Prisma.IngestDocumentChunkCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.IngestDocumentChunkCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IngestDocumentChunkPayload>[]
          }
          delete: {
            args: Prisma.IngestDocumentChunkDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IngestDocumentChunkPayload>
          }
          update: {
            args: Prisma.IngestDocumentChunkUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IngestDocumentChunkPayload>
          }
          deleteMany: {
            args: Prisma.IngestDocumentChunkDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.IngestDocumentChunkUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.IngestDocumentChunkUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IngestDocumentChunkPayload>[]
          }
          upsert: {
            args: Prisma.IngestDocumentChunkUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IngestDocumentChunkPayload>
          }
          aggregate: {
            args: Prisma.IngestDocumentChunkAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateIngestDocumentChunk>
          }
          groupBy: {
            args: Prisma.IngestDocumentChunkGroupByArgs<ExtArgs>
            result: $Utils.Optional<IngestDocumentChunkGroupByOutputType>[]
          }
          count: {
            args: Prisma.IngestDocumentChunkCountArgs<ExtArgs>
            result: $Utils.Optional<IngestDocumentChunkCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    ingestDocument?: IngestDocumentOmit
    ingestDocumentChunk?: IngestDocumentChunkOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type IngestDocumentCountOutputType
   */

  export type IngestDocumentCountOutputType = {
    chunks: number
  }

  export type IngestDocumentCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    chunks?: boolean | IngestDocumentCountOutputTypeCountChunksArgs
  }

  // Custom InputTypes
  /**
   * IngestDocumentCountOutputType without action
   */
  export type IngestDocumentCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IngestDocumentCountOutputType
     */
    select?: IngestDocumentCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * IngestDocumentCountOutputType without action
   */
  export type IngestDocumentCountOutputTypeCountChunksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: IngestDocumentChunkWhereInput
  }


  /**
   * Models
   */

  /**
   * Model IngestDocument
   */

  export type AggregateIngestDocument = {
    _count: IngestDocumentCountAggregateOutputType | null
    _min: IngestDocumentMinAggregateOutputType | null
    _max: IngestDocumentMaxAggregateOutputType | null
  }

  export type IngestDocumentMinAggregateOutputType = {
    documentId: string | null
    tenantId: string | null
    requestedBy: string | null
    title: string | null
    contentType: string | null
    visibility: string | null
    retentionPolicy: string | null
    sourceUri: string | null
    sourceBucket: string | null
    sourceKey: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type IngestDocumentMaxAggregateOutputType = {
    documentId: string | null
    tenantId: string | null
    requestedBy: string | null
    title: string | null
    contentType: string | null
    visibility: string | null
    retentionPolicy: string | null
    sourceUri: string | null
    sourceBucket: string | null
    sourceKey: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type IngestDocumentCountAggregateOutputType = {
    documentId: number
    tenantId: number
    requestedBy: number
    title: number
    contentType: number
    visibility: number
    retentionPolicy: number
    metadata: number
    sourceUri: number
    sourceBucket: number
    sourceKey: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type IngestDocumentMinAggregateInputType = {
    documentId?: true
    tenantId?: true
    requestedBy?: true
    title?: true
    contentType?: true
    visibility?: true
    retentionPolicy?: true
    sourceUri?: true
    sourceBucket?: true
    sourceKey?: true
    createdAt?: true
    updatedAt?: true
  }

  export type IngestDocumentMaxAggregateInputType = {
    documentId?: true
    tenantId?: true
    requestedBy?: true
    title?: true
    contentType?: true
    visibility?: true
    retentionPolicy?: true
    sourceUri?: true
    sourceBucket?: true
    sourceKey?: true
    createdAt?: true
    updatedAt?: true
  }

  export type IngestDocumentCountAggregateInputType = {
    documentId?: true
    tenantId?: true
    requestedBy?: true
    title?: true
    contentType?: true
    visibility?: true
    retentionPolicy?: true
    metadata?: true
    sourceUri?: true
    sourceBucket?: true
    sourceKey?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type IngestDocumentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which IngestDocument to aggregate.
     */
    where?: IngestDocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IngestDocuments to fetch.
     */
    orderBy?: IngestDocumentOrderByWithRelationInput | IngestDocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: IngestDocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IngestDocuments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IngestDocuments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned IngestDocuments
    **/
    _count?: true | IngestDocumentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: IngestDocumentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: IngestDocumentMaxAggregateInputType
  }

  export type GetIngestDocumentAggregateType<T extends IngestDocumentAggregateArgs> = {
        [P in keyof T & keyof AggregateIngestDocument]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateIngestDocument[P]>
      : GetScalarType<T[P], AggregateIngestDocument[P]>
  }




  export type IngestDocumentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: IngestDocumentWhereInput
    orderBy?: IngestDocumentOrderByWithAggregationInput | IngestDocumentOrderByWithAggregationInput[]
    by: IngestDocumentScalarFieldEnum[] | IngestDocumentScalarFieldEnum
    having?: IngestDocumentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: IngestDocumentCountAggregateInputType | true
    _min?: IngestDocumentMinAggregateInputType
    _max?: IngestDocumentMaxAggregateInputType
  }

  export type IngestDocumentGroupByOutputType = {
    documentId: string
    tenantId: string | null
    requestedBy: string | null
    title: string
    contentType: string | null
    visibility: string | null
    retentionPolicy: string | null
    metadata: JsonValue | null
    sourceUri: string | null
    sourceBucket: string | null
    sourceKey: string | null
    createdAt: Date
    updatedAt: Date
    _count: IngestDocumentCountAggregateOutputType | null
    _min: IngestDocumentMinAggregateOutputType | null
    _max: IngestDocumentMaxAggregateOutputType | null
  }

  type GetIngestDocumentGroupByPayload<T extends IngestDocumentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<IngestDocumentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof IngestDocumentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], IngestDocumentGroupByOutputType[P]>
            : GetScalarType<T[P], IngestDocumentGroupByOutputType[P]>
        }
      >
    >


  export type IngestDocumentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    documentId?: boolean
    tenantId?: boolean
    requestedBy?: boolean
    title?: boolean
    contentType?: boolean
    visibility?: boolean
    retentionPolicy?: boolean
    metadata?: boolean
    sourceUri?: boolean
    sourceBucket?: boolean
    sourceKey?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    chunks?: boolean | IngestDocument$chunksArgs<ExtArgs>
    _count?: boolean | IngestDocumentCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["ingestDocument"]>

  export type IngestDocumentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    documentId?: boolean
    tenantId?: boolean
    requestedBy?: boolean
    title?: boolean
    contentType?: boolean
    visibility?: boolean
    retentionPolicy?: boolean
    metadata?: boolean
    sourceUri?: boolean
    sourceBucket?: boolean
    sourceKey?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["ingestDocument"]>

  export type IngestDocumentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    documentId?: boolean
    tenantId?: boolean
    requestedBy?: boolean
    title?: boolean
    contentType?: boolean
    visibility?: boolean
    retentionPolicy?: boolean
    metadata?: boolean
    sourceUri?: boolean
    sourceBucket?: boolean
    sourceKey?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["ingestDocument"]>

  export type IngestDocumentSelectScalar = {
    documentId?: boolean
    tenantId?: boolean
    requestedBy?: boolean
    title?: boolean
    contentType?: boolean
    visibility?: boolean
    retentionPolicy?: boolean
    metadata?: boolean
    sourceUri?: boolean
    sourceBucket?: boolean
    sourceKey?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type IngestDocumentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"documentId" | "tenantId" | "requestedBy" | "title" | "contentType" | "visibility" | "retentionPolicy" | "metadata" | "sourceUri" | "sourceBucket" | "sourceKey" | "createdAt" | "updatedAt", ExtArgs["result"]["ingestDocument"]>
  export type IngestDocumentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    chunks?: boolean | IngestDocument$chunksArgs<ExtArgs>
    _count?: boolean | IngestDocumentCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type IngestDocumentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type IngestDocumentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $IngestDocumentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "IngestDocument"
    objects: {
      chunks: Prisma.$IngestDocumentChunkPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      documentId: string
      tenantId: string | null
      requestedBy: string | null
      title: string
      contentType: string | null
      visibility: string | null
      retentionPolicy: string | null
      metadata: Prisma.JsonValue | null
      sourceUri: string | null
      sourceBucket: string | null
      sourceKey: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["ingestDocument"]>
    composites: {}
  }

  type IngestDocumentGetPayload<S extends boolean | null | undefined | IngestDocumentDefaultArgs> = $Result.GetResult<Prisma.$IngestDocumentPayload, S>

  type IngestDocumentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<IngestDocumentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: IngestDocumentCountAggregateInputType | true
    }

  export interface IngestDocumentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['IngestDocument'], meta: { name: 'IngestDocument' } }
    /**
     * Find zero or one IngestDocument that matches the filter.
     * @param {IngestDocumentFindUniqueArgs} args - Arguments to find a IngestDocument
     * @example
     * // Get one IngestDocument
     * const ingestDocument = await prisma.ingestDocument.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends IngestDocumentFindUniqueArgs>(args: SelectSubset<T, IngestDocumentFindUniqueArgs<ExtArgs>>): Prisma__IngestDocumentClient<$Result.GetResult<Prisma.$IngestDocumentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one IngestDocument that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {IngestDocumentFindUniqueOrThrowArgs} args - Arguments to find a IngestDocument
     * @example
     * // Get one IngestDocument
     * const ingestDocument = await prisma.ingestDocument.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends IngestDocumentFindUniqueOrThrowArgs>(args: SelectSubset<T, IngestDocumentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__IngestDocumentClient<$Result.GetResult<Prisma.$IngestDocumentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first IngestDocument that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IngestDocumentFindFirstArgs} args - Arguments to find a IngestDocument
     * @example
     * // Get one IngestDocument
     * const ingestDocument = await prisma.ingestDocument.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends IngestDocumentFindFirstArgs>(args?: SelectSubset<T, IngestDocumentFindFirstArgs<ExtArgs>>): Prisma__IngestDocumentClient<$Result.GetResult<Prisma.$IngestDocumentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first IngestDocument that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IngestDocumentFindFirstOrThrowArgs} args - Arguments to find a IngestDocument
     * @example
     * // Get one IngestDocument
     * const ingestDocument = await prisma.ingestDocument.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends IngestDocumentFindFirstOrThrowArgs>(args?: SelectSubset<T, IngestDocumentFindFirstOrThrowArgs<ExtArgs>>): Prisma__IngestDocumentClient<$Result.GetResult<Prisma.$IngestDocumentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more IngestDocuments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IngestDocumentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all IngestDocuments
     * const ingestDocuments = await prisma.ingestDocument.findMany()
     * 
     * // Get first 10 IngestDocuments
     * const ingestDocuments = await prisma.ingestDocument.findMany({ take: 10 })
     * 
     * // Only select the `documentId`
     * const ingestDocumentWithDocumentIdOnly = await prisma.ingestDocument.findMany({ select: { documentId: true } })
     * 
     */
    findMany<T extends IngestDocumentFindManyArgs>(args?: SelectSubset<T, IngestDocumentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IngestDocumentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a IngestDocument.
     * @param {IngestDocumentCreateArgs} args - Arguments to create a IngestDocument.
     * @example
     * // Create one IngestDocument
     * const IngestDocument = await prisma.ingestDocument.create({
     *   data: {
     *     // ... data to create a IngestDocument
     *   }
     * })
     * 
     */
    create<T extends IngestDocumentCreateArgs>(args: SelectSubset<T, IngestDocumentCreateArgs<ExtArgs>>): Prisma__IngestDocumentClient<$Result.GetResult<Prisma.$IngestDocumentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many IngestDocuments.
     * @param {IngestDocumentCreateManyArgs} args - Arguments to create many IngestDocuments.
     * @example
     * // Create many IngestDocuments
     * const ingestDocument = await prisma.ingestDocument.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends IngestDocumentCreateManyArgs>(args?: SelectSubset<T, IngestDocumentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many IngestDocuments and returns the data saved in the database.
     * @param {IngestDocumentCreateManyAndReturnArgs} args - Arguments to create many IngestDocuments.
     * @example
     * // Create many IngestDocuments
     * const ingestDocument = await prisma.ingestDocument.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many IngestDocuments and only return the `documentId`
     * const ingestDocumentWithDocumentIdOnly = await prisma.ingestDocument.createManyAndReturn({
     *   select: { documentId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends IngestDocumentCreateManyAndReturnArgs>(args?: SelectSubset<T, IngestDocumentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IngestDocumentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a IngestDocument.
     * @param {IngestDocumentDeleteArgs} args - Arguments to delete one IngestDocument.
     * @example
     * // Delete one IngestDocument
     * const IngestDocument = await prisma.ingestDocument.delete({
     *   where: {
     *     // ... filter to delete one IngestDocument
     *   }
     * })
     * 
     */
    delete<T extends IngestDocumentDeleteArgs>(args: SelectSubset<T, IngestDocumentDeleteArgs<ExtArgs>>): Prisma__IngestDocumentClient<$Result.GetResult<Prisma.$IngestDocumentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one IngestDocument.
     * @param {IngestDocumentUpdateArgs} args - Arguments to update one IngestDocument.
     * @example
     * // Update one IngestDocument
     * const ingestDocument = await prisma.ingestDocument.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends IngestDocumentUpdateArgs>(args: SelectSubset<T, IngestDocumentUpdateArgs<ExtArgs>>): Prisma__IngestDocumentClient<$Result.GetResult<Prisma.$IngestDocumentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more IngestDocuments.
     * @param {IngestDocumentDeleteManyArgs} args - Arguments to filter IngestDocuments to delete.
     * @example
     * // Delete a few IngestDocuments
     * const { count } = await prisma.ingestDocument.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends IngestDocumentDeleteManyArgs>(args?: SelectSubset<T, IngestDocumentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more IngestDocuments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IngestDocumentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many IngestDocuments
     * const ingestDocument = await prisma.ingestDocument.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends IngestDocumentUpdateManyArgs>(args: SelectSubset<T, IngestDocumentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more IngestDocuments and returns the data updated in the database.
     * @param {IngestDocumentUpdateManyAndReturnArgs} args - Arguments to update many IngestDocuments.
     * @example
     * // Update many IngestDocuments
     * const ingestDocument = await prisma.ingestDocument.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more IngestDocuments and only return the `documentId`
     * const ingestDocumentWithDocumentIdOnly = await prisma.ingestDocument.updateManyAndReturn({
     *   select: { documentId: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends IngestDocumentUpdateManyAndReturnArgs>(args: SelectSubset<T, IngestDocumentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IngestDocumentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one IngestDocument.
     * @param {IngestDocumentUpsertArgs} args - Arguments to update or create a IngestDocument.
     * @example
     * // Update or create a IngestDocument
     * const ingestDocument = await prisma.ingestDocument.upsert({
     *   create: {
     *     // ... data to create a IngestDocument
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the IngestDocument we want to update
     *   }
     * })
     */
    upsert<T extends IngestDocumentUpsertArgs>(args: SelectSubset<T, IngestDocumentUpsertArgs<ExtArgs>>): Prisma__IngestDocumentClient<$Result.GetResult<Prisma.$IngestDocumentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of IngestDocuments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IngestDocumentCountArgs} args - Arguments to filter IngestDocuments to count.
     * @example
     * // Count the number of IngestDocuments
     * const count = await prisma.ingestDocument.count({
     *   where: {
     *     // ... the filter for the IngestDocuments we want to count
     *   }
     * })
    **/
    count<T extends IngestDocumentCountArgs>(
      args?: Subset<T, IngestDocumentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], IngestDocumentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a IngestDocument.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IngestDocumentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends IngestDocumentAggregateArgs>(args: Subset<T, IngestDocumentAggregateArgs>): Prisma.PrismaPromise<GetIngestDocumentAggregateType<T>>

    /**
     * Group by IngestDocument.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IngestDocumentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends IngestDocumentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: IngestDocumentGroupByArgs['orderBy'] }
        : { orderBy?: IngestDocumentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, IngestDocumentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetIngestDocumentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the IngestDocument model
   */
  readonly fields: IngestDocumentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for IngestDocument.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__IngestDocumentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    chunks<T extends IngestDocument$chunksArgs<ExtArgs> = {}>(args?: Subset<T, IngestDocument$chunksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IngestDocumentChunkPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the IngestDocument model
   */
  interface IngestDocumentFieldRefs {
    readonly documentId: FieldRef<"IngestDocument", 'String'>
    readonly tenantId: FieldRef<"IngestDocument", 'String'>
    readonly requestedBy: FieldRef<"IngestDocument", 'String'>
    readonly title: FieldRef<"IngestDocument", 'String'>
    readonly contentType: FieldRef<"IngestDocument", 'String'>
    readonly visibility: FieldRef<"IngestDocument", 'String'>
    readonly retentionPolicy: FieldRef<"IngestDocument", 'String'>
    readonly metadata: FieldRef<"IngestDocument", 'Json'>
    readonly sourceUri: FieldRef<"IngestDocument", 'String'>
    readonly sourceBucket: FieldRef<"IngestDocument", 'String'>
    readonly sourceKey: FieldRef<"IngestDocument", 'String'>
    readonly createdAt: FieldRef<"IngestDocument", 'DateTime'>
    readonly updatedAt: FieldRef<"IngestDocument", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * IngestDocument findUnique
   */
  export type IngestDocumentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IngestDocument
     */
    select?: IngestDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IngestDocument
     */
    omit?: IngestDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IngestDocumentInclude<ExtArgs> | null
    /**
     * Filter, which IngestDocument to fetch.
     */
    where: IngestDocumentWhereUniqueInput
  }

  /**
   * IngestDocument findUniqueOrThrow
   */
  export type IngestDocumentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IngestDocument
     */
    select?: IngestDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IngestDocument
     */
    omit?: IngestDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IngestDocumentInclude<ExtArgs> | null
    /**
     * Filter, which IngestDocument to fetch.
     */
    where: IngestDocumentWhereUniqueInput
  }

  /**
   * IngestDocument findFirst
   */
  export type IngestDocumentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IngestDocument
     */
    select?: IngestDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IngestDocument
     */
    omit?: IngestDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IngestDocumentInclude<ExtArgs> | null
    /**
     * Filter, which IngestDocument to fetch.
     */
    where?: IngestDocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IngestDocuments to fetch.
     */
    orderBy?: IngestDocumentOrderByWithRelationInput | IngestDocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for IngestDocuments.
     */
    cursor?: IngestDocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IngestDocuments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IngestDocuments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of IngestDocuments.
     */
    distinct?: IngestDocumentScalarFieldEnum | IngestDocumentScalarFieldEnum[]
  }

  /**
   * IngestDocument findFirstOrThrow
   */
  export type IngestDocumentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IngestDocument
     */
    select?: IngestDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IngestDocument
     */
    omit?: IngestDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IngestDocumentInclude<ExtArgs> | null
    /**
     * Filter, which IngestDocument to fetch.
     */
    where?: IngestDocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IngestDocuments to fetch.
     */
    orderBy?: IngestDocumentOrderByWithRelationInput | IngestDocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for IngestDocuments.
     */
    cursor?: IngestDocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IngestDocuments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IngestDocuments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of IngestDocuments.
     */
    distinct?: IngestDocumentScalarFieldEnum | IngestDocumentScalarFieldEnum[]
  }

  /**
   * IngestDocument findMany
   */
  export type IngestDocumentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IngestDocument
     */
    select?: IngestDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IngestDocument
     */
    omit?: IngestDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IngestDocumentInclude<ExtArgs> | null
    /**
     * Filter, which IngestDocuments to fetch.
     */
    where?: IngestDocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IngestDocuments to fetch.
     */
    orderBy?: IngestDocumentOrderByWithRelationInput | IngestDocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing IngestDocuments.
     */
    cursor?: IngestDocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IngestDocuments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IngestDocuments.
     */
    skip?: number
    distinct?: IngestDocumentScalarFieldEnum | IngestDocumentScalarFieldEnum[]
  }

  /**
   * IngestDocument create
   */
  export type IngestDocumentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IngestDocument
     */
    select?: IngestDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IngestDocument
     */
    omit?: IngestDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IngestDocumentInclude<ExtArgs> | null
    /**
     * The data needed to create a IngestDocument.
     */
    data: XOR<IngestDocumentCreateInput, IngestDocumentUncheckedCreateInput>
  }

  /**
   * IngestDocument createMany
   */
  export type IngestDocumentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many IngestDocuments.
     */
    data: IngestDocumentCreateManyInput | IngestDocumentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * IngestDocument createManyAndReturn
   */
  export type IngestDocumentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IngestDocument
     */
    select?: IngestDocumentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the IngestDocument
     */
    omit?: IngestDocumentOmit<ExtArgs> | null
    /**
     * The data used to create many IngestDocuments.
     */
    data: IngestDocumentCreateManyInput | IngestDocumentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * IngestDocument update
   */
  export type IngestDocumentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IngestDocument
     */
    select?: IngestDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IngestDocument
     */
    omit?: IngestDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IngestDocumentInclude<ExtArgs> | null
    /**
     * The data needed to update a IngestDocument.
     */
    data: XOR<IngestDocumentUpdateInput, IngestDocumentUncheckedUpdateInput>
    /**
     * Choose, which IngestDocument to update.
     */
    where: IngestDocumentWhereUniqueInput
  }

  /**
   * IngestDocument updateMany
   */
  export type IngestDocumentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update IngestDocuments.
     */
    data: XOR<IngestDocumentUpdateManyMutationInput, IngestDocumentUncheckedUpdateManyInput>
    /**
     * Filter which IngestDocuments to update
     */
    where?: IngestDocumentWhereInput
    /**
     * Limit how many IngestDocuments to update.
     */
    limit?: number
  }

  /**
   * IngestDocument updateManyAndReturn
   */
  export type IngestDocumentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IngestDocument
     */
    select?: IngestDocumentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the IngestDocument
     */
    omit?: IngestDocumentOmit<ExtArgs> | null
    /**
     * The data used to update IngestDocuments.
     */
    data: XOR<IngestDocumentUpdateManyMutationInput, IngestDocumentUncheckedUpdateManyInput>
    /**
     * Filter which IngestDocuments to update
     */
    where?: IngestDocumentWhereInput
    /**
     * Limit how many IngestDocuments to update.
     */
    limit?: number
  }

  /**
   * IngestDocument upsert
   */
  export type IngestDocumentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IngestDocument
     */
    select?: IngestDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IngestDocument
     */
    omit?: IngestDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IngestDocumentInclude<ExtArgs> | null
    /**
     * The filter to search for the IngestDocument to update in case it exists.
     */
    where: IngestDocumentWhereUniqueInput
    /**
     * In case the IngestDocument found by the `where` argument doesn't exist, create a new IngestDocument with this data.
     */
    create: XOR<IngestDocumentCreateInput, IngestDocumentUncheckedCreateInput>
    /**
     * In case the IngestDocument was found with the provided `where` argument, update it with this data.
     */
    update: XOR<IngestDocumentUpdateInput, IngestDocumentUncheckedUpdateInput>
  }

  /**
   * IngestDocument delete
   */
  export type IngestDocumentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IngestDocument
     */
    select?: IngestDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IngestDocument
     */
    omit?: IngestDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IngestDocumentInclude<ExtArgs> | null
    /**
     * Filter which IngestDocument to delete.
     */
    where: IngestDocumentWhereUniqueInput
  }

  /**
   * IngestDocument deleteMany
   */
  export type IngestDocumentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which IngestDocuments to delete
     */
    where?: IngestDocumentWhereInput
    /**
     * Limit how many IngestDocuments to delete.
     */
    limit?: number
  }

  /**
   * IngestDocument.chunks
   */
  export type IngestDocument$chunksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IngestDocumentChunk
     */
    select?: IngestDocumentChunkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IngestDocumentChunk
     */
    omit?: IngestDocumentChunkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IngestDocumentChunkInclude<ExtArgs> | null
    where?: IngestDocumentChunkWhereInput
    orderBy?: IngestDocumentChunkOrderByWithRelationInput | IngestDocumentChunkOrderByWithRelationInput[]
    cursor?: IngestDocumentChunkWhereUniqueInput
    take?: number
    skip?: number
    distinct?: IngestDocumentChunkScalarFieldEnum | IngestDocumentChunkScalarFieldEnum[]
  }

  /**
   * IngestDocument without action
   */
  export type IngestDocumentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IngestDocument
     */
    select?: IngestDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IngestDocument
     */
    omit?: IngestDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IngestDocumentInclude<ExtArgs> | null
  }


  /**
   * Model IngestDocumentChunk
   */

  export type AggregateIngestDocumentChunk = {
    _count: IngestDocumentChunkCountAggregateOutputType | null
    _avg: IngestDocumentChunkAvgAggregateOutputType | null
    _sum: IngestDocumentChunkSumAggregateOutputType | null
    _min: IngestDocumentChunkMinAggregateOutputType | null
    _max: IngestDocumentChunkMaxAggregateOutputType | null
  }

  export type IngestDocumentChunkAvgAggregateOutputType = {
    chunkIndex: number | null
    tokenCount: number | null
  }

  export type IngestDocumentChunkSumAggregateOutputType = {
    chunkIndex: number | null
    tokenCount: number | null
  }

  export type IngestDocumentChunkMinAggregateOutputType = {
    documentId: string | null
    chunkId: string | null
    chunkIndex: number | null
    content: string | null
    preview: string | null
    tokenCount: number | null
    createdAt: Date | null
  }

  export type IngestDocumentChunkMaxAggregateOutputType = {
    documentId: string | null
    chunkId: string | null
    chunkIndex: number | null
    content: string | null
    preview: string | null
    tokenCount: number | null
    createdAt: Date | null
  }

  export type IngestDocumentChunkCountAggregateOutputType = {
    documentId: number
    chunkId: number
    chunkIndex: number
    content: number
    preview: number
    tokenCount: number
    embedding: number
    createdAt: number
    _all: number
  }


  export type IngestDocumentChunkAvgAggregateInputType = {
    chunkIndex?: true
    tokenCount?: true
  }

  export type IngestDocumentChunkSumAggregateInputType = {
    chunkIndex?: true
    tokenCount?: true
  }

  export type IngestDocumentChunkMinAggregateInputType = {
    documentId?: true
    chunkId?: true
    chunkIndex?: true
    content?: true
    preview?: true
    tokenCount?: true
    createdAt?: true
  }

  export type IngestDocumentChunkMaxAggregateInputType = {
    documentId?: true
    chunkId?: true
    chunkIndex?: true
    content?: true
    preview?: true
    tokenCount?: true
    createdAt?: true
  }

  export type IngestDocumentChunkCountAggregateInputType = {
    documentId?: true
    chunkId?: true
    chunkIndex?: true
    content?: true
    preview?: true
    tokenCount?: true
    embedding?: true
    createdAt?: true
    _all?: true
  }

  export type IngestDocumentChunkAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which IngestDocumentChunk to aggregate.
     */
    where?: IngestDocumentChunkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IngestDocumentChunks to fetch.
     */
    orderBy?: IngestDocumentChunkOrderByWithRelationInput | IngestDocumentChunkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: IngestDocumentChunkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IngestDocumentChunks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IngestDocumentChunks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned IngestDocumentChunks
    **/
    _count?: true | IngestDocumentChunkCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: IngestDocumentChunkAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: IngestDocumentChunkSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: IngestDocumentChunkMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: IngestDocumentChunkMaxAggregateInputType
  }

  export type GetIngestDocumentChunkAggregateType<T extends IngestDocumentChunkAggregateArgs> = {
        [P in keyof T & keyof AggregateIngestDocumentChunk]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateIngestDocumentChunk[P]>
      : GetScalarType<T[P], AggregateIngestDocumentChunk[P]>
  }




  export type IngestDocumentChunkGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: IngestDocumentChunkWhereInput
    orderBy?: IngestDocumentChunkOrderByWithAggregationInput | IngestDocumentChunkOrderByWithAggregationInput[]
    by: IngestDocumentChunkScalarFieldEnum[] | IngestDocumentChunkScalarFieldEnum
    having?: IngestDocumentChunkScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: IngestDocumentChunkCountAggregateInputType | true
    _avg?: IngestDocumentChunkAvgAggregateInputType
    _sum?: IngestDocumentChunkSumAggregateInputType
    _min?: IngestDocumentChunkMinAggregateInputType
    _max?: IngestDocumentChunkMaxAggregateInputType
  }

  export type IngestDocumentChunkGroupByOutputType = {
    documentId: string
    chunkId: string
    chunkIndex: number
    content: string
    preview: string | null
    tokenCount: number | null
    embedding: JsonValue | null
    createdAt: Date
    _count: IngestDocumentChunkCountAggregateOutputType | null
    _avg: IngestDocumentChunkAvgAggregateOutputType | null
    _sum: IngestDocumentChunkSumAggregateOutputType | null
    _min: IngestDocumentChunkMinAggregateOutputType | null
    _max: IngestDocumentChunkMaxAggregateOutputType | null
  }

  type GetIngestDocumentChunkGroupByPayload<T extends IngestDocumentChunkGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<IngestDocumentChunkGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof IngestDocumentChunkGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], IngestDocumentChunkGroupByOutputType[P]>
            : GetScalarType<T[P], IngestDocumentChunkGroupByOutputType[P]>
        }
      >
    >


  export type IngestDocumentChunkSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    documentId?: boolean
    chunkId?: boolean
    chunkIndex?: boolean
    content?: boolean
    preview?: boolean
    tokenCount?: boolean
    embedding?: boolean
    createdAt?: boolean
    document?: boolean | IngestDocumentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["ingestDocumentChunk"]>

  export type IngestDocumentChunkSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    documentId?: boolean
    chunkId?: boolean
    chunkIndex?: boolean
    content?: boolean
    preview?: boolean
    tokenCount?: boolean
    embedding?: boolean
    createdAt?: boolean
    document?: boolean | IngestDocumentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["ingestDocumentChunk"]>

  export type IngestDocumentChunkSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    documentId?: boolean
    chunkId?: boolean
    chunkIndex?: boolean
    content?: boolean
    preview?: boolean
    tokenCount?: boolean
    embedding?: boolean
    createdAt?: boolean
    document?: boolean | IngestDocumentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["ingestDocumentChunk"]>

  export type IngestDocumentChunkSelectScalar = {
    documentId?: boolean
    chunkId?: boolean
    chunkIndex?: boolean
    content?: boolean
    preview?: boolean
    tokenCount?: boolean
    embedding?: boolean
    createdAt?: boolean
  }

  export type IngestDocumentChunkOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"documentId" | "chunkId" | "chunkIndex" | "content" | "preview" | "tokenCount" | "embedding" | "createdAt", ExtArgs["result"]["ingestDocumentChunk"]>
  export type IngestDocumentChunkInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    document?: boolean | IngestDocumentDefaultArgs<ExtArgs>
  }
  export type IngestDocumentChunkIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    document?: boolean | IngestDocumentDefaultArgs<ExtArgs>
  }
  export type IngestDocumentChunkIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    document?: boolean | IngestDocumentDefaultArgs<ExtArgs>
  }

  export type $IngestDocumentChunkPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "IngestDocumentChunk"
    objects: {
      document: Prisma.$IngestDocumentPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      documentId: string
      chunkId: string
      chunkIndex: number
      content: string
      preview: string | null
      tokenCount: number | null
      embedding: Prisma.JsonValue | null
      createdAt: Date
    }, ExtArgs["result"]["ingestDocumentChunk"]>
    composites: {}
  }

  type IngestDocumentChunkGetPayload<S extends boolean | null | undefined | IngestDocumentChunkDefaultArgs> = $Result.GetResult<Prisma.$IngestDocumentChunkPayload, S>

  type IngestDocumentChunkCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<IngestDocumentChunkFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: IngestDocumentChunkCountAggregateInputType | true
    }

  export interface IngestDocumentChunkDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['IngestDocumentChunk'], meta: { name: 'IngestDocumentChunk' } }
    /**
     * Find zero or one IngestDocumentChunk that matches the filter.
     * @param {IngestDocumentChunkFindUniqueArgs} args - Arguments to find a IngestDocumentChunk
     * @example
     * // Get one IngestDocumentChunk
     * const ingestDocumentChunk = await prisma.ingestDocumentChunk.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends IngestDocumentChunkFindUniqueArgs>(args: SelectSubset<T, IngestDocumentChunkFindUniqueArgs<ExtArgs>>): Prisma__IngestDocumentChunkClient<$Result.GetResult<Prisma.$IngestDocumentChunkPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one IngestDocumentChunk that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {IngestDocumentChunkFindUniqueOrThrowArgs} args - Arguments to find a IngestDocumentChunk
     * @example
     * // Get one IngestDocumentChunk
     * const ingestDocumentChunk = await prisma.ingestDocumentChunk.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends IngestDocumentChunkFindUniqueOrThrowArgs>(args: SelectSubset<T, IngestDocumentChunkFindUniqueOrThrowArgs<ExtArgs>>): Prisma__IngestDocumentChunkClient<$Result.GetResult<Prisma.$IngestDocumentChunkPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first IngestDocumentChunk that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IngestDocumentChunkFindFirstArgs} args - Arguments to find a IngestDocumentChunk
     * @example
     * // Get one IngestDocumentChunk
     * const ingestDocumentChunk = await prisma.ingestDocumentChunk.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends IngestDocumentChunkFindFirstArgs>(args?: SelectSubset<T, IngestDocumentChunkFindFirstArgs<ExtArgs>>): Prisma__IngestDocumentChunkClient<$Result.GetResult<Prisma.$IngestDocumentChunkPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first IngestDocumentChunk that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IngestDocumentChunkFindFirstOrThrowArgs} args - Arguments to find a IngestDocumentChunk
     * @example
     * // Get one IngestDocumentChunk
     * const ingestDocumentChunk = await prisma.ingestDocumentChunk.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends IngestDocumentChunkFindFirstOrThrowArgs>(args?: SelectSubset<T, IngestDocumentChunkFindFirstOrThrowArgs<ExtArgs>>): Prisma__IngestDocumentChunkClient<$Result.GetResult<Prisma.$IngestDocumentChunkPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more IngestDocumentChunks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IngestDocumentChunkFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all IngestDocumentChunks
     * const ingestDocumentChunks = await prisma.ingestDocumentChunk.findMany()
     * 
     * // Get first 10 IngestDocumentChunks
     * const ingestDocumentChunks = await prisma.ingestDocumentChunk.findMany({ take: 10 })
     * 
     * // Only select the `documentId`
     * const ingestDocumentChunkWithDocumentIdOnly = await prisma.ingestDocumentChunk.findMany({ select: { documentId: true } })
     * 
     */
    findMany<T extends IngestDocumentChunkFindManyArgs>(args?: SelectSubset<T, IngestDocumentChunkFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IngestDocumentChunkPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a IngestDocumentChunk.
     * @param {IngestDocumentChunkCreateArgs} args - Arguments to create a IngestDocumentChunk.
     * @example
     * // Create one IngestDocumentChunk
     * const IngestDocumentChunk = await prisma.ingestDocumentChunk.create({
     *   data: {
     *     // ... data to create a IngestDocumentChunk
     *   }
     * })
     * 
     */
    create<T extends IngestDocumentChunkCreateArgs>(args: SelectSubset<T, IngestDocumentChunkCreateArgs<ExtArgs>>): Prisma__IngestDocumentChunkClient<$Result.GetResult<Prisma.$IngestDocumentChunkPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many IngestDocumentChunks.
     * @param {IngestDocumentChunkCreateManyArgs} args - Arguments to create many IngestDocumentChunks.
     * @example
     * // Create many IngestDocumentChunks
     * const ingestDocumentChunk = await prisma.ingestDocumentChunk.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends IngestDocumentChunkCreateManyArgs>(args?: SelectSubset<T, IngestDocumentChunkCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many IngestDocumentChunks and returns the data saved in the database.
     * @param {IngestDocumentChunkCreateManyAndReturnArgs} args - Arguments to create many IngestDocumentChunks.
     * @example
     * // Create many IngestDocumentChunks
     * const ingestDocumentChunk = await prisma.ingestDocumentChunk.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many IngestDocumentChunks and only return the `documentId`
     * const ingestDocumentChunkWithDocumentIdOnly = await prisma.ingestDocumentChunk.createManyAndReturn({
     *   select: { documentId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends IngestDocumentChunkCreateManyAndReturnArgs>(args?: SelectSubset<T, IngestDocumentChunkCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IngestDocumentChunkPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a IngestDocumentChunk.
     * @param {IngestDocumentChunkDeleteArgs} args - Arguments to delete one IngestDocumentChunk.
     * @example
     * // Delete one IngestDocumentChunk
     * const IngestDocumentChunk = await prisma.ingestDocumentChunk.delete({
     *   where: {
     *     // ... filter to delete one IngestDocumentChunk
     *   }
     * })
     * 
     */
    delete<T extends IngestDocumentChunkDeleteArgs>(args: SelectSubset<T, IngestDocumentChunkDeleteArgs<ExtArgs>>): Prisma__IngestDocumentChunkClient<$Result.GetResult<Prisma.$IngestDocumentChunkPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one IngestDocumentChunk.
     * @param {IngestDocumentChunkUpdateArgs} args - Arguments to update one IngestDocumentChunk.
     * @example
     * // Update one IngestDocumentChunk
     * const ingestDocumentChunk = await prisma.ingestDocumentChunk.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends IngestDocumentChunkUpdateArgs>(args: SelectSubset<T, IngestDocumentChunkUpdateArgs<ExtArgs>>): Prisma__IngestDocumentChunkClient<$Result.GetResult<Prisma.$IngestDocumentChunkPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more IngestDocumentChunks.
     * @param {IngestDocumentChunkDeleteManyArgs} args - Arguments to filter IngestDocumentChunks to delete.
     * @example
     * // Delete a few IngestDocumentChunks
     * const { count } = await prisma.ingestDocumentChunk.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends IngestDocumentChunkDeleteManyArgs>(args?: SelectSubset<T, IngestDocumentChunkDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more IngestDocumentChunks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IngestDocumentChunkUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many IngestDocumentChunks
     * const ingestDocumentChunk = await prisma.ingestDocumentChunk.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends IngestDocumentChunkUpdateManyArgs>(args: SelectSubset<T, IngestDocumentChunkUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more IngestDocumentChunks and returns the data updated in the database.
     * @param {IngestDocumentChunkUpdateManyAndReturnArgs} args - Arguments to update many IngestDocumentChunks.
     * @example
     * // Update many IngestDocumentChunks
     * const ingestDocumentChunk = await prisma.ingestDocumentChunk.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more IngestDocumentChunks and only return the `documentId`
     * const ingestDocumentChunkWithDocumentIdOnly = await prisma.ingestDocumentChunk.updateManyAndReturn({
     *   select: { documentId: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends IngestDocumentChunkUpdateManyAndReturnArgs>(args: SelectSubset<T, IngestDocumentChunkUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IngestDocumentChunkPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one IngestDocumentChunk.
     * @param {IngestDocumentChunkUpsertArgs} args - Arguments to update or create a IngestDocumentChunk.
     * @example
     * // Update or create a IngestDocumentChunk
     * const ingestDocumentChunk = await prisma.ingestDocumentChunk.upsert({
     *   create: {
     *     // ... data to create a IngestDocumentChunk
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the IngestDocumentChunk we want to update
     *   }
     * })
     */
    upsert<T extends IngestDocumentChunkUpsertArgs>(args: SelectSubset<T, IngestDocumentChunkUpsertArgs<ExtArgs>>): Prisma__IngestDocumentChunkClient<$Result.GetResult<Prisma.$IngestDocumentChunkPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of IngestDocumentChunks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IngestDocumentChunkCountArgs} args - Arguments to filter IngestDocumentChunks to count.
     * @example
     * // Count the number of IngestDocumentChunks
     * const count = await prisma.ingestDocumentChunk.count({
     *   where: {
     *     // ... the filter for the IngestDocumentChunks we want to count
     *   }
     * })
    **/
    count<T extends IngestDocumentChunkCountArgs>(
      args?: Subset<T, IngestDocumentChunkCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], IngestDocumentChunkCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a IngestDocumentChunk.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IngestDocumentChunkAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends IngestDocumentChunkAggregateArgs>(args: Subset<T, IngestDocumentChunkAggregateArgs>): Prisma.PrismaPromise<GetIngestDocumentChunkAggregateType<T>>

    /**
     * Group by IngestDocumentChunk.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IngestDocumentChunkGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends IngestDocumentChunkGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: IngestDocumentChunkGroupByArgs['orderBy'] }
        : { orderBy?: IngestDocumentChunkGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, IngestDocumentChunkGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetIngestDocumentChunkGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the IngestDocumentChunk model
   */
  readonly fields: IngestDocumentChunkFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for IngestDocumentChunk.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__IngestDocumentChunkClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    document<T extends IngestDocumentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, IngestDocumentDefaultArgs<ExtArgs>>): Prisma__IngestDocumentClient<$Result.GetResult<Prisma.$IngestDocumentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the IngestDocumentChunk model
   */
  interface IngestDocumentChunkFieldRefs {
    readonly documentId: FieldRef<"IngestDocumentChunk", 'String'>
    readonly chunkId: FieldRef<"IngestDocumentChunk", 'String'>
    readonly chunkIndex: FieldRef<"IngestDocumentChunk", 'Int'>
    readonly content: FieldRef<"IngestDocumentChunk", 'String'>
    readonly preview: FieldRef<"IngestDocumentChunk", 'String'>
    readonly tokenCount: FieldRef<"IngestDocumentChunk", 'Int'>
    readonly embedding: FieldRef<"IngestDocumentChunk", 'Json'>
    readonly createdAt: FieldRef<"IngestDocumentChunk", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * IngestDocumentChunk findUnique
   */
  export type IngestDocumentChunkFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IngestDocumentChunk
     */
    select?: IngestDocumentChunkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IngestDocumentChunk
     */
    omit?: IngestDocumentChunkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IngestDocumentChunkInclude<ExtArgs> | null
    /**
     * Filter, which IngestDocumentChunk to fetch.
     */
    where: IngestDocumentChunkWhereUniqueInput
  }

  /**
   * IngestDocumentChunk findUniqueOrThrow
   */
  export type IngestDocumentChunkFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IngestDocumentChunk
     */
    select?: IngestDocumentChunkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IngestDocumentChunk
     */
    omit?: IngestDocumentChunkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IngestDocumentChunkInclude<ExtArgs> | null
    /**
     * Filter, which IngestDocumentChunk to fetch.
     */
    where: IngestDocumentChunkWhereUniqueInput
  }

  /**
   * IngestDocumentChunk findFirst
   */
  export type IngestDocumentChunkFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IngestDocumentChunk
     */
    select?: IngestDocumentChunkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IngestDocumentChunk
     */
    omit?: IngestDocumentChunkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IngestDocumentChunkInclude<ExtArgs> | null
    /**
     * Filter, which IngestDocumentChunk to fetch.
     */
    where?: IngestDocumentChunkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IngestDocumentChunks to fetch.
     */
    orderBy?: IngestDocumentChunkOrderByWithRelationInput | IngestDocumentChunkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for IngestDocumentChunks.
     */
    cursor?: IngestDocumentChunkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IngestDocumentChunks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IngestDocumentChunks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of IngestDocumentChunks.
     */
    distinct?: IngestDocumentChunkScalarFieldEnum | IngestDocumentChunkScalarFieldEnum[]
  }

  /**
   * IngestDocumentChunk findFirstOrThrow
   */
  export type IngestDocumentChunkFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IngestDocumentChunk
     */
    select?: IngestDocumentChunkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IngestDocumentChunk
     */
    omit?: IngestDocumentChunkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IngestDocumentChunkInclude<ExtArgs> | null
    /**
     * Filter, which IngestDocumentChunk to fetch.
     */
    where?: IngestDocumentChunkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IngestDocumentChunks to fetch.
     */
    orderBy?: IngestDocumentChunkOrderByWithRelationInput | IngestDocumentChunkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for IngestDocumentChunks.
     */
    cursor?: IngestDocumentChunkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IngestDocumentChunks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IngestDocumentChunks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of IngestDocumentChunks.
     */
    distinct?: IngestDocumentChunkScalarFieldEnum | IngestDocumentChunkScalarFieldEnum[]
  }

  /**
   * IngestDocumentChunk findMany
   */
  export type IngestDocumentChunkFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IngestDocumentChunk
     */
    select?: IngestDocumentChunkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IngestDocumentChunk
     */
    omit?: IngestDocumentChunkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IngestDocumentChunkInclude<ExtArgs> | null
    /**
     * Filter, which IngestDocumentChunks to fetch.
     */
    where?: IngestDocumentChunkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IngestDocumentChunks to fetch.
     */
    orderBy?: IngestDocumentChunkOrderByWithRelationInput | IngestDocumentChunkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing IngestDocumentChunks.
     */
    cursor?: IngestDocumentChunkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IngestDocumentChunks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IngestDocumentChunks.
     */
    skip?: number
    distinct?: IngestDocumentChunkScalarFieldEnum | IngestDocumentChunkScalarFieldEnum[]
  }

  /**
   * IngestDocumentChunk create
   */
  export type IngestDocumentChunkCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IngestDocumentChunk
     */
    select?: IngestDocumentChunkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IngestDocumentChunk
     */
    omit?: IngestDocumentChunkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IngestDocumentChunkInclude<ExtArgs> | null
    /**
     * The data needed to create a IngestDocumentChunk.
     */
    data: XOR<IngestDocumentChunkCreateInput, IngestDocumentChunkUncheckedCreateInput>
  }

  /**
   * IngestDocumentChunk createMany
   */
  export type IngestDocumentChunkCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many IngestDocumentChunks.
     */
    data: IngestDocumentChunkCreateManyInput | IngestDocumentChunkCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * IngestDocumentChunk createManyAndReturn
   */
  export type IngestDocumentChunkCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IngestDocumentChunk
     */
    select?: IngestDocumentChunkSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the IngestDocumentChunk
     */
    omit?: IngestDocumentChunkOmit<ExtArgs> | null
    /**
     * The data used to create many IngestDocumentChunks.
     */
    data: IngestDocumentChunkCreateManyInput | IngestDocumentChunkCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IngestDocumentChunkIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * IngestDocumentChunk update
   */
  export type IngestDocumentChunkUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IngestDocumentChunk
     */
    select?: IngestDocumentChunkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IngestDocumentChunk
     */
    omit?: IngestDocumentChunkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IngestDocumentChunkInclude<ExtArgs> | null
    /**
     * The data needed to update a IngestDocumentChunk.
     */
    data: XOR<IngestDocumentChunkUpdateInput, IngestDocumentChunkUncheckedUpdateInput>
    /**
     * Choose, which IngestDocumentChunk to update.
     */
    where: IngestDocumentChunkWhereUniqueInput
  }

  /**
   * IngestDocumentChunk updateMany
   */
  export type IngestDocumentChunkUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update IngestDocumentChunks.
     */
    data: XOR<IngestDocumentChunkUpdateManyMutationInput, IngestDocumentChunkUncheckedUpdateManyInput>
    /**
     * Filter which IngestDocumentChunks to update
     */
    where?: IngestDocumentChunkWhereInput
    /**
     * Limit how many IngestDocumentChunks to update.
     */
    limit?: number
  }

  /**
   * IngestDocumentChunk updateManyAndReturn
   */
  export type IngestDocumentChunkUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IngestDocumentChunk
     */
    select?: IngestDocumentChunkSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the IngestDocumentChunk
     */
    omit?: IngestDocumentChunkOmit<ExtArgs> | null
    /**
     * The data used to update IngestDocumentChunks.
     */
    data: XOR<IngestDocumentChunkUpdateManyMutationInput, IngestDocumentChunkUncheckedUpdateManyInput>
    /**
     * Filter which IngestDocumentChunks to update
     */
    where?: IngestDocumentChunkWhereInput
    /**
     * Limit how many IngestDocumentChunks to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IngestDocumentChunkIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * IngestDocumentChunk upsert
   */
  export type IngestDocumentChunkUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IngestDocumentChunk
     */
    select?: IngestDocumentChunkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IngestDocumentChunk
     */
    omit?: IngestDocumentChunkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IngestDocumentChunkInclude<ExtArgs> | null
    /**
     * The filter to search for the IngestDocumentChunk to update in case it exists.
     */
    where: IngestDocumentChunkWhereUniqueInput
    /**
     * In case the IngestDocumentChunk found by the `where` argument doesn't exist, create a new IngestDocumentChunk with this data.
     */
    create: XOR<IngestDocumentChunkCreateInput, IngestDocumentChunkUncheckedCreateInput>
    /**
     * In case the IngestDocumentChunk was found with the provided `where` argument, update it with this data.
     */
    update: XOR<IngestDocumentChunkUpdateInput, IngestDocumentChunkUncheckedUpdateInput>
  }

  /**
   * IngestDocumentChunk delete
   */
  export type IngestDocumentChunkDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IngestDocumentChunk
     */
    select?: IngestDocumentChunkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IngestDocumentChunk
     */
    omit?: IngestDocumentChunkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IngestDocumentChunkInclude<ExtArgs> | null
    /**
     * Filter which IngestDocumentChunk to delete.
     */
    where: IngestDocumentChunkWhereUniqueInput
  }

  /**
   * IngestDocumentChunk deleteMany
   */
  export type IngestDocumentChunkDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which IngestDocumentChunks to delete
     */
    where?: IngestDocumentChunkWhereInput
    /**
     * Limit how many IngestDocumentChunks to delete.
     */
    limit?: number
  }

  /**
   * IngestDocumentChunk without action
   */
  export type IngestDocumentChunkDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IngestDocumentChunk
     */
    select?: IngestDocumentChunkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IngestDocumentChunk
     */
    omit?: IngestDocumentChunkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IngestDocumentChunkInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const IngestDocumentScalarFieldEnum: {
    documentId: 'documentId',
    tenantId: 'tenantId',
    requestedBy: 'requestedBy',
    title: 'title',
    contentType: 'contentType',
    visibility: 'visibility',
    retentionPolicy: 'retentionPolicy',
    metadata: 'metadata',
    sourceUri: 'sourceUri',
    sourceBucket: 'sourceBucket',
    sourceKey: 'sourceKey',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type IngestDocumentScalarFieldEnum = (typeof IngestDocumentScalarFieldEnum)[keyof typeof IngestDocumentScalarFieldEnum]


  export const IngestDocumentChunkScalarFieldEnum: {
    documentId: 'documentId',
    chunkId: 'chunkId',
    chunkIndex: 'chunkIndex',
    content: 'content',
    preview: 'preview',
    tokenCount: 'tokenCount',
    embedding: 'embedding',
    createdAt: 'createdAt'
  };

  export type IngestDocumentChunkScalarFieldEnum = (typeof IngestDocumentChunkScalarFieldEnum)[keyof typeof IngestDocumentChunkScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type IngestDocumentWhereInput = {
    AND?: IngestDocumentWhereInput | IngestDocumentWhereInput[]
    OR?: IngestDocumentWhereInput[]
    NOT?: IngestDocumentWhereInput | IngestDocumentWhereInput[]
    documentId?: StringFilter<"IngestDocument"> | string
    tenantId?: StringNullableFilter<"IngestDocument"> | string | null
    requestedBy?: StringNullableFilter<"IngestDocument"> | string | null
    title?: StringFilter<"IngestDocument"> | string
    contentType?: StringNullableFilter<"IngestDocument"> | string | null
    visibility?: StringNullableFilter<"IngestDocument"> | string | null
    retentionPolicy?: StringNullableFilter<"IngestDocument"> | string | null
    metadata?: JsonNullableFilter<"IngestDocument">
    sourceUri?: StringNullableFilter<"IngestDocument"> | string | null
    sourceBucket?: StringNullableFilter<"IngestDocument"> | string | null
    sourceKey?: StringNullableFilter<"IngestDocument"> | string | null
    createdAt?: DateTimeFilter<"IngestDocument"> | Date | string
    updatedAt?: DateTimeFilter<"IngestDocument"> | Date | string
    chunks?: IngestDocumentChunkListRelationFilter
  }

  export type IngestDocumentOrderByWithRelationInput = {
    documentId?: SortOrder
    tenantId?: SortOrderInput | SortOrder
    requestedBy?: SortOrderInput | SortOrder
    title?: SortOrder
    contentType?: SortOrderInput | SortOrder
    visibility?: SortOrderInput | SortOrder
    retentionPolicy?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    sourceUri?: SortOrderInput | SortOrder
    sourceBucket?: SortOrderInput | SortOrder
    sourceKey?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    chunks?: IngestDocumentChunkOrderByRelationAggregateInput
  }

  export type IngestDocumentWhereUniqueInput = Prisma.AtLeast<{
    documentId?: string
    AND?: IngestDocumentWhereInput | IngestDocumentWhereInput[]
    OR?: IngestDocumentWhereInput[]
    NOT?: IngestDocumentWhereInput | IngestDocumentWhereInput[]
    tenantId?: StringNullableFilter<"IngestDocument"> | string | null
    requestedBy?: StringNullableFilter<"IngestDocument"> | string | null
    title?: StringFilter<"IngestDocument"> | string
    contentType?: StringNullableFilter<"IngestDocument"> | string | null
    visibility?: StringNullableFilter<"IngestDocument"> | string | null
    retentionPolicy?: StringNullableFilter<"IngestDocument"> | string | null
    metadata?: JsonNullableFilter<"IngestDocument">
    sourceUri?: StringNullableFilter<"IngestDocument"> | string | null
    sourceBucket?: StringNullableFilter<"IngestDocument"> | string | null
    sourceKey?: StringNullableFilter<"IngestDocument"> | string | null
    createdAt?: DateTimeFilter<"IngestDocument"> | Date | string
    updatedAt?: DateTimeFilter<"IngestDocument"> | Date | string
    chunks?: IngestDocumentChunkListRelationFilter
  }, "documentId">

  export type IngestDocumentOrderByWithAggregationInput = {
    documentId?: SortOrder
    tenantId?: SortOrderInput | SortOrder
    requestedBy?: SortOrderInput | SortOrder
    title?: SortOrder
    contentType?: SortOrderInput | SortOrder
    visibility?: SortOrderInput | SortOrder
    retentionPolicy?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    sourceUri?: SortOrderInput | SortOrder
    sourceBucket?: SortOrderInput | SortOrder
    sourceKey?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: IngestDocumentCountOrderByAggregateInput
    _max?: IngestDocumentMaxOrderByAggregateInput
    _min?: IngestDocumentMinOrderByAggregateInput
  }

  export type IngestDocumentScalarWhereWithAggregatesInput = {
    AND?: IngestDocumentScalarWhereWithAggregatesInput | IngestDocumentScalarWhereWithAggregatesInput[]
    OR?: IngestDocumentScalarWhereWithAggregatesInput[]
    NOT?: IngestDocumentScalarWhereWithAggregatesInput | IngestDocumentScalarWhereWithAggregatesInput[]
    documentId?: StringWithAggregatesFilter<"IngestDocument"> | string
    tenantId?: StringNullableWithAggregatesFilter<"IngestDocument"> | string | null
    requestedBy?: StringNullableWithAggregatesFilter<"IngestDocument"> | string | null
    title?: StringWithAggregatesFilter<"IngestDocument"> | string
    contentType?: StringNullableWithAggregatesFilter<"IngestDocument"> | string | null
    visibility?: StringNullableWithAggregatesFilter<"IngestDocument"> | string | null
    retentionPolicy?: StringNullableWithAggregatesFilter<"IngestDocument"> | string | null
    metadata?: JsonNullableWithAggregatesFilter<"IngestDocument">
    sourceUri?: StringNullableWithAggregatesFilter<"IngestDocument"> | string | null
    sourceBucket?: StringNullableWithAggregatesFilter<"IngestDocument"> | string | null
    sourceKey?: StringNullableWithAggregatesFilter<"IngestDocument"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"IngestDocument"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"IngestDocument"> | Date | string
  }

  export type IngestDocumentChunkWhereInput = {
    AND?: IngestDocumentChunkWhereInput | IngestDocumentChunkWhereInput[]
    OR?: IngestDocumentChunkWhereInput[]
    NOT?: IngestDocumentChunkWhereInput | IngestDocumentChunkWhereInput[]
    documentId?: StringFilter<"IngestDocumentChunk"> | string
    chunkId?: StringFilter<"IngestDocumentChunk"> | string
    chunkIndex?: IntFilter<"IngestDocumentChunk"> | number
    content?: StringFilter<"IngestDocumentChunk"> | string
    preview?: StringNullableFilter<"IngestDocumentChunk"> | string | null
    tokenCount?: IntNullableFilter<"IngestDocumentChunk"> | number | null
    embedding?: JsonNullableFilter<"IngestDocumentChunk">
    createdAt?: DateTimeFilter<"IngestDocumentChunk"> | Date | string
    document?: XOR<IngestDocumentScalarRelationFilter, IngestDocumentWhereInput>
  }

  export type IngestDocumentChunkOrderByWithRelationInput = {
    documentId?: SortOrder
    chunkId?: SortOrder
    chunkIndex?: SortOrder
    content?: SortOrder
    preview?: SortOrderInput | SortOrder
    tokenCount?: SortOrderInput | SortOrder
    embedding?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    document?: IngestDocumentOrderByWithRelationInput
  }

  export type IngestDocumentChunkWhereUniqueInput = Prisma.AtLeast<{
    documentId_chunkId?: IngestDocumentChunkDocumentIdChunkIdCompoundUniqueInput
    AND?: IngestDocumentChunkWhereInput | IngestDocumentChunkWhereInput[]
    OR?: IngestDocumentChunkWhereInput[]
    NOT?: IngestDocumentChunkWhereInput | IngestDocumentChunkWhereInput[]
    documentId?: StringFilter<"IngestDocumentChunk"> | string
    chunkId?: StringFilter<"IngestDocumentChunk"> | string
    chunkIndex?: IntFilter<"IngestDocumentChunk"> | number
    content?: StringFilter<"IngestDocumentChunk"> | string
    preview?: StringNullableFilter<"IngestDocumentChunk"> | string | null
    tokenCount?: IntNullableFilter<"IngestDocumentChunk"> | number | null
    embedding?: JsonNullableFilter<"IngestDocumentChunk">
    createdAt?: DateTimeFilter<"IngestDocumentChunk"> | Date | string
    document?: XOR<IngestDocumentScalarRelationFilter, IngestDocumentWhereInput>
  }, "documentId_chunkId">

  export type IngestDocumentChunkOrderByWithAggregationInput = {
    documentId?: SortOrder
    chunkId?: SortOrder
    chunkIndex?: SortOrder
    content?: SortOrder
    preview?: SortOrderInput | SortOrder
    tokenCount?: SortOrderInput | SortOrder
    embedding?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: IngestDocumentChunkCountOrderByAggregateInput
    _avg?: IngestDocumentChunkAvgOrderByAggregateInput
    _max?: IngestDocumentChunkMaxOrderByAggregateInput
    _min?: IngestDocumentChunkMinOrderByAggregateInput
    _sum?: IngestDocumentChunkSumOrderByAggregateInput
  }

  export type IngestDocumentChunkScalarWhereWithAggregatesInput = {
    AND?: IngestDocumentChunkScalarWhereWithAggregatesInput | IngestDocumentChunkScalarWhereWithAggregatesInput[]
    OR?: IngestDocumentChunkScalarWhereWithAggregatesInput[]
    NOT?: IngestDocumentChunkScalarWhereWithAggregatesInput | IngestDocumentChunkScalarWhereWithAggregatesInput[]
    documentId?: StringWithAggregatesFilter<"IngestDocumentChunk"> | string
    chunkId?: StringWithAggregatesFilter<"IngestDocumentChunk"> | string
    chunkIndex?: IntWithAggregatesFilter<"IngestDocumentChunk"> | number
    content?: StringWithAggregatesFilter<"IngestDocumentChunk"> | string
    preview?: StringNullableWithAggregatesFilter<"IngestDocumentChunk"> | string | null
    tokenCount?: IntNullableWithAggregatesFilter<"IngestDocumentChunk"> | number | null
    embedding?: JsonNullableWithAggregatesFilter<"IngestDocumentChunk">
    createdAt?: DateTimeWithAggregatesFilter<"IngestDocumentChunk"> | Date | string
  }

  export type IngestDocumentCreateInput = {
    documentId: string
    tenantId?: string | null
    requestedBy?: string | null
    title: string
    contentType?: string | null
    visibility?: string | null
    retentionPolicy?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    sourceUri?: string | null
    sourceBucket?: string | null
    sourceKey?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    chunks?: IngestDocumentChunkCreateNestedManyWithoutDocumentInput
  }

  export type IngestDocumentUncheckedCreateInput = {
    documentId: string
    tenantId?: string | null
    requestedBy?: string | null
    title: string
    contentType?: string | null
    visibility?: string | null
    retentionPolicy?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    sourceUri?: string | null
    sourceBucket?: string | null
    sourceKey?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    chunks?: IngestDocumentChunkUncheckedCreateNestedManyWithoutDocumentInput
  }

  export type IngestDocumentUpdateInput = {
    documentId?: StringFieldUpdateOperationsInput | string
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
    requestedBy?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    contentType?: NullableStringFieldUpdateOperationsInput | string | null
    visibility?: NullableStringFieldUpdateOperationsInput | string | null
    retentionPolicy?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    sourceUri?: NullableStringFieldUpdateOperationsInput | string | null
    sourceBucket?: NullableStringFieldUpdateOperationsInput | string | null
    sourceKey?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    chunks?: IngestDocumentChunkUpdateManyWithoutDocumentNestedInput
  }

  export type IngestDocumentUncheckedUpdateInput = {
    documentId?: StringFieldUpdateOperationsInput | string
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
    requestedBy?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    contentType?: NullableStringFieldUpdateOperationsInput | string | null
    visibility?: NullableStringFieldUpdateOperationsInput | string | null
    retentionPolicy?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    sourceUri?: NullableStringFieldUpdateOperationsInput | string | null
    sourceBucket?: NullableStringFieldUpdateOperationsInput | string | null
    sourceKey?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    chunks?: IngestDocumentChunkUncheckedUpdateManyWithoutDocumentNestedInput
  }

  export type IngestDocumentCreateManyInput = {
    documentId: string
    tenantId?: string | null
    requestedBy?: string | null
    title: string
    contentType?: string | null
    visibility?: string | null
    retentionPolicy?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    sourceUri?: string | null
    sourceBucket?: string | null
    sourceKey?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type IngestDocumentUpdateManyMutationInput = {
    documentId?: StringFieldUpdateOperationsInput | string
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
    requestedBy?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    contentType?: NullableStringFieldUpdateOperationsInput | string | null
    visibility?: NullableStringFieldUpdateOperationsInput | string | null
    retentionPolicy?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    sourceUri?: NullableStringFieldUpdateOperationsInput | string | null
    sourceBucket?: NullableStringFieldUpdateOperationsInput | string | null
    sourceKey?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IngestDocumentUncheckedUpdateManyInput = {
    documentId?: StringFieldUpdateOperationsInput | string
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
    requestedBy?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    contentType?: NullableStringFieldUpdateOperationsInput | string | null
    visibility?: NullableStringFieldUpdateOperationsInput | string | null
    retentionPolicy?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    sourceUri?: NullableStringFieldUpdateOperationsInput | string | null
    sourceBucket?: NullableStringFieldUpdateOperationsInput | string | null
    sourceKey?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IngestDocumentChunkCreateInput = {
    chunkId: string
    chunkIndex: number
    content: string
    preview?: string | null
    tokenCount?: number | null
    embedding?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    document: IngestDocumentCreateNestedOneWithoutChunksInput
  }

  export type IngestDocumentChunkUncheckedCreateInput = {
    documentId: string
    chunkId: string
    chunkIndex: number
    content: string
    preview?: string | null
    tokenCount?: number | null
    embedding?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type IngestDocumentChunkUpdateInput = {
    chunkId?: StringFieldUpdateOperationsInput | string
    chunkIndex?: IntFieldUpdateOperationsInput | number
    content?: StringFieldUpdateOperationsInput | string
    preview?: NullableStringFieldUpdateOperationsInput | string | null
    tokenCount?: NullableIntFieldUpdateOperationsInput | number | null
    embedding?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    document?: IngestDocumentUpdateOneRequiredWithoutChunksNestedInput
  }

  export type IngestDocumentChunkUncheckedUpdateInput = {
    documentId?: StringFieldUpdateOperationsInput | string
    chunkId?: StringFieldUpdateOperationsInput | string
    chunkIndex?: IntFieldUpdateOperationsInput | number
    content?: StringFieldUpdateOperationsInput | string
    preview?: NullableStringFieldUpdateOperationsInput | string | null
    tokenCount?: NullableIntFieldUpdateOperationsInput | number | null
    embedding?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IngestDocumentChunkCreateManyInput = {
    documentId: string
    chunkId: string
    chunkIndex: number
    content: string
    preview?: string | null
    tokenCount?: number | null
    embedding?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type IngestDocumentChunkUpdateManyMutationInput = {
    chunkId?: StringFieldUpdateOperationsInput | string
    chunkIndex?: IntFieldUpdateOperationsInput | number
    content?: StringFieldUpdateOperationsInput | string
    preview?: NullableStringFieldUpdateOperationsInput | string | null
    tokenCount?: NullableIntFieldUpdateOperationsInput | number | null
    embedding?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IngestDocumentChunkUncheckedUpdateManyInput = {
    documentId?: StringFieldUpdateOperationsInput | string
    chunkId?: StringFieldUpdateOperationsInput | string
    chunkIndex?: IntFieldUpdateOperationsInput | number
    content?: StringFieldUpdateOperationsInput | string
    preview?: NullableStringFieldUpdateOperationsInput | string | null
    tokenCount?: NullableIntFieldUpdateOperationsInput | number | null
    embedding?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type IngestDocumentChunkListRelationFilter = {
    every?: IngestDocumentChunkWhereInput
    some?: IngestDocumentChunkWhereInput
    none?: IngestDocumentChunkWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type IngestDocumentChunkOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type IngestDocumentCountOrderByAggregateInput = {
    documentId?: SortOrder
    tenantId?: SortOrder
    requestedBy?: SortOrder
    title?: SortOrder
    contentType?: SortOrder
    visibility?: SortOrder
    retentionPolicy?: SortOrder
    metadata?: SortOrder
    sourceUri?: SortOrder
    sourceBucket?: SortOrder
    sourceKey?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type IngestDocumentMaxOrderByAggregateInput = {
    documentId?: SortOrder
    tenantId?: SortOrder
    requestedBy?: SortOrder
    title?: SortOrder
    contentType?: SortOrder
    visibility?: SortOrder
    retentionPolicy?: SortOrder
    sourceUri?: SortOrder
    sourceBucket?: SortOrder
    sourceKey?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type IngestDocumentMinOrderByAggregateInput = {
    documentId?: SortOrder
    tenantId?: SortOrder
    requestedBy?: SortOrder
    title?: SortOrder
    contentType?: SortOrder
    visibility?: SortOrder
    retentionPolicy?: SortOrder
    sourceUri?: SortOrder
    sourceBucket?: SortOrder
    sourceKey?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type IngestDocumentScalarRelationFilter = {
    is?: IngestDocumentWhereInput
    isNot?: IngestDocumentWhereInput
  }

  export type IngestDocumentChunkDocumentIdChunkIdCompoundUniqueInput = {
    documentId: string
    chunkId: string
  }

  export type IngestDocumentChunkCountOrderByAggregateInput = {
    documentId?: SortOrder
    chunkId?: SortOrder
    chunkIndex?: SortOrder
    content?: SortOrder
    preview?: SortOrder
    tokenCount?: SortOrder
    embedding?: SortOrder
    createdAt?: SortOrder
  }

  export type IngestDocumentChunkAvgOrderByAggregateInput = {
    chunkIndex?: SortOrder
    tokenCount?: SortOrder
  }

  export type IngestDocumentChunkMaxOrderByAggregateInput = {
    documentId?: SortOrder
    chunkId?: SortOrder
    chunkIndex?: SortOrder
    content?: SortOrder
    preview?: SortOrder
    tokenCount?: SortOrder
    createdAt?: SortOrder
  }

  export type IngestDocumentChunkMinOrderByAggregateInput = {
    documentId?: SortOrder
    chunkId?: SortOrder
    chunkIndex?: SortOrder
    content?: SortOrder
    preview?: SortOrder
    tokenCount?: SortOrder
    createdAt?: SortOrder
  }

  export type IngestDocumentChunkSumOrderByAggregateInput = {
    chunkIndex?: SortOrder
    tokenCount?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type IngestDocumentChunkCreateNestedManyWithoutDocumentInput = {
    create?: XOR<IngestDocumentChunkCreateWithoutDocumentInput, IngestDocumentChunkUncheckedCreateWithoutDocumentInput> | IngestDocumentChunkCreateWithoutDocumentInput[] | IngestDocumentChunkUncheckedCreateWithoutDocumentInput[]
    connectOrCreate?: IngestDocumentChunkCreateOrConnectWithoutDocumentInput | IngestDocumentChunkCreateOrConnectWithoutDocumentInput[]
    createMany?: IngestDocumentChunkCreateManyDocumentInputEnvelope
    connect?: IngestDocumentChunkWhereUniqueInput | IngestDocumentChunkWhereUniqueInput[]
  }

  export type IngestDocumentChunkUncheckedCreateNestedManyWithoutDocumentInput = {
    create?: XOR<IngestDocumentChunkCreateWithoutDocumentInput, IngestDocumentChunkUncheckedCreateWithoutDocumentInput> | IngestDocumentChunkCreateWithoutDocumentInput[] | IngestDocumentChunkUncheckedCreateWithoutDocumentInput[]
    connectOrCreate?: IngestDocumentChunkCreateOrConnectWithoutDocumentInput | IngestDocumentChunkCreateOrConnectWithoutDocumentInput[]
    createMany?: IngestDocumentChunkCreateManyDocumentInputEnvelope
    connect?: IngestDocumentChunkWhereUniqueInput | IngestDocumentChunkWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type IngestDocumentChunkUpdateManyWithoutDocumentNestedInput = {
    create?: XOR<IngestDocumentChunkCreateWithoutDocumentInput, IngestDocumentChunkUncheckedCreateWithoutDocumentInput> | IngestDocumentChunkCreateWithoutDocumentInput[] | IngestDocumentChunkUncheckedCreateWithoutDocumentInput[]
    connectOrCreate?: IngestDocumentChunkCreateOrConnectWithoutDocumentInput | IngestDocumentChunkCreateOrConnectWithoutDocumentInput[]
    upsert?: IngestDocumentChunkUpsertWithWhereUniqueWithoutDocumentInput | IngestDocumentChunkUpsertWithWhereUniqueWithoutDocumentInput[]
    createMany?: IngestDocumentChunkCreateManyDocumentInputEnvelope
    set?: IngestDocumentChunkWhereUniqueInput | IngestDocumentChunkWhereUniqueInput[]
    disconnect?: IngestDocumentChunkWhereUniqueInput | IngestDocumentChunkWhereUniqueInput[]
    delete?: IngestDocumentChunkWhereUniqueInput | IngestDocumentChunkWhereUniqueInput[]
    connect?: IngestDocumentChunkWhereUniqueInput | IngestDocumentChunkWhereUniqueInput[]
    update?: IngestDocumentChunkUpdateWithWhereUniqueWithoutDocumentInput | IngestDocumentChunkUpdateWithWhereUniqueWithoutDocumentInput[]
    updateMany?: IngestDocumentChunkUpdateManyWithWhereWithoutDocumentInput | IngestDocumentChunkUpdateManyWithWhereWithoutDocumentInput[]
    deleteMany?: IngestDocumentChunkScalarWhereInput | IngestDocumentChunkScalarWhereInput[]
  }

  export type IngestDocumentChunkUncheckedUpdateManyWithoutDocumentNestedInput = {
    create?: XOR<IngestDocumentChunkCreateWithoutDocumentInput, IngestDocumentChunkUncheckedCreateWithoutDocumentInput> | IngestDocumentChunkCreateWithoutDocumentInput[] | IngestDocumentChunkUncheckedCreateWithoutDocumentInput[]
    connectOrCreate?: IngestDocumentChunkCreateOrConnectWithoutDocumentInput | IngestDocumentChunkCreateOrConnectWithoutDocumentInput[]
    upsert?: IngestDocumentChunkUpsertWithWhereUniqueWithoutDocumentInput | IngestDocumentChunkUpsertWithWhereUniqueWithoutDocumentInput[]
    createMany?: IngestDocumentChunkCreateManyDocumentInputEnvelope
    set?: IngestDocumentChunkWhereUniqueInput | IngestDocumentChunkWhereUniqueInput[]
    disconnect?: IngestDocumentChunkWhereUniqueInput | IngestDocumentChunkWhereUniqueInput[]
    delete?: IngestDocumentChunkWhereUniqueInput | IngestDocumentChunkWhereUniqueInput[]
    connect?: IngestDocumentChunkWhereUniqueInput | IngestDocumentChunkWhereUniqueInput[]
    update?: IngestDocumentChunkUpdateWithWhereUniqueWithoutDocumentInput | IngestDocumentChunkUpdateWithWhereUniqueWithoutDocumentInput[]
    updateMany?: IngestDocumentChunkUpdateManyWithWhereWithoutDocumentInput | IngestDocumentChunkUpdateManyWithWhereWithoutDocumentInput[]
    deleteMany?: IngestDocumentChunkScalarWhereInput | IngestDocumentChunkScalarWhereInput[]
  }

  export type IngestDocumentCreateNestedOneWithoutChunksInput = {
    create?: XOR<IngestDocumentCreateWithoutChunksInput, IngestDocumentUncheckedCreateWithoutChunksInput>
    connectOrCreate?: IngestDocumentCreateOrConnectWithoutChunksInput
    connect?: IngestDocumentWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type IngestDocumentUpdateOneRequiredWithoutChunksNestedInput = {
    create?: XOR<IngestDocumentCreateWithoutChunksInput, IngestDocumentUncheckedCreateWithoutChunksInput>
    connectOrCreate?: IngestDocumentCreateOrConnectWithoutChunksInput
    upsert?: IngestDocumentUpsertWithoutChunksInput
    connect?: IngestDocumentWhereUniqueInput
    update?: XOR<XOR<IngestDocumentUpdateToOneWithWhereWithoutChunksInput, IngestDocumentUpdateWithoutChunksInput>, IngestDocumentUncheckedUpdateWithoutChunksInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type IngestDocumentChunkCreateWithoutDocumentInput = {
    chunkId: string
    chunkIndex: number
    content: string
    preview?: string | null
    tokenCount?: number | null
    embedding?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type IngestDocumentChunkUncheckedCreateWithoutDocumentInput = {
    chunkId: string
    chunkIndex: number
    content: string
    preview?: string | null
    tokenCount?: number | null
    embedding?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type IngestDocumentChunkCreateOrConnectWithoutDocumentInput = {
    where: IngestDocumentChunkWhereUniqueInput
    create: XOR<IngestDocumentChunkCreateWithoutDocumentInput, IngestDocumentChunkUncheckedCreateWithoutDocumentInput>
  }

  export type IngestDocumentChunkCreateManyDocumentInputEnvelope = {
    data: IngestDocumentChunkCreateManyDocumentInput | IngestDocumentChunkCreateManyDocumentInput[]
    skipDuplicates?: boolean
  }

  export type IngestDocumentChunkUpsertWithWhereUniqueWithoutDocumentInput = {
    where: IngestDocumentChunkWhereUniqueInput
    update: XOR<IngestDocumentChunkUpdateWithoutDocumentInput, IngestDocumentChunkUncheckedUpdateWithoutDocumentInput>
    create: XOR<IngestDocumentChunkCreateWithoutDocumentInput, IngestDocumentChunkUncheckedCreateWithoutDocumentInput>
  }

  export type IngestDocumentChunkUpdateWithWhereUniqueWithoutDocumentInput = {
    where: IngestDocumentChunkWhereUniqueInput
    data: XOR<IngestDocumentChunkUpdateWithoutDocumentInput, IngestDocumentChunkUncheckedUpdateWithoutDocumentInput>
  }

  export type IngestDocumentChunkUpdateManyWithWhereWithoutDocumentInput = {
    where: IngestDocumentChunkScalarWhereInput
    data: XOR<IngestDocumentChunkUpdateManyMutationInput, IngestDocumentChunkUncheckedUpdateManyWithoutDocumentInput>
  }

  export type IngestDocumentChunkScalarWhereInput = {
    AND?: IngestDocumentChunkScalarWhereInput | IngestDocumentChunkScalarWhereInput[]
    OR?: IngestDocumentChunkScalarWhereInput[]
    NOT?: IngestDocumentChunkScalarWhereInput | IngestDocumentChunkScalarWhereInput[]
    documentId?: StringFilter<"IngestDocumentChunk"> | string
    chunkId?: StringFilter<"IngestDocumentChunk"> | string
    chunkIndex?: IntFilter<"IngestDocumentChunk"> | number
    content?: StringFilter<"IngestDocumentChunk"> | string
    preview?: StringNullableFilter<"IngestDocumentChunk"> | string | null
    tokenCount?: IntNullableFilter<"IngestDocumentChunk"> | number | null
    embedding?: JsonNullableFilter<"IngestDocumentChunk">
    createdAt?: DateTimeFilter<"IngestDocumentChunk"> | Date | string
  }

  export type IngestDocumentCreateWithoutChunksInput = {
    documentId: string
    tenantId?: string | null
    requestedBy?: string | null
    title: string
    contentType?: string | null
    visibility?: string | null
    retentionPolicy?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    sourceUri?: string | null
    sourceBucket?: string | null
    sourceKey?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type IngestDocumentUncheckedCreateWithoutChunksInput = {
    documentId: string
    tenantId?: string | null
    requestedBy?: string | null
    title: string
    contentType?: string | null
    visibility?: string | null
    retentionPolicy?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    sourceUri?: string | null
    sourceBucket?: string | null
    sourceKey?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type IngestDocumentCreateOrConnectWithoutChunksInput = {
    where: IngestDocumentWhereUniqueInput
    create: XOR<IngestDocumentCreateWithoutChunksInput, IngestDocumentUncheckedCreateWithoutChunksInput>
  }

  export type IngestDocumentUpsertWithoutChunksInput = {
    update: XOR<IngestDocumentUpdateWithoutChunksInput, IngestDocumentUncheckedUpdateWithoutChunksInput>
    create: XOR<IngestDocumentCreateWithoutChunksInput, IngestDocumentUncheckedCreateWithoutChunksInput>
    where?: IngestDocumentWhereInput
  }

  export type IngestDocumentUpdateToOneWithWhereWithoutChunksInput = {
    where?: IngestDocumentWhereInput
    data: XOR<IngestDocumentUpdateWithoutChunksInput, IngestDocumentUncheckedUpdateWithoutChunksInput>
  }

  export type IngestDocumentUpdateWithoutChunksInput = {
    documentId?: StringFieldUpdateOperationsInput | string
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
    requestedBy?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    contentType?: NullableStringFieldUpdateOperationsInput | string | null
    visibility?: NullableStringFieldUpdateOperationsInput | string | null
    retentionPolicy?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    sourceUri?: NullableStringFieldUpdateOperationsInput | string | null
    sourceBucket?: NullableStringFieldUpdateOperationsInput | string | null
    sourceKey?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IngestDocumentUncheckedUpdateWithoutChunksInput = {
    documentId?: StringFieldUpdateOperationsInput | string
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
    requestedBy?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    contentType?: NullableStringFieldUpdateOperationsInput | string | null
    visibility?: NullableStringFieldUpdateOperationsInput | string | null
    retentionPolicy?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    sourceUri?: NullableStringFieldUpdateOperationsInput | string | null
    sourceBucket?: NullableStringFieldUpdateOperationsInput | string | null
    sourceKey?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IngestDocumentChunkCreateManyDocumentInput = {
    chunkId: string
    chunkIndex: number
    content: string
    preview?: string | null
    tokenCount?: number | null
    embedding?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type IngestDocumentChunkUpdateWithoutDocumentInput = {
    chunkId?: StringFieldUpdateOperationsInput | string
    chunkIndex?: IntFieldUpdateOperationsInput | number
    content?: StringFieldUpdateOperationsInput | string
    preview?: NullableStringFieldUpdateOperationsInput | string | null
    tokenCount?: NullableIntFieldUpdateOperationsInput | number | null
    embedding?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IngestDocumentChunkUncheckedUpdateWithoutDocumentInput = {
    chunkId?: StringFieldUpdateOperationsInput | string
    chunkIndex?: IntFieldUpdateOperationsInput | number
    content?: StringFieldUpdateOperationsInput | string
    preview?: NullableStringFieldUpdateOperationsInput | string | null
    tokenCount?: NullableIntFieldUpdateOperationsInput | number | null
    embedding?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IngestDocumentChunkUncheckedUpdateManyWithoutDocumentInput = {
    chunkId?: StringFieldUpdateOperationsInput | string
    chunkIndex?: IntFieldUpdateOperationsInput | number
    content?: StringFieldUpdateOperationsInput | string
    preview?: NullableStringFieldUpdateOperationsInput | string | null
    tokenCount?: NullableIntFieldUpdateOperationsInput | number | null
    embedding?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}
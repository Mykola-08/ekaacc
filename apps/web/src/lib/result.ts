/**
 * Result type for better error handling
 * 
 * Inspired by Rust's Result<T, E> and functional programming patterns.
 * Eliminates the need for try-catch blocks and provides type-safe error handling.
 * 
 * @example
 * ```typescript
 * async function fetchUser(id: string): Promise<Result<User, AppError>> {
 *   try {
 *     const user = await db.users.find(id);
 *     return Result.ok(user);
 *   } catch (error) {
 *     return Result.err(new AppError('User not found', 'NOT_FOUND', 404));
 *   }
 * }
 * 
 * const result = await fetchUser('123');
 * if (result.isOk()) {
 *   console.log('User:', result.value);
 * } else {
 *   console.error('Error:', result.error);
 * }
 * ```
 */
export type Result<T, E = Error> = 
  | { success: true; value: T; error?: never }
  | { success: false; value?: never; error: E };

/**
 * Result utility class with helper methods
 */
export class Result<T, E = Error> {
  /**
   * Create a successful result
   */
  static ok<T, E = Error>(value: T): Result<T, E> {
    return { success: true, value };
  }

  /**
   * Create a failed result
   */
  static err<T, E = Error>(error: E): Result<T, E> {
    return { success: false, error };
  }

  /**
   * Check if result is successful
   */
  static isOk<T, E>(result: Result<T, E>): result is { success: true; value: T } {
    return result.success === true;
  }

  /**
   * Check if result is an error
   */
  static isErr<T, E>(result: Result<T, E>): result is { success: false; error: E } {
    return result.success === false;
  }

  /**
   * Map the value if result is successful
   */
  static map<T, U, E>(
    result: Result<T, E>,
    fn: (value: T) => U
  ): Result<U, E> {
    if (Result.isOk(result)) {
      return Result.ok(fn(result.value));
    }
    return result;
  }

  /**
   * Map the error if result is failed
   */
  static mapErr<T, E, F>(
    result: Result<T, E>,
    fn: (error: E) => F
  ): Result<T, F> {
    if (Result.isErr(result)) {
      return Result.err(fn(result.error));
    }
    return result;
  }

  /**
   * Unwrap the value or throw the error
   */
  static unwrap<T, E>(result: Result<T, E>): T {
    if (Result.isOk(result)) {
      return result.value;
    }
    throw result.error;
  }

  /**
   * Unwrap the value or return a default
   */
  static unwrapOr<T, E>(result: Result<T, E>, defaultValue: T): T {
    if (Result.isOk(result)) {
      return result.value;
    }
    return defaultValue;
  }

  /**
   * Execute a function based on result status
   */
  static match<T, E, R>(
    result: Result<T, E>,
    onOk: (value: T) => R,
    onErr: (error: E) => R
  ): R {
    if (Result.isOk(result)) {
      return onOk(result.value);
    }
    return onErr(result.error);
  }

  /**
   * Wrap an async operation in a Result
   */
  static async wrap<T, E = Error>(
    operation: () => Promise<T>,
    errorMapper?: (error: unknown) => E
  ): Promise<Result<T, E>> {
    try {
      const value = await operation();
      return Result.ok(value);
    } catch (error) {
      const mappedError = errorMapper 
        ? errorMapper(error)
        : (error as E);
      return Result.err(mappedError);
    }
  }

  /**
   * Combine multiple Results - all must succeed
   */
  static all<T extends readonly unknown[], E = Error>(
    results: { [K in keyof T]: Result<T[K], E> }
  ): Result<T, E> {
    const values: unknown[] = [];
    for (const result of results) {
      if (Result.isErr(result)) {
        return result;
      }
      values.push(result.value);
    }
    return Result.ok(values as unknown as T);
  }

  /**
   * Return the first successful result
   */
  static any<T, E = Error>(
    results: Result<T, E>[]
  ): Result<T, E[]> {
    const errors: E[] = [];
    for (const result of results) {
      if (Result.isOk(result)) {
        return result;
      }
      errors.push(result.error);
    }
    return Result.err(errors);
  }
}

/**
 * Option type for values that may or may not exist
 * Similar to Rust's Option<T>
 */
export type Option<T> = 
  | { some: true; value: T }
  | { some: false; value?: never };

export class Option<T> {
  /**
   * Create an Option with a value
   */
  static some<T>(value: T): Option<T> {
    return { some: true, value };
  }

  /**
   * Create an empty Option
   */
  static none<T>(): Option<T> {
    return { some: false };
  }

  /**
   * Create an Option from a nullable value
   */
  static from<T>(value: T | null | undefined): Option<T> {
    return value != null ? Option.some(value) : Option.none();
  }

  /**
   * Check if Option has a value
   */
  static isSome<T>(option: Option<T>): option is { some: true; value: T } {
    return option.some === true;
  }

  /**
   * Check if Option is empty
   */
  static isNone<T>(option: Option<T>): option is { some: false } {
    return option.some === false;
  }

  /**
   * Map the value if present
   */
  static map<T, U>(option: Option<T>, fn: (value: T) => U): Option<U> {
    if (Option.isSome(option)) {
      return Option.some(fn(option.value));
    }
    return Option.none();
  }

  /**
   * Unwrap the value or throw
   */
  static unwrap<T>(option: Option<T>): T {
    if (Option.isSome(option)) {
      return option.value;
    }
    throw new Error('Called unwrap on a None value');
  }

  /**
   * Unwrap the value or return default
   */
  static unwrapOr<T>(option: Option<T>, defaultValue: T): T {
    if (Option.isSome(option)) {
      return option.value;
    }
    return defaultValue;
  }
}

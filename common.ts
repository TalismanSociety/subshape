export class Cursor {
  view;
  i = 0;

  constructor(readonly u8a: Uint8Array) {
    this.view = new DataView(u8a.buffer, u8a.byteOffset, u8a.byteLength);
  }
}

export type Native<C extends Codec> = C extends Codec<infer N> ? N : never;

/** A means of encoding and decoding a type `T` to and from its SCALE byte representation */
export class Codec<T = any> {
  /**
   * @param _s Accepts the decoded value and returns its to-be-encoded size
   * @param _e Accepts the cursor and value and writes its bytes into the cursor's byte array
   * @param _d Decodes the currently-focused bytes into `T` and moves the cursor as is appropriate
   */
  constructor(
    readonly _s: (value: T) => number,
    readonly _e: (
      cursor: Cursor,
      value: T,
    ) => void,
    readonly _d: (cursor: Cursor) => T,
  ) {}

  /**
   * @param decoded the JS-native representation, `T`
   * @returns the SCALE byte representation of `T`
   */
  encode = (decoded: T): Uint8Array => {
    const cursor = new Cursor(new Uint8Array(this._s(decoded)));
    this._e(cursor, decoded);
    return cursor.u8a;
  };

  /**
   * @param u8a the SCALE byte representation of `T`
   * @returns the JS-native representation, `T`
   */
  decode = (u8a: Uint8Array): T => {
    return this._d(new Cursor(u8a));
  };
}

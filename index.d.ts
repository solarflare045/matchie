declare namespace matchie {
  export interface Matcher {
    (val: any): boolean;
  }

  export type ValueOrMatcher = any | Matcher;
  export type ValueOrMatcherArray = ValueOrMatcher[];
  export type ValueOrMatcherObject = { [key: any]: ValueOrMatcher };

  export interface MatchieAPI {
    (a: any, b: ValueOrMatcher): boolean;

    all(...conditions: ValueOrMatcherArray): Matcher;
    and(...conditions: ValueOrMatcherArray): Matcher;
    between(lower: any, upper: any): Matcher;
    contains(substring: string): Matcher;
    contains(subarray: ValueOrMatcherArray): Matcher;
    equals(value: any): Matcher;
    gt(value: any): Matcher;
    gte(value: any): Matcher;
    hasProperty(key: string, value: ValueOrMatcher): Matcher;
    in(conditions: ValueOrMatcherArray): Matcher;
    instanceOf(cls: Function): Matcher;
    lt(value: any): Matcher;
    lte(value: any): Matcher;
    matches(value: ValueOrMatcher): Matcher;
    maybe(value: ValueOrMatcher): Matcher;
    none(...conditions: ValueOrMatcherArray): Matcher;
    not(value: ValueOrMatcher): Matcher;
    or(...conditions: ValueOrMatcherArray): Matcher;
    outside(lower: any, upper: any): Matcher;
    partial(sub: ValueOrMatcherArray | ValueOrMatcherObject): Matcher;
    has(value: ValueOrMatcherArray | ValueOrMatcherObject): Matcher;
    same(value: value): Matcher;
    typeOf(type: string): Matcher;
    unordered(array: ValueOrMatcherArray): Matcher;
    xor(...conditions: ValueOrMatcherArray): Matcher;
    one(...conditions: ValueOrMatcherArray): Matcher;
    single(...conditions: ValueOrMatcherArray): Matcher;

    is: {
      array: Matcher;
      boolean: Matcher;
      date: Matcher;
      element: Matcher;
      empty: Matcher;
      error: Matcher;
      finite: Matcher;
      function: Matcher;
      integer: Matcher;
      nan: Matcher;
      native: Matcher;
      nil: Matcher;
      null: Matcher;
      number: Matcher;
      object: Matcher;
      plainObject: Matcher;
      regExp: Matcher;
      string: Matcher;
      typedArray: Matcher;
      undefined: Matcher;
    }

    as: {
      integer(value: ValueOrMatcher): Matcher;
      json(value: ValueOrMatcher): Matcher;
      number(value: ValueOrMatcher): Matcher;
      string(value: ValueOrMatcher): Matcher;
    }
  }
}

declare var matchie: matchie.MatchieAPI;
export = matchie;

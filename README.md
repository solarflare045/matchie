# Matchie
Deep JavaScript object comparison library.

[![Build Status](https://travis-ci.org/solarflare045/matchie.svg?branch=master)](https://travis-ci.org/solarflare045/matchie)

## Installation
```bash
npm install https://github.com/solarflare045/matchie.git
```

## Basic Usage
```JavaScript
var matchie = require('matchie');
...
var same = matchie(value, matcher);
```
This will do a deep comparison of the value against the matcher. The matcher can be a simple value, or an object with utility functions as listed below.

```JavaScript
var matcher = matchie.or(matchie.between(5, 10), 15);

matchie(0, matcher); // false
matchie(5, matcher); // true
matchie(10, matcher); // false
matchie(15, matcher); // true
```

## Utility Functions

`matchie.and(args...)`
`matchie.all(args...)`
Requires all of the provided arguments to match the value.

`matchie.between(a, b)`
Requires the value to be between the provided bounds of **[`a`, `b`)**
*(The `a` bound is inclusive and the `b` bound is exclusive.)*

`matchie.contains(a)`
If `a` and value are both strings, then `a` must be found within value.
If the value is an array, then an element within the array must match `a`.
Otherwise, this will return false.

`matchie.equals(a)`
Requires a weak comparison *(`==`)* between value and `a`.

`matchie.gt(num)`
Requires the value to be greater than `num`.

`matchie.gte(num)`
Requires the value to be greater than or equal to `num`.

`matchie.hasProperty(key, val)`
Requires the value to have the specified `key`, with it matching `val`.

`matchie.in(arr)`
Requires the value to match at least one of the elements in `arr`.

`matchie.instanceOf(cls)`
Requires the value to be an instance of `cls`. *(Cannot be serialized.)*

`matchie.lt(num)`
Requires the value to be less than `num`.

`matchie.lte(num)`
Requires the value to be less than or equal to `num`.

`matchie.maybe(val)`
Requires the value to be undefined, or match `val`.

`matchie.none(args...)`
Requires none of the provided arguments to match the value.

`matchie.not(matcher)`
Inverts the value of the provided `matcher`.

`matchie.or(args...)`
Requires any of the provided arguments to match the value.

`matchie.outside(a, b)`
Requires the value to be between the provided bounds of **(-Inf, `a`) or [`b`, Inf)**
*(This is the inverse of the `.between` function.)*

`matchie.partial(arg)`
`matchie.has(arg)`
If `arg` and value are both arrays, each element in `arg` must match an element in value.
If `arg` and value are both object, each key in `arg` must match a key in value.
Otherwise, this will return false.

`matchie.same(obj)`
Requires a strong comparison *(`===`)* between value and `a`.

`matchie.typeOf(type)`
Requires the value to have the type of `type`.

`matchie.unordered(arg)`
If `arg` and value are both arrays, `arg` and value must contain the same set of elements, however, the order is not important.
Otherwise, this will return false.

`matchie.xor(args...)`
`matchie.one(args...)`
`matchie.single(args...)`
Requires exactly one of the provided arguments to match the value.

## Lodash wrappers
For the sake of serialization, many of lodash's functions are available through the `matchie.is.???` object.
- `matchie.is.array` -> `_.isArray`
- `matchie.is.boolean` -> `_.isBoolean`
- `matchie.is.date` -> `_.isDate`
- `matchie.is.element` -> `_.isElement`
- `matchie.is.empty` -> `_.isEmpty`
- `matchie.is.equal` -> `_.isEqual`
- `matchie.is.error` -> `_.isError`
- `matchie.is.finite` -> `_.isFinite`
- `matchie.is.function` -> `_.isFunction`
- `matchie.is.match` -> `_.isMatch`
- `matchie.is.nan` -> `_.isNaN`
- `matchie.is.native` -> `_.isNative`
- `matchie.is.null` -> `_.isNull`
- `matchie.is.number` -> `_.isNumber`
- `matchie.is.object` -> `_.isObject`
- `matchie.is.plainObject` -> `_.isPlainObject`
- `matchie.is.regExp` -> `_.isRegExp`
- `matchie.is.string` -> `_.isString`
- `matchie.is.typedArray` -> `_.isTypedArray`
- `matchie.is.undefined` -> `_.isUndefined`

## Serialization
If you need to store a matcher object as string, you can use `matchie.serialize(matcher)` and `matchie.deserialize(string)`.
*(NOTE: Not all utility functions can be serialized!)*

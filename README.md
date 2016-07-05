# iMemoized
A super-fast memoizer that does single functions or classes or objects in just 2K.

[![Build Status](https://travis-ci.org/anywhichway/jovial.svg)](https://travis-ci.org/anywhichway/iMemoized)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/9e081fb170dd421ba31a95127f5929de)](https://www.codacy.com/app/syblackwell/iMemoized?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=anywhichway/iMemoized&amp;utm_campaign=Badge_Grade)
[![Code Climate](https://codeclimate.com/github/anywhichway/iMemoized/badges/gpa.svg)](https://codeclimate.com/github/anywhichway/iMemoized)
[![Test Coverage](https://codeclimate.com/github/anywhichway/iMemoized/badges/coverage.svg)](https://codeclimate.com/github/anywhichway/iMemoized/coverage)



Below are the benchmark results for computing Fibonacci value for 35 using a recursive function:

```
var fibonacci = function(n) {
    return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2);
}
```

```
un-memoized x 7.47 ops/sec �5.46% (23 runs sampled)
test/benchmark.html:49 iMemoize.memoize x 20,765,906 ops/sec �4.40% (56 runs sampled)
test/benchmark.html:44 lodash _.memoize x 9,196,531 ops/sec �3.11% (54 runs sampled)
test/benchmark.html:44 fast-memoize x 8,275,435 ops/sec �1.07% (59 runs sampled)
test/benchmark.html:46 Fastest is iMemoize.memoize
```

# Usage


npm install iMemoized

Memoization supports N arguments to the functions memoized. Arguments can be primitives or objects, so long as the objects have unique keys and the memoizer is called with the name of the key property.

The call signature for iMemoize is: `iMemoize(constructorOrObject,excludeProperties=[],includeClassMethods=false,keyProperty=null)`

To memoize all methods on all instances created by a constructor call: `constructor = iMemoize(constructor)`. Note,
this call does not memoize the constructor itself, which would result in the same object being returned for calls with the same
arguments ... something user sprobably would not want. Rather, it memoizes the methods on instances created. Additionally,
this function uses Proxy when called with a constructor, which is not supported in older versions of some browsers. However, iMemoize.memoize can still be used to memoize object instances. You just need to call it directly as below.

To memoize all methods on an object call: `object = iMemoize(object)`.

An optional argument can be supplied to ignore certain methods by name, e.g.: `constructor = iMemoize(constructor,["someFactory"])`. Factory functions, i.e. those that return new objects, should generally not be memoized because they will then always return the same new object ... which won't be so new after a while!

Additionally, the methods on a class constructor are usually ignored, but the can be memoized by passing includeClassMethods as true.

To memoize a standalone function call: `func = iMemoize.memoize(func)`.

The call signatue for iMemoize.memoize is: `iMemoize.memoize(function,keyProperty=null)`

CAUTION: Use the `keyProperty` with care. Supporting the memoization of function calls that have objects in their argument lists can cause unexpected results. The memoizer has no way to know what, if any, properties are used as part of the function logic. If the function logic uses property values that may change between function calls, then memoization should should not be applied to the function. Simply not specifying `keyProperty` will result in calls that always evaluate the original function.

The memozied methods or functions also have their own method, `flush`, which can be used to clear the memo cache, e.g.: `func.flush()`

# Release History

2016-07-06 v0.0.6 - Added support for Safari by downgrading code style but not functionality.

2016-07-06 v0.0.5 - Updated README to note lack of support for Safari for memoize enabling constructors.

2016-07-05 v0.0.4 - Updated README

2016-07-02 v0.0.3 - Added support for memoizing function that take objects as arguments. Added unit tests.

2016-07-01 v0.0.2 - Improved documentation, updated benchmark (even faster), added code to ensure functions taking anything other than primitve arguments don't get memoized. Will fix this in release 0.0.3 or 0.0.4.

2016-07-01 v0.0.1 - First release. More testing in warranted.

# License

MIT




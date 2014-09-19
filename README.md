# protoExplorer
- a forum for exploring JS classing techniques and their effects on `__proto__`

Implement extra-fancy Hello World components using only jQuery as a support library. Three levels of functionality motivate a base class, its extension, and an extension of the extension. The three levels are implemented three times each, using different JS classing techniques for the sake of comparing effects of those techniques on `__proto__`, on property pass-through, and on property override (only two implemented so far).

Contents:

* `oldFashioned` subclassing using `new` to create a constructor&apos;s prototype
* `objectCreate` subclassing using `Object.create` to create a constructor&apos;s prototype
* `private` subclassing by creating two constructors and their prototypes (niy)

## Old Fashioned

Using `new` to create a constructor's prototype used to be the only way, but since `Object.create` came along, tends to be frowned up.

We create a reference implementation using this technique for the sake of comparison.

## Object.create

Identical to Old Fashioned except in the way the prototypes of the subclasses are assigned.

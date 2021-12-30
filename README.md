# as-disposable

An object finalization algorithm for AssemblyScript.

## limitations

The held value cannot be a reference. It must be a `u64` value. The callback functions used for
finalization must also avoid heap allocations and heap frees because the garbage collector is currently working.

## usage

If you want your class to have a finalization callback because it's linked with some kind of host object
in the browser, simply import `ASManaged` and extend your base class.

```ts
import { ASManaged } from "as-managed";

/** Construct a reference that has some kind of host managed resource with an ID. */
export class MyManagedClass extends ASManaged {
  constructor(id: u32) {
    super(<u64>id, (held: u64): void => {
      // the host can cleanup a reference now
      notifyHost(<u32>id);
    });
  }
}
```

In order to use `f64` values, you can use the `<u64>reinterpret<i64>(floatValue)` instruction.

## license

```txt
MIT License

Copyright (c) 2021 Joshua Tenner <tenner.joshua@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

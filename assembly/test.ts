import { ASManaged } from "./ASManaged";

let count: i32 = 0;
let ptr: usize = 0;
let refs: StaticArray<ExampleManaged> | null = null;

class ExampleManaged extends ASManaged {
  constructor(id: u32) {
    super(<u64>id, (val: u64): void => {
      store<u8>(ptr + <usize>val, <u8>1);
    });
  }
}

export function setup(numCount: i32): usize {
  let size: usize = <usize>numCount;
  count = numCount;
  ptr = heap.alloc(size);
  memory.fill(ptr, 0, size);
  refs = new StaticArray<ExampleManaged>(numCount);
  for (let i = 0; i < numCount; i++) {
    refs![i] = new ExampleManaged(i);
  }
  return ptr;
}

export function run(): void {
  refs = null;
  // @ts-ignore: This is a global function that forces a garbage collection
  __collect();
}

export function assert(): bool {
  for (let i = 0; i < count; i++) {
    if (load<u8>(ptr + <usize>i) != 1) return false;
  }
  return true;
}
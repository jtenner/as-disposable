import  { htGet, htSet, htDel } from "./ht";

// @ts-ignore: global decorator
@global export function __finalize(ptr: usize): void {
  let result = htDel(ptr);
  if (result) call_indirect(result.cb, result.held);
}

/** Set the finalization record for this reference. */
export function setFinalize(ptr: usize, held: u64, cb: u32): void {
  htSet(ptr, held, cb);
}

/** Check to see if a reference has a finalization record still. */
export function hasFinalize(ptr: usize): bool {
  return htGet(ptr) != null;
}

/** Represents an object that is managed by ASManaged. Requires the resource become dropped. */
export abstract class ASManaged {

  constructor(
    /** A held u64 value that will be passed to the callback. */
    held: u64,
    /**
     * This callback requires a few special rules.
     *
     * 1. This callback cannot allocate new references or free memory, and thus,
     * no strings can be used unless they are static, the usage of the `new` keyword
     * should be avoided.
     * 2. The held value can only be a 64-bit integer.
     *
     * ```ts
     * class MyManaged extends ASManaged {
     *   constructor(hostID: u64) {
     *     super(hostID, (id: u64) => {
     *       notifyHost(id);
     *     });
     *   }
     * }
     * ```
     */
    finalize: (val: u64) => void,
  ) {
    setFinalize(changetype<usize>(this), held, finalize.index);
  }

  /** Returns if the resource has not been dropped yet. */
  get dropped(): bool {
    return !hasFinalize(changetype<usize>(this));
  }

  /** Drop the resource manually if it hasn't been dropped already. */
  dispose(): void {
    if (hasFinalize(changetype<usize>(this))) {
      __finalize(changetype<usize>(this));
    }
  }

  /** Remove the finalization record without calling the finalization callback. */
  preventFinalize(): void {
    htDel(changetype<usize>(this));
  }
}
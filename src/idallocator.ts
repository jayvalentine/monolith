export class IDAllocator {
  private static ids : Object = {};

  static allocate(base: string) : string {
    if (!IDAllocator.ids.hasOwnProperty(base)) {
      IDAllocator.ids[base] = 0;
    }

    let id : string = `${base}-${IDAllocator.ids[base]}`;
    IDAllocator.ids[base]++;

    return id;
  }
}
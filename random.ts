class Random {
  static interval(min: number, max: number) : number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static choice<T>(array: T[]) : T {
    const index = Random.interval(0, array.length - 1);
    return array[index];
  }

  static chance(c: number) : boolean {
    if (Math.random() < c) return true;
    else return false;
  }

  static progressiveChance(c: number, progress: number, factor: number) : boolean {
    const limit = (progress/factor)+c;
  
    if (Math.random() < limit) return true;
    else return false;
  }
}
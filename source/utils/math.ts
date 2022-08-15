export namespace math {

  /** Invert absolute value. 0 to 1; .75 to .25 */

  export namespace vector {
    export function invert(x: number): number {  
      return (1 - Math.abs(x)) * Math.sign(x)
    }
    
  }

  export namespace int {

    export function mean(set: Array<number>): number {

      return set.reduce((acc, cur) => acc + cur, 0) / set.length

    }

    export function median(set: Array<number>): Array<number> {
      
      return set.slice((set.length - 1) / 2, (set.length - 1) / 2 * -1)

    }

    export function inRange(min: number, val: number, max: number): boolean {
      return min <= val && val <= max;
    }

    export function range<MIN extends number, MAX extends number, R extends intRange<MIN, MAX>>(min: MIN, max: MAX): Array<R> {
      return Array(max)
        .fill(min)
        .map((x, i) => (x + i) as R);
    };

    export type intRange<
      Min extends number = 0, 
      Max extends number = 1,
      List extends Array<unknown> = [],
      Result extends number = Min,
      Filled extends boolean = false,
      > = Filled extends true
          ? List extends { length: Max }
              ? Result | Max
              : List extends { length: infer I }
                  // @ts-ignore
                  ? intRange<Min, Max, [ unknown, ...List ], Result | I, Filled>
                  : never
          : List extends { length: Min }
              ? intRange<Min, Max, List, Result, true>
              : intRange<Min, Max, [ unknown, ...List ], Result, false>

  }

}
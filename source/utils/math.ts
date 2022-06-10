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

  }

}
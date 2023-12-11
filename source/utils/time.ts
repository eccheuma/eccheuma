export namespace time {

  export const MILLIS_PER_HOUR = 3600000;

  export const enum TIME_MEASURE {
    HOUR = 1,
    DAY = 24,
    WEEK = 168,
  };

  export function format(millis: number): Readonly<[ TIME_MEASURE, number ]> {

    let measure = TIME_MEASURE.HOUR;

    switch (true) {
      case MILLIS_PER_HOUR * TIME_MEASURE.WEEK <= millis:
        measure = TIME_MEASURE.WEEK; break;
      case MILLIS_PER_HOUR * TIME_MEASURE.DAY <= millis:
        measure = TIME_MEASURE.DAY; break;
    }

    return [ measure, Math.round(millis / (MILLIS_PER_HOUR * measure)) ];

  }

}
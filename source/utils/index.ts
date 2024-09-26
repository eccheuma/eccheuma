import { Hash } from "~/contracts/Nominals";
import { math } from "./math";

export type Result<R, E extends Error = Error> = R | E;

export type LocaleDate = Record<"Day" | "Time", string>

export namespace utils {

  export namespace object {

    export function getTypedKeys<GenObject extends object>(object: GenObject): Array<keyof GenObject> {
      return Object.keys(object) as Array<keyof GenObject>;
    }

    export function getTypedValues<GenObject extends object>(object: GenObject): Array<GenObject[keyof GenObject]> {
      return Object.values(object) as Array<GenObject[keyof GenObject]>;
    }

  }

  export namespace types {

    type listKeys<A extends Readonly<Array<Record<string, unknown>>>> = A extends Readonly<Array<Record<infer K, unknown>>> ? K : never

    export type nominal<Type, Key> = Type & { [Symbol.species]: Key }

    export type asIterableObject<Struct extends object> = { [index: string]: Struct };

    export type propertyListValue<
      A extends Readonly<Array<Record<string, unknown>>>,
      K extends listKeys<A> = listKeys<A>
    > = A extends Readonly<Array<infer O>>
      ? O extends Partial<Record<K, unknown>>
      ? O[K]
      : never
      : never

  }

  export namespace extension {

    // const regular = new RegExp('.+.(avif|png|jpe?g|webp)')

    export const enum error {
      extension = "requested format is not allowed",
      name = "bad file naming",
      size = "file size is too large",
      type = "file type is not allowed",
      unknown = "unknown error",
      dot = "dot",

    }

    export function define(filename: string, extensions: Array<string>): Result<string> {

      const splited = filename.split(".");

      switch (splited.length) {
        case 0:
          return new Error(error.name);
        case 1:
          return new Error(error.name);
        case 2:
          break;
        default:
          if (splited.length > 2) return Error(error.dot);
      }

      const [, ext] = splited.filter(x => x.length);

      if (!ext) return Error(error.name);

      return extensions.some(x => x === ext)
        ? ext
        : new Error(error.extension);

    }

  }

  export namespace string {

    const DEFAULT_MANGLE_KEY = [1, 3, 5, 7, 13, 21];

    export const enum MangleMode {
      DECODE,
      ENCODE,
    }

    export function mangle(str: string, mode: math.int.intRange<0, 1> = MangleMode.DECODE, key: Array<number> = DEFAULT_MANGLE_KEY): string {

      if (str.length === 0) return str;

      if (mode >= 2) throw Error("Wrong mode");

      const BASE = 700;

      return str.split("")
        .map(char => char.codePointAt(0) || 0)
        .map((code, i) => {

          const C = code + BASE;
          const S = key[i % key.length];

          switch (mode) {
            case MangleMode.DECODE: return String.fromCharCode(C + S);
            case MangleMode.ENCODE: return String.fromCharCode(C - S);
          }

        })
        .join("");

    }

  }
  export function getLocalTime(n = 0): LocaleDate {

    const Properties: Record<keyof LocaleDate, Intl.DateTimeFormatOptions> = {
      Day: { year: "numeric", month: "long", day: "numeric" },
      Time: { hour: "2-digit", minute: "2-digit" }
    };

    const DATA = {
      Day: Intl.DateTimeFormat("ru-RU", Properties.Day).format(n),
      Time: Intl.DateTimeFormat("ru-RU", Properties.Time).format(n)
    };

    return DATA;

  }

  export function randHashGenerator(length = 12): Hash {

    const randomChar = () => Math.floor(36 * Math.random()).toString(36);

    return Array<string>(length)
      .fill(String())
      .map(randomChar)
      .reduce((acc, cur) => {
        return acc + cur.toUpperCase();
      }, "") as Hash;

  }

  export function cutText(text: string, words = 45): string {

    return text
      .split(" ")
      .slice(0, words)
      .reduce((acc, cur) => `${acc} ${cur}`, String());

  }

  export function recursiveCompare<
    S extends object,
    M extends object,
  >(struct: S, mock: M): boolean {

    const structEnt = Object.entries(struct) as Array<[ keyof M, M[keyof M] ]>;

    return structEnt.every(([ key, value ]) => {

      // Pass validation if object have addition data
      if ( mock[key] !== undefined ) return true;

      if ( typeof value !== typeof mock[key] ) {
        console.log(key, typeof value, typeof mock[key]);
      }

      return typeof value === "object" && mock[key]
        ? recursiveCompare(value, mock[key])
        : typeof mock[key] === typeof value;
        
    });

  }

}
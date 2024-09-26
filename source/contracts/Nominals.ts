import { utils } from "~/utils";

export type Hash = utils.types.nominal<string,"__HASH__">;

export type Second = utils.types.nominal<number, "__SECOND__">
import {
  ref,
  get as firebaseGet,
  set as firebaseSet,
  remove as firebaseRemove,
  update as firebaseUpdate,
  orderByKey,
  orderByChild,
} from 'firebase/database';

import { onValue, onChildChanged } from 'firebase/database';
import { query, startAt, endAt, limitToFirst, orderByValue } from 'firebase/database';

import type { DatabaseReference, Query, QueryConstraint } from 'firebase/database';

// Utils
import { Result } from '~/utils';

export interface QueryParams<O extends database.order = database.order.NONE> extends database.QueryOrder<O> {
  mode: database.mode
  limit: O extends database.order.key ? string : number
  start: O extends database.order.key ? string : number
  end: O extends database.order.key ? string : number
  from: O extends database.order.key ? string : number
  to: O extends database.order.key ? string : number
}

// INNER FUNCTIONS
function defineQuery<O extends database.order>(ref: DatabaseReference, params?: Partial<QueryParams<O>>): Query {

  const QUERY = Array<QueryConstraint>();

  if (params?.order) {
    switch (params.order) {
      case database.order.key: QUERY.push(orderByKey()); break;
      case database.order.value: QUERY.push(orderByValue()); break;
      case database.order.child: {
        if (params.orderBy) QUERY.push(orderByChild(params.orderBy));
      }
    }
  }

  if (params?.start)
    QUERY.push(startAt(params.start));
  if (params?.end)
    QUERY.push(endAt(params.end));
  if (params?.limit)
    QUERY.push(limitToFirst(params.limit as number));

  return query(ref, ...QUERY);

}

function applyRoot(this: any, path: string, root = 'dep') {
  return `${root}/${path}`;
}

// MODULE NAMESPACE
export namespace database {

  export const enum order {
    NONE,
    key,
    value,
    child,
  }

  export interface QueryOrder<O extends database.order = order.NONE> {
    order: O
    orderBy: string
  }

  export const enum error {
    denied = 'PERMISSION_DENIED',
  }

  export const enum mode {
    child,
    whole,
  }

  /**
   * @param path Путь к данным в базе.
   * @param params Параметры запроса, будь то количество данных или их пложение.
   * @returns 
   */
  export async function get<T = object, O extends order = order.NONE>(path: string, params?: Partial<QueryParams<O>>): Promise<T> {

    const REF = ref(globalThis.firebaseDB, applyRoot(path));

    const query: Query = defineQuery(REF, params);

    return firebaseGet(query).then(snap => snap.val());

  }

  export function listen<
    C extends object,
    O extends order = order.NONE,
  >(path: string, callback: (value: C) => any, params?: Partial<QueryParams<O>>) {

    const REF = ref(globalThis.firebaseDB, applyRoot(path));

    let getQuery: Query = query(REF);

    if (params) getQuery = defineQuery(REF, params);

    switch (params?.mode) {
      case mode.child:
        onChildChanged(getQuery, snap => callback(snap.val())); break;
      default:
        onValue(getQuery, snap => callback(snap.val())); break;
    }

  }

  export async function getLength(path: string): Promise<number> {

    const Query: Query = query(ref(globalThis.firebaseDB, applyRoot(path)));

    return firebaseGet(Query).then(snap => snap.size);

  }

  export async function set<D extends object>(path: string, data: D): Promise<Result<boolean, Error>> {

    return firebaseSet(ref(globalThis.firebaseDB, applyRoot(path)), data)
      .then(() => true)
      .catch(() => new Error(error.denied));

  }

  export async function remove(path: string): Promise<Result<boolean, Error>> {

    return firebaseRemove(ref(globalThis.firebaseDB, applyRoot(path)))
      .then(() => true)
      .catch(() => new Error(error.denied));

  }

  export async function update<D extends object>(path: string, data: D): Promise<Result<boolean, Error>> {

    return firebaseUpdate(ref(globalThis.firebaseDB, applyRoot(path)), data)
      .then(() => true)
      .catch(() => new Error(error.denied));

  }

}

export namespace debug {

  function fmtMessage(name: string, key: string, values: Array<unknown>) {
    return `Method call: "${key}" method of ${name} with args: ${values}\n`;
  }

  export function derive(enable: boolean, debug: boolean = false): MethodDecorator {

    return function <T>(
      target  : object, 
      key     : string | symbol,
      desc    : TypedPropertyDescriptor<T>
    ) {

      if (!enable) return;

      const fn = target[String(key)];

      desc.value = function (this: typeof target, ...args: Array<unknown>) {

        // eslint-disable-next-line no-debugger
        if (debug) debugger;

        console.debug(fmtMessage(target.constructor.name, String(key), args));

        const result = fn.bind(this)(...args);

        console.debug(`Result of call: ${result}`);

        return result;

      } as typeof desc["value"];

    };
  }

}
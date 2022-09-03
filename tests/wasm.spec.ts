import { expect, test, describe } from 'vitest';
import { readFileSync } from 'fs';

const modules = {
  test: readFileSync('./source/wasm/compiled/module.wasm'),
  positionShift: readFileSync('./source/wasm/compiled/positionShift.wasm')
};

type ExportFuncTypes = {
  testModule  : (val: number, add: number, div: number) => number,
  posShift    : (width: number, pos: number) => number,
}


describe('wasm::modules', () => {

  test('module::test', async () => {

    const { instance } = await WebAssembly.instantiate(modules.test);

    const testModule = (instance.exports as ExportFuncTypes).testModule;

    expect(testModule(10,4,2)).toBe(7);

  });

  test('module::positionShift', async () => {

    const { instance } = await WebAssembly.instantiate(modules.positionShift);

    const posShift = (instance.exports as ExportFuncTypes).posShift;

    expect(posShift(1440,720))
      .toBe(0);

    expect(posShift(1440,1440))
      .toBe(1);
    expect(posShift(1440,0))
      .toBe(-1);

    expect(posShift(1440,1440))
      .toBe(1);
    expect(posShift(1440,0))
      .toBe(-1);

  });

});
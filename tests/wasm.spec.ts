import { expect, test, describe } from 'vitest';
import { readFileSync } from 'fs';

const WASMBuffer = readFileSync('./source/wasm/compiled/module.wasm');
const wasmInstance = WebAssembly.instantiate(WASMBuffer)

describe('wasm::modules', () => {

  test('module::test', async () => {

    const { instance } = await wasmInstance;

    expect((instance.exports as any).someTest(10,4,2)).toBe(7);

  })

})
import * as Abra from 'abra_wasm'

const _init = Abra.default

let _abraInitPromise: Promise<any> | null = null

function init() {
  if (_abraInitPromise) return _abraInitPromise

  _abraInitPromise = _init('abra_wasm/abra_wasm_bg.wasm')
  return _abraInitPromise
}

export async function typecheck(input: string): Promise<Abra.TypecheckResult | null> {
  await init()

  return Abra.typecheck(input)
}

export async function run(input: string): Promise<Abra.RunResult> {
  await init()

  return Abra.runAsync(input)
}

export async function disassemble(input: string): Promise<Abra.DisassembleResult | null> {
  await init()

  return Abra.disassemble(input)
}

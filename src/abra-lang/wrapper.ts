import * as Abra from '@kengorab/abra_wasm'

const _init = Abra.default

let _abraInitPromise: Promise<any> | null = null

function init() {
  if (_abraInitPromise) return _abraInitPromise

  _abraInitPromise = _init('abra_wasm/abra_wasm_bg.wasm')
  return _abraInitPromise
}

export async function typecheck(
  ...args: Parameters<typeof Abra.typecheck>
): Promise<Abra.TypecheckResult | null> {
  await init()

  return Abra.typecheck(...args)
}

export async function run(
  ...args: Parameters<typeof Abra.run>
): Promise<Abra.RunResult> {
  await init()

  return Abra.run(...args)
}

export async function disassemble(
  ...args: Parameters<typeof Abra.disassemble>
): Promise<Abra.DisassembleResult | null> {
  await init()

  return Abra.disassemble(...args)
}

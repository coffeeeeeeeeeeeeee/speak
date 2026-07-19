// ============================================================
// tiny-test.js
// Test-runner casero, sin dependencias: el proyecto es una página
// estática sin build step, así que los tests corren como módulos ES
// tal cual, en el navegador (ver run.sh). `test()` solo registra la
// función; `run()` las ejecuta todas y junta resultados.
// ============================================================

const tests = [];

export function test(name, fn) {
  tests.push({ name, fn });
}

export function assertEqual(actual, expected, msg) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a !== e) {
    throw new Error(`${msg ? msg + ": " : ""}esperado ${e}, obtuve ${a}`);
  }
}

export function assertTrue(cond, msg) {
  if (!cond) throw new Error(msg || "assertTrue falló");
}

export async function run() {
  const results = [];
  for (const { name, fn } of tests) {
    try {
      await fn();
      results.push({ name, pass: true });
    } catch (e) {
      results.push({ name, pass: false, error: e.message });
    }
  }
  return results;
}

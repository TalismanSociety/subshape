import { emptyDir } from "https://deno.land/std@0.161.0/fs/mod.ts"
import { build } from "https://deno.land/x/dnt@0.39.0/mod.ts"

await emptyDir("target/npm_pkg")

const description =
  "subShape provides primitives and patterns for crafting composable shapes featuring cohesive typing, validation, serialization, and reflection."

await build({
  entryPoints: [
    { name: ".", path: "mod.ts" },
    { name: "./scale", path: "scale.ts" },
  ],
  outDir: "target/npm_pkg",
  package: {
    name: "@talismn/subshape-fork",
    version: Deno.args[0]!,
    description,
    sideEffects: false,
    repository: "github:talismansociety/subshape",
  },
  shims: {
    deno: {
      test: true,
    },
  },
  compilerOptions: {
    sourceMap: true,
    target: "ES2022",
    lib: ["ES2022", "DOM"], // https://github.com/DefinitelyTyped/DefinitelyTyped/discussions/60038
  },
  test: false,
})

await Deno.copyFile("Readme.md", "target/npm_pkg/Readme.md")

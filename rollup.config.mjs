import eslint from "@rollup/plugin-eslint";
import resolve from "@rollup/plugin-node-resolve";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import typescript from "rollup-plugin-typescript2";
import commonjs from "@rollup/plugin-commonjs";

const packageJson = require("./package.json");

export default {
  input: "src/index.tsx",
  output: [
    {
      file: packageJson.main,
      format: "cjs",
      sourcemap: true,
    },
    {
      file: packageJson.module,
      sourcemap: true,
      format: "esm",
    },
  ],
  plugins: [
    peerDepsExternal({
      includeDependencies: true,
    }),
    resolve(),
    commonjs(),
    typescript({
      tsconfig: "tsconfig.json",
      useTsconfigDeclarationDir: true,
      clean: true,
    }),
    eslint({
      exclude: ["node_modules/**"],
      throwOnWarning: true,
      throwOnError: true,
    }),
  ],
};

import nextBase from "eslint-config-next";
import tseslint from "typescript-eslint";

const nextConfigs = Object.values(nextBase);

export default tseslint.config(
  ...nextConfigs,
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "dist/**",
      "build/**",
      "pnpm-lock.yaml",
      "tsconfig.tsbuildinfo",
    ],
  }
);

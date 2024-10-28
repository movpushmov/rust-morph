import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    outDir: resolve(__dirname, "dist"),
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "rust-morph",
      fileName: "index",
      formats: ["es", "cjs"],
    },
  },
  plugins: [
    dts({
      outDir: resolve(__dirname, "dist"),
      entryRoot: resolve(__dirname, "src"),
      staticImport: true,
      insertTypesEntry: true,
      rollupTypes: true,
    }),
  ],
});

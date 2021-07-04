import * as esbuild from "esbuild";

interface ImportMap {
  imports: {
    [key: string]: unknown;
  };
}

const isBare = (str: string) => {
  if (
    str.startsWith("/") || str.startsWith("./") || str.startsWith("../") ||
    str.substr(0, 7) === "http://" || str.substr(0, 8) === "https://"
  ) {
    return false;
  }
  return true;
};

const VALIDATION_CACHE = new Map();

export function load(importMap: ImportMap) {
  for (const [key, value] of Object.entries(importMap.imports)) {
    if (typeof value !== "string") {
      throw Error(
        `Value needs to be a string`,
      );
    }

    if (isBare(value)) {
      throw Error(
        `Import specifier can NOT be mapped to a bare import statement. Import specifier "${key}" is being wrongly mapped to "${value}"`,
      );
    }

    VALIDATION_CACHE.set(key, value);
  }
}

export function clear() {
  VALIDATION_CACHE.clear();
}

export function plugin() {
  return {
    name: "importMap",
    setup(build: esbuild.PluginBuild) {
      build.onResolve({ filter: /.*?/ }, (args: { path: string }) => {
        if (VALIDATION_CACHE.has(args.path)) {
          return {
            path: VALIDATION_CACHE.get(args.path),
            namespace: args.path,
            external: true,
          };
        }
        return {};
      });
    },
  };
}

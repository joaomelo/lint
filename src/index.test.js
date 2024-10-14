import { strict as assert } from "assert";
import { describe, test } from "node:test";
import { resolve } from "path";

import { config } from "./index.js";

describe("config function", () => {
  test("returns esLint config with default tsconfig path", () => {
    const result = config();
    assert.equal(typeof result, "object");
  });
  
  test("returns esLint config with custom tsconfig path", () => {
    const customTsconfigPath = resolve(process.cwd(), "tsconfig.custom.json");
  
    const result = config({ tsconfigPath: customTsconfigPath });
  
    const languageSettings = result.find(options => !!options?.languageOptions?.parserOptions);
    assert.ok(languageSettings.languageOptions.parserOptions.project.includes(customTsconfigPath));
  });  
});

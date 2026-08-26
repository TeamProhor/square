const fs = require("node:fs");
let text = fs.readFileSync("src/hooks/use-batch.ts", "utf8");
text = text.replace(/export function useCreateBatch\(\) \{[\s\S]*\}\n/, "");
fs.writeFileSync("src/hooks/use-batch.ts", text);

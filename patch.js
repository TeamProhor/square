const fs = require("node:fs");
let text = fs.readFileSync("src/lib/actions/admin-enrollments.ts", "utf8");
text = text.replace(
  'import { getSession } from "@/lib/auth-client";',
  'import { auth } from "@/lib/auth";',
);
text = text.replace(
  "const session = await getSession({",
  "const session = await auth.api.getSession({",
);
fs.writeFileSync("src/lib/actions/admin-enrollments.ts", text);

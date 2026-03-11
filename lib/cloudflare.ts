import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "@/db/schema";
import { invariant } from "@/lib/utils";

export function getDb() {
  const { env } = getCloudflareContext();

  invariant(env?.DB, "Cloudflare D1 binding `DB` is not configured.");
  return drizzle(env.DB, { schema });
}

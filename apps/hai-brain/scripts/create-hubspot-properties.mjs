/**
 * Create the hai-brain attribution properties on HubSpot contacts.
 *
 * HubSpot rejects an entire contact write with 400 PROPERTY_DOESNT_EXIST if any
 * single property is unknown, so these must exist before the attribution
 * payload can sync. Idempotent: skips anything already defined.
 *
 * Requires a private-app token with BOTH:
 *   crm.objects.contacts.write      (write contacts)
 *   crm.schemas.contacts.write      (create properties)  <-- often forgotten
 *
 * Usage:
 *   node scripts/create-hubspot-properties.mjs
 */
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(here, "../.env.local");

let token = process.env.HUBSPOT_ACCESS_TOKEN;
if (!token) {
  try {
    const env = readFileSync(envPath, "utf8");
    token = env.match(/^HUBSPOT_ACCESS_TOKEN=(.*)$/m)?.[1]?.trim();
  } catch {
    /* fall through to the error below */
  }
}
if (!token) {
  console.error(`No HUBSPOT_ACCESS_TOKEN. Set it in the environment or in ${envPath}`);
  process.exit(1);
}

const API = "https://api.hubapi.com";
const H = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

/** name, label, type, fieldType */
const WANTED = [
  ["first_touch_utm_source", "First Touch UTM Source", "string", "text"],
  ["first_touch_channel", "First Touch Channel", "string", "text"],
  ["last_touch_utm_source", "Last Touch UTM Source", "string", "text"],
  ["last_touch_utm_medium", "Last Touch UTM Medium", "string", "text"],
  ["last_touch_channel", "Last Touch Channel", "string", "text"],
  ["form_name", "Form Name", "string", "text"],
  ["pageview_count", "Pageview Count", "number", "number"],
  ["session_count", "Session Count", "number", "number"],
];

async function main() {
  const res = await fetch(`${API}/crm/v3/properties/contacts?archived=false`, { headers: H });
  if (!res.ok) {
    console.error(`Could not list properties: ${res.status} ${await res.text()}`);
    process.exit(1);
  }
  const existing = new Set((await res.json()).results.map((p) => p.name));
  console.log(`Portal defines ${existing.size} contact properties.\n`);

  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (const [name, label, type, fieldType] of WANTED) {
    if (existing.has(name)) {
      console.log(`  skip     ${name} (already exists)`);
      skipped++;
      continue;
    }
    const r = await fetch(`${API}/crm/v3/properties/contacts`, {
      method: "POST",
      headers: H,
      body: JSON.stringify({
        name,
        label,
        type,
        fieldType,
        groupName: "contactinformation",
        description: "Attribution field written by hai-brain.",
      }),
    });
    if (r.ok) {
      console.log(`  created  ${name}`);
      created++;
    } else {
      const body = await r.text();
      console.error(`  FAILED   ${name}: ${r.status} ${body.slice(0, 200)}`);
      if (r.status === 403) {
        console.error(
          "\n  403 = the token is missing the crm.schemas.contacts.write scope.\n" +
            "  Add it in HubSpot -> Settings -> Integrations -> Private Apps -> your app -> Scopes.",
        );
        break;
      }
      failed++;
    }
  }

  console.log(`\ncreated ${created}, skipped ${skipped}, failed ${failed}`);
  if (created > 0) {
    console.log("Re-run a lead submission to backfill attribution onto new contacts.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

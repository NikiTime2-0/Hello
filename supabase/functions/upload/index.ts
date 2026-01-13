import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceKey) {
    return jsonResponse({ error: "Missing Supabase env vars." }, 500);
  }

  const supabase = createClient(supabaseUrl, serviceKey);

  try {
    const payload = await req.json();
    const action = payload.action;
    const bucket = "upload";

    if (action === "sign") {
      const filename = String(payload.filename || "");
      const contentType = String(payload.contentType || "application/octet-stream");

      if (!filename) {
        return jsonResponse({ error: "Missing filename." }, 400);
      }

      const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
      const objectPath = `${Date.now()}_${crypto.randomUUID()}_${safeName}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUploadUrl(objectPath, { contentType });

      if (error || !data) {
        return jsonResponse({ error: "Failed to create signed URL." }, 500);
      }

      return jsonResponse({
        signedUrl: data.signedUrl,
        objectPath,
      });
    }

    if (action === "commit") {
      const objectPath = String(payload.objectPath || "");
      const meta = payload.meta || {};

      if (!objectPath) {
        return jsonResponse({ error: "Missing objectPath." }, 400);
      }

      const metaPath = `meta/${objectPath}.json`;
      const blob = new Blob([JSON.stringify(meta, null, 2)], {
        type: "application/json",
      });

      const { error } = await supabase.storage
        .from(bucket)
        .upload(metaPath, blob, { upsert: true, contentType: "application/json" });

      if (error) {
        return jsonResponse({ error: "Failed to store metadata." }, 500);
      }

      return jsonResponse({ ok: true });
    }

    return jsonResponse({ error: "Unknown action." }, 400);
  } catch {
    return jsonResponse({ error: "Invalid request." }, 400);
  }
});

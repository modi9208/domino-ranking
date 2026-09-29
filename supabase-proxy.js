const SUPABASE_URL = "https://ipubahmxarmkatzsxkle.supabase.co";
const SUPABASE_KEY = "sb_publishable_DOwFjqRhV2aMwzT3BSf5UQ_UOpaeBBd";

exports.handler = async function(event) {
  try {
    const qs = event.queryStringParameters || {};
    const path = qs.path;

    if (!path || !path.startsWith("/")) {
      return {
        statusCode: 400,
        headers: { "content-type": "application/json; charset=utf-8" },
        body: JSON.stringify({ error: "missing or invalid path" })
      };
    }

    const allowedPrefixes = ["/groups", "/players", "/matches", "/rpc/"];
    if (!allowedPrefixes.some(p => path.startsWith(p))) {
      return {
        statusCode: 403,
        headers: { "content-type": "application/json; charset=utf-8" },
        body: JSON.stringify({ error: "path not allowed" })
      };
    }

    const url = new URL(SUPABASE_URL + "/rest/v1" + path);
    for (const [k, v] of Object.entries(qs)) {
      if (k !== "path" && v !== undefined && v !== null) {
        url.searchParams.set(k, v);
      }
    }

    const headers = {
      "apikey": SUPABASE_KEY,
      "accept": "application/json"
    };

    const incomingContentType = event.headers["content-type"] || event.headers["Content-Type"];
    if (incomingContentType) headers["content-type"] = incomingContentType;

    const prefer = event.headers["prefer"] || event.headers["Prefer"];
    if (prefer) headers["prefer"] = prefer;

    const init = {
      method: event.httpMethod,
      headers
    };

    if (!["GET", "HEAD"].includes(event.httpMethod) && event.body) {
      init.body = event.body;
    }

    const response = await fetch(url.toString(), init);
    const body = await response.text();

    return {
      statusCode: response.status,
      headers: {
        "content-type": response.headers.get("content-type") || "application/json; charset=utf-8",
        "cache-control": "no-store"
      },
      body
    };
  } catch (err) {
    return {
      statusCode: 502,
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        error: "netlify function could not reach supabase",
        details: err && err.message ? err.message : String(err)
      })
    };
  }
};

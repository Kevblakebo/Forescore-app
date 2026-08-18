// Vercel serverless function - runs server-side only, same pattern as
// api/course-search.js. Keeps the Resend API key out of the browser
// bundle: the app calls THIS endpoint, and this function is the only
// thing that ever sees the real key (read from an env var with no
// VITE_ prefix, so Vite never exposes it to client code).
//
// Requires one Vercel env var: RESEND_API_KEY.
// Also requires FEEDBACK_TO_EMAIL (the address that should receive
// feedback submissions) - set this alongside the API key.

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function renderAnswer(label, value) {
  if (value === null || value === undefined || value === "") return "";
  return `<p style="margin:0 0 10px;"><b>${escapeHtml(label)}:</b><br/>${escapeHtml(String(value))}</p>`;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.FEEDBACK_TO_EMAIL;
  if (!apiKey) {
    return res.status(500).json({ error: "Server is missing RESEND_API_KEY" });
  }
  if (!toEmail) {
    return res.status(500).json({ error: "Server is missing FEEDBACK_TO_EMAIL" });
  }

  let body;
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  } catch (e) {
    return res.status(400).json({ error: "Invalid request body" });
  }
  if (!body || typeof body !== "object") {
    return res.status(400).json({ error: "Invalid request body" });
  }

  const {
    setupMethod, setupEase, setupFriction, formats, scoringEase, confusion,
    features, dataTrust, dataTrustDetail, wishlist, npsScore, submittedAt,
  } = body;

  const featureLines = features && typeof features === "object"
    ? Object.entries(features).map(([k, v]) => `${k}: ${v === "not used" ? "haven't used it" : v + " / 5"}`).join("<br/>")
    : "";

  const html = `
    <div style="font-family: -apple-system, sans-serif; max-width: 560px;">
      <h2 style="color:#1B4332;">New Foresa Golf feedback</h2>
      <p style="color:#6b6b63; font-size:13px;">Submitted ${escapeHtml(submittedAt || "")}</p>
      <hr style="border:none; border-top:1px solid #e4ded0; margin:16px 0;" />
      ${renderAnswer("How they set up their round", setupMethod)}
      ${renderAnswer("Setup ease (1-5)", setupEase)}
      ${renderAnswer("What almost stopped setup", setupFriction)}
      ${renderAnswer("Formats played", Array.isArray(formats) ? formats.join(", ") : formats)}
      ${renderAnswer("Scoring ease (1-5)", scoringEase)}
      ${renderAnswer("Confusing / broken things", confusion)}
      ${featureLines ? `<p style="margin:0 0 10px;"><b>Feature ratings:</b><br/>${featureLines}</p>` : ""}
      ${renderAnswer("Data/sync worries?", dataTrust)}
      ${renderAnswer("Data/sync worry details", dataTrustDetail)}
      ${renderAnswer("Magic wand wish", wishlist)}
      ${renderAnswer("Likely to return (0-10)", npsScore)}
    </div>
  `;

  try {
    const upstream = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Foresa Golf Feedback <onboarding@resend.dev>",
        to: [toEmail],
        subject: "New Foresa Golf feedback response",
        html,
      }),
    });

    if (!upstream.ok) {
      const errText = await upstream.text().catch(() => "");
      return res.status(upstream.status).json({ error: `Email service returned ${upstream.status}: ${errText}` });
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: e.message || "Failed to send email" });
  }
}

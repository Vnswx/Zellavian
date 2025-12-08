import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

// -----------------------------------------------------------------------------------
// IMPORTANT NOTE:
// Your ACCESS TOKEN is taken from the environment variable
// Never EVER enter tokens directly into the code
// -----------------------------------------------------------------------------------

const TOKEN = process.env.GITHUB_TOKEN;

if (!TOKEN) {
  console.warn("WARNING: GITHUB_TOKEN belum di-set di environment");
}

// ===================================================================================
// API: /api/top-langs
// ===================================================================================
app.get("/api/top-langs", async (req, res) => {
  const username = req.query.username;

  if (!username) {
    return res.status(400).json({ error: "username is required" });
  }

  try {
    const repos = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&type=all`, {
      headers: {
        Authorization: `token ${TOKEN}`
      }
    }).then(r => r.json());

    if (!Array.isArray(repos)) {
      return res.status(500).json({ error: "Failed fetching repositories" });
    }

    let languageStats = {};

    for (const repo of repos) {
      const langs = await fetch(repo.languages_url, {
        headers: { Authorization: `token ${TOKEN}` }
      }).then(r => r.json());

      for (const [lang, bytes] of Object.entries(langs)) {
        languageStats[lang] = (languageStats[lang] || 0) + bytes;
      }
    }

    // Sort
    const sorted = Object.entries(languageStats)
      .sort((a, b) => b[1] - a[1])
      .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});

    res.json({
      username,
      languages: sorted
    });

  } catch (err) {
    res.status(500).json({ error: "Internal error", details: err.message });
  }
});

// Default
app.get("/", (_, res) => {
  res.send("GitHub Stats Private API is running");
});

app.listen(3000, () => console.log("Server running"));

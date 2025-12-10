import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import { generateLangCard } from "./svg.js";

const app = express();
app.use(cors());

const TOKEN = process.env.GITHUB_TOKEN;

if (!TOKEN) {
  console.warn("WARNING: GITHUB_TOKEN is not defined!");
}

app.get("/api/top-langs", async (req, res) => {
  const username = req.query.username;
  const token = req.query.token;
  const theme = req.query.theme || "radical";

  if (!username) {
    return res.status(400).send("username is required");
  }

  const headers = token ? { Authorization: `token ${token}` } : {};

  try {
    const repos = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&type=all`,
      { headers }
    ).then((r) => r.json());

    let languageStats = {};

    for (const repo of repos) {
      const langs = await fetch(repo.languages_url, { headers }).then((r) =>
        r.json()
      );

      for (const [lang, bytes] of Object.entries(langs)) {
        languageStats[lang] = (languageStats[lang] || 0) + bytes;
      }
    }

    const top4 = Object.entries(languageStats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);

    const top4Object = Object.fromEntries(top4);

    const svg = await generateLangCard({ languages: top4Object }, theme);

    res.setHeader("Content-Type", "image/svg+xml");
    return res.send(svg);
  } catch (err) {
    return res.status(500).send("Something went wrong: " + err.message);
  }
});

app.get("/", (_, res) => {
  res.send("GitHub Stats API is running");
});

// IMPORTANT: Vercel must receive this
export default app;

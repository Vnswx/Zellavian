import fetch from "node-fetch";
import { generateLangCard } from "./svg.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).send("Method Not Allowed");
  }

  const { username, token, theme = "radical" } = req.query;

  if (!username) {
    return res.status(400).send("username is required");
  }

  const headers = token ? { Authorization: `token ${token}` } : {};

  try {
    const repos = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&type=all`,
      { headers }
    ).then(r => r.json());

    let languageStats = {};

    for (const repo of repos) {
      const langs = await fetch(repo.languages_url, { headers }).then(r =>
        r.json()
      );

      for (const [lang, bytes] of Object.entries(langs)) {
        languageStats[lang] = (languageStats[lang] || 0) + bytes;
      }
    }

    const top4 = Object.entries(languageStats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);

    const svg = await generateLangCard(
      { languages: Object.fromEntries(top4) },
      theme
    );

    res.setHeader("Content-Type", "image/svg+xml");
    return res.send(svg);
  } catch (err) {
    return res.status(500).send("Error: " + err.message);
  }
}

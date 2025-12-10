import { generateLangCard } from "./svg.js";
import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.url.startsWith("/api/top-langs")) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const username = url.searchParams.get("username");

    if (!username) return res.status(400).send("username is required");

    const repos = await fetch(`https://api.github.com/users/${username}/repos`)
      .then(r => r.json());

    let stats = {};

    for (const repo of repos) {
      const lang = await fetch(repo.languages_url).then(r => r.json());
      for (const [key, bytes] of Object.entries(lang)) {
        stats[key] = (stats[key] || 0) + bytes;
      }
    }

    const top4 = Object.entries(stats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);

    const svg = await generateLangCard(Object.fromEntries(top4));

    res.setHeader("Content-Type", "image/svg+xml");
    return res.send(svg);
  }

  res.send("API running");
}

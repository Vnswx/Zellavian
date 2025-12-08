import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import { generateLangCard } from "./svg.js";

const app = express();
app.use(cors());


// -----------------------------------------------------------------------------------
// IMPORTANT NOTE:
// Your ACCESS TOKEN is taken from the environment variable
// Never EVER enter tokens directly into the code
// -----------------------------------------------------------------------------------

const TOKEN = process.env.GITHUB_TOKEN;

if (!TOKEN) {
  console.warn("WARNING: GITHUB_TOKEN is not Devined!");
}

// ===================================================================================
// API: /api/top-langs
// ===================================================================================
app.get("/api/top-langs", async (req, res) => {
    const username = req.query.username;
    const theme = req.query.theme || "radical";
  
    if (!username) {
      return res.status(400).send("username is required");
    }
  
    try {
      const repos = await fetch(
        `https://api.github.com/users/${username}/repos?per_page=100&type=all`,
        { headers: { Authorization: `token ${TOKEN}` } }
      ).then(r => r.json());
  
      let languageStats = {};
  
      for (const repo of repos) {
        const langs = await fetch(repo.languages_url, {
          headers: { Authorization: `token ${TOKEN}` }
        }).then(r => r.json());
  
        for (const [lang, bytes] of Object.entries(langs)) {
          languageStats[lang] = (languageStats[lang] || 0) + bytes;
        }
      }
  
      const svg = generateLangCard({ languages: languageStats }, theme);
  
      res.setHeader("Content-Type", "image/svg+xml");
      return res.send(svg);
  
    } catch (err) {
      return res.status(500).send("Something went wrong: " + err.message);
    }
  });

// Default
app.get("/", (_, res) => {
  res.send("GitHub Stats Private API is running");
});

app.listen(3000, () => console.log("Server running"));

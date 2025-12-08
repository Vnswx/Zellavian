import fs from "fs";
import path from "path";

export async function generateLangCard(data, theme = "radical") {
  const themes = {
    radical: { bg: "#141321", text: "#ffffff", title: "#fe428e" },
    dark: { bg: "#0d1117", text: "#c9d1d9", title: "#58a6ff" }
  };

  const t = themes[theme] || themes.radical;

  const cyberPath = path.join(process.cwd(), "public", "img", "cyber1.png");
  const gothPath = path.join(process.cwd(), "public", "img", "goth1.png");
  const thornsPath = path.join(process.cwd(), "public", "img", "thorns2.png");

  const cyberImg = fs.readFileSync(cyberPath).toString("base64");
  const gothImg = fs.readFileSync(gothPath).toString("base64");
  const thornsImg = fs.readFileSync(thornsPath).toString("base64");

  const jacquardPath = path.join(process.cwd(), "public", "fonts", "Jacquard12-Regular.woff");
  const pixelifyPath = path.join(process.cwd(), "public", "fonts", "PixelifySans.woff");

  const jacquardFont = fs.readFileSync(jacquardPath).toString("base64");
  const pixelifyFont = fs.readFileSync(pixelifyPath).toString("base64");

  const langs = Object.entries(data.languages);
  const total = langs.reduce((sum, [, bytes]) => sum + bytes, 0);

  const langData = langs
    .map(([lang, bytes]) => ({
      lang,
      percent: (bytes / total) * 100,
    }))
    .sort((a, b) => b.percent - a.percent);

  const thornColors = ["#575757", "#948979", "#053B15", "#A27B5C", "#575757"];
  langData.forEach((item, i) => item.color = thornColors[i % thornColors.length]);

  const RADIUS = 45;
  const STROKE = 5;
  const totalThorns = langData.length;

  const circleSVG = `
    <g transform="translate(70, 105)">
      ${langData.map((item, i) => {
    const startAngle = (360 / totalThorns) * i;
    const endAngle = startAngle + (360 / totalThorns);

    const toRad = (deg) => (deg - 90) * (Math.PI / 180);

    const x1 = RADIUS * Math.cos(toRad(startAngle));
    const y1 = RADIUS * Math.sin(toRad(startAngle));
    const x2 = RADIUS * Math.cos(toRad(endAngle));
    const y2 = RADIUS * Math.sin(toRad(endAngle));

    return `
          <path
            d="M ${x1} ${y1} A ${RADIUS} ${RADIUS} 0 0 1 ${x2} ${y2}"
            stroke="${item.color}"
            stroke-width="${STROKE}"
            fill="none"
            stroke-linecap="round"
          />
        `;
  }).join("")}
    </g>
  `;

  const labels = langData.map((item, i) => `
    <rect x="252" y="${62 + i * 26}" width="10" height="10" fill="${item.color}" rx="4"></rect>
    <text x="270" y="${71 + i * 26}" font-size="12" fill="#B7B2B2" style="font-family: 'Pixelify Sans';">
      ${item.lang}
    </text>
  `).join("");

  const height = 80 + langData.length * 30;

  return `
    <svg width="400" height="${height}" xmlns="http://www.w3.org/2000/svg">

      <style>
        @font-face {
          font-family: "Jacquard 12";
          src: url(data:font/woff;base64,${jacquardFont}) format("woff");
        }
        @font-face {
          font-family: "Pixelify Sans";
          src: url(data:font/woff;base64,${pixelifyFont}) format("woff");
        }
      </style>

      <rect width="100%" height="100%" fill="#D9D9D9" rx="15"></rect>

      <image x="70" href="data:image/png;base64,${cyberImg}" width="221"/>
      <text x="105" y="35" font-size="25" fill="#464545" style="font-family: 'Jacquard 12';">
        Language Used
      </text>

      ${circleSVG}

      <image x="-5" y="30" href="data:image/png;base64,${thornsImg}" width="150"/>
      ${labels}
      <image x="330" y="120" href="data:image/png;base64,${gothImg}" width="80"/>
    </svg>
  `;
}

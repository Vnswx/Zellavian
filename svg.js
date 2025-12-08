// Tidak perlu fs lagi
window.generateLangCard = async function (data, theme = "radical") {
  const themes = {
    radical: { bg: "#141321", text: "#ffffff", title: "#fe428e" },
    dark: { bg: "#0d1117", text: "#c9d1d9", title: "#58a6ff" }
  };

  const t = themes[theme] || themes.radical;

  // --- FETCH WOFF FONTS FROM PUBLIC URL ---
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "";
  
  const jacquardBuffer = await fetch(`${baseURL}/fonts/Jacquard12-Regular.woff`)
    .then((res) => res.arrayBuffer());

  const pixelifyBuffer = await fetch(`${baseURL}/fonts/PixelifySans.woff`)
    .then((res) => res.arrayBuffer());

  const jacquardFont = Buffer.from(jacquardBuffer).toString("base64");
  const pixelifyFont = Buffer.from(pixelifyBuffer).toString("base64");

  // ------------------- LANGUAGE DATA -------------------
  const langs = Object.entries(data.languages);
  const total = langs.reduce((sum, [, bytes]) => sum + bytes, 0);

  const langData = langs
    .map(([lang, bytes]) => ({
      lang,
      percent: (bytes / total) * 100,
    }))
    .sort((a, b) => b.percent - a.percent);

  const thornColors = ["#575757", "#948979", "#053B15", "#A27B5C", "#575757"];
  langData.forEach((item, i) => (item.color = thornColors[i % thornColors.length]));

  const totalThorns = langData.length;

  const RADIUS = 45;
  const STROKE = 5;

  const circleSVG = `
    <g id="circle-segments" transform="translate(70, 105)">
      ${langData
        .map((item, i) => {
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
        })
        .join("")}
    </g>
  `;

  const labels = langData
    .map(
      (item, i) => `
      <rect x="252" y="${62 + i * 26}" width="10" height="10" fill="${item.color}" rx="4"></rect>
      <text x="270" y="${71 + i * 26}" font-size="12" fill="#B7B2B2" style="font-family: 'Pixelify Sans';">
        ${item.lang}
      </text>
    `
    )
    .join("");

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

      <image x="70" href="public/img/cyber1.png" width="221" preserveAspectRatio="none"/>
      <text x="105" y="35" font-size="25" fill="#464545" style="font-family: 'Jacquard 12';">
        Language Used
      </text>

      ${circleSVG}

      <image x="-5" y="30" href="public/img/thorns2.png" width="150" preserveAspectRatio="none"/>
      ${labels}
      <image x="330" y="120" href="public/img/goth1.png" width="80" preserveAspectRatio="none"/>
    </svg>
  `;
};

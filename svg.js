export function generateLangCard(data, theme = "radical") {
    const themes = {
      radical: { bg: "#141321", text: "#ffffff", title: "#fe428e" },
      dark: { bg: "#0d1117", text: "#c9d1d9", title: "#58a6ff" }
    };
  
    const t = themes[theme] || themes.radical;
  
    // Konversi object → array
    const langs = Object.entries(data.languages);
  
    // Total bytes
    const total = langs.reduce((sum, [, bytes]) => sum + bytes, 0);
  
    // Hitung persen + sort
    const langData = langs
      .map(([lang, bytes]) => ({
        lang,
        percent: (bytes / total) * 100,
      }))
      .sort((a, b) => b.percent - a.percent);
  
    // Warna duri
    const thornColors = [
      "#575757",
      "#948979",
      "#053B15",
      "#A27B5C",
      "#575757"
    ];
  
    langData.forEach((item, i) => {
      item.color = thornColors[i % thornColors.length];
    });
  
    // =============================
    //    DYNAMIC THORN GENERATOR
    // =============================
  
    // GANTI path ini dengan path SVG asli dari Figma!
    const basePath = "M100 10 C 140 20, 160 60, 120 100 C 80 140, 40 120, 30 80 Z";
  
    const totalThorns = langData.length;
    const rotationStep = 360 / totalThorns;
  
    const thornSVG = `
      <g id="thorns" opacity="0.85" transform="translate(20, 55)">
        ${langData.map((item, i) => `
          <path
            d="${basePath}"
            fill="none"
            stroke="${item.color}"
            stroke-width="10"
            stroke-linecap="round"
            transform="rotate(${i * rotationStep} 100 80)"
          />
        `).join("")}
      </g>
    `;
  
    // =============================
    //        LABELS
    // =============================
    const labels = langData.map((item, i) => `
      <rect x="230" y="${60 + i * 26}" width="14" height="14" fill="${item.color}" rx="3"/>
      <text x="250" y="${71 + i * 26}" font-size="15" fill="${t.text}">
        ${item.lang}
      </text>
    `).join("");
  
    const height = 80 + langData.length * 30;
  
    return `
      <svg width="420" height="${height}" xmlns="http://www.w3.org/2000/svg">
        
        <rect width="100%" height="100%" fill="${t.bg}" rx="15" />
  
        <text x="25" y="35" font-size="22" fill="${t.title}" font-weight="bold"
          style="font-family: 'Jacquard 12';">
          Most Used Languages
        </text>
  
        ${thornSVG}
  
        ${labels}
  
      </svg>
    `;
  }
  
export function generateLangCard(data, theme = "radical") {
    const themes = {
      radical: { bg: "#141321", text: "#ffffff", title: "#fe428e" },
      dark: { bg: "#0d1117", text: "#c9d1d9", title: "#58a6ff" }
    };
  
    const t = themes[theme] || themes.radical;
  
    const langs = Object.entries(data.languages);
    const total = langs.reduce((s, [, b]) => s + b, 0);
  
    const langData = langs
      .map(([lang, bytes]) => ({
        lang,
        percent: (bytes / total) * 100,
      }))
      .sort((a, b) => b.percent - a.percent);
  
    const thornColors = ["#575757", "#948979", "#053B15", "#A27B5C", "#575757"];
    langData.forEach((item, i) => (item.color = thornColors[i % thornColors.length]));
  
    // BASEPATH FIGMA (jangan diubah)
    const basePath = `M52 37C54 39 54 39 54.125 42.125C54.0837 43.0738 ...`; // dipotong agar singkat
    const totalThorns = langData.length;
    const rotationStep = 360 / totalThorns;
  
    const thornSVG = `
      <g id="thorns" opacity="0.85" transform="translate(20, 55)">
        ${langData
          .map(
            (item, i) => `
          <path
            d="${basePath}"
            fill="none"
            stroke="${item.color}"
            stroke-width="10"
            stroke-linecap="round"
            transform="rotate(${i * rotationStep} 100 80)"
          />
        `
          )
          .join("")}
      </g>
    `;
  
    const labels = langData
      .map(
        (item, i) => `
        <rect x="230" y="${60 + i * 26}" width="14" height="14" fill="${item.color}" rx="3"/>
        <text x="250" y="${71 + i * 26}" font-size="15" fill="${t.text}">
          ${item.lang}
        </text>`
      )
      .join("");
  
    const height = 180 + langData.length * 30;
  
    return `
      <svg width="450" height="${height}" xmlns="http://www.w3.org/2000/svg">
        
        <defs>
          <pattern id="pattern0_3_26" patternUnits="objectBoundingBox" width="1" height="1">
            <image href="public/img/cyber1.png" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
          </pattern>
  
          <pattern id="pattern1_3_26" patternUnits="objectBoundingBox" width="1" height="1">
            <image href="public/img/goth1.png" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
          </pattern>
        </defs>
  
        <rect width="100%" height="100%" fill="${t.bg}" rx="15" />
  
        <!-- TITLE -->
        <text x="25" y="35" font-size="22" fill="${t.title}" font-weight="bold"
          style="font-family: 'Jacquard 12';">
          Most Used Languages
        </text>
  
        <!-- LAYOUT SESUAI FIGMA -->
        <g transform="translate(25, 60)">
          <g id="Group1">
            <rect width="292" height="142" rx="2" fill="#D9D9D9"/>
            <path d="M236.91 75.1588H299V140.517H236.91V75.1588Z" fill="url(#pattern0_3_26)"/>
          </g>
  
          <rect x="54" width="151" height="142" fill="url(#pattern1_3_26)"/>
        </g>
  
        ${thornSVG}
  
        ${labels}
  
      </svg>
    `;
  }
  
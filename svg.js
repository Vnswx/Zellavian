export function generateLangCard(data, theme = "radical") {
    const themes = {
      radical: {
        bg: "#141321",
        text: "#ffffff",
        title: "#fe428e",
      },
      dark: {
        bg: "#0d1117",
        text: "#c9d1d9",
        title: "#58a6ff",
      }
    };
  
    const t = themes[theme] || themes.radical;
  
    // Convert object => array
    const langs = Object.entries(data.languages);
  
    // Total bytes
    const total = langs.reduce((sum, [, bytes]) => sum + bytes, 0);
  
    // Convert to %
    const langData = langs
      .map(([lang, bytes]) => ({
        lang,
        percent: ((bytes / total) * 100),
      }))
      .sort((a, b) => b.percent - a.percent);
  
    // Colors (tema radical)
    const colors = [
      "#ff6e96", "#f7768e", "#7aa2f7", "#bb9af7",
      "#9ece6a", "#e0af68", "#cfc9c2", "#ad8ee6"
    ];
  
    langData.forEach((l, i) => (l.color = colors[i % colors.length]));
  
    // Donut chart config
    const radius = 80;
    const cx = 120;
    const cy = 130;
    const circumference = 2 * Math.PI * radius;
  
    let offset = 0;
    const arcs = langData.map(item => {
      const dash = (item.percent / 100) * circumference;
  
      const arc = `
        <circle 
          cx="${cx}" cy="${cy}" r="${radius}"
          fill="transparent"
          stroke="${item.color}"
          stroke-width="22"
          stroke-dasharray="${dash} ${circumference}"
          stroke-dashoffset="${-offset}"
          stroke-linecap="round"
        />
      `;
      offset += dash;
      return arc;
    }).join("");
  
    // Labels (right side)
    const labels = langData.map((item, i) => `
      <rect x="240" y="${50 + i * 28}" width="14" height="14" fill="${item.color}" rx="3"/>
      <text x="260" y="${62 + i * 28}" fill="${t.text}" font-size="14">
        ${item.lang} (${item.percent.toFixed(1)}%)
      </text>
    `).join("");
  
    const height = 60 + langData.length * 30;
  
    return `
      <svg width="420" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${t.bg}" rx="15" />
  
        <text x="25" y="35" font-size="20" fill="${t.title}" font-weight="bold">
          Language Usage (Donut)
        </text>
  
        ${arcs}
  
        <circle cx="${cx}" cy="${cy}" r="${radius - 30}" fill="${t.bg}" />
  
        ${labels}
      </svg>
    `;
  }
  
export function generateLangCard(data, theme = "radical") {
    const themes = {
      radical: {
        bg: "#141321",
        text: "#ffffff",
        title: "#fe428e",
        bar: "#fe428e"
      },
      dark: {
        bg: "#0d1117",
        text: "#c9d1d9",
        title: "#58a6ff",
        bar: "#58a6ff"
      }
    };
  
    const t = themes[theme] || themes.radical;
  
    const langs = Object.entries(data.languages);
    const total = langs.reduce((sum, [, bytes]) => sum + bytes, 0);
  
    const rows = langs
      .slice(0, 8)
      .map(([lang, bytes], i) => {
        const percent = ((bytes / total) * 100).toFixed(1);
  
        return `
          <g transform="translate(0, ${i * 25})">
            <text x="10" y="15" fill="${t.text}" font-size="12">${lang} — ${percent}%</text>
            <rect x="120" y="8" width="${percent * 1.5}" height="8" fill="${t.bar}" rx="4" />
          </g>
        `;
      })
      .join("");
  
    const height = 40 + langs.length * 25;
  
    return `
      <svg width="350" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${t.bg}" rx="10" />
        <text x="20" y="30" fill="${t.title}" font-size="18" font-weight="bold">
          Most Used Languages
        </text>
  
        <g transform="translate(20, 50)">
          ${rows}
        </g>
      </svg>
    `;
  }
  
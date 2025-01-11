// 23h18: drew in book

import * as d3 from "npm:d3";

function writeFile(fileName : string, content : string) {
  const currentFile = import.meta.url;
  const currentDir = new URL('.', currentFile).pathname;
  try {
    Deno.writeTextFileSync(`${currentDir}${fileName}`, content);
    console.log(`${fileName} created successfully!`);
  } catch (error) {
    console.error(`Error writing ${fileName}`, error);
  }
}

const now = new Date();
const formatDay = d3.timeFormat("%Y_%m_%d");
const dayStr = formatDay(now);
console.log('today', formatDay(now));

const mdName = `${dayStr}.md`;
const formatTime = d3.timeFormat("%Hh%M");
const nowStr = formatTime(now);
const mdContent = `${nowStr}:\nDrew in book`;

writeFile(mdName, mdContent)

const svgName = `${dayStr}.svg`
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg">

  <defs>
    <g id="flag">
      <rect x="0" y="50%" width="100%" height="50%" class="earth"/>
      <rect x="0" y="0" width="100%" height="50%" class="sky"/>
      <circle cx="50%" cy="50%" r="20%" class="sun"/>
    </g>

    <clipPath id="clipRect">
        <rect x="10%" y="50%" width="20%" height="20%" transform-origin="15% 50%" transform="rotate(-60)"/>
        <rect x="30%" y="50%" width="20%" height="20%" transform-origin="35% 50%" transform="rotate(-60)"/>
        <rect x="50%" y="50%" width="20%" height="20%" transform-origin="55% 50%" transform="rotate(-60)"/>
    </clipPath>
  </defs>

  <style>
    .sky { fill: var(--sky, black); }
    .earth { fill: var(--earth, red); }
    .sun { fill: var(--sun, yellow); }
  </style>

  <use href="#flag" clip-path="url(#clipRect)"/>
  

</svg>
`

writeFile(svgName, svgContent);
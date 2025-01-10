import * as d3 from "npm:d3";

const currentFile = import.meta.url;
console.log('current file', currentFile);
const currentDir = new URL('.', import.meta.url).pathname;
console.log('current dir', currentDir);

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg">

  <defs>
    <g id="flag">
      <rect x="0" y="50%" width="100%" height="50%" class="earth"/>
      <rect x="0" y="0" width="100%" height="50%" class="sky"/>
      <circle cx="50%" cy="50%" r="20%" class="sun"/>
    </g>

    <clipPath id="clipRect">
        <rect x="10%" y="10%" width="20%" height="20%"/>
        <rect x="30%" y="30%" width="20%" height="20%"/>
        <rect x="50%" y="50%" width="20%" height="20%"/>
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

const now = new Date();
const todayStart = d3.timeDay.floor(now);
const yesterdayStart = d3.timeDay.offset(todayStart, -1);

const formatDay = d3.timeFormat("%Y_%m_%d");
const dayStr = formatDay(todayStart);
const yesterdayStr = formatDay(yesterdayStart);



try {
  Deno.writeTextFileSync(`${currentDir}${dayStr}.svg`, svgContent);
  console.log('SVG file created successfully!');
  console.log('Was there an svg file yesterday and can I copy it?');
  console.log('today', dayStr, 'yesterday', yesterdayStr);
} catch (error) {
  console.error('Error writing SVG file', error);
}
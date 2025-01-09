
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
        <rect x="25%" y="25%" width="50%" height="50%" transform-origin="50% 50%" transform="rotate(110) scale(0.8)">
        </rect>
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


try {
  Deno.writeTextFileSync(`${currentDir}2025_01_09.svg`, svgContent);
  console.log('SVG file created successfully!');
} catch (error) {
  console.error('Error writing SVG file', error);
}
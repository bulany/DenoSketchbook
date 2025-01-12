// 11h30: drew in book
import * as d3 from "npm:d3";
import { JSDOM } from "npm:jsdom";

const dom = new JSDOM('<!DOCTYPE html><html></html><body></body></html>');
const document = dom.window.document;

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

const dayStart = d3.timeDay.floor(now);
const dayStop = d3.timeDay.offset(dayStart, 1);
const hours = d3.timeHour.range(dayStart, dayStop);
hours.push(dayStop);
const hours6 = d3.timeHour.every(6).range(dayStart, dayStop);
hours6.push(dayStop);

const xScale = d3.scaleLinear([dayStart, dayStop], [2, 98]);
const xPc = (x : Date) => xScale(x) + '%';

const formatHour = d3.timeFormat("%H");

const svgName = `${dayStr}.svg`
const svg = d3.select(document.body)
  .append('svg')
  .attr('xmlns', "http://www.w3.org/2000/svg");

hours6.forEach((hour : Date) => {
  const hourStr = formatHour(hour);
  svg.append('text')
  .attr('x', xPc(hour))
  .attr('y', '50%')
  .text(hourStr);
})

svg.append('circle')
  .attr('r', '2%')
  .attr('cx', xPc(now))
  .attr('cy', '40%')
  .attr('fill', 'red')


const svgContent = document.body.innerHTML;

writeFile(svgName, svgContent);
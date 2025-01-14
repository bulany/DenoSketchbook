// 16h23: drew in book
// didn't write an md file!
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
const data = hours.map((hour : Date, i : number) => {
  return {
    time: hour,
    text: i % 3 == 0 ? hour.getHours() + '' : null
  }
});
data[data.length-1].text = '24';

const xScale = d3.scaleLinear([dayStart, dayStop], [4, 96]);
const xPc = (x : Date) => xScale(x) + '%';

const svgName = `${dayStr}.svg`
const svg = d3.select(document.body)
  .append('svg')
  .attr('xmlns', "http://www.w3.org/2000/svg");

svg.append('style').text('text { font-family: sans-serif; }')

data.forEach( d => {
  if (d.text) {
    svg.append('text')
    .attr('x', xPc(d.time))
    .attr('y', '50%')
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .text(d.text);
  }
})

svg.append('circle')
  .attr('r', '2%')
  .attr('cx', xPc(now))
  .attr('cy', '40%')
  .attr('fill', 'red')


const svgContent = document.body.innerHTML;

writeFile(svgName, svgContent);
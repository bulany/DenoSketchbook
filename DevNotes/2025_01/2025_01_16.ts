// 15h29: drew in book
// Font sizes
// Would be great to format the svg
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
    i: i,
    time: hour,
    text: i % 3 == 0 ? hour.getHours() + '' : null
  }
});
data[data.length-1].text = '24';

const xScale = d3.scaleLinear([dayStart, dayStop], [4, 96]);
const px = d => `${d}px`;
const pc = d => `${d}pc`;
const xPc = (d : Date) => pc(xScale(d));
const wPc = (d1 : Date, d2 : Date) => pc(xScale(d2) - xScale(d1));

const svgName = `${dayStr}.svg`
const svg = d3.select(document.body)
  .append('svg')
  .attr('xmlns', "http://www.w3.org/2000/svg");

const fontSize = 16;

svg.append('style')
  .text(`
  text { font-family: sans-serif; font-size: ${px(fontSize)}} 
  line { stroke: black; }
  rect { fill: none; stroke: black; }
  `)

svg.append('rect')
  .attr('x', xPc(data[0].time))
  .attr('y', '0%')
  .attr('width', wPc(data[0].time, data[data.length-1].time))
  .attr('height', '80%')

const enterData = svg.selectAll('text')
  .data(data)
  .enter();

enterData.append('text')
    .attr('x', d => xPc(d.time))
    .attr('y', '80%')
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .text(d => d.text);

enterData.append('line')
  .attr('x1', d => xPc(d.time))
  .attr('x2', d => xPc(d.time))
  .attr('y1', '0%')
  .attr('y2', d => d.i % 3 == 0 ? '40%' : '10%')




svg.append('circle')
  .attr('r', '2%')
  .attr('cx', xPc(now))
  .attr('cy', '40%')
  .attr('fill', 'red')


const svgContent = document.body.innerHTML;

writeFile(svgName, svgContent);
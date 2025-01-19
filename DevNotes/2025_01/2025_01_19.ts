const startedStr = "12h14 2025_01_19"

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

const parseTime = d3.timeParse("%Hh%M %Y_%m_%d");
const started = parseTime(startedStr);
const now = new Date();
const formatDay = d3.timeFormat("%Y_%m_%d");
const dayStr = formatDay(now);
console.log('today', formatDay(now));

const dayStart = d3.timeDay.floor(now);
const dayStop = d3.timeDay.offset(dayStart, 1);
const hours = d3.timeHour.range(dayStart, dayStop);
hours.push(dayStop);

const xScale = d3.scaleLinear([dayStart, dayStop], [4, 96]);
const px = d => `${d}px`;
const pc = d => `${d}%`;
const xPc = (d : Date) => pc(xScale(d));
const wPc = (d1 : Date, d2 : Date) => pc(xScale(d2) - xScale(d1));

const data = hours.map((hour : Date, i : number) => {
  const tick_max = 80;
  const tick_length = i % 6 == 0 ? tick_max : i % 3 == 0 ? tick_max/2 : tick_max/4;
  const tick_x = xScale(hour);
  const tick_y2 = tick_max;
  const tick_y1 = tick_y2 - tick_length;
  return {
    i: i,
    time: hour,
    text: i % 3 == 0 ? hour.getHours() + '' : null,
    tick_x,
    tick_y1,
    tick_y2
  }
});
data[data.length-1].text = '24';

const svgName = `${dayStr}.svg`
const svg = d3.select(document.body)
  .append('svg')
  .attr('xmlns', "http://www.w3.org/2000/svg");

const fontSize = 100;

svg.append('style')
  .text(`
  .red-stroke { stroke: red; }
  text { font-family: sans-serif; font-size: ${pc(fontSize)}} 
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
    .attr('y', '95%')
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .text(d => d.text);

enterData.append('line')
  .attr('x1', d => pc(d.tick_x))
  .attr('x2', d => pc(d.tick_x))
  .attr('y1', d => pc(d.tick_y1))
  .attr('y2', d => pc(d.tick_y2))

const barHeight = 30;

svg.append('circle')
  .attr('r', '2%')
  .attr('cx', xPc(started))
  .attr('cy', pc(barHeight))
  .attr('fill', 'red')

svg.append('circle')
  .attr('r', '2%')
  .attr('cx', xPc(now))
  .attr('cy', pc(barHeight))
  .attr('fill', 'red')

svg.append('line')
    .attr('x1', xPc(started))
    .attr('x2', xPc(now))
    .attr('y1', pc(barHeight))
    .attr('y2', pc(barHeight))
    .attr('class', 'red-stroke')



const svgContent = document.body.innerHTML;

writeFile(svgName, svgContent);
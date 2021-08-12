import * as d3 from "d3";

interface Datum {
  x: number;
  y: number;
}

const addTooltip = <T extends d3.Selection<any, any, any, any>>(
  parentDiv: HTMLDivElement,
  base: T
): T => {
  var tooltip = d3
    .select(parentDiv)
    .append("div")
    .attr("class", "beevenue-TagHistogram-Tooltip")
    .style("visibility", "hidden");

  const show = (datum: Datum) => {
    return tooltip
      .text(`${datum.y}`)
      .style("visibility", "visible")
      .style("top", `${d3.event.clientY + 10}px`)
      .style("left", `${d3.event.clientX + 10}px`);
  };

  const hide = () => {
    return tooltip.style("visibility", "hidden");
  };

  return base
    .on("focus", show)
    .on("mouseover", show)
    .on("mousemove", show)
    .on("mouseout", hide);
};

const renderHistogram = (
  histogramData: Record<number, number>,
  div: HTMLDivElement
) => {
  var margin = { top: 10, right: 10, bottom: 30, left: 50 },
    width = div.clientWidth - margin.left - margin.right,
    height = div.clientWidth * (9 / 14) - margin.top - margin.bottom;

  d3.select(div).html(null);

  const unpaddedSvg = d3
    .select(div)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  const paddedSvg = unpaddedSvg
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  const allXs = Object.keys(histogramData).map((k) => Number(k));
  const maxX = Math.max(...allXs);
  const maxY = Math.max(
    ...Object.keys(histogramData).map((k) => histogramData[Number(k)])
  );

  const convertedData: Datum[] = [];

  for (let x = 0; x <= maxX; ++x) {
    let y = 0;
    if (allXs.includes(x)) y = histogramData[x];

    convertedData.push({ x, y });
  }

  // e.g. 100 if maxValue = 324
  const roundMagnitude = 10 ** Math.floor(Math.log10(maxY));
  // e.g. ceil(324/100) * 100 = 4*100 = 400
  const roundedUpMaxY = Math.ceil(maxY / roundMagnitude) * roundMagnitude;

  var x = d3
    .scaleBand()
    .domain(convertedData.map((d) => `${d.x}`))
    .range([0, width])
    .padding(0.25);
  paddedSvg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  var y = d3.scaleLinear().domain([0, roundedUpMaxY]).range([height, 0]);

  paddedSvg.append("g").call(d3.axisLeft(y));

  const rect = paddedSvg
    .selectAll("histoBars")
    .data(convertedData)
    .enter()
    .append("rect");

  addTooltip(div, rect);

  rect
    .attr("x", (d) => x(`${d.x}`)!)
    .attr("y", (d) => y(d.y)!)
    .attr("width", x.bandwidth())
    .attr("height", function (d) {
      return height - y(d.y)!;
    })
    .attr("class", "beevenue-TagHistogram-Bar");
};

export { renderHistogram };

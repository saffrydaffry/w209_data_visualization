/**
 * Created by Safyre on 12/18/16.
 */
// no need for import since d3 is imported in .html

/*boiler plate variable set up */
// chart object container properties
var svg = d3.select("svg"),
    margin = {top: 20, right: 80, bottom: 30, left: 50},
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

var parseDate = d3.timeParse("%m/%d/%Y");

var x = d3.scaleTime().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
    z = d3.scaleOrdinal(d3.schemeCategory10);

/* boiler plate chart objects */
var line = d3.line()
    .curve(d3.curveBasis)
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.count); });

/* rename columns */
var keymap = {"caught": "pokemon", "stops": "pokestops", "num_items": "items"};

/* load data and call plot*/
d3.csv("data.csv", type ,function(data) {
    /* data.forEach(function(d){
     d.date = parseDate(d.date);
     d.caught = +d.caught;
     d.stops = +d.stops;
     d.items = +d['num_items'];
     }
     */

    /*  split by column */
    var dataset = data.columns.slice(1).map(function(id){
        return {
            id: id,
            values: data.map(function (d) {

                return {date: d.date, count: d[id]};
            })
        }
    });

    /* Set ranges for each dimension */
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([
        d3.min(dataset, function(c) { return d3.min(c.values, function(d) { return d.count; }); }),
        d3.max(dataset, function(c) { return d3.max(c.values, function(d) { return d.count; }); })
    ]);
    z.domain(dataset.map(function(c) { return c.id; }));

    /* Add x and y axes to graph "g"
    axis---x declared within styles tag
    * */
    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "-3em")
        .attr("fill", "#000")
        .text("Counts per Day");

    // call the data
    var datasets = g.selectAll(".datasets")
        .data(dataset)
        .enter().append("g")
        .attr("class", "datasets");

    datasets.append("path")
        .attr("class", "line")
        .attr("d", function(d) { return line(d.values); })
        .style("stroke", function(d) { return z(d.id); });

    // labels for each line
     datasets.append("text")
     .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
     .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.count) + ")"; })
     .attr("x", 3)
     .attr("dy", "0.35em")
     .style("font", "12px Lato")
     .text(function(d) { return keymap[d.id]; });



});

// create variable d that returns the x-axis text
function type(d, _, columns) {
    d.date = parseDate(d.date);
    for (var i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
    return d;
}

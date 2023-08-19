const graph = new Graph();
const inset = 50;
const randomNodes = 50;
const randomEdges = 40;
const w = 1024;
const h = 768;
const rw = w - (inset * 2);
const rh = h - (inset * 2);
const rr = 30;
const fps = 1;
let withArrayXY = { arrayXY: [] };
let solved = false;

function setup() {
    createCanvas(w, h);

    frameRate(fps);

    for (var i = 0; i < randomNodes; i++) {
        const vertex = graph.addVertex('' + i);
        vertex.x = Math.random() * rw;
        vertex.y = Math.random() * rh;
    }

    /*for (var i = 0; i < randomEdges; i++) {
        const startpoint = graph.vertices[Math.floor(Math.random() * graph.vertices.length)];
        const endpoint = graph.vertices[Math.floor(Math.random() * graph.vertices.length)];
        graph.addEdge(startpoint, endpoint, Math.random() * 10);
    }*/

    //console.log(JSON.stringify(graph, null, "\t"));

    withArrayXY.arrayXY = graph.vertices.slice();

    // wait a second before starting
    delay(1000).then(() => {
        // wait 0.1 second between each step
        calculateBestOrder(withArrayXY, 100);
        // done
        solved = true;
    });
}

function draw() {
    strokeWeight(2);
    background(0);

    noFill();
    beginShape();
    let distance = 0;
    for (var i = 0; i < withArrayXY.arrayXY.length - 1; i++) {
        const from = withArrayXY.arrayXY[i];
        const to = withArrayXY.arrayXY[i + 1];
        distance += euclideanDistance(from, to);
        stroke(255 / withArrayXY.arrayXY.length * i, 0, 255);
        line(inset + from.x, inset + from.y, inset + to.x, inset + to.y);
    }
    endShape();

    stroke(255);
    strokeWeight(1);
    fill(255);
    textSize(28);
    textAlign(CENTER, CENTER);
    text('' + (Math.round(distance * 100) / 100), 70, 24);

    fill(0);
    for (var i = 0; i < withArrayXY.arrayXY.length; i++) {
        const vertex = withArrayXY.arrayXY[i];
        ellipse(inset + vertex.x, inset + vertex.y, rr, rr);
    }
    noFill();
    stroke(255);
    for (var i = 0; i < withArrayXY.arrayXY.length; i++) {
        const vertex = withArrayXY.arrayXY[i];
        ellipse(inset + vertex.x, inset + vertex.y, rr, rr);
    }

    strokeWeight(1);
    textSize(12);
    textAlign(CENTER, CENTER);
    for (var i = 0; i < graph.vertices.length; i++) {
        const vertex = graph.vertices[i];
        text('' + i, inset + vertex.x, inset + vertex.y);
    }
}

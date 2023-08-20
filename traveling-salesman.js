import * as common from './traveling-salesman-common.js';

const traveler = new common.TravelingSalesman();

const sketchConfig = {
    fps: 1,
    randomNodes: 6,
    dotRadius: 30,
    sketchInset: 50,
    sketchW: 1024,
    sketchH: 768,
    rw: 1024 - (50 * 2),
    rh: 768 - (50 * 2),
    delay: 1000,
    stepDelay: 100,
};

function setup() {
    if (sketchConfig.fps && 0 <= sketchConfig.fps && sketchConfig.fps <= 60) frameRate(sketchConfig.fps);
    createCanvas(sketchConfig.sketchW, sketchConfig.sketchH);

    for (var i = 0; i < sketchConfig.randomNodes; i++) {
        const vertex = traveler.graph.addVertex('' + i);
        vertex.x = Math.random() * sketchConfig.rw;
        vertex.y = Math.random() * sketchConfig.rh;
    }
    console.log(traveler.graph);

    traveler.calculateDistances();
    const distanceMatrix = traveler.convertDistancesToMatrix();
    console.log(distanceMatrix);
    console.log(JSON.stringify(distanceMatrix._data, null, "\t"));

    //const m = [vertices.length][vertices.length];
    //console.log(JSON.stringify(m, null, "\t"));

    // wait a second before starting
    common.delay(sketchConfig.delay).then(() => {
        traveler.arrayXY = traveler.graph.vertices.slice();
        // wait 0.1 seconds (stepDelay) between each step
        common.solveTravelinsSalesmanProblem(traveler, sketchConfig.stepDelay);
        traveler.solved = true;
    });
}

function draw() {
    strokeWeight(2);
    background(0);

    noFill();
    beginShape();
    let distance = 0;
    for (var i = 0; i < traveler.arrayXY.length - 1; i++) {
        const from = traveler.arrayXY[i];
        const to = traveler.arrayXY[i + 1];
        distance += common.euclideanDistance(from, to);
        stroke(255 / traveler.arrayXY.length * i, 0, 255);
        line(sketchConfig.sketchInset + from.x, sketchConfig.sketchInset + from.y, sketchConfig.sketchInset + to.x, sketchConfig.sketchInset + to.y);
    }
    endShape();

    stroke(255);
    strokeWeight(1);
    fill(255);
    textSize(28);
    textAlign(CENTER, CENTER);
    text('' + round(distance, 2), 70, 24);

    fill(0);
    for (var i = 0; i < traveler.arrayXY.length; i++) {
        const vertex = traveler.arrayXY[i];
        ellipse(sketchConfig.sketchInset + vertex.x, sketchConfig.sketchInset + vertex.y, sketchConfig.dotRadius, sketchConfig.dotRadius);
    }
    noFill();
    stroke(255);
    for (var i = 0; i < traveler.arrayXY.length; i++) {
        const vertex = traveler.arrayXY[i];
        ellipse(sketchConfig.ketchInset + vertex.x, sketchConfig.sketchInset + vertex.y, sketchConfig.dotRadius, sketchConfig.dotRadius);
    }

    strokeWeight(1);
    textSize(12);
    textAlign(CENTER, CENTER);
    for (var i = 0; i < traveler.graph.vertices.length; i++) {
        const vertex = traveler.graph.vertices[i];
        text('' + i, sketchConfig.sketchInset + vertex.x, sketchConfig.sketchInset + vertex.y);
    }
}

window.setup = setup;
window.draw = draw;

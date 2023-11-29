import { TravelingSalesman, Population, delay as waitFor, shuffle } from './traveling-salesman-common.js';

const traveler = new TravelingSalesman();

const sketchConfig = {
    fps: 60,
    randomNodes: 25,
    dotRadius: 30,
    sketchInset: 50,
    sketchW: 1024,
    sketchH: 768,
    rw: 1024/*sketchW*/ - (50/*sketchInset*/ * 2),
    rh: 768/*sketchH*/ - (50/*sketchInset*/ * 2),
    delay: 2000, // delay beofre solving
    stepDelay: 100, // delay between steps during solving
};

function log(x) {
    console.log(JSON.stringify(x, null, "\t"));
}

function setup() {
    if (sketchConfig.fps && 0 <= sketchConfig.fps && sketchConfig.fps <= 60) frameRate(sketchConfig.fps);
    createCanvas(sketchConfig.sketchW, sketchConfig.sketchH);

    for (var i = 0; i < sketchConfig.randomNodes; i++) {
        const vertex = traveler.graph.addVertex('' + i);
        vertex.x = math.random() * sketchConfig.rw;
        vertex.y = math.random() * sketchConfig.rh;
    }
    console.log(traveler.graph);

    traveler.calculateDistanceEdges();
    const distanceMatrix = traveler.convertDistanceEdgesToMatrix();
    console.log(distanceMatrix);
    log(distanceMatrix._data);

    traveler.population = new Population(traveler.graph.vertices.slice());
    traveler.population.weight = traveler.calculateWeight(traveler.population.order);

    if (false) {
        // wait a second before starting
        // wait 0.1 seconds (stepDelay) between each step
        waitFor(sketchConfig.delay).then(() => traveler.solve(sketchConfig.stepDelay));
    }

    // https://www.youtube.com/watch?v=M3KTWnTrU_c&t=2s
    // https://medium.com/@becmjo/genetic-algorithms-and-the-travelling-salesman-problem-d10d1daf96a1
    if (true) {
        const populationsSize = 10;
        const mutationRate = 0.01;
        const generations = 100;
        // create initial populations
        let initialPopulations = randomizePopulations(populationsSize);

        //traveler.solveWithGeneticAlgorithm(initialPopulations, generations, mutationRate, sketchConfig.stepDelay)

        // wait a second before starting
        // wait 0.1 seconds (stepDelay) between each step
        waitFor(sketchConfig.delay).then(() => traveler.solveWithGeneticAlgorithm(initialPopulations, generations, mutationRate, sketchConfig.stepDelay));
    }
}

function randomizePopulations(populationsSize) {
    const populations = [];
    for (let i = 0; i < populationsSize; i++) {
        const population = new Population();
        population.order = randomized();
        population.weight = traveler.calculateWeight(population.order);
        populations.push(population);
    }
    return populations;
}

// randomize order but keeps node 0 as start
function randomized() {
    let randomized = traveler.graph.vertices.slice();
    const first = randomized.shift();
    randomized = shuffle(randomized);
    randomized.unshift(first);
    return randomized;
}

function draw() {
    strokeWeight(2);
    background(0);

    noFill();
    beginShape();
    let distance = traveler.population.weight;
    for (var i = 0; i < traveler.population.order.length - 1; i++) {
        const from = traveler.population.order[i];
        const to = traveler.population.order[i + 1];
        const r = 255 / traveler.population.order.length * i;
        const g = 255 - r;
        const b = 0;
        stroke(r, g, b);
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
    for (var i = 0; i < traveler.population.order.length; i++) {
        const vertex = traveler.population.order[i];
        ellipse(sketchConfig.sketchInset + vertex.x, sketchConfig.sketchInset + vertex.y, sketchConfig.dotRadius, sketchConfig.dotRadius);
    }
    noFill();
    stroke(255);
    for (var i = 0; i < traveler.population.order.length; i++) {
        const vertex = traveler.population.order[i];
        ellipse(sketchConfig.sketchInset + vertex.x, sketchConfig.sketchInset + vertex.y, sketchConfig.dotRadius, sketchConfig.dotRadius);
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

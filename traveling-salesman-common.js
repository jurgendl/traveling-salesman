export { shuffle, delay, Graph, Vertex, Edge, TravelingSalesman, Population };

/* The `delay` function is a helper function that returns a promise that resolves after a
specified amount of time. It is used to introduce a delay or pause in the execution of
code. The `delay` function takes a parameter `time` which represents the time in
milliseconds to delay. */
function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

/* The `TravelingSalesman` class is a solver for the traveling salesman problem. It represents a
graph and provides methods to calculate distances between vertices, convert distances to a
matrix, and solve the problem by finding the best order in which to visit the vertices,
minimizing the total distance traveled. */
class TravelingSalesman {
    /*const*/ graph = new Graph();
    /*let*/ population = null;
    /*let*/ solved = false;
    /*let*/ distanceMatrix = null;

    /*function*/ calculateDistanceEdges() {
        for (var i = 0; i < this.graph.vertices.length; i++) {
            const v = this.graph.vertices[i];
            this.graph.addEdge(v, v, 0);
        }
        for (var i = 0; i < this.graph.vertices.length; i++) {
            const from = this.graph.vertices[i];
            for (var j = 0; j < i; j++) {
                const to = this.graph.vertices[j];
                const distance = this.euclideanDistance(from, to);
                this.graph.addEdge(from, to, distance);
                this.graph.addEdge(to, from, distance);
            }
        }
    }

    /*function*/ convertDistanceEdgesToMatrix() {
        let distanceMatrix = [];
        for (var i = 0; i < this.graph.vertices.length; i++) {
            const row = [];
            const from = this.graph.vertices[i];
            for (var j = 0; j < this.graph.vertices.length; j++) {
                const to = this.graph.vertices[j];
                if (from === to) {
                    row.push(0);
                } else {
                    const edge = this.graph.getEdge(from, to);
                    row.push(edge ? edge.weight : Infinity);
                }
            }
            distanceMatrix.push(row);
        }
        this.distanceMatrix = math.matrix(distanceMatrix);
        return this.distanceMatrix;
    }

    /* The `calculateBestOrder` function is a part of a traveling salesman problem solver.
    It takes an array of vertices and calculates the best order in which to visit them,
    minimizing the total distance traveled. It does this by iteratively selecting the
    nearest vertex to the current vertex and adding it to a new ordered array. The
    function uses the `euclideanDistance` function to calculate the distance between two
    vertices. The process continues until all vertices have been visited. */
    async /*function*/ solve(stepDelay = -1) {
        if (this.solved) return this.population;
        this.population = new Population(this.graph.vertices.slice());
        const newOrder = [];
        const start = this.population.order[0];
        newOrder.push(start);
        this.population.order.splice(0, 1);
        while (this.population.order.length > 0) {
            let nearest = null;
            let nearestDistance = Number.MAX_VALUE;
            for (var i = 0; i < this.population.order.length; i++) {
                const distance = this.cachedEuclideanDistance(newOrder[newOrder.length - 1], this.population.order[i]);
                if (distance < nearestDistance) {
                    nearest = this.population.order[i];
                    nearestDistance = distance;
                }
            }
            if (stepDelay && stepDelay > 0) await delay(stepDelay);
            newOrder.push(nearest);
            this.population.order.splice(this.population.order.indexOf(nearest), 1);
        }
        this.population.order = newOrder;
        this.solved = true;
        return this.population;
    }

    /* The `euclideanDistance` function calculates the Euclidean distance between two points in a
    two-dimensional space. It takes two parameters `from` and `to`, which represent the
    coordinates of the two points. The function uses the formula `Math.sqrt(Math.pow(from.x -
    to.x, 2) + Math.pow(from.y - to.y, 2))` to calculate the distance. It subtracts the
    x-coordinates and y-coordinates of the two points, squares the differences, adds them
    together, and then takes the square root of the sum to get the Euclidean distance. */
    /*function*/ euclideanDistance(from, to) {
        return sqrt(pow(from.x - to.x, 2) + pow(from.y - to.y, 2));
    }

    /*function*/ cachedEuclideanDistance(from, to) {
        return this.distanceMatrix._data[Number(from.name)][Number(to.name)];
    }

    // ========================================================================

    async /*function*/ solveWithGeneticAlgorithm(populations, generations, mutationRate, stepDelay = -1) {
        for (let i = 0; i < generations; i++) {
            // normalize fitness
            this.calculateFitness(populations);
            // sort populations by fitness
            this.sortPopulations(populations);
            // keep track of best population
            if (!this.population.order.weight || populations[0].weight < this.population.order.weight) this.population = populations[0];
            if ((i + 1) < generations) {
                // wait for stepDelay
                if (stepDelay && stepDelay > 0 && generations > 1) await delay(stepDelay);
                // create new population
                populations = this.evolve(populations, mutationRate);
            }
        }
    }

    /*function*/ calculateFitness(populations) {
        console.log(populations);
        let minWeight = Number.MAX_VALUE;
        let maxWeight = 0;
        for (let i = 0; i < populations.length; i++) {
            const population = populations[i];
            if (population.weight < minWeight) minWeight = population.weight;
            if (population.weight > maxWeight) maxWeight = population.weight;
        }
        console.log(minWeight, maxWeight);
        for (let i = 0; i < populations.length; i++) {
            const population = populations[i];
            population.fitness = map(population.weight, minWeight, maxWeight, 1, 0.01);
        }
        console.log(populations);
        let sum = 0;
        for (let i = 0; i < populations.length; i++) {
            const population = populations[i];
            sum += population.fitness;
        }
        console.log(sum);
        let sum2 = 0;
        for (let i = 0; i < populations.length; i++) {
            const population = populations[i];
            population.fitness = population.fitness / sum;
            sum2 += population.fitness;
        }
        console.log(populations);
        console.log(sum2);
        return populations;
    }

    /*function*/ sortPopulations(populations) {
        populations.sort((a, b) => - a.fitness + b.fitness);
        return populations;
    }

    /*function*/ evolve(populations, mutationRate) {
        const newPopulations = [];
        for (let i = 0; i < populations.length; i++) {
            let newPopulation = new Population();
            newPopulation = new Population(this.pick(populations).order); //xxx
            //this.crossover(newPopulation, this.pick(populations), this.pick(populations));//xxx
            newPopulation = this.mutate(newPopulation, mutationRate);
            newPopulation.weight = this.calculateWeight(newPopulation.order);
            newPopulations.push(newPopulation);
        }
        return newPopulations;
    }

    /* The `pick` function is used in the genetic algorithm to select a population from the
    current generation based on their fitness. It randomly selects a population with a
    probability proportional to its fitness. The higher the fitness, the higher the chance of
    being selected. */
    /*function*/ pick(populations) {
        let index = 0;
        let r = random(1);
        while (r > 0) {
            if (!populations[index]) {
                debugger;
            }
            r = r - populations[index].fitness;
            index++;
        }
        index--;
        return populations[index];
    }

    /*function*/ crossover(newPopulation, firstCandidate, secondCandidate) {
        const crossoverPoint = floor(random(firstCandidate.order.length));
        for (let i = 0; i < crossoverPoint; i++) {
            newPopulation.order[i] = firstCandidate.order[i];
        }
        for (let i = crossoverPoint; i < secondCandidate.order.length; i++) {
            newPopulation.order[i] = secondCandidate.order[i];
        }
        return newPopulation;
    }

    /*function*/ mutate(population, mutationRate) {
        for (let i = 0; i < population.order.length; i++) {
            if (random(1) < mutationRate) {
                let indexA = floor(random(population.order.length));
                let indexB = (indexA + 1) % population.order.length;
                if (indexA == 0) {
                    indexA++;
                    indexB++;
                }
                swap(population.order, indexA, indexB);
            }
        }
        return population;
    }

    /*function*/ calculateWeight(vertices) {
        let sum = 0;
        for (let i = 0; i < vertices.length - 1; i++) {
            sum += this.cachedEuclideanDistance(vertices[i], vertices[i + 1]);
        }
        return sum;
    }
}

class Population {
    order = [];
    weight;
    fitness;

    constructor(order) {
        if (order) this.order = order;
    }
}

function swap(arr, i, j) {
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}

/* The `shuffle` function is implementing the Fisher-Yates Shuffle algorithm. It takes an
array as input and shuffles the elements in a random order. The function iterates through
the array from the last element to the first, and at each iteration, it selects a random
index between 0 and the current index. It then swaps the element at the current index with
the element at the randomly selected index. This process continues until all elements have
been shuffled. Finally, the function returns the shuffled array. */
function shuffle(array) {
    //  Fisher-Yates Shuffle Algorithm
    // https://bost.ocks.org/mike/shuffle/
    var m = array.length, t, i;
    // While there remain elements to shuffle…
    while (m) {
        // Pick a remaining element…
        i = Math.floor(Math.random() * m--);
        // And swap it with the current element.
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }
    return array;
}

/* The `class Graph` is a representation of a graph data structure. It has properties `edges` and
`vertices`, which are arrays that store the edges and vertices of the graph, respectively. The class
provides methods to add and remove vertices and edges, as well as methods to find vertices and edges
by name or by their startpoint and endpoint. */
class Graph {
    edges;
    vertices;

    constructor() {
        this.edges = [];
        this.vertices = [];
    }

    /* The `indexOfEdge` method in the `Graph` class is used to find the index of a specific edge in
    the `edges` array of the graph. It takes one parameter `edge`, which represents the edge to be
    found. The method searches through the `edges` array and returns the index of the first
    occurrence of the specified edge. If the edge is not found, the method returns -1. */
    indexOfEdge(edge) {
        return this.edges.indexOf(edge);
    }

    /* The `indexOfVertex` method in the `Graph` class is used to find the index of a vertex in the
    `vertices` array of the graph. It takes one parameter `vertex`, which represents the vertex to
    be found. The method searches through the `vertices` array and returns the index of the first
    occurrence of the specified vertex. If the vertex is not found, the method returns -1. */
    indexOfVertex(vertex) {
        return this.vertices.indexOf(vertex);
    }

    /* The `addVertex` method in the `Graph` class is used to add a vertex to the graph. It takes one
    parameter `name`, which represents the name or identifier of the vertex. */
    addVertex(name) {
        const vertex = new Vertex(name);
        this.vertices.push(vertex);
        return vertex;
    }

    /* The `removeVertex` method in the `Graph` class is used to remove a vertex from the graph. It
    takes one parameter `vertex`, which represents the vertex to be removed. */
    removeVertex(vertex) {
        this.vertices = this.vertices.filter(v => v !== vertex);
        vertex.outgoingEdges.forEach(e => this.removeEdge(e));
        vertex.incomingEdges.forEach(e => this.removeEdge(e));
    }

    /* The `addEdge` method in the `Graph` class is used to add an edge to the graph. It takes three
    parameters: `startpoint`, `endpoint`, and `weight`. */
    addEdge(startpoint, endpoint, weight) {
        const edge = new Edge(startpoint, endpoint, weight);
        this.edges.push(edge);
        startpoint.outgoingEdges.push(edge);
        endpoint.incomingEdges.push(edge);
        return edge;
    }

    /* The `removeEdge` method in the `Graph` class is used to remove an edge from the graph. It takes
    one parameter `edge`, which represents the edge to be removed. */
    removeEdge(edge) {
        this.edges = this.edges.filter(e => e !== edge);
        edge.startpoint.outgoingEdges = edge.startpoint.outgoingEdges.filter(e => e !== edge);
        edge.endpoint.incomingEdges = edge.endpoint.incomingEdges.filter(e => e !== edge);
    }

    /* The `vertexByName` method in the `Graph` class is used to find a vertex in the graph based on
    its name. It takes one parameter `name`, which represents the name of the vertex. The method
    searches through the `vertices` array of the graph and returns the first vertex that has a
    matching name. If no vertex with the specified name is found, the method returns `undefined`. */
    vertexByName(name) {
        return this.vertices.find(v => v.name === name);
    }

    /* alias for `vertexByName` */
    getVertex(name) {
        return this.vertexByName(name);
    }

    /* The `edgeByVertices` method in the `Graph` class is used to find an edge in the graph based on
    its startpoint and endpoint vertices. It takes two parameters `startpoint` and `endpoint`, which
    represent the startpoint and endpoint vertices of the edge. */
    edgeByVertices(startpoint, endpoint) {
        return this.edges.find(e => e.startpoint === startpoint && e.endpoint === endpoint);
    }

    /* alias for `edgeByVertices` */
    getEdge(startpoint, endpoint) {
        return this.edgeByVertices(startpoint, endpoint);
    }
}

/* The `class Vertex` is a representation of a vertex in a graph data structure. It has properties
`name`, `outgoingEdges`, and `incomingEdges`. The `name` property represents the name or identifier
of the vertex. The `outgoingEdges` property is an array that stores the edges that start from this
vertex. The `incomingEdges` property is an array that stores the edges that end at this vertex. */
class Vertex {
    name;
    outgoingEdges;
    incomingEdges;

    constructor(name) {
        this.name = name;
        this.outgoingEdges = [];
        this.incomingEdges = [];
    }
}

/* The `class Edge` is a representation of an edge in a graph data structure. It has properties
`startpoint`, `endpoint`, and `weight`. The `startpoint` property represents the vertex where the
edge starts, the `endpoint` property represents the vertex where the edge ends, and the `weight`
property represents the weight or cost associated with the edge. */
class Edge {
    startpoint;
    endpoint;
    weight;

    constructor(startpoint, endpoint, weight) {
        this.startpoint = startpoint;
        this.endpoint = endpoint;
        this.weight = weight ? weight : 1;
    }
}

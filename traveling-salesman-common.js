/* The `euclideanDistance` function calculates the Euclidean distance between two points in a
two-dimensional space. It takes two parameters `from` and `to`, which represent the
coordinates of the two points. The function uses the formula `Math.sqrt(Math.pow(from.x -
to.x, 2) + Math.pow(from.y - to.y, 2))` to calculate the distance. It subtracts the
x-coordinates and y-coordinates of the two points, squares the differences, adds them
together, and then takes the square root of the sum to get the Euclidean distance. */
function euclideanDistance(from, to) {
    return Math.sqrt(Math.pow(from.x - to.x, 2) + Math.pow(from.y - to.y, 2));
}

/* The `delay` function is a helper function that returns a promise that resolves after a
specified amount of time. It is used to introduce a delay or pause in the execution of
code. The `delay` function takes a parameter `time` which represents the time in
milliseconds to delay. */
function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

/* The `calculateBestOrder` function is a part of a traveling salesman problem solver.
It takes an array of vertices and calculates the best order in which to visit them,
minimizing the total distance traveled. It does this by iteratively selecting the
nearest vertex to the current vertex and adding it to a new ordered array. The
function uses the `euclideanDistance` function to calculate the distance between two
vertices. The process continues until all vertices have been visited. */
async function calculateBestOrder(withArrayXY, stepWait = -1) {
    const newOrder = [];
    const start = withArrayXY.arrayXY[0];
    newOrder.push(start);
    withArrayXY.arrayXY.splice(0, 1);
    while (withArrayXY.arrayXY.length > 0) {
        let nearest = null;
        let nearestDistance = Number.MAX_VALUE;
        for (var i = 0; i < withArrayXY.arrayXY.length; i++) {
            const distance = euclideanDistance(newOrder[newOrder.length - 1], withArrayXY.arrayXY[i]);
            if (distance < nearestDistance) {
                nearest = withArrayXY.arrayXY[i];
                nearestDistance = distance;
            }
        }
        if (stepWait && stepWait > 0) await delay(stepWait);
        newOrder.push(nearest);
        withArrayXY.arrayXY.splice(withArrayXY.arrayXY.indexOf(nearest), 1);
    }
    withArrayXY.arrayXY = newOrder;
    return withArrayXY.arrayXY;
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

    indexOfEdge(edge) {
        return this.edges.indexOf(edge);
    }

    indexOfVertex(vertex) {
        return this.vertices.indexOf(vertex);
    }

    addVertex(name) {
        const vertex = new Vertex(name);
        this.vertices.push(vertex);
        return vertex;
    }

    removeVertex(vertex) {
        this.vertices = this.vertices.filter(v => v !== vertex);
        vertex.outgoingEdges.forEach(e => this.removeEdge(e));
        vertex.incomingEdges.forEach(e => this.removeEdge(e));
    }

    removeEdge(edge) {
        this.edges = this.edges.filter(e => e !== edge);
        edge.startpoint.outgoingEdges = edge.startpoint.outgoingEdges.filter(e => e !== edge);
        edge.endpoint.incomingEdges = edge.endpoint.incomingEdges.filter(e => e !== edge);
    }

    addEdge(startpoint, endpoint, weight) {
        const edge = new Edge(startpoint, endpoint, weight);
        this.edges.push(edge);
        startpoint.outgoingEdges.push(edge);
        endpoint.incomingEdges.push(edge);
        return edge;
    }

    vertexByName(name) {
        return this.vertices.find(v => v.name === name);
    }

    edgeByVertices(startpoint, endpoint) {
        return this.edges.find(e => e.startpoint === startpoint && e.endpoint === endpoint);
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

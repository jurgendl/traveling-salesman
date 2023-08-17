class Graph {
    edges;
    vertices;

    constructor() {
        this.edges = [];
        this.vertices = [];
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

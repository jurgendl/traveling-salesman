class Graph {
    edges;
    vertices;

    constructor() {
        this.edges = [];
        this.edges = [];
    }

    add(i) {
        if (i instanceof Edge) {
            this.edges.push(i);
        } else if (i instanceof Vertex) {
            this.vertices.push(i);
        } else {
            throw new Error('Invalid argument');
        }
        return i;
    }

    remove(i) {
        if (i instanceof Edge) {
            this.edges = this.edges.filter(e => e !== i);
        } else if (i instanceof Vertex) {
            this.vertices = this.vertices.filter(v => v !== i);
        } else {
            throw new Error('Invalid argument');
        }
        return i;
    }
}

class Vertex {
    name;
    edges;

    constructor(name) {
        this.name = name;
        this.edges = [];
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

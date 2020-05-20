// generator.ts
// Generators for graphs

import GraphingEngine from "./GraphingEngine";
import GraphNode from "./GraphNode";

const fallbackCentroidX = 400;
const fallbackCentroidY = 300;
const fallbackRadius = 100;

interface CircleConfig {
    readonly centroidX?: number
    readonly centroidY?: number
    readonly radius?: number
}

/**
 * Generates circle of nodes
 * 
 * @param engine 
 * @param n 
 * @param config 
 */
function createNodeCircle(engine: GraphingEngine, n: number, config: CircleConfig = {}): void {

    const centroidX = config.centroidX || fallbackCentroidX;
    const centroidY = config.centroidY || fallbackCentroidY;
    const radius = config.radius || fallbackRadius;

    for (let i = 0; i < n; i++) {
        const x = centroidX + radius * Math.cos(2 * Math.PI * i / n);
        const y = centroidY + radius * Math.sin(2 * Math.PI * i / n);
        engine.addNode(new GraphNode(x, y));
    }
}

/**
 * Creates complete graph
 * @param engine 
 * @param n 
 * @param config 
 */
export function createComplete(engine: GraphingEngine, n: number, config: CircleConfig = {}): boolean {

    if (n < 1) {
        return false;
    }

    const start = engine.getNodeCount();

    // Create circle base
    createNodeCircle(engine, n, config);

    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            engine.addEdge(engine.nodes[i + start], engine.nodes[j + start]);
        }
    }

    return true;
}

/**
 * Creates complete bipartite graph
 * @param engine 
 * @param n1 
 * @param n2 
 * @param config 
 */
export function createBipartiteComplete(engine: GraphingEngine, n1: number, n2: number, config: CircleConfig = {}): boolean {

    if (n1 < 1 || n2 < 1) {
        return false;
    }

    const centroidX = config.centroidX || fallbackCentroidX;
    const centroidY = config.centroidY || fallbackCentroidY;
    const radius = config.radius || fallbackRadius;

    const start1 = engine.getNodeCount();
    for (let i = 0; i < n1; i++) {
        const x = centroidX + radius * Math.pow(-1, i) * Math.floor((i + 1) / 2);
        const y = centroidY - radius;
        engine.addNode(new GraphNode(x, y));
    }

    const start2 = engine.getNodeCount();
    for (let i = 0; i < n2; i++) {
        const x = centroidX + radius * Math.pow(-1, i) * Math.floor((i + 1) / 2);
        const y = centroidY + radius;
        engine.addNode(new GraphNode(x, y));
    }

    for (let i = 0; i < n1; i++) {
        for (let j = 0; j < n2; j++) {
            engine.addEdge(engine.nodes[i + start1], engine.nodes[j + start2]);
        }
    }

    return true;
}

/**
 * Creates cycle graph
 * 
 * @param engine 
 * @param n 
 * @param config 
 */
export function createCycle(engine: GraphingEngine, n: number, config: CircleConfig = {}): boolean {

    if (n < 3) {
        return false;
    }

    const start = engine.getNodeCount();

    // Create circle base
    createNodeCircle(engine, n, config);

    for (let i = 0; i < n; i++) {
        engine.addEdge(engine.nodes[i % n + start], engine.nodes[(i + 1) % n + start]);
    }

    return true;
}

/**
 * Creates star graph
 * 
 * @param engine 
 * @param n 
 * @param config 
 */
export function createStar(engine: GraphingEngine, n: number, config: CircleConfig = {}): boolean {

    if (n < 4) {
        return false;
    }

    const centroidX = config.centroidX || fallbackCentroidX;
    const centroidY = config.centroidY || fallbackCentroidY;

    const start = engine.getNodeCount();

    // Create circle base
    createNodeCircle(engine, n - 1, config);

    const centerNode = new GraphNode(centroidX, centroidY);
    engine.addNode(centerNode);
    for (let i = 0; i < n - 1; i++) {
        engine.addEdge(centerNode, engine.nodes[i + start]);
    }

    return true;
}

/**
 * Create wheel graph
 * 
 * @param engine 
 * @param n 
 * @param config 
 */
export function createWheel(engine: GraphingEngine, n: number, config: CircleConfig = {}): boolean {

    if (n < 4) {
        return false;
    }

    const centroidX = config.centroidX || fallbackCentroidX;
    const centroidY = config.centroidY || fallbackCentroidY;

    const start = engine.getNodeCount();

    // Create circle base
    createCycle(engine, n - 1, config);

    const centerNode = new GraphNode(centroidX, centroidY);
    engine.addNode(centerNode);
    for (let i = 0; i < n - 1; i++) {
        engine.addEdge(centerNode, engine.nodes[i + start]);
    }

    return true;
}

/**
 * Create grid graph
 * 
 * @param engine 
 * @param n1 
 * @param n2 
 * @param config 
 */
export function createGrid(engine: GraphingEngine, n1: number, n2: number, config: CircleConfig = {}): boolean {

    // TODO: Do centering and sizing

    if (n1 < 1 || n2 < 1) {
        return false;
    }

    const centroidX = config.centroidX || fallbackCentroidX;
    const centroidY = config.centroidY || fallbackCentroidY;
    const radius = config.radius || fallbackRadius;

    const start = engine.getNodeCount();

    // Add nodes
    for (let i = 0; i < n1; i++) {
        for (let j = 0; j < n2; j++) {
            engine.addNode(new GraphNode(i * radius + centroidX, j * radius + centroidY));
        }
    }

    // Add horizontal edges
    for (let i = 0; i < n1; i++) {
        for (let j = 0; j < n2 - 1; j++) {
            const currNode = engine.nodes[n2 * i + j + start];
            const rightNode = engine.nodes[n2 * i + (j + 1) + start];
            engine.addEdge(currNode, rightNode);
        }
    }

    // Add vertical edges
    for (let i = 0; i < n1 - 1; i++) {
        for (let j = 0; j < n2; j++) {
            const currNode = engine.nodes[n2 * i + j + start];
            const downNode = engine.nodes[n2 * (i + 1) + j + start];
            engine.addEdge(currNode, downNode);
        }
    }

    return true;
}
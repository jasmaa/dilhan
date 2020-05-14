import * as fs from 'fs';
import GraphNode from './graphing/GraphNode';
import GraphEdge from './graphing/GraphEdge';

let loadedFile: string;

/**
 * Gets loaded file
 */
export function getLoadedFile(): string {
    return loadedFile;
}

/**
 * Read saved graph
 * 
 * @param path 
 */
export function readGraph(path: string): [GraphNode[], GraphEdge[]] {

    const data = JSON.parse(fs.readFileSync(path).toString());

    const nodes = [];
    for (const nodeData of data.nodes) {
        nodes.push(new GraphNode(nodeData.x, nodeData.y));
    }

    const edges = [];
    for (const edgeData of data.edges) {
        edges.push(new GraphEdge(nodes[edgeData.node1], nodes[edgeData.node2], edgeData.n));
    }

    // Remember loaded file
    loadedFile = path;

    return [nodes, edges];
}

/**
 * Write graph to JSON
 * 
 * @param path 
 * @param nodes 
 * @param edges 
 */
export function writeGraph(path: string, nodes: GraphNode[], edges: GraphEdge[]): boolean {

    // Abort if no path provided
    if (!path) {
        return false;
    }

    const writeNodes = [];
    for (const node of nodes) {
        writeNodes.push({
            x: node.x,
            y: node.y,
        });
    }

    const writeEdges = [];
    for (const edge of edges) {
        writeEdges.push({
            node1: nodes.indexOf(edge.node1),
            node2: nodes.indexOf(edge.node2),
            n: edge.n,
        });
    }

    const data = {
        nodes: writeNodes,
        edges: writeEdges,
    };

    fs.writeFileSync(path, JSON.stringify(data));

    // Remember loaded file
    loadedFile = path;

    return true;
}
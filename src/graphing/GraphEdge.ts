import GraphNode from "./GraphNode";

/**
 * Graph edge
 */
export default class GraphEdge {
    
    n: number;

    constructor(public node1: GraphNode, public node2: GraphNode) {
        this.n = 1;
    }
}
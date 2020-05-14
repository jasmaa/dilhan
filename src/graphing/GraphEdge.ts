import GraphNode from "./GraphNode";

/**
 * Graph edge
 */
export default class GraphEdge {

    constructor(public node1: GraphNode, public node2: GraphNode, public n: number = 1) { }
}
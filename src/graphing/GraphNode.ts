/**
 * Graph node
 */
export default class GraphNode {

    r: number;
    selected: boolean;
    neighbors: GraphNode[];

    constructor(public x: number, public y: number) {
        this.selected = false;
        this.neighbors = [];
        this.r = 10;
    }

    intersect(x: number, y: number) {
        return Math.pow(this.x - x, 2) + Math.pow(this.y - y, 2) <= Math.pow(this.r, 2);
    }
}
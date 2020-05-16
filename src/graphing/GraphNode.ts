/**
 * Graph node
 */
export default class GraphNode {

    r: number;
    selected: boolean;

    constructor(public x: number, public y: number, public color: string = 'blue', public name: string = '') {
        this.selected = false;
        this.r = 10;
    }

    intersect(x: number, y: number) {
        return Math.pow(this.x - x, 2) + Math.pow(this.y - y, 2) <= Math.pow(this.r, 2);
    }
}
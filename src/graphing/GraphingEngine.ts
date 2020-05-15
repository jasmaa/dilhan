import GraphNode from './GraphNode';
import GraphEdge from './GraphEdge';
import { calculateControl } from '../utils';

enum State {
    DRAGGING,
    GRABBING,
    IDLE,
}

/**
 * Graphing engine
 */
export default class GraphingEngine {

    nodes: GraphNode[] = [];
    edges: GraphEdge[] = [];
    state = State.IDLE;

    private ctx: CanvasRenderingContext2D;
    private dpr: number;
    private draggingNodes: GraphNode[] = [];
    private prevX: number;
    private prevY: number;
    private isMouseDown = false;

    constructor(ctx: CanvasRenderingContext2D, dpr: number) {
        this.ctx = ctx;
        this.dpr = dpr;
    }

    /**
     * Gets total node count
     */
    getNodeCount(): number {
        return this.nodes.length;
    }

    /**
     * Gets total edge count
     */
    getEdgeCount(): number {
        return this.edges.reduce((acc: number, edge: GraphEdge) => acc + edge.n, 0);
    }

    /**
     * Adds node to graph
     * @param node 
     */
    addNode(node: GraphNode): boolean {

        if (!node) {
            return false;
        }

        this.nodes.push(node);
        return true;
    }

    /**
     * Adds edge between nodes
     * 
     * @param node1 
     * @param node2 
     */
    addEdge(node1: GraphNode, node2: GraphNode): boolean {

        // Fail if either node doesn't exist
        if (!node1 || !node2) {
            return false;
        }

        for (const edge of this.edges) {
            if (edge.node1 === node1 && edge.node2 === node2 ||
                edge.node1 === node2 && edge.node2 === node1) {

                edge.n++;
                return true;
            }
        }

        return false;
    }

    /**
     * Removes nodes from graph
     * 
     * @param nodes 
     */
    deleteNodes(nodes: GraphNode[]): boolean {
        // Node deletion
        for (const node of nodes) {

            this.nodes.splice(this.nodes.indexOf(node), 1);

            const edgeBuffer = [...this.edges]; // Make a buffer for looping
            for (const edge of edgeBuffer) {
                if (edge.node1 === node || edge.node2 === node) {
                    this.edges.splice(this.edges.indexOf(edge), 1);
                }
            }
        }
        return true;
    }

    /**
     * Remove edge between nodes
     * 
     * @param node1 
     * @param node2 
     */
    deleteEdge(node1: GraphNode, node2: GraphNode): boolean {

        if (!node1 || !node2) {
            return false;
        }

        const edgeBuffer = [...this.edges]; // Make a buffer for looping
        for (const edge of edgeBuffer) {
            if (edge.node1 === node1 && edge.node2 === node2 ||
                edge.node1 === node2 && edge.node2 === node1) {

                //edges.splice(edges.indexOf(edge), 1);
                edge.n--;
                return true
            }
        }

        return false;
    }

    /**
     * Clear graph
     */
    clear() {
        this.nodes = [];
        this.edges = [];
    }

    /**
     * Render graph
     */
    render() {

        this.ctx.clearRect(0, 0, this.ctx.canvas.width * this.dpr, this.ctx.canvas.height * this.dpr);

        this.ctx.lineWidth = 3 * this.dpr;

        // Render edges
        for (const edge of this.edges) {

            this.ctx.strokeStyle = 'black';

            for (let i = 0; i < edge.n; i++) {
                this.ctx.beginPath();
                this.ctx.moveTo(edge.node1.x * this.dpr, edge.node1.y * this.dpr);
                const { x, y } = calculateControl(
                    edge.node1.x, edge.node1.y,
                    edge.node2.x, edge.node2.y,
                    30, i
                );
                this.ctx.quadraticCurveTo(x * this.dpr, y * this.dpr, edge.node2.x * this.dpr, edge.node2.y * this.dpr);
                this.ctx.stroke();
                this.ctx.closePath();
            }
        }

        // Render nodes
        for (const node of this.nodes) {

            if (node.selected) {
                this.ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
                this.ctx.beginPath();
                this.ctx.arc(node.x * this.dpr, node.y * this.dpr, 1.5 * node.r * this.dpr, 0, 2 * Math.PI);
                this.ctx.fill();
                this.ctx.closePath();
            }

            this.ctx.fillStyle = 'blue';
            this.ctx.strokeStyle = 'black';
            this.ctx.beginPath();
            this.ctx.arc(node.x * this.dpr, node.y * this.dpr, node.r * this.dpr, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.stroke();
            this.ctx.closePath();
        }

        // Render graph info
        this.ctx.fillStyle = 'black';
        this.ctx.textBaseline = 'hanging';
        this.ctx.font = "40px Arial";
        this.ctx.fillText(`Nodes: ${this.getNodeCount()}`, 10, 10);
        this.ctx.fillText(`Edges: ${this.getEdgeCount()}`, 10, 40);
    }

    /**
     * Selects or deselects all nodes
     * @param v 
     */
    setAll(v: boolean): void {
        for (const node of this.nodes) {
            node.selected = v;
        }
    }

    // === Handlers ===

    onmousedownHandler(e: MouseEvent) {
        // Drag
        if (e.button === 0) {

            this.prevX = e.x;
            this.prevY = e.y;

            for (const node of this.nodes) {
                if (node.intersect(e.x, e.y)) {
                    this.draggingNodes = [node];
                    break;
                }
            }
        }

        this.isMouseDown = true;
    }

    onmousemoveHandler(e: MouseEvent) {

        if (this.isMouseDown) {
            this.state = State.DRAGGING;
        }

        // Drag nodes
        if (this.state === State.DRAGGING || this.state === State.GRABBING) {

            const diffX = e.x - this.prevX;
            const diffY = e.y - this.prevY;

            for (const node of this.draggingNodes) {
                node.x += diffX;
                node.y += diffY;
            }

            this.render();
        }

        this.prevX = e.x;
        this.prevY = e.y;
    }

    onmouseupHandler(e: MouseEvent) {

        if (e.button === 0) {
            // Select node if not dragging
            if (this.state === State.IDLE) {
                for (const node of this.nodes) {
                    if (node.intersect(e.x, e.y)) {
                        node.selected = !node.selected;
                        break;
                    }
                }
            } else if (this.state === State.GRABBING) {
                this.setAll(false);
            }
            this.render();
        } else if (e.button === 2) {

            // Create new node
            this.addNode(new GraphNode(e.x, e.y))
            this.setAll(false);
            this.render();
        }

        // Emptry drag buffer
        if (this.draggingNodes.length > 0) {
            this.draggingNodes = [];
        }

        this.state = State.IDLE;
        this.isMouseDown = false;
    }

    onkeyupHandler(e: KeyboardEvent) {

        const selectedNodes = this.nodes.filter(n => n.selected);

        switch (e.keyCode) {
            case 70:
                // Edge addition
                if (selectedNodes.length === 2 && this.state === State.IDLE) {
                    const isEdgeFound = this.addEdge(selectedNodes[0], selectedNodes[1]);
                    if (!isEdgeFound) {
                        //selectedNodes[0].neighbors.push(selectedNodes[1]);
                        //selectedNodes[1].neighbors.push(selectedNodes[0]);
                        this.edges.push(new GraphEdge(selectedNodes[0], selectedNodes[1]));
                    }

                    this.state = State.IDLE;
                    this.setAll(false);
                }
                this.render();
                break;
            case 65:
                // Toggle select all
                this.setAll(selectedNodes.length < this.nodes.length);
                this.render();
                break;
            case 71:
                // Turn on grabbing
                if (selectedNodes.length > 0) {
                    this.state = State.GRABBING;
                    this.draggingNodes = selectedNodes;
                }
                break;
            case 46:
                // Node deletion
                this.deleteNodes(selectedNodes);
                this.render();
                break;
            case 68:
                // Edge deletion
                if (selectedNodes.length === 2) {
                    const isEdgeDeleted = this.deleteEdge(selectedNodes[0], selectedNodes[1]);
                    if (isEdgeDeleted) {
                        this.setAll(false);
                        this.render();
                    }
                }
                break;
            default:
                break;
        }
    }
}
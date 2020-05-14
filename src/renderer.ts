import GraphNode from './graphing/GraphNode';
import GraphEdge from './graphing/GraphEdge';
import { calculateControl } from './utils';
import './styles.css';

enum State {
    DRAGGING,
    GRABBING,
    IDLE,
}

const canvas = <HTMLCanvasElement>document.getElementById('mainCanvas');
const ctx = canvas.getContext('2d');

const nodes: GraphNode[] = [];
const edges: GraphEdge[] = [];

let draggingNodes: GraphNode[] = [];
let prevX: number;
let prevY: number;

let isMouseDown = false;
let state: State = State.IDLE;

/**
 * Selects or deselects all nodes
 * @param v 
 */
function setAll(v: boolean): void {
    for (const node of nodes) {
        node.selected = v;
    }
}

/**
 * Render graph
 */
function render(): void {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const edge of edges) {

        ctx.strokeStyle = 'cyan';

        for (let i = 0; i < edge.n; i++) {
            ctx.beginPath();
            ctx.moveTo(edge.node1.x, edge.node1.y);
            const { x, y } = calculateControl(edge.node1.x, edge.node1.y, edge.node2.x, edge.node2.y, 30, i);
            ctx.quadraticCurveTo(x, y, edge.node2.x, edge.node2.y);
            ctx.stroke();
            ctx.closePath();
        }
    }

    for (const node of nodes) {

        if (node.selected) {
            ctx.fillStyle = 'red';
        } else {
            ctx.fillStyle = 'black';
        }

        ctx.beginPath();
        ctx.arc(node.x, node.y, 10, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }
}

// === Event handlers ===

function resize(): void {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.onload = () => {
    resize();
    render();
}
window.onresize = () => {
    resize();
    render();
}

canvas.onmousedown = e => {

    // Drag
    if (e.button === 0) {

        prevX = e.x;
        prevY = e.y;

        for (const node of nodes) {
            if (node.intersect(e.x, e.y)) {
                draggingNodes = [node];
                break;
            }
        }
    }

    isMouseDown = true;
}
canvas.onmousemove = e => {

    if (isMouseDown) {
        state = State.DRAGGING;
    }

    // Drag nodes
    if (state === State.DRAGGING || state === State.GRABBING) {

        const diffX = e.x - prevX;
        const diffY = e.y - prevY;

        for (const node of draggingNodes) {
            node.x += diffX;
            node.y += diffY;
        }

        render();
    }

    prevX = e.x;
    prevY = e.y;
}
canvas.onmouseup = e => {

    if (e.button === 0) {
        // Select node if not dragging
        if (state === State.IDLE) {
            for (const node of nodes) {
                if (node.intersect(e.x, e.y)) {
                    node.selected = !node.selected;
                }
            }
        } else if (state === State.GRABBING) {
            setAll(false);
        }
        render();
    } else if (e.button === 2) {
        // Create new node
        nodes.push(new GraphNode(e.x, e.y));
        setAll(false);
        render();
    }

    // Emptry drag buffer
    if (draggingNodes.length > 0) {
        draggingNodes = [];
    }

    state = State.IDLE;
    isMouseDown = false;
}

document.onkeyup = e => {

    const selectedNodes = nodes.filter(n => n.selected);

    switch (e.keyCode) {
        case 70:
            // Edge addition
            if (selectedNodes.length === 2 && state === State.IDLE) {

                let isEdgeFound = false;
                for (const edge of edges) {
                    if (edge.node1 === selectedNodes[0] && edge.node2 === selectedNodes[1] ||
                        edge.node1 === selectedNodes[1] && edge.node2 === selectedNodes[0]) {

                        edge.n++;
                        isEdgeFound = true;
                        break;
                    }
                }

                if (!isEdgeFound) {
                    selectedNodes[0].neighbors.push(selectedNodes[1]);
                    selectedNodes[1].neighbors.push(selectedNodes[0]);
                    edges.push(new GraphEdge(selectedNodes[0], selectedNodes[1]));
                }

                state = State.IDLE;
                setAll(false);
            }
            render();
            break;
        case 65:
            // Toggle select all
            setAll(selectedNodes.length < nodes.length);
            render();
            break;
        case 71:
            // Turn on grabbing
            if (selectedNodes.length > 0) {
                state = State.GRABBING;
                draggingNodes = selectedNodes;
            }
            break;
        case 68:
            // Edge deletion
            if (selectedNodes.length === 2) {
                const edgeBuffer = [...edges]; // Make a buffer for looping
                for (const edge of edgeBuffer) {
                    if (edge.node1 === selectedNodes[0] && edge.node2 === selectedNodes[1] ||
                        edge.node1 === selectedNodes[1] && edge.node2 === selectedNodes[0]) {

                        //edges.splice(edges.indexOf(edge), 1);
                        edge.n--;

                        break;
                    }
                }
            }
            render();
            break;
        case 46:
            // Node deletion
            for (const node of selectedNodes) {

                nodes.splice(nodes.indexOf(node), 1);

                const edgeBuffer = [...edges]; // Make a buffer for looping
                for (const edge of edgeBuffer) {
                    if (edge.node1 === node || edge.node2 === node) {
                        edges.splice(edges.indexOf(edge), 1);
                    }
                }
            }
            render();
            break;
        default:
            break;
    }
}
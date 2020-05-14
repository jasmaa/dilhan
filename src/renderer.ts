import './styles.css';
import GraphNode from './graphing/GraphNode';
import GraphEdge from './graphing/GraphEdge';

enum State {
    DRAGGING,
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

function setAll(v: boolean): void {
    for (const node of nodes) {
        node.selected = v;
    }
}

function render(): void {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const edge of edges) {

        ctx.strokeStyle = 'cyan';
        ctx.beginPath();
        ctx.moveTo(edge.node1.x, edge.node1.y);
        ctx.lineTo(edge.node2.x, edge.node2.y);
        ctx.closePath();
        ctx.stroke();
    }

    for (const node of nodes) {

        if (node.selected) {
            ctx.fillStyle = 'red';
        } else {
            ctx.fillStyle = 'black';
        }

        ctx.beginPath();
        ctx.arc(node.x, node.y, 10, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
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

    // Drag nodes
    if (isMouseDown || state === State.DRAGGING) {

        state = State.DRAGGING;

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
        if (state !== State.DRAGGING) {
            for (const node of nodes) {
                if (node.intersect(e.x, e.y)) {
                    node.selected = !node.selected;
                }
            }
        } else {
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
            // Edge connection
            if (selectedNodes.length === 2) {
                selectedNodes[0].neighbors.push(selectedNodes[1]);
                selectedNodes[1].neighbors.push(selectedNodes[0]);
                edges.push(new GraphEdge(selectedNodes[0], selectedNodes[1]));
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
            state = State.DRAGGING;
            draggingNodes = selectedNodes;
            break;
        default:
            break;
    }
}
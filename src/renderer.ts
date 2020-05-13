import './styles.css';
import GraphNode from './graphing/GraphNode';
import GraphEdge from './graphing/GraphEdge';

const canvas = <HTMLCanvasElement>document.getElementById('mainCanvas');
const ctx = canvas.getContext('2d');

const nodes: GraphNode[] = [];
const edges: GraphEdge[] = [];

let isDragging = false;
let draggingNodes: GraphNode[] = [];
let prevX: number;
let prevY: number;

ctx.fillStyle = 'red';

function render(): void {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, 10, 0, 2 * Math.PI);
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

        for (const n of nodes) {
            if (n.intersect(e.x, e.y)) {
                draggingNodes = [n];
                break;
            }
        }

        console.log(draggingNodes);
    }

    console.log('start drag');
    isDragging = true;
}
canvas.onmousemove = e => {
    if (isDragging) {
        const diffX = e.x - prevX;
        const diffY = e.y - prevY;
        prevX = e.x;
        prevY = e.y;

        for(const n of draggingNodes){
            n.x += diffX;
            n.y += diffY;
        }

        render();
    }
}
canvas.onmouseup = e => {

    // Create new node
    if (e.button === 2) {
        nodes.push(new GraphNode(e.x, e.y));
        render();
    }

    if (draggingNodes.length > 0) {
        draggingNodes = [];
    }

    isDragging = false;
}
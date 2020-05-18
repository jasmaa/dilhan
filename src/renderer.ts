import { remote, ipcRenderer } from 'electron';
import 'bootstrap/dist/css/bootstrap.min.css';

import GraphingEngine from './graphing/GraphingEngine';
import { readGraph, writeGraph, getLoadedFile, clearLoadedFile } from './serialize';
import './styles.css';

const dpr = window.devicePixelRatio || 1;

const canvas = <HTMLCanvasElement>document.getElementById('mainCanvas');
const ctx = canvas.getContext('2d');

const controlPanelElement = document.getElementById('controlPanel');
const nodeCountElement = document.getElementById('nodeCount');
const edgeCountElement = document.getElementById('edgeCount');
const colorSelectElements = document.getElementsByClassName('color-radio');
const nodeNameInputElement = <HTMLInputElement>document.getElementById('nodeNameInput');

let isControlPanelOpen = false;

/**
 * Set visibility of control panel
 * 
 * @param visible 
 */
function setControlPanelVisible(visible: boolean): void {
    if (visible) {
        controlPanelElement.style.maxHeight = '20em';
        controlPanelElement.style.visibility = 'visible';

    } else {
        controlPanelElement.style.maxHeight = '0em';
        setTimeout(() => controlPanelElement.style.visibility = 'hidden', 150);
    }

    isControlPanelOpen = visible;
}

// === Init handlers ===

for (const v of Array.from(colorSelectElements)) {
    const colorCell = <HTMLInputElement>v;
    colorCell.onclick = () => {
        engine.nodes
            .filter(node => node.selected)
            .forEach(node => node.color = colorCell.value);
        engine.render();
    }
}

nodeNameInputElement.oninput = e => {
    engine.nodes
        .filter(node => node.selected)
        .forEach(node => node.name = (<HTMLInputElement>e.target).value);
    engine.render();
}


const engine = new GraphingEngine(ctx, dpr, (engine: GraphingEngine) => {

    // Update UI
    nodeCountElement.innerHTML = `Vertices: ${engine.getNodeCount()}`;
    edgeCountElement.innerHTML = `Edges: ${engine.getEdgeCount()}`;

    const selectedNodes = engine.nodes.filter(node => node.selected);
    if (selectedNodes.length === 1 && !isControlPanelOpen) {

        // Set control panel
        for (const v of Array.from(colorSelectElements)) {
            const colorCell = <HTMLInputElement>v;
            colorCell.checked = colorCell.value === selectedNodes[0].color;
        }

        nodeNameInputElement.value = selectedNodes[0].name;

        setControlPanelVisible(true);

    } else if (selectedNodes.length !== 1 && isControlPanelOpen) {

        setControlPanelVisible(false);
    }

    // Update save state
    ipcRenderer.send('setIsNeedSaving', true);
});

// === Event handlers ===

function resize(): void {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.scale(1 / dpr, 1 / dpr);
}

window.onload = () => {
    resize();
    engine.render();
}
window.onresize = () => {
    resize();
    engine.render();
}

canvas.onmousedown = e => {
    engine.onmousedownHandler(e);
};
canvas.onmousemove = e => {
    engine.onmousemoveHandler(e);
}
canvas.onmouseup = e => {
    engine.onmouseupHandler(e);
}
canvas.onkeyup = e => {
    engine.onkeyupHandler(e);
}

// === Menu handlers ===

const version = process.env.npm_package_version || remote.app.getVersion();

ipcRenderer.on('menu', async (event, arg) => {
    switch (arg) {

        case 'new':
            {
                engine.clear();
                engine.render();

                clearLoadedFile();
                ipcRenderer.send('setIsNeedSaving', true);

                remote.getCurrentWindow().setTitle(`Untitled - Dilhan v${version}`);

                // Rebuild menu
                ipcRenderer.send('setSaveEnabled', false);
            }
            break;

        case 'open':
            {
                const res = await remote.dialog.showOpenDialog({
                    properties: ['openFile'],
                    filters: [
                        { name: "JSON", extensions: ["json"] },
                    ],
                });

                if (res.filePaths.length > 0) {
                    const [readNodes, readEdges] = readGraph(res.filePaths[0]);
                    engine.nodes = readNodes;
                    engine.edges = readEdges;
                    engine.render();

                    ipcRenderer.send('setIsNeedSaving', false);

                    remote.getCurrentWindow().setTitle(`${res.filePaths[0]} - Dilhan v${version}`);

                    // Rebuild menu
                    ipcRenderer.send('setSaveEnabled', true);
                }
            }
            break;

        case 'save':
            {
                const loadedFile = getLoadedFile();
                if (loadedFile) {
                    writeGraph(loadedFile, engine.nodes, engine.edges);
                    ipcRenderer.send('setIsNeedSaving', false);
                }
            }
            break;

        case 'saveAs':
            {
                const res = await remote.dialog.showSaveDialog({
                    filters: [{
                        name: 'JSON',
                        extensions: ['json']
                    }],
                });

                const isSaved = writeGraph(res.filePath, engine.nodes, engine.edges);
                if (isSaved) {

                    ipcRenderer.send('setIsNeedSaving', false);

                    remote.getCurrentWindow().setTitle(`${res.filePath} - Dilhan v${version}`);

                    // Rebuild menu
                    ipcRenderer.send('setSaveEnabled', true);
                }
            }
            break;

        default:
            break;
    }
});
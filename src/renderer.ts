import { remote, ipcRenderer } from 'electron';
import 'bootstrap/dist/css/bootstrap.min.css';

import GraphingEngine from './graphing/GraphingEngine';
import { readGraph, writeGraph, getLoadedFile } from './serialize';
import './styles.css';

const dpr = window.devicePixelRatio || 1;

const canvas = <HTMLCanvasElement>document.getElementById('mainCanvas');
const ctx = canvas.getContext('2d');

const controlPanelElement = document.getElementById('controlPanel');
let isControlPanelOpen = false;
const nodeCountElement = document.getElementById('nodeCount');
const edgeCountElement = document.getElementById('edgeCount');
const colorSelectElements = document.getElementsByClassName('color-radio');

// Init handler on color picker
for (const v of Array.from(colorSelectElements)) {
    const colorCell = <HTMLInputElement>v;
    colorCell.onclick = () => {
        engine.nodes
            .filter(n => n.selected)
            .forEach(n => {
                n.color = colorCell.value;
            });
        engine.render();
    }
}

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

const engine = new GraphingEngine(ctx, dpr, (engine: GraphingEngine) => {

    // Update UI
    nodeCountElement.innerHTML = `Vertices: ${engine.getNodeCount()}`;
    edgeCountElement.innerHTML = `Edges: ${engine.getEdgeCount()}`;

    const selectedNodes = engine.nodes.filter(n => n.selected);
    if (selectedNodes.length === 1 && !isControlPanelOpen) {
        // Set correct color cell
        for (const v of Array.from(colorSelectElements)) {
            const colorCell = <HTMLInputElement>v;
            colorCell.checked = colorCell.value === selectedNodes[0].color;
        }
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
document.onkeyup = e => {
    engine.onkeyupHandler(e);
}

// === Menu ===

const version = process.env.npm_package_version || remote.app.getVersion();

const menuTemplate = [{
    label: 'File',
    submenu: [
        {
            label: 'New',
            click() {
                engine.clear();
                engine.render();
            }
        },
        {
            label: 'Open...',
            async click() {
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
                    menuTemplate[0].submenu[2].enabled = true;

                    // Rebuild menu
                    const menu = remote.Menu.buildFromTemplate(menuTemplate);
                    remote.Menu.setApplicationMenu(menu);
                }
            }
        },
        {
            label: 'Save',
            enabled: false,
            async click() {
                const loadedFile = getLoadedFile();
                if (loadedFile) {
                    writeGraph(loadedFile, engine.nodes, engine.edges);
                    ipcRenderer.send('setIsNeedSaving', false);
                }
            }
        },
        {
            label: 'Save As...',
            async click() {
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
                    menuTemplate[0].submenu[2].enabled = true;

                    // Rebuild menu
                    const menu = remote.Menu.buildFromTemplate(menuTemplate);
                    remote.Menu.setApplicationMenu(menu);
                }
            }
        },
        {
            label: 'Exit',
            click() {
                remote.app.quit();
            }
        },
    ],
}];

const menu = remote.Menu.buildFromTemplate(menuTemplate);
remote.Menu.setApplicationMenu(menu);
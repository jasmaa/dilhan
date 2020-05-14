import { remote, ipcRenderer } from 'electron';

import { readGraph, writeGraph, getLoadedFile } from './serialize';
import './styles.css';
import GraphingEngine from './graphing/GraphingEngine';

const canvas = <HTMLCanvasElement>document.getElementById('mainCanvas');
const ctx = canvas.getContext('2d');

const engine = new GraphingEngine(ctx);

// === Event handlers ===

function resize(): void {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
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
    ipcRenderer.send('setIsNeedSaving', true);
}
document.onkeyup = e => {
    engine.onkeyupHandler(e);
    ipcRenderer.send('setIsNeedSaving', true);
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
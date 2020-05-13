import { app, BrowserWindow } from 'electron';
import * as path from 'path';

let win: Electron.BrowserWindow;

app.on('ready', () => {
    win = new BrowserWindow({
        height: 600,
        width: 800,
    });
    win.loadFile(path.join(__dirname, "../index.html"));

    win.webContents.openDevTools();
});
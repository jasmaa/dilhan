import { app, BrowserWindow } from 'electron';

let win: Electron.BrowserWindow;

app.on('ready', () => {

    win = new BrowserWindow({
        height: 600,
        width: 800,
    });
    
    win.loadFile('index.html');

    // open dev tools for now
    win.webContents.openDevTools();

    win.on('closed', () => {
        app.quit();
    });
});
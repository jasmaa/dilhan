import { app, BrowserWindow } from 'electron';

let win: Electron.BrowserWindow;
const version = process.env.npm_package_version || app.getVersion();

function createWindow() {
    win = new BrowserWindow({
        title: `Dilhan - v${version}`,
        height: 600,
        width: 800,
        webPreferences: {
            webSecurity: false
        },
    });

    win.loadFile('index.html');

    // open dev tools for now
    // win.webContents.openDevTools();
}

app.on('ready', createWindow);

// Keep application running on mac even when all windows closed
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

// Re-create window on mac if first window open again
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
});
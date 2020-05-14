import { app, dialog, BrowserWindow } from 'electron';

let win: Electron.BrowserWindow;
const version = process.env.npm_package_version || app.getVersion();

app.allowRendererProcessReuse = true;

function createWindow() {
    win = new BrowserWindow({
        title: `Untitled - Dilhan v${version}`,
        height: 600,
        width: 800,
        icon: 'src/logo.png',
        webPreferences: {
            nodeIntegration: true,
        },
    });

    // win.webContents.openDevTools();

    win.loadFile('index.html');

    win.on('close', e => {
        const choice = dialog.showMessageBoxSync({
            type: 'question',
            buttons: ['Yes', 'No'],
            title: 'Confirm',
            message: 'Are you sure you want to quit?'
        });
        if (choice === 1) {
            e.preventDefault();
        }
    });
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
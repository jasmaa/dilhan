import { app, dialog, ipcMain, BrowserWindow, Menu } from 'electron';

let win: Electron.BrowserWindow;
const version = process.env.npm_package_version || app.getVersion();

app.allowRendererProcessReuse = true;

let isNeedSaving = false;
ipcMain.on('setIsNeedSaving', (event, arg) => {
    isNeedSaving = arg;
})

// === Menu ===

const menuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'New',
                click() {
                    win.webContents.send('file', 'new');
                }
            },
            {
                label: 'Open...',
                async click() {
                    win.webContents.send('file', 'open');
                }
            },
            {
                label: 'Save',
                enabled: false,
                async click() {
                    win.webContents.send('file', 'save');
                }
            },
            {
                label: 'Save As...',
                async click() {
                    win.webContents.send('file', 'saveAs');
                }
            },
            {
                label: 'Exit',
                click() {
                    app.quit();
                }
            },
        ],
    },
    {
        label: 'Generate',
        submenu: [
            {
                label: 'Common...',
                click() {
                    win.webContents.send('generate', 'common');
                }
            },
        ],
    },
];

ipcMain.on('setSaveEnabled', (event, arg) => {
    menuTemplate[0].submenu[2].enabled = arg;
    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);
});


// === Main app ===

function createWindow() {
    win = new BrowserWindow({
        title: `Untitled - Dilhan v${version}`,
        height: 600,
        width: 800,
        icon: 'src/logo.png',
        show: false,
        webPreferences: {
            nodeIntegration: true,
        },
    });

    // win.webContents.openDevTools();

    win.loadFile('index.html');

    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);

    win.once('ready-to-show', () => {
        win.show();
    });

    win.on('close', e => {
        if (isNeedSaving) {
            const choice = dialog.showMessageBoxSync({
                type: 'question',
                buttons: ['Yes', 'No'],
                title: 'Confirm',
                message: 'Are you sure you want to quit?'
            });
            if (choice === 1) {
                e.preventDefault();
            }
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
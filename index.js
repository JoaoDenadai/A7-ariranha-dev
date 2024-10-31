const {app, BrowserWindow, ipcMain} = require('electron');

function electronWindowInstanceGenerate()
{
    const hWindow = new BrowserWindow({
        width: 350,
        height: 300,
        resizable: true,
        webPreferences: {
            nodeIntegration: true,
        }
    });
    hWindow.setMenu(null);
    hWindow.loadFile('./src/Index.html')
};

app.whenReady().then(electronWindowInstanceGenerate);
import { app, BrowserWindow, screen } from 'electron';
import * as path from 'path';
import * as url from 'url';
import { Tail } from 'tail';
import { fstat } from 'fs';
const isDev = require('electron-is-dev');

let win, serve;
const args = process.argv.slice(1);
serve = args.some(val => val === '--serve');

function createWindow() {

    const electronScreen = screen;
    const size = electronScreen.getPrimaryDisplay().workAreaSize;

    // Create the browser window.
    win = new BrowserWindow({
        x: 0,
        y: 0,
        width: size.width / 2,
        height: size.height / 2
    });

    // const window = new BrowserWindow({
    //     width: 200,
    //     height: 200,
    //     resizable: false,
    //     movable: false,
    //     focusable: false,
    //     alwaysOnTop: true,
    //     show: false,
    //   });


    let logUri = "";

    if(isDev) {
        console.log("Using Local output_log");
        logUri="./output_log.txt"
    } else {
        console.log("Using Game output_log");
        if (process.platform === 'win32') {
            logUri = process.env.APPDATA.replace(
                'Roaming',
                'LocalLow\\Wizards Of The Coast\\MTGA\\output_log.txt'
            );
        } else {
            // Path for Wine, could change depending on installation method
            logUri =
                process.env.HOME +
                '/.wine/drive_c/user/' +
                process.env.USER +
                '/AppData/LocalLow/Wizards of the Coast/MTGA/output_log.txt';
        }
    }

    console.log("--------------------------------------------------------------------------------------------------");

    const decklists = "<== Deck.GetDeckLists";

    if (serve) {
        require('electron-reload')(__dirname, {
            electron: require(`${__dirname}/node_modules/electron`)
        });
        win.loadURL('http://localhost:4200');
    } else {
        win.loadURL(url.format({
            pathname: path.join(__dirname, 'dist/index.html'),
            protocol: 'file:',
            slashes: true
        }));
    }


    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store window
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
    });

}

try {

    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    app.on('ready', createWindow);

    // Quit when all windows are closed.
    app.on('window-all-closed', () => {
        // On OS X it is common for applications and their menu bar
        // to stay active until the user quits explicitly with Cmd + Q
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });

    app.on('activate', () => {
        // On OS X it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (win === null) {
            createWindow();
        }
    });

} catch (e) {
    // Catch Error
    // throw e;
}

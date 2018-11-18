import { ILogInterpreter } from './services/LogInterpreter/ILogInterpreter';
import { app, BrowserWindow, screen } from 'electron';
import * as path from 'path';
import * as url from 'url';
import { TYPES } from './inject/TYPES';
import container from './inject/inversify.config';
import { IUserService } from './services/UserService/IUserService';
import { ILiveLogReader } from './services/LiveLogReader/ILiveLogReader';

let win, serve;
const args = process.argv.slice(1);
serve = args.some(val => val === '--serve');

const logInterpreter = container.get<ILogInterpreter>(TYPES.ILogInterpreter);
const userService = container.get<IUserService>(TYPES.IUserService);
const liveLogReader = container.get<ILiveLogReader>(TYPES.ILiveLogReader);

function init() {
    logInterpreter.transaction(async () => {
        const currentDecks = await logInterpreter.getLocalDecks();
        const userId = await logInterpreter.getUserId();

        await userService.anonymous(userId);
        await userService.addDecksToRemote(currentDecks);
    })

    liveLogReader.startGameSession();

    setTimeout(() => {
        liveLogReader.endGameSession();
    }, 30000);
}

function createWindow() {
    init();

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

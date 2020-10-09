// Dependencies
const electron = require('electron');
const { app, BrowserWindow } = require('electron');
const client = require('discord-rich-presence')("750914713977749556");

// Load version from package.json
const { version } = require("./package.json");

let url = "https://panel.bluefoxhost.com";
let date = new Date();
let win;

// Loads modules
require('./modules/functions.js')(client);

app.on('ready', async () => {

    win = new BrowserWindow({
        title: `BlueFox App Starting... (v${version})`,
        icon: "./images/icon/bluefox.ico",
        center: true,
        resizable: true,
        width: 1200,
        height: 1000,
        webPreferences: {
            nodeIntegration: false,
            show: false
        }
    });

    win.removeMenu();
    await win.loadURL(url);

    win.webContents.on("devtools-opened", () => {
        win.webContents.closeDevTools();
    });
    
    // load custom scrollbar
    win.webContents.on('did-finish-load', () => {
        win.webContents.insertCSS(`
            ::-webkit-scrollbar {
                width: 30px;
            }

            ::-webkit-scrollbar-track {
                background: #1e1d37; 
            }
                
            ::-webkit-scrollbar-thumb {
                background: #2a2949; 
            }

            ::-webkit-scrollbar-thumb:hover {
                background: #23223f; 
            }
        `);
    });

    win.once('ready-to-show',async () => {
        win.show();
    });

    win.on('closed',() => {
        win = null;
    });

    win.on('page-title-updated', async () => {
        console.log(win.webContents.get)
        await client.updatePresence({
            state: win.webContents.getTitle().split(" - ")[1].replace("Viewing Server", ""),
            details: win.webContents.getTitle().split(" - ")[0],
            startTimestamp: date,
            largeImageKey: "bluefox",
            largeImageText: "BlueFoxHost.com",
            smallImageKey: "info",
            smallImageText: `v${version}`
        });
    })

    win.on('focus', async () => {
        await client.updatePresence({
            state: "Page: " + win.webContents.getTitle().split(" - ")[1].replace("Viewing Server", ""),
            details: "Site: " + win.webContents.getTitle().split(" - ")[0],
            startTimestamp: date,
            largeImageKey: "bluefox",
            largeImageText: "BlueFoxHost.com",
            smallImageKey: "info",
            smallImageText: `v${version}`
        });
    });

    app.on('browser-window-blur', async () => {
        setTimeout(function() {
            if (win.isFocused()) return;
            client.updatePresence({
                details: "Idle",
                startTimestamp: new Date(),
                largeImageKey: "idle",
                largeImageText: "BlueFoxHost.com",
                smallImageKey: "info",
                smallImageText: `v${version}`
            });
            date = new Date();
        }, 30000)
    });

    app.on('window-all-closed', function () {
        if (process.platform !== 'darwin') app.quit()
    })

});

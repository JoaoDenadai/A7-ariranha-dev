//toolbar_settings.js
//
//Arquivo de lógica de funcionamento para a barra de título da janela principal.
//
//Criado por: João Denadai


//Importanto elementos HTML.
const minimizeButton = document.getElementById('title-bar-minimize-button') as HTMLButtonElement;
const closeButton = document.getElementById('title-bar-close-button') as HTMLButtonElement;

//Ao apertar o botão de fechar, ele irá enviar uma mensagem para o ipcMain do electron.
closeButton.addEventListener('click', () => {
    const {ipcRenderer} = require('electron');
    ipcRenderer.send('window-main-close');
});

//Ao apertar o botão de minimizar, ele irá enviar uma mensagem para o ipcMain do electron.
minimizeButton.addEventListener('click', () => {
    const {ipcRenderer} = require('electron');
    ipcRenderer.send('window-main-minimize');
})

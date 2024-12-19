//toolbar_settings.js
//
//Arquivo de lógica de funcionamento para a barra de título do aplicativo da janela de configurações.
//
//Criado por: João Denadai

//Importando elementos do HTML.
const minimizeButtonConfig = document.getElementById('title-bar-minimize-button-config') as HTMLButtonElement;
const closeButtonConfig = document.getElementById('title-bar-close-button-config') as HTMLButtonElement;


//Event listener para que a barra de tarefa principal, ao apertar o botão de minimizar mande uma mensagem para o ipcMain.
minimizeButtonConfig.addEventListener('click', () => {
    const {ipcRenderer} = require('electron');
    //Envia 'window-main-minimize-config'
    ipcRenderer.send('window-main-minimize-config');
})

//Event listener para que a barra de tarefa principal, ao apertar o botão de fechar mande uma mensagem para o ipcMain.
closeButtonConfig.addEventListener('click', () => {
    const {ipcRenderer} = require('electron');
    //Envia 'window-main-close-config'
    ipcRenderer.send('window-main-close-config');
});

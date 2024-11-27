//Config.js
//
//Arquivo de lógica de funcionamento para abrir a janela de configuração.
//
//Criado por: João Denadai
import { throwNewLog } from "../Logs.js";

//Importando elementos.
//Nesse caso, o botão de "Configurações".
const CONFIG_button:HTMLInputElement = document.getElementById('Config-Button-element') as HTMLInputElement;


//Caso o botão seja apertado, ele joga um log de eventos e abre a nova janela.
//Ele abre através do processo de window. Ele vai se comunicar com o arquivo "index.js".
CONFIG_button.addEventListener('mousedown', function(event):void {
    throwNewLog('Trying to open window...', "CONFIG_button", "Clicked");

    //Isso aqui vai comunicar. Estamos passando o parâmetro de "Properties.html" enquanto também abrimos o arquivo.
    window.open('Properties.html', '_blank');
});
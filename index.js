//index.js
//
//Arquivo principal da execução do @electron, evitar alterações.
//Todo o processo de manutenção e execução da janela permanece aqui.
//
//Criado por: João Denadai.



//Importando o electron ao projeto.
//Está importando para as variáveis principais do programa.
//São constantes, não alterar.
const {app, BrowserWindow} = require('electron');


//Função da janela principal.
function electronWindowInstanceGenerate()
{
    //Janela principal.
    //Evitar alterar parâmetros dentro do "webPreferences".
    //Sinta-se livre para alterar parâmetros mais básicos como width e height.
    const hWindow = new BrowserWindow({
        width: 350,
        height: 300,
        resizable: true,
        webPreferences: {
            //Integração com o NodeJs.
            nodeIntegration: true,
        }
    });
    //Oculta o menu de ferramentas do @electron.
    //Não ativa, é muito feio.
    //Para ativar, apenas remova ou comente a linha abaixo.
    hWindow.setMenu(null);

    //Carrega o arquivo da interface HTML.
    hWindow.loadFile('./src/Index.html');
    //hWindow.webContents.openDevTools();
};

//Quando app finalizar o carregamento, a janela é exibida.
app.whenReady().then(electronWindowInstanceGenerate);
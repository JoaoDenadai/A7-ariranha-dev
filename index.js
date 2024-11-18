//index.js
//
//Arquivo principal da execução do @electron, evitar alterações.
//Todo o processo de manutenção e execução da janela permanece aqui.
//
//Criado por: João Denadai.

//Importando o electron ao projeto.
//Também importando o manipulador de arquivos.
//Está importando para as variáveis principais do programa.
//São constantes, não alterar.
const {app, BrowserWindow, ipcMain, dialog} = require('electron');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');
const fs = require('fs');
const filename = 'config.json';


//Adicionando ao log as informações de update.
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

//Inicializa os logs com informação de "Iniciando..."
log.info('Iniciando...');

//Função que carrega o arquivo de configuração JSON.
function Load_JSON()
{
    //Se o arquivo existir, ele retorna os dados do arquivo JSON.
    if(fs.existsSync(filename)) {
        //Retorno.
        return JSON.parse(fs.readFileSync(filename, 'utf8'));
        
    } 
    //Se não encontrar o arquivo.
    else 
    {
        //Modelo padrão do arquivo sendo salvo em uma variável.
        const defaultConfig = {
            window: {
                isResizable: false,
                theme: 0,
                devTools: false,
                devMode: false,
            },
            logs: {
                isEnabled: true,
            }
        };
        //Cria um novo arquivo com o modelo padrão.
        //Após isso, ele retorna o que está na configuração padrão.
        fs.writeFileSync(filename, JSON.stringify(defaultConfig, null, 2));
        return defaultConfig;
    }
};

//Carrega as informações do JSON em uma variável.
//ISSO NÃO É FEITO CONSTANTEMENTE, PRECISA SEMPRE CHAMAR A VARIÁVEL PARA ATUALIZAR.
let settings = Load_JSON();

//A janela de configurações.
//Inicia como "null" pois ela só será aberta após uma ação da janela principal.
let properties_hWindow = null;
let hWindow = null;

//Ao ser alterada alguuma configuração...
ipcMain.on('reload-page', (event) => {
    //A página será recarregada, aplicando as configurações.
    //Faz com que não seja necessário efetuar a reinicialização do programa para aplicar a configuração.
    hWindow.webContents.reload();
    properties_hWindow.webContents.reload();
});

//Recarrega apenas a página de configuração caso seja passado o 'reload-page-config' pelo IPC.
ipcMain.on('reload-page-config', (event) => {
    properties_hWindow.webContents.reload();
});

//Assim que o programa abrir...
app.on('ready', () => {
    //O electron-updater irá verificar se existem atualizações.
    //
    //As atualizações vem do GitHub, do diretório.
    //Ele sempre irá pegar pelo release.
    //
    autoUpdater.checkForUpdatesAndNotify();
});

//Caso exista uma atualização disponível...
autoUpdater.on('update-available', () => {
    //Aparecerá uma mensagem de diálogo que irá informar que existe uma nova atualização.
    //Vai aparecer em uma janela de mensagem.
    dialog.showMessageBox({
        type: 'info',
        title: 'Atualização disponível',
        message: 'Uma nova versão está disponível e será baixada em segundo plano.',
    });
});

//Assim que for instalado o update...
autoUpdater.on('update-downloaded', () => {
    //Irá aparecer uma janela de mensagem questionando se o usuário deseja reiniciar o programa.
    dialog.showMessageBox({
        type: 'info',
        title: 'Atualização pronta',
        message: 'Uma nova versão foi baixada. O aplicativo será atualizado ao reiniciar.',
        buttons: ['Reiniciar', 'Depois']
        //Então, caso seja "Reiniciar", ele irá fechar o programa.
    }).then(result => {
        if (result.response === 0) { // Se o usuário escolher "Reiniciar"
            autoUpdater.quitAndInstall();
        }
    });
});

//Função da janela principal.
function electronWindowInstanceGenerate()
{

    //Janela principal.
    //Evitar alterar parâmetros dentro do "webPreferences".
    //Sinta-se livre para alterar parâmetros mais básicos como width e height.
    hWindow = new BrowserWindow({
        width: 560,
        height: 490,
        maxWidth: 650,
        maxHeight: 490,
        resizable: settings.window.isResizable,
        webPreferences: {
            //Integração com o NodeJs.
            nodeIntegration: true,
            contextIsolation: false,
        }
    });
    //Oculta o menu de ferramentas do @electron.
    //Não ativa, é muito feio.
    //Para ativar, apenas remova ou comente a linha abaixo.
    hWindow.setMenu(null);

    //Carrega o arquivo da interface HTML.
    hWindow.loadFile('./src/Index.html');

    //Se a opção de DevTools estiver ligada, ele irá abrir os DevTools
    if(settings.window.devTools)
    {
        hWindow.openDevTools();
    }
    
    //Evento para abrir a nova janela (De configurações)
    hWindow.webContents.setWindowOpenHandler((event) => {

        //Se o evento passado for igual a "Properties.html" e a janela de configurações ainda estiver fechada, ele irá abrir.
        //Caso não seja null, ele não vai abrir a janela de configurações.
        if(event.url.includes('Properties.html') && properties_hWindow === null)
        {
            //Janela.
            properties_hWindow = new BrowserWindow({
                width: 450,
                height: 300,
                resizable: false,
                webPreferences: {
                    nodeIntegration: true,
                    contextIsolation: false,
                }
            });

            //Abre o DevTools caso esteja habilitada a configuração.
            if(settings.window.devTools)
            {
                properties_hWindow.openDevTools();
            }

            //Carrega o HTML da tela de configurações.
            properties_hWindow.loadFile("src/scripts/properties/Config.html");

            //Desabilita o menu.
            //O menu é muito feio.
            properties_hWindow.setMenu(null);

            //Previne que a janela seja aberta antes que todos os parâmetros sejam carregados.
            //Medida de segurança.
            properties_hWindow.once('ready-to-show', () => {
                properties_hWindow.show();
            });

            //Se fechar a janela, o "properties_hWindow" volta para nulo.
            //Permite que abra a janela mais de uma vez.
            properties_hWindow.on('closed', () => {
                properties_hWindow = null;
            });
        };
      
        return { action: 'deny' };
    });

    //Se a janela for fechada, ele vai "quitar" a variável app.
    hWindow.on('closed', () => {
        app.quit();
    });
};

//Quando app finalizar o carregamento, a janela é exibida.
app.whenReady().then(electronWindowInstanceGenerate);
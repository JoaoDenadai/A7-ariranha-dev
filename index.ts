//index.ts
//
//Arquivo principal da execução do @electron, evitar alterações.
//Todo o processo de manutenção e execução da janela permanece aqui.
//
//Criado por: João Denadai.
//Icone por: G-CAT


//---------------------------------------
//  Processo: Inclusões
//
//Importando o electron ao projeto.
//Também importando o manipulador de arquivos.
//Está importando para as variáveis principais do programa.
//São constantes, não alterar.
//Importando módulos do electron.
//Importando módulo fs, responsável por gerenciar e manipular arquivos.
const {app, BrowserWindow, ipcMain, dialog} = require ('electron');
const { autoUpdater } = require ('electron-updater');
const log = require ('electron-log');
const fs = require ('fs');
const path = require('path');


//---------------------------------------
//  Processo: Definições
//
//Interface de tipagem do array de configuração.
interface file {
    window: {
        isResizable: boolean,
        theme: string,
        devTools: boolean,
        devMode: boolean,
        updateInfo: boolean,
    },
    logs: {
        isEnabled: boolean,
    }
};




//---------------------------------------
//  Processo: Globais
//
//Modelo padrão do arquivo sendo salvo em uma variável.
const defaultConfig: any = {
    window: {
        isResizable: false,
        theme: "1",
        devTools: false,
        devMode: false,
        updateInfo: true,
    },
    logs: {
        isEnabled: true,
    }
};
//Nome do arquivo de configuração.
//Variável de configuração dos logs. Precisamos atribuir obrigatóriamente a tipagem em ambas.
const filename: string = 'config.json';
const transports: any = log.transports;

//Adicionando ao log as informações de update.
//Variável de transports, configuração de como e onde os logs serão enviados e armazenados.
//Inicializa os logs com informação de "Iniciando..."
autoUpdater.logger = log
transports.file.level = 'info';
log.info('Iniciando...');



//Carrega as informações do JSON em uma variável.
//ISSO NÃO É FEITO CONSTANTEMENTE, PRECISA SEMPRE CHAMAR A VARIÁVEL PARA ATUALIZAR.
//A janela de configurações.
//Inicia como "null" pois ela só será aberta após uma ação da janela principal.
let settings: file = Load_JSON();
let properties_hWindow: typeof BrowserWindow | null = null;
let hWindow:typeof BrowserWindow | null = null;
let updateWindow: typeof BrowserWindow | null = null;
let hUpdateWindow: typeof BrowserWindow | null = null;
let isNewVersionAvailable: boolean = false;


//---------------------------------------
//  Processo: Funções
//
function update_JSON(Custom:any):void
{   
    //Atualiza o arquivo JSON com base em uma variável.
    //Ele irá substituir TODO o arquivo.
    fs.writeFileSync(filename, JSON.stringify(Custom, null, 2));
};

function validateAndCorrectConfig(loadedSettings: any): void {
    // Verifica se a chave 'window' está presente, se não, adiciona com valor padrão
    if (!loadedSettings.window) {
        loadedSettings.window = defaultConfig.window;
    }

    // Verifica se a chave 'logs' está presente, se não, adiciona com valor padrão
    if (!loadedSettings.logs) {
        loadedSettings.logs = defaultConfig.logs;
    }

    // Agora, garantimos que todas as chaves dentro de 'window' estão presentes
    Object.keys(defaultConfig.window).forEach(key => {
        if (!(key in loadedSettings.window)) {
            loadedSettings.window[key] = defaultConfig.window[key];  // Adiciona a chave faltante
        }
    });

    // Garantimos que todas as chaves dentro de 'logs' estão presentes
    Object.keys(defaultConfig.logs).forEach(key => {
        if (!(key in loadedSettings.logs)) {
            loadedSettings.logs[key] = defaultConfig.logs[key];  // Adiciona a chave faltante
        }
    });
}

//Função que carrega o arquivo de configuração JSON.
function Load_JSON(): file
{
    let loadedSettings: any;

    try {
        // Verifica se o arquivo de configuração existe
        if (fs.existsSync(filename)) {
            // Tenta carregar o arquivo e fazer o parse para um objeto JSON
            loadedSettings = JSON.parse(fs.readFileSync(filename, 'utf8'));

            // Valida e corrige o arquivo, garantindo que todas as chaves necessárias estão presentes
            validateAndCorrectConfig(loadedSettings);

            // Se alguma chave foi corrigida, reescreve o arquivo com as configurações corrigidas
            if (JSON.stringify(loadedSettings) !== JSON.stringify(defaultConfig)) {
                console.log('Configurações corrigidas, atualizando o arquivo.');
                fs.writeFileSync(filename, JSON.stringify(loadedSettings, null, 2));
            }

        } else {
            // Se o arquivo não existe, cria com as configurações padrão
            console.log('Arquivo não encontrado, criando arquivo com configurações padrão.');
            loadedSettings = defaultConfig;
            fs.writeFileSync(filename, JSON.stringify(loadedSettings, null, 2));
        }
    } catch (error) {
        // Caso haja erro ao carregar ou parsear o JSON (como um erro de sintaxe), recria o arquivo com o defaultConfig
        console.error('Erro ao carregar ou parsear o JSON. Usando configurações padrão.');
        loadedSettings = defaultConfig;
        fs.writeFileSync(filename, JSON.stringify(loadedSettings, null, 2));
    }

    // Retorna as configurações carregadas ou o padrão
    return loadedSettings;
};

//Função que efetua o processo de atualização, gerenciando as janelas.
function updateProcess(hWindow: typeof BrowserWindow):boolean
{
    //Se uma nova versão estiver disponível (É um boolean)
    if(isNewVersionAvailable)
    {
        //Vai esconder a janela principal
        //hWindow.hide();

        //Irá criar uma nova janela.
        hUpdateWindow = new BrowserWindow({
            width: 390,
            height: 350,
            frame: false,
            icon: path.join(__dirname, 'assets', 'otter.png'),
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
            }
        });
        //Deixará o menu como nulo e vai carregar o arquivo do html.
        hUpdateWindow.setMenu(null);
        hUpdateWindow.loadFile('./src/scripts/properties/Updating.html');

        //Vai focar a mostrar a janela.
        hUpdateWindow.show();
        hUpdateWindow.focus();

        //Nesse caso, o sistema irá prevenir que a janela seja fechada.
        hUpdateWindow?.on('close', (event:any) => {
            event.preventDefault();
        });

        //Se o hWindow for já definido...
        if(hWindow)
        {
            //Vai desabilitar a janela...
            hWindow.setEnabled(false);

            //E vai prevenir que ela seja fechada.
            hWindow?.on('close', (event:any) => {
                event.preventDefault();
            });
        }
        //Returna true para a atualização.
        return true;
    } 
    //Senão...
    else 
    {
        //Se a hWindow já for definida.
        if(hWindow)
        {
            //O processo será de fechar o programa por padrão...
            hWindow?.on('close', (event:any) => {
                app.quit();
            });
        }
        return false;
    }
}

//Função da janela principal.
function electronWindowInstanceGenerate(): void
{   

        //Janela principal.
        //Evitar alterar parâmetros dentro do "webPreferences".
        //Sinta-se livre para alterar parâmetros mais básicos como width e height.
        hWindow = new BrowserWindow({
            width: 530,
            height: 560,
            maxWidth: 530,
            maxHeight: 590,
            icon: path.join(__dirname, 'assets', 'otter.png'),
            resizable: settings.window.isResizable,
            webPreferences: {
                //Integração com o NodeJs.
                nodeIntegration: true,
                contextIsolation: false,
            }
        });

        
        //Chama a função de processamento de atualizações...
        updateProcess(hWindow);


        //Para ativar, apenas remova ou comente a linha abaixo.
        if(hWindow)
        {
            //O menu ficará nulo, sem nada.
            hWindow.setMenu(null);
            //Carrega o arquivo da interface HTML.
            hWindow.loadFile('./src/Index.html');
            
    
            //Se a opção de DevTools estiver ligada, ele irá abrir os DevTools
            if(settings.window.devTools)
            {
                //Define hWindow como um tipo genérico, isso para ignorar a verificação de erros do openDevTools.
                (hWindow as any).openDevTools();
            }
        }
        
        //Evento para abrir a nova janela (De configurações)
        hWindow.webContents.setWindowOpenHandler(function(event:any):any {
    
            //Se o evento passado for igual a "Properties.html" e a janela de configurações ainda estiver fechada, ele irá abrir.
            //Caso não seja null, ele não vai abrir a janela de configurações.
            if(event.url.includes('Properties.html') && properties_hWindow === null)
            {
                //Janela.
                properties_hWindow = new BrowserWindow({
                    width: 450,
                    height: 300,
                    icon: path.join(__dirname, 'assets', 'otter.png'),
                    resizable: false,
                    webPreferences: {
                        nodeIntegration: true,
                        contextIsolation: false,
                    }
                });
    
                //Abre o DevTools caso esteja habilitada a configuração.
                if(settings.window.devTools && properties_hWindow)
                {
                    (properties_hWindow as any).openDevTools();
                }
                //Se a janela de propriedades for verdadeira...
                if(properties_hWindow)
                {
                    //Carrega o HTML da tela de configurações.
                    properties_hWindow.loadFile("src/scripts/properties/Config.html");
    
                    //Desabilita o menu.
                    //O menu é muito feio.
                    properties_hWindow.setMenu(null);
                }
    
    
                //Previne que a janela seja aberta antes que todos os parâmetros sejam carregados.
                //Medida de segurança.
                properties_hWindow.once('ready-to-show', () => {
                    //Verifica se o hWindow não é nulo.
                    if(properties_hWindow)
                    {
                        //Se não for, ele mostra a janela.
                        properties_hWindow.show();
                    } 
                });
    
                //Se fechar a janela, o "properties_hWindow" volta para nulo.
                //Permite que abra a janela mais de uma vez.
                properties_hWindow.on('closed', () => {
                    //Ao fechar a janela, ele fica como nulo.
                    properties_hWindow = null;
                });
            };
            
            //Retorna uma mensagem.
            return { action: 'deny' };
        });

        //Se as configurações forem exatamente iguais.
        //Se a configuração de update estiver ligada e o updateWindow for nulo (Ou seja, variável nula)..
        if(settings.window.updateInfo && updateWindow === null)
        {
            

            //Ele cria a janela de atualização.
            updateWindow = new BrowserWindow({
                width: 560,
                height: 390,
                icon: path.join(__dirname, 'assets', 'otter.png'),
                webPreferences: {
                    nodeIntegration: true,
                    contextIsolation: false,
                }
            });
            
            //Aplica as configurações de diretório e menu.
            updateWindow.setMenu(null);
            updateWindow.loadFile('./src/updates/update_changes.html');

            //Ao ser fechada, ele vai atualizar a configuração para false.
            //Isso para a janela ser aberta apenas na primeira vez que o programa for aberto na nova versão.
            updateWindow.on('closed', () => {
                //A configuração fica em false.
                settings.window.updateInfo = false;

                //Atualiza o arquivo.
                update_JSON(settings);
            })
        }
        
        //Se a janela de atualizações for aberta, ele vai deixar ela na frente da tela.
        if(updateWindow)
        {
            //Aplica a janela ao topo e mantém o foco nela.
            updateWindow.setAlwaysOnTop(true, 'screen');
            updateWindow.focus();
        }
    
        //Se a janela for fechada, ele vai "quitar" a variável app.
        hWindow.on('closed', () => {
            app.quit();
        });
};




//---------------------------------------
//  Processo: ipcMain
//
//Ao ser alterada alguuma configuração...
ipcMain.on('reload-page', function():void {
    //A página será recarregada, aplicando as configurações.
    //Faz com que não seja necessário efetuar a reinicialização do programa para aplicar a configuração.
    //Precisamos verificar a tipagem delas para garantir que elas não sejam nulas ao recarregar a página.
    if(hWindow)
    {
        //Se hWindow não for nula, ele recarrega.
        hWindow.webContents.reload();
    }
    
    //Se a janela de propriedades for verdadeira...
    if(properties_hWindow)
    {
        //Se properties_hWindow não for nula, ele recarrega a página.
        properties_hWindow.webContents.reload();
    }
    
});

//Recarrega apenas a página de configuração caso seja passado o 'reload-page-config' pelo IPC.
ipcMain.on('reload-page-config', function():void {
    //Verificar se properties_hWindow não é nula.
    if(properties_hWindow)
    {
        //Se não for, a página é recarregada.
        properties_hWindow.webContents.reload(); 
    } 
});

//---------------------------------------
//  Processo: autoUpdater
//
//Caso exista uma atualização disponível...
autoUpdater.on('update-available', function():void {
    //Ele irá aplicar o value como true ao verificar e encontrar uma nova versão.
    //Com isso, ele vai ativar o processo de update.
    isNewVersionAvailable = true;
    updateProcess(hWindow);
});


//Assim que for instalado o update...
autoUpdater.on('update-downloaded', async function(): Promise<void>{

    //Se a hWindow e a hUpdateWindow estiverem definidas
    if(hWindow && hUpdateWindow)
        {
            //A janela de hUpdateWindow irá ganhar o processo de fechar normalmente.
            hUpdateWindow?.on('close', (event:any) => {
                hUpdateWindow.close();
            });
        }
    //Fecha o programa a instala a atualização.
    autoUpdater.quitAndInstall();

    //Confirma que o programa realmente será fechado.
    app.quit();
});



//Uma função que monitora o progresso da atualização.
autoUpdater.on('download-progress', (progress:any) => {


    //Faz o calculo de porcentagem, pegando ele diretamente do electron-updater
    const percent = Math.round(progress.percent); //Arredondamos a porcentagem

    //Envia o processo para a janela.
    if (hUpdateWindow) {
        //Enviando o valor e a entrada para o processo.
        hUpdateWindow.webContents.send('download-progress', percent);
    }
});


//---------------------------------------
//  Processo: app
//
//Assim que o programa estiver pronto...
app.on('ready', function():void {
    //O electron-updater irá verificar se existem atualizações.
    //
    //As atualizações vem do GitHub, do diretório.
    //Ele sempre irá pegar pelo release.
    autoUpdater.checkForUpdatesAndNotify();
});


//Quando app finalizar o carregamento, a janela é exibida.
app.whenReady().then(() => {
    //Quando o aplicativo estiver pronto para inicializar, ele verifica se o arquivo de configurações tem as mesmas informações.
    //Se não for exatamente igual as configurações dessa versão, ele apaga as configurações anteriores e atualiza com as configurações novas.
    //
    
    //Finalmente carrega a janela.
    electronWindowInstanceGenerate();
});

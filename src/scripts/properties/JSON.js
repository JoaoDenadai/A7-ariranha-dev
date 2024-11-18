//JSON.js
//
//Arquivo base de manipulação do arquivo de configurações (JSON).
//
//Criado por: João Denadai



//Importando o módulo 'fs' para manipulação de arquivos
//Definindo o nome global e constante para o arquivo.
const fs = require('fs');
const filename = 'config.json';
const { ipcRenderer } = require('electron');


//Função que carrega o arquivo JSON.
function carregar_Do_JSON()
{   
    //Se o arquivo existir, retorna os dados do arquivo.
    if(fs.existsSync(filename)) {
        return JSON.parse(fs.readFileSync(filename, 'utf8'));
    } 
    //Se o arquivo não existir, ele irá criar um novo com base em uma configuração padrão.
    else 
    {
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

        //Cria o arquivo JSON e retorna o valor da configuração padrão.
        fs.writeFileSync(filename, JSON.stringify(defaultConfig, null, 2));
        return defaultConfig;
    }
};

//Função que atualiza o arquivo JSON.
function atualizar_o_JSON(Custom)
{   
    //Atualiza o arquivo JSON com base em uma variável.
    //Ele irá substituir TODO o arquivo.
    fs.writeFileSync(filename, JSON.stringify(Custom, null, 2));
};

//Atualiza a variável temporária "configuracoes".
//Essa variável vai atualizando, pelo menos dentro da pasta de properties, todas as configurações.
function atualizarConfiguracao()
{
    //Atualiza o arquivo JSON com as configurações.
    atualizar_o_JSON(configuracoes);
};

function electronReload()
{
    ipcRenderer.send('reload-page');
};

function electronConfigReload()
{
    ipcRenderer.send('reload-page-config');
};


//Carrega o JSON toda a vez que a tela de configurações for aberta.
//Após carregar, ele sempre vai atualizar a configuração.
let configuracoes = carregar_Do_JSON();
atualizarConfiguracao();
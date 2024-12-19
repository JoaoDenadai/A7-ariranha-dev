//JSON.js
//
//Arquivo base de manipulação do arquivo de configurações (JSON).
//
//Criado por: João Denadai


//Importando o módulo 'fs' para manipulação de arquivos
//Definindo o nome global e constante para o arquivo.
const { ipcRenderer } = require('electron');


//Precisei reimportar as bibliotecas abaixo.
//Por algum motivo, o typescript está avisando que o filename e o fs estão disponíveis...
//Mas no contexto web elas não são encontradas.
//Dessa forma, tive que reimportar, mas não vai fazer tanta diferença no final.
//E por algum motivo, aplicar "module", na tag do script, no HTML, literalmente mata o código.
const fs_json = require ('fs');
const filenames_json = 'config.json';


//Função que carrega o arquivo JSON.
function carregar_Do_JSON():file
{   
    //Se o arquivo existir, retorna os dados do arquivo.
    if(fs_json.existsSync(filenames_json)) {
        return JSON.parse(fs_json.readFileSync(filenames_json, 'utf8'));
    } 
    //Se o arquivo não existir, ele irá criar um novo com base em uma configuração padrão.
    else 
    {
        //Cria o arquivo JSON e retorna o valor da configuração padrão.
        fs_json.writeFileSync(filenames_json, JSON.stringify(defaultConfig, null, 2));
        return defaultConfig;
    }
};

//Função que atualiza o arquivo JSON.
function atualizar_o_JSON(Custom:any):void
{   
    //Atualiza o arquivo JSON com base em uma variável.
    //Ele irá substituir TODO o arquivo.
    fs_json.writeFileSync(filenames_json, JSON.stringify(Custom, null, 2));
};

//Atualiza a variável temporária "configuracoes".
//Essa variável vai atualizando, pelo menos dentro da pasta de properties, todas as configurações.
function atualizarConfiguracao():void
{
    //Atualiza o arquivo JSON com as configurações.
    atualizar_o_JSON(configuracoes);
};

//Recarrega a página principal.
function electronReload():void
{
    //O IPC envia uma informação para o arquivo Index.js, do próprio electron.
    ipcRenderer.send('reload-page');
};

//Recarrega a página de configurações.
function electronConfigReload():void
{
    ipcRenderer.send('reload-page-config');
};


//Carrega o JSON toda a vez que a tela de configurações for aberta.
//Após carregar, ele sempre vai atualizar a configuração.
let configuracoes:file = carregar_Do_JSON();
atualizarConfiguracao();

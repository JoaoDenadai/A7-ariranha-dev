// JSON_Load.js
//
// Arquivo criado para carregar o arquivo 'config.json'.
//
// Criado por João Denadai.

//Importando módulo de manipulação de arquivos.
const fs = require('fs');
//Definindo uma constante. O nome de arquivo de configuração é 'config.json'.
const filename:string = 'config.json';

//Carrega as informações do arquivo JSON.
function Load_settings_JSON():file
{
    const JSONContent:file = JSON.parse(fs.readFileSync(filename, 'utf8'));
    return JSONContent;
};

//Função que atualiza o arquivo JSON.
export function atualizar_o_JSON_main(Custom:any):void
{   
    //Atualiza o arquivo JSON com base em uma variável.
    //Ele irá substituir TODO o arquivo.
    fs.writeFileSync(filename, JSON.stringify(Custom, null, 2));
};

//Chama a função que retorna o valor para uma variável.
//O Loaded_Settings é a variável que contém os dados do arquivo JSON.
export let Loaded_Settings:file = Load_settings_JSON();

//Função que carrega o tema do programa.
function applyTheme():void
{
    //Armazena o body da página.
    const body = document.body;

    //Ao inicializar, ele irá remover todos os temas disponíveis, deixando sem informações no CSS.
    body.classList.remove("theme-branco", "theme-escuro", "ensolarado", "aurora-pastel", "carmesim-delicado");
    
    //De acordo com o que estiver no arquivo de configurações, ele irá alterar o tema.
    switch(Loaded_Settings.window.theme)
        {
            case "1":
                body.classList.add("theme-branco");
                break;
            case "2":
                body.classList.add("theme-escuro");
                break;
            case "3":
                body.classList.add("ensolarado");
                break;
            case "4":
                body.classList.add("aurora-pastel");
                break;
            case "5":
                body.classList.add("carmesim-delicado");
                break;
            case "6":
                body.classList.add("verde-menta");
                break
        }
};

//Se no JSON, os logs estiverem desativados, ele irá desativar os logs de eventos no sistema.
//É bom para deixar o programa mais leve.
if(!Loaded_Settings.logs.isEnabled)
{
    let logsElement = document.getElementById('A7-Ariranha-Logs-element') as HTMLInputElement;
    //Desativa o campo de logs.
    if(logsElement)
    {
        logsElement.disabled = true;
    }
}

//Aplica o tema ao carregar a página.
applyTheme();

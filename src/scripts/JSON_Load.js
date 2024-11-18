// JSON_Load.js
//
// Arquivo criado para carregar o arquivo 'config.json'.
//
// Criado por João Denadai.

//Importando módulo de manipulação de arquivos.
const fs = require('fs');
//Definindo uma constante. O nome de arquivo de configuração é 'config.json'.
const filename = 'config.json';

//Carrega as informações do arquivo JSON.
function Load_settings_JSON()
{
    return JSON.parse(fs.readFileSync(filename, 'utf8'));
};

//Chama a função que retorna o valor para uma variável.
//O Loaded_Settings é a variável que contém os dados do arquivo JSON.
let Loaded_Settings = Load_settings_JSON();

//Função que carrega o tema do programa.
function applyTheme()
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
    //Desativa o campo de logs.
    document.getElementById('A7-Ariranha-Logs-element').disabled = true;
}

//Aplica o tema ao carregar a página.
applyTheme();

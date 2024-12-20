// Load.js
//
// Arquivo para carregar e atualizar o arquivo de configurações: config.json.
//
// Por João Denadai

//Importando elementos do HTML.
const resize:HTMLInputElement = document.getElementById('enable-resize') as HTMLInputElement;
const events:HTMLInputElement = document.getElementById('enable-events') as HTMLInputElement;
const themes:HTMLInputElement = document.getElementById('theme-options') as HTMLInputElement;
const pinWindow:HTMLInputElement = document.getElementById('pin-window') as HTMLInputElement;

//Importando o falecido "DevTools". Precisa tirar essa informação.
//TIRAR E ATUALIZAR
const developerTools:HTMLInputElement = document.getElementById('enable-devtools') as HTMLInputElement;

//Procedimentos importantes para a configuração.
//Basicamente, o sistema está carregando nas variáveis, toda a vez que a janela for aberta, os valores que estão salvos.
resize.checked = configuracoes.window.isResizable;    //Configuração de redimensionamento da janela.
events.checked = configuracoes.logs.isEnabled;    //Configuração de monitoramento de eventos.
themes.value = configuracoes.window.theme;    //Configuração de temas.
developerTools.checked = configuracoes.window.devTools;    //Configuração do DevTools.
pinWindow.checked = configuracoes.window.fixedWindow;

//Ao alterar o checkbox de "Habilitar redimensionamento".
resize.addEventListener('change', function():void
{
    const {ipcRenderer} = require('electron');

    //Se o checkbox estiver marcado...
    if(resize.checked)
    {
        //Vai alterar a variavel-carregadora, alterando o parâmetro isResizable para true.
        configuracoes.window.isResizable = true;
        ipcRenderer.send('enable-resize-main-window', true);
        
    } else {
        //Vai alterar a variavel-carregadora, alterando o parâmetro isResizable para false.
        configuracoes.window.isResizable = false;
        ipcRenderer.send('enable-resize-main-window', false);
    }

    //Atualiza o arquivo, chamando a função.
    atualizarConfiguracao();

    //Recarrega a página.
    electronReload();

    //Joga um log.
    console.log(configuracoes.window.isResizable);
});

//Função para fixar a janela no topo.
pinWindow.addEventListener('change', () => {
    //Armazena a opção alterada do checkbox. Após atualiza o arquivo.
    configuracoes.window.fixedWindow = pinWindow.checked;
    atualizarConfiguracao();
    const {ipcRenderer} = require('electron');

    //Verifica se está marcada a opção.
    if(pinWindow.checked)
    {
        //Se estiver, ele passa uma mensagem diferente se estiver ou não.
        ipcRenderer.send('changed-main-pin', true);
    } else {
        ipcRenderer.send('changed-main-pin', false);

    }
    
    
});


//Se o checkbox dos "Monitoramento de eventos" for alterada...
events.addEventListener('change', function()
{
    //Se estiver habilitada...
    if(events.checked)
    {
        //Vai alterar a variavel-carregadora, alterando o parâmetro isEnabled dos Logs para true.
        configuracoes.logs.isEnabled = true;
        
    } else {
        //Vai alterar a variavel-carregadora, alterando o parâmetro isEnabled dos Logs para false.
        configuracoes.logs.isEnabled = false;
    }

    //Atualiza o arquivo de configuração, chamando a função.
    atualizarConfiguracao();

    //Recarrega a página.
    electronReload();
    console.log(configuracoes.logs.isEnabled);
        
});

//Se o tema for alterado...
themes.addEventListener('change', function() {
    //Ele irá salvar o valor de qual tema foi alterado...
    const selectedTheme = this.value;

    //E irá passar esse valor para a variável-carregadora.
    configuracoes.window.theme = selectedTheme;

    //Atualiza o arquivo de configurações.
    atualizarConfiguracao();

    //Recarrega tanto a página principal quando a página de configurações.
    electronReload();
    electronConfigReload();
});

//Se o developerTools for alterado...
developerTools.addEventListener('change', function() {

    //Se o developerTools...
    if(developerTools.checked)
    {
        //Estiver habilitado, altera a configuração de devTools para true.
        configuracoes.window.devTools = true;   
    } else {
        //Estiver habilitado, altera a configuração de devTools para true.
        configuracoes.window.devTools = false;
    }
    
    //Atualiza a configuração e recarrega a página.
    atualizarConfiguracao();
    electronReload();
    console.log(configuracoes.window.devTools);
});

//Função que aplica o tema que está salvo na variável-carregadora.
function applyThemeOnConfig():void
{
    //Salva o body em uma variável.
    const body:HTMLElement = document.body;

    //Remove todas as classes do body.
    body.classList.remove("theme-branco", "theme-escuro", "ensolarado", "aurora-pastel", "carmesim-delicado", "verde-menta");

    //Um switch que altera o tema com o mesmo valor que está sendo passado nos temas.
    switch(configuracoes.window.theme)
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
                break;
        }
        
};

//Aplica o tema toda a vez que a página for recarregada.
applyThemeOnConfig();

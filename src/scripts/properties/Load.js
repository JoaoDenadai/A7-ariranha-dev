const resize = document.getElementById('enable-resize');
const events = document.getElementById('enable-events');
const themes = document.getElementById('theme-options');
const developerTools = document.getElementById('enable-devtools');
const developerMode = document.getElementById('enable-developer-mode');

resize.checked = configuracoes.window.isResizable;
events.checked = configuracoes.logs.isEnabled;
themes.value = configuracoes.window.theme;
developerTools.checked = configuracoes.window.devTools;
developerMode.checked = configuracoes.window.devMode;

if(developerMode.checked)
{

} else
{

}

developerMode.addEventListener('change', () =>
{
    if(developerMode.checked)
    {
        configuracoes.window.devMode = true;
    } else
    {
        configuracoes.window.theme = "1";
        configuracoes.window.devMode = false;
    }
    atualizarConfiguracao();
    electronReload();
    console.log(configuracoes.window.devMode);
})

resize.addEventListener('change', () =>
{
    if(resize.checked)
    {
        configuracoes.window.isResizable = true;
        
    } else {
        configuracoes.window.isResizable = false;
    }
    atualizarConfiguracao();
    electronReload();
    console.log(configuracoes.window.isResizable);
});

events.addEventListener('change', () =>
{
    if(events.checked)
    {
        configuracoes.logs.isEnabled = true;
        
    } else {
        configuracoes.logs.isEnabled = false;
    }
    atualizarConfiguracao();
    electronReload();
    console.log(configuracoes.logs.isEnabled);
        
});

themes.addEventListener('change', function() {
    const selectedTheme = this.value;

    configuracoes.window.theme = selectedTheme;
    atualizarConfiguracao();
    electronReload();
    electronConfigReload();
});

developerTools.addEventListener('change', () => {
    if(developerTools.checked)
    {
        configuracoes.window.devTools = true;   
    } else {
        configuracoes.window.devTools = false;
    }
    atualizarConfiguracao();
    electronReload();
    console.log(configuracoes.window.devTools);
});

function applyThemeOnConfig()
{
    const body = document.body;

    body.classList.remove("theme-branco", "theme-escuro", "ensolarado", "aurora-pastel", "carmesim-delicado", "verde-menta");


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

applyThemeOnConfig();
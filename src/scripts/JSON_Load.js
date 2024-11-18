const fs = require('fs');
const filename = 'config.json';

function Load_settings_JSON()
{
    return JSON.parse(fs.readFileSync(filename, 'utf8'));
};

let Loaded_Settings = Load_settings_JSON();

function applyTheme()
{
    const body = document.body;

    body.classList.remove("theme-branco", "theme-escuro", "ensolarado", "aurora-pastel", "carmesim-delicado");


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

if(!Loaded_Settings.logs.isEnabled)
{
    document.getElementById('A7-Ariranha-Logs-element').disabled = true;
}

applyTheme();
//Logs.js
//
//Arquivo para o registro de logs de eventos.
//
//Criado por: João Denadai

//Importando o textarea responsável pelos logs.
const Log_Textarea = document.getElementById('A7-Ariranha-Logs-element');

//Inicializa as duas variáveis com valores padrões.
let log_message = "";
let log_counter = 0;

//Joga um novo log.
function throwNewLog(Message, variable, value)
{   
    if(Loaded_Settings.logs.isEnabled)
    {
    //Ativa o contador somando o valor de 1 no que já está.
    log_counter++;
    //Gera a mensagem.
    log_message = `#${log_counter}: @ariranha: ${Message} (${variable} = ${value})`;

    //Mantém o que já estava antes, de dados, e adiciona o novo conteúdo uma linha abaixo.
    log_preview_content = Log_Textarea.value;
    Log_Textarea.value += (Log_Textarea.value ? "\n" : "") + log_message;

    //Linha de comando linda responsável por scrollar automaticamente para baixo.
    Log_Textarea.scrollTop = Log_Textarea.scrollHeight;
    }
};

//Joga uma exception.
function throwException(Message, variable, value)
{
    if(Loaded_Settings.logs.isEnabled) {
    //Ativa o contador somando o valor de 1 no que já está.
    log_counter++;
     //Gera a mensagem.
    log_error_message = `#${log_counter}: @ariranha (throwException): ${Message} (${variable} = ${value})`;

    //Mantém o que já estava antes, de dados, e adiciona o novo conteúdo uma linha abaixo.
    log_preview_content = Log_Textarea.value;
    Log_Textarea.value += (Log_Textarea.value ? "\n" : "") + log_error_message;

    //Linha de comando linda responsável por scrollar automaticamente para baixo.
    Log_Textarea.scrollTop = Log_Textarea.scrollHeight;
    }
}
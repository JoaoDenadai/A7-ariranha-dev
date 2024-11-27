//Logs.js
//
//Arquivo para o registro de logs de eventos.
//
//Criado por: João Denadai

//Importando ferramentas de outros arquivos: JSON_Load.ts
import { Loaded_Settings } from './JSON_Load.js';

//Importando o textarea responsável pelos logs.
const Log_Textarea:HTMLInputElement = document.getElementById('A7-Ariranha-Logs-element') as HTMLInputElement;


//Inicializa as duas variáveis com valores padrões.
let log_message:string = "";
let log_counter:number = 0;

//Joga um novo log.
export function throwNewLog(Message:any, variable:any, value:any):void
{   
    if(Loaded_Settings.logs.isEnabled)
    {
    //Ativa o contador somando o valor de 1 no que já está.
    log_counter++;
    //Gera a mensagem.
    log_message = `#${log_counter}: @ariranha: ${Message} (${variable} = ${value})`;

    //Mantém o que já estava antes, de dados, e adiciona o novo conteúdo uma linha abaixo.
    Log_Textarea.value += (Log_Textarea.value ? "\n" : "") + log_message;

    //Linha de comando linda responsável por scrollar automaticamente para baixo.
    Log_Textarea.scrollTop = Log_Textarea.scrollHeight;
    }
};

//Joga uma exception.
export function throwException(Message:any, variable:any, value:any):void
{
    if(Loaded_Settings.logs.isEnabled) {
    //Ativa o contador somando o valor de 1 no que já está.
    log_counter++;
     //Gera a mensagem.
    let log_error_message:string = `#${log_counter}: @ariranha (throwException): ${Message} (${variable} = ${value})`;

    //Mantém o que já estava antes, de dados, e adiciona o novo conteúdo uma linha abaixo.
    Log_Textarea.value += (Log_Textarea.value ? "\n" : "") + log_error_message;

    //Linha de comando linda responsável por scrollar automaticamente para baixo.
    Log_Textarea.scrollTop = Log_Textarea.scrollHeight;
    }
};
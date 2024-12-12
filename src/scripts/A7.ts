//A7.js
//
//Arquivo de lógica de funcionamento para a manipulação do código A7.
//
//Criado por: João Denadai

//Importando os logs de outro arquivo.
//Apenas possível pois estamos chamando o js por type: "module".
import { throwException, throwNewLog } from "./Logs.js";

//Variáveis globais de manipulação do código a7.
let semConversao:string, comConversao:string = "";


//Globais
const A7_Input:HTMLInputElement = document.getElementById('A7-Input-element') as HTMLInputElement;
const A7_AutomaticFormat_Checkbox:HTMLInputElement = document.getElementById('A7-Checkbox-autoformat-element') as HTMLInputElement;

//Globais #2
const A7_Format_Button:HTMLInputElement = document.getElementById('A7-Format-Button') as HTMLInputElement;


//Um eventlistener para caso a caixa de seleção de formatar automaticamente for alterada.
A7_AutomaticFormat_Checkbox.addEventListener('change', function(event):void
{
    if(A7_AutomaticFormat_Checkbox.checked)
    {
        //Caso seja, ele joga um log e disabilita o botão de formatar manualmente.
        A7_Format_Button.disabled = true;
        throwNewLog("Chave alterada.", "A7_AutomaticFormat_Checkbox", "true");
    }
    else{
        //Caso o contrário ele habilita o botão e também joga um log.
        A7_Format_Button.disabled = false;
        throwNewLog("Chave alterada.", "A7_AutomaticFormat_Checkbox", "false");
    }
    //Atualiza a formatação.
    updateInputA7Formatation(false);
});

//Um eventlistener para sempre que um valor for adicionado ou modificado no input do código A7.
A7_Input.addEventListener("input", () => 
{
    //Ele irá importar o elemento pelo ID.
    let a7_input_size:HTMLInputElement = document.getElementById("A7-Input-element") as HTMLInputElement;

    //Se o código a7 tiver com caracteres especiais ou for menor do que 9.
    if(A7_Input.value.includes("-") || A7_Input.value.length < 9)
        {
            //Ele irá ajustar o tamanho para 10.
            a7_input_size.setAttribute("maxlength", "10");
            removeFormatationFromA7();
        }
        else
        {
            //Senão ele ajusta para 9.
            a7_input_size.setAttribute("maxlength", "9");
        }

        //Atualiza o input.
        updateInputA7Formatation(false); 
});

//Caso o botão de formatar automaticamente seja apertado, ele irá enviar para ser formatado.
A7_Format_Button.addEventListener('mousedown', function():void
{
    updateInputA7Formatation(true);
})

//Função de atualizar a formatação do código a7.
function updateInputA7Formatation(isEnabledA7_AutomaticFormat_Bypass:boolean):void
{
    //Se a caixa de formatação automatica estiver ativada ou se o bypass estiver ativado...
    if(A7_AutomaticFormat_Checkbox.checked || isEnabledA7_AutomaticFormat_Bypass)
    {
        //Se o valor do input estiver com qualquer caractere especial ou for menor que nove e vier da formatação automática...
        if(A7_Input.value.includes("-")|| A7_Input.value.length < 9 && isEnabledA7_AutomaticFormat_Bypass)
        {
            //Joga uma exception nos logs.
            throwException("Código a7 informado é inválido, tente novamente.", "A7_Input.value", A7_Input.value);
        }
        else
        {
            //Se o código a7 estiver com exatamente 9 digitos...
            if(A7_Input.value.length === 9)
            {
                //Vai salvar o sem conversão em uma variável e salvar em outra também.
                semConversao = A7_Input.value;
                let paraConverter:string = A7_Input.value;
                
                //Vai dividir a string em duas partes.
                let partesDoA7:string[] =
                [
                    paraConverter.slice(0, 4),
                    paraConverter.slice(4, 9)
                ];

                //Aplica o valor formatado para a variável.
                comConversao = `${partesDoA7[0]}-${partesDoA7[1]}`;

                //Atualiza o input e joga um novo log.
                A7_Input.value = comConversao;
                throwNewLog("O Código a7 foi formatado!", "A7_Input.value", A7_Input.value);
            }
        }
    }
};

//Remove a formatação do código a7.
function removeFormatationFromA7():string
{
    //Remove a formatação e armazena em uma variável e retorna esse valor.
    let removeFormatationFromA7Temp:string = A7_Input.value.replace(/[.\-\/]/g, '');
    return A7_Input.value = removeFormatationFromA7Temp;
}

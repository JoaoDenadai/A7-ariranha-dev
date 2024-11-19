//A7.js
//
//Arquivo de lógica de funcionamento para a manipulação do código A7.
//
//Criado por: João Denadai

//Variáveis globais de manipulação do código a7.
let {semConversao, comConversao} = "";


//Globais
const A7_Input = document.getElementById('A7-Input-element');
const A7_AutomaticFormat_Checkbox = document.getElementById('A7-Checkbox-autoformat-element');

//Globais #2
const A7_Format_Button = document.getElementById('A7-Format-Button');


A7_AutomaticFormat_Checkbox.addEventListener('change', (event) =>
{
    if(A7_AutomaticFormat_Checkbox.checked)
    {
        A7_Format_Button.disabled = true;
        throwNewLog("Chave alterada.", "A7_AutomaticFormat_Checkbox", "true");
    }
    else{
        A7_Format_Button.disabled = false;
        throwNewLog("Chave alterada.", "A7_AutomaticFormat_Checkbox", "false");
    }
    updateInputA7Formatation(false);
});

A7_Input.addEventListener("input", () => 
{
    if(A7_Input.value.includes("-") || A7_Input.value.length < 9)
        {
            document.getElementById("A7-Input-element").setAttribute("maxlength", "10");
            removeFormatationFromA7();
        }
        else
        {
            document.getElementById("A7-Input-element").setAttribute("maxlength", "9");
        }
        updateInputA7Formatation(false); 
});

A7_Format_Button.addEventListener('mousedown', () =>
{
    updateInputA7Formatation(true);
})


function updateInputA7Formatation(isEnabledA7_AutomaticFormat_Bypass)
{
    if(A7_AutomaticFormat_Checkbox.checked || isEnabledA7_AutomaticFormat_Bypass)
    {
        if(A7_Input.value.includes("-")|| A7_Input.value.length < 9)
        {

        }
        else
        {
            if(A7_Input.value.length === 9)
            {
                semConversao = A7_Input.value;
                paraConverter = A7_Input.value;

                let partesDoA7 =
                [
                    paraConverter.slice(0, 4),
                    paraConverter.slice(4, 9)
                ];

                comConversao = `${partesDoA7[0]}-${partesDoA7[1]}`;

                A7_Input.value = comConversao;
            }
        }
    }
};

function removeFormatationFromA7()
{
    removeFormatationFromA7Temp = A7_Input.value.replace(/[.\-\/]/g, '');
    return A7_Input.value = removeFormatationFromA7Temp;
}

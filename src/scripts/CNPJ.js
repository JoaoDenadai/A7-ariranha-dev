//CNPJ.js
//
//Arquivo de lógica de funcionamento para a manipulação do CNPJ.
//
//Criado por: João Denadai


//Inclusão de elementos do "../Index.html"
//Evitar alterar o nome das variáveis.
let {semConversaoCNPJ, comConversaoCNPJ} = "";


//Globais
const CNPJ_Input = document.getElementById('CNPJ-Input-element');
const CNPJ_AutomaticFormat_CheckBox = document.getElementById('CNPJ-Checkbox-autoformat-element');
const CNPJ_AutomaticCopy_CheckBox = document.getElementById('CNPJ-Checkbox-autocopy-element');
let isCNPJ_AutomaticFormat_Checked = false;
let isCNPJ_AutomaticCopy_Checked = false;

//Globais #2
const CNPJ_FormatButton = document.getElementById('CNPJ-Format-Button');
const CNPJ_Unformat_Button = document.getElementById('CNPJ-Unformat-Button');
const CNPJ_Copy_Button = document.getElementById('CNPJ-Copy-Button');


//Verifica se a caixa de seleção "Formatar automáticamente" está habilitada.
//Caso esteja, ele irá alterar a variável "isCNPJ_AutomaticFormat_Checked" para true.
//Se não estiver, é falso.
CNPJ_AutomaticFormat_CheckBox.addEventListener('change', () => {
    if(CNPJ_AutomaticFormat_CheckBox.checked)
        {
            isCNPJ_AutomaticFormat_Checked = true;
            CNPJ_FormatButton.disabled = true;
            updateInputFormatation();
            throwNewLog("Chave alterada.", "CNPJ_AutomaticFormat_CheckBox", "true");
        } else
        {
            isCNPJ_AutomaticFormat_Checked = false;
            CNPJ_FormatButton.disabled = false;
            updateInputFormatation();
            throwNewLog("Chave alterada.", "CNPJ_AutomaticFormat_CheckBox", "true");
        }
});

CNPJ_AutomaticCopy_CheckBox.addEventListener('change', () => {
    if(CNPJ_AutomaticCopy_CheckBox.checked)
    {
        isCNPJ_AutomaticCopy_Checked = true;
        throwNewLog("Chave alterada.", "CNPJ_AutomaticCopy_CheckBox", "true");
    }
    else 
    {
        isCNPJ_AutomaticCopy_Checked = false;
        throwNewLog("Chave alterada.", "CNPJ_AutomaticCopy_CheckBox", "true");
    }
})

//Um listener onde irá ser executado toda a vez que um dígito for incluso no campo de CNPJ
CNPJ_Input.addEventListener('input', () => {
    if(CNPJ_Input.value.includes(".") || CNPJ_Input.value.includes("/") || CNPJ_Input.value.includes("-") && CNPJ_Input.value.length < 14)
    {
        document.getElementById("CNPJ-Input-element").setAttribute("maxlength", "18");
        removeFormatationFromCNPJ()
    }
    else
    {
        document.getElementById("CNPJ-Input-element").setAttribute("maxlength", "14");

    }
    updateInputFormatation(false);
});


//Ao apertar o botão de "formatar", ele irá chamar a função que formata o CNPJ.
CNPJ_FormatButton.addEventListener('mousedown',() => {
    updateInputFormatation(true);
})

//Ao apertar o botão de "desformatar", ele irá chamar a função que desformata o CNPJ.
CNPJ_Unformat_Button.addEventListener('mousedown', () => {
    removeFormatationFromCNPJ();
});

CNPJ_Copy_Button.addEventListener('mousedown', () => {
    copyToClipboard(CNPJ_Input);
})

//Atualiza a informação de input.
function updateInputFormatation(isEnabledCNPJ_AutomaticFormat_Bypass)
{
    //Se a caixa de seleção estiver marcada...
    if(isCNPJ_AutomaticFormat_Checked || isEnabledCNPJ_AutomaticFormat_Bypass)
        {
    
            //...Se o CNPJ conter pontos, barras ou traços...
            if(CNPJ_Input.value.includes(".") || CNPJ_Input.value.includes("/") || CNPJ_Input.value.includes("-") || CNPJ_Input.value.length < 14)
            {
                if(CNPJ_Input.value.length < 14 && isEnabledCNPJ_AutomaticFormat_Bypass)
                {
                    throwException("O CNPJ está incorreto, tente novamente.", "CNPJ_Input.value", CNPJ_Input.value);
                }
            }
            else
            {
                //...Se o CNPJ tiver o tamanho de 14 digitos...
                if(CNPJ_Input.value.length === 14)
                    {
                        //Salva o que tiver no Input do CNPJ não formatado na variável "semConversaoCNPJ".
                        semConversaoCNPJ = CNPJ_Input.value;  
    
                        //Salva o que tiver no Input do CNPJ não formatado na variável "paraConverterCNPJ".
                        //Informa o tamanho do CNPJ no console para fins de rastreio de execução.
                        paraConverterCNPJ = CNPJ_Input.value;
                        
                        //Divide os 14 digitos do CNPJ em partes de uma matriz.
                        let partesDoCNPJ =
                        [
                            paraConverterCNPJ.slice(0, 2),
                            paraConverterCNPJ.slice(2, 5),
                            paraConverterCNPJ.slice(5, 8),
                            paraConverterCNPJ.slice(8, 12),
                            paraConverterCNPJ.slice(12, 14),
                        ];
    
                        //Faz a conversão adicionando pontos, barras e traços ao CNPJ.
                        comConversaoCNPJ = `${partesDoCNPJ[0]}.${partesDoCNPJ[1]}.${partesDoCNPJ[2]}/${partesDoCNPJ[3]}-${partesDoCNPJ[4]}`;

                        //Adiciona o valor do CNPJ alterado diretamente no valor do Input.
                        CNPJ_Input.value = comConversaoCNPJ;
                        throwNewLog("O CNPJ foi formatado!", "CNPJ_Input.value", CNPJ_Input.value);

                        isEnabledCNPJ_AutomaticFormat_Bypass = false;
                        if(isCNPJ_AutomaticCopy_Checked)
                        {
                            copyToClipboard(CNPJ_Input);
                        }
                    };
            }
            
        }
};

//Função que remove a formatação.
function removeFormatationFromCNPJ()
{
    removeFormatationCNPJtemp = CNPJ_Input.value.replace(/[.\-\/]/g, '');
    CNPJ_Input.value = removeFormatationCNPJtemp;
    throwNewLog("Formatação removida!", "CNPJ_Input.value", CNPJ_Input.value);
    return CNPJ_Input.value;
}

function copyToClipboard(input)
{
    textToCopy = input.value;
    navigator.clipboard.writeText(textToCopy);
    throwNewLog("Copiado para a área de transferência!", "textToCopy", textToCopy);
    return null;
}
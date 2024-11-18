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

//Botões da tela.
const CNPJ_FormatButton = document.getElementById('CNPJ-Format-Button');
const CNPJ_Unformat_Button = document.getElementById('CNPJ-Unformat-Button');
const CNPJ_Copy_Button = document.getElementById('CNPJ-Copy-Button');


//Verifica se a caixa de seleção "Formatar automáticamente" está habilitada.
//Caso esteja, ele irá alterar a variável "isCNPJ_AutomaticFormat_Checked" para true.
//Se não estiver, é falso.
CNPJ_AutomaticFormat_CheckBox.addEventListener('change', () => {
    if(CNPJ_AutomaticFormat_CheckBox.checked)
        {
            //Caso estiver habilitado, ele irá:
            //1. Vai alterar o valor da variavel "isCNPJ_AutomaticFormat_Checked" para true.
            isCNPJ_AutomaticFormat_Checked = true;

            //2.Desativar o botão de formatar, já que não é mais necessário.
            CNPJ_FormatButton.disabled = true;

            //3. Atualizar a formatação do CNPJ.
            updateInputFormatation();

            //4. Lançar um log de alteração na chave.
            throwNewLog("Chave alterada.", "CNPJ_AutomaticFormat_CheckBox", "true");
        } else
        {
            //Caso estiver desabilitado, ele irá:
            //1. Vai alterar o valor da variavel "isCNPJ_AutomaticFormat_Checked" para false.
            isCNPJ_AutomaticFormat_Checked = false;

            //2. Ativar o botão de formatação manual.
            CNPJ_FormatButton.disabled = false;

            //3. Atualizar a formatação do CNPJ.
            updateInputFormatation();

            //4. Lança um log.
            throwNewLog("Chave alterada.", "CNPJ_AutomaticFormat_CheckBox", "false");
        }
});

//Um lister de eventos que habilita copiar o CNPJ automaticamente assim que ele for formatado.
CNPJ_AutomaticCopy_CheckBox.addEventListener('change', () => {
    if(CNPJ_AutomaticCopy_CheckBox.checked)
    {
        //Ele irá habilitar o "isCNPJ_AutomaticCopy_Checked" alterando o valor para "true".
        isCNPJ_AutomaticCopy_Checked = true;

        //Lança um log.
        throwNewLog("Chave alterada.", "CNPJ_AutomaticCopy_CheckBox", "true");
    }
    else 
    {
        //Ele irá habilitar o "isCNPJ_AutomaticCopy_Checked" alterando o valor para "false".
        isCNPJ_AutomaticCopy_Checked = false;

        //Lança um log.
        throwNewLog("Chave alterada.", "CNPJ_AutomaticCopy_CheckBox", "true");
    }
})

//Um listener onde irá ser executado toda a vez que um dígito for incluso no campo de CNPJ
CNPJ_Input.addEventListener('input', () => {
    //Se o CNPJ conter alguma formatação (Como pontos, barras ou traços) e menos de 14 digitos, ele irá remover a formatação do CNPJ.
    //Uma medida de segurança para o sistema não bugar.
    if(CNPJ_Input.value.includes(".") || CNPJ_Input.value.includes("/") || CNPJ_Input.value.includes("-") && CNPJ_Input.value.length < 14)
    {
        //Altera o tamanho máximo do input para 18.
        //Serve para que o usuário consiga digitar ou alterar algum último dígito.
        //UM CNPJ QUE POSSUI ".", "/" ou "-" SEMPRE VAI TER MAIS DE 14 DIGITOS.
        document.getElementById("CNPJ-Input-element").setAttribute("maxlength", "18");

        //Remove a formatação.
        removeFormatationFromCNPJ()
    }
    else
    {
        //Apenas ajusta o tamanho máximo do input para 14.
        document.getElementById("CNPJ-Input-element").setAttribute("maxlength", "14");

    }
    //Atualiza a formatação do input.
    //Está passando false pois não está habilitado o bypass da verificação se o CNPJ é válido.
    updateInputFormatation(false);
});


//Ao apertar o botão de "formatar", ele irá chamar a função que formata o CNPJ.
CNPJ_FormatButton.addEventListener('mousedown',() => {
    //Atualiza a informação do CNPJ.
    //Está passando true pois ele bypassa a verificação de se o checkbox está aplicado.
    updateInputFormatation(true);
})

//Ao apertar o botão de "desformatar", ele irá chamar a função que desformata o CNPJ.
CNPJ_Unformat_Button.addEventListener('mousedown', () => {
    //Irá desformatar o CNPJ.
    removeFormatationFromCNPJ();
});

//Ao apertar em copiar, ele irá chamar a função que copia o conteúdo do CNPJ para a área de transferência.
CNPJ_Copy_Button.addEventListener('mousedown', () => {
    copyToClipboard(CNPJ_Input);
})

//Atualiza a informação de input.
function updateInputFormatation(isEnabledCNPJ_AutomaticFormat_Bypass)
{
    //Se a caixa de seleção estiver marcada ou o bypass estiver ativo...
    if(isCNPJ_AutomaticFormat_Checked || isEnabledCNPJ_AutomaticFormat_Bypass)
        {
    
            //...Se o CNPJ conter pontos ou barras ou traços ou for menor que 14 digitos...
            if(CNPJ_Input.value.includes(".") || CNPJ_Input.value.includes("/") || CNPJ_Input.value.includes("-") || CNPJ_Input.value.length < 14)
            {
                //Se a verificação estiver com o bypass ativado e conter menos de 14 digitos, ele irá apresentar um erro no log de eventos.
                if(CNPJ_Input.value.length < 14 && isEnabledCNPJ_AutomaticFormat_Bypass)
                {
                    //Lança uma exception.
                    throwException("O CNPJ está incorreto, tente novamente.", "CNPJ_Input.value", CNPJ_Input.value);
                }
            }
            //Senão...
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

                        //Adiciona um novo log, informando que o CNPJ foi formatado com sucesso.
                        throwNewLog("O CNPJ foi formatado!", "CNPJ_Input.value", CNPJ_Input.value);

                        //Faz com que o bypass fique em falso.
                        //É importante para que o bypass não fique ativado.
                        //Dessa forma o sistema trata de maneira única cada formatação manual e automática.
                        isEnabledCNPJ_AutomaticFormat_Bypass = false;

                        //Se a cópia automática estiver ativada, ele copia automaticamente ao formatar.
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
    //Remove todos os caracteres especiais do CNPJ e armazena em uma variável especial e temporária.
    removeFormatationCNPJtemp = CNPJ_Input.value.replace(/[.\-\/]/g, '');
    //Retorna o valor ao input.
    CNPJ_Input.value = removeFormatationCNPJtemp;
    //Adiciona um log.
    throwNewLog("Formatação removida!", "CNPJ_Input.value", CNPJ_Input.value);

    //Caso chamem essa função, irá retornar o valor do CNPJ (Isso após efetuarmos a desformatação).
    return CNPJ_Input.value;
}

//Função de copiar o conteúdo para a área de transferência.
function copyToClipboard(input)
{
    //Armazena o texto que desejamos copiar para uma variável.
    textToCopy = input.value;
    //Copia para a área de transferência.
    navigator.clipboard.writeText(textToCopy);

    //Adiciona um novo log.
    throwNewLog("Copiado para a área de transferência!", "textToCopy", textToCopy);

    //Não retorna nenhum conteúdo.
    return null;
}

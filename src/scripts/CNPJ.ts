//CNPJ.js
//
//Arquivo de lógica de funcionamento para a manipulação do CNPJ.
//
//Criado por: João Denadai
import { atualizar_o_JSON_main, Loaded_Settings } from './JSON_Load.js';
import {throwNewLog, throwException} from './Logs.js';


//Inclusão de elementos do "../Index.html"
//Evitar alterar o nome das variáveis.
let semConversaoCNPJ:string, comConversaoCNPJ:string = "";


//Globais
const CNPJ_Input = document.getElementById('CNPJ-Input-element') as HTMLInputElement;
const CNPJ_AutomaticFormat_CheckBox = document.getElementById('CNPJ-Checkbox-autoformat-element') as HTMLInputElement;
const CNPJ_AutomaticCopy_CheckBox = document.getElementById('CNPJ-Checkbox-autocopy-element') as HTMLInputElement;
let isCNPJ_AutomaticFormat_Checked:boolean;
throwNewLog("Definindo valor inicial de constante global", "isCNPJ_AutomaticFormat_Checked", "false");
let isCNPJ_AutomaticCopy_Checked:boolean;
throwNewLog("Definindo valor inicial de constante global", "isCNPJ_AutomaticCopy_Checked", "false");


//Botões da tela.
const CNPJ_FormatButton = document.getElementById('CNPJ-Format-Button') as HTMLInputElement;
const CNPJ_Unformat_Button = document.getElementById('CNPJ-Unformat-Button') as HTMLElement;
const CNPJ_Copy_Button = document.getElementById('CNPJ-Copy-Button') as HTMLInputElement;

//Carregando configurações vindas do arquivo JSON.
CNPJ_Input.value = Loaded_Settings.preferences.cnpjValue;
CNPJ_AutomaticFormat_CheckBox.checked = Loaded_Settings.preferences.cnpjAutoFormat;
CNPJ_AutomaticCopy_CheckBox.checked = Loaded_Settings.preferences.cnpjAutoCopy;
isCNPJ_AutomaticFormat_Checked = Loaded_Settings.preferences.cnpjAutoFormat;
isCNPJ_AutomaticCopy_Checked = Loaded_Settings.preferences.cnpjAutoCopy;
//Atualiza, assim, para que ele formate caso estiver já abrindo.
//Ele também só irá funcionar se a chave de formatação automatica estiver habilitada.
if(Loaded_Settings.preferences.cnpjAutoFormat)
{
    updateInputFormatation(true);
}


//Verifica se a caixa de seleção "Formatar automáticamente" está habilitada.
//Caso esteja, ele irá alterar a variável "isCNPJ_AutomaticFormat_Checked" para true.
//Se não estiver, é falso.
CNPJ_AutomaticFormat_CheckBox.addEventListener('change', function():void {
    if(CNPJ_AutomaticFormat_CheckBox.checked)
        {
            //Caso estiver habilitado, ele irá:
            //1. Vai alterar o valor da variavel "isCNPJ_AutomaticFormat_Checked" para true.
            isCNPJ_AutomaticFormat_Checked = true;

            //2.Desativar o botão de formatar, já que não é mais necessário.
            CNPJ_FormatButton.disabled = true;

            //3. Atualizar a formatação do CNPJ.
            updateInputFormatation(false);

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
            updateInputFormatation(false);

            //4. Lança um log.
            throwNewLog("Chave alterada.", "CNPJ_AutomaticFormat_CheckBox", "false");
        }
    //Atualiza a variável JSON e atualiza o arquivo em seguida.
    Loaded_Settings.preferences.cnpjAutoFormat = CNPJ_AutomaticFormat_CheckBox.checked;
    atualizar_o_JSON_main(Loaded_Settings);
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
    //Atualiza a variável JSON e atualiza o arquivo em seguida.
    Loaded_Settings.preferences.cnpjAutoCopy = CNPJ_AutomaticCopy_CheckBox.checked;
    atualizar_o_JSON_main(Loaded_Settings);
})

//Um listener utilizado para verificar o conteúdo colado.
CNPJ_Input.addEventListener('paste', (event) => {
    //Previnimos o evento padrão de colar.
    event.preventDefault();

    //Obtemos o valor a ser colado.
    let pastedData:string | undefined = event.clipboardData?.getData('text');
    if(pastedData)
    {
        //Substituímos os valores apeans por números.
        CNPJ_Input.value = pastedData.replace(/[^0-9]/g, "") as string;
    }   

    //Atualizamos o input.
    updateInputFormatation(false);
});

//Um listener onde irá ser executado toda a vez que um dígito for incluso no campo de CNPJ
CNPJ_Input.addEventListener('input', function():void {
    //Se o CNPJ conter alguma formatação (Como pontos, barras ou traços) e menos de 14 digitos, ele irá remover a formatação do CNPJ.
    //Uma medida de segurança para o sistema não bugar.
    let CNPJ_element = document.getElementById("CNPJ-Input-element")as HTMLInputElement;
    if(CNPJ_Input.value.includes(".") || CNPJ_Input.value.includes("/") || CNPJ_Input.value.includes("-") && CNPJ_Input.value.length < 14)
    {
        //Altera o tamanho máximo do input para 18.
        //Serve para que o usuário consiga digitar ou alterar algum último dígito.
        //UM CNPJ QUE POSSUI ".", "/" ou "-" SEMPRE VAI TER MAIS DE 14 DIGITOS.
        
        CNPJ_element.setAttribute("maxlength", "18");
        throwNewLog("Atributo de 'maxlength' alterado.", "maxlength", "18");

        //Remove a formatação.
        removeFormatationFromCNPJ()
    }
    else
    {
        //Apenas ajusta o tamanho máximo do input para 14.
        CNPJ_element.setAttribute("maxlength", "14");

    }
    //Atualiza a variável JSON e atualiza o arquivo em seguida.
    Loaded_Settings.preferences.cnpjValue = CNPJ_Input.value;
    atualizar_o_JSON_main(Loaded_Settings);

    //Atualiza a formatação do input.
    //Está passando false pois não está habilitado o bypass da verificação se o CNPJ é válido.
    updateInputFormatation(false);
});


//Ao apertar o botão de "formatar", ele irá chamar a função que formata o CNPJ.
CNPJ_FormatButton.addEventListener('mousedown',function():void {
    //Atualiza a informação do CNPJ.
    //Está passando true pois ele bypassa a verificação de se o checkbox está aplicado.
    updateInputFormatation(true);
})

//Ao apertar o botão de "desformatar", ele irá chamar a função que desformata o CNPJ.
CNPJ_Unformat_Button.addEventListener('mousedown', function():void {
    //Irá desformatar o CNPJ.
    removeFormatationFromCNPJ();
});

//Ao apertar em copiar, ele irá chamar a função que copia o conteúdo do CNPJ para a área de transferência.
CNPJ_Copy_Button.addEventListener('mousedown', function():void {
    copyToClipboard(CNPJ_Input);
})

//Atualiza a informação de input.
function updateInputFormatation(isEnabledCNPJ_AutomaticFormat_Bypass:boolean):void
{
    let input = CNPJ_Input.value;
    CNPJ_Input.value = input.replace(/[^0-9]/g, ""); 
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
                        let paraConverterCNPJ:string = CNPJ_Input.value;
                        
                        //Divide os 14 digitos do CNPJ em partes de uma matriz.
                        let partesDoCNPJ:string[] =
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
function removeFormatationFromCNPJ():string
{
    //Remove todos os caracteres especiais do CNPJ e armazena em uma variável especial e temporária.
    let removeFormatationCNPJtemp:string = CNPJ_Input.value.replace(/[.\-\/]/g, '');
    //Retorna o valor ao input.
    CNPJ_Input.value = removeFormatationCNPJtemp as string;
    //Adiciona um log.
    throwNewLog("Formatação removida!", "CNPJ_Input.value", CNPJ_Input.value);
    
    //Atualiza a variável JSON e atualiza o arquivo em seguida.
    Loaded_Settings.preferences.cnpjValue = CNPJ_Input.value;
    atualizar_o_JSON_main(Loaded_Settings);

    //Caso chamem essa função, irá retornar o valor do CNPJ (Isso após efetuarmos a desformatação).
    return CNPJ_Input.value;
}

//Função de copiar o conteúdo para a área de transferência.
function copyToClipboard(input:any):void
{
    //Armazena o texto que desejamos copiar para uma variável.
    let textToCopy:string = input.value;
    //Copia para a área de transferência.
    navigator.clipboard.writeText(textToCopy);

    //Adiciona um novo log.
    throwNewLog("Copiado para a área de transferência!", "textToCopy", textToCopy);
}

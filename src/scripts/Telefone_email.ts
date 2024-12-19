//Telefone_email.js
//
//Arquivo de lógica de funcionamento para a manipulação do CNPJ.
//
//Criado por: João Denadai

//Importando a função de logs de eventos.
import { atualizar_o_JSON_main, Loaded_Settings } from './JSON_Load.js';
import {throwNewLog, throwException} from './Logs.js';

//Importando elementos do HTML: Index.html.
//NÃO ALTERAR NENHUM PARÂMETRO OU IRÁ QUEBRAR O CÓDIGO.
const InputPhoneOrEmail:HTMLInputElement = document.getElementById('InputPhoneOrEmail-input') as HTMLInputElement;
const manualFormatButton:HTMLButtonElement = document.getElementById('phoneOrEmailFormater-button') as HTMLButtonElement;
const checkboxAutomaticFormat:HTMLInputElement = document.getElementById('PhoneMail-Checkbox-autoformat-element') as HTMLInputElement;
const manualCopyButton:HTMLInputElement = document.getElementById('phoneOrEmailCopy-button') as HTMLInputElement;
const removeFormatationButton:HTMLInputElement = document.getElementById('phoneOrEmailRemoveFormatation-button') as HTMLInputElement;
const checkboxAutomaticCopy:HTMLInputElement = document.getElementById('PhoneMail-Checkbox-autocopy-element') as HTMLInputElement;

//Algumas normas de formatação úteis para o código.
const RestrictedEspecialRegExp = /[^@\-\.a-zA-Z0-9]/g;
const RestrictedNumsAndCharsRegExp = /[^a-zA-Z0-9]/g;
const RestrictedBlankSpacesRegExp = /[\s]/g;

//Carregando as configurações do arquivo JSON.
InputPhoneOrEmail.value = Loaded_Settings.preferences.phoneAndEmailValue;
checkboxAutomaticFormat.checked = Loaded_Settings.preferences.phoneAndEmailAutoFormat;
checkboxAutomaticCopy.checked = Loaded_Settings.preferences.phoneAndEmailAutoCopy;

//Variáveis globais que irão se alterando caso o conteúdo seja identificado sendo um e-mail ou telefone.
let isValue_Phone = false;
let isValue_Email = false;

//Funções de EventListener. Basicamente dando lógica aos botões e conteúdos do HTML.
//O primeiro é o 'input' do 'InputPhoneOrEmail'.
//Toda vez que algum valor, dentro do InputPhoneOrEmail for alterado, ele irá chamar a função de 'inputContentRefresh'
InputPhoneOrEmail.addEventListener('input', () => {
    inputContentRefresh(false);
    Loaded_Settings.preferences.phoneAndEmailValue = InputPhoneOrEmail.value;
    atualizar_o_JSON_main(Loaded_Settings);
})

//Evento para controlar a ação do Backspace.
InputPhoneOrEmail.addEventListener('keydown', (event) => {
    //Se a tecla apertada for um Backspace, ele irá remover o atributo de 'maxlength'.
    //Ou seja, ao apagar, ele irá permitir de o input tenha um valor máximo de caracteres indefinido.
    if(event.key === 'Backspace')
    {
        //Remove o atributo.
        InputPhoneOrEmail.removeAttribute('maxlength');
    }
});

//Botão de formatação manual.
//Ele irá chamar o inputContentRefresh passando o valor de 'true'.
//Esse valor serve como um bypass para que o checkbox da formatação automatica não precise estar habilitado.
manualFormatButton.addEventListener('mousedown', () => {
    inputContentRefresh(true);
    //Atualiza a variável JSON e atualiza o arquivo em seguida.
    Loaded_Settings.preferences.phoneAndEmailValue = InputPhoneOrEmail.value;
    atualizar_o_JSON_main(Loaded_Settings);
});

//Ao apertar o botão de copiar para a área de transferência...
manualCopyButton.addEventListener('mousedown', () => {
    //Chama a função de copiar o conteúdo.
    copyToClipboard(InputPhoneOrEmail);
});
//Ao colar o conteúdo no InputPhoneOrEmail, ele irá chamar a função para efetuar a mesma verificação que a de ter alterado o input.
InputPhoneOrEmail.addEventListener('paste', (event) => {
    //Irá prevenir o comportamento padrão de colar.
    event.preventDefault();
    //Vai armazenar a informação que está sendo colada em uma variável.
    //Armazenando no tipo de texto.
    const pastedData:string | undefined = event.clipboardData?.getData('text');

    //Informando que o valor do input será o que está sendo colado.
    //Estamos passando como sendo uma string.
    InputPhoneOrEmail.value = pastedData as string;

    //Atualiza o conteúdo sem habilitar o bypass.
    inputContentRefresh(false);

    //Atualiza a variável JSON e atualiza o arquivo em seguida.
    Loaded_Settings.preferences.phoneAndEmailValue = InputPhoneOrEmail.value;
    atualizar_o_JSON_main(Loaded_Settings);
});

//Ao alterar o checkbox de formatação automática, ele irá efetuar...
checkboxAutomaticFormat.addEventListener('change', () => {
    if(checkboxAutomaticFormat.checked)
    {   
        //Atualiza o conteúdo do InputPhoneOrEmail, chamando a função de atualização.
        inputContentRefresh(false);

        //Desabilita a formatação manual.
        manualFormatButton.disabled = true;
    } else {

        //Reabilita novamente.
        manualFormatButton.disabled = false;
    }
    //Atualiza a variável JSON e atualiza o arquivo em seguida.
    Loaded_Settings.preferences.phoneAndEmailAutoFormat = checkboxAutomaticFormat.checked;
    atualizar_o_JSON_main(Loaded_Settings);
});

//O eventlistener foi aplicado aqui para apenas armazenar o valor de copiar automaticamente no arquivo JSON.
checkboxAutomaticCopy.addEventListener('change', () => {
    //Atualiza a variável JSON e atualiza o arquivo em seguida.
    Loaded_Settings.preferences.phoneAndEmailAutoCopy = checkboxAutomaticCopy.checked;
    atualizar_o_JSON_main(Loaded_Settings);
})

//Ao apertar no botão de remover formtação.
removeFormatationButton.addEventListener('mousedown', () => {
    //Salva o valor de InputPhoneOrEmail em uma variável.
    let inputValue = InputPhoneOrEmail.value;

    //Se o valor for um telefone...
    if(isValue_Phone) 
    {
        //Ele remove a formatação, removendo () e -
        inputValue = inputValue.replace(RestrictedNumsAndCharsRegExp, '');

        //Atualiza a tela e edita o tamanho máximo de caractéres da tela.
        //Previne de overloads.
        //Esse atributo aliás é removido ao usar o backspace.
        InputPhoneOrEmail.value = inputValue;
        InputPhoneOrEmail.setAttribute('maxlength', '11');
    }
});

//Função que atualiza o conteúdo do InputPhoneOrEmail.
function inputContentRefresh(bypass:boolean)
{
    //Se a formatação automatica estiver habilitada...
    if(checkboxAutomaticFormat.checked || bypass)
    {
        //...ele irá chamar a função que verifica o conteúdo do InputPhoneOrEmail.
        //Passamos true para ele substituir minusculas e também para atualizar o conteúdo.
        inputVerifyContent(InputPhoneOrEmail, true, true);

        //Com isso, chama as funções para verificar se é um e-mail, ou telefone.
        isPhone(InputPhoneOrEmail);
        isEmail(InputPhoneOrEmail);
    }
}

//Verifica o conteúdo do InputPhoneOrEmail.
function inputVerifyContent(htmlElement: HTMLInputElement, refreshContent:boolean, inLowerCase:boolean):void
{
    //Armazena o valor do InputPhoneOrEmail em uma variável.
    let htmlInputValue = htmlElement.value;

    //Se a função for chamada e o valor de inLowerCase for passado em verdadeiro...
    if(inLowerCase)
    {
        //...Ele irá fazer com que todo o conteúdo fique em minúsculo.
        htmlInputValue = htmlInputValue.toLowerCase();
    }
    //Faz uma verificação de caracteres especiais.
    //Se o conteúdo do input estiver com algum valor diferente da expressão regular..
    if(RestrictedEspecialRegExp.test(htmlInputValue))
        {   
            //Roda o while em que irá fazer mais uma verificação, removendo tudo que não for letras ou numeros.
            while(RestrictedEspecialRegExp.test(htmlInputValue) || RestrictedNumsAndCharsRegExp.test(htmlInputValue))
                {
                    //Usa replace para colocar como se fosse conteúdos "vazios".
                    htmlInputValue = htmlInputValue.replace(RestrictedBlankSpacesRegExp, '');
                    htmlInputValue = htmlInputValue.replace(RestrictedEspecialRegExp, '');
                }
        }
    //Se atualizar conteúdo estiver passando como true..
    if(refreshContent)
    {
        //Ele irá atualizar o conteúdo do input.
        htmlElement.value = htmlInputValue;
    }
}

//Função que verifica e formata se o conteúdo for um telefone.
function isPhone(htmlElement: HTMLInputElement):boolean
{
    //Armazena o conteúdo do input.
    let htmlInputValue:string = htmlElement.value;

    //Duas expressões regulares para capturar conteúdos que não sejam números ou traços.
    let RegExp = /[^0-9]/g;
    let NumReg = /[^0-9\-]/g;

    //Se o tamanho do input for maior que 9 e menor que 15 e a expressão regular para conteúdos que não sejam numeros ou traço der falso..
    if(htmlInputValue.length > 9 && htmlInputValue.length <= 15 && !NumReg.test(htmlInputValue))
    {
        //Adiciona o atributo de maxlength de 15, limitando a quantidade de caracteres que o usuário pode colocar.
        //Também altera o valor de isValue_Phone para true.
        InputPhoneOrEmail.setAttribute('maxlength', '15');
        isValue_Phone = true;
    } else  //Senão..
    {
        //Ele vai remover o atributo de maxlength..
        //E irá passar o isValue_Phone sendo falso.
        //Retorna a função com falso.
        InputPhoneOrEmail.removeAttribute('maxlength');
        isValue_Phone = false;
        return false;
    }
    
    //Faz um teste de expressão regular, verificando se há algum valor que não seja apenas numeros.
    if(RegExp.test(htmlInputValue) && isValue_Phone)
    {   
        //Se sim, irá substituir esse valor por um campo vazio.
        htmlInputValue = htmlInputValue.replace(RegExp, '');

        //Atualiza o input.
        htmlElement.value = htmlInputValue;
    }

    //Se o isValue_Phone for positivo e o tamanho for exatamente igual a 10..
    if(isValue_Phone && htmlInputValue.length === 10)
    {
        //Ele irá recolocar novamente todos os valores que não são numeros para vazio.
        htmlInputValue = htmlInputValue.replace(RegExp, '');

        //Armazena as partes de um telefone em uma array de string.
        let telefone:string[] = 
        [
            htmlInputValue.slice(0, 2),
            htmlInputValue.slice(2, 6),
            htmlInputValue.slice(6)
        ];

        //Retorna o valor para o input, sendo ele o telefone formatado e passado novamente via array.
        htmlInputValue = `(${telefone[0]}) ${telefone[1]}-${telefone[2]}`;
        //Passa o valor de volta para o input.
        htmlElement.value = htmlInputValue;

        //Se copiar para a área de transferência estiver habilitado, ele irá copiar assim que for formatado o telefone.
        if(checkboxAutomaticCopy.checked)
            {
                
                copyToClipboard(InputPhoneOrEmail);
                
            }
    }

    //Se o isValue_Phone for verdadeiro e o tamanho do input for igual a 11..
    if(isValue_Phone && htmlInputValue.length === 11)
        {
            //Irá fazer a verificação de caracteres especiais, removendo qualquer coisa que seja um número.
            htmlInputValue = htmlInputValue.replace(RegExp, '');
            
            //Armazena o valor do telefone em uma array de string.
            let telefone:string[] = 
            [
                htmlInputValue.slice(0, 2),
                htmlInputValue.slice(2, 7),
                htmlInputValue.slice(7)
            ];
            
            //Passa para a variável do input o valor formatado..
            htmlInputValue = `(${telefone[0]}) ${telefone[1]}-${telefone[2]}`;
            //Passa para o input.
            htmlElement.value = htmlInputValue;

            //Se a cópia automática estiver habilitada..
            if(checkboxAutomaticCopy.checked)
            {
                //Irá copiar o conteúdo.
                copyToClipboard(InputPhoneOrEmail);
            }
        };

    //Retorna verdadeiro.
    return true;
}

//Função que verifica se é um e-mail.
function isEmail(htmlElement: HTMLInputElement):boolean
{
    //Armazena o valor do input em uma variável.
    let htmlValue = htmlElement.value;

    //Cria um array do tipo string.
    let arrayEmail: string[];

    //Se o conteúdo incluir em algum momento uma @.
    if(htmlValue.includes('@')){
        //Ele irá cortar, separando o que tem após do que tem antes do @.
        //Armazena o valor na array.
        arrayEmail = htmlValue.split('@');

        //Ele diz que é um e-mail, passando para o isValue_Email o valor de true.
        isValue_Email = true;
    } else {
        //Senão, ele passa o valor de false e retorna false.
        isValue_Email = false;
        return false;
    };
    //Se o isValue_Email for true e o array, após o @, for de um tamanho maior que 1..
    if(isValue_Email && arrayEmail[1].length > 1)
    {
        //Ele faz algo, mas no momento não sei o que ele pode fazer..


        //Copia o conteúdo se o checkbox estiver marcado.
        if(checkboxAutomaticCopy.checked)
        {
               copyToClipboard(InputPhoneOrEmail);
        }
    };

    //Retorna verdadeiro.
    return true;
}

//Função de copiar o conteúdo para a área de transferência.
function copyToClipboard(Key:any):void
{
    //Armazena o texto que desejamos copiar para uma variável.
    let textToCopy:string = Key.value;
    //Copia para a área de transferência.
    navigator.clipboard.writeText(textToCopy);
}

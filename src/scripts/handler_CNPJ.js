//handler_CNPJ.js
//
//Arquivo de lógica de funcionamento para a manipulação do CNPJ.
//
//Criado por: João Denadai


//Inclusão de elementos do "../Index.html"
//Evitar alterar o nome das variáveis.
const cnpjInput = document.getElementById('cnpjInput');
const cnpjFormatButton = document.getElementById('cnpjFormatButton');
const copyButton = document.getElementById('cnpjCopyButton');
const unformatButton = document.getElementById('cnpjUnformatButton');
const smartPed = document.getElementById('SmartPedButton');
let finalCnpj;
let unformatedCnpj = null;

smartPed.addEventListener('click', (evento) =>
{
    cnpj = cnpjInput.value;
    cnpjInput.value = formatarCNPJ(cnpj);
    unformatedCnpj = unformatCnpj(cnpjInput.value);
    copyToClipboard(cnpjInput);
    let SmartURL = (`https://www.smartped.com.br/AreaCliente/sup/WfConfigDistCli.aspx?cnpj=${unformatedCnpj}`);
    window.open(SmartURL, "_blank", "top=500,left=200,frame=true, width=1400, height=600, nodeIntegration=no");
})

cnpjFormatButton.addEventListener('mousedown', (formatar) =>
{
    cnpj = cnpjInput.value;
    cnpjInput.value = formatarCNPJ(cnpj);
    unformatedCnpj = unformatCnpj(cnpjInput.value);
    copyToClipboard(cnpjInput);
});

unformatButton.addEventListener('mousedown', (unformat) =>
{
    cnpjFormated = cnpjInput.value;
    cnpjInput.value = unformatCnpj(cnpj);
});

function formatarCNPJ(cnpj) {
    
    if (cnpj.length !== 14) {
        if(cnpj.length ===18)
        {
            if ((cnpj.includes('.') || cnpj.includes('/') || cnpj.includes('-')))
            {
               return finalCnpj;
            }
        }
        cnpjInput.placeholder = 'O CNPJ é inválido';
        return null;
    }

    let partes = [
        cnpj.slice(0, 2),
        cnpj.slice(2, 5),
        cnpj.slice(5, 8),
        cnpj.slice(8, 12),
        cnpj.slice(12, 14),
    ];
    finalCnpj = `${partes[0]}.${partes[1]}.${partes[2]}/${partes[3]}-${partes[4]}`;
    return finalCnpj;
}

copyButton.addEventListener('mousedown', (evento) =>
{
    copyToClipboard(cnpjInput);
})

function copyToClipboard(input)
{
    textToCopy = input.value;
    navigator.clipboard.writeText(textToCopy);
    return null;
}

function unformatCnpj(input)
{
    return input.replace(/[.\-\/]/g, '');
}



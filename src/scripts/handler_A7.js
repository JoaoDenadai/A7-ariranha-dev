const A7Input = document.getElementById('a7Input');
const A7FormatButton = document.getElementById('a7FormatButton');

A7FormatButton.addEventListener('mousedown', (formatar) =>
{
    CodigoA7 = A7Input.value;
    A7Input.value = A7Conversor(CodigoA7);
});

function A7Conversor(CodigoA7)
{
    if(CodigoA7.length !== 9)
    {
        A7Input.placeholder = 'Código A7 inválido';
        return null;
    }

    let matrizCodigoA7 = [
        CodigoA7.slice(0, 4),
        CodigoA7.slice(4, 9),
    ]

    return `${matrizCodigoA7[0]}-${matrizCodigoA7[1]}`
}
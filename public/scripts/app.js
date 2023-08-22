let DICCIONRAIO;
const ALFABETO = 'abcdefghijklmnopqrstuvwxyz';



$(document).ready(() => {
    navbar();
    validar();
    frm_cifrado();
    frm_descifrado();

    load_dic();
});

async function load_dic() {
    await fetch('/recursos/palabras_clean.json')
        .then(res => res.json())
        .then(res => {
            DICCIONRAIO = res;
        });
}


function navbar() {
    // Comportamiento de navbar
    $('#div_descifrar').hide();

    $('#btn_cifrar').on('click', () => {
        $('#div_cifrar').show();
        $('#div_descifrar').hide();
        $('#btn_descifrar').removeClass('active');
        $('#btn_cifrar').addClass('active');
    });

    $('#btn_descifrar').on('click', () => {
        $('#div_descifrar').show();
        $('#div_cifrar').hide();
        $('#btn_cifrar').removeClass('active');
        $('#btn_descifrar').addClass('active');
    });

    const opcion = $(location).attr('href').split('#')[1];
    if (opcion && opcion === 'descifrar') {
        $('#btn_descifrar').click();
    }
}


function validar() {
    // Validar entrada cifrado
    $('#cifrar_despla').on('input', function () {
        if ($(this).is(':invalid')) {
            $(this).addClass('is-invalid');
        } else if ($(this).is(':valid')) {
            $(this).removeClass('is-invalid');
        }
    });

    $('#cifrar_mensaje').on('focusout', function () {
        if ($(this).is(':invalid')) {
            $(this).addClass('is-invalid');
        } else {
            $(this).removeClass('is-invalid');
        }
    });


    // Validar entrada descifrado
    $('#descifrar_despla').on('input', function () {
        if ($(this).is(':invalid')) {
            $(this).addClass('is-invalid');
        } else if ($(this).is(':valid')) {
            $(this).removeClass('is-invalid');
        }
    });

    $('#descifrar_mensaje').on('input', function () {
        if ($(this).is(':invalid')) {
            $(this).addClass('is-invalid');
        } else if ($(this).is(':valid')) {
            $(this).removeClass('is-invalid');
        }
    });

}

//descifrado
function frm_descifrado() {
    $('#adivinar_despl').on('change', function () {
        if (this.checked) {
            $('#descifrar_despla').prop('disabled', true);
        } else {
            $('#descifrar_despla').prop('disabled', false);
        }
    });

    $('#frm_descifrar').on('submit', function (e) {
        e.preventDefault();

        if ($('#adivinar_despl').is(':checked')) {
            const res = descifrar($('#descifrar_mensaje').val(), ALFABETO, DICCIONRAIO);
            $('#mensaje_descifrado').val(res.msg);
            $('#descifrar_despla').val(res.mejor_despl);
            $('#duracion').text(`Tardo ${res.time} segundos`);
        } else {
            const desci = cifrar($('#descifrar_mensaje').val(), (ALFABETO.length - parseInt($('#descifrar_despla').val())), ALFABETO);
            $('#duracion').text(``);
            $('#mensaje_descifrado').val(desci);
        }

        return false;
    });
}


function descifrar(mensaje, alfabeto, diccionario) {
    const t_ini = Date.now();

    mensaje = mensaje.toLowerCase();
    const msg = mensaje.split('');
    const msg_len = mensaje.split(' ').length;
    let mejor_despl = 0;
    let mejor_descifr = msg;
    let max_aciertos = 0;

    for (let despl = 0; despl < alfabeto.length; despl++) {
        const msg_despl = msg.map(letra => 
            (alfabeto.includes(letra)) ?
                alfabeto[(alfabeto.indexOf(letra) + (alfabeto.length - despl)) % alfabeto.length] : letra)
                .join('');
        
        const aciertos = appearances(diccionario, msg_despl.split(' '));
        console.log(msg_despl)
        console.log(aciertos)

        if (aciertos >= max_aciertos) {
            max_aciertos = aciertos;
            mejor_despl = despl;
            mejor_descifr = msg_despl;
        }

        if (aciertos >= msg_len * 0.60) {
            break;
        }
    }

    const t_fin = Date.now();

    return {
        msg: mejor_descifr,
        mejor_despl,
        max_aciertos,
        time: (t_fin - t_ini) / 1000
    };
}


// cifrado
function frm_cifrado() {
    $('#frm_cifrar').on('submit', function (e) {
        e.preventDefault();

        const cifrado = cifrar($('#cifrar_mensaje').val(), parseInt($('#cifrar_despla').val()), ALFABETO);
        $('#mensaje_cifrado').val(cifrado);

        return false;
    });
}


function cifrar(mensaje, despl, alfabeto) {
    mensaje = mensaje.toLowerCase();

    if (mensaje && mensaje.length > 0) {
        return mensaje.split('').map(letra => 
                (alfabeto.includes(letra)) ?
                    alfabeto[(alfabeto.indexOf(letra) + despl) % alfabeto.length]
                    : letra     
            ).join('');
    }

    return '';
}


const appearances = (arrUnique, arrRepeated) => arrUnique.reduce((acum, valUnique) => {
    acum += arrRepeated.filter(v => valUnique === v).length;
    return acum;
}, 0);

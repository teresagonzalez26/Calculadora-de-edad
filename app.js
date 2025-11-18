// Selección de elementos del DOM
const ageForm = document.getElementById('age-form');
const diaInput = document.getElementById('dia');
const mesInput = document.getElementById('mes');
const añoInput = document.getElementById('año');
const diaError = document.getElementById('dia-error');
const mesError = document.getElementById('mes-error');
const añoError = document.getElementById('año-error');
const añosResult = document.getElementById('años');
const mesesResult = document.getElementById('meses');
const diasResult = document.getElementById('dias');

// Manejo del evento submit del formulario
ageForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Limpiar errores previos
    clearErrors();
    
    // Obtener valores de los inputs
    const dia = parseInt(diaInput.value);
    const mes = parseInt(mesInput.value);
    const año = parseInt(añoInput.value);
    
    // Validar la fecha
    const isValid = validateDate(dia, mes, año);
    
    if (isValid) {
    // Calcular edad si la fecha es válida
        const edad = calculateAge(dia, mes, año);
        displayAge(edad);
    }
});

// Función para limpiar errores
function clearErrors() {
    diaError.textContent = '';
    mesError.textContent = '';
    añoError.textContent = '';
    
    diaInput.classList.remove('input-error');
    mesInput.classList.remove('input-error');
    añoInput.classList.remove('input-error');
    
    document.querySelector('label[for="dia"]').classList.remove('label-error');
    document.querySelector('label[for="mes"]').classList.remove('label-error');
    document.querySelector('label[for="año"]').classList.remove('label-error');
}

// Función de validación principal
function validateDate(dia, mes, año) {
    let isValid = true;
    const añoActual = new Date().getFullYear();
    const fechaActual = new Date();
    
    // Validar campos vacíos
    if (isNaN(dia)) {
        showError(diaInput, diaError, 'Este campo es obligatorio');
        isValid = false;
    }
    
    if (isNaN(mes)) {
        showError(mesInput, mesError, 'Este campo es obligatorio');
        isValid = false;
    }
    
    if (isNaN(año)) {
        showError(añoInput, añoError, 'Este campo es obligatorio');
        isValid = false;
    }
    
    // Si algún campo está vacío, detener la validación
    if (!isValid) return false;
    
    // Validar rangos básicos
    if (dia < 1 || dia > 31) {
        showError(diaInput, diaError, 'Debe ser un día válido');
        isValid = false;
    }
    
    if (mes < 1 || mes > 12) {
        showError(mesInput, mesError, 'Debe ser un mes válido');
        isValid = false;
    }
    
    if (año > añoActual) {
        showError(añoInput, añoError, 'Debe estar en el pasado');
        isValid = false;
    }
    
    if (año < 1900) {
        showError(añoInput, añoError, 'Debe ser un año válido');
        isValid = false;
    }
    
    // Si hay errores de rango, detener la validación
    if (!isValid) return false;
    
    // Validar fecha real (días del mes, años bisiestos)
    const diasEnMes = getDaysInMonth(mes, año);
    if (dia > diasEnMes) {
        showError(diaInput, diaError, 'Debe ser una fecha válida');
        isValid = false;
    }
    
    // Validar fecha futura
    const fechaIngresada = new Date(año, mes - 1, dia);
    if (fechaIngresada > fechaActual) {
        showError(diaInput, diaError, 'Debe ser una fecha en el pasado');
        showError(mesInput, mesError, '');
        showError(añoInput, añoError, '');
        isValid = false;
    }
    
    return isValid;
}

// Función para mostrar errores
function showError(inputElement, errorElement, message) {
    errorElement.textContent = message;
    inputElement.classList.add('input-error');
    document.querySelector(`label[for="${inputElement.id}"]`).classList.add('label-error');
}

// Función para obtener días en un mes (considerando años bisiestos)
function getDaysInMonth(mes, año) {
    // Febrero
    if (mes === 2) {
        // Año bisiesto: divisible por 4, pero no por 100, a menos que también sea divisible por 400
        return (año % 4 === 0 && (año % 100 !== 0 || año % 400 === 0)) ? 29 : 28;
    }
    
    // Meses con 31 días: enero, marzo, mayo, julio, agosto, octubre, diciembre
    if ([1, 3, 5, 7, 8, 10, 12].includes(mes)) {
        return 31;
    }
    
    // Meses con 30 días
    return 30;
}

// Función para calcular la edad
function calculateAge(dia, mes, año) {
    const fechaNacimiento = new Date(año, mes - 1, dia);
    const hoy = new Date();
    
    let años = hoy.getFullYear() - fechaNacimiento.getFullYear();
    let meses = hoy.getMonth() - fechaNacimiento.getMonth();
    let dias = hoy.getDate() - fechaNacimiento.getDate();
    
    // Ajustar si el día actual es anterior al día de nacimiento
    if (dias < 0) {
        meses--;
        // Obtener días del mes anterior
        const mesAnterior = new Date(hoy.getFullYear(), hoy.getMonth(), 0);
        dias += mesAnterior.getDate();
    }
    
    // Ajustar si el mes actual es anterior al mes de nacimiento
    if (meses < 0) {
        años--;
        meses += 12;
    }
    
    return { años, meses, dias };
}

// Función para mostrar la edad con animación
function displayAge(edad) {
    animateValue(añosResult, 0, edad.años, 1500);
    setTimeout(() => {
        animateValue(mesesResult, 0, edad.meses, 1500);
    }, 300);
    setTimeout(() => {
        animateValue(diasResult, 0, edad.dias, 1500);
    }, 600);
}

// Función para animar números
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Validación en tiempo real para mejorar UX
[diaInput, mesInput, añoInput].forEach(input => {
    input.addEventListener('input', () => {
        // Limpiar error individual cuando el usuario empiece a escribir
        if (input.value.trim() !== '') {
            input.classList.remove('input-error');
            document.querySelector(`label[for="${input.id}"]`).classList.remove('label-error');
            document.getElementById(`${input.id}-error`).textContent = '';
        }
    });
});
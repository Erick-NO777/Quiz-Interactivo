// Variables globales
let tiempoRestante = 30;
let temporizadorInterval;
let preguntaActual = 0;
let preguntasCorrectas = 0; // Contador de preguntas correctas
let puntaje = 0; // Puntaje si lo necesitas en el futuro

// Preguntas del Quiz
const preguntas = [
    {
        tipo: "seleccion-multiple", // Selección múltiple
        pregunta: "¿Cuál es el lenguaje de marcado utilizado para crear páginas web?",
        opciones: ["JavaScript", "HTML", "CSS", "Python"],
        respuesta: "HTML",
        dificultad: 1 // Dificultad baja
    },
    {
        tipo: "seleccion-multiple",
        pregunta: "¿Qué significa HTML?",
        opciones: ["HyperText Markup Language", "HyperText Markdown Language", "HyperTool Markup Language", "None of the above"],
        respuesta: "HyperText Markup Language",
        dificultad: 1
    },
    {
        tipo: "verdadero-falso", // Pregunta de verdadero/falso
        pregunta: "¿HTML5 es la última versión de HTML?",
        opciones: ["Verdadero", "Falso"],
        respuesta: "Verdadero",
        dificultad: 1
    },
    {
        tipo: "verdadero-falso", 
        pregunta: "CSS es utilizado para darle estilo a las páginas web.",
        opciones: ["Verdadero", "Falso"],
        respuesta: "Verdadero",
        dificultad: 1 // Dificultad baja
    },
    {
        tipo: "emparejamiento", // Pregunta de emparejamiento
        pregunta: "Empareja los elementos con su descripción.",
        opciones: [
            { elemento: "HTML", descripcion: "Lenguaje de marcado" },
            { elemento: "CSS", descripcion: "Lenguaje de estilos" },
            { elemento: "JavaScript", descripcion: "Lenguaje de programación" }
        ],
        respuestas: ["Lenguaje de marcado", "Lenguaje de estilos", "Lenguaje de programación"], // Las descripciones correctas
        dificultad: 3 // Dificultad alta
    },
    {
        tipo: "emparejamiento",
        pregunta: "Empareja los elementos de JavaScript con su descripción.",
        opciones: [
            { elemento: "Array", descripcion: "Colección de elementos" },
            { elemento: "Function", descripcion: "Bloque de código reutilizable" },
            { elemento: "Variable", descripcion: "Almacena un valor" }
        ],
        respuestas: ["Colección de elementos", "Bloque de código reutilizable", "Almacena un valor"],
        dificultad: 3
    },
];

// Funciones de temporizador
function iniciarTemporizador() {
    tiempoRestante = 30;
    document.getElementById('tiempo-restante').textContent = tiempoRestante;
    temporizadorInterval = setInterval(() => {
        tiempoRestante--;
        document.getElementById('tiempo-restante').textContent = tiempoRestante;
        if (tiempoRestante <= 0) {
            clearInterval(temporizadorInterval);
            avanzarPregunta();
        }
    }, 1000);
}

function pausarTemporizador() {
    clearInterval(temporizadorInterval);
}

// Barajar preguntas y mostrar la primera
function barajarPreguntas() {
    const numeroPreguntas = 6;
    preguntasAleatorias = preguntas
        .map(pregunta => ({ pregunta, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ pregunta }) => pregunta)
        .slice(0, numeroPreguntas); // Seleccionar un número limitado de preguntas
}

function mostrarPregunta() {
    const pregunta = preguntasAleatorias[preguntaActual];
    const preguntaTexto = document.getElementById('pregunta-texto');
    const opcionesLista = document.getElementById('opciones-lista');

    preguntaTexto.textContent = pregunta.pregunta;
    opcionesLista.innerHTML = ''; // Limpiar opciones anteriores

    // Verificar el tipo de pregunta
    if (pregunta.tipo === "seleccion-multiple") {
        // Generar opciones para selección múltiple
        pregunta.opciones.forEach(opcion => {
            const li = document.createElement('li');
            li.textContent = opcion;
            li.classList.add('opcion');
            li.addEventListener('click', seleccionarOpcion);
            opcionesLista.appendChild(li);
        });
    } else if (pregunta.tipo === "verdadero-falso") {
        // Generar opciones para verdadero/falso
        pregunta.opciones.forEach(opcion => {
            const li = document.createElement('li');
            li.textContent = opcion;
            li.classList.add('opcion');
            li.addEventListener('click', seleccionarOpcion);
            opcionesLista.appendChild(li);
        });
    } else if (pregunta.tipo === "emparejamiento") {
        // Generar campos de emparejamiento
        pregunta.opciones.forEach(par => {
            const div = document.createElement('div');
            const label = document.createElement('label');
            label.textContent = par.elemento;
            const select = document.createElement('select');
            
            // Crear opciones para seleccionar
            pregunta.respuestas.forEach(respuesta => {
                const option = document.createElement('option');
                option.value = respuesta;
                option.textContent = respuesta;
                select.appendChild(option);
            });
            
            div.appendChild(label);
            div.appendChild(select);
            opcionesLista.appendChild(div);
        });
    }
}


// Selección de opción
let opcionSeleccionada = null;

function seleccionarOpcion(e) {
    const opciones = document.querySelectorAll('.opcion');
    opciones.forEach(op => op.classList.remove('seleccionado')); // Remover seleccionados anteriores
    e.target.classList.add('seleccionado'); // Seleccionar opción clicada
    opcionSeleccionada = e.target.textContent;
}

// Verificar respuesta seleccionada
function verificarRespuesta() {
    const pregunta = preguntasAleatorias[preguntaActual];

    if (pregunta.tipo === "seleccion-multiple" || pregunta.tipo === "verdadero-falso") {
        if (opcionSeleccionada === pregunta.respuesta) {
            preguntasCorrectas++;
            mostrarRetroalimentacion(true);
        } else {
            mostrarRetroalimentacion(false);
        }
    } else if (pregunta.tipo === "emparejamiento") {
        const selects = document.querySelectorAll('#opciones-lista select');
        let respuestasCorrectas = 0;

        selects.forEach((select, index) => {
            if (select.value === pregunta.respuestas[index]) {
                respuestasCorrectas++;
            }
        });

        if (respuestasCorrectas === pregunta.respuestas.length) {
            preguntasCorrectas++;
            mostrarRetroalimentacion(true);
        } else {
            mostrarRetroalimentacion(false);
        }
    }

    opcionSeleccionada = null; // Resetear selección
}


// Mostrar retroalimentación
function mostrarRetroalimentacion(esCorrecto) {
    const retroalimentacion = document.getElementById('retroalimentacion');
    retroalimentacion.classList.remove('ocultar');
    retroalimentacion.textContent = esCorrecto ? "¡Correcto!" : `Incorrecto. La respuesta correcta era: ${preguntasAleatorias[preguntaActual].respuesta}`;
    retroalimentacion.classList.add(esCorrecto ? 'correcto' : 'incorrecto');
    
    setTimeout(() => {
        retroalimentacion.classList.add('ocultar');
        retroalimentacion.classList.remove('correcto', 'incorrecto');
    }, 2000);
}

// Avanzar a la siguiente pregunta
function avanzarPregunta() {
    preguntaActual++;
    if (preguntaActual < preguntasAleatorias.length) {
        mostrarPregunta();
        iniciarTemporizador(); // Reiniciar el temporizador para la nueva pregunta
    } else {
        mostrarResultados(); // Mostrar resultados si no hay más preguntas
    }
}

// Mostrar resultados finales
function mostrarResultados() {
    const preguntasPantalla = document.getElementById('preguntas');
    const resultadosPantalla = document.getElementById('resultados');
    const puntajeFinal = document.getElementById('puntaje-final');
    const totalPreguntas = document.getElementById('total-preguntas');
    const mensajeFinal = document.getElementById('mensaje-final');
    
    preguntasPantalla.classList.add('ocultar');
    resultadosPantalla.classList.remove('ocultar');
    puntajeFinal.textContent = preguntasCorrectas;
    totalPreguntas.textContent = preguntasAleatorias.length;
    
    const porcentaje = (preguntasCorrectas / preguntasAleatorias.length) * 100;
    if (porcentaje === 100) {
        mensajeFinal.textContent = "¡Excelente! Respondiste todas las preguntas correctamente.";
    } else if (porcentaje >= 70) {
        mensajeFinal.textContent = "¡Muy bien! Tienes un buen conocimiento.";
    } else if (porcentaje >= 40) {
        mensajeFinal.textContent = "Está bien, pero puedes mejorar.";
    } else {
        mensajeFinal.textContent = "Necesitas estudiar más. ¡Inténtalo de nuevo!";
    }

    // Guardar historial en localStorage
    const historial = JSON.parse(localStorage.getItem('historial')) || [];
    historial.push({
        fecha: new Date().toLocaleString(),
        puntaje: preguntasCorrectas,
        total: preguntasAleatorias.length
    });
    localStorage.setItem('historial', JSON.stringify(historial));
}

// Reiniciar el quiz
function reiniciarQuiz() {
    const resultadosPantalla = document.getElementById('resultados');
    const inicioPantalla = document.getElementById('inicio');
    
    resultadosPantalla.classList.add('ocultar');
    inicioPantalla.classList.remove('ocultar');
    preguntaActual = 0;
    preguntasCorrectas = 0;
    tiempoRestante = 30; // Reiniciar el temporizador
    clearInterval(temporizadorInterval); // Asegurarse de detener el temporizador
}

// Eventos de inicio y siguiente
document.getElementById('comenzar-btn').addEventListener('click', () => {
    document.getElementById('inicio').classList.add('ocultar');
    document.getElementById('preguntas').classList.remove('ocultar');
    barajarPreguntas(); // Barajar preguntas
    mostrarPregunta();
    iniciarTemporizador();
});

document.getElementById('siguiente-btn').addEventListener('click', () => {
    const pregunta = preguntasAleatorias[preguntaActual];

    if (pregunta.tipo === "seleccion-multiple" || pregunta.tipo === "verdadero-falso") {
        // Validar si el usuario seleccionó una opción
        if (!opcionSeleccionada) {
            alert("Por favor selecciona una opción antes de continuar.");
            return;
        }
    } else if (pregunta.tipo === "emparejamiento") {
        // Validar si todas las opciones de emparejamiento fueron seleccionadas
        const selects = document.querySelectorAll('#opciones-lista select');
        let seleccionCompleta = true;

        selects.forEach(select => {
            if (select.value === "") {
                seleccionCompleta = false;
            }
        });

        if (!seleccionCompleta) {
            alert("Por favor selecciona una opción para cada emparejamiento.");
            return;
        }
    }

    // Si pasa la validación, pausar el temporizador y verificar la respuesta
    pausarTemporizador();
    verificarRespuesta();
    avanzarPregunta();
});



document.getElementById('reiniciar-btn').addEventListener('click', reiniciarQuiz);

const firebaseConfig = {
    apiKey: "AIzaSyDGJ1qDEwrKRJSYFOKwAsoBeUYH3vuueIE",
    authDomain: "app-movil-1-35eaa.firebaseapp.com",
    projectId: "app-movil-1-35eaa",
    storageBucket: "app-movil-1-35eaa.firebasestorage.app",
    messagingSenderId: "442408961833",
    appId: "1:442408961833:web:7130faae5fdf4ff086d938"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Referencia a la colección de resultados
const resultadosRef = db.collection('resultados_stop');

// Elementos del DOM
const letterInput = document.getElementById('letter');
const nameInput = document.getElementById('name');
const cityInput = document.getElementById('city');
const animalInput = document.getElementById('animal');
const objectInput = document.getElementById('object');
const foodInput = document.getElementById('food');
const stopButton = document.getElementById('stopButton');
const resultsBody = document.getElementById('resultsBody');

// Evento para guardar resultados
stopButton.addEventListener('click', guardarResultado);

// Función para guardar resultado
function guardarResultado() {
    const letra = letterInput.value.toUpperCase();

    // Validar que todos los campos estén llenos y la letra sea válida
    if (!letra || !nameInput.value || !cityInput.value || 
        !animalInput.value || !objectInput.value || !foodInput.value) {
        alert('Por favor, llena todos los campos');
        return;
    }

    // Objeto con los resultados
    const resultado = {
        letra: letra,
        nombre: nameInput.value,
        ciudad: cityInput.value,
        animal: animalInput.value,
        objeto: objectInput.value,
        comida: foodInput.value,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };

    // Guardar en Firestore
    resultadosRef.add(resultado)
        .then((docRef) => {
            console.log("Documento guardado con ID: ", docRef.id);
            
            // Limpiar inputs
            limpiarInputs();
            
            // Cargar resultados
            cargarResultados();
        })
        .catch((error) => {
            console.error("Error guardando resultado: ", error);
            alert('Hubo un error al guardar los datos');
        });
}

// Función para limpiar inputs
function limpiarInputs() {
    letterInput.value = '';
    nameInput.value = '';
    cityInput.value = '';
    animalInput.value = '';
    objectInput.value = '';
    foodInput.value = '';
}

// Función para cargar resultados desde Firestore
function cargarResultados() {
    resultsBody.innerHTML = ''; // Limpiar tabla

    resultadosRef
        .orderBy('timestamp', 'desc') // Ordenar por timestamp más reciente
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const row = `
                    <tr>
                        <td>${data.letra}</td>
                        <td>${data.nombre}</td>
                        <td>${data.ciudad}</td>
                        <td>${data.animal}</td>
                        <td>${data.objeto}</td>
                        <td>${data.comida}</td>
                    </tr>
                `;
                resultsBody.innerHTML += row;
            });
        })
        .catch((error) => {
            console.error("Error cargando resultados: ", error);
        });
}

// Cargar resultados al inicio
document.addEventListener('DOMContentLoaded', cargarResultados);
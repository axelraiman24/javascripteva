const students = [];

const form = document.getElementById("studentForm");
const nameInput = document.getElementById("name");
const lastNameInput = document.getElementById("lastName");
const gradeInput = document.getElementById("grade");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    nameInput.setCustomValidity("");
    lastNameInput.setCustomValidity("");
    gradeInput.setCustomValidity("");

    
    if (!nameInput.value.trim()) {
        nameInput.setCustomValidity("Por favor, complete el campo Nombre.");
    }

    
    if (!lastNameInput.value.trim()) {
        lastNameInput.setCustomValidity("Por favor, complete el campo Apellido.");
    }

    
    if (!gradeInput.value) {
        gradeInput.setCustomValidity("Por favor, complete el campo Nota.");
    } else {
        const grade = parseFloat(gradeInput.value);
        if (grade < 1 || grade > 7) {
            gradeInput.setCustomValidity("La nota debe estar entre 1.0 y 7.0.");
        }
    }

    
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    

    //guardar datos
    const student = {
        name: nameInput.value.trim(),
        lastName: lastNameInput.value.trim(),
        grade: parseFloat(gradeInput.value),
        date: new Date()  // fecha actual
    };

    students.push(student);
    addStudentToTable(student);
    calcularPromedio();
    mostrarTabla();
    actualizarEstadisticas();
    

    form.reset();
});

const tableBody = document.querySelector("#studentTable tbody");

function addStudentToTable(student) {
    const row = document.createElement("tr");

    // Convertir la fecha a formato legible
    const fecha = new Date(student.date).toLocaleDateString();

    row.innerHTML = `
        <td>${student.name}</td>
        <td>${student.lastName}</td>
        <td>${student.grade.toFixed(1)}</td>
        <td>
            <button class="delete">Eliminar</button>
            <button class="edit">Editar</button>
        </td>
        <td>${fecha}</td> <!-- Agregamos la fecha -->
    `;

    row.querySelector(".edit").addEventListener("click", function() {
        editarEstudiante(student, row);
    });

    row.querySelector(".delete").addEventListener("click", function() {
        deleteEstudiante(student, row);
    });

    tableBody.appendChild(row);
}

const promedioDiv = document.getElementById("average");

function deleteEstudiante(student, row) {
    const index = students.indexOf(student);
    if (index > -1) {
        students.splice(index, 1);
        row.remove();
        calcularPromedio();
        actualizarEstadisticas();  // Actualizar estadísticas después de eliminar
    }
}

function editarEstudiante(student, row) {
    // Obtiene la celda de la nota (3ra celda, índice 2)
    const gradeCell = row.cells[2];

    // Guarda el valor original por si se cancela
    const valorOriginal = student.grade;

    // Crea el input para editar
    const input = document.createElement("input");
    input.type = "number";
    input.min = 1;
    input.max = 7;
    input.step = 0.1;
    input.value = student.grade;
    input.style.width = "60px";

    // Crea el botón guardar
    const saveBtn = document.createElement("button");
    saveBtn.textContent = "Guardar";

    // Limpia la celda y agrega input + botón
    gradeCell.textContent = "";
    gradeCell.appendChild(input);
    gradeCell.appendChild(saveBtn);

    // Al hacer clic en guardar
    saveBtn.addEventListener("click", function () {
        const nuevaNota = parseFloat(input.value);
        if (!isNaN(nuevaNota) && nuevaNota >= 1 && nuevaNota <= 7) {
            student.grade = nuevaNota;
            gradeCell.textContent = nuevaNota.toFixed(1);
            calcularPromedio();
        } else {
            alert("La nota debe estar entre 1.0 y 7.0");
            input.focus();
        }
    });
}

function calcularPromedio() {
    if (students.length === 0) {
        promedioDiv.textContent = "Aún no se han ingresado notas.";
        return;
    }

    const total = students.reduce((sum, student) => sum + student.grade, 0);
    const promedio = total / students.length;

    promedioDiv.textContent = `Promedio de Notas: ${promedio.toFixed(2)}`;
}

function actualizarEstadisticas() {
    const total = students.length;
    const enExamen = students.filter(s => s.grade < 5.0).length;
    const eximidos = students.filter(s => s.grade > 5.0).length;

    document.getElementById("totalEstudiantes").textContent = total;
    document.getElementById("enExamen").textContent = enExamen;
    document.getElementById("eximidos").textContent = eximidos;
}

function mostrarTabla() {
    const table = document.getElementById("studentTable");
    if (students.length > 0) {
        table.classList.remove("hidden");
    }
}

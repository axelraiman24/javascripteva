const students = [];

const form = document.getElementById("studentForm");
const nameInput = document.getElementById("name");
const lastNameInput = document.getElementById("lastName");
const gradeInput = document.getElementById("grade");
const dateInput = document.getElementById("date");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    nameInput.setCustomValidity("");
    lastNameInput.setCustomValidity("");
    gradeInput.setCustomValidity("");
    dateInput.setCustomValidity("");

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
    if (!dateInput.value) {
        dateInput.setCustomValidity("Por favor, seleccione una fecha.");
    }

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const student = {
        name: nameInput.value.trim(),
        lastName: lastNameInput.value.trim(),
        grade: parseFloat(gradeInput.value),
        date: dateInput.value
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

    const fechaFormateada = formatearFecha(student.date);

    row.innerHTML = `
        <td>${student.name}</td>
        <td>${student.lastName}</td>
        <td>${student.grade.toFixed(1)}</td>
        <td>
            <button class="delete">Eliminar</button>
            <button class="edit">Editar</button>
        </td>
        <td>${fechaFormateada}</td>
    `;

    row.querySelector(".edit").addEventListener("click", function () {
        editarEstudiante(student, row);
    });

    row.querySelector(".delete").addEventListener("click", function () {
        deleteEstudiante(student, row);
    });

    tableBody.appendChild(row);
}

// ✅ Corregido: no quita un día porque usa split directamente
function formatearFecha(fecha) {
    const [anio, mes, dia] = fecha.split("-");
    return `${dia}/${mes}/${anio}`;
}

const promedioDiv = document.getElementById("average");

function deleteEstudiante(student, row) {
    const index = students.indexOf(student);
    if (index > -1) {
        students.splice(index, 1);
        row.remove();
        calcularPromedio();
        actualizarEstadisticas();
    }
}

function editarEstudiante(student, row) {
    const nameCell = row.cells[0];
    const lastNameCell = row.cells[1];
    const gradeCell = row.cells[2];
    const actionsCell = row.cells[3];
    const dateCell = row.cells[4];

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.value = student.name;
    nameInput.style.width = "100px";

    const lastNameInput = document.createElement("input");
    lastNameInput.type = "text";
    lastNameInput.value = student.lastName;
    lastNameInput.style.width = "100px";

    const gradeInput = document.createElement("input");
    gradeInput.type = "number";
    gradeInput.min = 1;
    gradeInput.max = 7;
    gradeInput.step = 0.1;
    gradeInput.value = student.grade;
    gradeInput.style.width = "60px";

    const dateInput = document.createElement("input");
    dateInput.type = "date";
    dateInput.value = student.date;
    dateInput.style.width = "130px";

    const saveBtn = document.createElement("button");
    saveBtn.textContent = "Guardar";

    nameCell.textContent = "";
    nameCell.appendChild(nameInput);

    lastNameCell.textContent = "";
    lastNameCell.appendChild(lastNameInput);

    gradeCell.textContent = "";
    gradeCell.appendChild(gradeInput);

    dateCell.textContent = "";
    dateCell.appendChild(dateInput);

    actionsCell.textContent = "";
    actionsCell.appendChild(saveBtn);

    saveBtn.addEventListener("click", function () {
        const nuevaNota = parseFloat(gradeInput.value);
        if (
            !nameInput.value.trim() ||
            !lastNameInput.value.trim() ||
            isNaN(nuevaNota) || nuevaNota < 1 || nuevaNota > 7 ||
            !dateInput.value
        ) {
            alert("Debes completar todos los campos correctamente.");
            return;
        }

        student.name = nameInput.value.trim();
        student.lastName = lastNameInput.value.trim();
        student.grade = nuevaNota;
        student.date = dateInput.value;

        nameCell.textContent = student.name;
        lastNameCell.textContent = student.lastName;
        gradeCell.textContent = student.grade.toFixed(1);
        dateCell.textContent = formatearFecha(student.date);

        actionsCell.innerHTML = `
            <button class="delete">Eliminar</button>
            <button class="edit">Editar</button>
        `;

        actionsCell.querySelector(".delete").addEventListener("click", function () {
            deleteEstudiante(student, row);
        });
        actionsCell.querySelector(".edit").addEventListener("click", function () {
            editarEstudiante(student, row);
        });

        calcularPromedio();
        actualizarEstadisticas();
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
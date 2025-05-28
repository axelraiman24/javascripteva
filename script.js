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
    };

    students.push(student);
    addStudentToTable(student);
    calcularPromedio();
    mostrarTabla();

    form.reset();
});

const tableBody = document.querySelector("#studentTable tbody");

function addStudentToTable(student) {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${student.name}</td>
        <td>${student.lastName}</td>
        <td>${student.grade.toFixed(1)}</td>
        <td> <button class="delete">Eliminar</button</td>
    `;

row.querySelector(".delete").addEventListener("click",function(){
    deleteEstudiante(student,row);
});
    tableBody.appendChild(row);
}

const promedioDiv = document.getElementById("average");

function deleteEstudiante(student,row){
    const index=students.indexOf(student);
    if(index > -1){
        students.splice(index,1);
        row.remove();
        calcularPromedio();
    }}

function calcularPromedio() {
    if (students.length === 0) {
        promedioDiv.textContent = "Aún no se han ingresado notas.";
        return;
    }

    const total = students.reduce((sum, student) => sum + student.grade, 0);
    const promedio = total / students.length;

    promedioDiv.textContent = `Promedio de Notas: ${promedio.toFixed(2)}`;
}

function mostrarTabla() {
    const table = document.getElementById("studentTable");
    if (students.length > 0) {
        table.classList.remove("hidden");
    }
}

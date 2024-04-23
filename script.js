import {
  saveFrase,
  getFrases,
  onGetFrases,
  deleteFrase,
  getThisFrase,
  updateFrase,
} from "./firebase.js";

window.addEventListener("DOMContentLoaded", async () => {
const frasesContainer = document.getElementById("frasesContainer");
const fraseForm = document.getElementById("fraseForm");
const cardTitle = document.getElementById("card-title");
const btnMiFrase = document.getElementById("btn-mi-frase");
const miFraseDiv = document.getElementById("mi-frase-div");

let editStatus = false;
let id = "";

  onGetFrases((querySnapshot) => {
    let html = "";

    querySnapshot.forEach((doc) => {
      const frase = doc.data();
      html += `
      <table class="table table-hover">
        <tbody>
          <tr class="table-light">
            <td>${frase.frase}
            <hr/>
            <button class="btn btn-secondary btn-delete" data-id="${doc.id}"><span>&#128465;</span></button>
            <button class="btn btn-info btn-edit" data-id="${doc.id}"><span>&#9998;</span></button></td>
          </tr>
        </tbody>
        </table> 
        `;
    });
    frasesContainer.innerHTML = html;
    const btnsDelete = frasesContainer.querySelectorAll(".btn-delete");
    btnsDelete.forEach((btn) => {
      btn.addEventListener("click", async(event) => {
        deleteFrase(event.target.dataset.id);
      });
    });

    const btnsEdit = frasesContainer.querySelectorAll(".btn-edit");
    btnsEdit.forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        let frase = await getThisFrase(e.target.dataset.id);
        console.log("id", e.target.dataset.id);
        console.log("frase", frase);
        fraseForm["frase"].value = frase.frase;
        editStatus = true;
        id = e.target.dataset.id;
        fraseForm.classList.add("editing");
        cardTitle.innerText= "Editar Frase";
        fraseForm["fraseSubmit"].innerText = "Actualizar";
      });
    });
  });

  fraseForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const frase = fraseForm["frase"];
  
    if (!editStatus) {
      saveFrase(
        frase.value
      );
    } else {
      console.log("editando");
      updateFrase(id, {
        frase: frase.value,
      });
      editStatus = false;
      fraseForm.classList.remove("editing");
      cardTitle.innerText= "Añadir Frase";
      fraseForm["fraseSubmit"].innerText = "Guardar";
    }
  
    fraseForm.reset();
  });
  
  btnMiFrase.addEventListener("click", async (e) => {
    // Obtener todas las frases desde la base de datos
    const frasesSnapshot = await getFrases();
  
    // Verificar si hay al menos una frase
    if (!frasesSnapshot.empty) {
      // Obtener frases como un array
      const frasesArray = frasesSnapshot.docs.map((doc) => doc.data().frase);
  
      // Elegir una frase al azar del array
      const fraseAleatoria = frasesArray[Math.floor(Math.random() * frasesArray.length)];
  
      // Mostrar la frase en el miFraseDiv
      miFraseDiv.innerText = fraseAleatoria;
    } else {
      // Manejar el caso en que no haya frases en la base de datos
      miFraseDiv.innerText = "No hay frases disponibles";
    }
  });
});



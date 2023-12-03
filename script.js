import {
  saveFrase,
  getFrases,
  onGetFrases,
  deleteFrase,
  getThisFrase,
  updateFrase,
} from "./firebase.js";

const frasesContainer = document.getElementById("frasesContainer");
const fraseForm = document.getElementById("fraseForm");
const cardTitle = document.getElementById("card-title");
const cardBody = document.querySelector(".card-body");

let editStatus = false;
let id = "";

window.addEventListener("DOMContentLoaded", async () => {
  onGetFrases((querySnapshot) => {
    let html = "";

    querySnapshot.forEach((doc) => {
      const frase = doc.data();
      html += `
      <table class="table table-hover">
        <thead>
          <tr>
            <th scope="col">Frase</th>
            <th scope="col"></th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <tr class="table-light">
            <td>${frase.frase}</td>
            <td><button class="btn btn-secondary btn-delete" data-id="${doc.id}">Borrar</button></td>
            <td><button class="btn btn-info btn-edit" data-id="${doc.id}">Editar</button></td>
          </tr>
        </tbody>
        </table> 
        `;
    });
    frasesContainer.innerHTML = html;
    const btnsDelete = frasesContainer.querySelectorAll(".btn-delete");
    btnsDelete.forEach((btn) => {
      btn.addEventListener("click", (event) => {
        deleteFrase(event.target.dataset.id);
      });
    });

    const btnsEdit = frasesContainer.querySelectorAll(".btn-edit");
    btnsEdit.forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const frase = await getThisFrase(e.target.dataset.id);
        console.log(e.target.dataset.id);
        console.log(frase);
        fraseForm["frase"].value = frase.frase;
        editStatus = true;
        id = e.target.dataset.id;
        fraseForm.classList.add("editing");
        cardTitle.innerText= "Editar Frase";
        fraseForm["fraseSubmit"].innerText = "Actualizar";
      });
    });
  });
});

fraseForm.addEventListener("submit", (e) => {
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

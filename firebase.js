
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
  import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    getDoc,
    deleteDoc,
    updateDoc,
    onSnapshot,
    doc,
  } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyAxNxXtK6GfSE3B7iiEPwRpKU5IOGQgIkQ",
    authDomain: "frases-8e678.firebaseapp.com",
    projectId: "frases-8e678",
    storageBucket: "frases-8e678.appspot.com",
    messagingSenderId: "72991596903",
    appId: "1:72991596903:web:6e5f53dba0a335b5eccfc2"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore();

export const saveFrase = (frase) => {
  addDoc(collection(db, "frases"), { frase});
};


export const getFrases = async () => {
    const querySnapshot = await getDocs(collection(db, 'frases'));
    return querySnapshot;
};

export const onGetFrases = (callback) => {
    onSnapshot(collection(db, 'frases'), callback);
};

export const deleteFrase = id => {
    deleteDoc(doc(db, 'frases', id));
}

export const getThisFrase = async (id) => {
  console.log("getThisFrase recibió el ID:", id);

  if (id && typeof id === 'string') {
    try {
      const docRef = doc(db, 'frases', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // El documento existe, puedes acceder a los datos con docSnap.data()
        return docSnap.data();
      } else {
        throw new Error('No existe el documento.');
      }
    } catch (error) {
      console.error(`Error al obtener la frase: ${error.message}`);
      throw error; // Propaga el error para que el código que llama pueda manejarlo
    }
  } else {
    throw new Error('ID no válido al intentar obtener la frase.');
  }
};


export const updateFrase = (id, newFields) => {
  console.log(id);
  updateDoc(doc(db, 'frases', id), newFields);

};
/* eslint-disable max-len */
import { onAuthStateChanged, signOut } from '../firebase/functions.js';
import {
  addUserInFirestore, updateDocDatainFirestore, getUser, getUserWithOnSnapshot,
  getPostsWithOnSnapshot,
} from '../firebase/firestore.js';
import { imagesProfileRef, putImageFile, getPhotoURL } from '../firebase/storage.js';
import { mobileFooter } from './footer.js';

const userState = () => {
  onAuthStateChanged((user) => {
    if ((user === null || user === undefined)) window.location.hash = '#/login';
  });
};

const logOut = (container) => {
  container.querySelector('#close').addEventListener('click', () => {
    signOut();
    window.location.hash = '#/login';
    window.localStorage.removeItem('user');
  });
};

const initialAddUserInFirestore = () => {
// se coloca el uid como docRef para crear cada documento en users
  onAuthStateChanged(({ uid, displayName, email }) => {
    getUser(uid)
      .then((doc) => {
        if (!doc.exists) { // si el doc no existe se crea uno
          addUserInFirestore(uid, {
            uid, name: displayName, email, photoURL: '', coverPhotoURL: '',
          })
            .then(() => {
              console.log('Document successfully written!');
            })
            .catch((error) => {
              console.error('Error writing document: ', error);
            });
        } else { // si el documento existe se muestra la data
          // console.log('Document data:', doc.data());
        }
      });
  });
};

const putImageInFirebaseStorage = (photoFile) => {
  const user = JSON.parse(window.localStorage.getItem('user'));
  putImageFile(photoFile)
    .then(() => getPhotoURL(imagesProfileRef(photoFile.name).fullPath))
    .then((imageURL) => updateDocDatainFirestore(user.uid, { photoURL: imageURL }))
    .then(() => console.log('imagen cargada ok'))
    .catch((err) => console.log(err));
};

const putImageInFirebaseStorageTwo = (photoFile) => {
  const user = JSON.parse(window.localStorage.getItem('user'));
  putImageFile(photoFile)
    .then(() => getPhotoURL(imagesProfileRef(photoFile.name).fullPath))
    .then((imageURL) => updateDocDatainFirestore(user.uid, { coverPhotoURL: imageURL }))
    .then(() => console.log('imagen cargada ok'))
    .catch((err) => console.log(err));
};

const updateDataUser = (nameI, photoFileI, coverPhotoI, petNameI, descriptionI, breedI, locationI, updateProfile) => {
  const user = JSON.parse(window.localStorage.getItem('user'));
  updateProfile.addEventListener('click', (e) => {
    e.preventDefault();
    // sólo si existe una nueva imagen en el formulario
    if (photoFileI.files[0]) putImageInFirebaseStorage(photoFileI.files[0]);
    if (coverPhotoI.files[0]) putImageInFirebaseStorageTwo(coverPhotoI.files[0]);
    onAuthStateChanged((currentUser) => { // se actualiza el nombre de usuario en la autenticación
      currentUser.updateProfile({ displayName: nameI.value });
    });
    const docData = {
      name: nameI.value,
      petName: petNameI.value,
      breed: breedI.value,
      profileDescription: descriptionI.value,
      location: locationI.value,
    };
    updateDocDatainFirestore(user.uid, docData) // se actualiza los datos doc, colección users
      .then(() => console.log('data actualizada en users!!!'))
      .catch((error) => console.error('Error updating document: ', error));
  });
};

const userDocDataInRealTime = (callback) => {
  const user = JSON.parse(localStorage.getItem('user'));
  getUserWithOnSnapshot(user.uid, (doc) => {
    const source = doc.metadata.hasPendingWrites ? 'Local' : 'Server';
    console.log(source);
    localStorage.setItem('user', JSON.stringify({ ...user, ...doc.data() }));
    callback(doc.data());
  });
};

export const editProfile = () => {
  const fragment = document.createDocumentFragment();
  const section = document.createElement('section');
  section.classList.add('editProfile');
  userDocDataInRealTime((docData) => {
    section.innerHTML = `
    <form id="profileForm">
      <section class="headerForm">
        <img id="headerPhoto" src="${docData.coverPhotoURL}">
        <img id="headerPhoto" src="${docData.photoURL}">
        <label class="titleForm">
          <span>${docData.name}</span>
        </label>
      </section>
      <label class="profileLabel"> Correo electrónico
        <span>${docData.email}</span>
      </label>
      <label class="profileLabel"> Nombre de usuario
        <input class="inputs" id="profileUserName" value="${docData.name}"/>
      </label>
      <section class="petData">
        <label class="profileLabel"> Editar foto de perfil
          <input class="inputs" id="photoFile" type="file" name="photo"/>
        </label>
        <label class="profileLabel"> Editar foto de portada
          <input class="inputs" id="coverPhoto" type="file" name="photo"/>
        </label>
        <h2>Información de tu mascota</h2>
        <label class="profileLabel"> Nombre de mascota
          <input class="inputs" id="petName" value="${docData.petName}"/>
        </label>
        <label class="profileLabel"> Presentación de Mascota
          <textarea class="inputs" id="description" name="Presentación de Mascota" rows="4" cols="50" maxlength="350">${docData.profileDescription}</textarea>
        </label>
        <label class="profileLabel"> Raza
          <input class="inputs" id="breed" value="${docData.breed}"/>
        </label>
        <label class="profileLabel"> Ubicación
          <input class="inputs" id="location" value="${docData.location}">
        </label>
      </section>
      <button id="updateProfile">Actualizar Perfil</button>
    </form>`;
    section.appendChild(mobileFooter());
    const [nameI, photoFileI, coverPhotoI, petNameI, descriptionI, breedI, locationI] = section.querySelectorAll('.inputs');
    const updateProfile = section.querySelector('#updateProfile');
    updateDataUser(nameI, photoFileI, coverPhotoI, petNameI, descriptionI, breedI, locationI, updateProfile);
  });
  fragment.appendChild(section);
  return fragment;
};

const postsDocDataInRealTime = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const posts = document.createElement('section');
  getPostsWithOnSnapshot(user.uid, (querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const docData = doc.data();
      console.log(docData);
      posts.innerHTML += `
        <section class="postHeader">
          <img class="photoProfile" src="${docData.photo}"/>
          <div class="postAuthor">
            <h3>${docData.name}</h3>
            <h6>${docData.namePet}</h6>
            <h6>${docData.ubication}</h6>
          </div>
          <i class="ai-more-horizontal-fill"></i>
        </section>
        <section class="postContent">
          <p class="postDescription">${docData.post}</p>
        </section>
        <section class="postFooter">
          <div class="postInline">
            <i class="ai-heart"></i>
            <p class="postCount">0</p>
          </div>
          <div class="postInline">
            <i class="ai-chat-bubble"></i>
            <p class="postCount">0</p>
            </div>
          <div class="postInline">
            <i class="ai-telegram-fill"></i>
            <p class="postCount">0</p>
          </div>
        </section>
        `;
    });
  });
  return posts;
};

export const profile = () => {
  userState();
  initialAddUserInFirestore();
  const fragment = document.createDocumentFragment();
  const section = document.createElement('section');
  section.classList.add('profile');
  userDocDataInRealTime((docData) => {
    section.innerHTML = `
        <section class="headerProfile">
        <img id="mainImgProfile" class="mainImgProfile" src=${docData.coverPhotoURL}>
        <a id="toEditProfile" href="#/editprofile"><img class="icon pen" src="./assets/img/pen.svg" alt="pen icon"/></i></a>
        <a><img id="close" class="icon signOut" src="./assets/img/signout.svg" alt="signout icon"/></i></a>
        <div><img id="circleImgProfile" class="circleImgProfile" src="${docData.photoURL}"></div>
        </section>
        <section class="profileDscription">
            <h1 id="petName">${docData.petName}</h1>
            <label>
                <span id="numberFollowers" class="profileNumbers"></span><span class="textProfile">Seguidores</span>
                <span id="numberFollowing" class="profileNumbers"></span><span class="textProfile">Siguiendo</span>
            </label>
            <p id="profileDescription" class="textProfile">${docData.profileDescription}</p>
            <span class="textProfile">Sigue mis aventuras en este perfil</span>
            <span id="profileUbication" class="textProfile">${docData.location}</span>
        </section>
        <section id="mainProfile" class="mainProfile">
        </section>`;
    logOut(section);
    section.appendChild(mobileFooter());
    section.querySelector('#mainProfile').appendChild(postsDocDataInRealTime());
  });
  fragment.appendChild(section);
  return fragment;
};

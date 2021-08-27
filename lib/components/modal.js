const closeModal = (element) => {
  const section = element;
  const closeButton = section.querySelector('.close');
  closeButton.addEventListener('click', () => {
    section.style.display = 'none';
  });
  window.addEventListener('click', (e) => {
    if (e.target === section) {
      section.style.display = 'none';
    }
  });
};

export const succesfulSignUpModal = (email) => {
  const section = document.createElement('section');
  section.classList.add('modal');
  section.innerHTML = `
  <section class="modal-content">
    <header class="modal-header">
        <span class="close">&times;</span>
        <h2>¡Ya casi está listo!</h2>
    </header>
    <main class="modal-body">
        <p>Hemos enviado un correo a: <span class="modalEmail"><b>${email}</b></span></p></br>
        <p>Por favor verifique su correo haciendo click en el enlace dentro del mensaje.</p>
    </main>
    <footer class="modal-footer">
        <span>¿No recibió el correo?</span>
        <span class="modal-redirect" id="resendEmail"><b>Reenviar correo</b></span>
    </footer>
  </section>
  `;
  closeModal(section);
  return section;
};

export const emailAlreadyExistsModal = (email) => {
  const section = document.createElement('section');
  section.classList.add('modal');
  section.innerHTML = `
    <section class="modal-content">
      <header class="modal-header">
          <span class="close">&times;</span>
          <h2>¡Esta Cuenta ya existe!</h2>
      </header>
      <main class="modal-body">
          <p>El correo: <span class="modalEmail"><b>${email}</b></span> ya tiene una cuenta afiliada</p></br>
          <p>Por favor ingrese otro correo.</p>
      </main>
      <footer class="modal-footer">
        <span>¿Ya tienes una cuenta?</span>
        <span class="modal-redirect" id="loginRedirectModal"><b>Inicia sesión</b></span>
      </footer>
    </section>
    `;
  closeModal(section);
  return section;
};

export const userNotRegisterModal = (email) => {
  const section = document.createElement('section');
  section.classList.add('modal');
  section.innerHTML = `
      <section class="modal-content">
        <header class="modal-header">
            <span class="close">&times;</span>
            <h2>¡UPS!</h2>
        </header>
        <main class="modal-body">
            <p>No existe una cuenta registrada con el correo: <span class="modalEmail"><b>${email}</b></span></p></br>
            <p>Intentelo de nuevo.</p>
        </main>
        <footer class="modal-footer">
            <span>¿No tienes una cuenta?</span>
            <span class="modal-redirect" id="signUpRedirectModal"><b>Crear una cuenta</b></span>
        </footer>
      </section>`;
  closeModal(section);
  return section;
};

export const wrongPasswordModal = () => {
  const section = document.createElement('section');
  section.classList.add('modal');
  section.innerHTML = `
      <section class="modal-content">
        <header class="modal-header">
            <span class="close">&times;</span>
            <h2>¡UPS!</h2>
        </header>
        <main class="modal-body">
            <p>La contraseña es inválida.</br>
            <p>Intentelo de nuevo.</p>
        </main>
        <footer class="modal-footer">
        </footer>
      </section>`;
  closeModal(section);
  return section;
};

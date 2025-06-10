// cypress/e2e/profileSkillsCerts.cy.js
// -------------------------------------------------------------
// End‑to‑end tests for editing user skills & certifications.
// Replace CSS selectors / routes with those of your real app.
// Credentials are read from CYPRESS environment variables so
// they never live inside the repo.
// -------------------------------------------------------------

/**
 * Cypress env required:
 *  - CYPRESS_USER_EMAIL
 *  - CYPRESS_USER_PASSWORD
 */

const loginViaApi = () => {
  cy.request({
    method: 'POST',
    url: '/api/auth/login',
    body: {
      email:   Cypress.env('USER_EMAIL'),
      password: Cypress.env('USER_PASSWORD')
    }
  }).then(({ body }) => {
    // ‑‑ store JWT / session in localStorage
    window.localStorage.setItem('token', body.token);
  });
};

/**
 * Helper: assert toast contains text and disappears
 */
const assertToast = (msg) => {
  cy.contains('.toast', msg).should('be.visible');
  cy.wait(1500); // toast fade‑out time
  cy.contains('.toast', msg).should('not.exist');
};

beforeEach(() => {
  loginViaApi();
});

// -------------------------------------------------------------
// 1️⃣  Modificar habilidades
// -------------------------------------------------------------

describe('Edición de habilidades', () => {
  it('Un usuario agrega y elimina skills', () => {
    // Navega a la página de habilidades
    cy.visit('/profile/skills');

    // Modo edición
    cy.get('[data‑cy=edit‑skills]').click();

    // 🔸 Elimina la primera habilidad si existe
    cy.get('[data‑cy=skill‑pill]').first().within(() => {
      cy.get('[data‑cy=remove‑skill]').click();
    });

    // 🔸 Agrega una nueva habilidad desde dropdown
    cy.get('[data‑cy=add‑skill]').click();
    cy.get('[data‑cy=skill‑dropdown]').type('Docker{enter}');

    // Guarda
    cy.get('[data‑cy=save‑skills]').click();

    // Aserción: toast de éxito y la skill aparece en la lista
    assertToast('Habilidades actualizadas');
    cy.contains('[data‑cy=skill‑pill]', 'Docker').should('exist');
  });
});

// -------------------------------------------------------------
// 2️⃣  Modificar certificaciones
// -------------------------------------------------------------

describe('Edición de certificaciones', () => {
  it('Un usuario agrega y elimina certificados', () => {
    cy.visit('/profile/certifications');

    // Modo edición
    cy.get('[data‑cy=edit‑certs]').click();

    // 🔸 Agregar un certificado
    cy.get('[data‑cy=add‑cert]').click();
    cy.get('[data‑cy=cert‑name]').type('AWS Solutions Architect');
    cy.get('[data‑cy=cert‑issuer]').type('Amazon');
    cy.get('[data‑cy=cert‑save]').click();

    // 🔸 Eliminar el primero existente
    cy.get('[data‑cy=cert‑row]').first().within(() => {
      cy.get('[data‑cy=remove‑cert]').click();
    });

    // Guardar cambios
    cy.get('[data‑cy=save‑certs]').click();

    // Aserciones
    assertToast('Certificaciones actualizadas');
    cy.contains('[data‑cy=cert‑row]', 'AWS Solutions Architect').should('exist');
  });
});

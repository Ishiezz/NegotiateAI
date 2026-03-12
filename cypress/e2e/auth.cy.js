// cypress/e2e/auth.cy.js
// E2E Test: Simulates real user going through auth flows in the browser

describe('Authentication Flow', () => {
  const testUser = {
    name: 'Test Buyer',
    email: `buyer_${Date.now()}@test.com`,
    password: 'testpass123',
    role: 'buyer',
    company: 'Test Factory',
  };

  describe('Registration', () => {
    it('should register a new buyer and redirect to products', () => {
      cy.visit('/register');

      // Select buyer role
      cy.contains('I want to Buy').click();

      // Fill registration form
      cy.get('#name').type(testUser.name);
      cy.get('#email').type(testUser.email);
      cy.get('#password').type(testUser.password);
      cy.get('#company').type(testUser.company);

      // Submit
      cy.get('button[type="submit"]').click();

      // Should redirect to products page
      cy.url().should('include', '/products');
      cy.contains('Marketplace').should('be.visible');
    });

    it('should show error for duplicate email', () => {
      cy.visit('/register');
      cy.get('#name').type('Another User');
      cy.get('#email').type(testUser.email); // same email
      cy.get('#password').type('anypassword');
      cy.get('button[type="submit"]').click();

      cy.contains(/already registered/i).should('be.visible');
    });

    it('should show validation error for short password', () => {
      cy.visit('/register');
      cy.get('#name').type('Test User');
      cy.get('#email').type('newuser@test.com');
      cy.get('#password').type('123'); // too short
      cy.get('button[type="submit"]').click();

      // Either frontend or backend validation should catch this
      cy.contains(/password/i).should('be.visible');
    });
  });

  describe('Login', () => {
    it('should login with valid credentials', () => {
      cy.visit('/login');
      cy.get('#email').type(testUser.email);
      cy.get('#password').type(testUser.password);
      cy.get('button[type="submit"]').click();

      // Buyer goes to products page
      cy.url().should('include', '/products');
    });

    it('should show error for wrong password', () => {
      cy.visit('/login');
      cy.get('#email').type(testUser.email);
      cy.get('#password').type('wrongpassword');
      cy.get('button[type="submit"]').click();

      cy.contains(/invalid/i).should('be.visible');
    });

    it('should show error for non-existent user', () => {
      cy.visit('/login');
      cy.get('#email').type('nobody@nowhere.com');
      cy.get('#password').type('anypassword');
      cy.get('button[type="submit"]').click();

      cy.contains(/invalid/i).should('be.visible');
    });
  });

  describe('Protected Routes', () => {
    it('should redirect unauthenticated user from orders page', () => {
      cy.visit('/orders');
      cy.url().should('include', '/login');
    });

    it('should show navbar with logout after login', () => {
      cy.visit('/login');
      cy.get('#email').type(testUser.email);
      cy.get('#password').type(testUser.password);
      cy.get('button[type="submit"]').click();

      cy.contains('Logout').should('be.visible');
    });

    it('should logout and clear session', () => {
      // Login first
      cy.visit('/login');
      cy.get('#email').type(testUser.email);
      cy.get('#password').type(testUser.password);
      cy.get('button[type="submit"]').click();

      // Logout
      cy.contains('Logout').click();
      cy.url().should('include', '/login');

      // Token should be gone
      cy.window().then((win) => {
        expect(win.localStorage.getItem('token')).to.be.null;
      });
    });
  });
});
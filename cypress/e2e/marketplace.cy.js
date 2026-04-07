// cypress/e2e/marketplace.cy.js
// E2E: Full buyer journey — Browse → View Product → Place Order

describe('Marketplace Flow', () => {
  before(() => {
    // Register and login as buyer before tests
    cy.request('POST', '/api/auth/register', {
      name: 'E2E Buyer',
      email: `e2e_buyer_${Date.now()}@test.com`,
      password: 'e2etest123',
      role: 'buyer',
      company: 'E2E Factory',
    }).then((res) => {
      window.localStorage.setItem('token', res.body.token);
      window.localStorage.setItem('user', JSON.stringify(res.body.user));
    });
  });

  describe('Products Listing', () => {
    it('should load the marketplace page', () => {
      cy.visit('/products');
      cy.contains('Raw Material Marketplace').should('be.visible');
    });

    it('should filter products by category', () => {
      cy.visit('/products');
      cy.contains('Metals').click();
      cy.url().should('include', 'category=metals');
    });

    it('should search products by name', () => {
      cy.visit('/products');
      cy.get('input[placeholder*="Search"]').type('steel');
      cy.get('button[type="submit"]').click();
      // Results should appear or empty state
      cy.get('.rm-products-grid, .rm-empty-state').should('exist');
    });
  });

  describe('RFQ Flow', () => {
    it('buyer can post a new RFQ', () => {
      cy.visit('/rfq');
      cy.contains('Post RFQ').click();

      cy.get('#title').type('Need 10 tonnes of copper wire');
      cy.get('#category').select('metals');
      cy.get('#description').type('Looking for high purity copper wire for electrical wiring');
      cy.get('#quantity').type('10000');
      cy.get('#unit').select('kg');
      cy.get('#deliveryDate').type('2026-06-01');

      cy.get('button[type="submit"]').click();
      cy.contains(/RFQ posted/i).should('be.visible');
    });
  });
});
/// <reference types="cypress" />

describe('Navigation', () => {
    it('should navigate to the Home and Cart pages', () => {
      cy.visit('/');
      cy.get('[data-test-id="navigation"]').should('be.visible');
      cy.get('[data-test-id="hamburger-menu"]').click();
      cy.get('[data-test-id="navigation-page"]').should('be.visible');
      cy.get('[data-test-id="home-link"]').click();
      cy.url().should('include', '/');
      cy.get('[data-test-id="cart-icon"]').click();
      cy.url().should('include', '/cart');
    });
  });
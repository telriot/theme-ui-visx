describe('Rendering and navigation', () => {
  it('should navigate between pages without crashing', () => {
    cy.visit('http://localhost:3000');
    cy.findAllByText(/hello/i).should('exist');
    cy.findAllByText(/charts/i).click();
    cy.findAllByText(/chart testing/i).should('exist');
    cy.findAllByText(/modal drilldown/i).click();
    cy.findAllByText(/flight status/i).should('exist');
  });
  it('should toggle between themes', () => {
    cy.visit('http://localhost:3000');
    cy.findAllByText(/dark/i).should('exist');
    cy.findAllByText(/dark/i).click();
    cy.findAllByText(/dark/i).should('not-exist');
    cy.findAllByText(/light/i).should('exist');
    cy.findAllByText(/light/i).click();
    cy.findAllByText(/light/i).should('not-exist');
  });
});

describe('Rendering and navigation', () => {
  it('should navigate between pages without crashing', () => {
    cy.visit('http://localhost:3000');
    cy.findAllByText(/hello/i).should('exist');
    cy.findAllByText(/charts/i).click();
    cy.findAllByText(/chart testing/i).should('exist');
    cy.findAllByText(/modal drilldown/i).click();
    cy.findAllByText(/flight status/i).should('exist');
  });
});

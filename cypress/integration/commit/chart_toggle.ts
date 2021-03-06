describe("Waterfall Chart Toggle", () => {
  const COMMITS_ROUTE = "/commits/evergreen";
  before(() => {
    cy.login();
    cy.visit(COMMITS_ROUTE);
  });

  beforeEach(() => {
    cy.preserveCookies();
  });

  it("Should default to absolute chart type when chartType is not indicated in URL query param", () => {
    cy.dataCy("cy-chart-absolute-radio").should("be.checked");
  });

  it("Should update chartType query param to percentage after checking percentage radio button", () => {
    cy.dataCy("cy-chart-percent-radio").click({ force: true });
    cy.location().should((loc) => {
      expect(loc.pathname).to.equal(COMMITS_ROUTE);
      expect(loc.search).to.include("chartType=percentage");
    });
  });

  it("Should update chartType query param to absolute after checking absolute radio button", () => {
    cy.dataCy("cy-chart-absolute-radio").click({ force: true });
    cy.location().should((loc) => {
      expect(loc.pathname).to.equal(COMMITS_ROUTE);
      expect(loc.search).to.include("chartType=absolute");
    });
  });

  it("Should intially load with absolute chart radio checked when chartType query param is absolute", () => {
    cy.visit(`${COMMITS_ROUTE}?chartType=absolute`);
    cy.dataCy("cy-chart-absolute-radio").should("be.checked");
  });
  it("Should intially load with percentage chart radio checked when chartType query param is percentage", () => {
    cy.visit(`${COMMITS_ROUTE}?chartType=percentage`);
    cy.dataCy("cy-chart-percent-radio").should("be.checked");
  });

  it("Should initially load with absolute chart radio checked as default when chartType query param is not a valid chart type", () => {
    cy.visit(`${COMMITS_ROUTE}?chartType=soeiantsrein`);
    cy.dataCy("cy-chart-absolute-radio").should("be.checked");
  });
});

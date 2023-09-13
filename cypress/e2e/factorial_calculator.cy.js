/*Write a script or a program that will verify the correctness of the calculator for integer
numbers in range (10, 100). You can do it in the language and framework of your choice.
*/

/// <reference types="cypress" />

const factorialCache = {};

//used for calculating expected result
function factorial(n) {
  if (n < 0) {
    return null; // Factorial is not defined for negative numbers
  }

  if (n === 0 || n === 1) {
    return 1; // Base case: 0! and 1! are both 1
  }

  if (factorialCache[n]) {
    return factorialCache[n]; // Return cached result if available
  }

  let result = 1;

  for (let i = 2; i <= n; i++) {
    result *= i;
  }

  factorialCache[n] = result; // Cache the result
  return result;
}


describe('Factorial calculator', () => {
  //array 10-100
  const Input_integers = Array.from({ length: 91 }, (_, i) => i + 10);

  it('Goes and does 10-100 factorial', () => {
    
    cy.visit('https://qainterview.pythonanywhere.com/', {
      onBeforeLoad(win) {
        cy.spy(win.console, 'log').as('consoleLog')
      }
    })
    
    
    for (const item of Input_integers) { //iterates over array
      
      cy.intercept('https://qainterview.pythonanywhere.com/factorial').as('reply') //intercepts API requests 
      cy.get('#number').clear().type(item) //Get's input field and types integer from array
      cy.get('#getFactorial').click() //Runs the calculation
      cy.wait('@reply').its('response.statusCode').should('eq', 200) //Verifies that API returned OK response

      cy.get('@consoleLog').should('be.calledWith', String(item)) //looks for calls on calculator console
      cy.get('@consoleLog').should('be.calledWith', "Hello! I am in the done part of the ajax call")  //Verifies that calculations are made

      var invalid_calculations = []
      cy.get('@consoleLog').should(spy => {
        const calls = spy["getCalls"](); 
        const { args: [{answer: serverResult}] } = calls[calls.length - 1];
     
        const expected = factorial(item)
        if (serverResult !== expected) {
         
          invalid_calculations.push("\t❌ factorial result for %s is wrong, expected %s, got local %s,  \n", item, expected, serverResult)
          console.warn("\t❌ factorial result for %s is wrong, expected %s, got local %s,  \n", item, expected, serverResult)
          
          //write this to file
        }
        spy.resetHistory()
        
   
      });

      console.log(invalid_calculations)
    }
    cy.writeFile('invalid_calculations_list.txt', invalid_calculations)
    cy.wrap(invalid_calculations).should('be.empty')
  })
})

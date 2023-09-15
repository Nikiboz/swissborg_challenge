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


 for (const item of Input_integers) {                                                 //moving this FOR will drasticly increase the performace
  it(`Verifies factorial calculation for ${item}`, () => {
    let server_result
    const expected = factorial(item)
    
    cy.visit('https://qainterview.pythonanywhere.com/')
    
    cy.intercept('https://qainterview.pythonanywhere.com/factorial').as('reply') //intercepts API requests 
    cy.get('#number').clear().type(item) //Get's input field and types integer from array
    cy.get('#getFactorial').click() //Runs the calculation
     
    cy.wait('@reply');
     
    cy.get('@reply').then((response) => {  
    server_result = response.response.body.answer;
    if (server_result !== expected) {
    cy.writeFile('invalid_calculations_list.txt', `❌ factorial result for ${item} is wrong, expected ${expected}, got ${server_result} from app`, { flag: 'a' }) 
    }
    expect(response.response.body.answer).to.be.eq(expected)
  });
   
  })
  }
})

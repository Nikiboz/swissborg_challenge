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

describe("Factorial calculator", () => {
  //array 10-100
  const Input_integers = Array.from({ length: 91 }, (_, i) => i + 10);

  for (const number of Input_integers) {
    //moving this FOR will drasticly increase the performace
    it(`Calculating factorial for ${number}`, () => {
      let server_result;
      cy.visit("https://qainterview.pythonanywhere.com/", {
        onBeforeLoad(win) {
          cy.spy(win.console, "log").as("consoleLog");
        },
      });

      //iterates over array

      cy.intercept("https://qainterview.pythonanywhere.com/factorial").as(
        "reply"
      ); //intercepts API requests
      cy.get("#number").clear().type(item); //Get's input field and types integer from array
      cy.get("#getFactorial").click(); //Runs the calculation

      cy.wait("@reply");

      cy.get("@reply").should((response) => {
        console.log(response.body); // Log the response body

        expect(response.response.body).to.have.property("answer");
        server_result = response.response.body.answer;
        // Now you can use server_result as needed
      });

      var invalid_calculations = [];
      const expected = factorial(number);
      if (server_result !== expected) {
        invalid_calculations.push(
          `❌ factorial result for ${number} is wrong, expected ${expected}, got ${server_result} from network`
        );
        cy.log(
          `❌ factorial result for ${number} is wrong, expected ${expected}, got ${server_result}.`
        );
      }
    });

    cy.writeFile("invalid_calculations_list.txt", invalid_calculations, {
      flag: "a+",
    });
    cy.wrap(invalid_calculations).should("be.empty");
  }
});

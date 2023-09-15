
# Swissborg Challenge

The calculation script is located at `/swissborg_challange/cypress/e2e`.

## Execution Instructions
0. **Clone repo and navigate to folder**
1. **Install Cypress**:
   ```bash
   npm install cypress
2. **For a headless run**:
	```bash
	npx cypress run --headless -b chrome
2.1 **For interactive run**:  

1.	npx cypress open    
2.	In cypress dialogue select E2E     
3.	Select `factorial_calculator` spec      
##
Invalid Calculations will be written to invalid_calculations_list.txt or can be seen in DevTools when running script using UI or in Cypress results.
##
You can find results for manual exercises in files Exercise_1_Bugs_and_testcases.txt and Excercise2_Acceptance_Criteria.txt
Bugs for the calculator are listed at the end of the Exercise_1 file.


		

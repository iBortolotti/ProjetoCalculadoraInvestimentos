import { generateReturnsArray } from "./src/investmentGoals";
const calculateButton = document.getElementById("calculate-results");

function renderProgressions() {
  const startingAmount = (document.getElementById("starting-amount").value);
  const additionalContribution = document.getElementById(
    "additional-contribution"
  ).value;
  const timeAmount = Number(document.getElementById("time-amount").value);
  const timeAmountPeriod = document.getElementById("time-amount-period").value;
  const returnRate = Number(document.getElementById("return-rate").value);
  const returnRatePeriod = document.getElementById("evaluation-period").value;
  const taxRate = Number(document.getElementById("tax-rate").value);

  const returnsArray = generateReturnsArray(
    startingAmount,
    additionalContribution,
    timeAmount,
    timeAmountPeriod,
    returnRate,
    returnRatePeriod,
    taxRate
  );

  console.log(returnsArray);
}
calculateButton.addEventListener('click', renderProgressions);

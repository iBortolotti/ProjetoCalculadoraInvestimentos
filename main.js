import { generateReturnsArray } from "./src/investmentGoals";
import { Chart } from "chart.js/auto";


const form = document.getElementById("investment-form");
const clearFormButton = document.getElementById("clear-form");
const finalMoneyChart = document.getElementById("final-money-distribution");
const progressionChart = document.getElementById("progression");

function formatCurrency(value) {
  return value.toFixed(2)
}

function renderProgression(evt) {
  evt.preventDefault();
  if (document.querySelector(".error")) {
    return;
  }
  //const startingAmount = Number(form['stating-amout'].value); - Forma alternativa e acessar os valores dos campos.
  const startingAmount = Number(
    document.getElementById("starting-amount").value.replace(",", ".")
  );
  const additionalContribution = Number(
    document.getElementById("additional-contribution").value.replace(",", ".")
  );
  const timeAmount = Number(document.getElementById("time-amount").value);
  const timeAmountPeriod = document.getElementById("time-amount-period").value;
  const returnRate = Number(
    document.getElementById("return-rate").value.replace(",", ".")
  );
  const returnRatePeriod = document.getElementById("evaluation-period").value;
  const taxRate = Number(
    document.getElementById("tax-rate").value.replace(",", ".")
  );

  const returnsArray = generateReturnsArray(
    startingAmount,
    timeAmount,
    timeAmountPeriod,
    additionalContribution,
    returnRate,
    returnRatePeriod
  )

  const finalInvestmentObject = returnsArray[returnsArray.length - 1]
  
  new Chart(finalMoneyChart, {
    type: "doughnut",
    data: {
      labels: ["Total Investido", "Rendimento", "Imposto"],
      datasets: [
        {
          data: [
            formatCurrency(finalInvestmentObject.investedAmount),
            formatCurrency(finalInvestmentObject.totalInterestReturns * (1 - taxRate / 100)),
            formatCurrency(finalInvestmentObject.totalInterestReturns * (taxRate / 100)),
          ],
          backgroundColor: [
            "rgb(255, 99, 132)",
            "rgb(54, 162, 235)",
            "rgb(255, 205, 86)"
          ],
          hoverOffset: 4,
        },
      ],
    },
  });

  new Chart(progressionChart, {
    type: 'bar',
    data: {
      labels: returnsArray.map((investmentObject) => investmentObject.month),
      datasets: [
        {
          label: 'Total Investido',
          data: returnsArray.map((investmentObject) => formatCurrency(investmentObject.investedAmount)),
          backgroundColor: 'rgb(255, 99, 132)',
        },
        {
          label: 'Total Acumulado',
          data: returnsArray.map((investmentObject) => formatCurrency(investmentObject.interestReturns)),
          backgroundColor: 'rgb(54, 162, 235)',
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
        },
      },
    },
  })
}

function clearForm() {
  form["starting-amount"].value = "";
  form["additional-contribution"].value = "";
  form["time-amount"].value = "";
  form["return-rate"].value = "";
  form["tax-rate"].value = "";

  const errorInputContainers = document.querySelectorAll(".error");
  for (const errorInputContainer of errorInputContainers) {
    errorInputContainer.classList.remove("error");
    errorInputContainer.parentElement.querySelector("p").remove();
  }
}

function validateInput(evt) {
  if (evt.target.value === "") {
    return;
  }

  const { parentElement } = evt.target;
  const grandParentElement = evt.target.parentElement.parentElement;
  const inputValue = evt.target.value.replace(",", ".");

  if (
    !parentElement.classList.contains("error") &&
    (isNaN(inputValue) || Number(inputValue) <= 0)
  ) {
    const erroTextElement = document.createElement("p");
    erroTextElement.classList.add("text-red-500");
    erroTextElement.innerText = "Insira um valor númerico e maior que zero";
    parentElement.classList.add("error");
    grandParentElement.appendChild(erroTextElement);
  } else if (
    parentElement.classList.contains("error") &&
    !isNaN(inputValue) &&
    Number(inputValue) > 0
  ) {
    parentElement.classList.remove("error");
    grandParentElement.querySelector("p").remove();
  }
}

for (const formElement of form) {
  if (formElement.tagName === "INPUT" && formElement.hasAttribute("name")) {
    formElement.addEventListener("blur", validateInput);
  }
}

clearFormButton.addEventListener("click", clearForm);
form.addEventListener("submit", renderProgression);

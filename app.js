import { api } from "./service/api.js";
window.app = {
  data: [],
  costEfficient: { unitPricePerUnit: "Infinity" },
  expensive: { unitPricePerUnit: "-Infinity" },
  ramOptions: [],
  coreOptions: [],
  form: undefined,
};

window.addEventListener("DOMContentLoaded", async () => {
  await setData();
  setRamOptions();
  setCoreOptions();
  formOveright();
});

window.addEventListener("form-submission", () => {
  const form = Object.fromEntries(app.form.entries());
  console.log("form ", form);
  app.selectedItem = app.data.reduce(
    (acc, curr) => {
      if (
        curr.memoryInMB >= form.memoryInMB &&
        curr.os === form.os &&
        curr.numberOfCores >= form.numberOfCores &&
        Number(acc.unitPricePerUnit.replaceAll(",", ".")) >
          Number(curr.unitPricePerUnit.replaceAll(",", "."))
      ) {
        acc = curr;
      }
      return acc;
    },
    {
      unitPricePerUnit: "Infinity",
    }
  );
  console.log(app.selectedItem);
  let itenInsert = "";
  Object.entries(app.selectedItem).forEach(([k, v]) => {
    itenInsert += `<p><strong>${k}</strong>: ${v}</p>`;
  });
  document.querySelector("#response").innerHTML = itenInsert;
  document.querySelector("#response");
});

async function setData() {
  app.data = await api.fetchData();
  app = app.data.reduce(
    (acc, curr) => {
      if (!!curr.unitPricePerUnit) {
        if (!acc.ramOptions.includes(curr.memoryInMB)) {
          acc.ramOptions.push(curr.memoryInMB);
        }
        if (!acc.coreOptions.includes(curr.numberOfCores)) {
          acc.coreOptions.push(curr.numberOfCores);
        }
        if (
          Number(acc.expensive.unitPricePerUnit.replaceAll(",", ".")) <
          Number(curr.unitPricePerUnit.replaceAll(",", "."))
        ) {
          acc.expensive = curr;
        }
        if (
          Number(acc.costEfficient.unitPricePerUnit.replaceAll(",", ".")) >
          Number(curr.unitPricePerUnit.replaceAll(",", "."))
        ) {
          acc.costEfficient = curr;
        }
      }
      return acc;
    },
    {
      data: app.data,
      costEfficient: { unitPricePerUnit: "Infinity" },
      expensive: { unitPricePerUnit: "-Infinity" },
      ramOptions: [],
      coreOptions: [],
    }
  );

  console.log("costEfficient ", app.costEfficient.unitPricePerUnit);
  console.log("expensive ", app.expensive.unitPricePerUnit);
}

function setRamOptions() {
  const ramSelector = document.querySelector("#memoryInMB");
  if (ramSelector) {
    app.ramOptions
      .sort((a, b) => a - b)
      .forEach((e) => {
        ramSelector.innerHTML += `<option value="${e}">${e / 1024}</option>`;
      });
  }
}

function setCoreOptions() {
  const coresSelector = document.querySelector("#numberOfCores");
  if (coresSelector) {
    app.coreOptions
      .sort((a, b) => a - b)
      .forEach((e) => {
        coresSelector.innerHTML += `<option value="${e}">${e}</option>`;
      });
  }
}

function formOveright() {
  const form = document.querySelector("#vm-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    app.form = data;
    window.dispatchEvent(new Event("form-submission"));
  });
}

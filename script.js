document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.getElementById("search-btn");
  const drugSearchInput = document.getElementById("drug-search");
  const drugInfoDiv = document.getElementById("drug-info");
  const savedList = document.getElementById("saved-list");

  const resetBtn = document.createElement("button");
  resetBtn.id = "reset-btn";
  resetBtn.textContent = "Reset";
  searchBtn.parentNode.appendChild(resetBtn);

  searchBtn.addEventListener("click", async () => {
    const drugName = drugSearchInput.value.trim();
    if (!drugName) {
      alert("Please enter a drug name.");
      return;
    }

    try {
      const response = await fetch(
        `https://api.fda.gov/drug/label.json?search=openfda.brand_name:${drugName}`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      if (!data.results || data.results.length === 0) {
        drugInfoDiv.innerHTML = "<p>No drug information found.</p>";
        return;
      }

      const drug = data.results[0];
      drugInfoDiv.innerHTML = `
          <h3>${drugName.toUpperCase()}</h3>
          <p><strong>Purpose:</strong> ${formatText(drug.purpose)}</p>
          <p><strong>Dosage:</strong> ${formatText(
            drug.dosage_and_administration
          )}</p>
          <p><strong>Side Effects:</strong> ${formatText(
            drug.adverse_reactions
          )}</p>
          <button id="save-btn">Save Drug</button>
      `;

      document
        .getElementById("save-btn")
        .addEventListener("click", () => saveDrug(drugName));
    } catch (error) {
      drugInfoDiv.innerHTML =
        "<p>Could not fetch drug information. Please try again later.</p>";
    }
  });

  function formatText(textArray) {
    if (!textArray) return "No information available.";
    return textArray.join("<br><br>");
  }

  function saveDrug(drugName) {
    const listItem = document.createElement("li");
    listItem.innerHTML = `${drugName} <button class="delete-btn">❌</button>`;

    listItem.querySelector(".delete-btn").addEventListener("click", () => {
      listItem.remove();
    });

    savedList.appendChild(listItem);
  }

  resetBtn.addEventListener("click", () => {
    drugSearchInput.value = "";
    drugInfoDiv.innerHTML = "";
  });
});

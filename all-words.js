let dictionary = [];

document.addEventListener("DOMContentLoaded", () => {
  // 1 Fetch the dictionary data
  fetch("dictionary.json")
    .then((res) => res.json())
    .then((data) => {
      dictionary = data;
      // 2 Sort by Okrika word
      dictionary.sort((a, b) => a.okrika.localeCompare(b.okrika));
      // 3 Display in the list
      displayAllWords(dictionary);
    })
    .catch((err) => {
      console.error("Error loading dictionary.json:", err);
    });

  // Close modal when user clicks "×"
  const closeBtn = document.getElementById("modalCloseBtn");
  closeBtn.addEventListener("click", closeModal);

  // Also close modal if they click outside the card (overlay)
  const overlay = document.getElementById("modalOverlay");
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      closeModal();
    }
  });
});

function displayAllWords(entries) {
  const listContainer = document.querySelector(".word-list");
  listContainer.innerHTML = ""; // clear any old content

  entries.forEach((wordObj) => {
    const rowEl = document.createElement("div");
    rowEl.classList.add("word-row");

    const okrikaEl = document.createElement("div");
    okrikaEl.classList.add("word-okrika");
    okrikaEl.textContent = wordObj.okrika;

    const englishEl = document.createElement("div");
    englishEl.classList.add("word-english");
    englishEl.textContent = wordObj.english;

    rowEl.appendChild(okrikaEl);
    rowEl.appendChild(englishEl);

    // Clicking row opens modal
    rowEl.addEventListener("click", () => openModal(wordObj));
    listContainer.appendChild(rowEl);
  });
}

function openModal(wordObj) {
  const overlay = document.getElementById("modalOverlay");
  const modalContent = document.getElementById("modalContent");

  modalContent.innerHTML = `
    <h2>${wordObj.okrika} <small>(${wordObj.partOfSpeech})</small></h2>
    <p><strong>English:</strong> ${wordObj.english}</p>
    <p><strong>Definition:</strong> ${wordObj.definition}</p>
    <p><strong>Example:</strong> ${wordObj.example}</p>
    <p><strong>Translation:</strong> ${wordObj.translation ?? ""}</p>
  `;

  overlay.style.display = "flex";
}

function closeModal() {
  const overlay = document.getElementById("modalOverlay");
  overlay.style.display = "none";
}

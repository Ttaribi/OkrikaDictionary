let dictionary = [];

// Helper which will remove diacritics/accents from strings
function removeDiacritics(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

document.addEventListener("DOMContentLoaded", () => {
  // Fetch the dictionary data
  fetch("dictionary.json")
    .then((response) => response.json())
    .then((data) => {
      dictionary = data;
    })
    .catch((err) => {
      console.error("Error loading dictionary.json:", err);
    });

  // Grab the form element
  const searchForm = document.getElementById("searchForm");
  
  // On form submit, prevent page reload and do the search
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault(); // stop the form from reloading the page
    handleSearch();
  });
});

function handleSearch() {
  const inputEl = document.querySelector(".search-input");
  const resultContainer = document.querySelector(".search-result");

  // Clear old results
  resultContainer.innerHTML = "";

  // Get the user's query
  const queryRaw = inputEl.value.trim();
  if (!queryRaw) {
    resultContainer.textContent = "Please enter a word.";
    return;
  }

  // Lowercase + remove accent marks
  const queryBase = removeDiacritics(queryRaw.toLowerCase());

  // Filter the dictionary, matching partial query in either English or Okrika
  const matchedEntries = dictionary.filter((entry) => {
    const engBase = removeDiacritics(entry.english).toLowerCase();
    const okrBase = removeDiacritics(entry.okrika).toLowerCase();
    return engBase.includes(queryBase) || okrBase.includes(queryBase);
  });

  if (matchedEntries.length === 0) {
    resultContainer.textContent = "Word not found in the dictionary.";
    return;
  }

  // Sort so exact Okrika matches appear before partial matches
  matchedEntries.sort((a, b) => {
    const aBase = removeDiacritics(a.okrika).toLowerCase();
    const bBase = removeDiacritics(b.okrika).toLowerCase();

    const aIsExact = (aBase === queryBase);
    const bIsExact = (bBase === queryBase);

    if (aIsExact && !bIsExact) return -1;
    if (bIsExact && !aIsExact) return 1;
    return aBase.localeCompare(bBase);
  });

  // Display results
  matchedEntries.forEach((foundWord) => {
    const wordDiv = document.createElement("div");
    wordDiv.classList.add("word-entry");
    wordDiv.innerHTML = `
      <h2>${foundWord.okrika} <small>(${foundWord.partOfSpeech})</small></h2>
      <p><strong>English:</strong> ${foundWord.english}</p>
      <p><strong>Definition:</strong> ${foundWord.definition}</p>
      <p><strong>Example:</strong> ${foundWord.example}</p>
      <p><strong>Translation:</strong> ${foundWord.translation ?? ""}</p>
    `;
    resultContainer.appendChild(wordDiv);
  });
}

let dictionary = [];

/**
 * Removes diacritical marks (accents) from a string,
 * e.g. "wárí" => "wari"
 */
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

  // Bind the Search button click
  const searchBtn = document.querySelector(".search-btn");
  searchBtn.addEventListener("click", handleSearch);
});

/**
 * Handle the Search button click:
 * 1) Removes accents from user's query and from dictionary fields.
 * 2) Finds partial matches in English OR Okrika.
 * 3) Sorts so EXACT matches (Okrika == query) appear first.
 * 4) Displays results, including Translation if present.
 */
function handleSearch() {
  const inputEl = document.querySelector(".search-input");
  const resultContainer = document.querySelector(".search-result");

  // Clear old results
  resultContainer.innerHTML = "";

  const queryRaw = inputEl.value.trim();
  if (!queryRaw) {
    resultContainer.textContent = "Please enter a word.";
    return;
  }

  // Diacritics removed, lowercased user query
  const queryBase = removeDiacritics(queryRaw.toLowerCase());

  // 1) Filter for partial matches (ignoring diacritics) in English or Okrika
  const matchedEntries = dictionary.filter((entry) => {
    const engBase = removeDiacritics(entry.english).toLowerCase();
    const okrBase = removeDiacritics(entry.okrika).toLowerCase();
    return engBase.includes(queryBase) || okrBase.includes(queryBase);
  });

  // 2) If no matches, notify user
  if (matchedEntries.length === 0) {
    resultContainer.textContent = "Word not found in the dictionary.";
    return;
  }

  // 3) Sort matched entries so EXACT Okrika matches appear before partial matches
  matchedEntries.sort((a, b) => {
    const aBase = removeDiacritics(a.okrika).toLowerCase();
    const bBase = removeDiacritics(b.okrika).toLowerCase();

    const aIsExact = (aBase === queryBase);
    const bIsExact = (bBase === queryBase);

    // If "a" is exact but "b" is not, "a" goes first
    if (aIsExact && !bIsExact) return -1;
    // If "b" is exact but "a" is not, "b" goes first
    if (bIsExact && !aIsExact) return 1;

    // If both are exact or both partial, sort alphabetically by Okrika
    return aBase.localeCompare(bBase);
  });

  // 4) Display each matched entry
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

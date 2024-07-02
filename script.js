document.getElementById('search-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    let word = document.getElementById('search-input').value;
    if (word.trim() === '') {
        alert('Please enter a word');
        return;
    }

    let resultDiv = document.getElementById('result');
    resultDiv.innerHTML = 'Loading...';

    try {
        let response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        if (!response.ok) {
            throw new Error('Word not found');
        }
        let data = await response.json();

        displayResult(data);
    } catch (error) {
        resultDiv.innerHTML = `<div class="alert alert-danger" role="alert">${error.message}</div>`;
    }
});

function displayResult(data) {
let resultDiv = document.getElementById('result');

// Extract and log the source URLs
let sourceUrls = data[0].sourceUrls;
console.log(sourceUrls);

// Map through the meanings to create HTML structure
let meanings = data[0].meanings.map(meaning => {
return `
    <div class="card mt-3">
        <div class="card-body">
            <h5 class="card-title">${meaning.partOfSpeech}</h5>
            <p class="card-text">${meaning.definitions[0].definition}</p>
            <p class="card-text"><em>${meaning.definitions[0].example || ''}</em></p>
            <div class="sources mt-2">
                <h6>Sources:</h6>
                <ul>
                    ${sourceUrls.map(url => `<li><a href="${url}" target="_blank">${url}</a></li>`).join('')}
                </ul>
            </div>
        </div>
    </div>
`;
}).join('');

// Update the resultDiv inner HTML to include meanings and sources
resultDiv.innerHTML = `
<h2>${data[0].word}</h2>
${meanings}
`;
}
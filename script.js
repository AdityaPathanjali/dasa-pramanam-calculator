const data = [
    { position: 'ర', year: 6 },   // Ravi
    { position: 'చ', year: 10 },  // Chandra
    { position: 'కు', year: 7 },  // Kuja
    { position: 'రా', year: 18 }, // Raahu
    { position: 'గు', year: 16 }, // Guru
    { position: 'శ', year: 19 },  // Sani
    { position: 'బు', year: 17 }, // Budha
    { position: 'కే', year: 7 },  // Ketu
    { position: 'శు', year: 20 }  // Sukra
];

const positionsList = document.getElementById('positions-list');
const dropdowns = ['dropdown1', 'dropdown2', 'dropdown3', 'dropdown4'];
let storedData = {};

// Create list items for each position
function createListItem(position, year, level = 0) {
    const li = document.createElement('li');
    li.innerHTML = `${position} <span class="year">${convertToYearsMonthsDays(year)}</span>`;
    li.dataset.level = level;
    li.dataset.position = position;
    li.dataset.year = year;
    li.addEventListener('click', () => handleItemClick(li));
    return li;
}

// Handle item click for expanding the list
function handleItemClick(listItem) {
    const position = listItem.dataset.position;
    const year = parseFloat(listItem.dataset.year);
    const level = parseInt(listItem.dataset.level);

    if (level >= 3) return; // Stop expanding after 4 levels (0, 1, 2, 3)

    // Remove the expanded list if it already exists
    if (listItem.nextElementSibling && listItem.nextElementSibling.classList.contains('expanded')) {
        listItem.nextElementSibling.remove();
    } else {
        const index = data.findIndex(item => item.position === position.split('.').pop());
        const expandedList = document.createElement('ul');
        expandedList.classList.add('expanded');
        expandedList.style.display = 'block';

        // Loop to create new items based on the current position's year
        for (let i = 0; i < data.length; i++) {
            const currentIndex = (index + i) % data.length;
            const item = data[currentIndex];
            const calculatedYear = (year * item.year) / 120;
            expandedList.appendChild(createListItem(position + '.' + item.position, calculatedYear, level + 1));
        }
        listItem.insertAdjacentElement('afterend', expandedList);
    }
}

// Populate dropdowns with position options
function populateDropdowns() {
    dropdowns.forEach(dropdownId => {
        const select = document.getElementById(dropdownId);
        select.innerHTML = '<option value="*">*</option>';
        data.forEach(item => {
            const option = document.createElement('option');
            option.value = item.position;
            option.textContent = item.position;
            select.appendChild(option);
        });
    });
}

// Process the query from dropdown selections
function processQuery() {
    const selectedPositions = dropdowns.map(dropdownId => document.getElementById(dropdownId).value);
    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = '';

    console.log('Selected positions:', selectedPositions);

    // Check for invalid input
    for (let i = 0; i < selectedPositions.length; i++) {
        if (selectedPositions[i] === '*' && selectedPositions.slice(i + 1).some(val => val !== '*')) {
            outputDiv.textContent = 'Error in input';
            return;
        }
    }

    // Combine selected positions and remove trailing '*'
    const queryPosition = selectedPositions.join('.').replace(/\.+\*+$/, '');
    const year = storedData[queryPosition];

    if (year !== undefined) {
        const p = document.createElement('p');
        p.textContent = `${queryPosition}: ${convertToYearsMonthsDays(year)}`;
        outputDiv.appendChild(p);
    } else {
        outputDiv.textContent = 'No data found for the selected positions';
    }
}

// Generate all possible combinations for the selected positions
function generateCombinations(selectedPositions, index = 0, prefix = []) {
    if (index === selectedPositions.length) {
        return [prefix];
    }
    if (selectedPositions[index] === '*') {
        const combinations = [];
        data.forEach(item => {
            combinations.push(...generateCombinations(selectedPositions, index + 1, [...prefix, item.position]));
        });
        return combinations;
    } else {
        return generateCombinations(selectedPositions, index + 1, [...prefix, selectedPositions[index]]);
    }
}

// Convert years to a string format of years, months, and days
function convertToYearsMonthsDays(year) {
    const totalDays = Math.round(year * 365);
    const years = Math.floor(totalDays / 365);
    const remainingDays = totalDays % 365;
    const months = Math.floor(remainingDays / 30);
    const days = remainingDays % 30;
    return `${years}సం - ${months}నె - ${days}రో`;
}

// Initialize positions list and stored data
data.forEach(item => {
    positionsList.appendChild(createListItem(item.position, item.year));
    storedData[item.position] = item.year;
});

// Populate stored data for all combinations
function populateStoredData(prefix, level) {
    if (level >= 4) return; // Limit to 4 levels
    const index = data.findIndex(item => item.position === prefix.split('.').pop());
    for (let i = 0; i < data.length; i++) {
        const currentIndex = (index + i) % data.length;
        const item = data[currentIndex];
        const newKey = prefix + '.' + item.position;
        const newYear = (storedData[prefix] * item.year) / 120;
        storedData[newKey] = newYear;
        populateStoredData(newKey, level + 1);
    }
}

data.forEach(item => populateStoredData(item.position, 1));
populateDropdowns();

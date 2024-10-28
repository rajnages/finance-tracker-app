// client/app.js
const entryTitle = document.getElementById('entryTitle');
const entryAmount = document.getElementById('entryAmount');
const entryType = document.getElementById('entryType');
const addEntryBtn = document.getElementById('addEntryBtn');
const entryList = document.getElementById('entryList');
const totalIncomeElem = document.getElementById('totalIncome');
const totalExpensesElem = document.getElementById('totalExpenses');
const balanceElem = document.getElementById('balance');

const fetchEntries = async () => {
    const response = await fetch('/entries');
    const entries = await response.json();
    renderEntries(entries);
    updateSummary(entries);
};

const renderEntries = (entries) => {
    entryList.innerHTML = '';
    entries.forEach(entry => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${entry.title} - $${entry.amount} (${entry.type})</span>
            <button onclick="editEntry(${entry.id})">Edit</button>
            <button onclick="deleteEntry(${entry.id})">Delete</button>
        `;
        entryList.appendChild(li);
    });
};

const addEntry = async () => {
    const entry = {
        title: entryTitle.value,
        amount: parseFloat(entryAmount.value),
        type: entryType.value
    };

    await fetch('/entries', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(entry)
    });

    entryTitle.value = '';
    entryAmount.value = '';
    fetchEntries();
};

const editEntry = async (id) => {
    const entry = {
        title: entryTitle.value,
        amount: parseFloat(entryAmount.value),
        type: entryType.value
    };

    await fetch(`/entries/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(entry)
    });

    entryTitle.value = '';
    entryAmount.value = '';
    fetchEntries();
};

const deleteEntry = async (id) => {
    await fetch(`/entries/${id}`, {
        method: 'DELETE'
    });
    fetchEntries();
};

const updateSummary = (entries) => {
    let totalIncome = 0;
    let totalExpenses = 0;

    entries.forEach(entry => {
        if (entry.type === 'income') {
            totalIncome += entry.amount;
        } else {
            totalExpenses += entry.amount;
        }
    });

    totalIncomeElem.textContent = totalIncome.toFixed(2);
    totalExpensesElem.textContent = totalExpenses.toFixed(2);
    balanceElem.textContent = (totalIncome - totalExpenses).toFixed(2);
};

addEntryBtn.addEventListener('click', addEntry);
fetchEntries();

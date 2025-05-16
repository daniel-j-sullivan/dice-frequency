const numRollsSelector = document.querySelector('#num-rolls-selector');
const diceRollBtn = document.querySelector('#dice-roll-btn');
const statsDisplay = document.querySelector('.stats-display');
const diceStats = document.querySelector('#dice-stats');
const introText = document.querySelector('.intro-text');
let numRolls = 0;

// Populate dropdown with roll counts (10 to 1000)
for (let i = 0; i < 100; i++) {
    const option = document.createElement('option');
    option.value = (i + 1) * 10;
    option.text = option.value;
    numRollsSelector.appendChild(option);
}

// Enable or disable the roll button based on selection
numRollsSelector.addEventListener('change', function () {
    numRolls = this.value;
    if (numRolls == 0) {
        diceRollBtn.classList.add("disabled");
    } else {
        diceRollBtn.classList.remove('disabled');
    }
});

diceRollBtn.addEventListener('click', function () {
    clearHTMLElement(diceStats);
    clearHTMLElement(introText);
    statsDisplay.classList.remove('d-none');

    let diceRollStatistics = {};

    // Initialize counts for 2 through 12
    for (let i = 2; i <= 12; i++) {
        diceRollStatistics[i.toString()] = 0;
    }

    // Simulate the rolls
    for (let i = 0; i < numRolls; i++) {
        const result = rollTwoDice().toString();
        diceRollStatistics[result] += 1;
    }


    // Sort keys numerically for consistent output
    const sortedKeys = Object.keys(diceRollStatistics).sort((a, b) => a - b);

    // Populate table
    for (const key of sortedKeys) {
        console.log(`key: ${key}, value: ${diceRollStatistics[key]}`);

        const newRow = diceStats.insertRow();

        const totalCell = newRow.insertCell();
        const countCell = newRow.insertCell();
        const percentCell = newRow.insertCell();

        const total = document.createTextNode(key);
        const timesRolled = document.createTextNode(diceRollStatistics[key]);
        const percent = document.createTextNode(
            ((diceRollStatistics[key] / numRolls) * 100).toFixed(2) + '%'
        );

        totalCell.appendChild(total);
        countCell.appendChild(timesRolled);
        percentCell.appendChild(percent);
    }

    // Destroy previous chart if it exists
    if (window.diceChart instanceof Chart) {
        window.diceChart.destroy();
    }

    // Set up chart
    const labels = sortedKeys;
    const data = labels.map(key => diceRollStatistics[key]);

    const ctx = document.getElementById('diceChart').getContext('2d');
    window.diceChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Times Rolled',
                data: data,
                backgroundColor: 'rgba(220, 53, 69, 0.6)',
                borderColor: 'rgba(220, 53, 69, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Frequency'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Dice Total'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
});

function rollTwoDice() {
    const dice1 = Math.floor(Math.random() * 6 + 1);
    const dice2 = Math.floor(Math.random() * 6 + 1);
    return dice1 + dice2;
}

function clearHTMLElement(element) {
    element.innerHTML = '';
}

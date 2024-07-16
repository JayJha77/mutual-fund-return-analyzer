document.getElementById('mf-form').addEventListener('submit', function(event) {
    event.preventDefault();
    calculateReturns();
});

function calculateReturns() {
    const investmentType = document.getElementById('investmentType').value;
    const investmentAmount = parseFloat(document.getElementById('investmentAmount').value);
    const years = parseInt(document.getElementById('years').value);
    const strategy = document.getElementById('strategy').value;

    let expectedReturn;
    if (strategy === 'conservative') {
        expectedReturn = 0.08;
    } else if (strategy === 'moderate') {
        expectedReturn = 0.10;
    } else if (strategy === 'aggressive') {
        expectedReturn = 0.12;
    }

    let totalValue = 0;
    let totalContributions = 0;

    const data = [];

    if (investmentType === 'sip') {
        for (let month = 1; month <= years * 12; month++) {
            totalValue = (totalValue + investmentAmount) * (1 + expectedReturn / 12);
            totalContributions += investmentAmount;
            if (month % 12 === 0) {
                data.push({ year: month / 12, totalValue, totalContributions, returns: totalValue - totalContributions });
            }
        }
    } else if (investmentType === 'lumpsum') {
        totalValue = investmentAmount;
        totalContributions = investmentAmount;
        for (let year = 1; year <= years; year++) {
            totalValue *= (1 + expectedReturn);
            data.push({ year, totalValue, totalContributions, returns: totalValue - totalContributions });
        }
    }

    document.getElementById('totalValue').innerText = totalValue.toFixed(2);
    document.getElementById('totalContributions').innerText = totalContributions.toFixed(2);
    document.getElementById('totalReturns').innerText = (totalValue - totalContributions).toFixed(2);

    displayChart(data);
}

function displayChart(data) {
    const ctx = document.getElementById('myChart').getContext('2d');
    const labels = data.map(d => `Year ${d.year}`);
    const totalValues = data.map(d => d.totalValue);
    const totalContributions = data.map(d => d.totalContributions);
    const returns = data.map(d => d.returns);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: 'Total Value',
                    data: totalValues,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    fill: false
                },
                {
                    label: 'Total Contributions',
                    data: totalContributions,
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1,
                    fill: false
                },
                {
                    label: 'Total Returns',
                    data: returns,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                    fill: false
                }
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}


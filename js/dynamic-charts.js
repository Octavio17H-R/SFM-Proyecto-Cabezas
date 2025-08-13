// Waits for the DOM to be fully loaded before executing the script
document.addEventListener('DOMContentLoaded', () => {

    // Gets the 2D contexts of the canvas elements to draw the charts
    const monthlyCtx = document.getElementById('monthlyChart').getContext('2d');
    const annualCtx = document.getElementById('annualChart').getContext('2d');

    let monthlyChart; // Variable to store the monthly chart instance
    let annualChart;  // Variable to store the annual chart instance

    // Labels for the months of the year
    const labels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    /**
     * @brief Gets cost and budget data from the HTML table.
     * @returns {object} An object containing arrays of costs and budgets,
     * and the totals of both.
     */
    const getDataFromTable = () => {
        // Selects all number inputs in the cost row
        const costoInputs = document.querySelectorAll('#costoRow input[type="number"]');
        // Selects all number inputs in the budget row
        const budgetInputs = document.querySelectorAll('#budgetRow input[type="number"]');

        // Converts NodeLists of inputs to arrays and parses their values to floats
        // If the value is not a valid number, 0 is used
        const costos = Array.from(costoInputs).map(input => parseFloat(input.value) || 0);
        const budgets = Array.from(budgetInputs).map(input => parseFloat(input.value) || 0);

        // Calculates the total costs and budgets by summing all values in their respective arrays
        const totalCosto = costos.reduce((sum, current) => sum + current, 0);
        const totalBudget = budgets.reduce((sum, current) => sum + current, 0);

        return { costos, budgets, totalCosto, totalBudget };
    };

    /**
     * @brief Creates or updates the monthly bar and line chart.
     * @param {object} data - Object with cost and budget data.
     */
    const createMonthlyChart = (data) => {
        // If a monthly chart instance already exists, destroy it to create a new one
        if (monthlyChart) {
            monthlyChart.destroy();
        }
        // Creates a new Chart.js instance
        monthlyChart = new Chart(monthlyCtx, {
            type: 'bar', // Chart type: bar
            data: {
                labels: labels, // X-axis labels (months)
                datasets: [
                    {
                        label: 'Costo USD', // Label for the cost series
                        data: data.costos, // Cost data
                        backgroundColor: '#34495e', // Bar color (dark gray)
                        borderRadius: 4 // Rounded borders for bars
                    },
                    {
                        label: 'Budget Proc. Corazones N10', // Label for the budget series
                        data: data.budgets, // Budget data
                        type: 'line', // Dataset type: line
                        borderColor: '#e74c3c', // Line color (red)
                        borderWidth: 2, // Line width
                        fill: false, // Does not fill the area under the line
                        pointRadius: 0, // Hides points on the line
                        tension: 0.1 // Line tension
                    }
                ]
            },
            options: {
                responsive: true, // Chart adapts to container size
                maintainAspectRatio: false, // Allows the chart not to maintain its original aspect ratio
                plugins: {
                    legend: {
                        display: true,
                        position: 'top', // Legend position
                        labels: {
                            usePointStyle: true, // Uses point style for line legend
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false // Hides grid lines on the X-axis
                        }
                    },
                    y: {
                        beginAtZero: true, // Y-axis starts at zero
                        title: {
                            display: true,
                            text: 'Costo USD', // Y-axis title
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        },
                        ticks: {
                            callback: function(value) {
                                return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
                            }
                        },
                        // Adjusted maximum value so the chart is not "too long"
                        max: 600000 // Fixed maximum value for the Y-axis
                    }
                }
            }
        });
    };

    /**
     * @brief Creates or updates the annual bar and line chart.
     * The data for this chart is fixed as per the provided image.
     */
    const createAnnualChart = () => {
        // If an annual chart instance already exists, destroy it
        if (annualChart) {
            annualChart.destroy();
        }
        // Fixed data for the annual summary
        const annualData = {
            '2023': 4783598,
            '2024': 3247423,
            '2025': 1652777
        };
        const annualLabels = Object.keys(annualData);   // Gets years as labels
        const annualValues = Object.values(annualData); // Gets values as data

        annualChart = new Chart(annualCtx, {
            type: 'bar', // Chart type: bar
            data: {
                labels: annualLabels, // X-axis labels (years)
                datasets: [
                    {
                        label: 'Costo Anual', // Label for the annual cost series
                        data: annualValues, // Annual cost data
                        backgroundColor: '#34495e', // Bar color (dark gray)
                        borderRadius: 4
                    },
                    {
                        label: 'Budget 2025', // Label for the budget line
                        data: [null, null, 3929013], // Budget is only shown for 2025
                        type: 'line', // Dataset type: line
                        borderColor: '#e74c3c', // Line color (red)
                        borderWidth: 2,
                        fill: false,
                        pointRadius: 5, // Shows a point on the line for 2025
                        pointBackgroundColor: '#e74c3c',
                        tension: 0.1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Costo Anual USD',
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        },
                        ticks: {
                            callback: function(value) {
                                return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
                            }
                        },
                        // Adjusted maximum value so the chart is not "too long"
                        max: 5000000 // Fixed maximum value for the Y-axis
                    }
                }
            }
        });
    };

    /**
     * @brief Main function called when table data changes.
     * Updates totals and charts.
     * @global
     */
    window.updateCharts = () => {
        const data = getDataFromTable(); // Gets updated data from the table

        // Updates the text of the totals in the table
        document.getElementById('totalCosto').innerText = data.totalCosto.toLocaleString('en-US');
        document.getElementById('totalBudget').innerText = data.totalBudget.toLocaleString('en-US');

        // Updates the data of the monthly chart datasets and refreshes it
        monthlyChart.data.datasets[0].data = data.costos;
        monthlyChart.data.datasets[1].data = data.budgets;
        monthlyChart.update();

        // Note: The annual chart is not updated with monthly inputs,
        // as its data is fixed according to the original image.
        // If the 2025 total needed to be updated with the months,
        // the annual chart logic would need to be modified.
    };

    // Initial calls to create charts and update totals
    // This ensures that the charts are displayed correctly when the page loads
    const initialData = getDataFromTable();
    createMonthlyChart(initialData);
    createAnnualChart();
    updateCharts(); // Calls updateCharts to calculate and display initial totals
});

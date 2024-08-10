

const fetchData = async function(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        console.log('Datos obtenidos:', data); // Verifica los datos obtenidos
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

const createChart = async function(chartId, url, chartType, label, valueKey, labelKey, isVertical = false) {
    const datos = await fetchData(url);
    if (!datos) return;

    // Verifica la estructura de los datos
    console.log(`Datos para ${chartId}:`, datos);

    const categorias = datos.map(d => d[labelKey] || 'Sin etiqueta');
    const valores = datos.map(d => d[valueKey] !== undefined ? d[valueKey] : 0);

    const ctx = document.getElementById(chartId).getContext('2d');
    new Chart(ctx, {
        type: chartType,
        data: {
            labels: categorias,
            datasets: [{
                label: label,
                data: valores,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    ticks: {
                        autoSkip: false,
                        maxRotation: isVertical ? 45 : 0,  
                        minRotation: isVertical ? 45 : 0,  
                        font: {
                            size: 9 
                        }
                    },
                    
                },
                y: {
                    ticks: {
                        font: {
                            size: 10 
                        }
                    },
                    
                }
            },
            plugins: {
                legend: {
                    labels: {
                        font: {
                            size: 12 
                        }
                    }
                }
            }
        }
    });
};

// Llama a las funciones para cada gráfico
const renderCharts = async function() {
    await createChart('chartMecanicosProceso', 'http://127.0.0.1:5000/mecanicos_en_proceso', 'pie', 'Mantenimientos en Proceso por Mecánico', 'cantidad_en_proceso', 'mecanico');
    await createChart('chartMecanicosFinalizado', 'http://127.0.0.1:5000/mecanicos_finalizado', 'pie', 'Mantenimientos Finalizados por Mecánico', 'cantidad_finalizados', 'mecanico');
    await createChart('chartClientesProceso', 'http://127.0.0.1:5000/clientes_en_proceso', 'bar', 'Mantenimientos en Proceso por Cliente', 'cantidad_en_proceso', 'cliente');
    await createChart('chartClientesFinalizado', 'http://127.0.0.1:5000/clientes_finalizado', 'bar', 'Mantenimientos Finalizados por Cliente', 'cantidad_finalizados', 'cliente');
};

document.addEventListener('DOMContentLoaded', renderCharts);

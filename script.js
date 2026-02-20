const platformFees = {
    'CSFloat': { buy: 0, sell: 2.0 },
    'BUFF163': { buy: 0, sell: 2.5 },
    'Steam': { buy: 0, sell: 15.0 },
    'Skinport': { buy: 0, sell: 12.0 },
    'Custom': { buy: 0, sell: 0 }
};

let profitChart = null;

document.getElementById('buy-platform').addEventListener('change', (e) => {
    document.getElementById('buy-fee').value = platformFees[e.target.value]?.buy || 0;
});

document.getElementById('sell-platform').addEventListener('change', (e) => {
    document.getElementById('sell-fee').value = platformFees[e.target.value]?.sell || 0;
});

function initChart(data) {
    const ctx = document.getElementById('profitChart').getContext('2d');
    if (profitChart) profitChart.destroy();

    const chartData = [...data].reverse();
    let cumulativeProfit = 0;
    const labels = chartData.map(t => t.trade_date);
    const profits = chartData.map(t => {
        cumulativeProfit += parseFloat(t.net_profit);
        return cumulativeProfit;
    });

    profitChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Cumulative Profit',
                data: profits,
                borderColor: '#d4af37',
                backgroundColor: 'rgba(212, 175, 55, 0.05)',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#d4af37'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#888', font: { size: 10 } } },
                x: { grid: { display: false }, ticks: { color: '#888', font: { size: 10 } } }
            }
        }
    });
}

async function fetchTrades() {
    const res = await fetch('api.php');
    const trades = await res.json();
    
    const tbody = document.getElementById('trades-body');
    tbody.innerHTML = '';
    
    let totalProfit = 0;
    let totalInvested = 0;
    let totalItems = 0;

    trades.forEach(t => {
        const profit = parseFloat(t.net_profit);
        const buy = parseFloat(t.buy_price);
        const buyFee = parseFloat(t.buy_fee);
        const qty = parseInt(t.quantity || 1);
        const symbol = t.currency === 'USD' ? '$' : 'zł';
        
        totalProfit += profit;
        totalInvested += (buy + (buy * (buyFee / 100)));
        totalItems += qty;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <strong>${t.item_name}</strong><span class="qty-tag">x${qty}</span>
                <small>${t.trade_date}</small>
            </td>
            <td>${buy.toFixed(2)} ${symbol}<small>${t.buy_platform}</small></td>
            <td>${parseFloat(t.sell_price).toFixed(2)} ${symbol}<small>${t.sell_platform}</small></td>
            <td class="${profit >= 0 ? 'profit' : 'loss'}">
                ${profit >= 0 ? '+' : ''}${profit.toFixed(2)} ${symbol}
            </td>
            <td><button class="delete-btn" onclick="deleteTrade(${t.id})">VOID</button></td>
        `;
        tbody.appendChild(row);
    });

    const profEl = document.getElementById('total-profit');
    profEl.textContent = totalProfit.toFixed(2);
    profEl.className = totalProfit >= 0 ? 'profit-text' : 'loss';
    
    document.getElementById('total-trades').textContent = totalItems;
    document.getElementById('total-roi').textContent = totalInvested > 0 ? ((totalProfit / totalInvested) * 100).toFixed(2) + '%' : '0%';
    
    initChart(trades);
}

document.getElementById('trade-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const bPrice = parseFloat(document.getElementById('buy-price').value);
    const bFee = parseFloat(document.getElementById('buy-fee').value);
    const sPrice = parseFloat(document.getElementById('sell-price').value);
    const sFee = parseFloat(document.getElementById('sell-fee').value);
    const qty = parseInt(document.getElementById('quantity').value);
    
    const netProfit = (sPrice - (sPrice * sFee/100)) - (bPrice + (bPrice * bFee/100));

    const data = {
        date: new Date().toLocaleDateString('en-GB'),
        itemName: document.getElementById('item-name').value,
        quantity: qty,
        buyPlatform: document.getElementById('buy-platform').value,
        buyPrice: bPrice,
        buyFee: bFee,
        sellPlatform: document.getElementById('sell-platform').value,
        sellPrice: sPrice,
        fee: sFee,
        netProfit: netProfit,
        currency: document.getElementById('currency').value
    };

    await fetch('api.php', { method: 'POST', body: JSON.stringify(data) });
    document.getElementById('trade-form').reset();
    document.getElementById('quantity').value = "1";
    fetchTrades();
});

window.deleteTrade = async (id) => {
    if(confirm('Void this transaction?')) {
        await fetch('api.php', { method: 'DELETE', body: JSON.stringify({id}) });
        fetchTrades();
    }
}

fetchTrades();
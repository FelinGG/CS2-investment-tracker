const platformFees = {
    'CSFloat': { buy: 0, sell: 2.0 },
    'BUFF163': { buy: 0, sell: 2.5 },
    'Steam': { buy: 0, sell: 15.0 },
    'Skinport': { buy: 0, sell: 12.0 },
    'SkinBid': { buy: 0, sell: 10.0 },
    'DMarket': { buy: 0, sell: 7.0 },
    'Custom': { buy: 0, sell: 0 }
};

let trades = [];

// Handle auto-fee calculation
document.getElementById('buy-platform').addEventListener('change', (e) => {
    document.getElementById('buy-fee').value = platformFees[e.target.value].buy;
});

document.getElementById('sell-platform').addEventListener('change', (e) => {
    document.getElementById('sell-fee').value = platformFees[e.target.value].sell;
});

async function fetchTrades() {
    const res = await fetch('api.php');
    trades = await res.json();
    updateUI();
}

function updateUI() {
    const tbody = document.getElementById('trades-body');
    tbody.innerHTML = '';
    
    let totalProfit = 0;
    let totalInvested = 0;

    trades.forEach(t => {
        const profit = parseFloat(t.net_profit);
        const buy = parseFloat(t.buy_price);
        const buyFee = parseFloat(t.buy_fee);
        const symbol = t.currency === 'USD' ? '$' : 'zł';
        
        totalProfit += profit;
        totalInvested += (buy + (buy * (buyFee / 100)));

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${t.trade_date}</td>
            <td><strong>${t.item_name}</strong></td>
            <td>${buy.toFixed(2)} ${symbol}<small>${t.buy_platform} (${buyFee}%)</small></td>
            <td>${parseFloat(t.sell_price).toFixed(2)} ${symbol}<small>${t.sell_platform} (${t.fee}%)</small></td>
            <td class="${profit >= 0 ? 'profit' : 'loss'}"><strong>${profit >= 0 ? '+' : ''}${profit.toFixed(2)} ${symbol}</strong></td>
            <td><button class="delete-btn" onclick="deleteTrade(${t.id})">Del</button></td>
        `;
        tbody.appendChild(row);
    });

    document.getElementById('total-profit').textContent = totalProfit.toFixed(2);
    document.getElementById('total-profit').className = totalProfit >= 0 ? 'profit' : 'loss';
    document.getElementById('total-trades').textContent = trades.length;
    
    const roi = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;
    document.getElementById('total-roi').textContent = roi.toFixed(2) + ' %';
}

document.getElementById('trade-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const bPrice = parseFloat(document.getElementById('buy-price').value);
    const bFee = parseFloat(document.getElementById('buy-fee').value);
    const sPrice = parseFloat(document.getElementById('sell-price').value);
    const sFee = parseFloat(document.getElementById('sell-fee').value);
    
    const netProfit = (sPrice - (sPrice * sFee/100)) - (bPrice + (bPrice * bFee/100));

    const data = {
        date: new Date().toLocaleDateString('en-GB'),
        itemName: document.getElementById('item-name').value,
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
    document.getElementById('currency').value = "PLN";
    fetchTrades();
});

window.deleteTrade = async (id) => {
    if(confirm('Delete this record?')) {
        await fetch('api.php', { method: 'DELETE', body: JSON.stringify({id}) });
        fetchTrades();
    }
}

fetchTrades();
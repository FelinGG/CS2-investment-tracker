const platformFees = {
    'CSFloat': { buy: 0, sell: 2.0 },
    'BUFF163': { buy: 0, sell: 2.5 },
    'Steam': { buy: 0, sell: 15.0 },
    'Skinport': { buy: 0, sell: 12.0 },
    'Custom': { buy: 0, sell: 0 }
};

document.getElementById('buy-platform').addEventListener('change', (e) => {
    document.getElementById('buy-fee').value = platformFees[e.target.value]?.buy || 0;
});

document.getElementById('sell-platform').addEventListener('change', (e) => {
    document.getElementById('sell-fee').value = platformFees[e.target.value]?.sell || 0;
});

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
                <strong>${t.item_name}</strong> <span class="qty-tag">x${qty}</span>
                <small>${t.trade_date}</small>
            </td>
            <td>${buy.toFixed(2)} ${symbol}<small>${t.buy_platform}</small></td>
            <td>${parseFloat(t.sell_price).toFixed(2)} ${symbol}<small>${t.sell_platform}</small></td>
            <td class="${profit >= 0 ? 'profit' : 'loss'}">
                <strong>${profit >= 0 ? '+' : ''}${profit.toFixed(2)} ${symbol}</strong>
            </td>
            <td><button class="delete-btn" onclick="deleteTrade(${t.id})">Remove</button></td>
        `;
        tbody.appendChild(row);
    });

    const profitEl = document.getElementById('total-profit');
    profitEl.textContent = totalProfit.toFixed(2);
    profitEl.className = totalProfit >= 0 ? 'profit-text' : 'loss';
    
    document.getElementById('total-trades').textContent = totalItems;
    document.getElementById('total-roi').textContent = totalInvested > 0 ? ((totalProfit / totalInvested) * 100).toFixed(2) + '%' : '0%';
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
    if(confirm('Delete this transaction?')) {
        await fetch('api.php', { method: 'DELETE', body: JSON.stringify({id}) });
        fetchTrades();
    }
}

fetchTrades();
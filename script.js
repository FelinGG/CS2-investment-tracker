// Platform fee database
const platformFees = {
    'BUFF163': { buy: 0, sell: 2.5 },
    'Steam': { buy: 0, sell: 15.0 },
    'Skinport': { buy: 0, sell: 12.0 },
    'SkinBid': { buy: 0, sell: 10.0 },
    'DMarket': { buy: 0, sell: 7.0 },
    'Custom': { buy: 0, sell: 0 }
};

let trades = [];

// Auto-fill Logic
document.getElementById('buy-platform').addEventListener('change', (e) => {
    const platform = e.target.value;
    document.getElementById('buy-fee').value = platformFees[platform].buy;
});

document.getElementById('sell-platform').addEventListener('change', (e) => {
    const platform = e.target.value;
    document.getElementById('sell-fee').value = platformFees[platform].sell;
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
        const buyPrice = parseFloat(t.buy_price);
        const buyFee = parseFloat(t.buy_fee);
        const sellPrice = parseFloat(t.sell_price);
        const sellFee = parseFloat(t.fee);
        const symbol = t.currency === 'USD' ? '$' : 'zł';
        
        totalProfit += profit;
        totalInvested += (buyPrice + (buyPrice * (buyFee / 100)));

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${t.trade_date}</td>
            <td><strong>${t.item_name}</strong></td>
            <td>${buyPrice.toFixed(2)} ${symbol}<br><small>${t.buy_platform} (${buyFee}%)</small></td>
            <td>${sellPrice.toFixed(2)} ${symbol}<br><small>${t.sell_platform} (${sellFee}%)</small></td>
            <td>${((buyPrice * buyFee/100) + (sellPrice * sellFee/100)).toFixed(2)} ${symbol}</td>
            <td class="${profit >= 0 ? 'profit' : 'loss'}"><strong>${profit >= 0 ? '+' : ''}${profit.toFixed(2)} ${symbol}</strong></td>
            <td><button class="delete-btn" onclick="deleteTrade(${t.id})">Del</button></td>
        `;
        tbody.appendChild(row);
    });

    const profitEl = document.getElementById('total-profit');
    profitEl.textContent = totalProfit.toFixed(2);
    profitEl.className = totalProfit >= 0 ? 'profit' : 'loss';
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
    
    // Formula: (Sell - SalesFee) - (Buy + BuyFee)
    const totalCost = bPrice + (bPrice * (bFee / 100));
    const totalRevenue = sPrice - (sPrice * (sFee / 100));
    const netProfit = totalRevenue - totalCost;

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

    await fetch('api.php', { 
        method: 'POST', 
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data) 
    });
    
    document.getElementById('trade-form').reset();
    document.getElementById('currency').value = "PLN";
    document.getElementById('buy-fee').value = "0";
    document.getElementById('sell-fee').value = "0";
    fetchTrades();
});

window.deleteTrade = async (id) => {
    if(confirm('Delete record?')) {
        await fetch('api.php', { 
            method: 'DELETE', 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({id}) 
        });
        fetchTrades();
    }
}

fetchTrades();
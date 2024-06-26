window.addEventListener('DOMContentLoaded', (event) => {
    const startFarmingButton = document.getElementById('start-farming-button');
    const balanceElement = document.getElementById('balance-amount');

    // Retrieve the user's balance from the database on load
    const userId = Telegram.WebApp.initDataUnsafe.user.id;
    fetch(`get_balance.php?user_id=${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                balanceElement.textContent = data.balance;
            } else {
                console.error('Error fetching balance:', data.error);
            }
        })
        .catch(error => console.error('Error fetching balance:', error));

    // Check if the user has already started farming within the last 24 hours
    const lastFarmingTime = localStorage.getItem('lastFarmingTime');
    if (lastFarmingTime && new Date().getTime() - new Date(lastFarmingTime).getTime() < 24 * 60 * 60 * 1000) {
        startFarmingButton.disabled = true;
        startFarmingButton.textContent = 'Farming in progress...';
    }

    startFarmingButton.addEventListener('click', () => {
        startFarming();
    });
});

function startFarming() {
    const button = document.getElementById('start-farming-button');
    const balanceElement = document.getElementById('balance-amount');
    let balance = parseInt(balanceElement.textContent);
    let farmedAmount = 0;

    button.disabled = true; // Disable the button to prevent multiple clicks
    button.textContent = 'Farming in progress...';

    const farmingInterval = setInterval(() => {
        const reward = 100; // 100 tokens per minute
        farmedAmount += reward;
        balanceElement.textContent = balance + farmedAmount;
    }, 60000); // 1 minute

    setTimeout(() => {
        clearInterval(farmingInterval);
        balance += farmedAmount;
        balanceElement.textContent = balance;
        uploadBalance(balance);
        button.disabled = false; // Enable the button after 24 hours
        button.textContent = 'Start Farming';
        localStorage.setItem('lastFarmingTime', new Date().toISOString());
    }, 12 * 60 * 60 * 1000); // 12 hours

    // Update button text to show the farming amount
    button.textContent = 'Farming...';
}

function uploadBalance(balance) {
    const userId = Telegram.WebApp.initDataUnsafe.user.id;

    fetch('update_balance.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id: userId, balance: balance })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            alert('Balance updated successfully!');
        } else {
            console.error('Error updating balance:', data.error);
        }
    })
    .catch(error => console.error('Error uploading balance:', error));
}

document.addEventListener('DOMContentLoaded', () => {
    const taskButtons = document.querySelectorAll('.task-button');
    const popup = document.getElementById('popup');
    const popupMessage = document.getElementById('popup-message');
    const popupClose = document.getElementById('popup-close');

    if (taskButtons) {
        taskButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const task = event.target.dataset.task;
                const taskElement = event.target.parentElement;
                const link = taskElement.dataset.link;

                window.open(link, '_blank');

                event.target.innerHTML = '<div class="spinner" style="width: 20px; height: 20px;"></div>';

                setTimeout(() => {
                    const user = Telegram.WebApp.initDataUnsafe.user;
                    if (user && user.id) {
                        fetch('/complete_task', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ user_id: user.id, task: task })
                        })
                        .then(response => response.json())
                        .then(data => {
                            if (data.success) {
                                taskElement.querySelector('.status').textContent = '✔️';
                                taskElement.classList.add('completed');
                                event.target.style.display = 'none';
                                updateBalance(1000);
                            } else {
                                popupMessage.textContent = 'Task not completed. Please try again.';
                                popup.style.display = 'block';
                                event.target.textContent = 'Retry';
                            }
                        })
                        .catch(error => {
                            console.error('Error:', error);
                            popupMessage.textContent = 'Error completing task. Please try again.';
                            popup.style.display = 'block';
                            event.target.textContent = 'Retry';
                        });
                    }
                }, 3000);
            });
        });
    }

    if (popupClose) {
        popupClose.addEventListener('click', () => {
            popup.style.display = 'none';
        });
    }

    function updateBalance(points) {
        const balanceElement = document.getElementById('balance-amount');
        if (balanceElement) {
            balanceElement.textContent = parseInt(balanceElement.textContent) + points;
        }
    }

    function loadUserProfile() {
        const profileContainer = document.getElementById('profile-container');
        const profilePicture = document.getElementById('profile-picture');
        const usernameElement = document.getElementById('username');
        const user = Telegram.WebApp.initDataUnsafe.user;

        if (user) {
            if (profilePicture) {
                profilePicture.src = user.photo_url || '';
            }
            if (usernameElement) {
                usernameElement.textContent = user.username || 'Unknown User';
            }
            const loadingContainer = document.getElementById('loading-container');
            const headerContainer = document.getElementById('header-container');
            const taskBar = document.getElementById('task-bar');

            if (loadingContainer) loadingContainer.style.display = 'none';
            if (headerContainer) headerContainer.style.display = 'block';
            if (taskBar) taskBar.style.display = 'block';
        }
    }

    loadUserProfile();
});

window.addEventListener('DOMContentLoaded', (event) => {
    Telegram.WebApp.ready();

    const user = Telegram.WebApp.initDataUnsafe.user;
    if (user && user.id) {
        getProfilePicture(user.id);
        setUsername(user.username);
    }

    Telegram.WebApp.expand();
});

function getProfilePicture(userId) {
    fetch(`/get_profile_picture?user_id=${userId}`)
        .then(response => response.json())
        .then(data => {
            if (data.photo_url) {
                const profileImage = document.getElementById('profile-picture');

                profileImage.onload = () => {
                    const loadingContainer = document.getElementById('loading-container');
                    const headerContainer = document.getElementById('header-container');
                    const farmingCard = document.getElementById('farming-card');
                    const startFarmingButton = document.getElementById('start-farming-button');

                    if (loadingContainer) loadingContainer.style.display = 'none';
                    if (headerContainer) headerContainer.style.display = 'flex';
                    if (farmingCard) farmingCard.style.display = 'flex';
                    if (startFarmingButton) startFarmingButton.style.display = 'block';
                    loadLottieAnimation();
                };
                
                profileImage.src = data.photo_url;
            } else {
                throw new Error('Failed to get profile picture');
            }
        })
        .catch(error => console.error('Error fetching profile picture:', error));
}

function setUsername(username) {
    if (username) {
        const usernameElement = document.getElementById('username');
        if (usernameElement) {
            usernameElement.textContent = username;
        }
    }
}

function loadLottieAnimation() {
    const lottieContainer = document.getElementById('lottie-animation');
    if (lottieContainer) {
        lottie.loadAnimation({
            container: lottieContainer,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'farm.json'
        });
    }
}

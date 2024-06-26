// loader.js
document.addEventListener('DOMContentLoaded', () => {
    const loadingContainer = document.getElementById('loading-container');

    // Show the loading skeleton initially
    if (loadingContainer) {
        loadingContainer.style.display = 'flex';
    }

    // Fetch the profile picture and wait for it to load
    function fetchProfilePicture() {
        return new Promise((resolve, reject) => {
            const user = Telegram.WebApp.initDataUnsafe.user;
            if (user && user.id) {
                fetch(`/get_profile_picture?user_id=${user.id}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.photo_url) {
                            const profileImage = document.getElementById('profile-picture');
                            profileImage.onload = () => {
                                resolve();
                            };
                            profileImage.onerror = () => {
                                reject(new Error('Failed to load profile picture'));
                            };
                            profileImage.src = data.photo_url;
                        } else {
                            reject(new Error('Failed to get profile picture'));
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching profile picture:', error);
                        reject(error);
                    });
            } else {
                reject(new Error('User not found'));
            }
        });
    }

    // Fetch other necessary data (if any)
    function fetchOtherData() {
        // Simulate fetching other data
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 1000);
        });
    }

    // Wait for all asynchronous operations to complete
    function waitForResources() {
        return Promise.all([
            new Promise(resolve => {
                if (document.readyState === 'complete') {
                    resolve();
                } else {
                    window.addEventListener('load', resolve);
                }
            }),
            fetchProfilePicture(),
            fetchOtherData() // Add other necessary data fetching functions here
        ]);
    }

    // Start waiting for resources
    waitForResources().then(() => {
        // Hide the loading skeleton once all resources are loaded
        if (loadingContainer) {
            loadingContainer.style.display = 'none';
        }
        // Show the main content
        document.getElementById('header-container').style.display = 'flex';
        document.getElementById('task-bar').style.display = 'flex';
    }).catch(error => {
        console.error('Error during loading:', error);
        // Optionally handle errors (e.g., show an error message to the user)
        if (loadingContainer) {
            loadingContainer.style.display = 'none';
        }
    });
});

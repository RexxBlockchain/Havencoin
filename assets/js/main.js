document.addEventListener("DOMContentLoaded", function() {
    if (window.Telegram.WebApp) {
        Telegram.WebApp.ready();

        // Theme management
        function setThemeClass() {
            document.documentElement.className = Telegram.WebApp.colorScheme;
        }
        Telegram.WebApp.onEvent('themeChanged', setThemeClass);
        setThemeClass();

        // Initialize Telegram WebApp
        var initDataUnsafe = Telegram.WebApp.initDataUnsafe || {};

        if (initDataUnsafe.user && initDataUnsafe.user.id) {
            // Avoid continuous reloads
            if (!window.location.search.includes('user_id=' + initDataUnsafe.user.id)) {
                window.location.href = window.location.pathname + "?user_id=" + initDataUnsafe.user.id;
            }
        }

        // More functionality as needed
        $('#main_btn').toggle(!!initDataUnsafe.query_id);
        $('#with_webview_btn').toggle(!!initDataUnsafe.query_id && !initDataUnsafe.receiver);
        $('#webview_data').html(JSON.stringify(initDataUnsafe, null, 2));
        $('#theme_data').html(JSON.stringify(Telegram.WebApp.themeParams, null, 2));
        $('#regular_link').attr('href', $('#regular_link').attr('href') + location.hash);
        $('#text_field').focus();
        if (initDataUnsafe.query_id && initData) {
            $('#webview_data_status').show();
        }
        $('body').css('visibility', '');
        Telegram.WebApp.MainButton
            .setText('CLOSE WEBVIEW')
            .show()
            .onClick(function () {
                webviewClose();
            });

        // Additional scripts for device features like location, media access, etc.
    }

    // Display user profile picture or message
    if (userProfilePic && !userProfilePic.startsWith('User profile picture not available')) {
        document.getElementById('profile-pic').src = "https://api.telegram.org/file/bot" + TELEGRAM_BOT_TOKEN + "/" + userProfilePic;
    } else {
        document.getElementById('profile-pic-message').textContent = userProfilePic;
    }
});

function webviewExpand() {
    Telegram.WebApp.expand();
}

function webviewClose() {
    Telegram.WebApp.close();
}

function toggleMainButton(el) {
    var mainButton = Telegram.WebApp.MainButton;
    if (mainButton.isVisible) {
        mainButton.hide();
        el.innerHTML = 'Show Main Button';
    } else {
        mainButton.show();
        el.innerHTML = 'Hide Main Button';
    }
}

// More functions can be added as needed for interactivity and handling of the Telegram Mini App

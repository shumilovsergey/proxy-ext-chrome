document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.getElementById('toggle');
    const settingsIcon = document.getElementById('settingsIcon');
    const settingsPanel = document.getElementById('settingsPanel');
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');
    const redirectBtn = document.getElementById('redirectBtn'); // New Button
    const proxyUrlInput = document.getElementById('proxyUrl');
    const proxyPortInput = document.getElementById('proxyPort');

    // Load stored values
    chrome.storage.sync.get(['isEnabled', 'proxyUrl', 'proxyPort'], function(data) {
        toggle.checked = data.isEnabled || false;
        proxyUrlInput.value = data.proxyUrl || 'mytube.sh-development.ru';
        proxyPortInput.value = data.proxyPort || 8888;

        if (toggle.checked) {
            toggle.nextElementSibling.style.backgroundColor = "green";
        }
    });

    // Toggle proxy on/off
    toggle.addEventListener('change', function() {
        const isEnabled = toggle.checked;
        chrome.storage.sync.set({ isEnabled: isEnabled }, function() {
            chrome.runtime.sendMessage({ action: 'toggleProxy', isEnabled: isEnabled });
            toggle.nextElementSibling.style.backgroundColor = isEnabled ? "green" : "grey";
        });
    });

    // Show/Hide settings panel
    settingsIcon.addEventListener('click', function() {
        settingsPanel.classList.toggle('hidden');
    });

    // Save proxy settings
    saveSettingsBtn.addEventListener('click', function() {
        const proxyUrl = proxyUrlInput.value;
        const proxyPort = proxyPortInput.value;

        chrome.storage.sync.set({ proxyUrl: proxyUrl, proxyPort: proxyPort }, function() {
            alert('Settings saved');
            settingsPanel.classList.add('hidden');
        });
    });

    // Redirect to the specified URL
    redirectBtn.addEventListener('click', function() {
        chrome.tabs.create({ url: 'https://sh-development.ru' });
    });
});

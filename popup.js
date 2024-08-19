document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.getElementById('toggle');
    const settingsIcon = document.getElementById('settingsIcon');
    const settingsPanel = document.getElementById('settingsPanel');
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');
    const redirectBtn = document.getElementById('redirectBtn');
    const proxyUrlInput = document.getElementById('proxyUrl');
    const proxyPortInput = document.getElementById('proxyPort');

    chrome.storage.sync.get(['isEnabled', 'proxyUrl', 'proxyPort'], function(data) {
        toggle.checked = data.isEnabled || false;
        proxyUrlInput.value = data.proxyUrl || 'mytube.sh-development.ru';
        proxyPortInput.value = data.proxyPort || 80;

        if (toggle.checked) {
            toggle.nextElementSibling.style.backgroundColor = "green";
        }
    });

    toggle.addEventListener('change', function() {
        const isEnabled = toggle.checked;
        const proxyUrl = proxyUrlInput.value;
        const proxyPort = proxyPortInput.value;

        chrome.storage.sync.set({ isEnabled: isEnabled }, function() {
            chrome.runtime.sendMessage({ action: 'toggleProxy', isEnabled: isEnabled, proxyUrl: proxyUrl, proxyPort: proxyPort });
            toggle.nextElementSibling.style.backgroundColor = isEnabled ? "green" : "grey";
        });
    });

    settingsIcon.addEventListener('click', function() {
        settingsPanel.classList.toggle('hidden');
    });

    saveSettingsBtn.addEventListener('click', function() {
        const proxyUrl = proxyUrlInput.value;
        const proxyPort = proxyPortInput.value;

        chrome.storage.sync.set({ proxyUrl: proxyUrl, proxyPort: proxyPort }, function() {
            alert('Settings saved');
            settingsPanel.classList.add('hidden');
        });
    });

    redirectBtn.addEventListener('click', function() {
        chrome.tabs.create({ url: 'https://sh-development.ru' });
    });
});

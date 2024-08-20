chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'toggleProxy') {
        chrome.storage.sync.get(['proxyUrl', 'proxyPort'], function(data) {
            if (request.isEnabled) {
                const proxyConfig = {
                    mode: "fixed_servers",
                    rules: {
                        singleProxy: {
                            scheme: "http",
                            host: data.proxyUrl || "mytube.sh-development.ru",
                            port: parseInt(data.proxyPort) || 80
                        },
                        bypassList: []
                    }
                };
                chrome.proxy.settings.set({ value: proxyConfig, scope: 'regular' }, function() {
                    console.log('Proxy enabled');
                });
            } else {
                chrome.proxy.settings.clear({ scope: 'regular' }, function() {
                    console.log('Proxy disabled');
                });
            }
        });
    }
});

// Initialize proxy setting based on stored value on extension load
chrome.runtime.onStartup.addListener(function() {
    chrome.storage.sync.get(['isEnabled', 'proxyUrl', 'proxyPort'], function(data) {
        if (data.isEnabled) {
            const proxyConfig = {
                mode: "fixed_servers",
                rules: {
                    singleProxy: {
                        scheme: "http",
                        host: data.proxyUrl || "mytube.sh-development.ru",
                        port: parseInt(data.proxyPort) || 80
                    },
                    bypassList: []
                }
            };
            chrome.proxy.settings.set({ value: proxyConfig, scope: 'regular' }, function() {
                console.log('Proxy enabled on startup');
            });
        } else {
            chrome.proxy.settings.clear({ scope: 'regular' }, function() {
                console.log('Proxy disabled on startup');
            });
        }
    });
});

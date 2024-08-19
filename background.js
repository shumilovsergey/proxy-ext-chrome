chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'toggleProxy') {
        const isEnabled = request.isEnabled;
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            const activeTab = tabs[0];
            const url = new URL(activeTab.url);
            const hostname = url.hostname;

            if (isEnabled && hostname.includes('tube')) {
                chrome.proxy.settings.set(
                    { value: {
                        mode: 'fixed_servers',
                        rules: {
                            singleProxy: {
                                scheme: 'http',
                                host: request.proxyUrl,
                                port: parseInt(request.proxyPort)
                            },
                            bypassList: []
                        }
                    }, scope: 'regular' },
                    function() {
                        console.log('Proxy enabled for YouTube');
                    }
                );
            } else {
                chrome.proxy.settings.clear({ scope: 'regular' }, function() {
                    console.log('Proxy disabled or not on YouTube');
                });
            }
        });
    }
});

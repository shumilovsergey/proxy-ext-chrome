chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'toggleProxy') {
        if (request.isEnabled) {

            const config = {
                mode: 'pac_script',
                pacScript: {
                    data: `
                        function FindProxyForURL(url, host) {
                            if (dnsDomainIs(host, 'youtube.com') || 
                                dnsDomainIs(host, 'www.youtube.com') || 
                                dnsDomainIs(host, 'youtu.be')) {
                                return 'PROXY ${request.proxyUrl}:${request.proxyPort}';
                            }
                            return 'DIRECT';
                        }
                    `
                }
            };
            chrome.proxy.settings.set(
                { value: config, scope: 'regular' },
                function() { console.log('Proxy settings updated for YouTube'); }
            );
        } else {

            chrome.proxy.settings.set(
                { value: { mode: 'direct' }, scope: 'regular' },
                function() { console.log('Proxy disabled'); }
            );
        }
    }
});

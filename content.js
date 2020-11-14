

'use strict';
//"Facebook: username:user132 Password: Password123"
// Simple extension to remove 'Cookie' request header and 'Set-Cookie' response
// header.
var views = chrome.extension.getViews({
    type: "popup"
});
for (var i = 0; i < views.length; i++) {
    views[i].document.getElementById('x').innerHTML = "My Custom Value";
}
function removeHeader(headers, name) {
    for (var i = 0; i < headers.length; i++) {
        if (headers[i].name.toLowerCase() == name) {
            console.log('Removing "' + name + '" header.');
            headers.splice(i, 1);
            break;

        }
    }
}

chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        if (details.requestBody && details.requestBody.raw) {
            var requestBodynice = details.requestBody.raw.map(function(data) {
                return decodeURIComponent(String.fromCharCode.apply(null, new Uint8Array(data.bytes)));
            }).join('')}
        console.log(requestBodynice);

        return {requestHeaders: details.requestHeaders};
    },
    // filters
    {urls: ['https://*/*', 'http://*/*']},
    // extraInfoSpec
    ['requestBody']);

chrome.webRequest.onHeadersReceived.addListener(
    function(details) {
        return {responseHeaders: details.responseHeaders};
    },
    // filters
    {urls: ['https://*/*', 'http://*/*']},
    // extraInfoSpec
    ['blocking', 'responseHeaders', 'extraHeaders']);


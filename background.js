var loading = false;

chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({"state": true});
    chrome.storage.sync.set({"sites": {"login": true}});
    chrome.storage.sync.set({"colors": {"background": "#000000",
                                        "widgetbackground": "#202020",
                                        "selected": "#353535",
                                        "lines": "#999999",
                                        "accent": "#0077ff",
                                        "accent2": "#00ccff",
                                        "textaccent": "#ffffff",
                                        "text": "#eeeeee",
                                        "title": "#0084ff",
                                        "link": "#00bbff",
                                        "linkvisited": "#0095ff"}});
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

// Page refresh listener
chrome.tabs.onActiveChanged.addListener(function (tabId, slectInfo) {
    chrome.tabs.getSelected(null, function(tab) {
        changecss(tab);
    });
});

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

// Storage listener
chrome.storage.onChanged.addListener(function(changes, namespace) {
    chrome.tabs.getSelected(null, function(tab) {        
        if (changes.login) {
            if (tab.url.includes("://elosp.ugent.be/") || tab.url.includes("://login.ugent.be/")) {
                changecss(tab);
            }
        } else {
            changecss(tab);
        }
    });
});

// Apply/remove css
function changecss(tab) {
    if (tab.url && tab.url.includes("://ufora.ugent.be/")) {
        chrome.tabs.removeCSS({ file: "ufora.css" });
        chrome.storage.sync.get("state", function(result){
            if (result.state) {
                chrome.tabs.insertCSS({ file: "ufora.css" });
                cssScript(tab);
            }
        });  
    }
    
    else if (tab.url && tab.url.includes("://elosp.ugent.be/")) {
        chrome.tabs.removeCSS({ file: "elosp.css" });
        chrome.storage.sync.get(["state", "sites"], function(result){
            if (result.state && result.sites.login) {
                chrome.tabs.insertCSS({ file: "elosp.css" });
                cssScript(tab);
            }
        }); 
    }

    else if (tab.url && (tab.url.includes("://login.ugent.be/"))) {
        chrome.tabs.removeCSS({ file: "login.css" });
        chrome.storage.sync.get(["state", "sites"], function(result){
            if (result.state && result.sites.login) {
                chrome.tabs.insertCSS({ file: "login.css" });
                cssScript(tab);
            }
        }); 
    }
}

function cssScript(tab) {
    // Accoutninstellingen - background    
    chrome.storage.sync.get("colors", function(result) {
        if (tab.url.includes("://ufora.ugent.be/d2l/lp/preferences")){
            chrome.tabs.executeScript({
                code: 'var all = document.getElementsByClassName("dco_c"); for (var i = 0; i < all.length; i++) { all[i].style.backgroundColor = "#202020"; }'
            });
        } 
        // if (tab.url.includes("://ufora.ugent.be/d2l/le/calendar")){
        //     chrome.tabs.executeScript({
        //         code: 'var all = document.getElementsByClassName("d2l-le-calendar-today"); for (var i = 0; i < all.length; i++) { all[i] = document.createElement("style"); all[i].type = "text/css"; all[i].id = "styles_js"; document.getElementsByTagName("head")[0].appendChild(all[i]); all[i].appendChild(document.createTextNode(".d2l-le-calendar-today {background-color: red !important;}")); }'
        //     });
        // } 

        // witte vakken bij vakken verwijderen
        chrome.tabs.executeScript({
            code: "var elements = document.getElementsByClassName('d2l-widget d2l-tile d2l-widget-padding-full'); while(elements.length > 0){ elements[0].parentNode.removeChild(elements[0]);}"
        });
        var command = "var r = document.querySelector(':root'); "; 
        command += "r.style.setProperty('--background','" + result.colors.background + "');";
        command += "r.style.setProperty('--widget-background','" + result.colors.widgetbackground + "');";
        command += "r.style.setProperty('--selected','" + result.colors.selected + "');";
        command += "r.style.setProperty('--lines','" + result.colors.lines + "');";
        command += "r.style.setProperty('--accent','" + result.colors.accent + "');";
        command += "r.style.setProperty('--accent2','" + result.colors.accent2 + "');";
        command += "r.style.setProperty('--text-accent','" + result.colors.textaccent + "');";
        command += "r.style.setProperty('--text','" + result.colors.text + "');";
        command += "r.style.setProperty('--text-title','" + result.colors.title + "');";
        command += "r.style.setProperty('--text-link','" + result.colors.link + "');";
        command += "r.style.setProperty('--text-link-visited','" + result.colors.linkvisited + "');";
        command += "r.style.setProperty('--d2l-dropdown-background-color,','" + result.colors.widgetbackground + "');";
        chrome.tabs.executeScript({
            code: command
        });
    }); 
}

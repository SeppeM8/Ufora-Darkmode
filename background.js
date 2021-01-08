var loading = false;
var dark = {};

var siteCSS = {"login.ugent.be" : "login.css", "elosp.ugent.be": "elosp.css", "ufora.ugent.be": "ufora.css"};
var sites = ["://login.ugent.be/", "://elosp.ugent.be/", "://ufora.ugent.be/"];


function siteToCSS (site) {
    var subSite = site.replace(/http[s]{0,1}:\/\/([^\/]*)\/.*$/, "$1");
    return siteCSS[subSite];
}

chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({"state": true});
    chrome.storage.sync.set({"sites": {"login": false}});
    chrome.storage.sync.set({"colors": {"background": "#000000",
                                        "widgetbackground": "#202020",
                                        "selected": "#353535",
                                        "accent": "#0077ff",
                                        "accent2": "#00ccff",
                                        "textaccent": "#ffffff",
                                        "text": "#eeeeee",
                                        "title": "#0084ff",
                                        "link": "#00bbff",
                                        "linkvisited": "#0095ff"}});
    
});

// Page refresh listener
// chrome.tabs.onActiveChanged.addListener(function (tabId, selectInfo) {
//     chrome.tabs.getSelected(null, function(tab) {
//         changecss(tab);
//     });
// });

var loadingTabs = {};

chrome.tabs.onUpdated.addListener(function(tabId, info, tab) {
    if (info.status === "loading" && ! loadingTabs[tabId]) {
        loadingTabs[tabId] = siteToCSS(tab.url);
        delete dark[tabId];
        changecss();
    }
    else if (info.status === "complete") {
        if (loadingTabs[tabId] !== siteToCSS(tab.url)) { // ufora kan doorsturen naar login -> .css moet verandert worden
            removeCSS(tab, loadingTabs[tabId]);
            changecss();
        }
        delete loadingTabs[tabId];
    }
});

// Storage listener
chrome.storage.onChanged.addListener(function(changes, namespace) {
    if (changes.sites) {
        chrome.windows.getAll({populate:true},function(windows){
            windows.forEach(function(window){
                window.tabs.forEach(function(tab){
                    var css = siteToCSS(tab.url);
                    if (css && css !== "ufora.css") {
                        if (changes.sites.newValue.login) {
                            changecss();
                        } else {
                            removeCSS(tab, css);
                            delete dark[tab.id];
                        }
                    }
                });
            });
        });
    } else {
        removeAllCSS();
        changecss();
    }
});

function changecss() {    
    chrome.storage.sync.get(["state", "sites"], function(result){
        if (! result.state) {
            removeAllCSS();
        } else {
            chrome.windows.getAll({populate:true},function(windows){
                windows.forEach(function(window){
                    window.tabs.forEach(function(tab){
                        if (! (tab.id in dark)) {
                            var css = siteToCSS(tab.url);
                            if (css && (result.sites.login || css === "ufora.css")) {
                                removeCSS(tab, css);
                                addCSS(tab, css);
                            }
                        }
                    });
                });
            });
        }
    });
}

// Verwijder de toegevoegde .css voor alle tabs
function removeAllCSS() {
    chrome.windows.getAll({populate:true},function(windows){
        windows.forEach(function(window){
            window.tabs.forEach(function(tab){
                var css = siteToCSS(tab.url);
                if (css) {
                    removeCSS(tab, css);
                }
            });
        });
    });
}

// Voeg gegeven css file toe aan de gegeven tab
function addCSS(tab, cssFile) {
    chrome.tabs.insertCSS(tab.id, { file: cssFile}, _=>chrome.runtime.lastError);
    cssScript(tab);
    dark[tab.id] = cssFile;
}

// Verwijder gegeven css file van gegeven tab
function removeCSS(tab, cssFile) {
    chrome.tabs.removeCSS(tab.id, { file: cssFile}, _=>chrome.runtime.lastError);
    delete dark[tab.id];
}

function cssScript(tab) {
    // Accoutninstellingen - background    
    chrome.storage.sync.get("colors", function(result) {
        if (tab.url.includes("://ufora.ugent.be/d2l/lp/preferences")){
            chrome.tabs.executeScript(tab.id, {
                code: 'var all = document.getElementsByClassName("dco_c"); for (var i = 0; i < all.length; i++) { all[i].style.backgroundColor = "#202020"; }'
            }, _=>chrome.runtime.lastError);
        } 
        // if (tab.url.includes("://ufora.ugent.be/d2l/le/calendar")){
        //     chrome.tabs.executeScript({
        //         code: 'var all = document.getElementsByClassName("d2l-le-calendar-today"); for (var i = 0; i < all.length; i++) { all[i] = document.createElement("style"); all[i].type = "text/css"; all[i].id = "styles_js"; document.getElementsByTagName("head")[0].appendChild(all[i]); all[i].appendChild(document.createTextNode(".d2l-le-calendar-today {background-color: red !important;}")); }'
        //     });
        // } 

        // witte vakken bij vakken verwijderen
        chrome.tabs.executeScript(tab.id, {
            code: "var elements = document.getElementsByClassName('d2l-widget d2l-tile d2l-widget-padding-full'); while(elements.length > 0){ elements[0].parentNode.removeChild(elements[0]);}"
        }, _=>chrome.runtime.lastError);
        var command = "var r = document.querySelector(':root'); "; 
        command += "r.style.setProperty('--background','" + result.colors.background + "');";
        command += "r.style.setProperty('--widget-background','" + result.colors.widgetbackground + "');";
        command += "r.style.setProperty('--selected','" + result.colors.selected + "');";
        command += "r.style.setProperty('--accent','" + result.colors.accent + "');";
        command += "r.style.setProperty('--accent2','" + result.colors.accent2 + "');";
        command += "r.style.setProperty('--text-accent','" + result.colors.textaccent + "');";
        command += "r.style.setProperty('--text','" + result.colors.text + "');";
        command += "r.style.setProperty('--text-title','" + result.colors.title + "');";
        command += "r.style.setProperty('--text-link','" + result.colors.link + "');";
        command += "r.style.setProperty('--text-link-visited','" + result.colors.linkvisited + "');";
        //command += "r.style.setProperty('--d2l-dropdown-background-color','" + result.colors.widgetbackground + "');";
        chrome.tabs.executeScript(tab.id, {
            code: command
        }, _=>chrome.runtime.lastError);
    }); 
}

var loading = false;
var dark = {};

var siteCSS = {"login.ugent.be" : "login.css", "elosp.ugent.be": "elosp.css", "ufora.ugent.be": "ufora.css"};
var sites = ["://login.ugent.be/", "://elosp.ugent.be/", "://ufora.ugent.be/"];


function siteToCSS (site) {
    var subSite = site.replace(/http[s]{0,1}:\/\/([^\/]*)\/.*$/, "$1");
    return siteCSS[subSite];
}

chrome.runtime.onInstalled.addListener(function(details) {
    if (details.reason == "update") {
        if (details.previousVersion === "0.1") {
            chrome.storage.sync.remove("state");
        }
        chrome.storage.sync.remove("sites");
    }

    // Als waardes niet bestaan: aanmaken
    chrome.storage.sync.get({   "colors":{  "accent":"#0077ff",
                                            "accent2":"#00ccff",
                                            "background":"#000000",
                                            "link":"#00bbff",
                                            "linkvisited":"#1279d3",
                                            "selected":"#353535",
                                            "text":"#eeeeee",
                                            "textaccent":"#ffffff",
                                            "title":"#0084ff",
                                            "widgetbackground":"#202020"},
                                "settings":{"removeWhite":true,
                                            "state":true,
                                            "darkTest":false},
                                "sites":   {"login":true}
                            }, function(data) {
        chrome.storage.sync.set(data, function() {
        });
    });
});

var loadingTabs = {};

chrome.tabs.onUpdated.addListener(function(tabId, info, tab) {
    if (info.status === "loading" && ! loadingTabs[tabId]) {
        loadingTabs[tabId] = siteToCSS(tab.url);
        delete dark[tabId];
        changecss();
    }
    else if (info.status === "complete") {
        if (loadingTabs[tabId] !== siteToCSS(tab.url)) { // ufora kan doorsturen naar login -> .css moet verandert worden
            deleteCSS(tab, loadingTabs[tabId]);
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
                            deleteCSS(tab, css);
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
    chrome.storage.sync.get(["settings", "sites"], function(result){
        if (! result.settings.state) {
            removeAllCSS();
        } else {
            chrome.windows.getAll({populate:true},function(windows){
                windows.forEach(function(window){
                    window.tabs.forEach(function(tab){
                        if (! (tab.id in dark)) {
                            var css = siteToCSS(tab.url);
                            if (css && (result.sites.login || css === "ufora.css")) {
                                deleteCSS(tab, css);
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
                    deleteCSS(tab, css);
                }
            });
        });
    });
}

// Voeg gegeven css file toe aan de gegeven tab
function addCSS(tab, cssFile) {
    chrome.storage.sync.get("settings", function(result) {
        if ((! result.settings.darkTest) &&  tab.url.includes("ufora.ugent.be/d2l/lms/quizzing/user/attempt")) {
            return;
        } else {
            chrome.tabs.insertCSS(tab.id, { file: "css/" + cssFile}, function(){chrome.runtime.lastError;});
            cssScript(tab);
            dark[tab.id] = cssFile;
        }
    });
}

// Verwijder gegeven css file van gegeven tab
function deleteCSS(tab, cssFile) {
    chrome.tabs.removeCSS(tab.id, { file: "css/" + cssFile},  function(){chrome.runtime.lastError;});
    delete dark[tab.id];
}

function cssScript(tab) {
    chrome.storage.sync.get("colors", function(result) {
        if (tab.url.includes("ufora.ugent.be")) {
            chrome.tabs.executeScript(tab.id, {
                file : "ufora.js"
            }, function(){chrome.runtime.lastError;});
        }

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
        chrome.tabs.executeScript(tab.id, {
            code: command
        }, function(){chrome.runtime.lastError;});
    }); 
}

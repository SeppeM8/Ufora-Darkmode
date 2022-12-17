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
    }

    // Als waardes niet bestaan: aanmaken
    chrome.storage.sync.get({   
        "colors":{"accent":"#0077ff","accent2":"#00ccff","background":"#000000","link":"#00bbff","linkvisited":"#1279d3","selected":"#353535","text":"#eeeeee","textaccent":"#ffffff","title":"#0084ff","widgetbackground":"#202020"},
        "colors1":{"accent":"#37ff00","accent2":"#2f9e00","background":"#000000","link":"#44ff00","linkvisited":"#17bb02","selected":"#353535","text":"#eeeeee","textaccent":"#000000","title":"#44ff00","widgetbackground":"#202020"},
        "colors2":{"accent":"#ffa726","accent2":"#c77800","background":"#000000","link":"#ffd95d","linkvisited":"#c77800","selected":"#353535","text":"#eeeeee","textaccent":"#ffffff","title":"#ffa726","widgetbackground":"#333333"},
        "colors3":{"accent":"#ff0000","accent2":"#ffae00","background":"#000000","link":"#ff6600","linkvisited":"#b92804","selected":"#353535","text":"#eeeeee","textaccent":"#ffffff","title":"#ff0000","widgetbackground":"#202020"},
        "colors4":{"accent":"#ff00dd","accent2":"#ff0088","background":"#000000","link":"#fb00ff","linkvisited":"#b60295","selected":"#353535","text":"#eeeeee","textaccent":"#ffffff","title":"#ff00dd","widgetbackground":"#202020"},
        "presetNum": 0,
        "settings":{"removeWhite":true,
                    "state":true,
                    "darkTest":false,
                    "logo": "white"},
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
    } else if (changes.settings) {      
        removeAllCSS();
        changecss();
    } else {
        chrome.windows.getAll({populate:true},function(windows){
            windows.forEach(function(window){
                window.tabs.forEach(function(tab){
                    var css = siteToCSS(tab.url);
                    cssScript(tab, css);
                });
            });
        });
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
            chrome.scripting.insertCSS(
                {
                    target: {tabId: tab.id}, 
                    files: ["css/" + cssFile]
                }, function(){chrome.runtime.lastError;});
            cssScript(tab);
            dark[tab.id] = cssFile;
        }
    });
}

// Verwijder gegeven css file van gegeven tab
function deleteCSS(tab, cssFile) {
    chrome.scripting.removeCSS(
        {
            target: {tabId: tab.id}, 
            files: ["css/" + cssFile]
        },  function(){chrome.runtime.lastError;});
    delete dark[tab.id];
}

function cssScript(tab) {
    chrome.storage.sync.get("presetNum", function(result) {
        var preset = result.presetNum == 0 ? "colors" : "colors" + result.presetNum;
        chrome.storage.sync.get(preset, function(result) {
            var colors = result[preset];
            if (tab.url.includes("ufora.ugent.be")) {
                chrome.scripting.executeScript(
                    {
                        target: {tabId: tab.id},
                        files: ["ufora.js"]
                }, function(){chrome.runtime.lastError;});
            }
    
            var command = ":root {"; 
            command += "--background:" + colors.background + ";";
            command += "--widget-background:" + colors.widgetbackground + ";";
            command += "--selected:" + colors.selected + ";";
            command += "--accent:" + colors.accent + ";";
            command += "--accent2:" + colors.accent2 + ";";
            command += "--text-accent:" + colors.textaccent + ";";
            command += "--text:" + colors.text + ";";
            command += "--text-title:" + colors.title + ";";
            command += "--text-link:" + colors.link + ";";
            command += "--text-link-visited:" + colors.linkvisited + ";";
            chrome.scripting.insertCSS(
                {
                    target: {tabId: tab.id},
                    css: command
                }, function(){chrome.runtime.lastError;});
        }); 
    });    
}

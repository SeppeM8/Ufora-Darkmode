var swit = document.getElementById("checkbox");

chrome.storage.sync.get("state", function(result){
    swit.checked = result.state;
});

if (swit) {
    swit.addEventListener("change", function() {
        chrome.storage.sync.set({"state": this.checked});
        chrome.tabs.getSelected(null, function(tab) {
            changecss(tab);
        });
    });
}

// Colorselectors
var cbackground = document.getElementById("cbackground");

// init
chrome.storage.sync.get("colors", function(result) {
    cbackground.value = result.colors.background;
    cwidgetbackground.value = result.colors.widgetbackground;
    cselected.value = result.colors.selected;
    clines.value = result.colors.lines;
    caccent.value = result.colors.accent;
    caccent2.value = result.colors.accent2;
    ctext.value = result.colors.text;
    ctitle.value = result.colors.title;
    clink.value = result.colors.link;
    clinkvisited.value = result.colors.linkvisited;
});


// Listeners
cbackground.addEventListener("change", function() {
    chrome.storage.sync.get("colors", function(result) {
        result.colors.background = cbackground.value;
        chrome.storage.sync.set({"colors": result.colors});
        chrome.tabs.getSelected(null, function(tab) {
            changecss(tab);
        });
    });
});
cwidgetbackground.addEventListener("change", function() {
    chrome.storage.sync.get("colors", function(result) {
        result.colors.widgetbackground = cwidgetbackground.value;
        chrome.storage.sync.set({"colors": result.colors});
        chrome.tabs.getSelected(null, function(tab) {
            changecss(tab);
        });
    });
});
cselected.addEventListener("change", function() {
    chrome.storage.sync.get("colors", function(result) {
        result.colors.selected = cselected.value;
        chrome.storage.sync.set({"colors": result.colors});
        chrome.tabs.getSelected(null, function(tab) {
            changecss(tab);
        });
    });
});
clines.addEventListener("change", function() {
    chrome.storage.sync.get("colors", function(result) {
        result.colors.lines = clines.value;
        chrome.storage.sync.set({"colors": result.colors});
        chrome.tabs.getSelected(null, function(tab) {
            changecss(tab);
        });
    });
});
caccent.addEventListener("change", function() {
    chrome.storage.sync.get("colors", function(result) {
        result.colors.accent = caccent.value;
        chrome.storage.sync.set({"colors": result.colors});
        chrome.tabs.getSelected(null, function(tab) {
            changecss(tab);
        });
    });
});
caccent2.addEventListener("change", function() {
    chrome.storage.sync.get("colors", function(result) {
        result.colors.accent2 = caccent2.value;
        chrome.storage.sync.set({"colors": result.colors});
        chrome.tabs.getSelected(null, function(tab) {
            changecss(tab);
        });
    });
});
cwidgetbackground.addEventListener("change", function() {
    chrome.storage.sync.get("colors", function(result) {
        result.colors.widgetbackground = cwidgetbackground.value;
        chrome.storage.sync.set({"colors": result.colors});
        chrome.tabs.getSelected(null, function(tab) {
            changecss(tab);
        });
    });
});
ctext.addEventListener("change", function() {
    chrome.storage.sync.get("colors", function(result) {
        result.colors.text = ctext.value;
        chrome.storage.sync.set({"colors": result.colors});
        chrome.tabs.getSelected(null, function(tab) {
            changecss(tab);
        });
    });
});
ctitle.addEventListener("change", function() {
    chrome.storage.sync.get("colors", function(result) {
        result.colors.title = ctitle.value;
        chrome.storage.sync.set({"colors": result.colors});
        chrome.tabs.getSelected(null, function(tab) {
            changecss(tab);
        });
    });
});
clink.addEventListener("change", function() {
    chrome.storage.sync.get("colors", function(result) {
        result.colors.link = clink.value;
        chrome.storage.sync.set({"colors": result.colors});
        chrome.tabs.getSelected(null, function(tab) {
            changecss(tab);
        });
    });
});
clinkvisited.addEventListener("change", function() {
    chrome.storage.sync.get("colors", function(result) {
        result.colors.linkvisited = clinkvisited.value;
        chrome.storage.sync.set({"colors": result.colors});
        chrome.tabs.getSelected(null, function(tab) {
            changecss(tab);
        });
    });
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
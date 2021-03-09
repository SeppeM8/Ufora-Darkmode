function localizeHtmlPage()
{
    //Localize by replacing __MSG_***__ meta tags
    var objects = document.getElementsByTagName('html');
    for (var j = 0; j < objects.length; j++)
    {
        var obj = objects[j];

        var valStrH = obj.innerHTML.toString();
        var valNewH = valStrH.replace(/__MSG_(\w+)__/g, function(match, v1)
        {
            return v1 ? chrome.i18n.getMessage(v1) : "";
        });

        if(valNewH != valStrH)
        {
            obj.innerHTML = valNewH;
        }
    }
}

localizeHtmlPage();

var enable = document.getElementById("enable");
var enabled;

if (enable) {
    chrome.storage.sync.get("settings", function(result){
        if (result.settings.state) {
            enable.textContent = chrome.i18n.getMessage("popup_disable");
            enabled = true;
        } else {
            enable.textContent = chrome.i18n.getMessage("popup_enable");
            document.body.style.backgroundColor = "white";
            document.body.style.color = "black";
            enabled = false;
        }
    });

    enable.addEventListener("click", function() {
        chrome.storage.sync.get("settings", function(result) {
            if (enabled) {
                result.settings.state = true;
                enable.textContent = chrome.i18n.getMessage("popup_disable");
            } else {
                result.settings.state = false;
                enable.textContent = chrome.i18n.getMessage("popup_enable");
            }
            chrome.storage.sync.set({"settings": result.settings});
        });  
        enabled = !enabled;      
    });
}

var reset = document.getElementById("reset");

if (reset) {
    reset.addEventListener("click", function () {
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
        initColors();
    });
}

var login = document.getElementById("login");

if (login) {
    chrome.storage.sync.get("sites", function(result){
        login.checked = result.sites.login;
    });

    login.addEventListener("change", function(e) {
        chrome.storage.sync.get("sites", function(result){
            result.sites.login = login.checked;
            chrome.storage.sync.set({"sites": result.sites});
        });
    })
}

var removeWhite = document.getElementById("removeWhite");

if (removeWhite) {
    chrome.storage.sync.get("settings", function(result){
        removeWhite.checked = result.settings.removeWhite;
    });

    removeWhite.addEventListener("change", function() {
        chrome.storage.sync.get("settings", function(result) {
            if (removeWhite.checked) {
                result.settings.removeWhite = true;
            } else {
                result.settings.removeWhite = false;
            }
            chrome.storage.sync.set({"settings": result.settings});
        });        
    });
}

var darkTest = document.getElementById("darkTest");

if (darkTest) {
    chrome.storage.sync.get("settings", function(result){
        darkTest.checked = result.settings.darkTest;
    });

    darkTest.addEventListener("change", function() {
        chrome.storage.sync.get("settings", function(result) {
            if (darkTest.checked) {
                result.settings.darkTest = true;
            } else {
                result.settings.darkTest = false;
            }
            chrome.storage.sync.set({"settings": result.settings});
        });        
    });
}

// Storage listener
chrome.storage.onChanged.addListener(function(changes, namespace) {
    chrome.storage.sync.get("settings", function(result){
        if (result.settings.state) {
            document.body.style.backgroundColor = "black";
            document.body.style.color = "white";
        } else {
            document.body.style.backgroundColor = "white";
            document.body.style.color = "black";
        }
    });
});

// init
function initColors() {
    chrome.storage.sync.get("colors", function(result) {
        cbackground.value = result.colors.background;
        cwidgetbackground.value = result.colors.widgetbackground;
        cselected.value = result.colors.selected;
        caccent.value = result.colors.accent;
        caccent2.value = result.colors.accent2;
        ctextaccent.value = result.colors.textaccent;
        ctext.value = result.colors.text;
        ctitle.value = result.colors.title;
        clink.value = result.colors.link;
        clinkvisited.value = result.colors.linkvisited;
    });
}
initColors();


// Listeners
cbackground.addEventListener("change", function() {
    chrome.storage.sync.get("colors", function(result) {
        result.colors.background = cbackground.value;
        chrome.storage.sync.set({"colors": result.colors});
    });
});
cwidgetbackground.addEventListener("change", function() {
    chrome.storage.sync.get("colors", function(result) {
        result.colors.widgetbackground = cwidgetbackground.value;
        chrome.storage.sync.set({"colors": result.colors});
    });
});
cselected.addEventListener("change", function() {
    chrome.storage.sync.get("colors", function(result) {
        result.colors.selected = cselected.value;
        chrome.storage.sync.set({"colors": result.colors});
    });
});
caccent.addEventListener("change", function() {
    chrome.storage.sync.get("colors", function(result) {
        result.colors.accent = caccent.value;
        chrome.storage.sync.set({"colors": result.colors});
    });
});
caccent2.addEventListener("change", function() {
    chrome.storage.sync.get("colors", function(result) {
        result.colors.accent2 = caccent2.value;
        chrome.storage.sync.set({"colors": result.colors});
    });
});
cwidgetbackground.addEventListener("change", function() {
    chrome.storage.sync.get("colors", function(result) {
        result.colors.widgetbackground = cwidgetbackground.value;
        chrome.storage.sync.set({"colors": result.colors});
    });
});
ctextaccent.addEventListener("change", function() {
    chrome.storage.sync.get("colors", function(result) {
        result.colors.textaccent = ctextaccent.value;
        chrome.storage.sync.set({"colors": result.colors});
    });
});
ctext.addEventListener("change", function() {
    chrome.storage.sync.get("colors", function(result) {
        result.colors.text = ctext.value;
        chrome.storage.sync.set({"colors": result.colors});
    });
});
ctitle.addEventListener("change", function() {
    chrome.storage.sync.get("colors", function(result) {
        result.colors.title = ctitle.value;
        chrome.storage.sync.set({"colors": result.colors});
    });
});
clink.addEventListener("change", function() {
    chrome.storage.sync.get("colors", function(result) {
        result.colors.link = clink.value;
        chrome.storage.sync.set({"colors": result.colors});
    });
});
clinkvisited.addEventListener("change", function() {
    chrome.storage.sync.get("colors", function(result) {
        result.colors.linkvisited = clinkvisited.value;
        chrome.storage.sync.set({"colors": result.colors});
    });
});

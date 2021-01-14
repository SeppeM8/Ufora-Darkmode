chrome.storage.sync.get(["colors", "settings"], function(result) {

    // Pagina mag veranderd worden
    if (result.settings.removeWhite) {
        // witte vakken bij vakken verwijderen + rechts op startscherm
        var elements = document.getElementsByClassName('d2l-widget d2l-tile d2l-widget-padding-full');
        while(elements.length > 0){
            elements[0].parentNode.removeChild(elements[0]);
        }
    }

    // Accountinstellingen - background
    if (window.location.href.includes("https://ufora.ugent.be/d2l/lp/preferences")) {
        var all = document.getElementsByClassName("dco_c"); 
        for (var i = 0; i < all.length; i++) {
            all[i].style.backgroundColor = result.colors.widgetbackground; 
        }
    }
});

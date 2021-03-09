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
    
    /* Kalender Maand Vandaag */
    if (window.location.href.includes("https://ufora.ugent.be/d2l/le/calendar/")) {
        addNewStyle('td.d2l-le-calendar-today {background-color: ' + result.colors.selected + ' !important;}');
    }

    /* Bestanden zonder voorbeeld */
    var boxes = document.getElementsByClassName('d2l-fileviewer');
    for (var i = 0; i < boxes.length; i++) {
        boxes[i].children[0].style.backgroundColor = result.colors.widgetbackground;
    }


    let observer = new MutationObserver(() => {
        setTimeout(onReady, 0);
    });

    /* Dingen die pas uitgevoerd worden wanneer pagina volledig geladen is */
    function onReady() {
         /* Dropdown top/bottom strook */
         var all = document.querySelectorAll('d2l-dropdown-menu');
         for (var i = 0; i < all.length; i++) {
                var menu = all[i].shadowRoot;    
                var style = document.createElement( 'style' );
                style.innerHTML = '.d2l-dropdown-content-width { background-color: ' + result.colors.widgetbackground + ' !important; }'
                menu.appendChild(style);

                var style = document.createElement( 'style' );
                style.innerHTML = '.d2l-dropdown-content-pointer > div { background-color: ' + result.colors.widgetbackground + ' !important; }'
                menu.appendChild(style);
         }

         // Dropdown met pijltje
        var all = document.querySelectorAll('d2l-dropdown-context-menu');
        for (var i = 0; i < all.length; i++) {        
        // observe everything except attributes
            observer.observe(all[i], {
                childList: true, // observe direct children
                subtree: true, // and lower descendants too
            });
        }        
    }

    document.onreadystatechange = () => {
        if (document.readyState === 'complete') {    
           onReady();
        }
    }
    if (document.readyState === 'complete') {
        onReady();
    }    
});

function addNewStyle(newStyle) {
    var styleElement = document.getElementById('styles_js');
    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        styleElement.id = 'styles_js';
        document.getElementsByTagName('head')[0].appendChild(styleElement);
    }
    styleElement.appendChild(document.createTextNode(newStyle));
}

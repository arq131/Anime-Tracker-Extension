// Gets the current tab URL. (Editor note: Should contain gogoanime or kissanime or crunchyroll)
function getCurrentTabUrl(callback) {
    // Query filter to be passed to chrome.tabs.query - see
    // https://developer.chrome.com/extensions/tabs#method-query
    var queryInfo = {
        active: true,
        currentWindow: true
    };

    chrome.tabs.query(queryInfo, function(tabs) {
        // chrome.tabs.query invokes the callback with a list of tabs that match the
        // query. When the popup is opened, there is certainly a window and at least
        // one tab, so we can safely assume that |tabs| is a non-empty array.
        // A window can only have one active tab at a time, so the array consists of
        // exactly one tab.
        var tab = tabs[0];

        // A tab is a plain object that provides information about the tab.
        // See https://developer.chrome.com/extensions/tabs#type-Tab
        var url = tab.url;

        // tab.url is only available if the "activeTab" permission is declared.
        // If you want to see the URL of other tabs (e.g. after removing active:true
        // from |queryInfo|), then the "tabs" permission is required to see their
        // "url" properties.
        console.assert(typeof url == 'string', 'tab.url should be a string');

        callback(url);
    });
}

/*
setCookie will set the cookie with "cname=cvalue"
*/
function setCookie(cname, cvalue) {
    document.cookie = cname + "=" + cvalue;
}
/*
 getCookie will get the cookie from a certain field (cname) and return
 the value of that field.
*/
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    var i = 0;
    for (i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
        return "";
    }
}

function renderStatus(statusText) {
    document.getElementById('status').textContent = statusText;
}

function getAnime(url) {

    var CRregex = new RegExp("crunchyroll.com\/(.+)\/(.+)");
    var GGregex = new RegExp("gogoanime.tv\/(.+)");
    if (CRregex.test(url)) {
        var newVar = CRregex.exec(url);
        var anime = newVar[1].replace(/-/g, ' ');
        anime = anime.toLowerCase().replace(/([^a-z]|^)([a-z])(?=[a-z]{2})/g, function(_, g1, g2) {
            return g1 + g2.toUpperCase(); } );
        return anime;
    }
    return "";

}

document.getElementById('tracker').onclick = function() {
    getCurrentTabUrl(function(url) {
        var mydiv = document.getElementById('links');
        var newTag = document.createElement('a');
        newTag.setAttribute('href', url);
        newTag.innerHTML = getAnime(url);
        mydiv.appendChild(newTag);
    });

};


document.addEventListener('DOMContentLoaded', function() {
    getCurrentTabUrl(function(url) {
        renderStatus('Current Anime: ' + getAnime(url));

    });
});

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

function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

document.addEventListener('DOMContentLoaded', function() {
  getCurrentTabUrl(function(url) {
  
  var expression = "crunchyroll|gogoanime|kissanime";
  var regex = new RegExp("(crunchyroll|gogoanime|kissanime)\.com\/(.+)\/");
  
  
    
  if (regex.test(url)) {
    var newVar = regex.exec(url);
    var anime = newVar[2].replace(/-/g, ' ');
    renderStatus('This website is an anime website! Anime: ' + anime + '\nurl = ' + url);
    //document.getElementById('anime-url').textContent = url;
    var anime_link = document.createElement('a');
    anime_link.id = 'anime-link';
    anime_link.href = url;
    anime_link.innerHTML = 'Anime Link';
    anime_link.target = '_blank';
    document.body.appendChild(anime_link);
    //document.getElementById('anime-link').href = url;
    
    
  } else {
    renderStatus('This website is not an anime website! ' + url);
  }

  });
});

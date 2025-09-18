
// mobile-fit.js (mobile-only)
(function(){
  function fitPage(){
    var isMobile = window.matchMedia("(max-width: 820px)").matches;
    var html = document.documentElement;
    var body = document.body;

    // Reset defaults on every call
    html.style.overflow = "";
    body.style.overflow = "";
    body.style.margin = "";
    body.style.height = "";

    // If not mobile, ensure any previous wrapper keeps no transform
    var ex = document.getElementById("page-root");
    if(!isMobile){
      if(ex){
        ex.style.transform = "";
        ex.style.width = "";
      }
      return;
    }

    // Wrap existing children in #page-root if not present
    var root = document.getElementById("page-root");
    if(!root){
      root = document.createElement("div");
      root.id = "page-root";
      while(body.firstChild){
        root.appendChild(body.firstChild);
      }
      body.appendChild(root);
    }

    // clear previous transforms to measure
    root.style.transform = "";
    root.style.transformOrigin = "top left";
    root.style.width = "";
    root.style.margin = "0";
    root.style.padding = "";

    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var naturalWidth = root.scrollWidth;
    var naturalHeight = root.scrollHeight;
    if(naturalWidth === 0 || naturalHeight === 0){ return; }

    var scaleX = vw / naturalWidth;
    var scaleY = vh / naturalHeight;
    var scale = Math.min(scaleX, scaleY);

    // Centering
    var dx = Math.max(0, (vw - naturalWidth * scale) / 2);
    var dy = Math.max(0, (vh - naturalHeight * scale) / 2);

    root.style.transformOrigin = "top left";
    root.style.transform = "translate(" + dx + "px," + dy + "px) scale(" + scale + ")";
    root.style.width = naturalWidth + "px";

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.height = vh + "px";
    body.style.background = "#ffffff";
  }

  window.addEventListener("load", fitPage);
  window.addEventListener("resize", function(){
    clearTimeout(window.__fitPageTimer);
    window.__fitPageTimer = setTimeout(fitPage, 150);
  });
  document.addEventListener("visibilitychange", function(){
    if(!document.hidden){ setTimeout(fitPage, 100); }
  });
})();

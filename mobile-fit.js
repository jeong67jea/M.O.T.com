
// mobile-fit.js (mobile-only, portrait header-fit & zero side margin)
(function(){
  function fitPage(){
    var isMobile = window.matchMedia("(max-width: 820px)").matches;
    var isPortrait = window.matchMedia("(orientation: portrait)").matches;
    var html = document.documentElement;
    var body = document.body;

    // Reset base
    html.style.overflow = "";
    body.style.overflow = "";
    body.style.margin = "";
    body.style.height = "";

    var root = document.getElementById("page-root");
    if(!isMobile){
      if(root){ root.style.transform=""; root.style.width=""; }
      return;
    }

    if(!root){
      root = document.createElement("div");
      root.id = "page-root";
      while(body.firstChild){ root.appendChild(body.firstChild); }
      body.appendChild(root);
    }

    // Clear transform to measure natural size
    root.style.transform = "";
    root.style.transformOrigin = "top left";
    root.style.width = "";
    root.style.margin = "0";
    root.style.padding = "";

    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var W = root.scrollWidth;
    var H = root.scrollHeight;
    if(!W || !H){ return; }

    // width-fit to remove side margins
    var sW = vw / W;
    var scale = sW;

    // If portrait, ensure header (navbar) is fully visible within viewport height
    if(isPortrait){
      // try to find a header-like element
      var header = document.querySelector("header, .header, .navbar, nav");
      var headerH = header ? (header.scrollHeight || header.clientHeight || 0) : 0;
      if(headerH > 0){
        var sHeader = vh / headerH; // scale needed so header fits in viewport height
        // We cannot exceed width-fit (otherwise side margins would appear), so take min
        scale = Math.min(scale, sHeader);
      }
    }

    // Final projected sizes
    var finalW = W * scale;
    var finalH = H * scale;

    // Zero side margins: align left (dx=0) and rely on width-fit scale so finalW ~= vw
    var dx = 0;
    // Vertical placement: if taller than viewport, stick to top; otherwise center vertically
    var dy = finalH > vh ? 0 : Math.max(0, (vh - finalH) / 2);

    root.style.transformOrigin = "top left";
    root.style.transform = "translate(" + dx + "px," + dy + "px) scale(" + scale + ")";
    root.style.width = W + "px";

    // Scroll handling
    if(finalH > vh){
      html.style.overflowY = "auto";
      body.style.overflowY = "auto";
    }else{
      html.style.overflow = "hidden";
      body.style.overflow = "hidden";
    }
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

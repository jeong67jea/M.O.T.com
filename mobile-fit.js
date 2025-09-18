
(function(){
  function fitPage(){
    var isMobile = window.matchMedia("(max-width: 820px)").matches;
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
    var scale = vw / W;

    // Ensure header is visible in portrait
    var header = document.querySelector("header, .header, .navbar, nav");
    var headerH = header ? (header.scrollHeight || header.clientHeight || 0) : 0;
    if(headerH > 0){
      var sHeader = vh / headerH;
      scale = Math.min(scale, sHeader);
    }

    var finalW = W * scale;
    var finalH = H * scale;

    var dx = 0; // zero side margin
    var dy = finalH > vh ? 0 : Math.max(0, (vh - finalH)/2);

    root.style.transformOrigin = "top left";
    root.style.transform = "translate(" + dx + "px," + dy + "px) scale(" + scale + ")";
    root.style.width = W + "px";

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

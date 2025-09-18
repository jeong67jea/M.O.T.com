
// mobile-fit.js (mobile-only, margin-optimized)
(function(){
  function fitPage(){
    var isMobile = window.matchMedia("(max-width: 820px)").matches;
    var html = document.documentElement;
    var body = document.body;

    // Reset
    html.style.overflow = "";
    body.style.overflow = "";
    body.style.margin = "";
    body.style.height = "";

    var root = document.getElementById("page-root");
    if(!isMobile){
      if(root){
        root.style.transform = "";
        root.style.width = "";
      }
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

    // Compute width- and height-based scales
    var sW = vw / W;
    var sH = vh / H;

    // Strategy:
    // 1) Prefer width-fit to remove left/right margins.
    // 2) If height would overflow >10% of viewport, fall back to height-fit.
    var scale = sW;
    var projectedH = H * scale;
    if(projectedH > vh * 1.10){
      scale = sH;
    }

    // Keep side margins <= 8px by nudging scale up (bounded by width fit)
    var maxScaleByWidth = sW;
    var minMargin = 8; // px per side target
    var contentW = W * scale;
    var side = (vw - contentW) / 2;
    if(side > minMargin){
      // We can safely increase scale up to width-fit
      var needed = (vw - 2*minMargin) / W;
      scale = Math.min(maxScaleByWidth, Math.max(scale, needed));
    }

    // Compute final offsets
    var finalW = W * scale;
    var finalH = H * scale;
    var dx = Math.max(0, (vw - finalW) / 2);
    var dy = Math.max(0, (vh - finalH) / 2);

    // If still taller than viewport, align to top to avoid big top gap
    if(finalH > vh){ dy = 0; }

    root.style.transformOrigin = "top left";
    root.style.transform = "translate(" + dx + "px," + dy + "px) scale(" + scale + ")";
    root.style.width = W + "px";

    // Manage scroll
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

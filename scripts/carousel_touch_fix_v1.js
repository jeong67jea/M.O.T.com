
/**
 * carousel_touch_fix_v1.js
 * Adds basic horizontal swipe for `.carousel .track` structures without depending on existing libs.
 * Non-intrusive: only runs if track exists and no data-locked attribute present.
 */
(function(){
  const carousels = Array.from(document.querySelectorAll('.carousel'));
  carousels.forEach(carousel => {
    if(carousel.dataset.touchFixApplied === '1') return;
    const track = carousel.querySelector('.track');
    if(!track) return;

    let startX = 0, startY = 0, dx = 0, isMoving = false, index = 0;
    const slides = Array.from(track.children);
    if(slides.length <= 1) { carousel.dataset.touchFixApplied = '1'; return; }

    function width(){ return carousel.clientWidth; }
    function go(i){
      index = (i + slides.length) % slides.length;
      const x = -index * width();
      track.style.transform = `translate3d(${x}px,0,0)`;
    }
    // Initialize widths
    function size(){
      const w = width();
      slides.forEach(s => { s.style.flex = '0 0 100%'; s.style.width = w + 'px'; });
      go(index);
    }
    size(); window.addEventListener('resize', size, {passive:true});

    carousel.addEventListener('touchstart', (e)=>{
      if(!e.touches || e.touches.length !== 1) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      dx = 0; isMoving = true;
    }, {passive:true});

    carousel.addEventListener('touchmove', (e)=>{
      if(!isMoving || !e.touches) return;
      const curX = e.touches[0].clientX;
      const curY = e.touches[0].clientY;
      const adx = Math.abs(curX - startX);
      const ady = Math.abs(curY - startY);
      // If horizontal gesture stronger, prevent vertical scroll and drag track
      if(adx > ady){
        e.preventDefault();
        dx = curX - startX;
        const x = -index * width() + dx;
        track.style.transform = `translate3d(${x}px,0,0)`;
      }
    }, {passive:false});

    carousel.addEventListener('touchend', ()=>{
      if(!isMoving) return;
      isMoving = false;
      const w = width();
      if(Math.abs(dx) > w * 0.2){
        go(index + (dx < 0 ? 1 : -1));
      }else{
        go(index);
      }
      dx = 0;
    }, {passive:true});

    carousel.dataset.touchFixApplied = '1';
  });
})();

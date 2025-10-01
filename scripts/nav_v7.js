
/** nav_v7.js (r1) — Desktop: hover -> fixed overlay (any width). Mobile: click toggle. */
(function(){
  const header = document.querySelector('header.navbar');
  const nav = header ? header.querySelector('nav.primary') : null;
  if(!header || !nav) return;

  const isTouch = matchMedia('(hover: none)').matches;
  const items = Array.from(nav.querySelectorAll('.menu > li'));

  function openFixed(li){
    const submenu = li.querySelector(':scope > .submenu');
    if(!submenu) return;
    const hdrRect = header.getBoundingClientRect();
    const liRect  = li.getBoundingClientRect();
    submenu.style.position = 'fixed';
    submenu.style.top = Math.round(hdrRect.bottom) + 'px';
    const left = Math.max(6, Math.min(liRect.left, window.innerWidth - 8 - 320));
    submenu.style.left = Math.round(left) + 'px';
    submenu.style.zIndex = '120020';
    submenu.style.display = 'block';
    submenu.style.visibility = 'visible';
    submenu.style.opacity = '1';
    submenu.style.maxWidth = 'min(92vw, 560px)';
    submenu.dataset.overlay = '1';
  }
  function closeFixed(li){
    const submenu = li.querySelector(':scope > .submenu');
    if(!submenu) return;
    if(submenu.dataset.overlay === '1'){
      submenu.removeAttribute('style');
      delete submenu.dataset.overlay;
    }
  }

  if(!isTouch){
    items.forEach(li => {
      const submenu = li.querySelector(':scope > .submenu');
      if(!submenu) return;
      li.addEventListener('mouseenter', ()=> openFixed(li));
      li.addEventListener('mouseleave', ()=> closeFixed(li));
    });
    ['scroll','resize'].forEach(ev=>{
      window.addEventListener(ev, ()=>{
        const open = items.find(li=> {
          const sm = li.querySelector(':scope > .submenu');
          return sm && sm.dataset.overlay === '1';
        });
        if(open) openFixed(open);
      }, {passive:true});
    });
  }

  if(isTouch){
    items.forEach(li => {
      const submenu = li.querySelector(':scope > .submenu');
      const link = li.querySelector(':scope > a');
      if(submenu && link){
        link.addEventListener('click', (ev)=>{
          if(!li.classList.contains('open')){
            ev.preventDefault();
            items.forEach(o => { if(o!==li) o.classList.remove('open'); });
            li.classList.add('open');
          }
        }, {passive:false});
      }
    });
    document.addEventListener('click', (e)=>{
      if(!header.contains(e.target)){
        items.forEach(li=> li.classList.remove('open'));
      }
    });
  }
})();

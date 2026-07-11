
(function(){
  const DB_KEY='iea_html_game_section_db_v4_role_panels';
  const $=(s,r=document)=>r.querySelector(s); const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
  function pageKey(){
    if(document.body.dataset.page) return document.body.dataset.page;
    const f=(location.pathname.split('/').pop()||'index.html').replace('.html','');
    const map={
      'index':'main-home','everyday-english':'main-everyday-english','tasks-games':'home','about':'about','levels':'levels','clubs':'clubs','awareness-club':'awareness-club','reading-club':'reading-club','film-club':'film-club','trainer':'trainer','pricing':'pricing','process':'process','blog':'blog','contact':'contact'
    };
    return map[f]||f||'main-home';
  }
  function db(){try{return JSON.parse(localStorage.getItem(DB_KEY)||'{}')}catch(e){return {}}}
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
  function design(){const d=db();return Object.assign({},((d.pageColours||{})[pageKey()]||{}));}
  function applyDesign(){
    const t=design(); if(!Object.keys(t).length)return;
    const r=document.documentElement;
    if(t.primary){r.style.setProperty('--green',t.primary);r.style.setProperty('--mint',t.mint||t.primary)}
    if(t.accent)r.style.setProperty('--gold',t.accent);
    if(t.accent2||t.accent)r.style.setProperty('--gold2',t.accent2||t.accent);
    if(t.text)r.style.setProperty('--text',t.text);
    if(t.muted)r.style.setProperty('--muted',t.muted);
    if(t.bgStart)r.style.setProperty('--bg',t.bgStart);
    if(t.bgEnd)r.style.setProperty('--bg2',t.bgEnd);
    if(t.line)r.style.setProperty('--line',t.line);
    if(t.glass)r.style.setProperty('--glass',t.glass);
    if(t.glass2)r.style.setProperty('--glass2',t.glass2);
    if(t.topbar)r.style.setProperty('--iea-topbar',t.topbar);
    if(t.navText)r.style.setProperty('--iea-nav-text',t.navText);
    if(t.navActiveBg)r.style.setProperty('--iea-nav-active-bg',t.navActiveBg);
    if(t.navActiveText)r.style.setProperty('--iea-nav-active-text',t.navActiveText);
    if(t.buttonBg)r.style.setProperty('--iea-button-bg',t.buttonBg);
    if(t.buttonText)r.style.setProperty('--iea-button-text',t.buttonText);
    if(t.primaryButtonBg)r.style.setProperty('--iea-primary-button-bg',t.primaryButtonBg);
    if(t.primaryButtonText)r.style.setProperty('--iea-primary-button-text',t.primaryButtonText);
    if(t.footerBg)r.style.setProperty('--iea-footer-bg',t.footerBg);
    if(t.cardGlowA)r.style.setProperty('--iea-card-glow-a',t.cardGlowA);
    if(t.cardGlowB)r.style.setProperty('--iea-card-glow-b',t.cardGlowB);
    if(t.heroBgA)r.style.setProperty('--iea-hero-bg-a',t.heroBgA);
    if(t.heroBgB)r.style.setProperty('--iea-hero-bg-b',t.heroBgB);
    if(t.bodyFont)r.style.setProperty('--iea-body-font',t.bodyFont);
    if(t.headingFont)r.style.setProperty('--iea-heading-font',t.headingFont);
    if(t.baseFontSize)r.style.setProperty('--iea-base-font-size',Number(t.baseFontSize)+'px');
    if(t.heroTitleSize)r.style.setProperty('--iea-hero-title-size',Number(t.heroTitleSize)+'px');
    if(t.headingSize)r.style.setProperty('--iea-heading-size',Number(t.headingSize)+'px');
    if(t.textLineHeight)r.style.setProperty('--iea-text-line-height',Number(t.textLineHeight));
    if(t.titleWeight)r.style.setProperty('--iea-title-weight',Number(t.titleWeight));
    if(t.letterSpacing)r.style.setProperty('--iea-letter-spacing',Number(t.letterSpacing)+'em');
    if(t.topbarHeight)r.style.setProperty('--iea-topbar-height',Number(t.topbarHeight)+'px');
    if(t.topbarLineSize)r.style.setProperty('--iea-topbar-line-size',Number(t.topbarLineSize)+'px');
    if(t.topbarLineColor)r.style.setProperty('--iea-topbar-line-color',t.topbarLineColor);
    if(t.topbarTextSize)r.style.setProperty('--iea-topbar-text-size',Number(t.topbarTextSize)+'px');
    if(t.footerPadding)r.style.setProperty('--iea-footer-padding',Number(t.footerPadding)+'px');
    if(t.footerLineSize)r.style.setProperty('--iea-footer-line-size',Number(t.footerLineSize)+'px');
    if(t.footerLineColor)r.style.setProperty('--iea-footer-line-color',t.footerLineColor);
    if(t.footerTextSize)r.style.setProperty('--iea-footer-text-size',Number(t.footerTextSize)+'px');
    document.body.classList.add('iea-custom-page-colours');
    applyText(t);
  }
  function applyText(t){
    const set=(sel,val)=>{if(!val)return; const el=$(sel); if(el)el.textContent=val;};
    set('main .eyebrow, .page-hero .eyebrow, .hero .eyebrow',t.heroEyebrow);
    set('main .mega-title, main .mega, .page-hero .mega-title, .hero .mega-title, .hero .mega',t.heroTitle);
    set('main .hero-sub, main .lead, .page-hero .hero-sub, .hero .lead',t.heroSubtitle);
    const buttons=$$('.hero-actions a');
    if(buttons[0]){if(t.primaryCtaText)buttons[0].textContent=t.primaryCtaText;if(t.primaryCtaLink)buttons[0].href=t.primaryCtaLink;}
    if(buttons[1]){if(t.secondaryCtaText)buttons[1].textContent=t.secondaryCtaText;if(t.secondaryCtaLink)buttons[1].href=t.secondaryCtaLink;}
  }
  function renderMedia(){
    const box=$('[data-iea-shared-media]'); if(!box)return;
    const d=db(); const media=Array.isArray(d.media)?d.media:[];
    if(!media.length){box.innerHTML='<div class="iea-shared-media-empty">No shared media yet. Login as admin/editor, open Media, upload images/PDF/PPT/audio, and they will appear here.</div>';return;}
    box.innerHTML='<div class="iea-main-media-grid">'+media.slice().reverse().map(m=>{
      const isImg=String(m.type||'').startsWith('image/');
      return '<article class="iea-main-media-card">'+(isImg?'<img src="'+esc(m.data)+'" alt="'+esc(m.name||'IEA media')+'">':'')+'<b>'+esc(m.name||'Shared media')+'</b><small>'+esc(m.type||'file')+'</small><br><a class="btn btn-primary" target="_blank" download="'+esc(m.name||'media')+'" href="'+esc(m.data||'#')+'">Open / Download</a></article>'
    }).join('')+'</div>';
  }
  document.addEventListener('DOMContentLoaded',async()=>{if(window.IEA_Sheets&&window.IEA_Sheets.bootstrapFromSheets){await window.IEA_Sheets.bootstrapFromSheets('iea_html_game_section_db_v4_role_panels', window.IEA_SEED||{});}applyDesign();renderMedia();});
})();

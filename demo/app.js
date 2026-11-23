/* Static portfolio enhancements. No network requests, tracker, or framework required. */
(()=>{
"use strict";
const evidence={
  "Java": [
    "Used to develop enterprise scheduling, payroll, and HR application features, BAU enhancements, interfaces, and backend services at TCS.",
    2
  ],
  "J2EE": [
    "Used to develop enterprise scheduling, payroll, and HR application features, BAU enhancements, interfaces, and backend services at TCS.",
    2
  ],
  "Spring Framework": [
    "Used to develop enterprise scheduling, payroll, and HR application features, BAU enhancements, interfaces, and backend services at TCS.",
    2
  ],
  "REST APIs": [
    "Used to develop enterprise scheduling, payroll, and HR application features, BAU enhancements, interfaces, and backend services at TCS.",
    2
  ],
  "SQL": [
    "Used to develop enterprise scheduling, payroll, and HR application features, BAU enhancements, interfaces, and backend services at TCS.",
    2
  ],
  "JavaScript": [
    "Used to develop enterprise scheduling, payroll, and HR application features, BAU enhancements, interfaces, and backend services at TCS.",
    2
  ],
  "AI agents": [
    "Developed and deployed AI-powered agents for business operations and incentive reports, and reusable agent skills for development, debugging, and testing at TCS.",
    0
  ],
  "GitHub": [
    "Led source-code migration from SVN to GitHub and standardized repository workflows at TCS.",
    0
  ],
  "SVN": [
    "Led source-code migration from SVN to GitHub and standardized repository workflows at TCS.",
    0
  ],
  "Agile & SDLC": [
    "Applied Agile and SDLC practices to enhancements, prioritization, code reviews, testing, and deployment coordination at TCS.",
    1
  ],
  "Confluence": [
    "Built knowledge repositories covering architecture, configuration, testing, ownership, workflows, and developer onboarding at TCS.",
    0
  ],
  "Integration testing": [
    "Supported design, planning, integration testing, and deployment with third-party platforms for an approximately $75 million enterprise-wide integration initiative.",
    0
  ],
  "WordPress": [
    "Developed 100+ university webpages using WordPress, JavaScript, and jQuery; published content for 10,000+ webpages and created Elementor templates.",
    4
  ],
  "jQuery": [
    "Developed 100+ university webpages using WordPress, JavaScript, and jQuery; published content for 10,000+ webpages and created Elementor templates.",
    4
  ],
  "Google Analytics": [
    "Analyzed traffic across 194 university websites using Google Analytics and Data Studio, with recommendations that improved user engagement by 5%.",
    4
  ],
  "Google Data Studio": [
    "Analyzed traffic across 194 university websites using Google Analytics and Data Studio, with recommendations that improved user engagement by 5%.",
    4
  ],
  "Data analysis": [
    "Analyzed traffic across 194 university websites using Google Analytics and Data Studio, with recommendations that improved user engagement by 5%.",
    4
  ],
  "UX/UI": [
    "Applied website coordination, traffic analysis, and planning recommendations to improve university user engagement.",
    4
  ],
  "Windows Server": [
    "Listed in the infrastructure toolkit for the Junior Network Analyst role at HCL, supporting system administration and client requirements.",
    5
  ],
  "Active Directory": [
    "Listed in the infrastructure toolkit for the Junior Network Analyst role at HCL, supporting system administration and client requirements.",
    5
  ],
  "Linux": [
    "Listed in the infrastructure toolkit for the Junior Network Analyst role at HCL, supporting system administration and client requirements.",
    5
  ],
  "UNIX": [
    "Used UNIX commands remotely through Citrix to resolve licensing and system issues at HCL.",
    5
  ],
  "Citrix": [
    "Used UNIX commands remotely through Citrix to resolve licensing and system issues at HCL.",
    5
  ],
  "Requirement analysis": [
    "Translated functional requirements with business analysts, QA, and engineers into scalable features and integrations at TCS.",
    1
  ],
  "Production support": [
    "Supported enterprise HR application maintenance, troubleshooting, incident investigation, defect tracking, and resolution at TCS.",
    3
  ],
  "Security remediation": [
    "Remediated 10,000+ security vulnerabilities and findings with application and security teams, including code fixes, regression and functional testing, and production releases.",
    1
  ],
  "Regression testing": [
    "Remediated 10,000+ security vulnerabilities and findings with application and security teams, including code fixes, regression and functional testing, and production releases.",
    1
  ]
};
const $=(selector,root=document)=>root.querySelector(selector);
const $$=(selector,root=document)=>[...root.querySelectorAll(selector)];
const root=document.documentElement;
const systemMotion=matchMedia('(prefers-reduced-motion: reduce)');
const reduced=()=>systemMotion.matches||root.dataset.motion==='reduced';
const readPreference=key=>{try{return localStorage.getItem(key)}catch{return null}};
const savePreference=(key,value)=>{try{localStorage.setItem(key,value)}catch{}};
const play=(element,frames,options={})=>{
  if(!element||reduced()||typeof element.animate!=='function')return null;
  const animation=element.animate(frames,{duration:240,easing:'cubic-bezier(.2,.7,.2,1)',...options});
  animation.finished.catch(()=>{});
  return animation;
};
// Optional analytics adapter. Off by default. IDs describe actions, never visitors.
// Configure only after an approved analytics setup; no service is installed here.
const actionNames=new Set(['case_study_open','project_link','resume_view','resume_download','resume_print','contact_email','profile_linkedin','profile_github']);
function track(name,item){
  if(!actionNames.has(name))return;
  const adapter=window.portfolioAnalytics;
  if(adapter?.enabled===true&&typeof adapter.track==='function'){
    try{adapter.track(name,{item})}catch{}
  }
}
$$('[data-action]').forEach(link=>link.addEventListener('click',()=>track(link.dataset.action,link.dataset.action)));
if(document.body.dataset.case)track('case_study_open',document.body.dataset.case);

const themeInput=$('#dark-theme'),motionInput=$('#reduce-motion');
root.dataset.theme=readPreference('portfolio-theme')==='dark'?'dark':'light';
root.dataset.motion=readPreference('portfolio-motion')==='reduced'?'reduced':'full';
if(themeInput){themeInput.checked=root.dataset.theme==='dark';themeInput.addEventListener('change',()=>{
  root.dataset.theme=themeInput.checked?'dark':'light';savePreference('portfolio-theme',root.dataset.theme);
})}
function syncMotion(){
  if(motionInput)motionInput.checked=reduced();
  if(reduced())document.getAnimations().forEach(animation=>{try{animation.finish()}catch{animation.cancel()}});
}
if(motionInput)motionInput.addEventListener('change',()=>{
  root.dataset.motion=motionInput.checked?'reduced':'full';savePreference('portfolio-motion',root.dataset.motion);syncMotion();
});
systemMotion.addEventListener('change',syncMotion);syncMotion();
$$('[data-settings]').forEach(element=>element.hidden=false);
const headerDetails=$$('.site-header details');
headerDetails.forEach(details=>details.addEventListener('toggle',()=>{
  if(details.open)headerDetails.filter(other=>other!==details).forEach(other=>other.open=false);
}));
document.addEventListener('click',event=>headerDetails.forEach(details=>{
  if(details.open&&!details.contains(event.target))details.open=false;
}));
document.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&!$('dialog[open]'))headerDetails.forEach(details=>{if(details.open){details.open=false;$('summary',details)?.focus()}});
});
$$('.mobile-menu a').forEach(link=>link.addEventListener('click',()=>$('.mobile-menu').open=false));

// Reveal once. No hidden baseline classes: content survives script/observer failures.
let revealObserver;
if('IntersectionObserver' in window){
  revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){if(!reduced())entry.target.classList.add('is-revealed');revealObserver.unobserve(entry.target)}
  }),{threshold:.08});
  $$('.reveal').forEach(item=>revealObserver.observe(item));
}
const replay=$('[data-replay]');
if(replay&&new URLSearchParams(location.search).get('demo')==='1'){
  replay.hidden=false;replay.addEventListener('click',()=>{
    $$('.reveal').forEach(item=>{item.classList.remove('is-revealed');revealObserver?.observe(item)});
    window.scrollTo({top:0,behavior:reduced()?'instant':'smooth'});
  });
}

// Keep native disclosure behavior as the no-JavaScript and reduced-motion fallback.
$$('.experience-details').forEach(details=>{
  const summary=$('summary',details);let animation=null,targetOpen=details.open;
  summary.addEventListener('click',event=>{
    if(reduced()||typeof details.animate!=='function')return;
    event.preventDefault();
    const height=details.getBoundingClientRect().height;
    targetOpen=animation?!targetOpen:!details.open;
    if(animation){animation.onfinish=null;animation.cancel()}
    details.open=true;
    const end=targetOpen?details.scrollHeight:summary.getBoundingClientRect().height;
    details.style.overflow='hidden';
    animation=play(details,[{height:`${height}px`},{height:`${end}px`}],{duration:220});
    if(!animation){details.open=targetOpen;details.style.overflow='';return}
    animation.onfinish=()=>{details.open=targetOpen;details.style.overflow='';animation=null};
  });
});

// Filter only concepts. Delivered professional contributions stay visible.
const filterControls=$('[data-filter-controls]');
if(filterControls){
  filterControls.hidden=false;
  $$('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
    const cards=$$('.concept-card');const previous=new Map(cards.map(card=>[card,card.getBoundingClientRect()]));
    $$('[data-filter]').forEach(other=>other.setAttribute('aria-pressed',String(other===button)));
    cards.forEach(card=>card.hidden=button.dataset.filter!=='All'&&card.dataset.category!==button.dataset.filter);
    const visible=cards.filter(card=>!card.hidden);
    $('[data-filter-status]').textContent=`${visible.length} ${visible.length===1?'concept':'concepts'}`;
    visible.forEach(card=>{
      const before=previous.get(card),after=card.getBoundingClientRect();
      play(card,[{opacity:.6,transform:`translate(${before.width?before.left-after.left:0}px,${before.width?before.top-after.top:8}px)`},{opacity:1,transform:'translate(0,0)'}]);
    });
  }));
}

const skillPanel=$('#skill-evidence');
if(skillPanel){
  $$('[data-skill]').forEach(link=>{
    link.setAttribute('role','button');link.setAttribute('aria-pressed','false');link.setAttribute('aria-controls','skill-evidence');
    link.addEventListener('keydown',event=>{if(event.key===' '){event.preventDefault();link.click()}});
    link.addEventListener('click',event=>{
      event.preventDefault();const source=evidence[link.dataset.skill];if(!source)return;
      $$('[data-skill]').forEach(other=>other.setAttribute('aria-pressed',String(other===link)));
      $('[data-skill-title]').textContent=link.dataset.skill;
      $('[data-skill-description]').textContent=source[0];
      $('[data-skill-role]').href=`#role-${source[1]}`;
      $('[data-skill-role]').textContent='Read related experience →';
      play(skillPanel,[{opacity:.7},{opacity:1}],{duration:180});
    });
  });
  $('[data-skill-role]').addEventListener('click',event=>{
    const role=$(event.currentTarget.hash);if(role)$('details',role).open=true;
  });
}

// Static résumé pages and browser printing are distinct from a PDF download.
$$('[data-print]').forEach(button=>{
  button.hidden=false;
  button.addEventListener('click',()=>{
    if($('.resume-page')){track('resume_print','resume');window.print()}
    else location.href=new URL('resume.html?print=1',location.href).href;
  });
});
$$('[data-print-container]').forEach(element=>element.hidden=false);
const printState=new Map();
window.addEventListener('beforeprint',()=>{
  $$('.experience-details').forEach(details=>{printState.set(details,details.open);details.open=true});
  document.getAnimations().forEach(animation=>{try{animation.finish()}catch{animation.cancel()}});
});
window.addEventListener('afterprint',()=>{printState.forEach((open,details)=>details.open=open);printState.clear()});
if($('.resume-page')&&new URLSearchParams(location.search).get('print')==='1'){
  track('resume_print','resume');window.addEventListener('load',()=>window.print(),{once:true});
}

// One photography grid, one focus-safe viewer, and a fixed image frame.
const photoLinks=$$('[data-lightbox]'),dialog=$('.lightbox');
if(dialog&&typeof dialog.showModal==='function'){
  const stage=$('.image-stage',dialog),image=$('img',stage),caption=$('[data-photo-caption]',dialog),zoomButton=$('[data-photo-zoom]',dialog);
  const photos=photoLinks.map(link=>({full:link.href,preview:$('img',link).src,alt:$('img',link).alt,caption:link.dataset.caption}));
  let index=0,opener=null,overflow='',animation=null,closing=false,loadToken=0,touchX=null;
  image.tabIndex=0;
  function setZoom(zoomed){
    stage.classList.toggle('is-zoomed',zoomed);zoomButton.setAttribute('aria-pressed',String(zoomed));zoomButton.textContent=zoomed?'Reset zoom':'Zoom image';
    if(!zoomed){stage.scrollTop=0;stage.scrollLeft=0}
  }
  function render(next){
    index=(next+photos.length)%photos.length;const photo=photos[index];const token=++loadToken;
    animation?.cancel();setZoom(false);image.src=photo.preview;image.alt=photo.alt;
    caption.textContent=`${photo.caption} · ${index+1} / ${photos.length}`;
    const full=new Image();full.src=photo.full;
    full.decode().then(()=>{if(token===loadToken&&dialog.open)image.src=photo.full}).catch(()=>{});
  }
  function step(direction){if(closing)return;render(index+direction);animation=play(stage,[{opacity:.5},{opacity:1}],{duration:160})}
  photoLinks.forEach((link,i)=>link.addEventListener('click',event=>{
    event.preventDefault();opener=link;render(i);overflow=document.body.style.overflow;
    dialog.showModal();document.body.style.overflow='hidden';$('[data-lightbox-close]',dialog).focus();
    animation=play(stage,[{opacity:0,transform:'translateY(8px) scale(.96)'},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:300});
  }));
  async function close(){
    if(closing||!dialog.open)return;closing=true;
    const style=getComputedStyle(stage),initial={opacity:style.opacity,transform:style.transform};animation?.cancel();
    dialog.classList.add('is-closing');
    animation=play(stage,[initial,{opacity:0,transform:'scale(.98)'}],{duration:180,fill:'forwards'});
    await Promise.all([animation?.finished.catch(()=>{}),new Promise(resolve=>setTimeout(resolve,reduced()?0:180))]);
    dialog.close();animation?.cancel();animation=null;
  }
  dialog.addEventListener('close',()=>{
    ++loadToken;closing=false;dialog.classList.remove('is-closing');document.body.style.overflow=overflow;setZoom(false);opener?.focus({preventScroll:true});
  });
  dialog.addEventListener('cancel',event=>{event.preventDefault();close()});
  dialog.addEventListener('click',event=>{if(event.target===dialog)close()});
  $('[data-lightbox-close]',dialog).addEventListener('click',close);
  $('[data-photo-prev]',dialog).addEventListener('click',()=>step(-1));
  $('[data-photo-next]',dialog).addEventListener('click',()=>step(1));
  zoomButton.addEventListener('click',()=>setZoom(!stage.classList.contains('is-zoomed')));
  image.addEventListener('click',()=>setZoom(!stage.classList.contains('is-zoomed')));
  dialog.addEventListener('keydown',event=>{
    if(event.key==='ArrowLeft'){event.preventDefault();step(-1)}
    if(event.key==='ArrowRight'){event.preventDefault();step(1)}
    if(event.target===image&&(event.key==='Enter'||event.key===' ')){event.preventDefault();setZoom(!stage.classList.contains('is-zoomed'))}
    if(event.key==='Tab'){
      const controls=$$('button,[tabindex="0"]',dialog),first=controls[0],last=controls.at(-1);
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
    }
  });
  stage.addEventListener('touchstart',event=>{touchX=stage.classList.contains('is-zoomed')?null:event.touches[0]?.clientX},{passive:true});
  stage.addEventListener('touchend',event=>{const end=event.changedTouches[0]?.clientX;if(touchX!==null&&end!==undefined&&Math.abs(end-touchX)>45)step(end<touchX?1:-1);touchX=null},{passive:true});
  document.addEventListener('contextmenu',event=>{if(event.target instanceof Element&&event.target.closest('.photo-card,.image-stage'))event.preventDefault()});
  document.addEventListener('dragstart',event=>{if(event.target instanceof Element&&event.target.closest('.photo-card,.image-stage'))event.preventDefault()});
}

const header=$('.site-header'),navLinks=$$('.site-header nav a');
let queued=false;
function updateNavigation(){
  queued=false;const height=header?.getBoundingClientRect().height||80;root.style.setProperty('--header-height',`${height}px`);
  const sections=['work','experience','about','contact'].map(id=>document.getElementById(id)).filter(Boolean);
  let selected=document.body.dataset.case?'work':null;
  for(const section of sections)if(section.getBoundingClientRect().top<=height+Math.min(180,innerHeight*.2))selected=section.id;
  if(sections.length&&scrollY>0&&scrollY+innerHeight>=document.documentElement.scrollHeight-4)selected='contact';
  navLinks.forEach(link=>{if(link.hash===`#${selected}`)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current')});
  $('.back-top')?.classList.toggle('is-visible',scrollY>500);
}
function scheduleNavigation(){if(!queued){queued=true;requestAnimationFrame(updateNavigation)}}
window.addEventListener('scroll',scheduleNavigation,{passive:true});window.addEventListener('resize',scheduleNavigation);
if('ResizeObserver' in window){new ResizeObserver(scheduleNavigation).observe(document.body)}
updateNavigation();
})();

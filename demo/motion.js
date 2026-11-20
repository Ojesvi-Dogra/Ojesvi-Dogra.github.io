'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const animate=(el,frames,options={})=>(reduced.matches||document.documentElement.classList.contains('motion-off'))?null:el.animate(frames,{duration:280,easing:'cubic-bezier(.2,.7,.2,1)',...options});
const jobs=$$('.job');jobs.forEach((e,i)=>e.id='role-'+i);
// Honest, evidence-linked skill explanations.
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
const panel=document.createElement('div');panel.className='skill-evidence';panel.id='skill-evidence';panel.setAttribute('role','region');panel.setAttribute('aria-label','Skill in practice');panel.innerHTML='<p class="eyebrow">SKILLS IN PRACTICE</p><h3>Explore the experience behind a skill.</h3><p>Select a skill above to see where it fits into my work.</p>';$('#skills').append(panel);
$$('#skills .chips li').forEach((li,i)=>{const label=li.textContent.trim();li.style.setProperty('--chip-delay',`${i%4*50}ms`);li.innerHTML='';const b=document.createElement('button');b.textContent=label;b.type='button';b.setAttribute('aria-pressed','false');b.setAttribute('aria-controls','skill-evidence');li.append(b);b.addEventListener('click',()=>{const before=panel.getBoundingClientRect().height;$$('#skills .chips button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));const [text,role]=evidence[label];panel.innerHTML=`<p class="eyebrow">${role===null?'TOOLKIT / EXAMPLE TO ADD':'USED IN PRACTICE'}</p><h3>${label}</h3><p>${text}</p>${role!==null?`<a class="evidence-link" href="#role-${role}">View related experience <span aria-hidden="true">↗</span></a>`:''}`;animate(panel,[{height:before+'px',opacity:.6},{height:panel.getBoundingClientRect().height+'px',opacity:1}]);if(role!==null){$('.evidence-link',panel).addEventListener('click',()=>{jobs[role].querySelector('details').open=true;setActive('experience');setTimeout(()=>animate(jobs[role],[{background:'#e5f0ff'},{background:'transparent'}],{duration:1200}),150)})}})});
// Reliable accordion animation in browsers without intrinsic-size transitions.
$$('.experience-details').forEach(d=>{let busy=false;const summary=$('summary',d),content=$('.experience-content',d);summary.addEventListener('click',e=>{if(reduced.matches||document.documentElement.classList.contains('motion-off'))return;e.preventDefault();if(busy)return;busy=true;const opening=!d.open;const start=d.getBoundingClientRect().height;if(opening)d.open=true;const end=opening?d.getBoundingClientRect().height:summary.getBoundingClientRect().height;d.style.overflow='hidden';const a=animate(d,[{height:start+'px'},{height:end+'px'}],{duration:280});summary.classList.toggle('closing',!opening);a.onfinish=()=>{if(!opening)d.open=false;d.style.overflow='';summary.classList.remove('closing');busy=false};if(opening)animate(content,[{opacity:0,transform:'translateY(-5px)'},{opacity:1,transform:'translateY(0)'}])})});
// Project concepts replace empty prompts without asserting completed work.
const projects=[{name:'Family Finance Dashboard',category:'Personal',type:'dashboard',desc:'A clearer view of income, expenses, and family goals.',problem:'Household finances can become fragmented across sheets, categories, and years.',approach:'Concept: bring yearly summaries, category filters, and simple entry workflows together in one interface.',outcome:'Demo concept only. Connect verified source code, real screenshots, and tested results before presenting it as a completed project.'},{name:'Rust Log Explorer',category:'Personal',type:'terminal',desc:'Find the signal in a busy application log.',problem:'Large log files can make recurring errors difficult to investigate.',approach:'Proposed Rust project: parse structured logs, filter events, group recurring errors, and export a readable summary.',outcome:'Proposed project, not a shipped application. The visual below illustrates the intended experience.'},{name:'Retail Analytics',category:'Academic',type:'chart',desc:'Explore how products, pricing, and customers connect.',problem:'Sales totals alone do not explain profitability or customer purchasing behavior.',approach:'Case-study direction: combine category comparisons, profitability analysis, and customer insights into a concise dashboard.',outcome:'Illustrative presentation of an academic project direction. Add verified analysis artifacts and findings before launch.'},{name:'HR Workflow Assistant',category:'Academic',type:'workflow',desc:'Thoughtful automation, with people in the loop.',problem:'Repetitive HR questions and incoming requests can take time to classify and route.',approach:'Concept: classify a request, retrieve relevant guidance, and route sensitive decisions to a human reviewer.',outcome:'Illustrative concept inspired by HR use-case exploration. No production deployment or automated employment decision is claimed.'}];
function visual(p){if(p.type==='dashboard')return '<div class="preview-dash"><div class="mini-top">FAMILY LEDGER <span>ILLUSTRATION</span></div><div class="mini-boxes"><span>Income<b>↗</b></span><span>Expenses<b>↘</b></span><span>Savings<b>＋</b></span></div><div class="mini-bars">'+[38,58,42,72,61,88,75,95].map(n=>`<i style="height:${n}%"></i>`).join('')+'</div></div>';if(p.type==='terminal')return '<div class="preview-terminal"><div class="mini-top">● ● ● <span>log-explorer / concept</span></div><code><b>$</b> logscan --level error<br><br><b>✓</b> Parse events<br><b>✓</b> Group patterns<br><b>→</b> Explore the details <span class="caret">▍</span></code></div>';if(p.type==='chart')return '<div class="preview-chart"><div class="mini-top">RETAIL INSIGHTS <span>ILLUSTRATION</span></div><div class="chart-row"><span>Technology</span><i style="--w:85%"></i></div><div class="chart-row"><span>Furniture</span><i style="--w:67%"></i></div><div class="chart-row"><span>Office supplies</span><i style="--w:74%"></i></div><small>Explore patterns. Ask better questions.</small></div>';return '<div class="preview-workflow"><div class="mini-top">WORKFLOW CONCEPT</div><span>Incoming request</span><i>↓</i><span class="highlight">Classify & retrieve</span><i>↓</i><span>Human review</span></div>'}
const categories=$('.project-categories');categories.innerHTML='<div class="motion-project-grid"></div>';const grid=$('.motion-project-grid');projects.forEach((p,i)=>{const card=document.createElement('article');card.className='project-card enhanced-card';card.dataset.category=p.category;card.innerHTML=`<div class="project-illustration ${p.type}" aria-label="Illustrative preview of ${p.name}">${visual(p)}</div><div class="card-copy"><span class="eyebrow">${p.category} / CONCEPT</span><h3>${p.name}</h3><p>${p.desc}</p><button class="project-details-button" aria-haspopup="dialog" data-project="${i}">Explore concept <span aria-hidden="true">↗</span></button></div>`;grid.append(card)});$('.project-toolbar [role=status]').textContent='4 concepts · Illustrative previews';
const filterGroup=$('.filter-group'),pill=document.createElement('span');pill.className='filter-pill';pill.setAttribute('aria-hidden','true');filterGroup.prepend(pill);function movePill(b){pill.style.width=b.offsetWidth+'px';pill.style.transform=`translateX(${b.offsetLeft-4}px)`}let filtering=false;$$('button',filterGroup).forEach(b=>b.addEventListener('click',async()=>{if(filtering)return;filtering=true;const filter=b.textContent;$$('button',filterGroup).forEach(x=>x.setAttribute('aria-pressed',String(x===b)));movePill(b);const cards=$$('.enhanced-card');const previous=new Map(cards.map(c=>[c,c.getBoundingClientRect()]));const leaving=cards.filter(c=>!c.hidden&&filter!=='All'&&c.dataset.category!==filter);await Promise.all(leaving.map(c=>animate(c,[{opacity:1},{opacity:0,transform:'translateY(8px)'}],{duration:140})?.finished));cards.forEach(c=>{c.hidden=filter!=='All'&&c.dataset.category!==filter});cards.filter(c=>!c.hidden).forEach(c=>{const now=c.getBoundingClientRect(),old=previous.get(c);animate(c,[{opacity:.35,transform:`translate(${old.width?old.left-now.left:0}px,${old.width?old.top-now.top:12}px)`},{opacity:1,transform:'translate(0,0)'}],{duration:320})});$('.project-toolbar [role=status]').textContent=`${cards.filter(c=>!c.hidden).length} concepts · Illustrative previews`;filtering=false}));movePill($('button',filterGroup));window.addEventListener('resize',()=>movePill($('button[aria-pressed=true]',filterGroup)));
// Dialog lifecycle: focus restoration, Escape, backdrop, reduced motion.
let lastOpener=null,previousOverflow='';
function showDialog(d){lastOpener=document.activeElement;previousOverflow=document.body.style.overflow;d.classList.remove('is-closing');d.showModal();document.body.style.overflow='hidden';d.querySelector('button')?.focus()}
async function hideDialog(d){if(d.classList.contains('is-closing')||!d.open)return;d.classList.add('is-closing');if(!reduced.matches&&!document.documentElement.classList.contains('motion-off'))await new Promise(r=>setTimeout(r,190));d.close();d.classList.remove('is-closing')}
$$('dialog').forEach(d=>{
 d.addEventListener('close',()=>{document.body.style.overflow=previousOverflow;const target=lastOpener?.closest('[inert],[hidden]')?$('.carousel-slide[aria-hidden="false"] .photo-button'):lastOpener;target?.focus()});
 d.addEventListener('keydown',e=>{if(e.key!=='Tab')return;const controls=$$('button,a[href],[tabindex="0"]',d).filter(el=>!el.hidden&&!el.disabled);const first=controls[0],last=controls.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus()}});
});
$$('dialog').forEach(d=>{d.addEventListener('cancel',e=>{e.preventDefault();if(d.classList.contains('lightbox'))closePhoto();else hideDialog(d)});d.addEventListener('click',e=>{if(e.target===d){if(d.classList.contains('lightbox'))closePhoto();else hideDialog(d)}})});
const projectDialog=$('.project-dialog');$$('[data-project]').forEach(b=>b.addEventListener('click',()=>{const p=projects[+b.dataset.project];$('.project-dialog-content').innerHTML=`<button class="project-dialog-close" aria-label="Close project details">×</button><p class="eyebrow">${p.category} / PROJECT CONCEPT</p><h2 id="project-detail-title">${p.name}</h2><div class="project-illustration dialog-illustration ${p.type}">${visual(p)}</div><p class="project-template-note">Illustrative concept · not a claim of completed delivery</p><section><h3>The problem</h3><p>${p.problem}</p></section><section><h3>The approach</h3><p>${p.approach}</p></section><section><h3>Evidence & next step</h3><p>${p.outcome}</p></section><button class="button secondary close-project-bottom">Back to projects</button>`;$('.project-dialog-close').onclick=()=>hideDialog(projectDialog);$('.close-project-bottom').onclick=()=>hideDialog(projectDialog);showDialog(projectDialog)}));
// Gallery: swipe, keyboard controls, caption fade, thumbnail-to-lightbox transition.
const photos=[['portfolio-2.CkDoJZnz_17qFQN.webp','Mountains & cloud'],['portfolio-1.DBMByDRv_Z1byAEd.webp','A little color on the road'],['portfolio-3.BfGVOm6V_1hePxR.webp','A moment outdoors']];let photo=0;const slides=$$('.carousel-slide'),photoDialog=$('.lightbox');function changePhoto(index){photo=(index+photos.length)%photos.length;$('.gallery-grid').style.transform=`translateX(-${photo*100}%)`;slides.forEach((s,i)=>{s.inert=i!==photo;s.setAttribute('aria-hidden',String(i!==photo))});$$('.carousel-dots button').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===photo)));$('.carousel-caption').textContent=`${photos[photo][1]} · ${photo+1} / 3`;animate($('.carousel-caption'),[{opacity:0,transform:'translateY(4px)'},{opacity:1,transform:'translateY(0)'}]);}
$('[aria-label="Previous carousel image"]').onclick=()=>changePhoto(photo-1);$('[aria-label="Next carousel image"]').onclick=()=>changePhoto(photo+1);$$('.carousel-dots button').forEach((b,i)=>b.onclick=()=>changePhoto(i));$('.gallery').addEventListener('keydown',e=>{if(photoDialog.open)return;if(e.key==='ArrowRight'){e.preventDefault();changePhoto(photo+1)}if(e.key==='ArrowLeft'){e.preventDefault();changePhoto(photo-1)}});let touchX=null;$('.carousel-viewport').addEventListener('touchstart',e=>touchX=e.touches[0].clientX,{passive:true});$('.carousel-viewport').addEventListener('touchend',e=>{if(touchX!==null){const delta=e.changedTouches[0].clientX-touchX;if(Math.abs(delta)>45)changePhoto(photo+(delta<0?1:-1));touchX=null}},{passive:true});
let photoClosing=false,photoAnimation=null;
function renderPhoto(){
  const preview=$('img',slides[photo]);
  const fullSource=`./static/${photos[photo][0]}`;
  $('.lightbox-inner').innerHTML=`<button class="lightbox-close" aria-label="Close photography viewer">×</button><span class="protected-image"><img src="${preview.currentSrc||preview.src}" alt="${preview.alt}" draggable="false" width="1000" height="720"><span class="image-copyright">© Ojesvi Dogra · All rights reserved</span></span><div class="lightbox-footer"><button aria-label="Previous enlarged photograph">←</button><p aria-live="polite">${photos[photo][1]} <span>· ${photo+1} / 3</span></p><button aria-label="Next enlarged photograph">→</button></div>`;
  // Keep the selected preview visible until the larger image has decoded.
  // The fixed image stage prevents loading or aspect ratios from resizing the dialog.
  const displayed=$('.lightbox-inner img'),fullImage=new Image();
  fullImage.src=fullSource;
  fullImage.decode().then(()=>{if(displayed.isConnected)displayed.src=fullSource}).catch(()=>{});
  $('.lightbox-close').onclick=closePhoto;
  $('[aria-label="Previous enlarged photograph"]').onclick=()=>{if(!photoClosing){changePhoto(photo-1);renderPhoto()}};
  $('[aria-label="Next enlarged photograph"]').onclick=()=>{if(!photoClosing){changePhoto(photo+1);renderPhoto()}};
}
$$('.photo-button').forEach((button,index)=>button.onclick=()=>{
  changePhoto(index);
  renderPhoto();
  showDialog(photoDialog);
  // One centered transition: no off-screen translation that expands the dialog's scroll area.
  photoAnimation=animate($('.lightbox-inner .protected-image'),[
    {transform:'translateY(8px) scale(.96)',opacity:0},
    {transform:'translateY(0) scale(1)',opacity:1}
  ],{duration:320,easing:'cubic-bezier(.16,1,.3,1)'});
});
async function closePhoto(){
  if(photoClosing||!photoDialog.open)return;
  photoClosing=true;
  const stage=$('.lightbox-inner .protected-image'),style=getComputedStyle(stage);
  const initial={transform:style.transform,opacity:style.opacity};
  photoAnimation?.cancel();
  photoAnimation=animate(stage,[initial,{transform:'translateY(6px) scale(.98)',opacity:0}],{duration:180,fill:'forwards'});
  // Fade the backdrop at the same time as the image instead of running two exits in sequence.
  try{await Promise.all([photoAnimation?.finished.catch(()=>{}),hideDialog(photoDialog)])}
  finally{photoAnimation?.cancel();photoAnimation=null;photoClosing=false}
}
photoDialog.addEventListener('keydown',event=>{
  if(photoClosing)return;
  if(event.key==='ArrowLeft'){event.preventDefault();changePhoto(photo-1);renderPhoto()}
  if(event.key==='ArrowRight'){event.preventDefault();changePhoto(photo+1);renderPhoto()}
});
// Reveal every main section when its leading edge enters the viewport.
// Content remains readable before JS, in print, and with reduced motion.
const scrollAnimations=new Set();
function revealSection(section){
  section.classList.add('motion-seen');
  if(reduced.matches)return;
  const play=(element,delay=0,distance=20)=>{
    const animation=animate(element,[
      {opacity:0,transform:`translateY(${distance}px)`},
      {opacity:1,transform:'translateY(0)'}
    ],{duration:650,delay,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'});
    if(animation){scrollAnimations.add(animation);animation.finished.then(()=>scrollAnimations.delete(animation)).catch(()=>scrollAnimations.delete(animation));}
  };
  play(section,0,28);
  const items=$$('.job,.skill-group,.education-item,.motion-project-card,.project-card,.contact-banner,.about-copy,.carousel',section);
  items.forEach((item,i)=>play(item,80+Math.min(i,5)*75,14));
}
const sectionObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{if(entry.isIntersecting){revealSection(entry.target);sectionObserver.unobserve(entry.target)}});
},{threshold:0,rootMargin:'0px 0px -8% 0px'});
$$('main > section, #experience, #skills, #education, #projects, #about, #contact, .hero').forEach(section=>sectionObserver.observe(section));
const stopScrollAnimations=()=>{scrollAnimations.forEach(animation=>animation.cancel());scrollAnimations.clear()};
reduced.addEventListener('change',()=>{if(reduced.matches)stopScrollAnimations()});
window.addEventListener('beforeprint',stopScrollAnimations);
// Active navigation and reading progress.
const nav=$('.desktop-nav');const underline=document.createElement('span');underline.className='nav-indicator';nav.append(underline);let pinned=location.hash.slice(1),manualUntil=0;const sections=['experience','skills','education','projects','about','contact'].map(id=>document.getElementById(id));
function setActive(id){if(id?.startsWith('role-'))id='experience';$$('.site-header nav a').forEach(a=>{if(a.hash==='#'+id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')});const a=$(`a[href="#${id}"]`,nav);underline.style.opacity=a?'1':'0';if(a){underline.style.width=a.offsetWidth+'px';underline.style.transform=`translateX(${a.offsetLeft}px)`}}
function updateScroll(){const total=document.documentElement.scrollHeight-innerHeight;$('.reading-progress').hidden=false;$('.reading-progress span').style.transform=`scaleX(${total>0?scrollY/total:0})`;const t=$('.timeline').getBoundingClientRect();$('.timeline').style.setProperty('--timeline-progress',Math.max(0,Math.min(1,(innerHeight*.65-t.top)/t.height)));if(Date.now()<manualUntil)return;const target=document.getElementById(pinned);if(target){const r=target.getBoundingClientRect();if(r.top<innerHeight*.65&&r.bottom>160){setActive(pinned);return}}const eligible=sections.filter(s=>s.getBoundingClientRect().top<=180);let current=eligible.sort((a,b)=>b.getBoundingClientRect().top-a.getBoundingClientRect().top)[0];if(scrollY+innerHeight>=document.documentElement.scrollHeight-6)current=$('#contact');setActive(current?.id)}
$$('.site-header nav a').forEach(a=>a.addEventListener('click',()=>{pinned=a.hash.slice(1);manualUntil=Date.now()+700;setActive(pinned);$('.mobile-nav')?.removeAttribute('open')}));window.addEventListener('hashchange',()=>{pinned=location.hash.slice(1);setActive(pinned)});let scheduled=false;window.addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(()=>{scheduled=false;updateScroll()})}},{passive:true});window.addEventListener('resize',updateScroll);new ResizeObserver(updateScroll).observe(document.body);updateScroll();
// Print includes expanded achievements and resets motion and overflow.
const printState=new Map;window.addEventListener('beforeprint',()=>{$$('details.experience-details').forEach(d=>{printState.set(d,d.open);d.open=true;d.getAnimations().forEach(a=>a.cancel())})});window.addEventListener('afterprint',()=>{printState.forEach((open,d)=>d.open=open);printState.clear()});$$('.print-button').forEach(b=>b.onclick=()=>window.print());

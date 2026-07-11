
(function(){
const DB_KEY='iea_html_game_section_db_v4_role_panels';
const THEME_KEY='iea_theme';
const $=(s,r=document)=>r.querySelector(s); const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const fmt=n=>Number(n||0).toLocaleString('en-IN');
const today=()=>new Date().toISOString().slice(0,10);
const params=new URLSearchParams(location.search);
function clone(x){return JSON.parse(JSON.stringify(x));}
function db(){let raw=localStorage.getItem(DB_KEY); if(!raw){localStorage.setItem(DB_KEY, JSON.stringify(clone(window.IEA_SEED))); raw=localStorage.getItem(DB_KEY)} return JSON.parse(raw)}
function saveDB(x){localStorage.setItem(DB_KEY,JSON.stringify(x)); if(window.IEA_Sheets&&window.IEA_Sheets.scheduleSync)window.IEA_Sheets.scheduleSync(x);}
function user(){try{return JSON.parse(localStorage.getItem('iea_current_user')||'null')}catch(e){return null}}
function setUser(u){localStorage.setItem('iea_current_user',JSON.stringify(u));}
function logout(){localStorage.removeItem('iea_current_user'); location.href='login.html'}
function toast(msg){let t=$('#toast'); if(!t){t=document.createElement('div');t.id='toast';t.className='toast';document.body.appendChild(t)} t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2600)}
function catTitle(slug){return (window.IEA_SEED.categories[slug]||[slug])[0]}
function catDesc(slug){return (window.IEA_SEED.categories[slug]||['',slug])[1]}
function byId(id){const d=db(); return d.activities.find(a=>a.id===id)}
function templateById(id){return window.IEA_SEED.templates.find(t=>t.id===id)}
function templatesFor(cat){return window.IEA_SEED.templates.filter(t=>t.category===cat)}
function activitiesFor(cat){return db().activities.filter(a=>a.category===cat)}
function isTeacher(u=user()){return u && (u.role==='admin'||u.role==='editor')}
function requireRole(roles){const u=user(); if(!u || !roles.includes(u.role)){toast('Please login first.'); setTimeout(()=>location.href='login.html',700); return null} return u}
function currentUserFull(){const u=user(); if(!u)return null; return db().users.find(x=>x.id===u.id)||u}
function iconSVG(){return `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M13 48V18l18-8 20 8v30" fill="none" stroke="currentColor" stroke-width="3"/><path d="M22 48V28h20v20M26 20h12M17 52h30" fill="none" stroke="currentColor" stroke-width="3"/><path d="M9 18c10-4 16-9 21-15M9 24c8-3 15-4 22-2" fill="none" stroke="currentColor" stroke-width="3"/></svg>`}
function illustration(kind='students'){return `<svg class="line-art" viewBox="0 0 720 520" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
<path class="green" d="M30 94C132 3 284 36 356 114c72 78 208 35 304-45"/><path d="M-10 190c145-90 242-77 334 0 91 77 210 95 413-30"/><path class="gold" d="M20 430c110-85 207-94 317-34 114 62 237 58 360-60"/>
<ellipse cx="220" cy="206" rx="42" ry="52"/><path d="M180 292c18-40 75-40 96 0l22 94H158z"/><path d="M205 196c18 13 39 16 60 7"/>
<circle cx="392" cy="192" r="46"/><path d="M350 285c18-52 78-62 106-4l34 106H318z"/><path d="M366 196c14 13 42 18 71 1"/>
<circle cx="500" cy="242" r="34"/><path d="M466 302c26-38 72-35 92 4l23 78H444z"/>
<rect class="fill-soft" x="286" y="308" width="150" height="92" rx="12"/><path class="green" d="M305 328h112M305 352h84M305 376h102"/>
<path class="gold" d="M596 136l22 20 22-20M617 156v66M584 222h66"/><path d="M97 370c23-65 29-122 20-170M126 371c35-70 64-119 103-154M90 267c36 11 58 37 69 78M141 248c25 4 45 22 59 49"/>
<circle class="green" cx="602" cy="96" r="13"/><path class="gold" d="M602 64v-23M602 151v-22M634 96h22M548 96h22M626 72l16-16M562 136l16-16"/>
</svg>`}
function nav(){const root=$('#nav-root'); if(!root)return; const u=user(); const page=document.body.dataset.page; const cats=Object.keys(window.IEA_SEED.categories); root.innerHTML=`<header class="nav"><div class="nav-inner"><a class="brand" href="index.html"><span class="logo">${iconSVG()}</span><span><strong>International English Academy</strong><small>Games · Tasks · Progress</small></span></a><button class="icon-btn menu" data-menu>☰</button><nav class="nav-links" data-links><a class="${page==='home'?'active':''}" href="tasks-games.html">Games Home</a>${cats.map(c=>`<a class="${page===c?'active':''}" href="${c}.html">${catTitle(c).replace(' & Speaking','')}</a>`).join('')}<a class="${page==='leaderboard'?'active':''}" href="leaderboard.html">Leaderboard</a></nav><div class="nav-actions"><button class="icon-btn" data-theme>◐</button>${u?`<a class="btn" href="${u.role==='student'?'student.html':u.role==='editor'?'editor.html':'admin.html'}">${u.name.split(' ')[0]}</a><button class="btn btn-danger" data-logout>Logout</button>`:`<a class="btn btn-primary" href="login.html">Login</a>`}</div></div></header>`;
$('[data-menu]',root)?.addEventListener('click',()=> $('[data-links]',root).classList.toggle('open')); $('[data-theme]',root)?.addEventListener('click',toggleTheme); $('[data-logout]',root)?.addEventListener('click',logout);
}
function initUI(){document.documentElement.dataset.theme=localStorage.getItem(THEME_KEY)||'dark'; nav(); setTimeout(()=>$('.loader')?.classList.add('hide'),950); document.addEventListener('mousemove',e=>{const c=$('.cursor-glow'); if(c){c.style.left=e.clientX+'px'; c.style.top=e.clientY+'px'}}); const io=new IntersectionObserver(entries=>entries.forEach(en=>{if(en.isIntersecting)en.target.classList.add('in')}),{threshold:.14}); $$('.reveal').forEach(el=>io.observe(el)); $$('.magnetic').forEach(el=>el.addEventListener('mousemove',e=>{const r=el.getBoundingClientRect(); el.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.12}px,${(e.clientY-r.top-r.height/2)*.12}px)`})); $$('.magnetic').forEach(el=>el.addEventListener('mouseleave',()=>el.style.transform=''))}
function toggleTheme(){const next=document.documentElement.dataset.theme==='dark'?'light':'dark'; document.documentElement.dataset.theme=next; localStorage.setItem(THEME_KEY,next)}
function progressStats(uid){const d=db(); const attempts=d.attempts.filter(a=>a.userId===uid); const xp=attempts.reduce((s,a)=>s+(a.xp||0),0)+(d.users.find(u=>u.id===uid)?.xp||0); const avg=attempts.length?Math.round(attempts.reduce((s,a)=>s+(a.score/a.possible*100),0)/attempts.length):0; const cats={}; attempts.forEach(a=>{cats[a.category]=cats[a.category]||[];cats[a.category].push(a.score/a.possible*100)}); return {attempts,xp,avg,cats};}
function pct(n){return Math.max(0,Math.min(100,Math.round(n||0)))}
function saveAttempt(activity, score, possible){const d=db(); const u=currentUserFull() || d.users.find(x=>x.role==='student'); const xp=Math.round((score/possible)*(activity.xp||100)); d.attempts.push({userId:u.id,activityId:activity.id,category:activity.category,title:activity.title,score,possible,xp,date:today()}); const du=d.users.find(x=>x.id===u.id); if(du){du.xp=(du.xp||0)+xp;du.streak=Math.max(1,du.streak||0); if(!du.badges)du.badges=[]; if(score/possible>=.8 && !du.badges.includes('Mastery Attempt'))du.badges.push('Mastery Attempt')} saveDB(d); confetti(); toast(`Score saved: ${score}/${possible} · +${xp} XP`)}
function confetti(){const box=document.createElement('div');box.className='confetti';document.body.appendChild(box);for(let i=0;i<70;i++){const p=document.createElement('i');p.style.left=Math.random()*100+'vw';p.style.top=(-10-Math.random()*30)+'px';p.style.background=Math.random()>.5?'var(--gold)':'var(--green)';p.style.animationDelay=Math.random()*.4+'s';box.appendChild(p)}setTimeout(()=>box.remove(),1400)}
function makeGeneratedActivity(category, templateId){const t=templateById(templateId)||templatesFor(category)[0]; const base={id:'generated-'+(t?.id||category),category:category,template:t?.name||'Activity',engine:t?.engine||'objective',title:t?.name||catTitle(category)+' Activity',level:'A1-C2',difficulty:'Template Demo',xp:80,instructions:'This is a ready-coded reusable template. Admins/editors only need to add title, instructions, questions, answers, media, passages, audio, vocabulary or prompts.'};
 if(base.engine==='flashcards')base.vocab=[{word:'clarity',meaning:'clear understanding',example:'Clarity improves communication.'},{word:'respond',meaning:'to answer thoughtfully',example:'Do not react; respond.'}];
 else if(base.engine==='matching')base.pairs=[{left:'raise',right:'awareness'},{left:'make',right:'progress'},{left:'speak',right:'clearly'}];
 else if(base.engine==='order')base.items=['I','am','learning','English','today'];
 else if(base.engine==='fill')base.questions=[{prompt:'She ___ English every day.','answer':'practises','hint':'Use present simple for habits.','explanation':'The subject is she, so the verb takes -s.'},{prompt:'They went ___ Kolkata yesterday.','answer':'to','hint':'Movement towards a place.','explanation':'Go/went to a place.'}];
 else if(base.engine==='reading'){base.passage='A learner becomes confident not only by knowing rules, but by using language in meaningful situations. When practice is connected with real life, English becomes less frightening and more useful.';base.questions=[{prompt:'What makes English less frightening?',options:['Meaningful practice','Only memorising rules','Avoiding speaking','Speaking fast'],answer:'Meaningful practice',hint:'Look at the second sentence.',explanation:'Practice connected with real life helps confidence.'}]}
 else if(base.engine==='listening'){base.transcript='Welcome to IEA. Today your task is to listen carefully, identify the key idea, and answer with confidence.';base.questions=[{prompt:'What should the learner identify?',options:['The key idea','The colour','The price','The address'],answer:'The key idea',hint:'Listen to the middle of the audio.',explanation:'The transcript asks the learner to identify the key idea.'}]}
 else if(base.engine==='writing'){base.prompt='Write a short paragraph about one habit that can improve your English. Give one example.';base.rubric=['Clear topic sentence','One real example','Correct punctuation','Minimum 80 words']}
 else if(base.engine==='speaking'||base.engine==='recording'){base.prompt='Speak for one minute about why English communication matters in daily life.';base.sampleText='English communication matters because it helps me express my thoughts clearly.';base.questions=[{prompt:'Before speaking, what is most useful?',options:['Prepare key points','Memorise without meaning','Speak too fast','Avoid examples'],answer:'Prepare key points',hint:'Good speaking needs organisation.',explanation:'Key points support fluency.'}]}
 else base.questions=[{prompt:'Choose the correct sentence.','options':['She go to class.','She goes to class.','She going to class.','She gone to class.'],answer:'She goes to class.',hint:'Present simple third person singular needs -s.','explanation':'She goes is correct.'}];
 return base;}
function home(){const root=$('#app'); if(!root)return; const cats=Object.keys(window.IEA_SEED.categories); const d=db(); root.innerHTML=`<section class="hero"><div class="container hero-grid"><div class="reveal"><p class="eyebrow">IEA Activity Engine · HTML Local Edition</p><h1 class="mega">Play. Practise. Track. Improve.</h1><p class="lead">A standalone game section for International English Academy. Students can log in, play skill games and see progress. Admins and editors can create new activities from reusable templates without touching code.</p><div class="hero-actions"><a class="btn btn-primary magnetic" href="login.html">Enter Portal</a><a class="btn btn-gold magnetic" href="grammar.html">Start Grammar</a><a class="btn magnetic" href="builder.html">Activity Builder</a></div><div class="trust"><span class="pill">120+ coded templates</span><span class="pill">No npm required</span><span class="pill">LocalStorage demo CMS</span><span class="pill">Works from HTML</span></div></div><div class="stage reveal">${illustration()}<div class="float-card one"><strong>${d.activities.length}</strong><span>activities ready</span></div><div class="float-card two"><strong>${d.users.filter(u=>u.role==='student').length}</strong><span>student profiles</span></div><div class="float-card three"><strong>XP</strong><span>badges & streaks</span></div></div></div></section><section class="section"><div class="container"><div class="section-head"><div><p class="eyebrow">Skill Worlds</p><h2 class="display">Separate pages for every learning area.</h2></div><p class="lead">Each page uses the same reusable engine but different templates, game styles, progress tracking and teacher-created content.</p></div><div class="grid grid-3">${cats.map(c=>`<a class="card category-card reveal magnetic" href="${c}.html"><div><div class="category-icon">${catEmoji(c)}</div><h3>${catTitle(c)}</h3><p>${catDesc(c)}</p></div><span class="badge">${templatesFor(c).length} templates</span></a>`).join('')}</div></div></section><section class="section"><div class="container grid grid-4">${['XP Points','Badges','Streaks','Leaderboards','Unlockable Levels','Daily Challenges','Mastery Indicators','Progress Maps'].map((x,i)=>`<div class="stat reveal"><strong>${i+1}</strong><span>${x}</span></div>`).join('')}</div></section>`}
function catEmoji(c){return {grammar:'✦',vocabulary:'◇',pronunciation:'◉',reading:'▰',listening:'◌','writing-speaking':'✎'}[c]||'•'}
function categoryPage(category){const root=$('#app'); if(!root)return; const acts=activitiesFor(category); const temps=templatesFor(category); root.innerHTML=`<section class="hero"><div class="container hero-grid"><div class="reveal"><p class="eyebrow">${catTitle(category)} Games</p><h1 class="mega">${catTitle(category)}</h1><p class="lead">${catDesc(category)}</p><div class="hero-actions"><a class="btn btn-primary" href="activity.html?category=${category}&template=${temps[0].id}">Play Template Demo</a>${isTeacher()?`<a class="btn btn-gold" href="builder.html?category=${category}">Create Activity</a>`:`<a class="btn" href="login.html">Login to Save Progress</a>`}</div></div><div class="stage reveal">${illustration(category)}<div class="float-card one"><strong>${temps.length}</strong><span>coded templates</span></div><div class="float-card two"><strong>${acts.length}</strong><span>live activities</span></div></div></div></section><section class="section"><div class="container"><div class="section-head"><div><p class="eyebrow">Playable Activities</p><h2 class="display">Ready activities in this skill.</h2></div><p class="lead">These can be replaced or expanded by admin/editor content through the builder.</p></div><div class="grid grid-3">${acts.map(a=>activityCard(a)).join('')||'<div class="empty">No activities yet. Use the builder to create one.</div>'}</div></div></section><section class="section"><div class="container"><div class="section-head"><div><p class="eyebrow">Reusable Templates</p><h2 class="display">All formats are registered and coded.</h2></div><p class="lead">Teachers add only content: title, instructions, questions, answers, passages, audio, media, vocabulary and prompts.</p></div><div class="grid grid-4">${temps.map(t=>`<article class="card template-card reveal"><small>${t.engine} engine</small><h3>${t.name}</h3><p>Dynamic content loading, scoring, hints, explanations and random question order are supported through the shared engine.</p><div class="actions"><a class="btn" href="activity.html?category=${category}&template=${t.id}">Demo</a>${isTeacher()?`<a class="btn btn-gold" href="builder.html?category=${category}&template=${t.id}">Build</a>`:''}</div></article>`).join('')}</div></div></section>`; setTimeout(initUI,0)}
function activityCard(a){return `<article class="card template-card reveal"><small>${a.template} · ${a.level||'All levels'}</small><h3>${a.title}</h3><p>${a.instructions||''}</p><div class="trust"><span class="tag">${a.difficulty||'Adaptive'}</span><span class="tag">${a.xp||100} XP</span><span class="tag">${a.engine}</span></div><div class="hero-actions"><a class="btn btn-primary" href="activity.html?id=${a.id}">Play</a>${isTeacher()?`<button class="btn" data-duplicate="${a.id}">Duplicate</button>`:''}</div></article>`}
function login(){const root=$('#app'); if(!root)return; root.innerHTML=`<section class="login-wrap"><div class="card login-card reveal"><p class="eyebrow">Portal Login</p><h1 class="display">Choose your role and enter IEA Games.</h1><div class="role-row" id="roleRow"><div class="role-pick active" data-role="student">Student</div><div class="role-pick" data-role="editor">Editor</div><div class="role-pick" data-role="admin">Admin</div></div><form class="form" id="loginForm" style="margin-top:18px"><div class="field"><label>Email</label><input class="input" name="email" value="student@iea.in"></div><div class="field"><label>Password</label><input class="input" type="password" name="password" value="student123"></div><button class="btn btn-primary" type="submit">Login</button></form><div class="card" style="margin-top:16px"><p><b>Demo logins</b></p><p class="lead" style="font-size:14px">Admin: admin@iea.in / admin123<br>Editor: editor@iea.in / editor123<br>Student: student@iea.in / student123</p></div></div></section>`; let role='student'; $$('.role-pick').forEach(x=>x.onclick=()=>{role=x.dataset.role;$$('.role-pick').forEach(y=>y.classList.remove('active'));x.classList.add('active'); const f=$('#loginForm'); f.email.value=role==='admin'?'admin@iea.in':role==='editor'?'editor@iea.in':'student@iea.in'; f.password.value=role==='admin'?'admin123':role==='editor'?'editor123':'student123';}); $('#loginForm').onsubmit=e=>{e.preventDefault(); const d=db(); const email=e.target.email.value.trim().toLowerCase(); const pass=e.target.password.value; const u=d.users.find(x=>x.email.toLowerCase()===email && x.password===pass); if(!u)return toast('Wrong email or password.'); setUser({id:u.id,name:u.name,email:u.email,role:u.role}); toast('Logged in successfully.'); setTimeout(()=>location.href=u.role==='student'?'student.html':u.role==='editor'?'editor.html':'admin.html',600)};}
function studentDashboard(){const u=requireRole(['student','admin','editor']); if(!u)return; const viewId=params.get('id')||u.id; const full=db().users.find(x=>x.id===viewId)||currentUserFull(); const st=progressStats(full.id); const root=$('#app'); const avg=st.avg||0; const attempts=st.attempts.slice(-6).reverse(); root.innerHTML=`<section class="hero"><div class="container hero-grid"><div class="reveal"><p class="eyebrow">Student Dashboard</p><h1 class="mega">Hello, ${full.name.split(' ')[0]}.</h1><p class="lead">Track XP, streaks, mastery, attempts and assigned games. Keep practising across grammar, vocabulary, pronunciation, reading, listening, writing and speaking.</p><div class="hero-actions"><a class="btn btn-primary" href="grammar.html">Play Now</a><a class="btn" href="leaderboard.html">Leaderboard</a></div></div><div class="stage reveal">${illustration('student')}<div class="float-card one"><strong>${fmt(st.xp)}</strong><span>Total XP</span></div><div class="float-card two"><strong>${full.streak||0}</strong><span>day streak</span></div></div></div></section><section class="section"><div class="container grid grid-4"><div class="stat reveal"><strong>${fmt(st.xp)}</strong><span>XP points</span></div><div class="stat reveal"><strong>${st.attempts.length}</strong><span>Completed attempts</span></div><div class="stat reveal"><strong>${avg}%</strong><span>Average score</span></div><div class="stat reveal"><strong>${(full.badges||[]).length}</strong><span>Badges</span></div></div></section><section class="section"><div class="container grid grid-2"><div class="card reveal"><p class="eyebrow">Mastery Map</p><h2>Skill progress</h2>${Object.keys(window.IEA_SEED.categories).map(c=>{const vals=st.cats[c]||[]; const v=vals.length?vals.reduce((a,b)=>a+b,0)/vals.length:0; return `<p>${catTitle(c)}</p><div class="progress"><i style="--v:${pct(v)}%"></i></div>`}).join('')}</div><div class="card reveal"><p class="eyebrow">Progress Map</p><h2>Unlockable learning path</h2><div class="map">${Array.from({length:21},(_,i)=>`<div class="node ${i<st.attempts.length+3?'done':''}">${i+1}</div>`).join('')}</div><h3>Badges</h3><p>${(full.badges||[]).map(b=>`<span class="badge">${b}</span>`).join(' ')||'No badges yet.'}</p></div></div></section><section class="section"><div class="container grid grid-2"><div class="card reveal"><p class="eyebrow">Recommended</p><h2>Daily challenges</h2><div class="grid">${db().activities.slice(0,5).map(a=>`<a class="leaderboard-row" href="activity.html?id=${a.id}"><span class="avatar">${catEmoji(a.category)}</span><span><b>${a.title}</b><br><small>${catTitle(a.category)} · ${a.xp||100} XP</small></span><span>Play →</span></a>`).join('')}</div></div><div class="card reveal"><p class="eyebrow">Recent Attempts</p><h2>Performance history</h2>${attempts.length?`<table class="table"><tr><th>Activity</th><th>Score</th><th>Date</th></tr>${attempts.map(a=>`<tr><td>${a.title}</td><td>${Math.round(a.score/a.possible*100)}%</td><td>${a.date}</td></tr>`).join('')}</table>`:'<div class="empty">No attempts yet.</div>'}</div></div></section>`}
function adminPage(role='admin'){const u=requireRole(role==='admin'?['admin']:['admin','editor']); if(!u)return; const d=db(); const students=d.users.filter(x=>x.role==='student'); const attempts=d.attempts; const root=$('#app'); root.innerHTML=`<section class="hero"><div class="container hero-grid"><div class="reveal"><p class="eyebrow">${role==='admin'?'Admin':'Editor'} Control Centre</p><h1 class="mega">Manage activities and progress.</h1><p class="lead">Create new tasks from templates, edit questions, assign homework, inspect student profiles and export reports. This HTML version uses LocalStorage as a demo CMS.</p><div class="hero-actions"><a class="btn btn-primary" href="builder.html">Create Activity</a><button class="btn btn-gold" data-export>Export CSV</button><button class="btn" data-reset>Reset Demo Data</button></div></div><div class="stage reveal">${illustration('admin')}<div class="float-card one"><strong>${d.activities.length}</strong><span>activities</span></div><div class="float-card two"><strong>${students.length}</strong><span>students</span></div><div class="float-card three"><strong>${attempts.length}</strong><span>attempts</span></div></div></div></section><section class="section"><div class="container grid grid-4"><div class="stat"><strong>${students.length}</strong><span>Students</span></div><div class="stat"><strong>${d.activities.length}</strong><span>Activities</span></div><div class="stat"><strong>${window.IEA_SEED.templates.length}</strong><span>Templates</span></div><div class="stat"><strong>${attempts.length}</strong><span>Attempts</span></div></div></section><section class="section"><div class="container grid grid-2"><div class="card reveal"><p class="eyebrow">Activity Library</p><h2>Created activities</h2><table class="table"><tr><th>Title</th><th>Skill</th><th>Actions</th></tr>${d.activities.map(a=>`<tr><td>${a.title}<br><small>${a.template}</small></td><td>${catTitle(a.category)}</td><td><a class="btn" href="activity.html?id=${a.id}">Play</a> <button class="btn" data-duplicate="${a.id}">Duplicate</button> <button class="btn" data-assign="${a.id}">Assign</button></td></tr>`).join('')}</table></div><div class="card reveal"><p class="eyebrow">Student Profiles</p><h2>Learner progress</h2><table class="table"><tr><th>Student</th><th>Level</th><th>XP</th><th>Profile</th></tr>${students.map(s=>`<tr><td>${s.name}</td><td>${s.level}</td><td>${progressStats(s.id).xp}</td><td><a class="btn" href="profile.html?id=${s.id}">Open</a></td></tr>`).join('')}</table></div></div></section><section class="section"><div class="container card reveal"><p class="eyebrow">Template Registry</p><h2>All game formats are ready for content.</h2><div class="grid grid-4">${window.IEA_SEED.templates.map(t=>`<div class="stat"><strong style="font-size:18px">${t.name}</strong><span>${catTitle(t.category)} · ${t.engine}</span></div>`).join('')}</div></div></section>`; wireAdminActions()}
function wireAdminActions(){ $$('[data-duplicate]').forEach(b=>b.onclick=()=>duplicateActivity(b.dataset.duplicate)); $$('[data-assign]').forEach(b=>b.onclick=()=>assignActivity(b.dataset.assign)); $('[data-export]')?.addEventListener('click',exportCSV); $('[data-reset]')?.addEventListener('click',()=>{if(confirm('Reset demo data?')){localStorage.removeItem(DB_KEY);toast('Demo data reset.');setTimeout(()=>location.reload(),600)}})}
function duplicateActivity(id){const d=db(); const a=d.activities.find(x=>x.id===id); if(!a)return; const cp=clone(a); cp.id=a.id+'-copy-'+Date.now(); cp.title=a.title+' Copy'; d.activities.push(cp); saveDB(d); toast('Activity duplicated.'); setTimeout(()=>location.reload(),500)}
function assignActivity(id){const d=db(); d.assignments.push({id:'as-'+Date.now(),activityId:id,assignedTo:'all',due:prompt('Due date YYYY-MM-DD','2026-07-05')||'',note:prompt('Homework note','Complete this before the next class.')||''}); saveDB(d); toast('Assigned to all students.')}
function exportCSV(){
  const d=db();
  const rows=[['student','email','level','task_given','task_completed','task_done_percent','average_best_score','activity','category','score','possible','xp','date']];
  d.users.filter(u=>u.role==='student').forEach(s=>{
    ensureStudentProfileFields(s);
    const stats=taskCompletionStats(d,s);
    const history=taskAttemptHistoryForStudent(d,s.id);
    if(history.length){
      history.forEach(a=>rows.push([s.name,s.email,s.level,stats.assignedCount,stats.completedCount,stats.taskDonePercent,stats.avgBest,a.title,a.category,a.score,a.possible,a.xp,a.date]));
    }else{
      rows.push([s.name,s.email,s.level,stats.assignedCount,stats.completedCount,stats.taskDonePercent,stats.avgBest,'','','','','','']);
    }
  });
  const csv=rows.map(r=>r.map(x=>'"'+String(x??'').replace(/"/g,'""')+'"').join(',')).join('\n');
  const blob=new Blob([csv],{type:'text/csv'}); const url=URL.createObjectURL(blob); const link=document.createElement('a');
  link.href=url; link.download='iea-profile-based-task-report.csv'; link.click(); URL.revokeObjectURL(url);
}
function profile(){
  const u=requireRole(['admin','editor','student']); if(!u)return;
  let id=params.get('id')||u.id; if(u.role==='student')id=u.id;
  const d=db(); const s=d.users.find(x=>x.id===id)||d.users.find(x=>x.role==='student'); ensureStudentProfileFields(s);
  const st=progressStats(s.id); const completion=taskCompletionStats(d,s);
  $('#app').innerHTML=`<section class="hero"><div class="container hero-grid"><div class="reveal"><p class="eyebrow">Student Profile</p><h1 class="mega">${esc(s.name)}</h1><p class="lead">Level ${esc(s.level)} · ${completion.completedCount}/${completion.assignedCount} tasks completed · ${completion.taskDonePercent}% task completion according to tasks given.</p><div class="hero-actions"><a class="btn btn-primary" href="student.html?id=${s.id}">Open Dashboard</a>${isTeacher()?`<a class="btn btn-gold" href="${u.role==='editor'?'editor':'admin'}.html?student=${s.id}#activity">Student Activity</a><a class="btn" href="${u.role==='editor'?'editor':'admin'}.html?student=${s.id}#profile-media">Edit Profile</a>`:''}</div></div><div class="stage reveal">${illustration('profile')}<div class="float-card one"><strong>${completion.taskDonePercent}%</strong><span>tasks done</span></div><div class="float-card two"><strong>${s.streak||0}</strong><span>streak</span></div></div></div></section><section class="section"><div class="container grid grid-2"><div class="card"><div class="student-profile-strip">${studentPhotoHTML(s)}<div><h2>${esc(s.name)}</h2><p class="profile-caption">${esc(s.profileCaption||'')}</p><span class="badge">${esc(s.level)}</span></div></div><div class="profile-completion-hero"><span>Profile-saved task completion</span><strong>${completion.taskDonePercent}%</strong><small>${completion.completedCount} completed out of ${completion.assignedCount} tasks given to this student.</small><div class="progress big-progress"><i style="--v:${completion.taskDonePercent}%"></i></div></div><h3>Skill Mastery</h3>${Object.keys(window.IEA_SEED.categories).map(c=>{const vals=st.cats[c]||[]; const v=vals.length?vals.reduce((a,b)=>a+b,0)/vals.length:0; return `<p>${catTitle(c)}</p><div class="progress"><i style="--v:${pct(v)}%"></i></div>`}).join('')}</div><div class="card"><p class="eyebrow">Tasks saved in profile</p><h2>Completion history</h2>${completion.records.length?`<table class="table"><tr><th>Task</th><th>Skill</th><th>Best</th><th>Attempts</th></tr>${completion.records.map(r=>`<tr><td>${esc(r.title)}</td><td>${catTitle(r.category)}</td><td>${r.bestPercent||0}%</td><td>${r.attempts||1}</td></tr>`).join('')}</table>`:'<div class="empty">No completed task saved in this profile yet.</div>'}</div></div></section>`;
}
function leaderboard(){const d=db(); const students=d.users.filter(u=>u.role==='student').map(s=>({...s,stats:progressStats(s.id)})).sort((a,b)=>b.stats.xp-a.stats.xp); $('#app').innerHTML=`<section class="hero"><div class="container"><p class="eyebrow">Gamification</p><h1 class="mega">IEA Leaderboard</h1><p class="lead">XP points, streaks, badges and mastery indicators motivate regular practice.</p></div></section><section class="section"><div class="container grid">${students.map((s,i)=>`<div class="leaderboard-row reveal"><span class="avatar">${i+1}</span><span><b>${s.name}</b><br><small>${s.level} · ${s.stats.attempts.length} attempts · ${(s.badges||[]).join(', ')}</small></span><strong>${fmt(s.stats.xp)} XP</strong></div>`).join('')}</div></section>`}
function builder(){const u=requireRole(['admin','editor']); if(!u)return; const d=db(); const cats=Object.keys(window.IEA_SEED.categories); const category=params.get('category')||'grammar'; const temp=params.get('template')||templatesFor(category)[0].id; $('#app').innerHTML=`<section class="hero"><div class="container"><p class="eyebrow">Teacher Activity Builder</p><h1 class="mega">Create once. Generate games automatically.</h1><p class="lead">Choose a template, add data, and the activity engine creates the playable task. Audio/images can be saved as local browser data URLs for demo use.</p></div></section><section class="section"><div class="container grid grid-2"><form class="card form" id="builderForm"><div class="field"><label>Category</label><select name="category" id="catSel">${cats.map(c=>`<option value="${c}" ${c===category?'selected':''}>${catTitle(c)}</option>`).join('')}</select></div><div class="field"><label>Template</label><select name="template" id="tempSel"></select></div><div class="field"><label>Title</label><input class="input" name="title" value="New IEA Activity"></div><div class="field"><label>Instructions</label><textarea name="instructions">Read the instructions and complete the task.</textarea></div><div class="field"><label>Level</label><input class="input" name="level" value="A2-B1"></div><div class="field"><label>Difficulty</label><select name="difficulty"><option>Easy</option><option selected>Medium</option><option>Hard</option></select></div><div class="field"><label>XP</label><input class="input" name="xp" type="number" value="100"></div><div class="field"><label>Passage / Transcript / Prompt</label><textarea name="bodyText">Add passage, transcript or speaking/writing prompt here.</textarea></div><div class="field"><label>Questions JSON</label><textarea name="questions" id="jsonBox"></textarea></div><div class="field"><label>Upload optional audio/image/text</label><input class="input" type="file" id="mediaFile" accept="audio/*,image/*,.txt"></div><input type="hidden" name="mediaData"><button class="btn btn-primary" type="submit">Save Activity</button></form><div class="card"><p class="eyebrow">Format Guide</p><h2>What teachers add</h2><p>For MCQ/fill tasks, add questions with prompt, options, answer, hint and explanation. For matching, add pairs. For flashcards, add vocabulary. For reading/listening, add passage or transcript plus questions. For writing/speaking, add prompt and rubric.</p><pre class="input" style="white-space:pre-wrap;min-height:260px" id="previewBox"></pre></div></div></section>`; function fillTemplates(){const c=$('#catSel').value; $('#tempSel').innerHTML=templatesFor(c).map(t=>`<option value="${t.id}">${t.name} · ${t.engine}</option>`).join(''); $('#tempSel').value = templatesFor(c).some(t=>t.id===temp)?temp:templatesFor(c)[0].id; updateSample()} function updateSample(){const t=templateById($('#tempSel').value); const sample=makeGeneratedActivity($('#catSel').value,$('#tempSel').value); $('#jsonBox').value=JSON.stringify({questions:sample.questions||[],pairs:sample.pairs||[],vocab:sample.vocab||[],items:sample.items||[],rubric:sample.rubric||[]},null,2); $('#previewBox').textContent=`Selected template: ${t.name}\nEngine: ${t.engine}\n\nThe engine will automatically render the correct UI from the content you add.`} fillTemplates(); $('#catSel').onchange=fillTemplates; $('#tempSel').onchange=updateSample; $('#mediaFile').onchange=e=>{const file=e.target.files[0]; if(!file)return; const reader=new FileReader(); reader.onload=()=>{document.querySelector('[name="mediaData"]').value=reader.result; toast('Media saved into this activity as local data.');}; reader.readAsDataURL(file)}; $('#builderForm').onsubmit=e=>{e.preventDefault(); const f=e.target; const t=templateById(f.template.value); let extra={}; try{extra=JSON.parse(f.questions.value||'{}')}catch(err){return toast('Questions JSON is not valid.')} const body=f.bodyText.value.trim(); const activity={id:'custom-'+Date.now(),category:f.category.value,template:t.name,engine:t.engine,title:f.title.value.trim()||'Untitled Activity',instructions:f.instructions.value,level:f.level.value,difficulty:f.difficulty.value,xp:Number(f.xp.value)||100,media:f.mediaData.value||''}; Object.assign(activity,extra); if(t.engine==='reading')activity.passage=body; else if(t.engine==='listening')activity.transcript=body; else if(t.engine==='writing'||t.engine==='speaking'||t.engine==='recording')activity.prompt=body; else activity.bodyText=body; const database=db(); database.activities.push(activity); saveDB(database); toast('Activity saved.'); setTimeout(()=>location.href=`activity.html?id=${activity.id}`,600)};}
function renderActivity(){const root=$('#app'); let activity=params.get('id')?byId(params.get('id')):null; if(!activity){activity=makeGeneratedActivity(params.get('category')||'grammar', params.get('template')||'');}
 const t0=Date.now(); const side=`<aside class="card side-panel"><p class="eyebrow">${catTitle(activity.category)}</p><h2>${activity.title}</h2><p>${activity.instructions||''}</p><div class="trust"><span class="tag">${activity.template}</span><span class="tag">${activity.level||'All levels'}</span><span class="tag">${activity.xp||100} XP</span></div>${activity.timeLimit?`<div class="timer" id="timer">${Math.ceil(activity.timeLimit/60)}:00</div>`:''}<div class="hero-actions"><a class="btn" href="${activity.category}.html">Back</a>${isTeacher()?`<a class="btn btn-gold" href="builder.html?category=${activity.category}">Build Similar</a>`:''}</div></aside>`; root.innerHTML=`<section class="section"><div class="container game-shell">${side}<main class="card" id="gameArea"></main></div></section>`; if(activity.timeLimit)startTimer(activity.timeLimit); const area=$('#gameArea'); const engine=activity.engine||'objective'; if(engine==='objective')renderObjective(area,activity); else if(engine==='fill')renderFill(area,activity); else if(engine==='matching')renderMatching(area,activity); else if(engine==='order')renderOrder(area,activity); else if(engine==='flashcards')renderFlashcards(area,activity); else if(engine==='reading')renderReading(area,activity); else if(engine==='listening')renderListening(area,activity); else if(engine==='writing')renderWriting(area,activity); else if(engine==='speaking'||engine==='recording')renderSpeaking(area,activity); else renderObjective(area,activity);}
function startTimer(sec){let left=sec; const el=$('#timer'); const int=setInterval(()=>{left--; if(left<0){clearInterval(int);toast('Time is over. Submit your answers.');return} const m=Math.floor(left/60),s=String(left%60).padStart(2,'0'); if(el)el.textContent=`${m}:${s}`},1000)}
function shuffled(arr){return clone(arr||[]).sort(()=>Math.random()-.5)}
function renderObjective(area,a){const qs=shuffled(a.questions||[]); area.innerHTML=`<p class="eyebrow">Auto-check Quiz</p><h1 class="display">${a.title}</h1><div id="qs">${qs.map((q,i)=>`<div class="question" data-answer="${esc(q.answer)}"><h3>${i+1}. ${q.prompt}</h3><div class="options">${(q.options||['True','False']).map(o=>`<button class="option" data-value="${esc(o)}">${o}</button>`).join('')}</div><button class="btn" data-hint>Hint</button><p class="hint" hidden>${q.hint||'Think about the rule.'}</p><p class="explanation">${q.explanation||''}</p></div>`).join('')}</div><button class="btn btn-primary" id="submitGame">Submit Answers</button>`; $$('.option',area).forEach(o=>o.onclick=()=>{$$('.option',o.parentElement).forEach(x=>x.classList.remove('selected'));o.classList.add('selected')}); $$('#qs [data-hint]',area).forEach(b=>b.onclick=()=>b.nextElementSibling.hidden=false); $('#submitGame').onclick=()=>{let sc=0; $$('.question',area).forEach(q=>{const sel=$('.option.selected',q); const ans=q.dataset.answer; q.classList.add('show'); if(sel&&sel.dataset.value===ans){sc++;sel.classList.add('correct')}else{sel?.classList.add('wrong'); $$('.option',q).find(x=>x.dataset.value===ans)?.classList.add('correct')}}); saveAttempt(a,sc,qs.length||1)}}
function renderFill(area,a){const qs=shuffled(a.questions||[]); area.innerHTML=`<p class="eyebrow">Fill / Rewrite Engine</p><h1 class="display">${a.title}</h1>${qs.map((q,i)=>`<div class="question" data-answer="${esc(q.answer)}"><h3>${i+1}. ${q.prompt}</h3><input class="input" placeholder="Type answer"><button class="btn" data-hint>Hint</button><p class="hint" hidden>${q.hint||''}</p><p class="explanation">${q.explanation||''}</p></div>`).join('')}<button class="btn btn-primary" id="submitGame">Check Answers</button>`; $$('[data-hint]',area).forEach(b=>b.onclick=()=>b.nextElementSibling.hidden=false); $('#submitGame').onclick=()=>{let sc=0; $$('.question',area).forEach(q=>{q.classList.add('show'); const v=$('input',q).value.trim().toLowerCase(); const ans=q.dataset.answer.trim().toLowerCase(); if(v===ans){sc++;$('input',q).style.borderColor='var(--ok)'}else $('input',q).style.borderColor='var(--danger)'}); saveAttempt(a,sc,qs.length||1)}}
function renderMatching(area,a){const pairs=a.pairs||[]; const rights=shuffled(pairs.map(p=>p.right)); area.innerHTML=`<p class="eyebrow">Matching Engine</p><h1 class="display">${a.title}</h1><p class="lead">Select the best match for each item.</p>${pairs.map((p,i)=>`<div class="question"><h3>${p.left}</h3><select data-answer="${esc(p.right)}"><option value="">Choose match</option>${rights.map(r=>`<option>${r}</option>`).join('')}</select></div>`).join('')}<button class="btn btn-primary" id="submitGame">Check Matches</button>`; $('#submitGame').onclick=()=>{let sc=0; $$('select',area).forEach(s=>{if(s.value===s.dataset.answer){sc++;s.style.borderColor='var(--ok)'}else s.style.borderColor='var(--danger)'}); saveAttempt(a,sc,pairs.length||1)}}
function renderOrder(area,a){const items=shuffled(a.items || (a.questions?.[0]?.answer || ['I','am','learning','English'])); area.innerHTML=`<p class="eyebrow">Sequence / Builder Engine</p><h1 class="display">${a.title}</h1><div class="sortable" id="sortList">${items.map(x=>`<div class="sort-item"><span>${x}</span><span class="sort-controls"><button data-up>↑</button><button data-down>↓</button></span></div>`).join('')}</div><button class="btn btn-primary" id="submitGame">Check Order</button>`; function wire(){ $$('[data-up]',area).forEach(b=>b.onclick=()=>{const it=b.closest('.sort-item'); if(it.previousElementSibling)it.parentElement.insertBefore(it,it.previousElementSibling)}); $$('[data-down]',area).forEach(b=>b.onclick=()=>{const it=b.closest('.sort-item'); if(it.nextElementSibling)it.parentElement.insertBefore(it.nextElementSibling,it)})} wire(); $('#submitGame').onclick=()=>{const cur=$$('#sortList .sort-item span:first-child').map(x=>x.textContent); const ans=a.items || (a.questions?.[0]?.answer || ['I','am','learning','English']); const ok=cur.join('|')===ans.join('|'); saveAttempt(a,ok?1:0,1); toast(ok?'Correct order.':'Not correct yet.')}}
function renderFlashcards(area,a){const vocab=a.vocab||[]; let i=0, flipped=false; const render=()=>{const v=vocab[i]||{word:'clarity',meaning:'clear understanding',example:'Clarity matters.'}; area.innerHTML=`<p class="eyebrow">Flashcard Engine</p><h1 class="display">${a.title}</h1><div class="flash-stage"><div class="flash-card" id="flash"><div>${flipped?`<p>${v.meaning}</p><small>${v.example||''}</small>`:`<h2>${v.word}</h2><p>Click to reveal meaning</p>`}</div></div></div><div class="hero-actions"><button class="btn" id="prev">Previous</button><button class="btn btn-gold" id="speak">Pronounce</button><button class="btn" id="fav">Save Word</button><button class="btn" id="next">Next</button><button class="btn btn-primary" id="done">Finish</button></div>`; $('#flash').onclick=()=>{flipped=!flipped;render()}; $('#prev').onclick=()=>{i=(i-1+vocab.length)%vocab.length;flipped=false;render()}; $('#next').onclick=()=>{i=(i+1)%vocab.length;flipped=false;render()}; $('#speak').onclick=()=>speak(v.word); $('#fav').onclick=()=>{const d=db();d.favourites.push({word:v.word,userId:user()?.id||'guest',date:today()});saveDB(d);toast('Word saved.')}; $('#done').onclick=()=>saveAttempt(a,vocab.length,vocab.length||1)}; render()}
function renderReading(area,a){area.innerHTML=`<p class="eyebrow">Reading Engine</p><h1 class="display">${a.title}</h1><div class="grid grid-2"><div><h3>Passage</h3><div class="reader" id="reader">${String(a.passage||'').split(/(?<=\.)\s+/).map(s=>`<p>${s}</p>`).join('')}</div><textarea class="input note-box" placeholder="Take notes here..."></textarea></div><div id="readQs"></div></div><button class="btn btn-primary" id="submitGame">Submit Reading Answers</button>`; $('#readQs').innerHTML=(a.questions||[]).map((q,i)=>`<div class="question" data-answer="${esc(q.answer)}"><h3>${i+1}. ${q.prompt}</h3><div class="options">${(q.options||[]).map(o=>`<button class="option" data-value="${esc(o)}">${o}</button>`).join('')}</div><button class="btn" data-hint>Hint</button><p class="hint" hidden>${q.hint||''}</p><p class="explanation">${q.explanation||''}</p></div>`).join(''); $$('#reader p').forEach(p=>p.onclick=()=>p.classList.toggle('marked')); $$('.option',area).forEach(o=>o.onclick=()=>{$$('.option',o.parentElement).forEach(x=>x.classList.remove('selected'));o.classList.add('selected')}); $$('[data-hint]',area).forEach(b=>b.onclick=()=>b.nextElementSibling.hidden=false); $('#submitGame').onclick=()=>{let sc=0; $$('.question',area).forEach(q=>{q.classList.add('show'); const sel=$('.option.selected',q); if(sel&&sel.dataset.value===q.dataset.answer){sc++;sel.classList.add('correct')}else{sel?.classList.add('wrong'); $$('.option',q).find(x=>x.dataset.value===q.dataset.answer)?.classList.add('correct')}}); saveAttempt(a,sc,(a.questions||[]).length||1)}}
function renderListening(area,a){area.innerHTML=`<p class="eyebrow">Listening Engine</p><h1 class="display">${a.title}</h1><div class="audio-box"><div class="audio-visual pause" id="wave"></div>${a.media?`<audio controls id="realAudio" src="${a.media}"></audio>`:''}<div class="hero-actions"><button class="btn btn-primary" id="playSpeak">Play Generated Audio</button><label class="pill">Speed <input type="range" min="0.6" max="1.4" step="0.1" value="1" id="speed"></label><button class="btn" id="subToggle">Toggle Subtitles</button></div><p class="lead" id="subs" hidden>${a.transcript||''}</p></div><div id="listenQs"></div><button class="btn btn-primary" id="submitGame">Submit Listening Answers</button>`; $('#listenQs').innerHTML=(a.questions||[]).map((q,i)=>`<div class="question" data-answer="${esc(q.answer)}"><h3>${i+1}. ${q.prompt}</h3><div class="options">${(q.options||[]).map(o=>`<button class="option" data-value="${esc(o)}">${o}</button>`).join('')}</div><button class="btn" data-hint>Hint</button><p class="hint" hidden>${q.hint||''}</p><p class="explanation">${q.explanation||''}</p></div>`).join(''); $('#subToggle').onclick=()=>$('#subs').hidden=!$('#subs').hidden; $('#playSpeak').onclick=()=>{ $('#wave').classList.remove('pause'); speak(a.transcript||'Listening activity', Number($('#speed').value),()=>$('#wave').classList.add('pause'))}; $$('.option',area).forEach(o=>o.onclick=()=>{$$('.option',o.parentElement).forEach(x=>x.classList.remove('selected'));o.classList.add('selected')}); $$('[data-hint]',area).forEach(b=>b.onclick=()=>b.nextElementSibling.hidden=false); $('#submitGame').onclick=()=>{let sc=0; $$('.question',area).forEach(q=>{q.classList.add('show'); const sel=$('.option.selected',q); if(sel&&sel.dataset.value===q.dataset.answer){sc++;sel.classList.add('correct')}else{sel?.classList.add('wrong'); $$('.option',q).find(x=>x.dataset.value===q.dataset.answer)?.classList.add('correct')}}); saveAttempt(a,sc,(a.questions||[]).length||1)}}
function renderWriting(area,a){area.innerHTML=`<p class="eyebrow">Writing Engine</p><h1 class="display">${a.title}</h1><div class="question"><h3>Prompt</h3><p class="lead">${a.prompt||'Write your response.'}</p></div><textarea class="input writing-area" id="writing" spellcheck="true" placeholder="Start writing here..."></textarea><div class="trust"><span class="pill" id="words">0 words</span><span class="pill" id="chars">0 characters</span><span class="pill">Draft autosaves locally</span></div><div class="card"><h3>Rubric</h3><div class="rubric">${(a.rubric||['Clear response','Relevant examples','Correct grammar','Good organisation']).map(r=>`<label><input type="checkbox" class="rub"> ${r}</label>`).join('')}</div></div><div class="hero-actions"><button class="btn" id="suggest">Show improvement suggestions</button><button class="btn btn-primary" id="submitGame">Save & Submit</button></div><div id="suggestions" class="empty" hidden></div>`; const key='draft-'+a.id; $('#writing').value=localStorage.getItem(key)||''; const count=()=>{const txt=$('#writing').value.trim(); $('#words').textContent=(txt?txt.split(/\s+/).length:0)+' words'; $('#chars').textContent=txt.length+' characters'; localStorage.setItem(key,$('#writing').value)}; $('#writing').addEventListener('input',count); count(); $('#suggest').onclick=()=>{const w=$('#writing').value.trim().split(/\s+/).filter(Boolean).length; $('#suggestions').hidden=false; $('#suggestions').innerHTML=`<b>Suggestions</b><br>${w<80?'Add more detail and one concrete example.':'Good length. Now check paragraphing and punctuation.'}<br>Try using connectors such as however, because, therefore and for example.`}; $('#submitGame').onclick=()=>{const checked=$$('.rub:checked').length; const words=$('#writing').value.trim().split(/\s+/).filter(Boolean).length; const score=Math.min(100, checked*18 + Math.min(28,Math.floor(words/4))); saveAttempt(a,score,100)}}
function renderSpeaking(area,a){area.innerHTML=`<p class="eyebrow">Speaking / Pronunciation Engine</p><h1 class="display">${a.title}</h1><div class="question"><h3>Prompt</h3><p class="lead">${a.prompt||a.sampleText||'Speak clearly for one minute.'}</p></div><div class="recorder-orb" id="orb"><b id="recTime">0s</b></div><div class="hero-actions"><button class="btn btn-primary" id="model">Play Model</button><button class="btn btn-gold" id="record">Start Recording</button><button class="btn" id="speech">Speech Recognition</button><button class="btn" id="submitGame">Finish</button></div><audio id="playback" controls hidden></audio><textarea class="input" id="transcript" placeholder="Speech recognition transcript appears here when supported."></textarea><div id="extraQs"></div>`; if(a.questions){$('#extraQs').innerHTML='<h3>Quick Check</h3>'+a.questions.map((q,i)=>`<div class="question" data-answer="${esc(q.answer)}"><h3>${i+1}. ${q.prompt}</h3><div class="options">${(q.options||[]).map(o=>`<button class="option" data-value="${esc(o)}">${o}</button>`).join('')}</div></div>`).join('')} $('#model').onclick=()=>speak(a.sampleText||a.prompt||'Speak clearly.'); let mediaRecorder,chunks=[],seconds=0,timer; $('#record').onclick=async()=>{if(mediaRecorder&&mediaRecorder.state==='recording'){mediaRecorder.stop();return} if(!navigator.mediaDevices)return toast('Recording needs browser microphone permission. Try Chrome/Edge.'); try{const stream=await navigator.mediaDevices.getUserMedia({audio:true}); mediaRecorder=new MediaRecorder(stream); chunks=[]; seconds=0; $('#orb').classList.add('recording'); $('#record').textContent='Stop Recording'; timer=setInterval(()=>{$('#recTime').textContent=(++seconds)+'s'},1000); mediaRecorder.ondataavailable=e=>chunks.push(e.data); mediaRecorder.onstop=()=>{clearInterval(timer);$('#orb').classList.remove('recording');$('#record').textContent='Start Recording'; const blob=new Blob(chunks,{type:'audio/webm'}); $('#playback').src=URL.createObjectURL(blob); $('#playback').hidden=false; stream.getTracks().forEach(t=>t.stop())}; mediaRecorder.start()}catch(err){toast('Microphone permission was not given.')}}; $('#speech').onclick=()=>{const SR=window.SpeechRecognition||window.webkitSpeechRecognition; if(!SR)return toast('Speech recognition is not supported in this browser.'); const r=new SR(); r.lang='en-IN'; r.continuous=false; r.interimResults=false; r.onresult=e=>$('#transcript').value=e.results[0][0].transcript; r.start()}; $$('.option',area).forEach(o=>o.onclick=()=>{$$('.option',o.parentElement).forEach(x=>x.classList.remove('selected'));o.classList.add('selected')}); $('#submitGame').onclick=()=>{let base=Math.min(70,seconds*4); let bonus=$('#transcript').value.trim()?20:0; saveAttempt(a,Math.min(100,base+bonus+10),100)}}
function speak(text,rate=1,onend){if(!('speechSynthesis' in window))return toast('Speech synthesis is not supported here.'); speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(text); u.lang='en-IN'; u.rate=rate; u.onend=onend||null; speechSynthesis.speak(u)}
function esc(s){return String(s??'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}


/* ============================================================
   IEA COMPLETE ROLE LOGIN + ADMIN/EDITOR/STUDENT MANAGEMENT
   This block intentionally overrides the earlier lightweight demo
   functions while keeping all working game engines unchanged.
   ============================================================ */
function defaultGroups(){return [
  {id:'grp-a1',name:'A1 Elementary Batch',level:'A1',description:'Current elementary learners'},
  {id:'grp-a2',name:'A2 Pre-Intermediate Batch',level:'A2',description:'Current pre-intermediate learners'},
  {id:'grp-b1',name:'B1 Intermediate Batch',level:'B1',description:'Current intermediate learners'},
  {id:'grp-b2',name:'B2 Higher Intermediate Batch',level:'B2',description:'Current higher-intermediate learners'},
  {id:'grp-club',name:'IEA Club Members',level:'Mixed',description:'Students attending clubs and extra practice sessions'}
]}
function normalizeDB(data){
  const seed=clone(window.IEA_SEED||{}); const d=data&&typeof data==='object'?data:seed;
  d.version=4; d.activities=Array.isArray(d.activities)?d.activities:[]; d.users=Array.isArray(d.users)?d.users:[];
  d.attempts=Array.isArray(d.attempts)?d.attempts:[]; d.activityEvents=Array.isArray(d.activityEvents)?d.activityEvents:[]; d.assignments=Array.isArray(d.assignments)?d.assignments:[]; d.favourites=Array.isArray(d.favourites)?d.favourites:[];
  d.groups=Array.isArray(d.groups)&&d.groups.length?d.groups:defaultGroups(); d.media=Array.isArray(d.media)?d.media:[]; d.notifications=Array.isArray(d.notifications)?d.notifications:[];
  const needUsers=[
    {id:'u-admin',name:'IEA Admin',email:'admin@iea.in',password:'admin123',role:'admin',level:'C2',avatar:'A'},
    {id:'u-admin-anshu',name:'Anshu Agarwal',email:'clickansh@gmail.com',password:'admin123',role:'admin',level:'C2',avatar:'A'},
    {id:'u-editor',name:'IEA Editor',email:'editor@iea.in',password:'editor123',role:'editor',level:'C1',avatar:'E'},
    {id:'u-student',name:'Demo Student',email:'student@iea.in',password:'student123',role:'student',level:'A2',avatar:'S',xp:460,streak:5,badges:['First Quiz','Grammar Starter'],groupIds:['grp-a2','grp-club']}
  ];
  needUsers.forEach(n=>{if(!d.users.some(u=>String(u.email).toLowerCase()===n.email.toLowerCase()))d.users.push(clone(n))});
  d.users.forEach(u=>{u.id=u.id||('u-'+Date.now()+Math.random().toString(16).slice(2));u.role=u.role||'student';u.password=u.password||'student123';u.avatar=u.avatar||String(u.name||'U').charAt(0).toUpperCase();if(u.role==='student'){ensureStudentProfileFields(u);u.xp=Number(u.xp||0);u.streak=Number(u.streak||0);u.badges=Array.isArray(u.badges)?u.badges:[];u.groupIds=Array.isArray(u.groupIds)?u.groupIds:groupsForLevel(u.level)}});
  d.activities.forEach(a=>{a.id=a.id||('activity-'+Date.now()+Math.random().toString(16).slice(2));a.status=a.status||'published';a.visibility=a.visibility||{mode:'all',groupIds:[],userIds:[],levels:[]};a.mediaItems=Array.isArray(a.mediaItems)?a.mediaItems:[];a.createdBy=a.createdBy||'seed';a.updatedAt=a.updatedAt||today()});
  migrateProfileTaskRecords(d);
  return d;
}
function db(){let raw=localStorage.getItem(DB_KEY); let data=null; if(raw){try{data=JSON.parse(raw)}catch(e){data=null}} if(!data)data=clone(window.IEA_SEED); data=normalizeDB(data); localStorage.setItem(DB_KEY,JSON.stringify(data)); return data}
function saveDB(x){const normalized=normalizeDB(x); localStorage.setItem(DB_KEY,JSON.stringify(normalized)); if(window.IEA_Sheets&&window.IEA_Sheets.scheduleSync)window.IEA_Sheets.scheduleSync(normalized);}
function groupsForLevel(level){const m={A1:['grp-a1'],A2:['grp-a2'],B1:['grp-b1'],B2:['grp-b2']};return m[level]||['grp-club']}
function groupName(id){return (db().groups.find(g=>g.id===id)||{}).name||id}
function userName(id){return (db().users.find(u=>u.id===id)||{}).name||id}
function groupOptions(selected=[]){const set=new Set(selected||[]); return db().groups.map(g=>`<option value="${g.id}" ${set.has(g.id)?'selected':''}>${g.name} (${g.level})</option>`).join('')}
function userOptions(selected=[]){const set=new Set(selected||[]); return db().users.filter(u=>u.role==='student').map(u=>`<option value="${u.id}" ${set.has(u.id)?'selected':''}>${u.name} · ${u.level}</option>`).join('')}
function levelChecks(name,selected=[]){const set=new Set(selected||[]);return ['A1','A2','B1','B2','C1','C2'].map(l=>`<label class="check-pill"><input type="checkbox" name="${name}" value="${l}" ${set.has(l)?'checked':''}> ${l}</label>`).join('')}
function selectedValues(sel){const el=$(sel);return el?Array.from(el.selectedOptions||[]).map(o=>o.value):[]}
function checkedValues(name,root=document){return $$(`input[name="${name}"]:checked`,root).map(x=>x.value)}
function visibilityLabel(a){const v=a.visibility||{mode:'all'}; if(v.mode==='hidden')return 'Hidden'; if(v.mode==='all')return 'All students'; if(v.mode==='groups')return (v.groupIds||[]).map(groupName).join(', ')||'No groups'; if(v.mode==='users')return (v.userIds||[]).map(userName).join(', ')||'No students'; if(v.mode==='levels')return (v.levels||[]).join(', ')||'No levels'; return ['Mixed',(v.groupIds||[]).length+' groups',(v.userIds||[]).length+' students',(v.levels||[]).length+' levels'].join(' · ')}
function canSeeActivity(a,u=user()){if(isTeacher(u))return true; if(!a || a.status==='draft')return false; const v=a.visibility||{mode:'all'}; if(v.mode==='hidden')return false; if(v.mode==='all'||!u)return v.mode==='all'; const full=db().users.find(x=>x.id===u.id)||u; const groupIds=full.groupIds||[]; if(v.mode==='groups')return (v.groupIds||[]).some(id=>groupIds.includes(id)); if(v.mode==='users')return (v.userIds||[]).includes(full.id); if(v.mode==='levels')return (v.levels||[]).includes(full.level); if(v.mode==='mixed')return (v.userIds||[]).includes(full.id)||(v.groupIds||[]).some(id=>groupIds.includes(id))||(v.levels||[]).includes(full.level); return false}
function visibleActivitiesFor(u=user(),category=''){return db().activities.filter(a=>(!category||a.category===category)&&canSeeActivity(a,u))}
/* === MERGED: student profile media + profile-based task completion === */
const levels=['A1','A2','B1','B2','C1','C2'];
function ensureStudentProfileFields(u){
  if(!u || u.role!=='student')return u;
  u.profilePhoto=u.profilePhoto||'';
  u.profileCaption=u.profileCaption||'Learning, practising and growing at International English Academy.';
  u.english=Object.assign({
    active:true,
    batch:u.batch||'',
    module:u.level?`Everyday English ${u.level}`:'Everyday English',
    level:u.level||'A2',
    progress:0,
    status:'Active',
    startDate:'',
    teacher:'IEA Trainer',
    receipts:[],
    certificates:[]
  },u.english||{});
  u.english.receipts=Array.isArray(u.english.receipts)?u.english.receipts:[];
  u.english.certificates=Array.isArray(u.english.certificates)?u.english.certificates:[];
  u.clubs=Object.assign({
    active:false,
    plan:'',
    memberSince:'',
    credits:0,
    memberships:[],
    receipts:[],
    attendance:[]
  },u.clubs||{});
  u.clubs.memberships=Array.isArray(u.clubs.memberships)?u.clubs.memberships:[];
  u.clubs.receipts=Array.isArray(u.clubs.receipts)?u.clubs.receipts:[];
  u.clubs.attendance=Array.isArray(u.clubs.attendance)?u.clubs.attendance:[];
  u.completedTasks=Array.isArray(u.completedTasks)?u.completedTasks:[];
  u.taskActivityEvents=Array.isArray(u.taskActivityEvents)?u.taskActivityEvents:[];
  return u;
}
function studentPhotoHTML(s,sizeClass=''){
  ensureStudentProfileFields(s);
  if(s.profilePhoto)return `<img class="profile-photo ${sizeClass}" src="${esc(s.profilePhoto)}" alt="${esc(s.name)} profile photo">`;
  return `<div class="profile-photo avatar-photo ${sizeClass}">${esc((s.name||'S').charAt(0).toUpperCase())}</div>`;
}
function profileCompletedRecords(s){ensureStudentProfileFields(s);return s.completedTasks;}
function taskAttemptHistoryForStudent(d,uid){
  const s=(d.users||[]).find(u=>u.id===uid); if(!s)return [];
  ensureStudentProfileFields(s);
  return (s.completedTasks||[]).flatMap(r=>{
    if(Array.isArray(r.history)&&r.history.length){
      return r.history.map(h=>({userId:s.id,activityId:r.activityId,category:r.category,title:r.title,score:Number(h.score||0),possible:Number(h.possible||1),xp:Number(h.xp||0),date:h.date||r.date||today(),timestamp:h.timestamp||r.lastCompletedAt||''}));
    }
    return [{userId:s.id,activityId:r.activityId,category:r.category,title:r.title,score:Number(r.bestScore||r.lastScore||0),possible:Number(r.bestPossible||r.lastPossible||1),xp:Number(r.xp||0),date:r.date||today(),timestamp:r.lastCompletedAt||''}];
  }).sort((a,b)=>String(a.timestamp||a.date||'').localeCompare(String(b.timestamp||b.date||'')));
}
function addProfileCompletion(s,a,score,possible,xp,now=new Date()){
  ensureStudentProfileFields(s);
  const possibleSafe=Number(possible)||1, scoreSafe=Number(score)||0;
  const percent=Math.round((scoreSafe/possibleSafe)*100);
  let rec=s.completedTasks.find(r=>r.activityId===a.id);
  if(!rec){
    rec={activityId:a.id,title:a.title,category:a.category,attempts:0,bestPercent:0,bestScore:0,bestPossible:possibleSafe,lastScore:0,lastPossible:possibleSafe,lastPercent:0,xp:0,date:today(),lastCompletedAt:'',history:[]};
    s.completedTasks.push(rec);
  }
  rec.title=a.title; rec.category=a.category; rec.attempts=Number(rec.attempts||0)+1;
  rec.lastScore=scoreSafe; rec.lastPossible=possibleSafe; rec.lastPercent=percent; rec.date=today(); rec.lastCompletedAt=now.toISOString();
  if(percent>=Number(rec.bestPercent||0)){rec.bestPercent=percent; rec.bestScore=scoreSafe; rec.bestPossible=possibleSafe;}
  rec.xp=Number(rec.xp||0)+Number(xp||0);
  rec.history=Array.isArray(rec.history)?rec.history:[];
  rec.history.push({score:scoreSafe,possible:possibleSafe,percent,xp:Number(xp||0),date:today(),timestamp:now.toISOString()});
  rec.history=rec.history.slice(-50);
  s.taskActivityEvents.push({type:'completed',activityId:a.id,title:a.title,category:a.category,score:scoreSafe,possible:possibleSafe,percent,xp:Number(xp||0),date:today(),timestamp:now.toISOString()});
  s.taskActivityEvents=s.taskActivityEvents.slice(-200);
}
function migrateProfileTaskRecords(d){
  (d.users||[]).filter(u=>u.role==='student').forEach(ensureStudentProfileFields);
  (d.attempts||[]).forEach(a=>{
    const s=(d.users||[]).find(u=>u.id===a.userId&&u.role==='student'); if(!s)return;
    ensureStudentProfileFields(s);
    if(s.completedTasks.some(r=>r.activityId===a.activityId))return;
    const act=(d.activities||[]).find(x=>x.id===a.activityId)||{id:a.activityId,title:a.title,category:a.category,xp:a.xp||100};
    const possible=Number(a.possible)||1, score=Number(a.score)||0, xp=Number(a.xp)||0;
    const percent=Math.round((score/possible)*100);
    s.completedTasks.push({activityId:act.id,title:a.title||act.title,category:a.category||act.category,attempts:1,bestPercent:percent,bestScore:score,bestPossible:possible,lastScore:score,lastPossible:possible,lastPercent:percent,xp,date:a.date||today(),lastCompletedAt:a.timestamp||((a.date||today())+'T00:00:00.000Z'),history:[{score,possible,percent,xp,date:a.date||today(),timestamp:a.timestamp||((a.date||today())+'T00:00:00.000Z')}]});
  });
  return d;
}
function taskCompletionStats(d,s){
  if(!s){s=d; d=db();}
  ensureStudentProfileFields(s);
  const assigned=visibleActivitiesFor(s);
  const assignedIds=new Set(assigned.map(a=>a.id));
  const records=profileCompletedRecords(s).filter(r=>assignedIds.has(r.activityId));
  const completedIds=new Set(records.map(r=>r.activityId));
  const notStarted=assigned.filter(a=>!completedIds.has(a.id));
  const completedCount=completedIds.size;
  const assignedCount=assigned.length;
  const taskDonePercent=assignedCount?Math.round((completedCount/assignedCount)*100):0;
  const avgBest=records.length?Math.round(records.reduce((sum,r)=>sum+Number(r.bestPercent||r.lastPercent||0),0)/records.length):0;
  return {assigned,assignedCount,records,completedIds,completedCount,notStarted,taskDonePercent,avgBest};
}
function parseLines(v,fields){
  return String(v||'').split('\n').map(x=>x.trim()).filter(Boolean).map(line=>{
    const parts=line.split('|').map(p=>p.trim()); const obj={};
    fields.forEach((f,i)=>obj[f]=parts[i]||'');
    return obj;
  });
}
function linesFrom(items,fields){
  return (items||[]).map(item=>fields.map(f=>item[f]||'').join(' | ')).join('\n');
}
function studentProfileMediaPanel(selected,students,role){
  ensureStudentProfileFields(selected);
  const page=role==='editor'?'editor':'admin';
  return `<div class="grid grid-2 profile-media-layout"><form class="card form profile-media-form" id="profileMediaForm"><p class="eyebrow">Profile Editing</p><h2>Student image and caption</h2><div class="field"><label>Select student</label><select id="profileStudentSelect" name="studentId">${students.map(s=>`<option value="${s.id}" ${s.id===selected.id?'selected':''}>${esc(s.name)} · ${esc(s.email)}</option>`).join('')}</select></div><div class="profile-uploader"><div class="profile-uploader-preview" id="profilePreview">${studentPhotoHTML(selected)}</div><div class="profile-uploader-copy"><h3>${esc(selected.name)}</h3><p class="profile-caption" id="captionPreview">${esc(selected.profileCaption||'')}</p><small class="lead">Upload an image, paste an image URL/data URL, and write the caption that appears in the student profile.</small></div></div><div class="field"><label>Upload student image</label><input class="input" id="profileImageFile" type="file" accept="image/*"></div><div class="field"><label>Image URL / data URL</label><input class="input" name="profilePhoto" value="${esc(selected.profilePhoto||'')}" placeholder="Paste image URL or upload from computer"></div><div class="field"><label>Student caption</label><textarea name="profileCaption" placeholder="Write a short caption for this learner">${esc(selected.profileCaption||'')}</textarea></div><div class="mini-actions"><button class="btn btn-primary" type="submit">Save Profile</button><button class="btn btn-danger" type="button" data-remove-profile-image>Remove Image</button><a class="btn" href="profile.html?id=${selected.id}">Open Student Profile</a></div></form><div class="card"><p class="eyebrow">Student gallery</p><h2>Profiles</h2><div class="student-card-gallery">${students.map(s=>{ensureStudentProfileFields(s);return `<a class="student-media-card ${s.id===selected.id?'active':''}" href="${page}.html?student=${s.id}#profile-media"><div class="student-media-photo">${studentPhotoHTML(s)}</div><div><h3>${esc(s.name)}</h3><p class="profile-caption">${esc(s.profileCaption||'')}</p><div class="trust"><span class="tag">${esc(s.level||'')}</span><span class="tag">${taskCompletionStats(db(),s).taskDonePercent}% tasks</span></div></div></a>`}).join('')}</div></div></div>`;
}
function studentAdminEditorForm(selected,students,role){
  ensureStudentProfileFields(selected);
  return `<form class="card form" id="studentRecordForm"><p class="eyebrow">Student Records</p><h2>Everyday English + IEA Clubs</h2><div class="field"><label>Select student</label><select id="recordStudentSelect" name="studentId">${students.map(s=>`<option value="${s.id}" ${s.id===selected.id?'selected':''}>${esc(s.name)} · ${esc(s.email)}</option>`).join('')}</select></div><input type="hidden" name="studentId" value="${selected.id}"><div class="grid grid-3"><div class="field"><label>Name</label><input class="input" name="name" value="${esc(selected.name)}"></div><div class="field"><label>Email</label><input class="input" name="email" value="${esc(selected.email)}"></div><div class="field"><label>Level</label><select name="level">${levels.map(l=>`<option ${selected.level===l?'selected':''}>${l}</option>`).join('')}</select></div></div><div class="grid grid-3"><div class="field"><label>English batch</label><input class="input" name="batch" value="${esc(selected.english.batch||'')}"></div><div class="field"><label>Module</label><input class="input" name="module" value="${esc(selected.english.module||'')}"></div><div class="field"><label>Progress %</label><input class="input" type="number" min="0" max="100" name="englishProgress" value="${Number(selected.english.progress||0)}"></div></div><div class="grid grid-3"><div class="field"><label>Club plan</label><input class="input" name="clubPlan" value="${esc(selected.clubs.plan||'')}"></div><div class="field"><label>Club credits</label><input class="input" type="number" name="clubCredits" value="${Number(selected.clubs.credits||0)}"></div><div class="field"><label>Member since</label><input class="input" name="memberSince" value="${esc(selected.clubs.memberSince||'')}"></div></div><div class="grid grid-2"><div class="field"><label>English receipts<br><small>title | amount | date | status</small></label><textarea name="englishReceipts">${esc(linesFrom(selected.english.receipts,['title','amount','date','status']))}</textarea></div><div class="field"><label>Certificates<br><small>title | module | date | status</small></label><textarea name="certificates">${esc(linesFrom(selected.english.certificates,['title','module','date','status']))}</textarea></div></div><div class="grid grid-2"><div class="field"><label>Club memberships<br><small>name | status | joined</small></label><textarea name="memberships">${esc(linesFrom(selected.clubs.memberships,['name','status','joined']))}</textarea></div><div class="field"><label>Club receipts<br><small>title | amount | date | status</small></label><textarea name="clubReceipts">${esc(linesFrom(selected.clubs.receipts,['title','amount','date','status']))}</textarea></div></div><button class="btn btn-primary" type="submit">Save Student Records</button></form>`;
}
function saveStudentRecord(form){
  const d=db(); const s=d.users.find(u=>u.id===form.studentId.value); if(!s)return toast('Student not found.');
  ensureStudentProfileFields(s);
  s.name=form.name.value.trim()||s.name; s.email=form.email.value.trim()||s.email; s.level=form.level.value; s.avatar=s.name.charAt(0).toUpperCase();
  s.english.batch=form.batch.value.trim(); s.english.module=form.module.value.trim(); s.english.level=s.level; s.english.progress=pct(Number(form.englishProgress.value||0));
  s.english.receipts=parseLines(form.englishReceipts.value,['title','amount','date','status']); s.english.certificates=parseLines(form.certificates.value,['title','module','date','status']);
  s.clubs.plan=form.clubPlan.value.trim(); s.clubs.credits=Number(form.clubCredits.value||0); s.clubs.memberSince=form.memberSince.value.trim();
  s.clubs.memberships=parseLines(form.memberships.value,['name','status','joined']); s.clubs.receipts=parseLines(form.clubReceipts.value,['title','amount','date','status']);
  saveDB(d); toast('Student records saved.'); setTimeout(()=>location.reload(),550);
}
function saveProfileMedia(form){
  const d=db(); const s=d.users.find(u=>u.id===form.studentId.value); if(!s)return toast('Student not found.');
  ensureStudentProfileFields(s); s.profilePhoto=form.profilePhoto.value.trim(); s.profileCaption=form.profileCaption.value.trim(); saveDB(d); toast('Profile image and caption saved.'); setTimeout(()=>location.reload(),550);
}
function updateProfilePreview(){
  const form=$('#profileMediaForm'); if(!form)return;
  const photo=form.profilePhoto.value.trim(), caption=form.profileCaption.value.trim(), name=$('#profileStudentSelect')?.selectedOptions?.[0]?.textContent?.split(' · ')[0]||'Student';
  $('#profilePreview').innerHTML=photo?`<img class="profile-photo" src="${esc(photo)}" alt="${esc(name)} preview">`:`<div class="profile-photo avatar-photo">${esc(name.charAt(0).toUpperCase())}</div>`;
  $('#captionPreview').textContent=caption||'';
}
function resizeImageForProfile(file){
  return new Promise((resolve,reject)=>{
    const reader=new FileReader();
    reader.onload=()=>{const img=new Image(); img.onload=()=>{const canvas=document.createElement('canvas'); const max=720; let w=img.width,h=img.height; if(Math.max(w,h)>max){if(w>h){h=Math.round(h*max/w);w=max}else{w=Math.round(w*max/h);h=max}} canvas.width=w; canvas.height=h; const ctx=canvas.getContext('2d'); ctx.drawImage(img,0,0,w,h); resolve(canvas.toDataURL('image/jpeg',0.86));}; img.onerror=reject; img.src=reader.result;};
    reader.onerror=reject; reader.readAsDataURL(file);
  });
}
function studentActivityPanel(d,students,selected,role){
  const chosen=selected||students[0]; const page=role==='editor'?'editor':'admin';
  const totalAssigned=students.reduce((sum,s)=>sum+taskCompletionStats(d,s).assignedCount,0);
  const totalDone=students.reduce((sum,s)=>sum+taskCompletionStats(d,s).completedCount,0);
  const overall=totalAssigned?Math.round(totalDone/totalAssigned*100):0;
  if(!chosen)return '<div class="empty">No student found.</div>';
  const stats=taskCompletionStats(d,chosen);
  return `<div class="activity-monitor"><div class="grid grid-4 monitor-stats"><div class="stat"><strong>${overall}%</strong><span>Overall task completion</span></div><div class="stat"><strong>${totalDone}/${totalAssigned}</strong><span>Completed / given</span></div><div class="stat"><strong>${students.length}</strong><span>Students tracked</span></div><div class="stat"><strong>${stats.avgBest}%</strong><span>${esc(chosen.name)} avg best</span></div></div><div class="grid grid-2 monitor-grid"><div class="card"><p class="eyebrow">All students</p><h2>Profile-based task progress</h2><div class="table-wrap"><table class="table"><tr><th>Student</th><th>Given</th><th>Done</th><th>Task done %</th><th>Open</th></tr>${students.map(s=>{const st=taskCompletionStats(d,s);return `<tr><td><b>${esc(s.name)}</b><br><small>${esc(s.email)} · ${esc(s.level)}</small></td><td>${st.assignedCount}</td><td>${st.completedCount}</td><td><b>${st.taskDonePercent}%</b><div class="progress mini-progress"><i style="--v:${st.taskDonePercent}%"></i></div></td><td><a class="btn" href="${page}.html?student=${s.id}#activity">View</a></td></tr>`}).join('')}</table></div></div><div class="card"><p class="eyebrow">Selected student</p><h2>${esc(chosen.name)}</h2><select class="input" id="activityStudentSelect">${students.map(s=>`<option value="${s.id}" ${s.id===chosen.id?'selected':''}>${esc(s.name)} · ${esc(s.email)}</option>`).join('')}</select><div class="profile-completion-hero"><div><span>Task completion</span><strong>${stats.taskDonePercent}%</strong><small>${stats.completedCount} completed out of ${stats.assignedCount} tasks given to this student.</small></div><div class="progress big-progress"><i style="--v:${stats.taskDonePercent}%"></i></div></div><div class="task-status-grid"><div><strong>${stats.assignedCount}</strong><span>Given</span></div><div><strong>${stats.completedCount}</strong><span>Completed</span></div><div><strong>${stats.notStarted.length}</strong><span>Not started</span></div></div><h3>Task status</h3><div class="table-wrap"><table class="table"><tr><th>Task</th><th>Skill</th><th>Status</th><th>Best</th></tr>${stats.assigned.map(a=>{const r=stats.records.find(x=>x.activityId===a.id);return `<tr><td>${esc(a.title)}</td><td>${catTitle(a.category)}</td><td><span class="activity-status ${r?'status-completed':'status-pending'}">${r?'Completed':'Not started'}</span></td><td>${r?`${r.bestPercent||0}%`:''}</td></tr>`}).join('')||'<tr><td colspan="4">No task has been given to this student yet.</td></tr>'}</table></div></div></div></div>`;
}
function receiptList(title,items,empty){
  return `<div class="receipt-list"><h3>${esc(title)}</h3>${(items||[]).length?(items||[]).map(x=>`<div class="receipt-item"><span><b>${esc(x.title||x.name||'Record')}</b><small>${esc([x.module,x.date,x.status,x.joined].filter(Boolean).join(' · '))}</small></span><strong>${esc(x.amount||'')}</strong></div>`).join(''):`<div class="empty">${esc(empty||'No records yet.')}</div>`}</div>`;
}
function everydayEnglishPage(){
  const u=requireRole(['student']); if(!u)return; const d=db(); const s=d.users.find(x=>x.id===u.id)||u; ensureStudentProfileFields(s); const st=taskCompletionStats(d,s);
  $('#app').innerHTML=`<section class="hero"><div class="container hero-grid"><div><p class="eyebrow">Everyday English</p><h1 class="mega">${esc(s.english.module||'Your Module')}</h1><p class="lead">${esc(s.english.batch||'Your batch')} · ${st.taskDonePercent}% of given tasks completed.</p><div class="hero-actions"><a class="btn btn-primary" href="student.html">Back to Student Panel</a><a class="btn" href="profile.html">Profile</a></div></div><div class="stage">${illustration('student')}<div class="float-card one"><strong>${pct(s.english.progress)}%</strong><span>module progress</span></div><div class="float-card two"><strong>${st.taskDonePercent}%</strong><span>task done</span></div></div></div></section><section class="section"><div class="container grid grid-2"><div class="card">${studentPhotoHTML(s)}<h2>${esc(s.name)}</h2><p class="profile-caption">${esc(s.profileCaption||'')}</p><div class="progress big-progress"><i style="--v:${pct(s.english.progress)}%"></i></div></div><div class="card">${receiptList('Receipts',s.english.receipts,'No receipts added.')}${receiptList('Certificates',s.english.certificates,'No certificates added.')}</div></div></section>`;
}
function ieaClubsPage(){
  const u=requireRole(['student']); if(!u)return; const d=db(); const s=d.users.find(x=>x.id===u.id)||u; ensureStudentProfileFields(s);
  $('#app').innerHTML=`<section class="hero"><div class="container hero-grid"><div><p class="eyebrow">IEA Clubs</p><h1 class="mega">${esc(s.clubs.plan||'Club Membership')}</h1><p class="lead">Credits, memberships, attendance and receipts for Awareness Club, Reading Club and Film Club.</p><div class="hero-actions"><a class="btn btn-primary" href="student.html">Back to Student Panel</a><a class="btn" href="profile.html">Profile</a></div></div><div class="stage">${illustration('clubs')}<div class="float-card one"><strong>${fmt(s.clubs.credits||0)}</strong><span>credits</span></div></div></div></section><section class="section"><div class="container grid grid-2"><div class="card"><p class="eyebrow">Memberships</p><h2>Active clubs</h2><div class="grid">${(s.clubs.memberships||[]).map(m=>`<div class="club-card"><h3>${esc(m.name)}</h3><p>${esc(m.status||'')} ${m.joined?`· joined ${esc(m.joined)}`:''}</p></div>`).join('')||'<div class="empty">No club memberships added.</div>'}</div></div><div class="card">${receiptList('Club receipts',s.clubs.receipts,'No club receipts added.')}</div></div></section>`;
}
function readFileAsDataURL(file){return new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve({id:'media-'+Date.now()+'-'+Math.random().toString(16).slice(2),name:file.name,type:file.type||'application/octet-stream',size:file.size,data:r.result,uploadedAt:today(),uploadedBy:user()?.id||'system'});r.onerror=reject;r.readAsDataURL(file)})}
function mediaIcon(m){const t=m.type||''; if(t.startsWith('audio/'))return 'Audio'; if(t.startsWith('image/'))return 'Image'; if(/presentation|powerpoint|ppt/i.test(t)||/\.pptx?$/i.test(m.name||''))return 'PPT'; if(/pdf/i.test(t)||/\.pdf$/i.test(m.name||''))return 'PDF'; return 'File'}
function resourceList(a){const items=[...(a.mediaItems||[])]; if(a.media && !items.some(m=>m.data===a.media))items.unshift({name:'Attached media',type:String(a.media).startsWith('data:image')?'image/*':'audio/*',data:a.media}); if(!items.length)return ''; return `<div class="resource-list"><h3>Resources</h3>${items.map(m=>`<a class="resource-chip" href="${m.data}" download="${esc(m.name||'resource')}" target="_blank"><b>${mediaIcon(m)}</b><span>${esc(m.name||'resource')}</span></a>`).join('')}</div>`}
function firstMediaOf(activity,typePrefix){return (activity.mediaItems||[]).find(m=>(m.type||'').startsWith(typePrefix))}
function saveAttempt(activity, score, possible){
  const d=db(); const u=currentUserFull();
  if(!u||u.role!=='student'){toast('Login as a student to save progress. Admin/editor previews are not saved.'); return}
  const scoreSafe=Number(score)||0, possibleSafe=Number(possible)||1;
  const xp=Math.round((scoreSafe/possibleSafe)*(activity.xp||100));
  const du=d.users.find(x=>x.id===u.id);
  if(du){
    ensureStudentProfileFields(du);
    addProfileCompletion(du,activity,scoreSafe,possibleSafe,xp,new Date());
    du.xp=(du.xp||0)+xp; du.streak=Math.max(1,du.streak||0); du.badges=Array.isArray(du.badges)?du.badges:[];
    if(scoreSafe/possibleSafe>=.8 && !du.badges.includes('Mastery Attempt'))du.badges.push('Mastery Attempt');
  }
  saveDB(d); confetti();
  const completion=du?taskCompletionStats(d,du):{completedCount:0,assignedCount:0,taskDonePercent:0};
  toast(`Saved to student profile: ${scoreSafe}/${possibleSafe} · ${completion.completedCount}/${completion.assignedCount} tasks done (${completion.taskDonePercent}%)`);
}
function progressStats(uid){
  const d=db(); const student=d.users.find(u=>u.id===uid)||{};
  if(student.role==='student')ensureStudentProfileFields(student);
  const attempts=student.role==='student'?taskAttemptHistoryForStudent(d,uid):d.attempts.filter(a=>a.userId===uid);
  const xp=Number(student.xp||0);
  const avg=attempts.length?Math.round(attempts.reduce((s,a)=>s+(Number(a.score||0)/(Number(a.possible)||1)*100),0)/attempts.length):0;
  const cats={}; attempts.forEach(a=>{cats[a.category]=cats[a.category]||[];cats[a.category].push(Number(a.score||0)/(Number(a.possible)||1)*100)});
  const completion=student.role==='student'?taskCompletionStats(d,student):{assignedCount:0,completedCount:0,taskDonePercent:0,records:[]};
  return {attempts,xp,avg,cats,completion};
}
function byId(id){return db().activities.find(a=>a.id===id)}
function activitiesFor(cat){return db().activities.filter(a=>a.category===cat)}
function activityCard(a){return `<article class="card template-card reveal"><small>${a.template} · ${a.level||'All levels'}</small><h3>${esc(a.title)}</h3><p>${esc(a.instructions||'')}</p><div class="trust"><span class="tag">${a.difficulty||'Adaptive'}</span><span class="tag">${a.xp||100} XP</span><span class="tag">${a.status||'published'}</span><span class="tag">${visibilityLabel(a)}</span></div><div class="hero-actions"><a class="btn btn-primary" href="activity.html?id=${a.id}">Play</a>${isTeacher()?`<a class="btn" href="builder.html?id=${a.id}">Edit</a><button class="btn" data-duplicate="${a.id}">Duplicate</button><button class="btn btn-danger" data-delete-activity="${a.id}">Delete</button>`:''}</div></article>`}
function login(){const root=$('#app'); if(!root)return; db(); root.innerHTML=`<section class="login-wrap"><div class="card login-card reveal"><p class="eyebrow">IEA Secure Local Portal</p><h1 class="display">Login to your panel.</h1><p class="lead">Students see assigned games. Editors and admins manage games, questions, media and group visibility.</p><div class="role-row" id="roleRow"><div class="role-pick active" data-role="student">Student</div><div class="role-pick" data-role="editor">Editor</div><div class="role-pick" data-role="admin">Admin</div></div><form class="form" id="loginForm" style="margin-top:18px"><div class="field"><label>Email</label><input class="input" name="email" value="student@iea.in" autocomplete="username"></div><div class="field"><label>Password</label><input class="input" type="password" name="password" value="student123" autocomplete="current-password"></div><button class="btn btn-primary" type="submit">Login</button><button class="btn" type="button" id="resetAccounts">Reset demo accounts</button></form><div class="card" style="margin-top:16px"><p><b>Demo logins</b></p><p class="lead" style="font-size:14px">Admin: admin@iea.in / admin123<br>Editor: editor@iea.in / editor123<br>Student: student@iea.in / student123<br>Anshu admin: clickansh@gmail.com / admin123</p></div></div></section>`; const creds={student:['student@iea.in','student123'],editor:['editor@iea.in','editor123'],admin:['admin@iea.in','admin123']}; $$('.role-pick').forEach(x=>x.onclick=()=>{$$('.role-pick').forEach(y=>y.classList.remove('active'));x.classList.add('active'); const f=$('#loginForm'); f.email.value=creds[x.dataset.role][0]; f.password.value=creds[x.dataset.role][1];}); $('#resetAccounts').onclick=()=>{if(confirm('Reset local portal data and restore demo accounts?')){localStorage.removeItem(DB_KEY);localStorage.removeItem('iea_current_user');db();toast('Demo accounts restored.');setTimeout(()=>location.reload(),600)}}; $('#loginForm').onsubmit=e=>{e.preventDefault(); const d=db(); const email=e.target.email.value.trim().toLowerCase(); const pass=e.target.password.value; const u=d.users.find(x=>String(x.email).toLowerCase()===email && String(x.password)===pass); if(!u)return toast('Wrong email or password. Use reset demo accounts if needed.'); setUser({id:u.id,name:u.name,email:u.email,role:u.role}); toast('Logged in successfully.'); setTimeout(()=>location.href=u.role==='student'?'student.html':u.role==='editor'?'editor.html':'admin.html',450)};}
function categoryPage(category){const root=$('#app'); if(!root)return; const u=user(); const acts=visibleActivitiesFor(u,category); const all=activitiesFor(category); const temps=templatesFor(category); root.innerHTML=`<section class="hero"><div class="container hero-grid"><div class="reveal"><p class="eyebrow">${catTitle(category)} Games</p><h1 class="mega">${catTitle(category)}</h1><p class="lead">${catDesc(category)}</p><div class="hero-actions"><a class="btn btn-primary" href="activity.html?category=${category}&template=${temps[0]?.id||''}">Play Template Demo</a>${isTeacher()?`<a class="btn btn-gold" href="builder.html?category=${category}">Create Activity</a><a class="btn" href="admin.html">Manage Visibility</a>`:`<a class="btn" href="login.html">Login for assigned games</a>`}</div></div><div class="stage reveal">${illustration(category)}<div class="float-card one"><strong>${temps.length}</strong><span>coded templates</span></div><div class="float-card two"><strong>${acts.length}</strong><span>${isTeacher()?'visible / '+all.length+' total':'available games'}</span></div></div></div></section><section class="section"><div class="container"><div class="section-head"><div><p class="eyebrow">Playable Activities</p><h2 class="display">${isTeacher()?'All created activities':'Activities available to you'}</h2></div><p class="lead">Admin/editor can decide which games appear for each group, level or individual student.</p></div><div class="grid grid-3">${acts.map(a=>activityCard(a)).join('')||'<div class="empty">No activities are currently assigned in this skill.</div>'}</div></div></section><section class="section"><div class="container"><div class="section-head"><div><p class="eyebrow">Reusable Templates</p><h2 class="display">All formats are registered and coded.</h2></div><p class="lead">Teachers add content: title, instructions, questions, answers, passages, audio, images, PPTs and prompts.</p></div><div class="grid grid-4">${temps.map(t=>`<article class="card template-card reveal"><small>${t.engine} engine</small><h3>${t.name}</h3><p>Dynamic content loading, scoring, hints, explanations and media attachments are supported.</p><div class="actions"><a class="btn" href="activity.html?category=${category}&template=${t.id}">Demo</a>${isTeacher()?`<a class="btn btn-gold" href="builder.html?category=${category}&template=${t.id}">Build</a>`:''}</div></article>`).join('')}</div></div></section>`; setTimeout(initUI,0)}
function studentDashboard(){const u=requireRole(['student','admin','editor']); if(!u)return; const viewId=params.get('id')||u.id; const d=db(); const full=d.users.find(x=>x.id===viewId)||currentUserFull(); const st=progressStats(full.id); const assigned=visibleActivitiesFor(full).slice(0,24); const attempts=st.attempts.slice(-8).reverse(); const root=$('#app'); root.innerHTML=`<section class="hero"><div class="container hero-grid"><div class="reveal"><p class="eyebrow">Student Dashboard</p><h1 class="mega">Hello, ${esc(full.name.split(' ')[0])}.</h1><p class="lead">Level ${full.level}. Groups: ${(full.groupIds||[]).map(groupName).join(', ')||'No group yet'}. Assigned games appear below.</p><div class="hero-actions"><a class="btn btn-primary" href="grammar.html">Play Assigned Games</a><a class="btn" href="leaderboard.html">Leaderboard</a>${isTeacher()?'<a class="btn btn-gold" href="admin.html">Manage Assignments</a>':''}</div></div><div class="stage reveal">${illustration('student')}<div class="float-card one"><strong>${fmt(st.xp)}</strong><span>Total XP</span></div><div class="float-card two"><strong>${assigned.length}</strong><span>assigned games</span></div></div></div></section><section class="section"><div class="container grid grid-4"><div class="stat reveal"><strong>${fmt(st.xp)}</strong><span>XP points</span></div><div class="stat reveal"><strong>${st.attempts.length}</strong><span>Completed attempts</span></div><div class="stat reveal"><strong>${st.avg||0}%</strong><span>Average score</span></div><div class="stat reveal"><strong>${(full.badges||[]).length}</strong><span>Badges</span></div></div></section><section class="section"><div class="container"><div class="section-head"><div><p class="eyebrow">Assigned Games</p><h2 class="display">Games available for your level and group.</h2></div><p class="lead">These are controlled from the Admin/Editor panels.</p></div><div class="grid grid-3">${assigned.map(a=>activityCard(a)).join('')||'<div class="empty">No games have been assigned to this student yet.</div>'}</div></div></section><section class="section"><div class="container grid grid-2"><div class="card reveal"><p class="eyebrow">Mastery Map</p><h2>Skill progress</h2>${Object.keys(window.IEA_SEED.categories).map(c=>{const vals=st.cats[c]||[]; const v=vals.length?vals.reduce((a,b)=>a+b,0)/vals.length:0; return `<p>${catTitle(c)}</p><div class="progress"><i style="--v:${pct(v)}%"></i></div>`}).join('')}</div><div class="card reveal"><p class="eyebrow">Recent Attempts</p><h2>Performance history</h2>${attempts.length?`<table class="table"><tr><th>Activity</th><th>Score</th><th>Date</th></tr>${attempts.map(a=>`<tr><td>${a.title}</td><td>${Math.round(a.score/a.possible*100)}%</td><td>${a.date}</td></tr>`).join('')}</table>`:'<div class="empty">No attempts yet.</div>'}<h3>Badges</h3><p>${(full.badges||[]).map(b=>`<span class="badge">${b}</span>`).join(' ')||'No badges yet.'}</p></div></div></section>`}
function adminPage(role='admin'){const u=requireRole(role==='admin'?['admin']:['admin','editor']); if(!u)return; const d=db(); const students=d.users.filter(x=>x.role==='student'); const teachers=d.users.filter(x=>x.role!=='student'); const attempts=d.attempts; const selectedId=params.get('student')||students[0]?.id; const selected=students.find(s=>s.id===selectedId)||students[0]; const root=$('#app'); const isAdmin=u.role==='admin'; root.innerHTML=`<section class="hero"><div class="container hero-grid"><div class="reveal"><p class="eyebrow">${isAdmin?'Admin':'Editor'} Control Centre</p><h1 class="mega">Manage games, questions, media and access.</h1><p class="lead">Create/edit/delete games, add questions and answers, attach audio, images and PPT files, and choose which students or groups can see each game.</p><div class="hero-actions"><a class="btn btn-primary" href="builder.html">Create New Game</a><button class="btn btn-gold" data-export>Export Reports CSV</button><button class="btn" data-reset>Reset Demo Data</button></div></div><div class="stage reveal">${illustration('admin')}<div class="float-card one"><strong>${d.activities.length}</strong><span>games</span></div><div class="float-card two"><strong>${students.length}</strong><span>students</span></div><div class="float-card three"><strong>${d.groups.length}</strong><span>groups</span></div></div></div></section><section class="section"><div class="container"><div class="panel-tabs"><button class="tab active" data-panel-tab="overview">Overview</button><button class="tab" data-panel-tab="games">Games</button><button class="tab" data-panel-tab="assign">Visibility</button><button class="tab" data-panel-tab="students">Students</button><button class="tab" data-panel-tab="activity">Student Activity</button><button class="tab" data-panel-tab="profile-media">Profile Editing</button><button class="tab" data-panel-tab="english-clubs">Everyday English + IEA Clubs</button><button class="tab" data-panel-tab="groups">Groups</button><button class="tab" data-panel-tab="media">Media</button><button class="tab" data-panel-tab="reports">Reports</button></div><div class="panel active" data-panel="overview"><div class="grid grid-4"><div class="stat"><strong>${students.length}</strong><span>Students</span></div><div class="stat"><strong>${teachers.length}</strong><span>Admin/Editors</span></div><div class="stat"><strong>${d.activities.length}</strong><span>Games</span></div><div class="stat"><strong>${students.reduce((sum,s)=>sum+taskCompletionStats(d,s).completedCount,0)}</strong><span>Tasks completed</span></div></div><div class="card" style="margin-top:18px"><h2>What this panel controls</h2><div class="grid grid-3"><div class="stat"><strong style="font-size:22px">Games</strong><span>Edit, duplicate, delete and build activities.</span></div><div class="stat"><strong style="font-size:22px">Questions</strong><span>Add MCQs, fill answers, matching pairs, passages, prompts and rubrics.</span></div><div class="stat"><strong style="font-size:22px">Media</strong><span>Attach audio, images, PDFs, documents and PPT files.</span></div></div></div></div><div class="panel" data-panel="games"><div class="section-head"><div><p class="eyebrow">Game Library</p><h2 class="display">Created games</h2></div><a class="btn btn-primary" href="builder.html">Create Game</a></div><div class="table-wrap"><table class="table"><tr><th>Game</th><th>Skill</th><th>Visibility</th><th>Status</th><th>Actions</th></tr>${d.activities.map(a=>`<tr><td><b>${esc(a.title)}</b><br><small>${esc(a.template)} · ${a.xp||100} XP · ${(a.mediaItems||[]).length} files</small></td><td>${catTitle(a.category)}</td><td>${visibilityLabel(a)}</td><td>${a.status}</td><td class="mini-actions"><a class="btn" href="activity.html?id=${a.id}">Play</a><a class="btn" href="builder.html?id=${a.id}">Edit</a><button class="btn" data-duplicate="${a.id}">Duplicate</button><button class="btn" data-assign="${a.id}">Assign</button><button class="btn btn-danger" data-delete-activity="${a.id}">Delete</button></td></tr>`).join('')}</table></div></div><div class="panel" data-panel="assign"><div class="card"><p class="eyebrow">Choose who can see a game</p><h2>Visibility and assignment manager</h2><form class="form" id="assignForm"><div class="field"><label>Game</label><select name="activityId">${d.activities.map(a=>`<option value="${a.id}">${esc(a.title)} · ${catTitle(a.category)}</option>`).join('')}</select></div><div class="field"><label>Visibility mode</label><select name="mode"><option value="all">All students</option><option value="groups">Only selected groups</option><option value="users">Only selected individual students</option><option value="levels">Only selected CEFR levels</option><option value="mixed">Groups + students + levels</option><option value="hidden">Hide from students</option></select></div><div class="grid grid-2"><div class="field"><label>Groups</label><select multiple name="groupIds">${groupOptions()}</select></div><div class="field"><label>Students</label><select multiple name="userIds">${userOptions()}</select></div></div><div class="field"><label>Levels</label><div class="check-grid">${levelChecks('assignLevels')}</div></div><button class="btn btn-primary" type="submit">Save Visibility</button></form></div></div><div class="panel" data-panel="students"><div class="grid grid-2"><div class="card"><p class="eyebrow">Student List</p><h2>Students and groups</h2><table class="table"><tr><th>Name</th><th>Level</th><th>Groups</th><th>Actions</th></tr>${students.map(s=>`<tr><td><b>${esc(s.name)}</b><br><small>${esc(s.email)} · pass: ${esc(s.password)}</small></td><td>${s.level}</td><td>${(s.groupIds||[]).map(groupName).join(', ')}</td><td class="mini-actions"><a class="btn" href="profile.html?id=${s.id}">Profile</a>${isAdmin?`<button class="btn btn-danger" data-delete-user="${s.id}">Delete</button>`:''}</td></tr>`).join('')}</table></div><div class="card"><p class="eyebrow">${isAdmin?'Add Student':'Student creation is admin-only'}</p><h2>Add / update access</h2>${isAdmin?`<form class="form" id="userForm"><div class="field"><label>Name</label><input class="input" name="name" required></div><div class="field"><label>Email</label><input class="input" name="email" type="email" required></div><div class="field"><label>Password</label><input class="input" name="password" value="student123" required></div><div class="field"><label>Role</label><select name="role"><option value="student">Student</option><option value="editor">Editor</option><option value="admin">Admin</option></select></div><div class="field"><label>Level</label><select name="level">${['A1','A2','B1','B2','C1','C2'].map(l=>`<option>${l}</option>`).join('')}</select></div><div class="field"><label>Groups</label><select multiple name="groupIds">${groupOptions()}</select></div><button class="btn btn-primary" type="submit">Save User</button></form>`:'<div class="empty">Editors can manage games and visibility but cannot create admin accounts.</div>'}</div></div></div><div class="panel" data-panel="activity">${studentActivityPanel(d,students,selected,role)}</div><div class="panel" data-panel="profile-media">${selected?studentProfileMediaPanel(selected,students,role):'<div class="empty">No student found.</div>'}</div><div class="panel" data-panel="english-clubs">${selected?studentAdminEditorForm(selected,students,role):'<div class="empty">No student found.</div>'}</div><div class="panel" data-panel="groups"><div class="grid grid-2"><div class="card"><p class="eyebrow">Groups</p><h2>Batches and access groups</h2><table class="table"><tr><th>Group</th><th>Level</th><th>Students</th><th></th></tr>${d.groups.map(g=>`<tr><td><b>${esc(g.name)}</b><br><small>${esc(g.description||'')}</small></td><td>${g.level}</td><td>${students.filter(s=>(s.groupIds||[]).includes(g.id)).length}</td><td><button class="btn btn-danger" data-delete-group="${g.id}">Delete</button></td></tr>`).join('')}</table></div><div class="card"><p class="eyebrow">Create Group</p><h2>Add a batch/group</h2><form class="form" id="groupForm"><div class="field"><label>Group Name</label><input class="input" name="name" required placeholder="Intermediate+ Module 1"></div><div class="field"><label>Level</label><select name="level"><option>A1</option><option>A2</option><option>B1</option><option>B2</option><option>C1</option><option>C2</option><option>Mixed</option></select></div><div class="field"><label>Description</label><textarea name="description" placeholder="Who this group is for"></textarea></div><button class="btn btn-primary" type="submit">Create Group</button></form></div></div></div><div class="panel" data-panel="media"><div class="grid grid-2"><div class="card"><p class="eyebrow">Media Library</p><h2>Upload audio, image, PPT, PDF or document</h2><p class="lead" style="font-size:13px">Media uploaded here also appears in the main academy website media section.</p><form class="form" id="mediaForm"><div class="field"><label>Files</label><input class="input" type="file" id="mediaLibraryFiles" multiple accept="audio/*,image/*,.ppt,.pptx,.pdf,.doc,.docx,.txt"></div><button class="btn btn-primary" type="submit">Add to Library</button><p class="lead" style="font-size:13px">Large PPT/video files may exceed browser LocalStorage. For a real website, these should be uploaded to a server or cloud storage.</p></form></div><div class="card"><p class="eyebrow">Saved Media</p><h2>${d.media.length} files</h2><div class="media-grid">${d.media.map(m=>`<div class="media-card"><b>${mediaIcon(m)}</b><span>${esc(m.name)}</span><small>${Math.round((m.size||0)/1024)} KB</small><a class="btn" href="${m.data}" download="${esc(m.name)}">Open</a><button class="btn btn-danger" data-delete-media="${m.id}">Delete</button></div>`).join('')||'<div class="empty">No media uploaded yet.</div>'}</div></div></div></div><div class="panel" data-panel="reports"><div class="card"><p class="eyebrow">Reports</p><h2>Student progress report</h2><table class="table"><tr><th>Student</th><th>Level</th><th>Groups</th><th>Given</th><th>Done</th><th>Task done %</th><th>Average</th><th>XP</th></tr>${students.map(s=>{const st=progressStats(s.id);const tc=taskCompletionStats(d,s);return `<tr><td>${esc(s.name)}</td><td>${s.level}</td><td>${(s.groupIds||[]).map(groupName).join(', ')}</td><td>${tc.assignedCount}</td><td>${tc.completedCount}</td><td>${tc.taskDonePercent}%</td><td>${st.avg}%</td><td>${fmt(st.xp)}</td></tr>`}).join('')}</table></div></div></div></section>`; wireAdminActions()}
function wireAdminActions(){
  $$('[data-panel-tab]').forEach(b=>b.onclick=()=>{$$('[data-panel-tab]').forEach(x=>x.classList.remove('active'));b.classList.add('active');$$('[data-panel]').forEach(p=>p.classList.toggle('active',p.dataset.panel===b.dataset.panelTab))});
  $$('[data-duplicate]').forEach(b=>b.onclick=()=>duplicateActivity(b.dataset.duplicate));
  $$('[data-delete-activity]').forEach(b=>b.onclick=()=>deleteActivity(b.dataset.deleteActivity));
  $$('[data-assign]').forEach(b=>b.onclick=()=>{const form=$('#assignForm'); if(form){$('[name="activityId"]',form).value=b.dataset.assign;$$('[data-panel-tab]').forEach(x=>x.classList.toggle('active',x.dataset.panelTab==='assign'));$$('[data-panel]').forEach(p=>p.classList.toggle('active',p.dataset.panel==='assign'));window.scrollTo({top:document.querySelector('[data-panel="assign"]').offsetTop-120,behavior:'smooth'});toast('Choose groups/students and save visibility.')}});
  $('[data-export]')?.addEventListener('click',exportCSV); $('[data-reset]')?.addEventListener('click',()=>{if(confirm('Reset all demo data?')){localStorage.removeItem(DB_KEY);localStorage.removeItem('iea_current_user');toast('Demo data reset.');setTimeout(()=>location.href='login.html',500)}});
  $('#assignForm')?.addEventListener('submit',e=>{e.preventDefault();const f=e.target;const d=db();const a=d.activities.find(x=>x.id===f.activityId.value);if(!a)return toast('Game not found.');a.visibility={mode:f.mode.value,groupIds:selectedValues('[name="groupIds"]'),userIds:selectedValues('[name="userIds"]'),levels:checkedValues('assignLevels',f)};a.updatedAt=today();saveDB(d);toast('Visibility saved.');setTimeout(()=>location.reload(),650)});
  $('#userForm')?.addEventListener('submit',e=>{e.preventDefault();const f=e.target;const d=db();const email=f.email.value.trim().toLowerCase();if(d.users.some(u=>String(u.email).toLowerCase()===email))return toast('That email already exists.');const newUser={id:'u-'+Date.now(),name:f.name.value.trim(),email,password:f.password.value,role:f.role.value,level:f.level.value,avatar:f.name.value.trim().charAt(0).toUpperCase(),xp:0,streak:0,badges:[],groupIds:selectedValues('#userForm [name="groupIds"]')};if(newUser.role==='student')ensureStudentProfileFields(newUser);d.users.push(newUser);saveDB(d);toast('User created.');setTimeout(()=>location.reload(),500)});
  $('#groupForm')?.addEventListener('submit',e=>{e.preventDefault();const f=e.target;const d=db();d.groups.push({id:'grp-'+Date.now(),name:f.name.value.trim(),level:f.level.value,description:f.description.value.trim()});saveDB(d);toast('Group created.');setTimeout(()=>location.reload(),500)});
  $('#mediaForm')?.addEventListener('submit',async e=>{e.preventDefault();const files=Array.from($('#mediaLibraryFiles')?.files||[]);if(!files.length)return toast('Choose files first.');const d=db();for(const file of files){d.media.push(await readFileAsDataURL(file))}saveDB(d);toast('Media added to library.');setTimeout(()=>location.reload(),500)});
  $('#profileStudentSelect')?.addEventListener('change',e=>{const page=document.body.dataset.page==='editor'?'editor.html':'admin.html'; location.href=`${page}?student=${encodeURIComponent(e.target.value)}#profile-media`;});
  $('#recordStudentSelect')?.addEventListener('change',e=>{const page=document.body.dataset.page==='editor'?'editor.html':'admin.html'; location.href=`${page}?student=${encodeURIComponent(e.target.value)}#english-clubs`;});
  $('#activityStudentSelect')?.addEventListener('change',e=>{const page=document.body.dataset.page==='editor'?'editor.html':'admin.html'; location.href=`${page}?student=${encodeURIComponent(e.target.value)}#activity`;});
  $('#studentRecordForm')?.addEventListener('submit',e=>{e.preventDefault();saveStudentRecord(e.target)});
  $('#profileMediaForm')?.addEventListener('submit',e=>{e.preventDefault();saveProfileMedia(e.target)});
  $('#profileMediaForm [name="profilePhoto"]')?.addEventListener('input',updateProfilePreview);
  $('#profileMediaForm [name="profileCaption"]')?.addEventListener('input',updateProfilePreview);
  $('#profileImageFile')?.addEventListener('change',async e=>{const file=e.target.files?.[0]; if(!file)return; const data=await resizeImageForProfile(file); const input=$('#profileMediaForm [name="profilePhoto"]'); if(input){input.value=data; updateProfilePreview(); toast('Image loaded. Save profile to keep it.')}});
  $('[data-remove-profile-image]')?.addEventListener('click',()=>{const input=$('#profileMediaForm [name="profilePhoto"]'); if(input){input.value=''; updateProfilePreview();}});
  $$('[data-delete-user]').forEach(b=>b.onclick=()=>{if(!confirm('Delete this user?'))return;const d=db();d.users=d.users.filter(u=>u.id!==b.dataset.deleteUser);saveDB(d);location.reload()});
  $$('[data-delete-group]').forEach(b=>b.onclick=()=>{if(!confirm('Delete this group? It will be removed from students and game visibility.'))return;const d=db();d.groups=d.groups.filter(g=>g.id!==b.dataset.deleteGroup);d.users.forEach(u=>u.groupIds=(u.groupIds||[]).filter(id=>id!==b.dataset.deleteGroup));d.activities.forEach(a=>{if(a.visibility)a.visibility.groupIds=(a.visibility.groupIds||[]).filter(id=>id!==b.dataset.deleteGroup)});saveDB(d);location.reload()});
  $$('[data-delete-media]').forEach(b=>b.onclick=()=>{if(!confirm('Delete this media file?'))return;const d=db();d.media=d.media.filter(m=>m.id!==b.dataset.deleteMedia);saveDB(d);location.reload()});
  const hash=location.hash.replace('#',''); if(hash){const btn=$(`[data-panel-tab="${hash}"]`); if(btn)btn.click();}
}
function deleteActivity(id){if(!confirm('Delete this game/activity?'))return; const d=db(); d.activities=d.activities.filter(a=>a.id!==id); d.attempts=d.attempts.filter(a=>a.activityId!==id); saveDB(d); toast('Game deleted.'); setTimeout(()=>location.reload(),500)}
function duplicateActivity(id){const d=db(); const a=d.activities.find(x=>x.id===id); if(!a)return; const cp=clone(a); cp.id='custom-copy-'+Date.now(); cp.title=a.title+' Copy'; cp.createdBy=user()?.id||'teacher'; cp.updatedAt=today(); d.activities.push(cp); saveDB(d); toast('Game duplicated.'); setTimeout(()=>location.reload(),500)}
function assignActivity(id){location.href='admin.html#assign'}
function builder(){const u=requireRole(['admin','editor']); if(!u)return; const d=db(); const editing=params.get('id')?byId(params.get('id')):null; const cats=Object.keys(window.IEA_SEED.categories); const category=params.get('category')||editing?.category||'grammar'; const temp=params.get('template')||window.IEA_SEED.templates.find(t=>t.name===editing?.template)?.id||templatesFor(category)[0]?.id; const v=editing?.visibility||{mode:'all',groupIds:[],userIds:[],levels:[]}; const sample=editing||makeGeneratedActivity(category,temp); const payload={questions:sample.questions||[],pairs:sample.pairs||[],vocab:sample.vocab||[],items:sample.items||[],rubric:sample.rubric||[]}; $('#app').innerHTML=`<section class="hero"><div class="container"><p class="eyebrow">${editing?'Edit Game':'Teacher Activity Builder'}</p><h1 class="mega">${editing?'Edit existing game.':'Create games without touching code.'}</h1><p class="lead">Add questions, answers, passages, prompts and media. Admin/editor can later choose groups, levels or individual students who can see the game.</p></div></section><section class="section"><div class="container grid grid-2"><form class="card form" id="builderForm"><input type="hidden" name="activityId" value="${editing?.id||''}"><div class="grid grid-2"><div class="field"><label>Category</label><select name="category" id="catSel">${cats.map(c=>`<option value="${c}" ${c===category?'selected':''}>${catTitle(c)}</option>`).join('')}</select></div><div class="field"><label>Template</label><select name="template" id="tempSel"></select></div></div><div class="field"><label>Title</label><input class="input" name="title" value="${esc(editing?.title||'New IEA Activity')}" required></div><div class="field"><label>Instructions</label><textarea name="instructions">${esc(editing?.instructions||'Read the instructions and complete the task.')}</textarea></div><div class="grid grid-3"><div class="field"><label>Level</label><input class="input" name="level" value="${esc(editing?.level||'A2-B1')}"></div><div class="field"><label>Difficulty</label><select name="difficulty">${['Easy','Medium','Hard','Adaptive'].map(x=>`<option ${x===(editing?.difficulty||'Medium')?'selected':''}>${x}</option>`).join('')}</select></div><div class="field"><label>XP</label><input class="input" name="xp" type="number" value="${editing?.xp||100}"></div></div><div class="grid grid-2"><div class="field"><label>Status</label><select name="status"><option value="published" ${(editing?.status||'published')==='published'?'selected':''}>Published</option><option value="draft" ${editing?.status==='draft'?'selected':''}>Draft</option></select></div><div class="field"><label>Visibility</label><select name="visibilityMode"><option value="all" ${v.mode==='all'?'selected':''}>All students</option><option value="groups" ${v.mode==='groups'?'selected':''}>Selected groups</option><option value="users" ${v.mode==='users'?'selected':''}>Selected students</option><option value="levels" ${v.mode==='levels'?'selected':''}>Selected levels</option><option value="mixed" ${v.mode==='mixed'?'selected':''}>Mixed</option><option value="hidden" ${v.mode==='hidden'?'selected':''}>Hidden</option></select></div></div><div class="grid grid-2"><div class="field"><label>Show to Groups</label><select multiple name="groupIds">${groupOptions(v.groupIds)}</select></div><div class="field"><label>Show to Students</label><select multiple name="userIds">${userOptions(v.userIds)}</select></div></div><div class="field"><label>Show to Levels</label><div class="check-grid">${levelChecks('builderLevels',v.levels)}</div></div><div class="field"><label>Passage / Transcript / Prompt</label><textarea name="bodyText">${esc(editing?.passage||editing?.transcript||editing?.prompt||editing?.bodyText||'Add passage, transcript or speaking/writing prompt here.')}</textarea></div><div class="field"><label>Questions / Content JSON</label><textarea name="questions" id="jsonBox">${esc(JSON.stringify(payload,null,2))}</textarea></div><div class="field"><label>Upload audio, image, PPT, PDF or documents for this game</label><input class="input" type="file" id="mediaFile" multiple accept="audio/*,image/*,.ppt,.pptx,.pdf,.doc,.docx,.txt"><small class="lead">Files are saved in this browser only. Use smaller audio/images for best results.</small></div><div class="field"><label>Attach saved media from library</label><div class="media-select">${d.media.map(m=>`<label class="check-pill"><input type="checkbox" name="libraryMedia" value="${m.id}"> ${mediaIcon(m)} · ${esc(m.name)}</label>`).join('')||'<span class="lead">No library media yet. Upload from Admin/Editor → Media.</span>'}</div></div><button class="btn btn-primary" type="submit">${editing?'Update Game':'Save Game'}</button><a class="btn" href="${u.role==='admin'?'admin.html':'editor.html'}">Back to Panel</a></form><div class="card"><p class="eyebrow">Format Guide</p><h2>Question and answer formats</h2><p>Use the buttons below to insert ready examples. You can create MCQ, fill, matching, order, flashcards, reading/listening questions and writing/speaking rubrics.</p><div class="hero-actions"><button class="btn" data-json-sample="mcq">MCQ</button><button class="btn" data-json-sample="fill">Fill</button><button class="btn" data-json-sample="matching">Matching</button><button class="btn" data-json-sample="flash">Flashcards</button><button class="btn" data-json-sample="writing">Writing</button></div><pre class="input" style="white-space:pre-wrap;min-height:220px" id="previewBox"></pre><h3>Existing attachments</h3>${resourceList(editing||{})||'<div class="empty">No files attached yet.</div>'}</div></div></section>`; function fillTemplates(){const c=$('#catSel').value; $('#tempSel').innerHTML=templatesFor(c).map(t=>`<option value="${t.id}">${t.name} · ${t.engine}</option>`).join(''); if(templatesFor(c).some(t=>t.id===temp))$('#tempSel').value=temp; updatePreview()} function updatePreview(){const t=templateById($('#tempSel').value); $('#previewBox').textContent=`Selected template: ${t?.name||'Template'}\nEngine: ${t?.engine||'objective'}\n\nThe selected engine decides how the same content becomes a playable game.`} fillTemplates(); $('#catSel').onchange=fillTemplates; $('#tempSel').onchange=updatePreview; $$('[data-json-sample]').forEach(b=>b.onclick=()=>{const type=b.dataset.jsonSample; const samples={mcq:{questions:[{prompt:'Choose the correct sentence.',options:['She go to class.','She goes to class.','She going to class.','She gone to class.'],answer:'She goes to class.',hint:'Third person singular needs -s.',explanation:'She goes is correct.'}]},fill:{questions:[{prompt:'I ____ to Kolkata yesterday. (go)',answer:'went',hint:'Yesterday is finished past time.',explanation:'Use past simple: went.'}]},matching:{pairs:[{left:'generous',right:'willing to give'},{left:'hesitant',right:'not sure or slow to act'}]},flash:{vocab:[{word:'awareness',meaning:'clear attention to what is happening',example:'Awareness begins with honest observation.'}]},writing:{rubric:['Clear topic sentence','One real example','Correct grammar','Good organisation']}}; $('#jsonBox').value=JSON.stringify(samples[type],null,2)}); $('#builderForm').onsubmit=async e=>{e.preventDefault(); const f=e.target; const t=templateById(f.template.value); let extra={}; try{extra=JSON.parse(f.questions.value||'{}')}catch(err){return toast('Questions JSON is not valid.')} const files=Array.from($('#mediaFile')?.files||[]); const uploaded=[]; for(const file of files){uploaded.push(await readFileAsDataURL(file))} const d2=db(); const selectedMedia=checkedValues('libraryMedia',f).map(id=>d2.media.find(m=>m.id===id)).filter(Boolean); const body=f.bodyText.value.trim(); const existing=editing?clone(editing):{}; const activity=Object.assign(existing,{id:f.activityId.value||('custom-'+Date.now()),category:f.category.value,template:t?.name||'Custom Activity',engine:t?.engine||'objective',title:f.title.value.trim()||'Untitled Activity',instructions:f.instructions.value,level:f.level.value,difficulty:f.difficulty.value,xp:Number(f.xp.value)||100,status:f.status.value,visibility:{mode:f.visibilityMode.value,groupIds:selectedValues('#builderForm [name="groupIds"]'),userIds:selectedValues('#builderForm [name="userIds"]'),levels:checkedValues('builderLevels',f)},createdBy:existing.createdBy||user()?.id||'teacher',updatedAt:today()}); Object.assign(activity,extra); if(activity.engine==='reading')activity.passage=body; else if(activity.engine==='listening')activity.transcript=body; else if(activity.engine==='writing'||activity.engine==='speaking'||activity.engine==='recording')activity.prompt=body; else activity.bodyText=body; const combined=[...(existing.mediaItems||[]),...selectedMedia,...uploaded]; const seen=new Set(); activity.mediaItems=combined.filter(m=>m&&m.id&&!seen.has(m.id)&&(seen.add(m.id),true)); const audio=firstMediaOf(activity,'audio/'); const image=firstMediaOf(activity,'image/'); if(audio)activity.media=audio.data; else if(image)activity.image=image.data; const idx=d2.activities.findIndex(a=>a.id===activity.id); if(idx>=0)d2.activities[idx]=activity; else d2.activities.push(activity); saveDB(d2); toast(editing?'Game updated.':'Game saved.'); setTimeout(()=>location.href=`activity.html?id=${activity.id}`,650)};}
function renderActivity(){const root=$('#app'); let activity=params.get('id')?byId(params.get('id')):null; if(activity && !canSeeActivity(activity,user())){root.innerHTML=`<section class="section"><div class="container"><div class="empty"><h2>This game is not available for your account.</h2><p>Ask the admin/editor to assign it to your group, level or student profile.</p><a class="btn btn-primary" href="login.html">Login / Change Account</a></div></div></section>`;return} if(!activity){activity=makeGeneratedActivity(params.get('category')||'grammar', params.get('template')||'');}
 const side=`<aside class="card side-panel"><p class="eyebrow">${catTitle(activity.category)}</p><h2>${esc(activity.title)}</h2><p>${esc(activity.instructions||'')}</p><div class="trust"><span class="tag">${activity.template}</span><span class="tag">${activity.level||'All levels'}</span><span class="tag">${activity.xp||100} XP</span><span class="tag">${visibilityLabel(activity)}</span></div>${resourceList(activity)}${activity.timeLimit?`<div class="timer" id="timer">${Math.ceil(activity.timeLimit/60)}:00</div>`:''}<div class="hero-actions"><a class="btn" href="${activity.category}.html">Back</a>${isTeacher()?`<a class="btn btn-gold" href="builder.html?id=${activity.id}">Edit Game</a><a class="btn" href="builder.html?category=${activity.category}">Build Similar</a>`:''}</div></aside>`; root.innerHTML=`<section class="section"><div class="container game-shell">${side}<main class="card" id="gameArea"></main></div></section>`; if(activity.timeLimit)startTimer(activity.timeLimit); const area=$('#gameArea'); const engine=activity.engine||'objective'; if(engine==='objective')renderObjective(area,activity); else if(engine==='fill')renderFill(area,activity); else if(engine==='matching')renderMatching(area,activity); else if(engine==='order')renderOrder(area,activity); else if(engine==='flashcards')renderFlashcards(area,activity); else if(engine==='reading')renderReading(area,activity); else if(engine==='listening')renderListening(area,activity); else if(engine==='writing')renderWriting(area,activity); else if(engine==='speaking'||engine==='recording')renderSpeaking(area,activity); else renderObjective(area,activity);}



/* === CLEAR PORTAL + ROLE LOGIN OVERRIDES v5 === */
function portalRoleCards(){return `<section class="section portal-section"><div class="container"><div class="section-head"><div><p class="eyebrow">Login / Open Portal</p><h2 class="display">Choose your panel after pressing Login.</h2></div><p class="lead">Students play assigned games. Editors create and edit games. Admins manage everything: games, students, groups, visibility and reports.</p></div><div class="grid grid-3 portal-cards"><a class="card portal-card student-card magnetic" href="login.html?role=student"><div class="portal-icon">🎮</div><h3>Student Panel</h3><p>Play different games, complete assigned tasks, check XP, badges, scores and progress.</p><span class="btn btn-primary">Login as Student</span></a><a class="card portal-card editor-card magnetic" href="login.html?role=editor"><div class="portal-icon">✍️</div><h3>Editor Panel</h3><p>Create games, add questions and answers, upload audio/images/PPTs, edit and delete games.</p><span class="btn btn-gold">Login as Editor</span></a><a class="card portal-card admin-card magnetic" href="login.html?role=admin"><div class="portal-icon">⚙️</div><h3>Admin Panel</h3><p>Manage all games, student profiles, groups, assignments, visibility, media and reports.</p><span class="btn btn-primary">Login as Admin</span></a></div></div></section>`}
function nav(){const root=$('#nav-root'); if(!root)return; const u=user(); const page=document.body.dataset.page; const cats=Object.keys(window.IEA_SEED.categories); root.innerHTML=`<header class="nav"><div class="nav-inner"><a class="brand" href="index.html"><span class="logo">${iconSVG()}</span><span><strong>International English Academy</strong><small>Games · Login · Panels</small></span></a><button class="icon-btn menu" data-menu>☰</button><nav class="nav-links" data-links><a class="${page==='home'?'active':''}" href="tasks-games.html">Games Home</a>${cats.map(c=>`<a class="${page===c?'active':''}" href="${c}.html">${catTitle(c).replace(' & Speaking','')}</a>`).join('')}<a class="${page==='leaderboard'?'active':''}" href="leaderboard.html">Leaderboard</a>${u?`<a class="${page===u.role?'active':''}" href="${u.role==='student'?'student.html':u.role==='editor'?'editor.html':'admin.html'}">My Panel</a>`:''}</nav><div class="nav-actions">${u?`<a class="btn btn-primary portal-login-main" href="${u.role==='student'?'student.html':u.role==='editor'?'editor.html':'admin.html'}">Open ${u.role.charAt(0).toUpperCase()+u.role.slice(1)} Panel</a><button class="btn btn-danger" data-logout>Logout</button>`:`<a class="btn btn-primary portal-login-main pulse-btn" href="login.html">Login / Open Portal</a>`}<button class="icon-btn" data-theme>◐</button></div></div></header>`;
$('[data-menu]',root)?.addEventListener('click',()=> $('[data-links]',root).classList.toggle('open')); $('[data-theme]',root)?.addEventListener('click',toggleTheme); $('[data-logout]',root)?.addEventListener('click',logout);
}
function home(){const root=$('#app'); if(!root)return; const cats=Object.keys(window.IEA_SEED.categories); const d=db(); root.innerHTML=`<section class="hero"><div class="container hero-grid"><div class="reveal"><p class="eyebrow">IEA Games, Tasks and Role Panels</p><h1 class="mega">Login first. Then enter your own panel.</h1><p class="lead">This section has a clear login flow. Press the Login button, choose Student, Editor or Admin, and the website opens the correct panel automatically.</p><div class="hero-actions hero-actions-big"><a class="btn btn-primary btn-xl magnetic pulse-btn" href="login.html">Login / Open Portal</a><a class="btn btn-gold btn-xl magnetic" href="login.html?role=student">Student Login</a><a class="btn btn-xl magnetic" href="login.html?role=admin">Admin Login</a></div><div class="trust"><span class="pill">Student plays games</span><span class="pill">Editor creates content</span><span class="pill">Admin manages all</span><span class="pill">Group-wise visibility</span></div></div><div class="stage reveal">${illustration()}<div class="float-card one"><strong>${d.activities.length}</strong><span>games ready</span></div><div class="float-card two"><strong>${d.users.filter(u=>u.role==='student').length}</strong><span>student profiles</span></div><div class="float-card three"><strong>3</strong><span>role panels</span></div></div></div></section>${portalRoleCards()}<section class="section"><div class="container"><div class="section-head"><div><p class="eyebrow">Skill Worlds</p><h2 class="display">Students can play different games after login.</h2></div><p class="lead">Admin/editor can create and assign games in all six skill areas: grammar, vocabulary, pronunciation, reading, listening, writing and speaking.</p></div><div class="grid grid-3">${cats.map(c=>`<a class="card category-card reveal magnetic" href="${c}.html"><div><div class="category-icon">${catEmoji(c)}</div><h3>${catTitle(c)}</h3><p>${catDesc(c)}</p></div><span class="badge">${templatesFor(c).length} templates</span></a>`).join('')}</div></div></section><section class="section"><div class="container grid grid-4">${['Login system','Admin panel','Editor panel','Student games','Question builder','Media uploads','Group visibility','Reports'].map((x,i)=>`<div class="stat reveal"><strong>${i+1}</strong><span>${x}</span></div>`).join('')}</div></section>`; setTimeout(initUI,0)}
function login(){const root=$('#app'); if(!root)return; db(); const requested=(params.get('role')||'student').toLowerCase(); const active=['student','editor','admin'].includes(requested)?requested:'student'; const creds={student:['student@iea.in','student123'],editor:['editor@iea.in','editor123'],admin:['admin@iea.in','admin123']}; const roleText={student:'Students play assigned games and track their progress.',editor:'Editors create, edit and delete games and manage questions/media.',admin:'Admins manage all games, students, groups, visibility and reports.'}; root.innerHTML=`<section class="login-wrap clear-login-wrap"><div class="card login-card clear-login-card reveal"><p class="eyebrow">Login / Open Portal</p><h1 class="display">Select your role, then enter your panel.</h1><p class="lead" id="roleHelp">${roleText[active]}</p><div class="role-row clear-role-row" id="roleRow"><div class="role-pick ${active==='student'?'active':''}" data-role="student"><b>Student</b><small>Play games</small></div><div class="role-pick ${active==='editor'?'active':''}" data-role="editor"><b>Editor</b><small>Create/edit games</small></div><div class="role-pick ${active==='admin'?'active':''}" data-role="admin"><b>Admin</b><small>Manage all</small></div></div><form class="form" id="loginForm" style="margin-top:20px"><div class="grid grid-2"><div class="field"><label>Email</label><input class="input" name="email" value="${creds[active][0]}" autocomplete="username"></div><div class="field"><label>Password</label><input class="input" type="password" name="password" value="${creds[active][1]}" autocomplete="current-password"></div></div><button class="btn btn-primary btn-xl" type="submit" id="loginSubmit">Login and Open ${active.charAt(0).toUpperCase()+active.slice(1)} Panel</button><button class="btn" type="button" id="resetAccounts">Reset demo accounts if login does not work</button></form><div class="grid grid-3" style="margin-top:18px"><button class="btn quick-login" data-quick-role="student">Demo Student</button><button class="btn quick-login" data-quick-role="editor">Demo Editor</button><button class="btn quick-login" data-quick-role="admin">Demo Admin</button></div><div class="card demo-login-card" style="margin-top:18px"><p><b>Demo login details</b></p><p class="lead" style="font-size:14px">Student: student@iea.in / student123<br>Editor: editor@iea.in / editor123<br>Admin: admin@iea.in / admin123<br>Anshu Admin: clickansh@gmail.com / admin123</p></div></div></section>`; function applyRole(role){$$('.role-pick').forEach(y=>y.classList.remove('active')); $(`.role-pick[data-role="${role}"]`)?.classList.add('active'); const f=$('#loginForm'); f.email.value=creds[role][0]; f.password.value=creds[role][1]; $('#roleHelp').textContent=roleText[role]; $('#loginSubmit').textContent=`Login and Open ${role.charAt(0).toUpperCase()+role.slice(1)} Panel`; history.replaceState(null,'',`login.html?role=${role}`)} function doLogin(email,pass){const d=db(); const u=d.users.find(x=>String(x.email).toLowerCase()===String(email).trim().toLowerCase() && String(x.password)===String(pass)); if(!u){toast('Wrong email or password. Press Reset demo accounts if needed.'); return} setUser({id:u.id,name:u.name,email:u.email,role:u.role}); toast('Logged in successfully. Opening panel...'); setTimeout(()=>location.href=u.role==='student'?'student.html':u.role==='editor'?'editor.html':'admin.html',350)} $$('.role-pick').forEach(x=>x.onclick=()=>applyRole(x.dataset.role)); $$('.quick-login').forEach(x=>x.onclick=()=>{const r=x.dataset.quickRole; doLogin(creds[r][0],creds[r][1])}); $('#resetAccounts').onclick=()=>{if(confirm('Reset local portal data and restore demo accounts?')){localStorage.removeItem(DB_KEY);localStorage.removeItem('iea_current_user');db();toast('Demo accounts restored.');setTimeout(()=>location.href='login.html',500)}}; $('#loginForm').onsubmit=e=>{e.preventDefault();doLogin(e.target.email.value,e.target.password.value)};}
function studentDashboard(){const u=requireRole(['student']); if(!u)return; const full=currentUserFull(); const st=progressStats(full.id); const taskStats=taskCompletionStats(db(),full); const root=$('#app'); const avg=st.avg||0; const assigned=visibleActivitiesFor(full).slice(0,12); const attempts=st.attempts.slice(-8).reverse(); root.innerHTML=`<section class="hero"><div class="container hero-grid"><div class="reveal"><p class="eyebrow">Student Panel</p><h1 class="mega">Play your assigned games.</h1><p class="lead">This panel shows only the games made available to your level, group or individual profile by the admin/editor.</p><div class="hero-actions"><a class="btn btn-primary btn-xl" href="#assigned-games">Play Assigned Games</a><a class="btn" href="leaderboard.html">Leaderboard</a><a class="btn btn-gold" href="student-everyday-english.html">Everyday English</a><a class="btn btn-gold" href="iea-clubs.html">IEA Clubs</a></div></div><div class="stage reveal">${illustration('student')}<div class="float-card one"><strong>${fmt(st.xp)}</strong><span>Total XP</span></div><div class="float-card two"><strong>${full.level||'A2'}</strong><span>level</span></div><div class="float-card three"><strong>${taskStats.taskDonePercent}%</strong><span>tasks done</span></div></div></div></section><section class="section"><div class="container grid grid-4"><div class="stat reveal"><strong>${fmt(st.xp)}</strong><span>XP points</span></div><div class="stat reveal"><strong>${st.attempts.length}</strong><span>Completed attempts</span></div><div class="stat reveal"><strong>${avg}%</strong><span>Average score</span></div><div class="stat reveal"><strong>${(full.badges||[]).length}</strong><span>Badges</span></div></div></section><section class="section" id="assigned-games"><div class="container"><div class="section-head"><div><p class="eyebrow">Your Games</p><h2 class="display">Games available for you</h2></div><p class="lead">These appear according to your level, groups and student profile.</p></div><div class="grid grid-3">${assigned.map(a=>activityCard(a)).join('')||'<div class="empty">No games are assigned yet. Ask admin/editor to show games to your group.</div>'}</div></div></section><section class="section"><div class="container grid grid-2"><div class="card reveal"><p class="eyebrow">Skill progress</p><h2>Mastery map</h2>${Object.keys(window.IEA_SEED.categories).map(c=>{const vals=st.cats[c]||[]; const v=vals.length?vals.reduce((a,b)=>a+b,0)/vals.length:0; return `<p>${catTitle(c)}</p><div class="progress"><i style="--v:${pct(v)}%"></i></div>`}).join('')}</div><div class="card reveal"><p class="eyebrow">Recent Attempts</p><h2>Performance history</h2>${attempts.length?`<table class="table"><tr><th>Activity</th><th>Score</th><th>Date</th></tr>${attempts.map(a=>`<tr><td>${esc(a.title)}</td><td>${Math.round(a.score/a.possible*100)}%</td><td>${a.date}</td></tr>`).join('')}</table>`:'<div class="empty">No attempts yet.</div>'}<h3>Badges</h3><p>${(full.badges||[]).map(b=>`<span class="badge">${esc(b)}</span>`).join(' ')||'No badges yet.'}</p></div></div></section>`; setTimeout(initUI,0)}
function categoryPage(category){const root=$('#app'); if(!root)return; const u=user(); const acts=visibleActivitiesFor(u,category); const all=activitiesFor(category); const temps=templatesFor(category); root.innerHTML=`<section class="hero"><div class="container hero-grid"><div class="reveal"><p class="eyebrow">${catTitle(category)} Games</p><h1 class="mega">${catTitle(category)}</h1><p class="lead">${catDesc(category)}</p><div class="hero-actions">${u?`<a class="btn btn-primary" href="${u.role==='student'?'student.html':u.role==='editor'?'editor.html':'admin.html'}">Open My Panel</a>`:`<a class="btn btn-primary pulse-btn" href="login.html">Login / Open Portal</a>`}<a class="btn btn-gold" href="activity.html?category=${category}&template=${temps[0]?.id||''}">Play Template Demo</a>${isTeacher()?`<a class="btn" href="builder.html?category=${category}">Create Game</a>`:''}</div></div><div class="stage reveal">${illustration(category)}<div class="float-card one"><strong>${temps.length}</strong><span>coded templates</span></div><div class="float-card two"><strong>${acts.length}</strong><span>${isTeacher()?'visible / '+all.length+' total':'available games'}</span></div></div></div></section><section class="section"><div class="container"><div class="section-head"><div><p class="eyebrow">Playable Activities</p><h2 class="display">${isTeacher()?'All created activities':'Activities available to you'}</h2></div><p class="lead">Admin/editor can decide which games appear for each group, level or individual student.</p></div><div class="grid grid-3">${acts.map(a=>activityCard(a)).join('')||'<div class="empty">No activities are currently assigned in this skill. Login as admin/editor to create or assign games.</div>'}</div></div></section><section class="section"><div class="container"><div class="section-head"><div><p class="eyebrow">Reusable Templates</p><h2 class="display">All formats are registered and coded.</h2></div><p class="lead">Teachers add content: title, instructions, questions, answers, passages, audio, images, PPTs and prompts.</p></div><div class="grid grid-4">${temps.map(t=>`<article class="card template-card reveal"><small>${t.engine} engine</small><h3>${t.name}</h3><p>Dynamic content loading, scoring, hints, explanations and media attachments are supported.</p><div class="actions"><a class="btn" href="activity.html?category=${category}&template=${t.id}">Demo</a>${isTeacher()?`<a class="btn btn-gold" href="builder.html?category=${category}&template=${t.id}">Build</a>`:''}</div></article>`).join('')}</div></div></section>`; setTimeout(initUI,0)}


/* === IEA Everyday English Module Manager: course overview/materials/dates/language bank/daily diary === */
const __ieaOriginalEnsureStudentProfileFields = ensureStudentProfileFields;
ensureStudentProfileFields = function(u){
  const r = __ieaOriginalEnsureStudentProfileFields(u);
  if(u && u.role === 'student'){
    u.dailyDiaryDone = Array.isArray(u.dailyDiaryDone) ? u.dailyDiaryDone : [];
    u.dailyDiaryEvents = Array.isArray(u.dailyDiaryEvents) ? u.dailyDiaryEvents : [];
  }
  return r;
};

function ieaSafeHtml(v){
  const text = String(v || '');
  return text.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi,'').replace(/\son\w+="[^"]*"/gi,'').replace(/\son\w+='[^']*'/gi,'');
}
function ieaPlainTextToParagraphs(v){
  return String(v || '').split(/\n{2,}/).map(x=>x.trim()).filter(Boolean).map(x=>`<p>${esc(x)}</p>`).join('') || '<p>No content has been added yet.</p>';
}
function ensureEverydayModule(d=db()){
  d.everydayEnglishModule = d.everydayEnglishModule && typeof d.everydayEnglishModule === 'object' ? d.everydayEnglishModule : {};
  const m = d.everydayEnglishModule;
  m.theme = Object.assign({primary:'#97d8bd',accent:'#111111',background:'#f8f9f7',ink:'#111111'}, m.theme || {});
  m.groupThemes = (m.groupThemes && typeof m.groupThemes === 'object' && !Array.isArray(m.groupThemes)) ? m.groupThemes : {};
  m.overview = m.overview || {
    title:'Everyday English Pre-Intermediate Module 3',
    subtitle:'Communicate effectively through better grammar, better ideas and real practice.',
    body:'<h2>Course Overview</h2><p>This module helps learners communicate more effectively in everyday situations. Admins and editors can edit this area like a document and students can read the latest course overview here.</p>'
  };
  m.materials = Array.isArray(m.materials) ? m.materials : [];
  m.importantDates = Array.isArray(m.importantDates) ? m.importantDates : [];
  m.languageBank = Object.assign({grammar:[],vocabulary:[],pronunciation:[]}, m.languageBank || {});
  m.languageBank.grammar = Array.isArray(m.languageBank.grammar) ? m.languageBank.grammar : [];
  m.languageBank.vocabulary = Array.isArray(m.languageBank.vocabulary) ? m.languageBank.vocabulary : [];
  m.languageBank.pronunciation = Array.isArray(m.languageBank.pronunciation) ? m.languageBank.pronunciation : [];
  m.dailyDiary = Array.isArray(m.dailyDiary) ? m.dailyDiary : [];
  return m;
}
function saveEverydayModule(d, moduleData){
  d.everydayEnglishModule = moduleData;
  saveDB(d);
}
function everydayThemeForStudent(moduleData, s){
  moduleData = moduleData || ensureEverydayModule(db());
  const fallback = Object.assign({primary:'#97d8bd',accent:'#111111',background:'#f8f9f7',ink:'#111111'}, moduleData.theme || {});
  const groupThemes = moduleData.groupThemes || {};
  const studentGroups = (s && Array.isArray(s.groupIds)) ? s.groupIds : [];
  const match = studentGroups.find(id => groupThemes[id]);
  if(match) return Object.assign({}, fallback, groupThemes[match]);
  const levelGroups = s && s.level ? groupsForLevel(s.level) : [];
  const levelMatch = levelGroups.find(id => groupThemes[id]);
  if(levelMatch) return Object.assign({}, fallback, groupThemes[levelMatch]);
  return fallback;
}
function diaryItemVisibleToStudent(item, s){
  if(!item || !s) return false;
  const mode = item.mode || 'all';
  if(mode === 'all') return true;
  const groups = s.groupIds || [];
  if(mode === 'groups') return (item.groupIds || []).some(id=>groups.includes(id));
  if(mode === 'users') return (item.userIds || []).includes(s.id);
  if(mode === 'levels') return (item.levels || []).includes(s.level);
  if(mode === 'mixed') return (item.userIds || []).includes(s.id) || (item.groupIds || []).some(id=>groups.includes(id)) || (item.levels || []).includes(s.level);
  return false;
}
function diaryItemsForStudent(d,s){
  ensureEverydayModule(d); ensureStudentProfileFields(s);
  return (d.everydayEnglishModule.dailyDiary || []).filter(item=>diaryItemVisibleToStudent(item,s)).sort((a,b)=>String(a.dueDate||'').localeCompare(String(b.dueDate||'')));
}
function isDiaryItemDone(d,s,item){
  ensureStudentProfileFields(s);
  if(!item) return false;
  if((s.dailyDiaryDone || []).includes(item.id)) return true;
  if(item.activityId){
    return (s.completedTasks || []).some(r=>r.activityId === item.activityId);
  }
  return false;
}
function dailyDiaryStats(d,s){
  const items = diaryItemsForStudent(d,s);
  const done = items.filter(item=>isDiaryItemDone(d,s,item));
  const percent = items.length ? Math.round(done.length / items.length * 100) : 0;
  return {items,done,doneCount:done.length,total:items.length,percent};
}
function materialKind(m){
  const t = String(m.type || '');
  const n = String(m.name || m.title || '');
  if(t.startsWith('image/')) return 'Image';
  if(t.startsWith('audio/')) return 'Audio';
  if(/pdf/i.test(t) || /\.pdf$/i.test(n)) return 'PDF';
  if(/presentation|powerpoint|ppt/i.test(t) || /\.pptx?$/i.test(n)) return 'PPT';
  if(/word|document/i.test(t) || /\.docx?$/i.test(n)) return 'DOC';
  if(m.url) return 'Link';
  return 'File';
}
function languageBankCard(title,items,empty){
  return `<div class="card language-bank-card"><p class="eyebrow">${esc(title)}</p>${(items||[]).length ? `<div class="bank-list">${items.map(x=>`<div class="bank-item"><b>${esc(x.title||x.area||'Area')}</b><p>${esc(x.note||x.example||'')}</p></div>`).join('')}</div>` : `<div class="empty">${esc(empty||'Nothing added yet.')}</div>`}</div>`;
}
function parseBankLines(v){
  return String(v||'').split('\n').map(x=>x.trim()).filter(Boolean).map(line=>{
    const parts=line.split('|').map(p=>p.trim());
    return {title:parts[0]||'', note:parts.slice(1).join(' | ')||''};
  });
}
function bankLines(items){
  return (items||[]).map(x=>[x.title||x.area||'',x.note||x.example||''].filter(Boolean).join(' | ')).join('\n');
}
function dateLines(items){
  return (items||[]).map(x=>[x.date||'',x.title||'',x.note||'',x.status||''].join(' | ')).join('\n');
}
function parseDateLines(v){
  return String(v||'').split('\n').map(x=>x.trim()).filter(Boolean).map(line=>{
    const p=line.split('|').map(x=>x.trim());
    return {id:'date-'+Date.now()+'-'+Math.random().toString(16).slice(2), date:p[0]||'', title:p[1]||'', note:p[2]||'', status:p[3]||''};
  });
}
function everydayStudentNav(active='overview'){
  const tabs = [
    ['overview','Course Overview','01'],
    ['materials','Course Material','02'],
    ['dates','Important Dates','03'],
    ['bank','Language Bank','04'],
    ['diary','Daily Diary','05']
  ];
  return `<div class="everyday-button-grid">${tabs.map(t=>`<button class="ee-big-btn ${active===t[0]?'active':''}" data-ee-tab="${t[0]}"><b>${t[2]}</b><span>${t[1]}</span></button>`).join('')}</div>`;
}
function everydayEnglishPage(){
  const u=requireRole(['student']); if(!u)return;
  const d=db(); const s=d.users.find(x=>x.id===u.id)||u; ensureStudentProfileFields(s);
  const moduleData=ensureEverydayModule(d); const st=taskCompletionStats(d,s); const diary=dailyDiaryStats(d,s);
  const theme=everydayThemeForStudent(moduleData,s);
  const materialCards=(moduleData.materials||[]).sort((a,b)=>String(b.classDate||b.date||'').localeCompare(String(a.classDate||a.date||''))).map(m=>`<article class="ee-material-card"><div><span class="tag">${materialKind(m)}</span><h3>${esc(m.title||m.name||'Class material')}</h3><p>${esc([m.classDate,m.note].filter(Boolean).join(' · '))}</p></div>${m.data||m.url?`<a class="btn btn-primary" target="_blank" href="${esc(m.data||m.url)}" ${m.data?`download="${esc(m.name||m.title||'material')}"`:''}>Open</a>`:''}</article>`).join('');
  const dateCards=(moduleData.importantDates||[]).sort((a,b)=>String(a.date||'').localeCompare(String(b.date||''))).map(x=>`<div class="date-row"><strong>${esc(x.date||'Date')}</strong><span><b>${esc(x.title||'Important date')}</b><small>${esc([x.note,x.status].filter(Boolean).join(' · '))}</small></span></div>`).join('');
  const diaryRows=diary.items.map(item=>{const done=isDiaryItemDone(d,s,item); const act=item.activityId?d.activities.find(a=>a.id===item.activityId):null; return `<div class="diary-item ${done?'done':''}"><div><span class="tag">${done?'Done':'Pending'}</span><h3>${esc(item.title||act?.title||'Daily diary task')}</h3><p>${esc(item.instructions||act?.instructions||'Complete this task before the deadline.')} ${item.dueDate?`<br><b>Deadline:</b> ${esc(item.dueDate)}`:''}</p></div><div class="mini-actions">${act?`<a class="btn btn-primary" href="activity.html?id=${act.id}">${done?'Review Task':'Open Task'}</a>`:`${done?'<span class="badge">Marked done</span>':`<button class="btn btn-primary" data-diary-done="${item.id}">Mark Done</button>`}`}</div></div>`}).join('');
  $('#app').innerHTML=`<section class="hero everyday-hero" style="--ee-primary:${esc(theme.primary||'#97d8bd')};--ee-accent:${esc(theme.accent||'#111')};--ee-bg:${esc(theme.background||'#f8f9f7')};--ee-ink:${esc(theme.ink||'#111')}"><div class="container hero-grid"><div><p class="eyebrow">Everyday English</p><h1 class="mega">${esc(moduleData.overview.title || s.english.module || 'Everyday English')}</h1><p class="lead">${esc(moduleData.overview.subtitle || s.english.batch || 'Your module')} · Daily Diary ${diary.percent}% complete.</p><div class="hero-actions"><a class="btn btn-primary" href="student.html">Back to Student Panel</a><a class="btn" href="profile.html">Profile</a></div></div><div class="stage">${illustration('student')}<div class="float-card one"><strong>${diary.percent}%</strong><span>daily diary</span></div><div class="float-card two"><strong>${st.taskDonePercent}%</strong><span>tasks done</span></div></div></div></section><section class="section everyday-module" style="--ee-primary:${esc(theme.primary||'#97d8bd')};--ee-accent:${esc(theme.accent||'#111')};--ee-bg:${esc(theme.background||'#f8f9f7')};--ee-ink:${esc(theme.ink||'#111')}"><div class="container">${everydayStudentNav('overview')}<div class="ee-panel active" data-ee-panel="overview"><div class="card rich-output">${ieaSafeHtml(moduleData.overview.body)}</div></div><div class="ee-panel" data-ee-panel="materials"><div class="section-head"><div><p class="eyebrow">Course Material</p><h2 class="display">Materials from completed classes</h2></div></div><div class="ee-material-grid">${materialCards || '<div class="empty">No course materials have been uploaded yet.</div>'}</div></div><div class="ee-panel" data-ee-panel="dates"><div class="card"><p class="eyebrow">Important Dates</p><h2>Class updates and closures</h2>${dateCards || '<div class="empty">No important dates have been added yet.</div>'}</div></div><div class="ee-panel" data-ee-panel="bank"><div class="grid grid-3">${languageBankCard('Grammar',moduleData.languageBank.grammar,'No grammar areas added yet.')}${languageBankCard('Vocabulary',moduleData.languageBank.vocabulary,'No vocabulary areas added yet.')}${languageBankCard('Pronunciation',moduleData.languageBank.pronunciation,'No pronunciation areas added yet.')}</div></div><div class="ee-panel" data-ee-panel="diary"><div class="grid grid-2"><div class="card"><p class="eyebrow">Daily Diary</p><h2>Your assigned course tasks</h2><div class="profile-completion-hero"><span>Daily Diary Completion</span><strong>${diary.percent}%</strong><small>${diary.doneCount} done out of ${diary.total} diary tasks assigned.</small><div class="progress big-progress"><i style="--v:${diary.percent}%"></i></div></div></div><div class="card">${diaryRows || '<div class="empty">No Daily Diary task has been assigned yet.</div>'}</div></div></div></div></section>`;
  $$('[data-ee-tab]').forEach(btn=>btn.onclick=()=>{$$('[data-ee-tab]').forEach(b=>b.classList.remove('active'));btn.classList.add('active');$$('[data-ee-panel]').forEach(p=>p.classList.toggle('active',p.dataset.eePanel===btn.dataset.eeTab));});
  $$('[data-diary-done]').forEach(btn=>btn.onclick=()=>{const d2=db(); const s2=d2.users.find(x=>x.id===u.id); ensureStudentProfileFields(s2); if(!s2.dailyDiaryDone.includes(btn.dataset.diaryDone))s2.dailyDiaryDone.push(btn.dataset.diaryDone); s2.dailyDiaryEvents.push({type:'manual-done',itemId:btn.dataset.diaryDone,date:today(),timestamp:new Date().toISOString()}); saveDB(d2); toast('Daily Diary marked as done.'); setTimeout(()=>location.reload(),450);});
  setTimeout(initUI,0);
}

function everydayManagerPanel(role){
  const d=db(); const m=ensureEverydayModule(d); const page=role==='editor'?'editor':'admin';
  const activities=d.activities||[]; const currentDiary=(m.dailyDiary||[]).slice().sort((a,b)=>String(b.createdAt||'').localeCompare(String(a.createdAt||'')));
  const selectedThemeGroupId = m.lastThemeGroupId || ((d.groups||[])[0]||{}).id || '';
  const selectedTheme = Object.assign({}, m.theme || {}, (m.groupThemes||{})[selectedThemeGroupId] || {});
  return `<div class="everyday-admin-grid"><div class="card"><p class="eyebrow">Everyday English Page</p><h2>Group-wise buttons and theme</h2><p class="lead" style="font-size:14px">Students see Course Overview, Course Material, Important Dates, Language Bank and Daily Diary. Colours are now applied only to the selected group.</p><form class="form" id="eeThemeForm"><div class="field"><label>Apply colours to group</label><select class="input" name="groupId">${groupOptions([selectedThemeGroupId])}</select><small>Only students inside this group will see these Everyday English colours.</small></div><div class="grid grid-4"><div class="field"><label>Primary colour</label><input class="input" type="color" name="primary" value="${esc(selectedTheme.primary)}"></div><div class="field"><label>Accent colour</label><input class="input" type="color" name="accent" value="${esc(selectedTheme.accent)}"></div><div class="field"><label>Background</label><input class="input" type="color" name="background" value="${esc(selectedTheme.background)}"></div><div class="field"><label>Text colour</label><input class="input" type="color" name="ink" value="${esc(selectedTheme.ink)}"></div></div><button class="btn btn-primary" type="submit">Save Colours for Selected Group</button></form></div>
  <div class="card"><p class="eyebrow">Course Overview</p><h2>Word-like editor</h2><form class="form" id="eeOverviewForm"><div class="grid grid-2"><div class="field"><label>Title</label><input class="input" name="title" value="${esc(m.overview.title)}"></div><div class="field"><label>Subtitle</label><input class="input" name="subtitle" value="${esc(m.overview.subtitle)}"></div></div><div class="editor-toolbar"><button class="btn" type="button" data-editor-command="bold"><b>B</b></button><button class="btn" type="button" data-editor-command="italic"><i>I</i></button><button class="btn" type="button" data-editor-command="insertUnorderedList">Bullets</button><button class="btn" type="button" data-editor-command="insertOrderedList">Numbers</button><button class="btn" type="button" data-editor-command="formatBlock" data-editor-value="h2">Heading</button><button class="btn" type="button" data-editor-link>Link</button></div><div class="rich-editor" id="courseOverviewEditor" contenteditable="true">${ieaSafeHtml(m.overview.body)}</div><button class="btn btn-primary" type="submit">Save Course Overview</button></form></div>
  <div class="card"><p class="eyebrow">Course Materials</p><h2>Upload/edit class material</h2><form class="form" id="eeMaterialForm"><div class="grid grid-2"><div class="field"><label>Material title</label><input class="input" name="title" placeholder="Class 1: Present Perfect"></div><div class="field"><label>Class date</label><input class="input" name="classDate" type="date"></div></div><div class="field"><label>Notes</label><textarea name="note" placeholder="What students should use this material for"></textarea></div><div class="grid grid-2"><div class="field"><label>Upload file</label><input class="input" id="eeMaterialFile" type="file" accept="audio/*,image/*,.ppt,.pptx,.pdf,.doc,.docx,.txt"></div><div class="field"><label>Or paste link</label><input class="input" name="url" placeholder="https://..."></div></div><button class="btn btn-primary" type="submit">Add Material</button></form>${(m.materials||[]).length?`<form class="mini-list" id="eeMaterialEditForm">${(m.materials||[]).map(x=>`<div class="mini-list-row material-edit-row"><input type="hidden" name="materialId" value="${x.id}"><div class="field"><label>Title</label><input class="input" name="materialTitle" value="${esc(x.title||x.name||'')}"></div><div class="field"><label>Date</label><input class="input" name="materialDate" type="date" value="${esc(x.classDate||'')}"></div><div class="field"><label>Notes</label><input class="input" name="materialNote" value="${esc(x.note||'')}"></div><div class="field"><label>Link</label><input class="input" name="materialUrl" value="${esc(x.url||'')}"></div><button class="btn btn-danger" type="button" data-delete-ee-material="${x.id}">Delete</button></div>`).join('')}<button class="btn btn-primary" type="submit">Save Material Edits</button></form>`:'<div class="empty" style="margin-top:18px">No materials yet.</div>'}</div>
  <div class="card"><p class="eyebrow">Important Dates</p><h2>Class closures and key dates</h2><form class="form" id="eeDatesForm"><div class="field"><label>One per line: date | title | note | status</label><textarea name="dates" placeholder="2026-07-10 | Module begins | First class | Open">${esc(dateLines(m.importantDates))}</textarea></div><button class="btn btn-primary" type="submit">Save Important Dates</button></form></div>
  <div class="card"><p class="eyebrow">Language Bank</p><h2>Grammar, vocabulary and pronunciation areas</h2><form class="form" id="eeBankForm"><div class="grid grid-3"><div class="field"><label>Grammar<br><small>area | note/example</small></label><textarea name="grammar">${esc(bankLines(m.languageBank.grammar))}</textarea></div><div class="field"><label>Vocabulary<br><small>area | note/example</small></label><textarea name="vocabulary">${esc(bankLines(m.languageBank.vocabulary))}</textarea></div><div class="field"><label>Pronunciation<br><small>area | note/example</small></label><textarea name="pronunciation">${esc(bankLines(m.languageBank.pronunciation))}</textarea></div></div><button class="btn btn-primary" type="submit">Save Language Bank</button></form></div>
  <div class="card everyday-admin-wide"><p class="eyebrow">Daily Diary</p><h2>Assign course tasks with deadlines</h2><form class="form" id="eeDiaryForm"><div class="grid grid-3"><div class="field"><label>Linked task/game</label><select name="activityId"><option value="">Custom diary task only</option>${activities.map(a=>`<option value="${a.id}">${esc(a.title)} · ${catTitle(a.category)}</option>`).join('')}</select></div><div class="field"><label>Diary title</label><input class="input" name="title" placeholder="Complete Class 3 grammar practice"></div><div class="field"><label>Deadline</label><input class="input" name="dueDate" type="date"></div></div><div class="field"><label>Instructions</label><textarea name="instructions" placeholder="What should the student complete and submit?"></textarea></div><div class="field"><label>Assign to</label><select name="mode"><option value="all">All students</option><option value="groups">Selected groups</option><option value="users">Selected individual students</option><option value="levels">Selected levels</option><option value="mixed">Groups + students + levels</option></select></div><div class="grid grid-2"><div class="field"><label>Groups</label><select multiple name="groupIds">${groupOptions()}</select></div><div class="field"><label>Students</label><select multiple name="userIds">${userOptions()}</select></div></div><div class="field"><label>Levels</label><div class="check-grid">${levelChecks('eeDiaryLevels')}</div></div><button class="btn btn-primary" type="submit">Assign Daily Diary Task</button></form><div class="table-wrap"><table class="table"><tr><th>Diary task</th><th>Assigned to</th><th>Deadline</th><th>Action</th></tr>${currentDiary.map(item=>`<tr><td><b>${esc(item.title||'Daily Diary Task')}</b><br><small>${esc(item.instructions||'')} ${item.activityId?`· Linked: ${esc((activities.find(a=>a.id===item.activityId)||{}).title||item.activityId)}`:''}</small></td><td>${esc(item.mode||'all')}</td><td>${esc(item.dueDate||'')}</td><td><button class="btn btn-danger" data-delete-ee-diary="${item.id}">Delete</button></td></tr>`).join('')||'<tr><td colspan="4">No Daily Diary task assigned yet.</td></tr>'}</table></div></div></div>`;
}
function injectEverydayEnglishAdminPanel(role){
  const tabs=$('.panel-tabs'); if(!tabs || $('[data-panel-tab="everyday-page"]')) return;
  const btn=document.createElement('button'); btn.className='tab'; btn.dataset.panelTab='everyday-page'; btn.textContent='Everyday English Page';
  const after=$('[data-panel-tab="english-clubs"]') || $('[data-panel-tab="profile-media"]') || tabs.lastElementChild;
  after ? after.insertAdjacentElement('afterend',btn) : tabs.appendChild(btn);
  const panel=document.createElement('div'); panel.className='panel'; panel.dataset.panel='everyday-page'; panel.innerHTML=everydayManagerPanel(role);
  const container=tabs.parentElement; container.appendChild(panel);
  btn.addEventListener('click',()=>{$$('[data-panel-tab]').forEach(x=>x.classList.remove('active'));btn.classList.add('active');$$('[data-panel]').forEach(p=>p.classList.toggle('active',p.dataset.panel==='everyday-page'));});
  wireEverydayManagerActions(role);
  if(location.hash.replace('#','')==='everyday-page') btn.click();
}
function wireEverydayManagerActions(role){
  $$('[data-editor-command]').forEach(b=>b.onclick=()=>{document.execCommand(b.dataset.editorCommand,false,b.dataset.editorValue||null); $('#courseOverviewEditor')?.focus();});
  $('[data-editor-link]')?.addEventListener('click',()=>{const url=prompt('Paste link URL'); if(url)document.execCommand('createLink',false,url);});
  $('#eeThemeForm')?.groupId?.addEventListener('change',e=>{const d=db(); const m=ensureEverydayModule(d); const f=$('#eeThemeForm'); const t=Object.assign({},m.theme||{},(m.groupThemes||{})[e.target.value]||{}); ['primary','accent','background','ink'].forEach(k=>{if(f[k]&&t[k])f[k].value=t[k];});});
  $('#eeThemeForm')?.addEventListener('submit',e=>{e.preventDefault(); const d=db(); const m=ensureEverydayModule(d); const f=e.target; const groupId=f.groupId?.value; if(!groupId)return toast('Select a group first.'); m.groupThemes=m.groupThemes||{}; m.groupThemes[groupId]={primary:f.primary.value,accent:f.accent.value,background:f.background.value,ink:f.ink.value}; m.lastThemeGroupId=groupId; saveEverydayModule(d,m); toast('Everyday English colours saved for the selected group.'); setTimeout(()=>location.reload(),450);});
  $('#eeOverviewForm')?.addEventListener('submit',e=>{e.preventDefault(); const d=db(); const m=ensureEverydayModule(d); m.overview.title=e.target.title.value.trim()||m.overview.title; m.overview.subtitle=e.target.subtitle.value.trim(); m.overview.body=$('#courseOverviewEditor')?.innerHTML || ''; saveEverydayModule(d,m); toast('Course overview saved.');});
  $('#eeMaterialForm')?.addEventListener('submit',async e=>{e.preventDefault(); const f=e.target; const file=$('#eeMaterialFile')?.files?.[0]; const url=f.url.value.trim(); if(!file && !url)return toast('Upload a file or paste a link.'); const d=db(); const m=ensureEverydayModule(d); let item={id:'mat-'+Date.now(),title:f.title.value.trim(),classDate:f.classDate.value,note:f.note.value.trim(),url,createdAt:new Date().toISOString()}; if(file){const saved=await readFileAsDataURL(file); item=Object.assign(item,{name:saved.name,type:saved.type,size:saved.size,data:saved.data}); if(!item.title)item.title=saved.name;} if(!item.title)item.title='Course Material'; m.materials.unshift(item); saveEverydayModule(d,m); toast('Course material added.'); setTimeout(()=>location.reload(),450);});
  $('#eeMaterialEditForm')?.addEventListener('submit',e=>{e.preventDefault(); const d=db(); const m=ensureEverydayModule(d); const rows=$$('.material-edit-row',e.target); rows.forEach(row=>{const id=$('[name="materialId"]',row)?.value; const item=(m.materials||[]).find(x=>x.id===id); if(item){item.title=$('[name="materialTitle"]',row)?.value.trim()||item.title; item.classDate=$('[name="materialDate"]',row)?.value||''; item.note=$('[name="materialNote"]',row)?.value.trim()||''; item.url=$('[name="materialUrl"]',row)?.value.trim()||item.url||''; item.updatedAt=new Date().toISOString();}}); saveEverydayModule(d,m); toast('Material edits saved.'); setTimeout(()=>location.reload(),450);});

  $('#eeDatesForm')?.addEventListener('submit',e=>{e.preventDefault(); const d=db(); const m=ensureEverydayModule(d); m.importantDates=parseDateLines(e.target.dates.value); saveEverydayModule(d,m); toast('Important dates saved.');});
  $('#eeBankForm')?.addEventListener('submit',e=>{e.preventDefault(); const d=db(); const m=ensureEverydayModule(d); m.languageBank={grammar:parseBankLines(e.target.grammar.value),vocabulary:parseBankLines(e.target.vocabulary.value),pronunciation:parseBankLines(e.target.pronunciation.value)}; saveEverydayModule(d,m); toast('Language bank saved.');});
  $('#eeDiaryForm')?.addEventListener('submit',e=>{e.preventDefault(); const d=db(); const m=ensureEverydayModule(d); const f=e.target; const act=f.activityId.value ? d.activities.find(a=>a.id===f.activityId.value) : null; const item={id:'diary-'+Date.now(),activityId:f.activityId.value,title:f.title.value.trim() || act?.title || 'Daily Diary Task',instructions:f.instructions.value.trim() || act?.instructions || '',dueDate:f.dueDate.value,mode:f.mode.value,groupIds:selectedValues('#eeDiaryForm [name="groupIds"]'),userIds:selectedValues('#eeDiaryForm [name="userIds"]'),levels:checkedValues('eeDiaryLevels',f),createdAt:new Date().toISOString(),createdBy:user()?.id||''}; m.dailyDiary.unshift(item); saveEverydayModule(d,m); toast('Daily Diary task assigned.'); setTimeout(()=>location.href=(role==='editor'?'editor.html':'admin.html')+'#everyday-page',450);});
  $$('[data-delete-ee-material]').forEach(b=>b.onclick=()=>{if(!confirm('Delete this course material?'))return; const d=db(); const m=ensureEverydayModule(d); m.materials=(m.materials||[]).filter(x=>x.id!==b.dataset.deleteEeMaterial); saveEverydayModule(d,m); location.reload();});
  $$('[data-delete-ee-diary]').forEach(b=>b.onclick=()=>{if(!confirm('Delete this Daily Diary task?'))return; const d=db(); const m=ensureEverydayModule(d); m.dailyDiary=(m.dailyDiary||[]).filter(x=>x.id!==b.dataset.deleteEeDiary); d.users.filter(u=>u.role==='student').forEach(s=>{ensureStudentProfileFields(s); s.dailyDiaryDone=(s.dailyDiaryDone||[]).filter(id=>id!==b.dataset.deleteEeDiary);}); saveEverydayModule(d,m); location.reload();});
}
const __ieaOriginalAdminPage = adminPage;
adminPage = function(role='admin'){
  __ieaOriginalAdminPage(role);
  injectEverydayEnglishAdminPanel(role);
};
const __ieaOriginalProfile = profile;
profile = function(){
  __ieaOriginalProfile();
  const u=user(); if(!u)return;
  const id=params.get('id') || u.id;
  const d=db(); const s=d.users.find(x=>x.id===id); if(!s || s.role!=='student')return;
  ensureStudentProfileFields(s); const diary=dailyDiaryStats(d,s);
  const section=`<section class="section daily-diary-profile-section"><div class="container"><div class="card"><p class="eyebrow">Daily Diary</p><h2>Course diary progress</h2><div class="profile-completion-hero"><span>Daily Diary Completion</span><strong>${diary.percent}%</strong><small>${diary.doneCount} completed out of ${diary.total} assigned Daily Diary tasks.</small><div class="progress big-progress"><i style="--v:${diary.percent}%"></i></div></div>${diary.items.length?`<table class="table"><tr><th>Diary task</th><th>Deadline</th><th>Status</th></tr>${diary.items.map(item=>`<tr><td>${esc(item.title||'Daily Diary Task')}</td><td>${esc(item.dueDate||'')}</td><td>${isDiaryItemDone(d,s,item)?'Done':'Pending'}</td></tr>`).join('')}</table>`:'<div class="empty">No Daily Diary tasks assigned yet.</div>'}</div></div></section>`;
  $('#app')?.insertAdjacentHTML('beforeend',section);
};


/* === IEA requested brand images + human illustrations + all-page colour controls === */

function ieaPageColourDefaults(){
  return {
    primary:'#01bf63',
    accent:'#d7b86b',
    text:'#f7f2e9',
    bgStart:'#050608',
    bgEnd:'#0b0f11',
    topbar:'#07110d',
    bodyFont:'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    headingFont:'Georgia, "Times New Roman", serif',
    baseFontSize:'16',
    heroTitleSize:'76',
    headingSize:'42',
    textLineHeight:'1.65',
    titleWeight:'800',
    letterSpacing:'-0.055',
    topbarHeight:'78',
    topbarLineSize:'1',
    topbarLineColor:'rgba(255,255,255,.13)',
    topbarTextSize:'13',
    footerPadding:'34',
    footerLineSize:'1',
    footerLineColor:'rgba(255,255,255,.13)',
    footerTextSize:'13',
    illustrationVisibility:'auto',
    leftIllustration:'',
    rightIllustration:'',
    bannerIllustration:'',
    heroEyebrow:'',
    heroTitle:'',
    heroSubtitle:'',
    primaryCtaText:'',
    primaryCtaLink:'',
    secondaryCtaText:'',
    secondaryCtaLink:''
  };
}
function ieaPageColourKey(){
  return document.body?.dataset?.page || 'home';
}
function ieaAllPageColourList(){
  return [
    ['main-home','Main Website · Home'],
    ['about','Main Website · About'],
    ['main-everyday-english','Main Website · Everyday English'],
    ['levels','Main Website · Levels'],
    ['clubs','Main Website · Clubs'],
    ['awareness-club','Main Website · Awareness Club'],
    ['reading-club','Main Website · Reading Club'],
    ['film-club','Main Website · Film Club'],
    ['trainer','Main Website · Trainer'],
    ['pricing','Main Website · Pricing'],
    ['process','Main Website · Process'],
    ['blog','Main Website · Blog'],
    ['contact','Main Website · Contact / Join'],
    ['home','Games Section · Home'],
    ['login','Login Portal'],
    ['student','Student Dashboard'],
    ['admin','Admin Dashboard'],
    ['editor','Editor Dashboard'],
    ['grammar','Grammar Games'],
    ['vocabulary','Vocabulary Games'],
    ['pronunciation','Pronunciation Games'],
    ['reading','Reading Games'],
    ['listening','Listening Games'],
    ['writing-speaking','Writing & Speaking Games'],
    ['activity','Activity Player'],
    ['builder','Game Builder'],
    ['leaderboard','Leaderboard'],
    ['profile','Student Profile'],
    ['everyday-english','Student Everyday English Page'],
    ['iea-clubs','Student IEA Clubs Page']
  ];
}
function ieaHexToRgb(hex){
  const v=String(hex||'').replace('#','').trim();
  if(!/^[0-9a-f]{6}$/i.test(v)) return null;
  return [parseInt(v.slice(0,2),16),parseInt(v.slice(2,4),16),parseInt(v.slice(4,6),16)];
}
function ieaCurrentPageDesign(key=ieaPageColourKey()){
  let d; try{d=db();}catch(e){d=null;}
  return Object.assign({}, ieaPageColourDefaults(), ((d&&d.pageColours)||{})[key]||{});
}
function ieaApplyPageColours(){
  const key=ieaPageColourKey();
  const t=ieaCurrentPageDesign(key);
  const root=document.documentElement;
  root.style.setProperty('--green',t.primary);
  root.style.setProperty('--mint',t.primary);
  root.style.setProperty('--gold',t.accent);
  root.style.setProperty('--gold2',t.accent);
  root.style.setProperty('--text',t.text);
  root.style.setProperty('--bg',t.bgStart);
  root.style.setProperty('--bg2',t.bgEnd);
  root.style.setProperty('--iea-topbar',t.topbar);
  root.style.setProperty('--iea-body-font',t.bodyFont);
  root.style.setProperty('--iea-heading-font',t.headingFont);
  root.style.setProperty('--iea-base-font-size',(Number(t.baseFontSize)||16)+'px');
  root.style.setProperty('--iea-hero-title-size',(Number(t.heroTitleSize)||76)+'px');
  root.style.setProperty('--iea-heading-size',(Number(t.headingSize)||42)+'px');
  root.style.setProperty('--iea-text-line-height',Number(t.textLineHeight)||1.65);
  root.style.setProperty('--iea-title-weight',Number(t.titleWeight)||800);
  root.style.setProperty('--iea-letter-spacing',(Number(t.letterSpacing)||0)+'em');
  root.style.setProperty('--iea-topbar-height',(Number(t.topbarHeight)||78)+'px');
  root.style.setProperty('--iea-topbar-line-size',(Number(t.topbarLineSize)||1)+'px');
  root.style.setProperty('--iea-topbar-line-color',t.topbarLineColor||'var(--line)');
  root.style.setProperty('--iea-topbar-text-size',(Number(t.topbarTextSize)||13)+'px');
  root.style.setProperty('--iea-footer-padding',(Number(t.footerPadding)||34)+'px');
  root.style.setProperty('--iea-footer-line-size',(Number(t.footerLineSize)||1)+'px');
  root.style.setProperty('--iea-footer-line-color',t.footerLineColor||'var(--line)');
  root.style.setProperty('--iea-footer-text-size',(Number(t.footerTextSize)||13)+'px');
  document.body.classList.add('iea-custom-page-colours');
}
function ieaFontOptions(selected){
  const fonts=[
    ['Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif','Inter / System'],
    ['Georgia, "Times New Roman", serif','Georgia / Editorial'],
    ['"Trebuchet MS", Arial, sans-serif','Trebuchet'],
    ['Arial, Helvetica, sans-serif','Arial'],
    ['Verdana, Geneva, sans-serif','Verdana'],
    ['"Times New Roman", Times, serif','Times New Roman'],
    ['"Courier New", Courier, monospace','Courier New']
  ];
  return fonts.map(([v,label])=>`<option value="${esc(v)}" ${selected===v?'selected':''}>${label}</option>`).join('');
}
function ieaPageColourPanel(){
  const d=db(); d.pageColours=d.pageColours||{};
  const selected=d.lastPageColourKey || 'home';
  const t=Object.assign({},ieaPageColourDefaults(),d.pageColours[selected]||{});
  const options=ieaAllPageColourList().map(([id,label])=>`<option value="${id}" ${id===selected?'selected':''}>${label}</option>`).join('');
  return `<div class="card"><p class="eyebrow">All Page Controls</p><h2>Full professional control for every page</h2><p class="lead" style="font-size:14px">Only Admin and Editor can change these settings. Select a page, adjust colours, text style, top bar, bottom bar and illustrations, then save.</p>
    <form class="form" id="ieaAllPageColoursForm">
      <div class="field"><label>Select page</label><select class="input" name="pageKey">${options}</select><small>Every page keeps its own design settings separately.</small></div>

      <div class="page-control-block"><h3>Colours</h3><div class="grid grid-4">
        <div class="field"><label>Primary colour</label><input class="input" type="color" name="primary" value="${esc(t.primary)}"></div>
        <div class="field"><label>Accent colour</label><input class="input" type="color" name="accent" value="${esc(t.accent)}"></div>
        <div class="field"><label>Text colour</label><input class="input" type="color" name="text" value="${esc(t.text)}"></div>
        <div class="field"><label>Top bar colour</label><input class="input" type="color" name="topbar" value="${esc(t.topbar)}"></div>
      </div>
      <div class="grid grid-2">
        <div class="field"><label>Background start</label><input class="input" type="color" name="bgStart" value="${esc(t.bgStart)}"></div>
        <div class="field"><label>Background end</label><input class="input" type="color" name="bgEnd" value="${esc(t.bgEnd)}"></div>
      </div></div>

      <div class="page-control-block"><h3>Text, font and heading style</h3><div class="grid grid-3">
        <div class="field"><label>Body font</label><select class="input" name="bodyFont">${ieaFontOptions(t.bodyFont)}</select></div>
        <div class="field"><label>Heading font</label><select class="input" name="headingFont">${ieaFontOptions(t.headingFont)}</select></div>
        <div class="field"><label>Base text size (px)</label><input class="input" type="number" min="12" max="24" name="baseFontSize" value="${esc(t.baseFontSize)}"></div>
        <div class="field"><label>Main title size (px)</label><input class="input" type="number" min="34" max="130" name="heroTitleSize" value="${esc(t.heroTitleSize)}"></div>
        <div class="field"><label>Section heading size (px)</label><input class="input" type="number" min="24" max="90" name="headingSize" value="${esc(t.headingSize)}"></div>
        <div class="field"><label>Line height</label><input class="input" type="number" min="1.1" max="2.2" step="0.05" name="textLineHeight" value="${esc(t.textLineHeight)}"></div>
        <div class="field"><label>Title weight</label><select class="input" name="titleWeight"><option ${String(t.titleWeight)==='600'?'selected':''}>600</option><option ${String(t.titleWeight)==='700'?'selected':''}>700</option><option ${String(t.titleWeight)==='800'?'selected':''}>800</option><option ${String(t.titleWeight)==='900'?'selected':''}>900</option></select></div>
        <div class="field"><label>Title letter spacing (em)</label><input class="input" type="number" min="-0.12" max="0.12" step="0.005" name="letterSpacing" value="${esc(t.letterSpacing)}"></div>
      </div></div>

      <div class="page-control-block"><h3>Top bar and bottom bar</h3><div class="grid grid-4">
        <div class="field"><label>Top bar height (px)</label><input class="input" type="number" min="54" max="140" name="topbarHeight" value="${esc(t.topbarHeight)}"></div>
        <div class="field"><label>Top line size (px)</label><input class="input" type="number" min="0" max="8" name="topbarLineSize" value="${esc(t.topbarLineSize)}"></div>
        <div class="field"><label>Top line colour</label><input class="input" type="text" name="topbarLineColor" value="${esc(t.topbarLineColor)}" placeholder="rgba(...) or #000000"></div>
        <div class="field"><label>Top text size (px)</label><input class="input" type="number" min="10" max="22" name="topbarTextSize" value="${esc(t.topbarTextSize)}"></div>
        <div class="field"><label>Bottom bar padding (px)</label><input class="input" type="number" min="12" max="90" name="footerPadding" value="${esc(t.footerPadding)}"></div>
        <div class="field"><label>Bottom line size (px)</label><input class="input" type="number" min="0" max="8" name="footerLineSize" value="${esc(t.footerLineSize)}"></div>
        <div class="field"><label>Bottom line colour</label><input class="input" type="text" name="footerLineColor" value="${esc(t.footerLineColor)}" placeholder="rgba(...) or #000000"></div>
        <div class="field"><label>Bottom text size (px)</label><input class="input" type="number" min="10" max="22" name="footerTextSize" value="${esc(t.footerTextSize)}"></div>
      </div></div>

      <div class="page-control-block"><h3>Words and main page content</h3><p class="lead" style="font-size:13px">Optional. Fill these only when you want to override the selected page's top text. Empty fields keep the original page words.</p><div class="grid grid-2">
        <div class="field"><label>Small top line / eyebrow</label><input class="input" name="heroEyebrow" value="${esc(t.heroEyebrow||'')}" placeholder="Example: Premium English Learning"></div>
        <div class="field"><label>Main title</label><input class="input" name="heroTitle" value="${esc(t.heroTitle||'')}" placeholder="Main heading of this page"></div>
      </div>
      <div class="field"><label>Subtitle / paragraph</label><textarea name="heroSubtitle" placeholder="Main page description">${esc(t.heroSubtitle||'')}</textarea></div>
      <div class="grid grid-4">
        <div class="field"><label>Primary button text</label><input class="input" name="primaryCtaText" value="${esc(t.primaryCtaText||'')}"></div>
        <div class="field"><label>Primary button link</label><input class="input" name="primaryCtaLink" value="${esc(t.primaryCtaLink||'')}"></div>
        <div class="field"><label>Secondary button text</label><input class="input" name="secondaryCtaText" value="${esc(t.secondaryCtaText||'')}"></div>
        <div class="field"><label>Secondary button link</label><input class="input" name="secondaryCtaLink" value="${esc(t.secondaryCtaLink||'')}"></div>
      </div></div>

      <div class="page-control-block"><h3>Illustrations for selected page</h3><p class="lead" style="font-size:13px">Upload or paste illustration images. Empty fields use the current IEA human illustrations. This controls the selected page only.</p>
        <div class="field"><label>Illustration visibility</label><select class="input" name="illustrationVisibility"><option value="auto" ${t.illustrationVisibility==='auto'?'selected':''}>Auto: show on game/student pages</option><option value="show" ${t.illustrationVisibility==='show'?'selected':''}>Show on this page</option><option value="hide" ${t.illustrationVisibility==='hide'?'selected':''}>Hide on this page</option></select></div>
        <div class="grid grid-3">
          <div class="field"><label>Left/human illustration URL</label><input class="input" name="leftIllustration" value="${esc(t.leftIllustration)}" placeholder="Paste image URL or upload below"><input class="input" type="file" id="ieaLeftIllustrationFile" accept="image/*"></div>
          <div class="field"><label>Right/human illustration URL</label><input class="input" name="rightIllustration" value="${esc(t.rightIllustration)}" placeholder="Paste image URL or upload below"><input class="input" type="file" id="ieaRightIllustrationFile" accept="image/*"></div>
          <div class="field"><label>Wide banner illustration URL</label><input class="input" name="bannerIllustration" value="${esc(t.bannerIllustration)}" placeholder="Optional wide image"><input class="input" type="file" id="ieaBannerIllustrationFile" accept="image/*"></div>
        </div>
      </div>

      <div class="iea-colour-preview" id="ieaColourPreview" style="--preview-primary:${esc(t.primary)};--preview-accent:${esc(t.accent)};--preview-text:${esc(t.text)};--preview-bg-start:${esc(t.bgStart)};--preview-bg-end:${esc(t.bgEnd)};font-family:${esc(t.bodyFont)}"><strong>Preview</strong><span>IEA page design control</span></div>
      <div class="actions"><button class="btn btn-primary" type="submit">Save Full Page Control</button><button class="btn" type="button" id="ieaResetPageColours">Reset Selected Page</button></div>
    </form>
  </div>`;
}
function ieaInjectAllPageColoursPanel(role){
  if(!isTeacher()) return;
  const tabs=$('.panel-tabs'); if(!tabs || $('[data-panel-tab="all-page-colours"]')) return;
  const btn=document.createElement('button');
  btn.className='tab';
  btn.dataset.panelTab='all-page-colours';
  btn.textContent='All Page Controls';
  const after=$('[data-panel-tab="everyday-page"]') || $('[data-panel-tab="english-clubs"]') || $('[data-panel-tab="media"]') || tabs.lastElementChild;
  after ? after.insertAdjacentElement('afterend',btn) : tabs.appendChild(btn);
  const panel=document.createElement('div');
  panel.className='panel';
  panel.dataset.panel='all-page-colours';
  panel.innerHTML=ieaPageColourPanel();
  tabs.parentElement.appendChild(panel);
  btn.addEventListener('click',()=>{
    $$('[data-panel-tab]').forEach(x=>x.classList.remove('active'));
    btn.classList.add('active');
    $$('[data-panel]').forEach(p=>p.classList.toggle('active',p.dataset.panel==='all-page-colours'));
  });
  ieaWireAllPageColours();
}
function ieaPageControlValues(form){
  const out={};
  ['primary','accent','text','bgStart','bgEnd','topbar','bodyFont','headingFont','baseFontSize','heroTitleSize','headingSize','textLineHeight','titleWeight','letterSpacing','topbarHeight','topbarLineSize','topbarLineColor','topbarTextSize','footerPadding','footerLineSize','footerLineColor','footerTextSize','illustrationVisibility','leftIllustration','rightIllustration','bannerIllustration','heroEyebrow','heroTitle','heroSubtitle','primaryCtaText','primaryCtaLink','secondaryCtaText','secondaryCtaLink'].forEach(k=>{if(form[k])out[k]=form[k].value;});
  return out;
}
function ieaLoadPageControlIntoForm(form,key){
  const d=db(); d.pageColours=d.pageColours||{};
  const t=Object.assign({},ieaPageColourDefaults(),d.pageColours[key]||{});
  Object.keys(ieaPageColourDefaults()).forEach(k=>{if(form[k])form[k].value=t[k]??'';});
  ieaPaintPageControlPreview(form);
}
function ieaPaintPageControlPreview(form){
  const p=$('#ieaColourPreview'); if(!p)return;
  const v=ieaPageControlValues(form);
  p.style.setProperty('--preview-primary',v.primary);
  p.style.setProperty('--preview-accent',v.accent);
  p.style.setProperty('--preview-text',v.text);
  p.style.setProperty('--preview-bg-start',v.bgStart);
  p.style.setProperty('--preview-bg-end',v.bgEnd);
  p.style.fontFamily=v.bodyFont||'inherit';
  const title=p.querySelector('strong'); if(title){title.style.fontFamily=v.headingFont||'inherit';title.style.fontSize=(Number(v.headingSize)||42)+'px';title.style.fontWeight=v.titleWeight||800;}
}
function ieaWireAllPageColours(){
  const form=$('#ieaAllPageColoursForm'); if(!form)return;
  form.pageKey.addEventListener('change',()=>ieaLoadPageControlIntoForm(form,form.pageKey.value));
  $$('input,select,textarea',form).forEach(el=>el.addEventListener('input',()=>ieaPaintPageControlPreview(form)));
  form.addEventListener('submit',async e=>{
    e.preventDefault();
    const d=db(); d.pageColours=d.pageColours||{};
    const key=form.pageKey.value;
    const leftFile=$('#ieaLeftIllustrationFile')?.files?.[0];
    const rightFile=$('#ieaRightIllustrationFile')?.files?.[0];
    const bannerFile=$('#ieaBannerIllustrationFile')?.files?.[0];
    if(leftFile){const saved=await readFileAsDataURL(leftFile); form.leftIllustration.value=saved.data;}
    if(rightFile){const saved=await readFileAsDataURL(rightFile); form.rightIllustration.value=saved.data;}
    if(bannerFile){const saved=await readFileAsDataURL(bannerFile); form.bannerIllustration.value=saved.data;}
    d.pageColours[key]=ieaPageControlValues(form);
    d.lastPageColourKey=key;
    saveDB(d);
    if(key===ieaPageColourKey()){ieaApplyPageColours();ieaInjectHumanIllustrations(true);}
    toast('Full page control saved for the selected page.');
  });
  $('#ieaResetPageColours')?.addEventListener('click',()=>{
    const d=db(); d.pageColours=d.pageColours||{};
    delete d.pageColours[form.pageKey.value];
    d.lastPageColourKey=form.pageKey.value;
    saveDB(d);
    ieaLoadPageControlIntoForm(form,form.pageKey.value);
    if(form.pageKey.value===ieaPageColourKey()){ieaApplyPageColours();ieaInjectHumanIllustrations(true);}
    toast('Selected page controls reset.');
  });
}
function ieaDefaultIllustrationVisible(page){
  return ['home','student','grammar','vocabulary','pronunciation','reading','listening','writing-speaking','activity','builder'].includes(page);
}
function ieaHumanIllustrationHTML(design=ieaCurrentPageDesign()){
  const page=ieaPageColourKey();
  const visibility=design.illustrationVisibility||'auto';
  const show=visibility==='show' || (visibility==='auto' && ieaDefaultIllustrationVisible(page));
  if(!show)return '';
  const left=design.leftIllustration || 'assets/images/iea-human-illustration-left.png';
  const right=design.rightIllustration || 'assets/images/iea-human-illustration-right.png';
  const banner=design.bannerIllustration || '';
  return `<div class="iea-human-illustrations" aria-label="International English Academy illustration images">
    ${banner?`<div class="iea-human-illustration-card wide"><img src="${esc(banner)}" alt="IEA page banner illustration"></div>`:''}
    <div class="iea-human-illustration-card"><img src="${esc(left)}" alt="Students learning English together"></div>
    <div class="iea-human-illustration-card"><img src="${esc(right)}" alt="Online English learning illustration"></div>
  </div>`;
}
function ieaInjectHumanIllustrations(force=false){
  const design=ieaCurrentPageDesign();
  const html=ieaHumanIllustrationHTML(design);
  $$('.iea-human-illustrations,.iea-student-illustration-band,.iea-page-custom-illustration-band').forEach(x=>x.remove());
  if(!html)return;
  let injected=false;
  $$('.stage').forEach(stage=>{
    stage.classList.add('has-brand-illustrations');
    stage.insertAdjacentHTML('beforeend',html);
    injected=true;
  });
  if(!injected){
    const heroContainer=$('.hero .container') || $('.section .container') || $('#app');
    if(heroContainer){
      heroContainer.insertAdjacentHTML('beforeend',`<div class="iea-page-custom-illustration-band">${html}</div>`);
    }
  }
  if(ieaPageColourKey()==='student'){
    const container=$('#assigned-games .container') || $('.section .container');
    if(container){
      container.insertAdjacentHTML('afterbegin',`<div class="iea-student-illustration-band">${html}</div>`);
    }
  }
}
function iconSVG(){
  return `<img class="iea-logo-transparent-img" src="assets/images/iea-logo-transparent.png" alt="International English Academy India">`;
}

/* ============================================================
   SIMPLE QUESTION + ANSWER GAME BUILDER
   Admin/editor only. The old JSON workflow is still possible by
   opening Advanced options, but teachers can now paste only Q&A.
   ============================================================ */
function ieaCleanSimpleLine(line){
  return String(line||'').replace(/^\s*[-*]\s*/,'').replace(/^\s*\d+[\.\)]\s*/,'').trim();
}
function ieaSplitQA(line){
  const cleaned=ieaCleanSimpleLine(line);
  if(!cleaned)return null;
  let parts=[];
  if(cleaned.includes('|')) parts=cleaned.split('|');
  else if(cleaned.includes('=>')) parts=cleaned.split('=>');
  else if(cleaned.includes('=')) parts=cleaned.split('=');
  else if(cleaned.includes('\t')) parts=cleaned.split('\t');
  else return null;
  parts=parts.map(x=>x.trim()).filter(Boolean);
  if(parts.length<2)return null;
  return {prompt:parts[0],answer:parts[1],options:parts[2]?parts[2].split(',').map(x=>x.trim()).filter(Boolean):[]};
}
function ieaParseSimpleQA(text){
  return String(text||'').split(/\n+/).map(ieaSplitQA).filter(Boolean);
}
function ieaOptionsForAnswer(q,allAnswers){
  const set=new Set([q.answer,...(q.options||[]),...allAnswers.filter(a=>a!==q.answer)]);
  const fallback=['True','False','Not given','Maybe','No answer','Both A and B','None of these'];
  fallback.forEach(x=>{if(set.size<4)set.add(x)});
  const arr=Array.from(set).slice(0,4);
  if(!arr.includes(q.answer)){arr.pop();arr.unshift(q.answer);}
  return arr.sort(()=>Math.random()-.5);
}
function ieaSimpleTextFromActivity(a){
  if(!a)return 'What is your name? | My name is Riya\nWhere do you live? | I live in Purulia\nWhy are you learning English? | To communicate clearly';
  if(a.engine==='matching')return (a.pairs||[]).map(p=>`${p.left} | ${p.right}`).join('\n');
  if(a.engine==='flashcards')return (a.vocab||[]).map(v=>`${v.word} | ${v.meaning}${v.example?' | '+v.example:''}`).join('\n');
  if(a.engine==='order')return (a.items||[]).length?`Arrange this sentence | ${(a.items||[]).join(' ')}`:'I am learning English | I am learning English';
  return (a.questions||[]).map(q=>`${q.prompt||''} | ${q.answer||''}${(q.options||[]).length?' | '+q.options.join(', '):''}`).join('\n') || '';
}
function ieaEngineLabel(engine){
  return ({objective:'Auto Multiple Choice',fill:'Auto Fill / Short Answer',matching:'Auto Matching',flashcards:'Auto Flashcards',reading:'Reading Quiz',listening:'Listening Quiz',writing:'Writing Prompt',speaking:'Speaking Prompt'}[engine]||'Auto Game');
}
function ieaBuildSimpleActivityFromForm(f,existing){
  const engine=f.gameEngine.value;
  const category=f.category.value;
  const raw=ieaParseSimpleQA(f.simpleQA.value);
  const answers=raw.map(x=>x.answer).filter(Boolean);
  const base={
    id:existing?.id || ('custom-'+Date.now()),
    category,
    template:ieaEngineLabel(engine),
    engine,
    title:f.title.value.trim() || 'Untitled IEA Game',
    instructions:f.instructions.value.trim() || 'Complete the task.',
    level:f.level.value.trim() || 'A1-C2',
    difficulty:f.difficulty.value,
    xp:Number(f.xp.value)||100,
    timeLimit:Number(f.timeLimit.value)||0,
    status:existing?.status || 'published',
    visibility:existing?.visibility || {mode:'all',groupIds:[],userIds:[],levels:[]},
    media:existing?.media || '',
    mediaItems:existing?.mediaItems || [],
    createdBy:existing?.createdBy || user()?.id || 'teacher',
    updatedAt:new Date().toISOString()
  };
  if(!base.timeLimit)delete base.timeLimit;
  if(engine==='objective' || engine==='reading' || engine==='listening'){
    base.questions=raw.map(q=>({prompt:q.prompt,answer:q.answer,options:ieaOptionsForAnswer(q,answers),hint:'Look carefully at the meaning and grammar.',explanation:`Correct answer: ${q.answer}`}));
  }else if(engine==='fill'){
    base.questions=raw.map(q=>({prompt:q.prompt,answer:q.answer,hint:'Think of the exact answer.',explanation:`Expected answer: ${q.answer}`}));
  }else if(engine==='matching'){
    base.pairs=raw.map(q=>({left:q.prompt,right:q.answer}));
  }else if(engine==='flashcards'){
    base.vocab=raw.map(q=>({word:q.prompt,meaning:q.answer,example:(q.options||[]).join(', ')}));
  }else if(engine==='writing'){
    base.prompt=f.bodyText.value.trim() || raw.map(q=>q.prompt).join('\n') || 'Write your response.';
    base.rubric=['Clear ideas','Relevant examples','Good organisation','Accurate grammar','Appropriate vocabulary'];
  }else if(engine==='speaking'){
    base.prompt=f.bodyText.value.trim() || raw.map(q=>q.prompt).join('\n') || 'Speak for one minute.';
    base.rubric=['Clear pronunciation','Relevant ideas','Fluency','Accuracy','Confidence'];
  }
  if(engine==='reading')base.passage=f.bodyText.value.trim()||'Add the reading passage here.';
  else if(engine==='listening')base.transcript=f.bodyText.value.trim()||'Add the listening transcript here.';
  else if(engine!=='writing' && engine!=='speaking')base.bodyText=f.bodyText.value.trim();
  const advanced=f.advancedJSON?.value?.trim();
  if(advanced){
    try{Object.assign(base,JSON.parse(advanced));}
    catch(e){throw new Error('Advanced JSON is not valid. Remove it or fix it.');}
  }
  if(!raw.length && !['writing','speaking'].includes(engine))throw new Error('Add at least one question and answer.');
  return base;
}
function builder(){
  const u=requireRole(['admin','editor']); if(!u)return;
  const d=db(); const cats=Object.keys(window.IEA_SEED.categories);
  const editId=params.get('id'); const existing=editId?d.activities.find(a=>a.id===editId):null;
  const category=params.get('category') || existing?.category || 'grammar';
  const engine=existing?.engine || 'objective';
  const simpleText=ieaSimpleTextFromActivity(existing);
  $('#app').innerHTML=`<section class="hero"><div class="container hero-grid"><div><p class="eyebrow">Simple Game Builder</p><h1 class="mega">${existing?'Edit game':'Add questions. Games build automatically.'}</h1><p class="lead">No difficult JSON needed. Write one question and answer per line. The system will automatically create the activity format.</p><div class="hero-actions"><a class="btn" href="${u.role==='editor'?'editor':'admin'}.html">Back to Panel</a><button class="btn btn-gold" id="loadSimpleExample" type="button">Load Example</button></div></div><div class="stage">${illustration('builder')}<div class="float-card one"><strong>Q + A</strong><span>simple input</span></div><div class="float-card two"><strong>Auto</strong><span>game engine</span></div></div></div></section>
  <section class="section"><div class="container grid grid-2"><form class="card form" id="builderForm">
    <div class="grid grid-2"><div class="field"><label>Skill/category</label><select name="category" class="input">${cats.map(c=>`<option value="${c}" ${c===category?'selected':''}>${catTitle(c)}</option>`).join('')}</select></div>
    <div class="field"><label>Game type</label><select name="gameEngine" class="input">
      <option value="objective" ${engine==='objective'?'selected':''}>Auto Multiple Choice</option>
      <option value="fill" ${engine==='fill'?'selected':''}>Auto Fill / Short Answer</option>
      <option value="matching" ${engine==='matching'?'selected':''}>Auto Matching</option>
      <option value="flashcards" ${engine==='flashcards'?'selected':''}>Auto Flashcards</option>
      <option value="reading" ${engine==='reading'?'selected':''}>Reading Quiz</option>
      <option value="listening" ${engine==='listening'?'selected':''}>Listening Quiz</option>
      <option value="writing" ${engine==='writing'?'selected':''}>Writing Prompt</option>
      <option value="speaking" ${engine==='speaking'||engine==='recording'?'selected':''}>Speaking Prompt</option>
    </select></div></div>
    <div class="field"><label>Game title</label><input class="input" name="title" value="${esc(existing?.title||'New IEA Practice Game')}"></div>
    <div class="field"><label>Instructions shown to students</label><textarea name="instructions">${esc(existing?.instructions||'Read each question and complete the task.')}</textarea></div>
    <div class="grid grid-3"><div class="field"><label>Level</label><input class="input" name="level" value="${esc(existing?.level||'A2-B1')}"></div><div class="field"><label>Difficulty</label><select class="input" name="difficulty"><option ${existing?.difficulty==='Easy'?'selected':''}>Easy</option><option ${!existing||existing?.difficulty==='Medium'?'selected':''}>Medium</option><option ${existing?.difficulty==='Hard'?'selected':''}>Hard</option></select></div><div class="field"><label>XP</label><input class="input" name="xp" type="number" value="${esc(existing?.xp||100)}"></div></div>
    <div class="field"><label>Time limit in seconds <small>(optional)</small></label><input class="input" name="timeLimit" type="number" min="0" placeholder="Example: 300" value="${esc(existing?.timeLimit||'')}"></div>
    <div class="field"><label>Questions and answers <small>One line each: Question | Correct answer | optional options</small></label><textarea name="simpleQA" id="simpleQABox" class="builder-simple-box" placeholder="What is your name? | My name is Riya&#10;Where do you live? | I live in Purulia">${esc(simpleText)}</textarea></div>
    <div class="field"><label>Passage / transcript / writing or speaking prompt <small>(only needed for reading, listening, writing or speaking)</small></label><textarea name="bodyText">${esc(existing?.passage||existing?.transcript||existing?.prompt||existing?.bodyText||'')}</textarea></div>
    <details class="advanced-builder"><summary>Advanced optional JSON</summary><p class="lead" style="font-size:13px">Only use this if you need special custom data. The simple Q&A box above is enough for normal games.</p><textarea name="advancedJSON" class="builder-advanced-json"></textarea></details>
    <button class="btn btn-primary" type="submit">${existing?'Save Edited Game':'Build Game Automatically'}</button>
  </form><div class="card"><p class="eyebrow">How to write</p><h2>Simple format</h2><div class="rich-output"><p><b>Basic:</b> Question | Answer</p><p><b>With options:</b> Question | Correct answer | option 1, option 2, option 3</p><p><b>Matching:</b> Left item | Right item</p><p><b>Flashcards:</b> Word | Meaning | Example</p></div><div class="iea-builder-live-preview" id="simpleBuilderPreview"></div></div></div></section>`;
  function updatePreview(){
    const raw=ieaParseSimpleQA($('#simpleQABox').value);
    const engine=$('[name="gameEngine"]').value;
    $('#simpleBuilderPreview').innerHTML=`<p class="eyebrow">Live Preview</p><h3>${raw.length} item${raw.length===1?'':'s'} ready</h3><p>Game type: <b>${ieaEngineLabel(engine)}</b></p>${raw.slice(0,5).map((q,i)=>`<div class="preview-q"><b>${i+1}. ${esc(q.prompt)}</b><span>${esc(q.answer)}</span></div>`).join('')}${raw.length>5?`<small>+ ${raw.length-5} more</small>`:''}`;
  }
  $('#loadSimpleExample').onclick=()=>{$('#simpleQABox').value='I ____ to the academy every Sunday. | go | go, goes, going, went\nShe ____ already finished her homework. | has | has, have, is, did\nWhat does "improve" mean? | become better\nWhich word is stressed first: BLACKboard or black BOARD? | BLACKboard'; updatePreview();};
  $('#simpleQABox').addEventListener('input',updatePreview);
  $('[name="gameEngine"]').addEventListener('change',updatePreview);
  updatePreview();
  $('#builderForm').onsubmit=e=>{
    e.preventDefault();
    try{
      const activity=ieaBuildSimpleActivityFromForm(e.target,existing);
      const database=db();
      const idx=database.activities.findIndex(a=>a.id===activity.id);
      if(idx>=0)database.activities[idx]=activity; else database.activities.unshift(activity);
      saveDB(database);
      toast(existing?'Game updated successfully.':'Game built automatically.');
      setTimeout(()=>location.href=`activity.html?id=${activity.id}`,650);
    }catch(err){toast(err.message||'Could not build this game.');}
  };
}

/* ============================================================
   IEA UNIFIED MAIN + GAME CONTROL PATCH
   - main-site colour system copied to game pages
   - public simple grammar game on Tasks & Games
   - login required for full games
   - full page colour/font/bar/illustration controls with live preview
   - apply one design to all pages
   ============================================================ */
function ieaPageColourDefaults(){
  return {
    primary:'#01bf63', accent:'#d9b56d', accent2:'#f3ddac', text:'#f7f3ea', muted:'#b9b0a2',
    bgStart:'#050505', bgEnd:'#0d0d0f', line:'#2b2b2b', glass:'#181818', glass2:'#242424',
    topbar:'#0a0a0a', navText:'#b9b0a2', navActiveBg:'#f7f3ea', navActiveText:'#050505',
    mint:'#97d6ba', pink:'#fda4fb', blue:'#8fb7ff', violet:'#c6a4ff',
    cardGlowA:'#01bf63', cardGlowB:'#d9b56d', buttonBg:'#171717', buttonText:'#f7f3ea',
    primaryButtonBg:'#d9b56d', primaryButtonText:'#070707', footerBg:'#040404',
    heroBgA:'#d9b56d', heroBgB:'#01bf63',
    bodyFont:'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    headingFont:'Georgia, "Times New Roman", serif',
    baseFontSize:'16', heroTitleSize:'76', headingSize:'42', textLineHeight:'1.65',
    titleWeight:'800', letterSpacing:'-0.055',
    topbarHeight:'78', topbarLineSize:'1', topbarLineColor:'#2b2b2b', topbarTextSize:'13',
    footerPadding:'34', footerLineSize:'1', footerLineColor:'#2b2b2b', footerTextSize:'13',
    illustrationVisibility:'auto', leftIllustration:'', rightIllustration:'', bannerIllustration:'',
    heroEyebrow:'', heroTitle:'', heroSubtitle:'', primaryCtaText:'', primaryCtaLink:'', secondaryCtaText:'', secondaryCtaLink:''
  };
}
function ieaAllPageColourList(){
  return [
    ['__all__','Apply same design to ALL pages'],
    ['main-home','Main Website · Home'],['about','Main Website · About'],['main-everyday-english','Main Website · Everyday English'],['levels','Main Website · Levels'],['clubs','Main Website · Clubs'],['awareness-club','Main Website · Awareness Club'],['reading-club','Main Website · Reading Club'],['film-club','Main Website · Film Club'],['trainer','Main Website · Trainer'],['pricing','Main Website · Pricing'],['process','Main Website · Process'],['blog','Main Website · Blog'],['contact','Main Website · Contact / Join'],
    ['home','Games Section · Public Tasks & Games'],['login','Login Portal'],['student','Student Dashboard'],['admin','Admin Dashboard'],['editor','Editor Dashboard'],['grammar','Grammar Games'],['vocabulary','Vocabulary Games'],['pronunciation','Pronunciation Games'],['reading','Reading Games'],['listening','Listening Games'],['writing-speaking','Writing & Speaking Games'],['activity','Activity Player'],['builder','Game Builder'],['leaderboard','Leaderboard'],['profile','Student Profile'],['everyday-english','Student Everyday English Page'],['iea-clubs','Student IEA Clubs Page']
  ];
}
function ieaCurrentPageDesign(key=ieaPageColourKey()){
  let d; try{d=db();}catch(e){d={};}
  const defaults=ieaPageColourDefaults();
  return Object.assign({}, defaults, (d.pageColours&&d.pageColours[key])||{});
}
function ieaApplyPageColours(){
  const t=ieaCurrentPageDesign(ieaPageColourKey());
  const root=document.documentElement;
  const set=(k,v)=>{ if(v!==undefined && v!==null && String(v)!=='') root.style.setProperty(k,String(v)); };
  set('--green',t.primary); set('--gold',t.accent); set('--gold2',t.accent2||t.accent); set('--text',t.text); set('--muted',t.muted);
  set('--bg',t.bgStart); set('--bg2',t.bgEnd); set('--line',t.line); set('--glass',t.glass); set('--glass2',t.glass2);
  set('--mint',t.mint||t.primary); set('--pink',t.pink); set('--blue',t.blue); set('--violet',t.violet);
  set('--iea-topbar',t.topbar); set('--iea-nav-text',t.navText); set('--iea-nav-active-bg',t.navActiveBg); set('--iea-nav-active-text',t.navActiveText);
  set('--iea-card-glow-a',t.cardGlowA); set('--iea-card-glow-b',t.cardGlowB); set('--iea-button-bg',t.buttonBg); set('--iea-button-text',t.buttonText);
  set('--iea-primary-button-bg',t.primaryButtonBg); set('--iea-primary-button-text',t.primaryButtonText); set('--iea-footer-bg',t.footerBg);
  set('--iea-hero-bg-a',t.heroBgA); set('--iea-hero-bg-b',t.heroBgB);
  set('--iea-body-font',t.bodyFont); set('--iea-heading-font',t.headingFont);
  set('--iea-base-font-size',(Number(t.baseFontSize)||16)+'px'); set('--iea-hero-title-size',(Number(t.heroTitleSize)||76)+'px'); set('--iea-heading-size',(Number(t.headingSize)||42)+'px');
  set('--iea-text-line-height',Number(t.textLineHeight)||1.65); set('--iea-title-weight',Number(t.titleWeight)||800); set('--iea-letter-spacing',(Number(t.letterSpacing)||0)+'em');
  set('--iea-topbar-height',(Number(t.topbarHeight)||78)+'px'); set('--iea-topbar-line-size',(Number(t.topbarLineSize)||1)+'px'); set('--iea-topbar-line-color',t.topbarLineColor||t.line);
  set('--iea-topbar-text-size',(Number(t.topbarTextSize)||13)+'px'); set('--iea-footer-padding',(Number(t.footerPadding)||34)+'px'); set('--iea-footer-line-size',(Number(t.footerLineSize)||1)+'px'); set('--iea-footer-line-color',t.footerLineColor||t.line); set('--iea-footer-text-size',(Number(t.footerTextSize)||13)+'px');
  document.body.classList.add('iea-custom-page-colours','iea-main-colour-system');
}
function ieaColorInput(name,label,value){return `<div class="field"><label>${label}</label><input class="input iea-live-control" type="color" name="${name}" value="${esc(value||'#000000')}"></div>`}
function ieaNumberInput(name,label,value,min,max,step='1'){return `<div class="field"><label>${label}</label><input class="input iea-live-control" type="number" min="${min}" max="${max}" step="${step}" name="${name}" value="${esc(value)}"></div>`}
function ieaTextInput(name,label,value,placeholder=''){return `<div class="field"><label>${label}</label><input class="input iea-live-control" name="${name}" value="${esc(value||'')}" placeholder="${esc(placeholder)}"></div>`}
function ieaPageColourPanel(){
  const d=db(); d.pageColours=d.pageColours||{};
  const selected=d.lastPageColourKey || '__all__';
  const t=Object.assign({},ieaPageColourDefaults(), selected==='__all__'?(d.globalPageDesign||{}):(d.pageColours[selected]||{}));
  const options=ieaAllPageColourList().map(([id,label])=>`<option value="${id}" ${id===selected?'selected':''}>${label}</option>`).join('');
  return `<div class="card iea-control-card"><p class="eyebrow">All Page Controls</p><h2>Total design control for main website + games</h2><p class="lead" style="font-size:14px">Choose one page, or choose <b>Apply same design to ALL pages</b>. The preview on the right changes live while you edit.</p>
    <form class="form iea-control-layout" id="ieaAllPageColoursForm">
      <div class="iea-control-fields">
        <div class="field"><label>Select page / scope</label><select class="input iea-live-control" name="pageKey">${options}</select><small>Use the first option to apply colours and fonts across the complete main website and games website.</small></div>
        <div class="page-control-block"><h3>Complete colour system</h3><div class="grid grid-4">
          ${ieaColorInput('primary','Primary / green',t.primary)}${ieaColorInput('accent','Gold / accent',t.accent)}${ieaColorInput('accent2','Light gold',t.accent2)}${ieaColorInput('text','Main text',t.text)}
          ${ieaColorInput('muted','Muted text',t.muted)}${ieaColorInput('line','Borders / lines',t.line)}${ieaColorInput('glass','Glass/card base',t.glass)}${ieaColorInput('glass2','Glass/card strong',t.glass2)}
          ${ieaColorInput('bgStart','Background start',t.bgStart)}${ieaColorInput('bgEnd','Background end',t.bgEnd)}${ieaColorInput('topbar','Top bar background',t.topbar)}${ieaColorInput('footerBg','Footer background',t.footerBg)}
          ${ieaColorInput('navText','Navigation text',t.navText)}${ieaColorInput('navActiveBg','Active nav bg',t.navActiveBg)}${ieaColorInput('navActiveText','Active nav text',t.navActiveText)}${ieaColorInput('buttonBg','Normal button bg',t.buttonBg)}
          ${ieaColorInput('buttonText','Normal button text',t.buttonText)}${ieaColorInput('primaryButtonBg','Primary button bg',t.primaryButtonBg)}${ieaColorInput('primaryButtonText','Primary button text',t.primaryButtonText)}${ieaColorInput('cardGlowA','Card glow 1',t.cardGlowA)}
          ${ieaColorInput('cardGlowB','Card glow 2',t.cardGlowB)}${ieaColorInput('heroBgA','Hero glow 1',t.heroBgA)}${ieaColorInput('heroBgB','Hero glow 2',t.heroBgB)}${ieaColorInput('mint','Mint / illustration line',t.mint)}
          ${ieaColorInput('pink','Pink support',t.pink)}${ieaColorInput('blue','Blue support',t.blue)}${ieaColorInput('violet','Violet support',t.violet)}
        </div></div>
        <div class="page-control-block"><h3>Font, text and spacing</h3><div class="grid grid-3">
          <div class="field"><label>Body font</label><select class="input iea-live-control" name="bodyFont">${ieaFontOptions(t.bodyFont)}</select></div>
          <div class="field"><label>Heading font</label><select class="input iea-live-control" name="headingFont">${ieaFontOptions(t.headingFont)}</select></div>
          ${ieaNumberInput('baseFontSize','Base text size (px)',t.baseFontSize,12,26)}${ieaNumberInput('heroTitleSize','Main title size (px)',t.heroTitleSize,34,140)}${ieaNumberInput('headingSize','Section heading size (px)',t.headingSize,24,96)}${ieaNumberInput('textLineHeight','Line height',t.textLineHeight,1.1,2.4,'0.05')}
          <div class="field"><label>Title weight</label><select class="input iea-live-control" name="titleWeight"><option ${String(t.titleWeight)==='600'?'selected':''}>600</option><option ${String(t.titleWeight)==='700'?'selected':''}>700</option><option ${String(t.titleWeight)==='800'?'selected':''}>800</option><option ${String(t.titleWeight)==='900'?'selected':''}>900</option></select></div>
          ${ieaNumberInput('letterSpacing','Title letter spacing (em)',t.letterSpacing,-0.12,0.12,'0.005')}
        </div></div>
        <div class="page-control-block"><h3>Top bar and bottom bar</h3><div class="grid grid-4">
          ${ieaNumberInput('topbarHeight','Top bar height (px)',t.topbarHeight,54,150)}${ieaNumberInput('topbarLineSize','Top line size (px)',t.topbarLineSize,0,10)}${ieaColorInput('topbarLineColor','Top line colour',t.topbarLineColor||t.line)}${ieaNumberInput('topbarTextSize','Top text size (px)',t.topbarTextSize,10,24)}
          ${ieaNumberInput('footerPadding','Bottom bar padding (px)',t.footerPadding,10,100)}${ieaNumberInput('footerLineSize','Bottom line size (px)',t.footerLineSize,0,10)}${ieaColorInput('footerLineColor','Bottom line colour',t.footerLineColor||t.line)}${ieaNumberInput('footerTextSize','Bottom text size (px)',t.footerTextSize,10,24)}
        </div></div>
        <div class="page-control-block"><h3>Words and buttons</h3><p class="lead" style="font-size:13px">Leave empty to keep original page text.</p><div class="grid grid-2">${ieaTextInput('heroEyebrow','Small top line',t.heroEyebrow,'Premium English Learning')}${ieaTextInput('heroTitle','Main title',t.heroTitle,'Main page heading')}</div><div class="field"><label>Subtitle / paragraph</label><textarea class="iea-live-control" name="heroSubtitle" placeholder="Main page description">${esc(t.heroSubtitle||'')}</textarea></div><div class="grid grid-4">${ieaTextInput('primaryCtaText','Primary button text',t.primaryCtaText)}${ieaTextInput('primaryCtaLink','Primary button link',t.primaryCtaLink)}${ieaTextInput('secondaryCtaText','Secondary button text',t.secondaryCtaText)}${ieaTextInput('secondaryCtaLink','Secondary button link',t.secondaryCtaLink)}</div></div>
        <div class="page-control-block"><h3>Illustrations</h3><div class="field"><label>Illustration visibility</label><select class="input iea-live-control" name="illustrationVisibility"><option value="auto" ${t.illustrationVisibility==='auto'?'selected':''}>Auto</option><option value="show" ${t.illustrationVisibility==='show'?'selected':''}>Show</option><option value="hide" ${t.illustrationVisibility==='hide'?'selected':''}>Hide</option></select></div><div class="grid grid-3"><div class="field"><label>Left illustration URL</label><input class="input iea-live-control" name="leftIllustration" value="${esc(t.leftIllustration)}"><input class="input" type="file" id="ieaLeftIllustrationFile" accept="image/*"></div><div class="field"><label>Right illustration URL</label><input class="input iea-live-control" name="rightIllustration" value="${esc(t.rightIllustration)}"><input class="input" type="file" id="ieaRightIllustrationFile" accept="image/*"></div><div class="field"><label>Banner illustration URL</label><input class="input iea-live-control" name="bannerIllustration" value="${esc(t.bannerIllustration)}"><input class="input" type="file" id="ieaBannerIllustrationFile" accept="image/*"></div></div></div>
        <div class="actions"><button class="btn btn-primary" type="submit">Save Controls</button><button class="btn btn-gold" type="button" id="ieaApplyMainPalette">Use Main Website Palette</button><button class="btn" type="button" id="ieaResetPageColours">Reset Selected</button></div>
      </div>
      <aside class="iea-live-preview-wrap"><div class="iea-live-preview" id="ieaColourPreview"><div class="preview-top"><span>IEA</span><nav>Home · Courses · Games</nav></div><div class="preview-hero"><p>Premium Preview</p><h1>Every page, controlled.</h1><p class="preview-lead">Watch colours, fonts, bars and buttons change here before saving.</p><div><button>Primary CTA</button><button>Secondary</button></div></div><div class="preview-cards"><article><b>Grammar Game</b><span>Card style</span></article><article><b>Student Profile</b><span>Progress view</span></article></div><div class="preview-footer">Footer / bottom bar preview</div></div></aside>
    </form>
  </div>`;
}
function ieaPageControlValues(form){
  const out={};
  Object.keys(ieaPageColourDefaults()).forEach(k=>{if(form[k])out[k]=form[k].value;});
  return out;
}
function ieaLoadPageControlIntoForm(form,key){
  const d=db(); d.pageColours=d.pageColours||{};
  const t=Object.assign({},ieaPageColourDefaults(), key==='__all__'?(d.globalPageDesign||{}):(d.pageColours[key]||{}));
  Object.keys(ieaPageColourDefaults()).forEach(k=>{if(form[k])form[k].value=t[k]??'';});
  ieaPaintPageControlPreview(form);
}
function ieaPaintPageControlPreview(form){
  const p=$('#ieaColourPreview'); if(!p)return;
  const v=ieaPageControlValues(form);
  p.style.setProperty('--p-primary',v.primary); p.style.setProperty('--p-accent',v.accent); p.style.setProperty('--p-accent2',v.accent2||v.accent); p.style.setProperty('--p-text',v.text); p.style.setProperty('--p-muted',v.muted);
  p.style.setProperty('--p-bg-start',v.bgStart); p.style.setProperty('--p-bg-end',v.bgEnd); p.style.setProperty('--p-line',v.line); p.style.setProperty('--p-glass',v.glass); p.style.setProperty('--p-glass2',v.glass2);
  p.style.setProperty('--p-topbar',v.topbar); p.style.setProperty('--p-nav-text',v.navText); p.style.setProperty('--p-nav-active-bg',v.navActiveBg); p.style.setProperty('--p-nav-active-text',v.navActiveText);
  p.style.setProperty('--p-button-bg',v.buttonBg); p.style.setProperty('--p-button-text',v.buttonText); p.style.setProperty('--p-primary-button-bg',v.primaryButtonBg); p.style.setProperty('--p-primary-button-text',v.primaryButtonText);
  p.style.setProperty('--p-footer-bg',v.footerBg); p.style.setProperty('--p-card-glow-a',v.cardGlowA); p.style.setProperty('--p-card-glow-b',v.cardGlowB); p.style.setProperty('--p-hero-a',v.heroBgA); p.style.setProperty('--p-hero-b',v.heroBgB);
  p.style.fontFamily=v.bodyFont||'inherit'; const h=p.querySelector('h1'); if(h){h.style.fontFamily=v.headingFont||'inherit';h.style.fontSize=(Number(v.heroTitleSize)||76)*0.42+'px';h.style.fontWeight=v.titleWeight||800;h.style.letterSpacing=(Number(v.letterSpacing)||0)+'em'}
  const top=p.querySelector('.preview-top'); if(top){top.style.minHeight=(Number(v.topbarHeight)||78)*0.58+'px';top.style.borderBottomWidth=(Number(v.topbarLineSize)||1)+'px';top.style.fontSize=(Number(v.topbarTextSize)||13)+'px'}
  const foot=p.querySelector('.preview-footer'); if(foot){foot.style.padding=(Number(v.footerPadding)||34)*0.38+'px';foot.style.borderTopWidth=(Number(v.footerLineSize)||1)+'px';foot.style.fontSize=(Number(v.footerTextSize)||13)+'px'}
}
function ieaUseMainPalette(form){
  const p={primary:'#01bf63',accent:'#d9b56d',accent2:'#f3ddac',text:'#f7f3ea',muted:'#b9b0a2',bgStart:'#050505',bgEnd:'#0d0d0f',line:'#2b2b2b',glass:'#181818',glass2:'#242424',topbar:'#0a0a0a',navText:'#b9b0a2',navActiveBg:'#f7f3ea',navActiveText:'#050505',mint:'#97d6ba',pink:'#fda4fb',blue:'#8fb7ff',violet:'#c6a4ff',cardGlowA:'#01bf63',cardGlowB:'#d9b56d',buttonBg:'#171717',buttonText:'#f7f3ea',primaryButtonBg:'#d9b56d',primaryButtonText:'#070707',footerBg:'#040404',heroBgA:'#d9b56d',heroBgB:'#01bf63'};
  Object.entries(p).forEach(([k,v])=>{if(form[k])form[k].value=v}); ieaPaintPageControlPreview(form);
}
function ieaWireAllPageColours(){
  const form=$('#ieaAllPageColoursForm'); if(!form)return;
  form.pageKey.addEventListener('change',()=>ieaLoadPageControlIntoForm(form,form.pageKey.value));
  $$('.iea-live-control',form).forEach(el=>el.addEventListener('input',()=>ieaPaintPageControlPreview(form)));
  $('#ieaApplyMainPalette')?.addEventListener('click',()=>ieaUseMainPalette(form));
  form.addEventListener('submit',async e=>{
    e.preventDefault(); const d=db(); d.pageColours=d.pageColours||{}; const key=form.pageKey.value;
    const leftFile=$('#ieaLeftIllustrationFile')?.files?.[0]; const rightFile=$('#ieaRightIllustrationFile')?.files?.[0]; const bannerFile=$('#ieaBannerIllustrationFile')?.files?.[0];
    if(leftFile){const saved=await readFileAsDataURL(leftFile); form.leftIllustration.value=saved.data;} if(rightFile){const saved=await readFileAsDataURL(rightFile); form.rightIllustration.value=saved.data;} if(bannerFile){const saved=await readFileAsDataURL(bannerFile); form.bannerIllustration.value=saved.data;}
    const values=ieaPageControlValues(form);
    if(key==='__all__'){
      d.globalPageDesign=values;
      ieaAllPageColourList().filter(([id])=>id!=='__all__').forEach(([id])=>{d.pageColours[id]=Object.assign({},values)});
      toast('Design saved and applied to all main website and game pages.');
    }else{d.pageColours[key]=values; toast('Design saved for selected page.');}
    d.lastPageColourKey=key; saveDB(d); if(key==='__all__'||key===ieaPageColourKey()){ieaApplyPageColours();ieaInjectHumanIllustrations(true);ieaApplyPageText();}
  });
  $('#ieaResetPageColours')?.addEventListener('click',()=>{const d=db(); d.pageColours=d.pageColours||{}; const key=form.pageKey.value; if(key==='__all__'){d.globalPageDesign=null; ieaAllPageColourList().filter(([id])=>id!=='__all__').forEach(([id])=>delete d.pageColours[id]);} else delete d.pageColours[key]; d.lastPageColourKey=key; saveDB(d); ieaLoadPageControlIntoForm(form,key); toast(key==='__all__'?'All page designs reset.':'Selected page design reset.');});
  ieaPaintPageControlPreview(form);
}
function ieaPublicGrammarGameHTML(){
  return `<section class="section public-grammar-zone"><div class="container grid grid-2"><div class="card"><p class="eyebrow">Free visitor game</p><h2 class="display">Try a simple grammar game.</h2><p class="lead">New visitors can play this one sample game. Full games, student profile and progress tracking open only after student login.</p><div class="hero-actions"><a class="btn btn-primary" href="login.html?role=student">Login for all games</a><a class="btn" href="index.html">Back to main website</a></div></div><div class="card public-game-card" data-public-grammar-game><div class="game-head"><span data-public-progress>Question 1/5</span><b data-public-score>0 pts</b></div><h3 data-public-question></h3><div class="game-options" data-public-options></div><p class="game-feedback" data-public-feedback>Choose the correct answer.</p><button class="btn" data-public-reset type="button">Restart sample</button></div></div></section>`;
}
function wirePublicGrammarGame(){
  const box=$('[data-public-grammar-game]'); if(!box)return; let i=0,score=0;
  const qs=[{q:'She ___ to class every Monday.',o:['go','goes','going','gone'],a:1},{q:'There ___ many students in the room.',o:['is','are','am','be'],a:1},{q:'I have lived in Purulia ___ 2020.',o:['for','since','from','during'],a:1},{q:'If it rains, we ___ online.',o:['study','will study','studied','studying'],a:1},{q:'This is the ___ answer.',o:['good','better','best','well'],a:2}];
  const qEl=$('[data-public-question]',box),oEl=$('[data-public-options]',box),pEl=$('[data-public-progress]',box),sEl=$('[data-public-score]',box),fEl=$('[data-public-feedback]',box);
  function render(){const item=qs[i];pEl.textContent=`Question ${i+1}/${qs.length}`;sEl.textContent=`${score} pts`;qEl.textContent=item.q;fEl.textContent='Choose the correct answer.';oEl.innerHTML=item.o.map((o,j)=>`<button type="button" data-public-answer="${j}">${esc(o)}</button>`).join('');$$('[data-public-answer]',oEl).forEach(b=>b.onclick=()=>{const right=+b.dataset.publicAnswer===item.a;b.classList.add(right?'correct':'wrong');if(right){score+=10;fEl.textContent='Correct.'}else{fEl.textContent='Not correct. Correct answer: '+item.o[item.a];oEl.children[item.a].classList.add('correct')} $$('button',oEl).forEach(x=>x.disabled=true);sEl.textContent=`${score} pts`;setTimeout(()=>{i++; if(i>=qs.length){qEl.textContent='Sample game complete';oEl.innerHTML=`<a class="btn btn-primary" href="login.html?role=student">Login to play all games</a>`;pEl.textContent='Finished';fEl.textContent=`Final score: ${score}/${qs.length*10}`;}else render();},900)});}
  $('[data-public-reset]',box)?.addEventListener('click',()=>{i=0;score=0;render();}); render();
}
function home(){
  const root=$('#app'); if(!root)return; const cats=Object.keys(window.IEA_SEED.categories); const d=db(); const u=user();
  root.innerHTML=`<section class="hero"><div class="container hero-grid"><div class="reveal"><p class="eyebrow">IEA Tasks & Games</p><h1 class="mega">Practise first. Login for everything.</h1><p class="lead">Visitors can try one sample grammar game. IEA students login through the portal to see all assigned games, progress, profile and daily diary tasks.</p><div class="hero-actions hero-actions-big"><a class="btn btn-primary btn-xl magnetic" href="#free-grammar">Try Free Grammar Game</a><a class="btn btn-gold btn-xl magnetic" href="login.html?role=student">Student Login</a><a class="btn btn-xl magnetic" href="login.html?role=admin">Admin / Editor</a></div><div class="trust"><span class="pill">Main website design</span><span class="pill">Login protected games</span><span class="pill">Profile progress</span><span class="pill">Admin/editor control</span></div></div><div class="stage reveal">${illustration()}<div class="float-card one"><strong>${d.activities.length}</strong><span>games ready</span></div><div class="float-card two"><strong>${d.users.filter(u=>u.role==='student').length}</strong><span>student profiles</span></div><div class="float-card three"><strong>1</strong><span>free sample</span></div></div></div></section><div id="free-grammar">${ieaPublicGrammarGameHTML()}</div>${portalRoleCards()}<section class="section"><div class="container"><div class="section-head"><div><p class="eyebrow">Locked Skill Worlds</p><h2 class="display">Full game library opens after login.</h2></div><p class="lead">Students see only the games assigned to their group, level or profile. Admin/editor controls visibility.</p></div><div class="grid grid-3">${cats.map(c=>`<a class="card category-card reveal magnetic" href="${u?c+'.html':'login.html?role=student'}"><div><div class="category-icon">${catEmoji(c)}</div><h3>${catTitle(c)}</h3><p>${catDesc(c)}</p></div><span class="badge">${u?'Open':'Login required'}</span></a>`).join('')}</div></div></section>`;
  setTimeout(()=>{initUI();wirePublicGrammarGame();},0);
}
function categoryPage(category){
  const root=$('#app'); if(!root)return; const u=user(); const temps=templatesFor(category); if(!u){root.innerHTML=`<section class="hero"><div class="container hero-grid"><div><p class="eyebrow">${catTitle(category)} Games</p><h1 class="mega">Login required.</h1><p class="lead">This full game section is available only for logged-in students, editors and admins. Visitors can play the free grammar sample on the Tasks & Games page.</p><div class="hero-actions"><a class="btn btn-primary" href="login.html?role=student">Student Login</a><a class="btn" href="tasks-games.html#free-grammar">Try Free Sample</a></div></div><div class="stage">${illustration(category)}</div></div></section>`;return}
  const acts=visibleActivitiesFor(u,category); const all=activitiesFor(category);
  root.innerHTML=`<section class="hero"><div class="container hero-grid"><div class="reveal"><p class="eyebrow">${catTitle(category)} Games</p><h1 class="mega">${catTitle(category)}</h1><p class="lead">${catDesc(category)}</p><div class="hero-actions"><a class="btn btn-primary" href="${u.role==='student'?'student.html':u.role==='editor'?'editor.html':'admin.html'}">Open My Panel</a>${isTeacher()?`<a class="btn" href="builder.html?category=${category}">Create Game</a>`:''}</div></div><div class="stage reveal">${illustration(category)}<div class="float-card one"><strong>${temps.length}</strong><span>coded templates</span></div><div class="float-card two"><strong>${acts.length}</strong><span>${isTeacher()?'visible / '+all.length+' total':'available games'}</span></div></div></div></section><section class="section"><div class="container"><div class="section-head"><div><p class="eyebrow">Playable Activities</p><h2 class="display">${isTeacher()?'All created activities':'Activities available to you'}</h2></div><p class="lead">Admin/editor can decide which games appear for each group, level or individual student.</p></div><div class="grid grid-3">${acts.map(a=>activityCard(a)).join('')||'<div class="empty">No activities are currently assigned in this skill.</div>'}</div></div></section><section class="section"><div class="container"><div class="section-head"><div><p class="eyebrow">Reusable Templates</p><h2 class="display">Teachers can build from these formats.</h2></div><p class="lead">Templates are visible here after login. Students play assigned games; admin/editor create new tasks.</p></div><div class="grid grid-4">${temps.map(t=>`<article class="card template-card reveal"><small>${t.engine} engine</small><h3>${t.name}</h3><p>Dynamic content loading, scoring, hints, explanations and media attachments are supported.</p><div class="actions">${isTeacher()?`<a class="btn btn-gold" href="builder.html?category=${category}&template=${t.id}">Build</a>`:'<span class="tag">Teacher template</span>'}</div></article>`).join('')}</div></div></section>`; setTimeout(initUI,0);
}
const __ieaOriginalRenderActivityProtected = renderActivity;
renderActivity = function(){
  if(!user()){const root=$('#app'); root.innerHTML=`<section class="hero"><div class="container hero-grid"><div><p class="eyebrow">Login protected game</p><h1 class="mega">Please login to play full games.</h1><p class="lead">Only the sample grammar game is public. Student progress, assigned games and profile records are available after login.</p><div class="hero-actions"><a class="btn btn-primary" href="login.html?role=student">Student Login</a><a class="btn" href="tasks-games.html#free-grammar">Try Free Sample</a></div></div><div class="stage">${illustration('grammar')}</div></div></section>`;return}
  return __ieaOriginalRenderActivityProtected();
};

const __ieaAllColoursOriginalAdminPage = adminPage;
adminPage = function(role='admin'){
  __ieaAllColoursOriginalAdminPage(role);
  ieaInjectAllPageColoursPanel(role);
};


function ieaApplyPageText(){
  const t=ieaCurrentPageDesign(ieaPageColourKey());
  const setText=(sel,val)=>{ if(!val)return; const el=$(sel); if(el) el.textContent=val; };
  setText('.hero .eyebrow, .page-hero .eyebrow', t.heroEyebrow);
  setText('.hero .mega, .hero .mega-title, .page-hero .mega, .page-hero .mega-title, .hero .display, .page-hero .display', t.heroTitle);
  setText('.hero .lead, .hero .hero-sub, .page-hero .lead, .page-hero .hero-sub', t.heroSubtitle);
  const buttons=$$('.hero .hero-actions a, .page-hero .hero-actions a');
  if(buttons[0]){ if(t.primaryCtaText)buttons[0].textContent=t.primaryCtaText; if(t.primaryCtaLink)buttons[0].setAttribute('href',t.primaryCtaLink); }
  if(buttons[1]){ if(t.secondaryCtaText)buttons[1].textContent=t.secondaryCtaText; if(t.secondaryCtaLink)buttons[1].setAttribute('href',t.secondaryCtaLink); }
}

async function route(){
  if(window.IEA_Sheets&&window.IEA_Sheets.bootstrapFromSheets){await window.IEA_Sheets.bootstrapFromSheets(DB_KEY, window.IEA_SEED);}
  initUI();
  ieaApplyPageColours();
  const page=document.body.dataset.page;
  if(page==='home')home();
  else if(page==='login')login();
  else if(page==='student')studentDashboard();
  else if(page==='admin')adminPage('admin');
  else if(page==='editor')adminPage('editor');
  else if(page==='profile')profile();
  else if(page==='leaderboard')leaderboard();
  else if(page==='builder')builder();
  else if(page==='activity')renderActivity();
  else if(page==='everyday-english')everydayEnglishPage();
  else if(page==='iea-clubs')ieaClubsPage();
  else if(window.IEA_SEED.categories[page])categoryPage(page);
  ieaApplyPageColours();
  ieaInjectHumanIllustrations();
  ieaApplyPageText();
  setTimeout(()=>{ieaApplyPageColours();ieaInjectHumanIllustrations();ieaApplyPageText();},60);
  document.addEventListener('click',e=>{const dup=e.target.closest('[data-duplicate]'); if(dup)duplicateActivity(dup.dataset.duplicate)});
}
document.addEventListener('DOMContentLoaded',route);
})();

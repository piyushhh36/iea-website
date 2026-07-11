/* ============================================================
   IEA Google Sheets Trial Database Connector
   Connected Apps Script Web App URL:
   https://script.google.com/macros/s/AKfycbxeQhbISx0sG6cr7Upr0hUSe_RtNHoimX1mBF6qn69nmQhgQDhKvuL66Fquw51AEX1CNw/exec

   Trial system:
   - Google Sheets stores text/data/questions/controls.
   - Cloudinary/Google Drive URLs are stored in MediaLibrary.
   - This file keeps the existing LocalStorage prototype working,
     then syncs it with Google Sheets through Apps Script.
   ============================================================ */
(function(){
  const API_URL = "https://script.google.com/macros/s/AKfycbxeQhbISx0sG6cr7Upr0hUSe_RtNHoimX1mBF6qn69nmQhgQDhKvuL66Fquw51AEX1CNw/exec";
  const SECRET_TOKEN = "iea-trial-secret-123";
  const DB_KEY_DEFAULT = "iea_html_game_section_db_v4_role_panels";
  const SYNC_FLAG = "__iea_sheets_bootstrap_done_v1";
  const SYNC_TIME = "__iea_sheets_last_sync";
  let bootPromise = null;
  let saveTimer = null;

  function clean(v){ return String(v == null ? "" : v).trim(); }
  function lower(v){ return clean(v).toLowerCase(); }
  function yes(v){ return ["yes","true","1","active","visible","published"].includes(lower(v)); }
  function list(v){
    return clean(v).split(/[,;]+/).map(x=>x.trim()).filter(Boolean);
  }
  function num(v, fallback=0){
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  }
  function safeId(prefix){
    return prefix + "-" + Date.now() + "-" + Math.random().toString(16).slice(2);
  }
  function parseJSONMaybe(v, fallback){
    try { return JSON.parse(v); } catch(e) { return fallback; }
  }
  function getLocalDB(dbKey, seed){
    try {
      const raw = localStorage.getItem(dbKey || DB_KEY_DEFAULT);
      if(raw) return JSON.parse(raw);
    } catch(e){}
    return JSON.parse(JSON.stringify(seed || window.IEA_SEED || {}));
  }
  function setLocalDB(dbKey, data){
    try { localStorage.setItem(dbKey || DB_KEY_DEFAULT, JSON.stringify(data)); } catch(e){}
  }
  async function get(action, params={}){
    const qs = new URLSearchParams(Object.assign({ action }, params));
    const res = await fetch(API_URL + "?" + qs.toString(), { method: "GET", cache: "no-store" });
    return await res.json();
  }
  async function post(payload){
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(Object.assign({ token: SECRET_TOKEN }, payload || {}))
    });
    return await res.json();
  }
  async function readSheet(sheet){
    const out = await get("read", { sheet });
    return (out && out.success && Array.isArray(out.data)) ? out.data : [];
  }
  async function readAllSheets(){
    const names = [
      "Groups","Users","StudentProfiles","Categories","Templates",
      "Games","GameQuestions","Assignments","GameAttempts",
      "DailyDiary","DiaryCompletions","CourseMaterials","ImportantDates",
      "LanguageBank","MediaLibrary","PageControls","Pages","ContentBlocks","Notices"
    ];
    const result = {};
    await Promise.all(names.map(async name=>{
      try { result[name] = await readSheet(name); }
      catch(e){ result[name] = []; console.warn("IEA Sheet read failed:", name, e); }
    }));
    return result;
  }
  function mergeById(existing, incoming, idKey){
    const map = new Map();
    (existing || []).forEach(item => {
      const id = clean(item && item[idKey]);
      if(id) map.set(id, item);
    });
    (incoming || []).forEach(item => {
      const id = clean(item && item[idKey]);
      if(id) map.set(id, Object.assign({}, map.get(id) || {}, item));
    });
    return Array.from(map.values());
  }
  function sheetRowsToLocalDB(sheets, baseDB){
    const d = Object.assign({}, baseDB || {});
    d.activities = Array.isArray(d.activities) ? d.activities : [];
    d.users = Array.isArray(d.users) ? d.users : [];
    d.attempts = Array.isArray(d.attempts) ? d.attempts : [];
    d.assignments = Array.isArray(d.assignments) ? d.assignments : [];
    d.media = Array.isArray(d.media) ? d.media : [];
    d.groups = Array.isArray(d.groups) ? d.groups : [];
    d.pageColours = d.pageColours && typeof d.pageColours === "object" ? d.pageColours : {};

    const groupRows = sheets.Groups || [];
    if(groupRows.length){
      d.groups = mergeById(d.groups, groupRows.map(g=>({
        id: clean(g.groupId) || clean(g.id) || safeId("grp"),
        name: clean(g.groupName) || clean(g.name) || "IEA Group",
        level: clean(g.level) || "Mixed",
        description: clean(g.notes) || clean(g.moduleName) || ""
      })), "id");
    }

    const userRows = sheets.Users || [];
    if(userRows.length){
      const users = userRows.map(u=>({
        id: clean(u.userId) || clean(u.id) || safeId("u"),
        name: clean(u.name) || clean(u.full_name) || "IEA User",
        email: clean(u.email).toLowerCase(),
        password: clean(u.password) || "student123",
        role: lower(u.role) || "student",
        groupIds: list(u.groupId || u.groupIds),
        level: clean(u.level) || "",
        avatar: clean(u.avatar) || clean(u.name).charAt(0).toUpperCase() || "U",
        xp: num(u.xp,0),
        streak: num(u.streak,0),
        badges: list(u.badges),
        status: clean(u.status) || "active",
        profilePhoto: clean(u.photoUrl) || clean(u.profilePhoto) || "",
        profileCaption: clean(u.caption) || ""
      })).filter(u=>u.email || u.id);
      d.users = mergeById(d.users, users, "id");
    }

    const profileRows = sheets.StudentProfiles || [];
    profileRows.forEach(p=>{
      const id = clean(p.studentId) || clean(p.userId) || "";
      let u = d.users.find(x=>clean(x.id)===id) || d.users.find(x=>lower(x.email)===lower(p.email));
      if(!u && (id || p.email)){
        u = { id: id || safeId("stu"), role:"student", name: clean(p.name)||"Student", email: clean(p.email), password:"student123" };
        d.users.push(u);
      }
      if(u){
        u.name = clean(p.name) || u.name;
        u.email = clean(p.email) || u.email;
        u.role = "student";
        u.groupIds = list(p.groupId || p.groupIds).length ? list(p.groupId || p.groupIds) : (u.groupIds || []);
        u.level = clean(p.level) || u.level || "";
        u.profilePhoto = clean(p.photoUrl) || u.profilePhoto || "";
        u.profileCaption = clean(p.caption) || u.profileCaption || "";
        u.xp = num(p.xp, u.xp || 0);
        u.streak = num(p.streak, u.streak || 0);
        u.badges = list(p.badges).length ? list(p.badges) : (u.badges || []);
      }
    });

    const qRows = sheets.GameQuestions || [];
    const questionsByGame = {};
    qRows.forEach(q=>{
      const gid = clean(q.gameId);
      if(!gid) return;
      questionsByGame[gid] = questionsByGame[gid] || [];
      const options = list(q.options);
      questionsByGame[gid].push({
        orderNo: num(q.orderNo, questionsByGame[gid].length + 1),
        prompt: clean(q.question),
        question: clean(q.question),
        answer: clean(q.correctAnswer),
        correctAnswer: clean(q.correctAnswer),
        options,
        hint: clean(q.hint),
        explanation: clean(q.explanation),
        left: clean(q.leftItem),
        right: clean(q.rightItem),
        example: clean(q.exampleOrExtra)
      });
    });
    Object.keys(questionsByGame).forEach(gid=>{
      questionsByGame[gid].sort((a,b)=>num(a.orderNo,0)-num(b.orderNo,0));
    });

    const gameRows = sheets.Games || [];
    if(gameRows.length){
      const activities = gameRows.map(g=>{
        const id = clean(g.gameId) || clean(g.id) || safeId("game");
        const engine = lower(g.engine || g.gameType || g.template) || "objective";
        const groupIds = list(g.groupId || g.groupIds);
        const levels = list(g.level);
        const qs = questionsByGame[id] || [];
        const a = {
          id,
          category: clean(g.categoryId) || clean(g.category) || "grammar",
          template: clean(g.template) || clean(g.title) || "IEA Game",
          engine,
          title: clean(g.title) || "IEA Game",
          level: clean(g.level) || "",
          difficulty: clean(g.difficulty) || "Medium",
          xp: num(g.xp,100),
          timeLimit: num(g.timeLimitSeconds || g.timeLimit,0),
          instructions: clean(g.instructions) || "Complete the task.",
          status: yes(g.isVisible) || yes(g.status) ? "published" : "draft",
          visibility: groupIds.length ? { mode:"groups", groupIds, userIds:[], levels:[] } :
                      levels.length ? { mode:"levels", groupIds:[], userIds:[], levels } :
                      { mode:"all", groupIds:[], userIds:[], levels:[] },
          isPublicDemo: yes(g.isPublicDemo),
          deadline: clean(g.deadline),
          updatedAt: new Date().toISOString()
        };
        if(engine === "matching"){
          a.pairs = qs.map(q=>({ left:q.left || q.prompt, right:q.right || q.answer })).filter(p=>p.left || p.right);
        } else if(engine === "flashcards"){
          a.vocab = qs.map(q=>({ word:q.prompt, meaning:q.answer, example:q.example })).filter(v=>v.word || v.meaning);
        } else if(engine === "fill"){
          a.questions = qs.map(q=>({ prompt:q.prompt, answer:q.answer, hint:q.hint, explanation:q.explanation })).filter(q=>q.prompt);
        } else if(engine === "writing" || engine === "speaking" || engine === "recording"){
          a.prompt = qs[0]?.prompt || clean(g.instructions) || a.title;
          a.rubric = qs.map(q=>q.answer).filter(Boolean);
        } else {
          a.questions = qs.map(q=>({ prompt:q.prompt, options:q.options, answer:q.answer, hint:q.hint, explanation:q.explanation })).filter(q=>q.prompt);
        }
        return a;
      });
      d.activities = mergeById(d.activities, activities, "id");
    }

    const assignmentRows = sheets.Assignments || [];
    if(assignmentRows.length){
      d.assignments = mergeById(d.assignments, assignmentRows.map(a=>({
        id: clean(a.assignmentId) || safeId("assn"),
        activityId: clean(a.activityId),
        assignedTo: clean(a.assignedTo) || "all",
        groupIds: list(a.groupIds),
        userIds: list(a.userIds),
        levels: list(a.levels),
        due: clean(a.dueDate),
        note: clean(a.note),
        status: clean(a.status) || "active"
      })), "id");
    }

    const attemptRows = sheets.GameAttempts || [];
    if(attemptRows.length){
      d.attempts = mergeById(d.attempts, attemptRows.map(a=>({
        id: clean(a.attemptId) || safeId("attempt"),
        userId: clean(a.studentId) || clean(a.userId),
        activityId: clean(a.gameId) || clean(a.activityId),
        category: clean(a.categoryId),
        title: clean(a.title),
        score: num(a.score,0),
        possible: num(a.possible,100),
        xp: num(a.xp,0),
        date: clean(a.date) || clean(a.completedAt) || new Date().toISOString().slice(0,10),
        status: clean(a.status) || "completed"
      })), "id");
    }

    const mediaRows = sheets.MediaLibrary || [];
    if(mediaRows.length){
      d.media = mergeById(d.media, mediaRows.map(m=>{
        const url = clean(m.finalUrl) || clean(m.cloudinaryUrl) || clean(m.driveUrl) || clean(m.localPath);
        return {
          id: clean(m.mediaId) || safeId("media"),
          name: clean(m.title) || "IEA Media",
          type: clean(m.type) || "file",
          data: url,
          url,
          pageId: clean(m.pageId),
          section: clean(m.section),
          uploadTarget: clean(m.uploadTarget),
          uploadedAt: new Date().toISOString().slice(0,10)
        };
      }).filter(m=>m.data), "id");
    }

    const pageControls = sheets.PageControls || [];
    pageControls.forEach(row=>{
      const pageKey = clean(row.pageId) || clean(row.controlId) || "home";
      const design = {
        primary: clean(row.greenColor) || clean(row.primaryColor) || clean(row.primary) || clean(row.goldColor),
        accent: clean(row.goldColor) || clean(row.accentColor) || clean(row.accent) || clean(row.gold2Color),
        text: clean(row.textColor),
        muted: clean(row.mutedTextColor),
        bgStart: clean(row.bgStart),
        bgEnd: clean(row.bgEnd),
        line: clean(row.lineColor),
        glass: clean(row.glassColor),
        glass2: clean(row.glassStrongColor),
        topbar: clean(row.navBg),
        navText: clean(row.navText),
        navActiveBg: clean(row.navActiveBg),
        navActiveText: clean(row.navActiveText),
        buttonBg: clean(row.buttonBg),
        buttonText: clean(row.buttonText),
        primaryButtonBg: clean(row.primaryButtonBg),
        primaryButtonText: clean(row.primaryButtonText),
        footerBg: clean(row.footerBg),
        heroBgA: clean(row.heroGlowA),
        heroBgB: clean(row.heroGlowB),
        cardGlowA: clean(row.cardGlowA),
        cardGlowB: clean(row.cardGlowB),
        bodyFont: clean(row.bodyFont),
        headingFont: clean(row.headingFont),
        baseFontSize: clean(row.baseFontSize),
        heroTitleSize: clean(row.heroTitleSize),
        headingSize: clean(row.headingSize),
        topbarHeight: clean(row.topbarHeight),
        topbarLineSize: clean(row.topbarLineSize),
        topbarLineColor: clean(row.topbarLineColor),
        topbarTextSize: clean(row.topbarTextSize),
        footerPadding: clean(row.footerPadding),
        footerLineSize: clean(row.footerLineSize),
        footerLineColor: clean(row.footerLineColor),
        footerTextSize: clean(row.footerTextSize),
        leftIllustration: clean(row.illustrationLeftUrl),
        rightIllustration: clean(row.illustrationRightUrl),
        bannerIllustration: clean(row.bannerUrl),
        logoUrl: clean(row.logoUrl),
        heroEyebrow: clean(row.notes),
        status: clean(row.status)
      };
      Object.keys(design).forEach(k=>{ if(design[k] === "") delete design[k]; });
      if(pageKey === "all" || yes(row.applyToAll)){
        d.globalPageDesign = Object.assign({}, d.globalPageDesign || {}, design);
        const pageIds = ["home","main-home","tasks-games","student","admin","editor","login","grammar","vocabulary","pronunciation","reading","listening","writing-speaking","activity","builder","everyday-english","iea-clubs","about","levels","clubs","trainer","pricing","process","blog","contact"];
        pageIds.forEach(id=>d.pageColours[id] = Object.assign({}, d.pageColours[id] || {}, design));
      } else {
        d.pageColours[pageKey] = Object.assign({}, d.pageColours[pageKey] || {}, design);
      }
    });

    const everydayRows = {
      materials: sheets.CourseMaterials || [],
      dates: sheets.ImportantDates || [],
      language: sheets.LanguageBank || [],
      diary: sheets.DailyDiary || []
    };
    if(everydayRows.materials.length || everydayRows.dates.length || everydayRows.language.length || everydayRows.diary.length){
      d.everydayEnglishModule = d.everydayEnglishModule || {};
      const m = d.everydayEnglishModule;
      if(everydayRows.materials.length){
        m.materials = everydayRows.materials.map(x=>({
          id: clean(x.materialId) || safeId("mat"),
          groupId: clean(x.groupId),
          title: clean(x.title),
          description: clean(x.description),
          date: clean(x.classDate),
          url: clean(x.cloudinaryUrl) || clean(x.driveUrl),
          cloudinaryUrl: clean(x.cloudinaryUrl),
          driveUrl: clean(x.driveUrl),
          status: clean(x.status) || "active"
        }));
      }
      if(everydayRows.dates.length){
        m.importantDates = everydayRows.dates.map(x=>({
          id: clean(x.dateId) || safeId("date"),
          groupId: clean(x.groupId),
          title: clean(x.title),
          date: clean(x.dateValue),
          note: clean(x.note),
          status: clean(x.status) || "active"
        }));
      }
      if(everydayRows.language.length){
        m.languageBank = { grammar:[], vocabulary:[], pronunciation:[] };
        everydayRows.language.forEach(x=>{
          const cat = lower(x.category);
          const item = { id: clean(x.itemId) || safeId("lang"), groupId: clean(x.groupId), title: clean(x.title), details: clean(x.details), status: clean(x.status)||"active" };
          if(m.languageBank[cat]) m.languageBank[cat].push(item);
        });
      }
      if(everydayRows.diary.length){
        m.dailyDiary = everydayRows.diary.map(x=>({
          id: clean(x.taskId) || safeId("diary"),
          title: clean(x.title),
          instructions: clean(x.instructions),
          groupId: clean(x.groupId),
          deadline: clean(x.deadline),
          linkedGameId: clean(x.linkedGameId),
          assignedTo: clean(x.assignedTo),
          studentIds: list(x.studentIds),
          levels: list(x.levels),
          status: clean(x.status) || "active"
        }));
      }
    }

    localStorage.setItem(SYNC_TIME, new Date().toISOString());
    return d;
  }

  async function bootstrapFromSheets(dbKey=DB_KEY_DEFAULT, seed=window.IEA_SEED){
    if(bootPromise) return bootPromise;
    bootPromise = (async()=>{
      try{
        const sheets = await readAllSheets();
        const base = getLocalDB(dbKey, seed);
        const merged = sheetRowsToLocalDB(sheets, base);
        setLocalDB(dbKey, merged);
        window.IEA_SHEETS_CONNECTED = true;
        return { success:true, db: merged };
      }catch(err){
        console.warn("IEA Google Sheets bootstrap failed. Website will use local demo data.", err);
        window.IEA_SHEETS_CONNECTED = false;
        return { success:false, error: err };
      }
    })();
    return bootPromise;
  }

  function activityRowsFromDB(d){
    const games = [];
    const questions = [];
    (d.activities || []).forEach(a=>{
      games.push({
        gameId: a.id,
        title: a.title || "",
        categoryId: a.category || "",
        template: a.template || "",
        engine: a.engine || "",
        groupId: ((a.visibility||{}).groupIds || []).join(","),
        level: a.level || (((a.visibility||{}).levels || []).join(",")),
        difficulty: a.difficulty || "",
        xp: a.xp || "",
        timeLimitSeconds: a.timeLimit || "",
        isPublicDemo: a.isPublicDemo ? "yes" : "no",
        isVisible: a.status === "draft" ? "no" : "yes",
        deadline: a.deadline || "",
        instructions: a.instructions || "",
        status: a.status || "published"
      });
      const qs = a.questions || [];
      qs.forEach((q,i)=>questions.push({
        questionId: `${a.id}-q${i+1}`,
        gameId: a.id,
        orderNo: i+1,
        questionType: a.engine || "objective",
        question: q.prompt || q.question || "",
        correctAnswer: q.answer || q.correctAnswer || "",
        options: (q.options || []).join(", "),
        hint: q.hint || "",
        explanation: q.explanation || "",
        leftItem: "",
        rightItem: "",
        exampleOrExtra: q.example || ""
      }));
      (a.pairs || []).forEach((q,i)=>questions.push({
        questionId: `${a.id}-m${i+1}`,
        gameId: a.id,
        orderNo: i+1,
        questionType: "matching",
        question: q.left || "",
        correctAnswer: q.right || "",
        options: "",
        hint: "",
        explanation: "",
        leftItem: q.left || "",
        rightItem: q.right || "",
        exampleOrExtra: ""
      }));
      (a.vocab || []).forEach((q,i)=>questions.push({
        questionId: `${a.id}-f${i+1}`,
        gameId: a.id,
        orderNo: i+1,
        questionType: "flashcards",
        question: q.word || "",
        correctAnswer: q.meaning || "",
        options: "",
        hint: "",
        explanation: "",
        leftItem: "",
        rightItem: "",
        exampleOrExtra: q.example || ""
      }));
    });
    return { games, questions };
  }

  async function saveLocalDBNow(d){
    try{
      if(!d || typeof d !== "object") return { success:false, message:"No database supplied" };

      const userRows = (d.users || []).map(u=>({
        userId: u.id,
        name: u.name || "",
        email: u.email || "",
        password: u.password || "",
        role: u.role || "student",
        groupId: (u.groupIds || []).join(","),
        level: u.level || "",
        avatar: u.avatar || "",
        xp: u.xp || "",
        streak: u.streak || "",
        badges: (u.badges || []).join(","),
        status: u.status || "active",
        photoUrl: u.profilePhoto || u.photoUrl || "",
        caption: u.profileCaption || u.caption || ""
      }));

      const profileRows = (d.users || []).filter(u=>u.role === "student").map(u=>({
        studentId: u.id,
        name: u.name || "",
        email: u.email || "",
        groupId: (u.groupIds || []).join(","),
        level: u.level || "",
        photoUrl: u.profilePhoto || "",
        caption: u.profileCaption || "",
        xp: u.xp || "",
        streak: u.streak || "",
        badges: (u.badges || []).join(","),
        dailyDiaryPercent: u.dailyDiaryPercent || "",
        gameCompletionPercent: u.gameCompletionPercent || "",
        notes: ""
      }));

      const groupRows = (d.groups || []).map(g=>({
        groupId: g.id,
        groupName: g.name || "",
        level: g.level || "",
        moduleName: g.moduleName || "",
        notes: g.description || g.notes || ""
      }));

      const { games, questions } = activityRowsFromDB(d);

      const attemptRows = (d.attempts || []).map((a,i)=>({
        attemptId: a.id || `attempt-${i+1}-${a.userId || ""}-${a.activityId || ""}`,
        studentId: a.userId || a.studentId || "",
        gameId: a.activityId || a.gameId || "",
        categoryId: a.category || "",
        title: a.title || "",
        score: a.score || "",
        possible: a.possible || "",
        xp: a.xp || "",
        date: a.date || "",
        status: a.status || "completed"
      }));

      const mediaRows = (d.media || []).map(m=>({
        mediaId: m.id,
        title: m.name || m.title || "",
        type: m.type || "",
        localPath: m.data && String(m.data).startsWith("data:") ? "local-browser-data" : "",
        finalUrl: m.url || m.data || "",
        pageId: m.pageId || "",
        section: m.section || "",
        uploadTarget: m.uploadTarget || "",
        cloudinaryUrl: m.cloudinaryUrl || "",
        driveUrl: m.driveUrl || "",
        status: m.status || "active",
        notes: ""
      }));

      const pageRows = Object.entries(d.pageColours || {}).map(([key,t])=>({
        controlId: key,
        pageId: key,
        groupId: t.groupId || "all",
        applyToAll: key === "__all__" ? "yes" : "no",
        bgStart: t.bgStart || "",
        bgEnd: t.bgEnd || "",
        textColor: t.text || "",
        mutedTextColor: t.muted || "",
        lineColor: t.line || "",
        glassColor: t.glass || "",
        glassStrongColor: t.glass2 || "",
        goldColor: t.accent || "",
        gold2Color: t.accent2 || t.accent || "",
        greenColor: t.primary || "",
        mintColor: t.mint || t.primary || "",
        pinkColor: t.pink || "",
        blueColor: t.blue || "",
        violetColor: t.violet || "",
        buttonBg: t.buttonBg || "",
        buttonText: t.buttonText || "",
        primaryButtonBg: t.primaryButtonBg || "",
        primaryButtonText: t.primaryButtonText || "",
        navBg: t.topbar || "",
        navText: t.navText || "",
        navActiveBg: t.navActiveBg || "",
        navActiveText: t.navActiveText || "",
        footerBg: t.footerBg || "",
        heroGlowA: t.heroBgA || "",
        heroGlowB: t.heroBgB || "",
        cardGlowA: t.cardGlowA || "",
        cardGlowB: t.cardGlowB || "",
        bodyFont: t.bodyFont || "",
        headingFont: t.headingFont || "",
        baseFontSize: t.baseFontSize || "",
        heroTitleSize: t.heroTitleSize || "",
        headingSize: t.headingSize || "",
        topbarHeight: t.topbarHeight || "",
        topbarLineSize: t.topbarLineSize || "",
        topbarLineColor: t.topbarLineColor || "",
        topbarTextSize: t.topbarTextSize || "",
        footerPadding: t.footerPadding || "",
        footerLineSize: t.footerLineSize || "",
        footerLineColor: t.footerLineColor || "",
        footerTextSize: t.footerTextSize || "",
        illustrationLeftUrl: t.leftIllustration || "",
        illustrationRightUrl: t.rightIllustration || "",
        bannerUrl: t.bannerIllustration || "",
        logoUrl: t.logoUrl || "",
        notes: t.heroEyebrow || "",
        status: "active"
      }));

      const ops = [];
      function upsertMany(sheet, idColumn, rows){
        rows.forEach(row=>{
          const idValue = row[idColumn];
          if(idValue) ops.push(post({ action:"upsertById", sheet, idColumn, idValue, row }));
        });
      }
      upsertMany("Users","userId", userRows);
      upsertMany("StudentProfiles","studentId", profileRows);
      upsertMany("Groups","groupId", groupRows);
      upsertMany("Games","gameId", games);
      upsertMany("GameQuestions","questionId", questions);
      upsertMany("GameAttempts","attemptId", attemptRows);
      upsertMany("MediaLibrary","mediaId", mediaRows);
      upsertMany("PageControls","controlId", pageRows);

      const results = await Promise.allSettled(ops);
      const rejected = results.filter(r=>r.status === "rejected").length;
      localStorage.setItem(SYNC_TIME, new Date().toISOString());
      return { success: rejected === 0, saved: results.length, rejected };
    }catch(err){
      console.warn("IEA Google Sheets save failed:", err);
      return { success:false, message: err.message };
    }
  }

  function scheduleSync(d){
    clearTimeout(saveTimer);
    saveTimer = setTimeout(()=>saveLocalDBNow(d), 900);
  }

  window.IEA_Sheets = {
    apiUrl: API_URL,
    token: SECRET_TOKEN,
    ping: ()=>get("ping"),
    readSheet,
    readBy: (sheet,column,value)=>get("readBy", { sheet, column, value }),
    addRow: (sheet,row)=>post({ action:"add", sheet, row }),
    updateById: (sheet,idColumn,idValue,updates)=>post({ action:"updateById", sheet, idColumn, idValue, updates }),
    deleteById: (sheet,idColumn,idValue)=>post({ action:"deleteById", sheet, idColumn, idValue }),
    upsertById: (sheet,idColumn,idValue,row)=>post({ action:"upsertById", sheet, idColumn, idValue, row }),
    login: (email,password,role)=>post({ action:"login", email, password, role }),
    bootstrapFromSheets,
    saveLocalDBNow,
    scheduleSync
  };
})();

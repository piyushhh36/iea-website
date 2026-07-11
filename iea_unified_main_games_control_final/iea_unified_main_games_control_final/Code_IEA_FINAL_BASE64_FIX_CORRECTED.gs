const SHEET_ID = '10jk9CVwYaL0oOhnlnvNWA-JJmcFo3MFlTlsnTt-U-GI';
const GALLERY_FOLDER_ID = '1wlRC-etfq_h4BqriSg9a-UNRtetPQDu2';

const SHEETS = {
  users: ['id','date','role','name','email','phone','passwordHash','level','course','feeStatus','credits','status'],
  enquiries: ['date','name','phone','email','interest','message','sourcePage','status'],
  materials: ['date','title','course','type','url','audience','status'],
  announcements: ['date','title','body','audience','status'],
  events: ['date','title','time','mode','club','credits','description','status'],
  payments: ['date','name','email','amount','mode','creditsAdded','receiptNo','status'],
  attendance: ['date','email','eventTitle','courseOrClub','status'],
  gallery: ['date','title','category','type','fileUrl','previewUrl','fileId','status']
};

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents || '{}');
    var action = body.action;
    var result;

    if (action === 'login') result = loginUser(body);
    else if (action === 'contact') result = saveEnquiry(body);
    else if (action === 'studentSummary') result = getStudentSummary(body);
    else if (action === 'materials') result = getMaterials(body);
    else if (action === 'announcements') result = getAnnouncements(body);
    else if (action === 'events') result = getEvents(body);
    else if (action === 'adminData') result = getAdminData(body);
    else if (action === 'addStudent') result = addStudent(body);
    else if (action === 'addMaterial') result = addMaterial(body);
    else if (action === 'addAnnouncement') result = addAnnouncement(body);
    else if (action === 'addEvent') result = addEvent(body);
    else if (action === 'addPayment') result = addPayment(body);
    else if (action === 'uploadGallery') result = uploadGallery(body);
    else if (action === 'getGallery') result = getGallery(body);
    else result = { success:false, message:'Unknown action' };

    return sendJSON(result);
  } catch (error) {
    return sendJSON({ success:false, message:error.message });
  }
}

function doGet(e) {
  return sendJSON({ success:true, message:'IEA API is running' });
}

function setupIEA() {
  var ss = SpreadsheetApp.openById(SHEET_ID);

  for (var sheetName in SHEETS) {
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) sheet = ss.insertSheet(sheetName);

    var headers = SHEETS[sheetName];

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(headers);
    } else {
      var lastCol = Math.max(sheet.getLastColumn(), 1);
      var existing = sheet.getRange(1, 1, 1, lastCol).getValues()[0];

      for (var i = 0; i < headers.length; i++) {
        if (existing.indexOf(headers[i]) === -1) {
          sheet.getRange(1, sheet.getLastColumn() + 1).setValue(headers[i]);
          existing.push(headers[i]);
        }
      }
    }

    sheet.setFrozenRows(1);
  }

  var users = getRows('users');
  if (users.length === 0) {
    appendRow('users', {
      id:createId(),
      date:new Date(),
      role:'admin',
      name:'IEA Admin',
      email:'admin@iea.in',
      phone:'',
      passwordHash:makeHash('Admin@123'),
      level:'',
      course:'',
      feeStatus:'',
      credits:0,
      status:'Active'
    });

    appendRow('users', {
      id:createId(),
      date:new Date(),
      role:'student',
      name:'Demo Student',
      email:'student@iea.in',
      phone:'',
      passwordHash:makeHash('Student@1'),
      level:'A2',
      course:'Everyday English',
      feeStatus:'Paid',
      credits:12,
      status:'Active'
    });
  }

  if (getRows('announcements').length === 0) {
    appendRow('announcements', {
      date:new Date(),
      title:'Welcome to IEA Portal',
      body:'Your announcements and materials will appear here.',
      audience:'All',
      status:'Active'
    });
  }

  if (getRows('events').length === 0) {
    appendRow('events', {
      date:new Date(),
      title:'Awareness Club Session',
      time:'8:00 AM',
      mode:'Offline',
      club:'Awareness Club',
      credits:1,
      description:'Join the next Awareness Club session.',
      status:'Active'
    });
  }

  if (getRows('materials').length === 0) {
    appendRow('materials', {
      date:new Date(),
      title:'Sample Vocabulary Sheet',
      course:'Everyday English',
      type:'PDF',
      url:'https://drive.google.com/',
      audience:'All',
      status:'Active'
    });
  }
}

function loginUser(data) {
  var email = clean(data.email);
  var password = data.password || '';
  var role = data.role || '';
  var users = getRows('users');

  for (var i = 0; i < users.length; i++) {
    var user = users[i];

    if (clean(user.email) === email && user.role === role && user.status === 'Active') {
      if (user.passwordHash !== makeHash(password)) {
        return { success:false, message:'Incorrect password' };
      }

      return {
        success:true,
        user:{
          id:user.id,
          role:user.role,
          name:user.name,
          email:user.email,
          phone:user.phone,
          level:user.level,
          course:user.course,
          credits:Number(user.credits || 0)
        }
      };
    }
  }

  return { success:false, message:'No active account found' };
}

function saveEnquiry(data) {
  appendRow('enquiries', {
    date:new Date(),
    name:data.name || '',
    phone:data.phone || '',
    email:data.email || '',
    interest:data.interest || '',
    message:data.message || '',
    sourcePage:data.sourcePage || '',
    status:'New'
  });

  return { success:true, message:'Enquiry saved' };
}

function getStudentSummary(data) {
  var email = clean(data.email);
  var users = getRows('users');
  var student = null;

  for (var i = 0; i < users.length; i++) {
    if (clean(users[i].email) === email) {
      student = users[i];
      break;
    }
  }

  if (!student) return { success:false, message:'Student not found' };

  var materials = getMaterials(data).data;
  var attendanceRows = getRows('attendance');
  var total = 0;
  var present = 0;

  for (var j = 0; j < attendanceRows.length; j++) {
    if (clean(attendanceRows[j].email) === email) {
      total++;
      if (attendanceRows[j].status === 'Present') present++;
    }
  }

  var attendancePercent = total > 0 ? Math.round((present / total) * 100) : 0;

  return {
    success:true,
    data:{
      name:student.name,
      email:student.email,
      currentCourse:student.course,
      level:student.level,
      feeStatus:student.feeStatus,
      credits:Number(student.credits || 0),
      courses:student.course ? 1 : 0,
      materials:materials.length,
      attendance:attendancePercent
    }
  };
}

function getMaterials(data) {
  var rows = getRows('materials');
  var active = [];

  for (var i = 0; i < rows.length; i++) {
    if (rows[i].status === 'Active') active.push(rows[i]);
  }

  active.reverse();
  return { success:true, data:active };
}

function getAnnouncements(data) {
  var rows = getRows('announcements');
  var active = [];

  for (var i = 0; i < rows.length; i++) {
    if (rows[i].status === 'Active') active.push(rows[i]);
  }

  active.reverse();
  return { success:true, data:active };
}

function getEvents(data) {
  var rows = getRows('events');
  var active = [];

  for (var i = 0; i < rows.length; i++) {
    if (rows[i].status === 'Active') active.push(rows[i]);
  }

  active.reverse();
  return { success:true, data:active };
}

function getAdminData(data) {
  var email = clean(data.email);
  var users = getRows('users');
  var isAdmin = false;

  for (var i = 0; i < users.length; i++) {
    if (clean(users[i].email) === email && users[i].role === 'admin') {
      isAdmin = true;
      break;
    }
  }

  if (!isAdmin) return { success:false, message:'Admin access denied' };

  var students = [];
  for (var j = 0; j < users.length; j++) {
    if (users[j].role === 'student') students.push(users[j]);
  }

  var courseNames = {};
  for (var k = 0; k < students.length; k++) {
    if (students[k].course) courseNames[students[k].course] = true;
  }

  var courses = [];
  for (var course in courseNames) {
    courses.push({ name:course });
  }

  var totalCredits = 0;
  for (var c = 0; c < students.length; c++) {
    totalCredits += Number(students[c].credits || 0);
  }

  return {
    success:true,
    data:{
      students:students,
      courses:courses,
      creditsTotal:totalCredits,
      enquiries:reverseRows(getRows('enquiries')),
      materials:reverseRows(getRows('materials')),
      events:reverseRows(getRows('events')),
      payments:reverseRows(getRows('payments'))
    }
  };
}

function addStudent(data) {
  if (!data.name || !data.email || !data.password) {
    return { success:false, message:'Name, email and password are required' };
  }

  var users = getRows('users');

  for (var i = 0; i < users.length; i++) {
    if (clean(users[i].email) === clean(data.email)) {
      return { success:false, message:'This email already exists' };
    }
  }

  appendRow('users', {
    id:createId(),
    date:new Date(),
    role:'student',
    name:data.name || '',
    email:clean(data.email),
    phone:data.phone || '',
    passwordHash:makeHash(data.password || ''),
    level:data.level || '',
    course:data.course || '',
    feeStatus:data.feeStatus || 'Pending',
    credits:Number(data.credits || 0),
    status:'Active'
  });

  return { success:true, message:'Student added' };
}

function addMaterial(data) {
  appendRow('materials', {
    date:new Date(),
    title:data.title || '',
    course:data.course || '',
    type:data.type || 'Link',
    url:data.url || '',
    audience:data.audience || 'All',
    status:'Active'
  });

  return { success:true, message:'Material added' };
}

function addAnnouncement(data) {
  appendRow('announcements', {
    date:new Date(),
    title:data.title || '',
    body:data.body || '',
    audience:data.audience || 'All',
    status:'Active'
  });

  return { success:true, message:'Announcement added' };
}

function addEvent(data) {
  appendRow('events', {
    date:data.date || new Date(),
    title:data.title || '',
    time:data.time || '',
    mode:data.mode || '',
    club:data.club || '',
    credits:Number(data.credits || 0),
    description:data.description || '',
    status:'Active'
  });

  return { success:true, message:'Event added' };
}

function addPayment(data) {
  appendRow('payments', {
    date:new Date(),
    name:data.name || '',
    email:clean(data.email),
    amount:Number(data.amount || 0),
    mode:data.mode || '',
    creditsAdded:Number(data.creditsAdded || 0),
    receiptNo:data.receiptNo || '',
    status:'Paid'
  });

  if (Number(data.creditsAdded || 0) > 0) {
    addCredits(clean(data.email), Number(data.creditsAdded || 0));
  }

  return { success:true, message:'Payment added' };
}

function uploadGallery(data) {
  if (!data.title || !data.fileName || !data.mimeType || !data.base64) {
    return { success:false, message:'Title and file are required' };
  }

  var folder = DriveApp.getFolderById(GALLERY_FOLDER_ID);
  var bytes = Utilities.base64Decode(data.base64);
  var blob = Utilities.newBlob(bytes, data.mimeType, data.fileName);
  var file = folder.createFile(blob);

  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  var fileId = file.getId();
  var type = data.mimeType.indexOf('video') === 0 ? 'video' : 'image';

  var fileUrl = '';
  var previewUrl = '';

  if (type === 'image') {
    fileUrl = 'https://drive.google.com/thumbnail?id=' + fileId + '&sz=w1600';
    previewUrl = fileUrl;
  } else {
    fileUrl = 'https://drive.google.com/file/d/' + fileId + '/preview';
    previewUrl = fileUrl;
  }

  var category = data.category || 'gallery';

  appendRow('gallery', {
    date:new Date(),
    title:data.title || '',
    category:category,
    type:type,
    fileUrl:fileUrl,
    previewUrl:previewUrl,
    fileId:fileId,
    status:'Active'
  });

  return {
    success:true,
    message:'File uploaded',
    fileUrl:fileUrl,
    previewUrl:previewUrl,
    fileId:fileId
  };
}

function getGallery(data) {
  var category = data.category || 'gallery';
  var limit = Number(data.limit || 0);
  var rows = getRows('gallery');
  var active = [];

  for (var i = 0; i < rows.length; i++) {
    if (
      rows[i].status === 'Active' &&
      (rows[i].category === category || (!rows[i].category && category === 'gallery'))
    ) {
      var item = rows[i];

      if (item.type === 'image' && item.fileId) {
        try {
          var file = DriveApp.getFileById(item.fileId);
          var blob = file.getBlob();
          var mimeType = blob.getContentType();
          var base64 = Utilities.base64Encode(blob.getBytes());
          item.displayUrl = 'data:' + mimeType + ';base64,' + base64;
        } catch (err) {
          item.displayUrl = item.fileUrl || item.previewUrl || '';
        }
      } else {
        item.displayUrl = item.fileUrl || item.previewUrl || '';
      }

      active.push(item);
    }
  }

  active.reverse();

  if (limit > 0) {
    active = active.slice(0, limit);
  }

  return { success:true, data:active };
}

function addCredits(email, creditsToAdd) {
  var sheet = getSheet('users');
  var values = sheet.getDataRange().getValues();
  var headers = values[0];

  var emailCol = headers.indexOf('email');
  var creditsCol = headers.indexOf('credits');

  for (var i = 1; i < values.length; i++) {
    if (clean(values[i][emailCol]) === email) {
      var currentCredits = Number(values[i][creditsCol] || 0);
      sheet.getRange(i + 1, creditsCol + 1).setValue(currentCredits + creditsToAdd);
      break;
    }
  }
}

function getSheet(sheetName) {
  return SpreadsheetApp.openById(SHEET_ID).getSheetByName(sheetName);
}

function getRows(sheetName) {
  var sheet = getSheet(sheetName);
  if (!sheet) return [];

  var values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];

  var headers = values[0];
  var rows = [];

  for (var i = 1; i < values.length; i++) {
    var row = values[i];
    var empty = true;

    for (var j = 0; j < row.length; j++) {
      if (row[j] !== '') {
        empty = false;
        break;
      }
    }

    if (!empty) {
      var obj = {};

      for (var k = 0; k < headers.length; k++) {
        obj[headers[k]] = row[k];
      }

      rows.push(obj);
    }
  }

  return rows;
}

function appendRow(sheetName, obj) {
  var sheet = getSheet(sheetName);
  var headers = SHEETS[sheetName];
  var row = [];

  for (var i = 0; i < headers.length; i++) {
    row.push(obj[headers[i]] !== undefined ? obj[headers[i]] : '');
  }

  sheet.appendRow(row);
}

function reverseRows(rows) {
  var copy = rows.slice();
  copy.reverse();
  return copy;
}

function sendJSON(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function makeHash(text) {
  var rawHash = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    String(text)
  );

  var hash = '';

  for (var i = 0; i < rawHash.length; i++) {
    var byte = rawHash[i];

    if (byte < 0) byte += 256;

    var hex = byte.toString(16);

    if (hex.length === 1) hex = '0' + hex;

    hash += hex;
  }

  return hash;
}

function clean(text) {
  return String(text || '').trim().toLowerCase();
}

function createId() {
  return 'IEA' + new Date().getTime();
}

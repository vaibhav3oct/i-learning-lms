const COURSES=[
{id:"web-basics",title:"Web Development Basics",category:"Technology",description:"Learn HTML, CSS, JavaScript, and build your first website.",lessons:["Introduction to Web","HTML Fundamentals","CSS Styling","JavaScript Basics","Build a Landing Page"],quiz:{question:"Which language adds interactivity to a website?",options:["HTML","CSS","JavaScript","SQL"],answer:2}},
{id:"digital-marketing",title:"Digital Marketing Starter",category:"Business",description:"Learn social media, SEO, online ads, and lead generation.",lessons:["Marketing Basics","Social Media Strategy","SEO Essentials","Running Ads","Tracking Results"],quiz:{question:"What does SEO help improve?",options:["Website visibility","Printer speed","Computer RAM","Email password"],answer:0}},
{id:"computer-basics",title:"Computer & Internet Basics",category:"Beginner",description:"A practical beginner course for students and business owners.",lessons:["Using a Computer","Internet Safety","Email & Documents","Online Payments","Useful Tools"],quiz:{question:"Which is the safest way to create a password?",options:["Use your name","Use 123456","Use a long unique passphrase","Share it with friends"],answer:2}}
];

let user=JSON.parse(localStorage.getItem("il_user")||"null");
let progress=JSON.parse(localStorage.getItem("il_progress")||"{}");
let currentCourse=null;

document.getElementById("year").textContent=new Date().getFullYear();

function saveData(){localStorage.setItem("il_user",JSON.stringify(user));localStorage.setItem("il_progress",JSON.stringify(progress));}

function courseProgress(courseId){const course=COURSES.find(c=>c.id===courseId);const completed=(progress[courseId]||[]).length;return Math.round((completed/course.lessons.length)*100);}

function renderCourses(){document.getElementById("courseGrid").innerHTML=COURSES.map(course=>`<div class="card"><span class="tag">${course.category}</span><h3>${course.title}</h3><p>${course.description}</p><button class="btn primary" onclick="openCourse('${course.id}')">View Course</button></div>`).join("");}

function renderDashboard(){const dashboard=document.getElementById("dashboard");const grid=document.getElementById("enrolledCourses");if(!user){dashboard.classList.add("hidden");return;}dashboard.classList.remove("hidden");const enrolled=Object.keys(progress);grid.innerHTML=enrolled.length?enrolled.map(id=>{const course=COURSES.find(c=>c.id===id);const percent=courseProgress(id);return `<div class="card"><h3>${course.title}</h3><div class="progress"><div class="progress-bar" style="width:${percent}%"></div></div><p>${percent}% complete</p><button class="btn primary" onclick="openCourse('${id}')">Continue</button></div>`;}).join(""):"<p>You have not enrolled in any course yet.</p>";}

function openCourse(courseId){currentCourse=COURSES.find(c=>c.id===courseId);const completed=progress[courseId]||[];const percent=courseProgress(courseId);document.getElementById("courseDetails").innerHTML=`<span class="tag">${currentCourse.category}</span><h2>${currentCourse.title}</h2><p>${currentCourse.description}</p><div class="progress"><div class="progress-bar" style="width:${percent}%"></div></div><p><strong>${percent}% complete</strong></p>${currentCourse.lessons.map((lesson,index)=>`<div class="lesson ${completed.includes(index)?"done":""}"><span>${index+1}. ${lesson}</span><button class="btn ${completed.includes(index)?"success":"ghost"}" onclick="completeLesson(${index})">${completed.includes(index)?"Completed":"Mark Complete"}</button></div>`).join("")}${percent===100?`<button class="btn primary" onclick="startQuiz()">Take Final Quiz</button>`:""}<div id="quizArea"></div>`;document.getElementById("courses").classList.add("hidden");document.getElementById("dashboard").classList.add("hidden");document.getElementById("courseView").classList.remove("hidden");window.scrollTo({top:0,behavior:"smooth"});}

function closeCourse(){document.getElementById("courseView").classList.add("hidden");document.getElementById("courses").classList.remove("hidden");renderDashboard();}

function completeLesson(index){if(!user){openLogin();return;}progress[currentCourse.id]=progress[currentCourse.id]||[];if(!progress[currentCourse.id].includes(index)){progress[currentCourse.id].push(index);}saveData();openCourse(currentCourse.id);}

function startQuiz(){const quiz=currentCourse.quiz;document.getElementById("quizArea").innerHTML=`<div class="card"><h3>Final Quiz</h3><p><strong>${quiz.question}</strong></p>${quiz.options.map((option,index)=>`<div class="lesson"><span>${option}</span><button class="btn ghost" onclick="submitAnswer(${index})">Select</button></div>`).join("")}</div>`;}

function submitAnswer(selected){const quiz=currentCourse.quiz;const correct=selected===quiz.answer;document.getElementById("quizArea").innerHTML=`<div class="card"><h3>${correct?"Congratulations! 🎉":"Incorrect Answer"}</h3><p>${correct?`You passed the final quiz for <strong>${currentCourse.title}</strong>.`:"Please review the lessons and try again."}</p>${correct?`<button class="btn success" onclick="downloadCertificate()">Download Certificate</button>`:`<button class="btn primary" onclick="startQuiz()">Try Again</button>`}</div>`;}

function downloadCertificate(){const text=`I LEARNING\nCertificate of Completion\n\nThis certifies that\n\n${user.name}\n\nhas successfully completed\n\n${currentCourse.title}\n\nIssued by Cybaware Solutions\nDate: ${new Date().toLocaleDateString()}`;const blob=new Blob([text],{type:"text/plain"});const link=document.createElement("a");link.href=URL.createObjectURL(blob);link.download=`I-Learning-Certificate-${currentCourse.id}.txt`;link.click();}

function openLogin(){document.getElementById("loginModal").classList.remove("hidden");}
function closeLogin(){document.getElementById("loginModal").classList.add("hidden");}

function login(){const name=document.getElementById("studentName").value.trim();const email=document.getElementById("studentEmail").value.trim();if(!name||!email){alert("Please enter your name and email.");return;}user={name,email};saveData();closeLogin();document.getElementById("loginBtn").textContent=user.name;renderDashboard();}

document.getElementById("loginBtn").addEventListener("click",()=>{if(user){if(confirm("Do you want to log out?")){user=null;saveData();document.getElementById("loginBtn").textContent="Login";renderDashboard();}}else{openLogin();}});

document.querySelectorAll(".nav-link").forEach(link=>{link.addEventListener("click",()=>{document.querySelectorAll(".nav-link").forEach(item=>item.classList.remove("active"));link.classList.add("active");if(link.getAttribute("href")==="#dashboard"){if(!user)openLogin();renderDashboard();}});});

renderCourses();renderDashboard();if(user){document.getElementById("loginBtn").textContent=user.name;}

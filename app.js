// Paste Google Apps Script Web App URL here after deployment
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxG6dlEaJQ-p3NQsZCkdlP9MQbsov51RNHAgz27BVOBhQ-PsPzsyTbTpyM-cDVyKl90/exec";

const ADMIN_PASSWORD = "1234";

function toggleMenu(){document.getElementById("nav").classList.toggle("show");}

function sendWhatsAppInquiry(data){
  const text="New Tuition Inquiry%0A%0A"+
  "Student: "+encodeURIComponent(data.studentName||"")+"%0A"+
  "Parent: "+encodeURIComponent(data.parentName||"")+"%0A"+
  "Mobile: "+encodeURIComponent(data.mobile||"")+"%0A"+
  "Class: "+encodeURIComponent(data.studentClass||"")+"%0A"+
  "Subject: "+encodeURIComponent(data.subject||"")+"%0A"+
  "Preferred Timing: "+encodeURIComponent(data.preferredTiming||"")+"%0A"+
  "Mode: "+encodeURIComponent(data.mode||"")+"%0A"+
  "Message: "+encodeURIComponent(data.message||"");
  window.open("https://wa.me/917011514457?text="+text,"_blank");
}

async function saveToGoogleSheet(data){
  if(SCRIPT_URL.includes("PASTE_YOUR")) return false;
  await fetch(SCRIPT_URL,{method:"POST",mode:"no-cors",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});
  return true;
}

async function quickWhatsApp(){
const data = {
  source: "quick",
  studentName: "Quick Inquiry",
  parentName: "",
  mobile: "",
  studentClass: document.getElementById("classSelect").value || "",
  subject: document.getElementById("subjectSelect").value || "",
  preferredTiming: "",
  mode: "Online / Offline",
  message: "Inquiry from Find Tuition button"
};
  try{await saveToGoogleSheet(data);}catch(e){console.log(e);}
  sendWhatsAppInquiry(data);
}

function courseInquiry(course){
  const data={studentName:"Course Inquiry",parentName:"",mobile:"",studentClass:course,subject:course,preferredTiming:"",mode:"Online / Offline",message:"Inquiry from course button"};
  saveToGoogleSheet(data).catch(()=>{});
  sendWhatsAppInquiry(data);
}

document.getElementById("inquiryForm").addEventListener("submit",async function(e){
  e.preventDefault();
  const status=document.getElementById("formStatus");
  const f=new FormData(this);
  const data={
    source: "full",
    studentName:f.get("studentName"),
    parentName:f.get("parentName"),
    mobile:f.get("mobile"),
    studentClass:f.get("studentClass"),
    subject:f.get("subject"),
    preferredTiming:f.get("preferredTiming"),
    mode:f.get("mode"),
    message:f.get("message")
  };
  status.textContent="Submitting...";
  status.style.color="#064292";
  try{
    const saved=await saveToGoogleSheet(data);
    sendWhatsAppInquiry(data);
    status.textContent=saved?"Inquiry submitted to Google Sheet and WhatsApp opened.":"Apps Script URL not added. WhatsApp only.";
    status.style.color=saved?"green":"#ff5b20";
    if(saved)this.reset();
  }catch(err){
    sendWhatsAppInquiry(data);
    status.textContent="Sheet error. WhatsApp opened.";
    status.style.color="red";
  }
});

function studentLogin(){
  const m=document.getElementById("studentMobile").value.trim();
  if(m.length<10){alert("Please enter valid mobile number.");return;}
  document.getElementById("studentPanel").classList.remove("hidden");
}
function adminLogin(){
  const p=document.getElementById("adminPassword").value.trim();
  if(p!==ADMIN_PASSWORD){alert("Wrong admin password.");return;}
  document.getElementById("adminPanel").classList.remove("hidden");
}
if("serviceWorker" in navigator){window.addEventListener("load",()=>navigator.serviceWorker.register("service-worker.js"));}

function showQR(){
  document.getElementById("qrBox").classList.remove("hidden");
}

function hideQR(){
  document.getElementById("qrBox").classList.add("hidden");
}

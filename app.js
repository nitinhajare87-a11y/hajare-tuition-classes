// Paste Google Apps Script Web App URL here after deployment
const SCRIPT_URL = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";

function toggleMenu() {
  document.getElementById("menu").classList.toggle("show");
}

function quickWhatsApp() {
  const cls = document.getElementById("classSelect").value || "Not selected";
  const subject = document.getElementById("subjectSelect").value || "Not selected";

  const msg =
    "Hello Hajare Tuition Classes,%0A" +
    "I want tuition details.%0A%0A" +
    "Class: " + encodeURIComponent(cls) + "%0A" +
    "Subject: " + encodeURIComponent(subject) + "%0A" +
    "Mode: Online / Offline";

  window.open("https://wa.me/917011514457?text=" + msg, "_blank");
}

function courseInquiry(course) {
  const msg =
    "Hello Hajare Tuition Classes,%0A" +
    "I want inquiry for: " + encodeURIComponent(course) + "%0A" +
    "Please share details.";

  window.open("https://wa.me/917011514457?text=" + msg, "_blank");
}

document.getElementById("inquiryForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const status = document.getElementById("formStatus");
  const formData = new FormData(this);

  const data = {
    studentName: formData.get("studentName"),
    parentName: formData.get("parentName"),
    mobile: formData.get("mobile"),
    studentClass: formData.get("studentClass"),
    subject: formData.get("subject"),
    mode: formData.get("mode"),
    message: formData.get("message")
  };

  status.textContent = "Submitting...";
  status.style.color = "#0b3d91";

  // Until Google Sheet URL is added, send inquiry via WhatsApp automatically
  if (SCRIPT_URL.includes("PASTE_YOUR")) {
    const whatsappText =
      "New Tuition Inquiry%0A%0A" +
      "Student: " + encodeURIComponent(data.studentName) + "%0A" +
      "Parent: " + encodeURIComponent(data.parentName) + "%0A" +
      "Mobile: " + encodeURIComponent(data.mobile) + "%0A" +
      "Class: " + encodeURIComponent(data.studentClass) + "%0A" +
      "Subject: " + encodeURIComponent(data.subject) + "%0A" +
      "Mode: " + encodeURIComponent(data.mode) + "%0A" +
      "Message: " + encodeURIComponent(data.message || "");

    window.open("https://wa.me/917011514457?text=" + whatsappText, "_blank");
    status.textContent = "Inquiry opened in WhatsApp. Add Google Script URL for Sheet saving.";
    status.style.color = "#ff6b35";
    return;
  }

  try {
    await fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const whatsappText =
      "New Tuition Inquiry Submitted%0A%0A" +
      "Student: " + encodeURIComponent(data.studentName) + "%0A" +
      "Parent: " + encodeURIComponent(data.parentName) + "%0A" +
      "Mobile: " + encodeURIComponent(data.mobile) + "%0A" +
      "Class: " + encodeURIComponent(data.studentClass) + "%0A" +
      "Subject: " + encodeURIComponent(data.subject);

    window.open("https://wa.me/917011514457?text=" + whatsappText, "_blank");

    status.textContent = "Inquiry submitted successfully!";
    status.style.color = "green";
    this.reset();
  } catch (error) {
    status.textContent = "Error submitting form. Please contact on WhatsApp.";
    status.style.color = "red";
  }
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js");
  });
}

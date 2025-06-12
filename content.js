// پاکسازی متن از کاراکترهای پنهان، پرانتزها، و em dash
function cleanText(str) {
  return str
    .replace(/[\u200B-\u200D\u202F\uFEFF]/g, ' ') // کاراکترهای مخفی
    .replace(/\(/g, '﹙')                         // پرانتز باز فارسی
    .replace(/\)/g, '﹚')                         // پرانتز بسته فارسی
    .replace(/—/g, '-');                          // جایگزینی em dash با -
}

// نوشتن در کلیپ‌برد
function copyToClipboard(text, html) {
  navigator.clipboard.write([
    new ClipboardItem({
      "text/plain": new Blob([text], { type: "text/plain" }),
      "text/html": new Blob([html], { type: "text/html" })
    })
  ]).then(() => {
    const btn = document.getElementById("hayula-clean-copy-btn");
    if (btn) {
      btn.textContent = "✅ کپی شد!";
      setTimeout(() => (btn.textContent = "📋 کپی تمیز"), 1500);
    }
  }).catch(err => {
    console.error("خطا در نوشتن کلیپ‌برد:", err);
    alert("❌ خطا در کپی");
  });
}

// ساخت دکمه
function createCopyButton() {
  const btn = document.createElement("button");
  btn.id = "hayula-clean-copy-btn";
  btn.textContent = "📋 کپی تمیز";

  Object.assign(btn.style, {
  position: "fixed",
  bottom: "20px",
  right: "20px",
  zIndex: 9999,
  padding: "8px 14px",
  background: "#10a37f",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontSize: "14px",
  cursor: "pointer",
  boxShadow: "0 2px 6px rgba(0,0,0,0.2)", // ← اینجا ویرگول مجازه چون پراپرتی بعدش هست
  transition: "background 0.2s ease"      // ← این خط آخره؛ اینجا **ویرگول نذار**
});

  btn.addEventListener("mouseenter", () => btn.style.background = "#12856b");
  btn.addEventListener("mouseleave", () => btn.style.background = "#10a37f");

  btn.addEventListener("click", () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      alert("لطفاً متنی رو انتخاب کن.");
      return;
    }

    const range = selection.getRangeAt(0);
    const container = document.createElement("div");
    container.appendChild(range.cloneContents());

    const rawText = selection.toString();
    const rawHTML = container.innerHTML;

    const cleanedText = cleanText(rawText);
    const cleanedHTML = cleanText(rawHTML);

    copyToClipboard(cleanedText, cleanedHTML);
  });

  document.body.appendChild(btn);
}

// بررسی و اضافه‌کردن دکمه فقط اگر وجود نداشت
function addCopyButton() {
  if (!document.getElementById("hayula-clean-copy-btn")) {
    createCopyButton();
  }
}

// اجرای اولیه
addCopyButton();

// اطمینان از ماندگاری دکمه
setInterval(addCopyButton, 2000);

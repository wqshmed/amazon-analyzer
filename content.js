// --- Helper: get product data ---
function extractAmazonData() {
  const asinMatch = window.location.href.match(/\/([A-Z0-9]{10})(?:[/?]|$)/);
  const asin = asinMatch ? asinMatch[1] : "N/A";

  const title = document.querySelector("#productTitle")?.innerText.trim() || "N/A";
  const priceText =
    document.querySelector(".a-price .a-offscreen")?.innerText ||
    document.querySelector("#price_inside_buybox")?.innerText ||
    document.querySelector(".a-color-price")?.innerText ||
    "N/A";
  const price = parseFloat(priceText.replace(/[^0-9.]/g, "")) || 0;

  const rating = document.querySelector("span[data-hook='rating-out-of-text']")?.innerText || "N/A";
  const seller = document.querySelector("#sellerProfileTriggerId")?.innerText || "Amazon";

  const costEstimate = price * 0.6;
  const profitEstimate = price - costEstimate - (price * 0.15);

  return {
    asin,
    title,
    priceText,
    rating,
    seller,
    profitEstimate: profitEstimate.toFixed(2)
  };
}

// --- Helper: create info box ---
function createInfoBox(data) {
  let existingBox = document.querySelector("#profit-analyzer-box");
  if (existingBox) existingBox.remove();

  const box = document.createElement("div");
  box.id = "profit-analyzer-box";
  box.style.border = "2px solid #ffa41c";
  box.style.background = "#fff8e1";
  box.style.padding = "10px";
  box.style.marginTop = "10px";
  box.style.borderRadius = "8px";
  box.style.fontFamily = "Arial, sans-serif";
  box.style.fontSize = "14px";
  box.style.boxShadow = "0 1px 4px rgba(0,0,0,0.1)";
  box.style.transition = "all 0.3s ease";

  box.innerHTML = `
    <strong>📦 Amazon Profit Analyzer</strong><br>
    <b>ASIN:</b> ${data.asin}<br>
    <b>Price:</b> ${data.priceText}<br>
    <b>Rating:</b> ${data.rating}<br>
    <b>Seller:</b> ${data.seller}<br>
    <b>Est. Profit:</b> $${data.profitEstimate}
  `;

  const titleEl = document.querySelector("#titleSection") || document.querySelector("#title_feature_div");
  if (titleEl) titleEl.parentNode.insertBefore(box, titleEl.nextSibling);
}

// --- Watch for page changes (Amazon uses dynamic navigation) ---
let lastUrl = location.href;
new MutationObserver(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    setTimeout(initAnalyzer, 2000);
  }
}).observe(document, { subtree: true, childList: true });

// --- Main init function ---
function initAnalyzer() {
  const title = document.querySelector("#productTitle");
  if (!title) return;

  const data = extractAmazonData();
  createInfoBox(data);
}

// --- Real-time updates every 5s ---
setInterval(() => {
  const data = extractAmazonData();
  const existing = document.querySelector("#profit-analyzer-box");
  if (existing) createInfoBox(data);
}, 5000);

// Run once when loaded
setTimeout(initAnalyzer, 2000);

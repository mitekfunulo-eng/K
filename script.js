let contacts = [];

async function loadData() {
  const res = await fetch('data.json'); // use new file
  const data = await res.json();

  // Flatten grouped JSON into one array with "country" added
  contacts = Object.keys(data).flatMap(country =>
    data[country].map(item => ({
      ...item,
      country // add country key
    }))
  );

  populateFilter();
  renderContacts(contacts);
}

function populateFilter() {
  const filter = document.getElementById("filter");
  filter.innerHTML = "<option value=''>All Countries</option>"; // reset

  const countries = [...new Set(contacts.map(c => c.country))];
  countries.forEach(country => {
    const opt = document.createElement("option");
    opt.value = country;
    opt.textContent = country;
    filter.appendChild(opt);
  });
}

function renderContacts(data) {
  const container = document.getElementById("contacts");
  container.innerHTML = "";
  data.forEach(c => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${c.method} - ${c.country}</h3>
      <p><strong>Name:</strong> ${c.name || "N/A"}</p>
      <p><strong>Number/Wallet:</strong> ${c.wallet || c.number || c.address || "N/A"}</p>
      <p><strong>Minimum:</strong> ${c.min || "N/A"}</p>
      ${c.city ? `<p><strong>City:</strong> ${c.city}</p>` : ""}
      ${c.notes ? `<p><strong>Notes:</strong> ${c.notes}</p>` : ""}
      <button class="copy-btn" onclick="copyText('${c.wallet || c.number || c.address || ""}')">Copy</button>
    `;
    container.appendChild(card);
  });
}

function copyText(text) {
  navigator.clipboard.writeText(text);
  alert("Copied: " + text);
}

document.getElementById("search").addEventListener("input", e => {
  const val = e.target.value.toLowerCase();
  const filtered = contacts.filter(c =>
    c.country.toLowerCase().includes(val) ||
    c.method.toLowerCase().includes(val) ||
    (c.name && c.name.toLowerCase().includes(val))
  );
  renderContacts(filtered);
});

document.getElementById("filter").addEventListener("change", e => {
  const val = e.target.value;
  const filtered = val ? contacts.filter(c => c.country === val) : contacts;
  renderContacts(filtered);
});

document.getElementById("exportBtn").addEventListener("click", () => {
  let csv = "Method,Country,Name,Wallet/Number,Min,City,Notes\n";
  contacts.forEach(c => {
    csv += `"${c.method}","${c.country}","${c.name || ""}","${c.wallet || c.number || c.address || ""}","${c.min || ""}","${c.city || ""}","${c.notes || ""}"\n`;
  });
  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "contacts.csv";
  link.click();
});

loadData();

let contacts = [];

async function loadData() {
  const res = await fetch('data.json');
  contacts = await res.json();
  populateFilter();
  renderContacts(contacts);
}

function populateFilter() {
  const filter = document.getElementById("filter");
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
      <p><strong>Name:</strong> ${c.name}</p>
      <p><strong>Number:</strong> ${c.number}</p>
      <button class="copy-btn" onclick="copyText('${c.number}')">Copy Number</button>
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
    c.country.toLowerCase().includes(val) || c.method.toLowerCase().includes(val)
  );
  renderContacts(filtered);
});

document.getElementById("filter").addEventListener("change", e => {
  const val = e.target.value;
  const filtered = val ? contacts.filter(c => c.country === val) : contacts;
  renderContacts(filtered);
});

document.getElementById("exportBtn").addEventListener("click", () => {
  let csv = "Method,Country,Name,Number\n";
  contacts.forEach(c => {
    csv += `${c.method},${c.country},${c.name},${c.number}\n`;
  });
  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "contacts.csv";
  link.click();
});

loadData();

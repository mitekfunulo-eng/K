let contacts = [];

async function loadData() {
  const res = await fetch('data.json');
  const data = await res.json();

  // Flatten grouped JSON into one array with "country" added
  contacts = Object.keys(data).flatMap(country =>
    data[country].flatMap(item => {
      // If entry has "entries" array (like Mexico), expand it
      if (item.entries) {
        return item.entries.map(sub => ({
          ...sub,
          method: item.method || "Unknown",
          country
        }));
      }
      return { ...item, country };
    })
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

    // Collect all possible IDs / numbers / wallets into one line
    const identifiers = [
      c.wallet,
      c.number,
      c.address,
      c.till_number,
      c.account_no,
      c.card_number,
      c.iban,
      c.account_number,
      c.dest_wallet,
      c.destination_wallet,
      c.instapay_address,
      c.clabe,
      c.bank_account,
      c.mtn,
      c.orange,
      c.phone
    ].filter(Boolean).join(" | ");

    card.innerHTML = `
      <h3>${c.method || "Unknown"} - ${c.country}</h3>
      ${c.name ? `<p><strong>Name:</strong> ${c.name}</p>` : ""}
      ${identifiers ? `<p><strong>Number/Wallet:</strong> ${identifiers}</p>` : ""}
      ${c.min ? `<p><strong>Minimum:</strong> ${c.min}</p>` : ""}
      ${c.city ? `<p><strong>City:</strong> ${c.city}</p>` : ""}
      ${c.bank_name ? `<p><strong>Bank:</strong> ${c.bank_name}</p>` : ""}
      ${c.account_title ? `<p><strong>Account Title:</strong> ${c.account_title}</p>` : ""}
      ${c.receiver_name ? `<p><strong>Receiver:</strong> ${c.receiver_name}</p>` : ""}
      ${c.instructions ? `<p><strong>Instructions:</strong> ${c.instructions}</p>` : ""}
      ${c.notes ? `<p><strong>Notes:</strong> ${c.notes}</p>` : ""}
      ${c.link ? `<p><a href="${c.link}" target="_blank">Payment Link</a></p>` : ""}
      <button class="copy-btn" onclick="copyText('${identifiers}')">Copy</button>
    `;

    container.appendChild(card);
  });
}

function copyText(text) {
  if (!text) {
    alert("No number or wallet to copy!");
    return;
  }
  navigator.clipboard.writeText(text);
  alert("Copied: " + text);
}

document.getElementById("search").addEventListener("input", e => {
  const val = e.target.value.toLowerCase();
  const filtered = contacts.filter(c =>
    (c.country && c.country.toLowerCase().includes(val)) ||
    (c.method && c.method.toLowerCase().includes(val)) ||
    (c.name && c.name.toLowerCase().includes(val)) ||
    (c.notes && c.notes.toLowerCase().includes(val))
  );
  renderContacts(filtered);
});

document.getElementById("filter").addEventListener("change", e => {
  const val = e.target.value;
  const filtered = val ? contacts.filter(c => c.country === val) : contacts;
  renderContacts(filtered);
});

document.getElementById("exportBtn").addEventListener("click", () => {
  let csv = "Method,Country,Name,Identifiers,Min,City,Bank,Notes\n";
  contacts.forEach(c => {
    const identifiers = [
      c.wallet,
      c.number,
      c.address,
      c.till_number,
      c.account_no,
      c.card_number,
      c.iban,
      c.account_number,
      c.dest_wallet,
      c.destination_wallet,
      c.instapay_address,
      c.clabe,
      c.bank_account,
      c.mtn,
      c.orange,
      c.phone
    ].filter(Boolean).join(" | ");

    csv += `"${c.method || ""}","${c.country || ""}","${c.name || ""}","${identifiers}","${c.min || ""}","${c.city || ""}","${c.bank_name || ""}","${c.notes || ""}"\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "contacts.csv";
  link.click();
});

loadData();

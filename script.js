const API = "https://script.google.com/macros/s/AKfycbygv4HB8OMBzTWhO18eEjNK9aRf1LWtiTlt4Lm7RPP7hBjfVHfEgng_evrF3NpXGBMnrw/exec";

function login() {
  const acc = document.getElementById("acc").value;
  const pass = document.getElementById("pass").value;

  fetch(`${API}?action=login&account=${acc}&password=${pass}`)
    .then(r => r.json()).then(d => {
      if (d.status == "success") {
        localStorage.setItem("user", JSON.stringify(d));
        window.location = "dashboard.html";
      } else {
        document.getElementById("msg").innerText = "Invalid Credentials!";
      }
    });
}

function logout() {
  localStorage.removeItem("user");
  location = "index.html";
}

if (location.pathname.includes("dashboard")) {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) location = "index.html";

  document.getElementById("name").innerText = user.name;
  document.getElementById("account").innerText = user.account;
  document.getElementById("mobile").innerText = user.mobile;
  document.getElementById("balance").innerText = user.balance;

  fetch(`${API}?action=transactions&account=${user.account}`)
    .then(r => r.json())
    .then(list => {
      let html="";
      list.forEach(t => {
        html += `<tr><td>${t.date}</td><td>${t.type}</td><td>₹${t.amount}</td></tr>`;
      });
      document.getElementById("tx").innerHTML = html;
    });
}

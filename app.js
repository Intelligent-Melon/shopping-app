const BIN_ID = "69221ac9ae596e708f6a3915";
const READ_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}/latest`;
const WRITE_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;
const MASTER_KEY = "$2a$10$GTtuNBoOGUSQV6oC/Fylb.KdHNYhr.TBgCc7CryfXxTzYQlCP.ZYq";

let data = { aldi: {}, tesco: {} };

async function loadData() {
    const res = await fetch(READ_URL);
    const json = await res.json();
    data = json.record;
    updateUI();
}

async function saveData() {
    await fetch(WRITE_URL, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "X-Master-Key": MASTER_KEY
        },
        body: JSON.stringify(data)
    });
}

function updateUI() {
    const shop = document.getElementById("shop").value;
    document.getElementById("shop-title").innerText = shop.toUpperCase() + " Items";

    const list = document.getElementById("list");
    list.innerHTML = "";

    for (const [name, info] of Object.entries(data[shop])) {
        const li = document.createElement("li");
        li.innerHTML = `
            <div>
                <strong>${name}</strong><br>
                Weekly: ${info.weekly}<br>
                Current: ${info.current}<br>
                Buy: ${info.buy}
            </div>
            <button class="delete-btn" onclick="deleteItem('${name}')">X</button>
        `;
        list.appendChild(li);
    }
}

function deleteItem(name) {
    const shop = document.getElementById("shop").value;
    delete data[shop][name];
    saveData();
    updateUI();
}

function addItem() {
    const shop = document.getElementById("shop").value;
    const name = document.getElementById("item").value.trim().toLowerCase();
    const weekly = document.getElementById("weekly").value.trim();
    const current = document.getElementById("current").value.trim();

    if (!name || !weekly || !current) {
        alert("Fill all fields");
        return;
    }

    const weeklyNum = parseInt(weekly.split(" ")[0]);
    const currentNum = parseInt(current.split(" ")[0]);
    const weeklyUnit = weekly.split(" ")[1] || "";
    const currentUnit = current.split(" ")[1] || "";

    const buy = Math.max(weeklyNum - currentNum, 0);

    data[shop][name] = {
        weekly: `${weeklyNum} ${weeklyUnit}`,
        current: `${currentNum} ${currentUnit}`,
        buy: buy
    };

    saveData();
    updateUI();
}

document.getElementById("shop").addEventListener("change", updateUI);

// Load initial data
loadData();


function storeData(date, amount, cost) {
    let record = {
        date: date,
        amount: amount,
        cost: cost
    }

    let tankolasok = JSON.parse(localStorage.getItem("tankolasok") || "[]")

    tankolasok.push(record)
    localStorage.setItem("tankolasok", JSON.stringify(tankolasok))
}

function getData() {
    console.log(JSON.parse(localStorage.getItem("tankolasok")));
}










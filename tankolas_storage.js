 
function storeData(date, amount, cost, km = 100) {
    let record = {
        date: date,
        amount: amount,
        cost: cost,
        km: km
    }

    let tankolasok = JSON.parse(localStorage.getItem("tankolasok") || "[]")

    tankolasok.push(record)
    localStorage.setItem("tankolasok", JSON.stringify(tankolasok))
    listing()
}

function getData() {
    return JSON.parse(localStorage.getItem("tankolasok"));
}



function listing(){
    let data=getData()
    const list=document.getElementById("tankolasList")
    const datemax=document.getElementById("tankolasFiltermax")
    const datemin=document.getElementById("tankolasFiltermin")

    console.log(data)
    console.log(datemin.value)

    if (datemin.value!=""){
        data=data.filter((tankolas)=>new Date(tankolas["date"])>= new Date(datemin.value))
    }
    if (datemax.value!=""){
        data=data.filter((tankolas)=>new Date(tankolas["date"])<= new Date(datemax.value))
    }

    data={"2026":{"05":[{"date":"2026-05-01"},{"date":"2026-05-02"}],"06":[{"date":"2026-05-03"}]},"3000":{"12":[{"date":"3000-12-01"},{"date":"3000-12-02"},{"date":"3000-12-03"}]}}


    console.log(data)
    list.innerHTML=""

    for (year in data){
        const ytext=document.createElement("p")
        ytext.innerHTML=`${year}`
        list.appendChild(ytext)
        for (month in data[year]){
            const table=document.createElement("table")   
            "m-auto bg-gray-400 w-1/2 rounded-lg padding".split(" ").forEach(e => table.classList.add(e))

            data[year][month].forEach(item =>{
                table.innerHTML+=`<tr>
                            <td class="w-1/4 text-center">${item["date"]}</td>
                            <td class="w-1/4 text-center">${item["amount"]}</td>
                            <td class="w-1/4 text-center">${item["cost"]}</td>
                            <td class="w-1/4 text-center">${item["km"] | "n.a."}</td>
                            <td><button onclick="erase_entry('${item["date"]}')">X</button></td>
                        </tr>`

            })

            const text=document.createElement("p")
            text.innerHTML=`${month}`

            list.appendChild(text)
            list.appendChild(table)
    }};
    
}

function erase_entry(date){
    let data=getData();
    console.log(date)
    for (n in data){
        const item=data[n]
        if(item["date"]==date){
            data.pop(n)
            break
        }
    }
}


function listByMonths(data) {
    let years = []
    let result = {}
    

    for (record in data) {
        if (!years.includes(data[record]["date"].split("-")[0])) {
            years.push(data[record]["date"].split("-")[0]);
        }
    }

    years.forEach(year => {
        result[year] = Object.fromEntries(Object.entries(data).filter(([key, value]) => value["date"].includes(year)))
    });

    for (let key in result) {
        let months = {}
        for (let record in result[key]) {
            if (!Object.keys(months).includes(result[key][record]["date"].split('-')[1])) {
                months[result[key][record]["date"].split('-')[1]] = parseInt(result[key][record]["cost"])
            }
            else {
                months[result[key][record]["date"].split('-')[1]] += parseInt(result[key][record]["cost"])
            }
        }
        result[key] = months;
    }

    console.log(result)
    return result
}





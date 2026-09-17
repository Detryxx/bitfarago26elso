
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
    console.log(data)
    list.innerHTML=""
    for (i in data){
        const item=data[i]
        console.log(item)
        list.innerHTML+=`<tr>
					<td class="w-1/3 text-center">${item["date"]}</td>
					<td class="w-1/3 text-center">${item["amount"]}</td>
					<td class="w-1/3 text-center">${item["cost"]}</td>
				</tr>`
    }
}







function storeData(date, amount, cost) {
    let record = {
        date: date,
        amount: amount,
        cost: cost
    }
    data = JSON.stringify(record);

}



function listing(){
    let data=getData()
    const list=document.getElementById("tankolasList")
    const datemax=document.getElementById("tankolasFiltermax")
    const datemin=document.getElementById("tankolasFiltermin")
    if (datemin.value!=""){
        data=data.filter((tankolas)=>new Date(tankolas["date"])>= new Date(datemin.value))
    }
    if (datemax.value!=""){
        data=data.filter((tankolas)=>new Date(tankolas["date"])<= new Date(datemax.value))
    }
    list.innerHTML=""
    for (item in data){
        list.innerHTML+=`<tr>
					<td class="w-1/3 text-center">${item["date"]}</td>
					<td class="w-1/3 text-center">${item["amount"]}</td>
					<td class="w-1/3 text-center">${item["cost"]}</td>
				</tr>`
    }
}




let listEfficiency = false;
const table_classes = "";
function storeData(date, amount, cost, km) {
	let record = {
		date: date,
		amount: amount,
		cost: cost,
		km: km,
	};
	let is_filled = true;
	for (e in record) {
		if (!record[e]) {
			return;
		}
	}

	let tankolasok = JSON.parse(localStorage.getItem("tankolasok") || "[]");

	tankolasok.push(record);
	localStorage.setItem("tankolasok", JSON.stringify(tankolasok));
	listing();
}

function getData() {
	let res = JSON.parse(localStorage.getItem("tankolasok"));
	if (res) {
		res = res.sort((a, b) => {
			if (new Date(a["date"]) < new Date(b["date"])) {
				return -1;
			}
			if (new Date(a["date"]) > new Date(b["date"])) {
				return 1;
			}
			return 0;
		});
	} //MAJDNEM RAGEQUITELTEM BAZMGE A JAVASCRIPT FOLYTON ÚGY DÖNTÖTT HOGY CSAK ÚGY IGNORÁLJA A SORTOLÁST
	// console.log("getdata sorted",res)
	return res ? res : [];
}

function listing(type = -1) {
	if (type == -1) {
		if (listEfficiency) {
			list_by_efficiency();
		} else {
			list_by_time();
		}
	} else {
		listEfficiency = type != 0;
		listing();
	}
}

function list_by_time() {
	let data = getData();
	const list = document.getElementById("tankolasList");
	const datestart = document
		.getElementById("tankolasRange")
		.value.split(" - ")[0];
	const dateend = document
		.getElementById("tankolasRange")
		.value.split(" - ")[1];

	// console.log("dates",datestart, dateend);

	// console.log(data);

	if (datestart) {
		data = data.filter(
			(tankolas) => new Date(tankolas["date"]) >= new Date(datestart),
		);
	}
	if (dateend) {
		data = data.filter(
			(tankolas) => new Date(tankolas["date"]) <= new Date(dateend),
		);
	}

	// data = {
	// 	2026: {
	// 		"05": [{ date: "2026-05-01" }, { date: "2026-05-02" }],
	// 		"06": [{ date: "2026-05-03" }],
	// 	},
	// 	3000: {
	// 		12: [
	// 			{ date: "3000-12-01" },
	// 			{ date: "3000-12-02" },
	// 			{ date: "3000-12-03" },
	// 		],
	// 	},
	// };

	// console.log(data);
	list.innerHTML = "";

	data = listByMonths(data);

	let last_distance = 0;
	let first_item = true;

	for (year in data) {
		const ytext = document.createElement("p");
		ytext.innerHTML = `${year}`;
		list.appendChild(ytext);
		for (month in data[year]) {
			let sum = 0;
			const table = document.createElement("table");
			"m-auto bg-gray-600 w-1/2 rounded-lg padding text-sm text-left rtl:text-right text-body"
				.split(" ")
				.forEach((e) => table.classList.add(e));

			data[year][month].forEach((item) => {
				let difference_text = "";
				if (first_item) {
					first_item = false;
				} else {
					const diff = parseInt(item["km"]) - last_distance;

					if (diff > 0) {
						difference_text = `(+${diff})`;
					} else if (diff < 0) {
						difference_text = `(${diff}, nem kéne megbűvölni a km órát)`;
					}
				}
				last_distance = parseInt(item["km"]);

				table.innerHTML += `<tr>
                            <td class="w-1/4 text-center">${item["date"]}</td>
                            <td class="w-1/4 text-center">${item["amount"]} L</td>
                            <td class="w-1/4 text-center">${item["cost"]} Ft</td>
                            <td class="w-1/4 text-center">${item["km"]}${difference_text} km</td>
                            <td><button type="button" class="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-base text-sm px-4 py-2.5 text-center leading-5 cursor-pointer" onclick='erase_entry(${JSON.stringify(item)})'><span class="material-symbols-outlined">delete</span></button></td>
                        </tr>`;

				sum += parseInt(item["cost"]);
			});

			const text = document.createElement("p");
			text.innerHTML = `${month} - ${sum} Ft`;

			list.appendChild(text);
			list.appendChild(table);
		}
	}
}

function list_by_efficiency() {
	let data = getData();
	const list = document.getElementById("tankolasList");
	const datestart = document
		.getElementById("tankolasRange")
		.value.split(" - ")[0];
	const dateend = document
		.getElementById("tankolasRange")
		.value.split(" - ")[1];

	// console.log("dates",datestart, dateend);

	// console.log(data);

	if (datestart) {
		data = data.filter(
			(tankolas) => new Date(tankolas["date"]) >= new Date(datestart),
		);
	}
	if (dateend) {
		data = data.filter(
			(tankolas) => new Date(tankolas["date"]) <= new Date(dateend),
		);
	}
	let last_distance = 0;
	for (e in data) {
		data[e]["diff"] = parseInt(data[e]["km"]) - last_distance;
		last_distance = parseInt(data[e]["km"]);
	}

	const sorted = data.sort((a, b) => {
		if (
			parseInt(a["amount"]) / parseInt(a["diff"]) >
			parseInt(b["amount"]) / parseInt(b["diff"])
		)
			return 1;
		if (
			parseInt(a["amount"]) / parseInt(a["diff"]) <
			parseInt(b["amount"]) / parseInt(b["diff"])
		)
			return -1;
		return 0;
	});
	list.innerHTML = "";
	const table = document.createElement("table");
	const body = document.createElement("tbody");
	table.appendChild(body);
	"m-auto bg-gray-400 w-3/4 rounded-lg padding"
		.split(" ")
		.forEach((e) => table.classList.add(e));
	console.log(sorted);
	sorted.forEach((item) => {
		if (parseInt(item["amount"]) / parseInt(item["diff"]) != Infinity) {
			let clear_button_item = { ...item }; //ez elvileg copy
			delete clear_button_item["diff"];
			body.innerHTML += `<tr>

                            <td class="w-1/5 text-center">${item["date"]}</td>
                            <td class="w-1/5 text-center">${item["amount"]} L</td>
                            <td class="w-1/5 text-center">${item["cost"]} Ft</td>
                            <td class="w-1/5 text-center">${item["km"]}(${item["diff"]}) km</td>
                            <td class="w-1/5 text-center">${
															Math.round(
																(parseInt(item["amount"]) /
																	parseInt(item["diff"])) *
																	1000,
															) / 1000
														}L/km</td>
                            <td><button type="button" class="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-base text-sm px-4 py-2.5 text-center leading-5 cursor-pointer" onclick='erase_entry(${JSON.stringify(item)})'><span class="material-symbols-outlined">delete</span></button></td>
                        </tr>`;
		}
	});
	list.appendChild(table);
}

function erase_entry(delItem) {
	let data = getData();
	for (n in data) {
		const item = data[n];
		console.log("erase", delItem, item);
		if (JSON.stringify(item) == JSON.stringify(delItem)) {
			data.splice(n, 1);
			console.log(delItem, data, n);
			break;
		}
	}
	localStorage.setItem("tankolasok", JSON.stringify(data));
	listing();
}

function clear() {
	localStorage.removeItem("tankolasok");

	listing();
}
function cleardate() {
	document.getElementById("tankolasRange").value = "-";
}

function listByMonths(data) {
	let years = [];
	let result = {};

	for (record in data) {
		if (!years.includes(data[record]["date"].split("-")[0])) {
			years.push(data[record]["date"].split("-")[0]);
		}
	}

	years.forEach((year) => {
		result[year] = Object.fromEntries(
			Object.entries(data).filter(([key, value]) =>
				value["date"].includes(year),
			),
		);
	});

	for (let key in result) {
		let months = {};
		for (let record in result[key]) {
			if (
				!Object.keys(months).includes(result[key][record]["date"].split("-")[1])
			) {
				months[result[key][record]["date"].split("-")[1]] = [];
				months[result[key][record]["date"].split("-")[1]].push(
					result[key][record],
				);
			} else {
				months[result[key][record]["date"].split("-")[1]].push(
					result[key][record],
				);
			}
		}
		result[key] = months;
	}

	console.log(result);
	return result;
}

function setup() {
	document
		.getElementById("tankolasForm")
		.addEventListener("submit", function (event) {
			event.preventDefault();
			const formData = new FormData(event.target);
			console.log(formData);
			const date = formData.get("tankolasDate"); // Miért username?????????
			const amount = formData.get("tankolasAmount");
			const cost = formData.get("tankolasCost");
			const distance = formData.get("tankolasDistance"); //nemtom miaz hogy km óra állás angolul úgyhogy lesz helyette distance
			console.log(
				"Submitted DATA NOT USERNAME!!! HOW DID U COME UP WITH USERNAME HERE:",
				date,
				amount,
				cost,
			);
			storeData(date, amount, cost, distance);
		});
	$(function () {
		$('input[name="datefilter"]').daterangepicker({
			autoUpdateInput: false,
			locale: {
				cancelLabel: "Clear",
			},
		});

		$('input[name="datefilter"]').on(
			"apply.daterangepicker",
			function (ev, picker) {
				$(this).val(
					picker.startDate.format("MM/DD/YYYY") +
						" - " +
						picker.endDate.format("MM/DD/YYYY"),
				);
				listing();
			},
		);

		$('input[name="datefilter"]').on(
			"cancel.daterangepicker",
			function (ev, picker) {
				$(this).val("");
				listing();
			},
		);
	});
	listing();
}

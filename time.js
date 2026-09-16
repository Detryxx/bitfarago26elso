
function padNumber(n) {
const str = '0' + n;
return str.slice(-2);
}
function displayTime() {
    const time = new Date();
    hour = time.getHours();
    minute = time.getMinutes();
    second = time.getSeconds();

    const display = document.getElementById('time');
    display.innerHTML = padNumber(hour) + ':' + padNumber(minute) + ':' + padNumber(second);
}
function timeloop() {
    displayTime();
    setTimeout(timeloop, 1000);
}
setTimeout(timeloop, 1);

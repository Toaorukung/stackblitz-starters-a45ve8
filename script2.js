$(document).ready(function () {
    let keywords = localStorage.getItem('uid');
    checkdate(keywords);
    setInterval(function () {
        checkdate(keywords);
    }, 10000); 
});
function checkdate(keywords) {
    const newDataUrl = scriptUrl + "?keyword=" + keywords;
    try {
        $.getJSON(newDataUrl, function (data) {
            let check = 1
            check = check+1
            console.log(check)
            let date = data.data3
            let total = data.data4
            datelist(date)
            listtotal(total)
        }).fail(function (jqxhr, textStatus, error) {
            let err = textStatus + ", " + error;
            console.error("Request Failed: " + err);
        });
    } catch (error) {
        console.error(error);
    }
}

function datelist(data) {
    data = data.flat();
    const currentDate = new Date();
    const dateyt = new Date(data[0]);
    const datenf = new Date(data[1]);

    const diffDaysYT = Math.ceil((dateyt - currentDate) / (1000 * 60 * 60 * 24));
    const diffDaysNF = Math.ceil((datenf - currentDate) / (1000 * 60 * 60 * 24));
    const dateytText = data[0] === "" ? "ไม่มีประวัติการสั่งซื้อ" : (diffDaysYT <= 0 ? "หมดอายุ" : "คงเหลือ " + diffDaysYT + " วัน");
    const datenfText = data[1] === "" ? "ไม่มีประวัติการสั่งซื้อ" : (diffDaysNF <= 0 ? "หมดอายุ" : "คงเหลือ " + diffDaysNF + " วัน");
    const dateytbt = data[0] === "" ? "สั่งซื้อแพ็คเก็จ" : (diffDaysYT <= 0 ? "ต่ออายุ" : "ซื้อวันเพิ่ม");
    const datenfbt = data[1] === "" ? "สั่งซื้อแพ็คเก็จ" : (diffDaysNF <= 0 ? "ต่ออายุ" : "ซื้อวันเพิ่ม");
    console.log(dateyt)
    console.log(diffDaysYT)
    console.log(dateytText)
    console.log(dateytbt)
    $('.btdateyt').text(dateytbt);
    $('.btdatenf').text(datenfbt);
    $('.dateyt').text(dateytText);
    $('.datenf').text(datenfText);
}

function listtotal(data) {
    $('#listtotal').empty()

    data.forEach(function (item) {
        let date = formatDate(new Date(item[0]))
        let tr = $('<tr></tr>');
        let td1 = $(`<td>${date}</td>`);
        let td2 = $(`<td>${item[1]}</td>`);
        let td3 = $(`<td>${item[2]}</td>`);
        let td4 = $(`<td>${item[3]}</td>`);
        tr.append(td1, td2, td3, td4);
        $('#listtotal').append(tr);
    });
}

function formatDate(date) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Intl.DateTimeFormat('th-TH', options).format(date);
}
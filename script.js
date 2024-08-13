$(document).ready(function () {
    $('.page2,.page3,.slip,.copy').hide()
    getpromotion()

    $('.backhome').click(function () {
        $('.page1').show()
        $('.page2,.page3').hide()
        $('#text1,#text2,#text3,#text4').text('')
        $('#qrcode').empty()
    })
    $('.confirm').click(function () {
        $('.page3').show()
        $('.page2,.page1').hide()
    })
    $('.buyitem').click(function () {
        let idsToCheck = ['slip']
        let hasEmptyFields = false
        idsToCheck.forEach(function (id) {
            if ($("#" + id).val() === '') {
                hasEmptyFields = true
                $("#" + id).addClass('is-invalid').removeClass('is-valid')
            } else {
                $("#" + id).addClass('is-valid').removeClass('is-invalid')
            }
        })

        if (hasEmptyFields) {
            return Swal.fire({
                icon: 'info',
                title: 'กรุณาแนบสลิป',
                allowOutsideClick: false,
                confirmButtonText: 'ตกลง',
            })
        }
        let formData = {}
        $("input[type!='file']").each(function () {
            if (this.id !== 'idcardimg1' && this.id !== 'idcardimg2') {
                formData[this.id] = $(this).val()
            }
        })
        console.log(formData)
        savereserve(formData)
    })

    $('.copytext').click(function () {
        let textToCopy = $('#text3').text().trim();

        if (textToCopy === "") {
            Swal.fire({
                icon: 'error',
                title: 'กรุณาเลือกบัญชี',
                confirmButtonText: 'ตกลง',
            });
        } else {
            let $tempInput = $('<input>');
            $('body').append($tempInput);
            $tempInput.val(textToCopy).select();
            document.execCommand('copy');
            $tempInput.remove();
            Swal.fire({
                icon: 'success',
                title: 'คัดลอกเลขบัญชีเรียบร้อย',
                allowOutsideClick: false,
                confirmButtonText: 'ตกลง',
            });
        }
    });

})

function getpromotion() {
    $.LoadingOverlay('show');
    const newDataUrl = scriptUrl
    try {
        $.getJSON(newDataUrl, function (data) {
            let promotion = data.data1;
            let promotion2 = data.data2;
            list(promotion)
            list2(promotion2)
        }).fail(function (jqxhr, textStatus, error) {
            let err = textStatus + ", " + error;
            console.error("Request Failed: " + err);
        });
    } catch (error) {
        console.error(error);
    }
}

function list(data) {
    $.LoadingOverlay('hide');
    $('#datadetail').empty();

    let groupedData = data.reduce((acc, item) => {
        let type = item[4];
        if (!acc[type]) acc[type] = [];
        acc[type].push(item);
        return acc;
    }, {});

    for (let type in groupedData) {
        let typeHeader = $('<h1 class="text-center">').text(type);
        let row = $('<div class="row">');

        groupedData[type].forEach(item => {
            let col = $('<div class="col-6 col-md-3 text-center mt-2 mb-2">');
            let col2 = $('<div class="bg-white rounded-4 text-center shadow-lg">');
            let img = $(`<img src="${item[3]}" alt="" class="mt-3" height="100">`);
            let title = $('<h2 class="fw-normal">').text(item[0]);
            let detail = $('<p>').text(item[1]);
            let price = $('<p>').text(`ราคา ${item[2]} บาท`);
            let button = $(`<a class="btn btn-custom-1 w-75 editdata mb-3" data-item='${JSON.stringify(item)}'>เลือกซื้อโปรนี้ »</a>`);

            col2.append(img, title, detail, price, button);
            col.append(col2);
            row.append(col);
        });

        $('#datadetail').append(typeHeader, row);
    }

    $('.editdata').on('click', function () {
        let itemData = $(this).data('item');
        $('.page1,.page3').hide()
        $('.page2').show()
        $('#imgpromotion').attr('src', itemData[3])
        $('#promotion').val(itemData[0])
        $('#detailpromotion').val(itemData[1])
        $('#total').val(itemData[2])
    });
}

function list2(data) {
    $('#datadetail2').empty();

    data.forEach(function (item) {
        let col = $(`<div  class="d-flex justify-content-center">`);
        let col1 = $(`<div class="d-inline-flex gap-2">`);
        let col2 = $(`<div class="col-12 rounded border focus-ring mb-1 text-center" tabindex="0" data-item='${JSON.stringify(item)}'>`)
        let img = $(`<img src="${item[3]}" alt="${item[1]}" height="180">`);
        col2.append(img)
        col.append(col2)
        col.append(col1)
        $('#datadetail2').append(col);
    });

    $('.rounded').on('click', function () {
        let itemData = $(this).data('item');
        console.log(itemData)
        let val = $('#total').val()
        let val2 = parseFloat($('#total').val()).toFixed(1);
        if (itemData[1] === "พร้อมเพย์") {
            $('#qrcode').empty()
            let col = $(`<img src="https://promptpay.io/${itemData[2]}/${val2}" alt="${itemData[1]}" height="180">`);
            console.log(col)
            $('#qrcode').append(col);
        } else {
            $('#qrcode').empty()
        }
        $('#text1').text(itemData[0])
        $('#text2').text(itemData[1])
        $('#text3').text(itemData[2])
        $('#text4').text("ยอดชำระ " + val + " บาท")
        $('.slip,.copy').show()
    });
}
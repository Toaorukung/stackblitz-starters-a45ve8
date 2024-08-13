function savereserve(formData) {
    $.LoadingOverlay('show')
    const fileInputs = ['slip']
    let files = []

    fileInputs.forEach(function (inputId) {
        const fileInput = $('#' + inputId)[0]
        const file = fileInput.files[0]
        if (file) {
            files.push(file)
        }
    })

    if (files.length > 0) {
        readFilesAsBase64(files)
            .then((base64Files) => {
                sendDataToServer(base64Files, formData)
            })
            .catch((error) => {
                console.error(error)
                $.LoadingOverlay('hide')
                Swal.fire({
                    icon: 'error',
                    title: 'เกิดข้อผิดพลาดในการอ่านไฟล์',
                    allowOutsideClick: false,
                    confirmButtonText: 'ตกลง',
                })
            })
    }
}

function readFilesAsBase64(files) {
    return new Promise((resolve, reject) => {
        let base64Files = []
        let filesProcessed = 0

        files.forEach(function (file, index) {
            const fr = new FileReader()
            fr.onload = function (e) {
                const base64File = e.target.result.replace(/^.*,/, '')
                base64Files[index] = base64File
                filesProcessed++
                if (filesProcessed === files.length) {
                    resolve(base64Files)
                }
            }
            fr.onerror = function (e) {
                reject(e)
            }
            fr.readAsDataURL(file)
        })
    })
}

function sendDataToServer(imagesData, formData) {
    let savereservedata = {
        opt: 'savereserve',
        uid: localStorage.getItem('uid'),
        slip: imagesData[0],
        ...formData
    }
    console.log(savereservedata)
    $.ajax({
        method: "POST",
        url: scriptUrl,
        data: savereservedata,
        dataType: 'json',
        success: function (res) {
            $.LoadingOverlay('hide')
            if (res.status == 'success') {
                return Swal.fire({
                    icon: 'success',
                    title: 'บันทึกรายการสั่งซื้อเรียบร้อย',
                    text: 'รอแอดมินตอบกลับ',
                    allowOutsideClick: false,
                    timer: 3000,
                    showConfirmButton: false
                }).then(() => {
                    $('.page1').show()
                    $('.page2,.page3,.slip,.copy').hide()
                    $('#text1,#text2,#text3,#text4').text('')
                    $('#slip').val('').removeClass('is-valid')
                    $('#qrcode').empty()
                })
            }
        },
        error: function (err) {
            console.log(err)
            $.LoadingOverlay('hide')
            return Swal.fire({
                icon: 'error',
                title: 'บันทึกรายการสั่งซื้อไม่สำเร็จ',
                allowOutsideClick: false,
                confirmButtonText: 'ตกลง',
            })
        },
    })
}
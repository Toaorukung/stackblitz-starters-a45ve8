$(document).ready(function () {
    async function initializeLiff() {
        try {
            await liff.init({ liffId: "1660743471-WRV11EJb" })
            if (liff.isLoggedIn()) {
                getUserProfile()
            } else {
                liff.login()
            }
        } catch (error) {
            console.error('LIFF Initialization failed', error)
            $('#profile').text('LIFF Initialization failed')
        }
    }

    async function getUserProfile() {
        try {
            const profile = await liff.getProfile()
            const userId = profile.userId
            localStorage.setItem('uid', userId)
            checkRankAndRedirect()

        } catch (error) {
            console.error('Failed to get profile', error)
            $('#profile').text('Failed to get profile')
        }
    }
    // initializeLiff()

    $('#login').on('click', function (e) {
        e.preventDefault()
        let username = $('#floatingInput').val()
        let password = $('#floatingPassword').val()
        if (!username) {
            return Swal.fire({
                icon: 'info',
                title: 'โปรดกรอก Username',
                allowOutsideClick: false,
                confirmButtonText: 'ตกลง',
            })
        } else if (!password) {
            return Swal.fire({
                icon: 'info',
                title: 'โปรดกรอก Password',
                allowOutsideClick: false,
                confirmButtonText: 'ตกลง',
            })
        } else {
            updateContent(username, password)
        }

    })

    $('#logout').click(function () {
        window.location.href = window.location.origin
    })

})//ฟังชั่น ready

function checkRankAndRedirect() {
    let rank = localStorage.getItem('rank')
    let isAtOrigin = window.location.href === window.location.origin + '/'

    if (rank) {
        updateUserProfile()
    } else if (!isAtOrigin) {
        window.location.href = window.location.origin
    }
}
function updateUserProfile() {
    var storedName = localStorage.getItem('name')

    if (storedName) {
        $('#nameuser').text(storedName)
    } else {
        $('#nameuser').text('D-Confirm Premium')
    }
    $('#imageprofile').attr('src', 'https://cdn.glitch.global/27ebeeef-685e-4eae-bd00-1d3d4fd9c09e/logo.png?v=1721865440003')
}

function updateContent(newKeyword, newPassword) {
    $.LoadingOverlay('show')
    let member = {
        opt: 'checkmember',
        datacheck: newKeyword,
        datacheck2: newPassword,
        uid: localStorage.getItem('uid'),
    }
    $.ajax({
        method: "POST",
        url: scriptUrl,
        data: member,
        dataType: 'json',
        success: function (res) {
            $.LoadingOverlay('hide')
            if (res.status === 'success') {
                window.location.href = 'home.html'
                localStorage.setItem('name', res.dataname)
                localStorage.setItem('rank', res.dataPush)
            } else if (res.status === 'error') {
                Swal.fire({
                    icon: 'error',
                    title: 'ID ของท่านหมดอายุการใช้งาน',
                    text: 'กรุณาติดต่อแอดมินเพื่อต่ออายุ',
                    allowOutsideClick: false,
                    confirmButtonText: 'ตกลง',
                })
            }
        },
        error: function (err) {
            console.log(err)
            $.LoadingOverlay('hide')

            Swal.fire({
                icon: 'error',
                title: 'ไม่พบข้อมูลท่านในฐานระบบ',
                allowOutsideClick: false,
                confirmButtonText: 'ตกลง',
            }).then((result) => {
                if (result.isConfirmed) {
                    localStorage.clear()
                }
            })
        },
    })
}

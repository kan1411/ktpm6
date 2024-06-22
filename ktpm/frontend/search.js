$(document).ready(function() {
    var name = localStorage.getItem('name');
    var username = localStorage.getItem('username');

    if (name && username) {
        $('#username-display').text(name);
        $('#userDropdown').show();
        $('#loginSignup').hide();
    } else {
        $('#userDropdown').hide();
        $('#loginSignup').show();
    }

    $('#logout-button').click(function() {
        localStorage.removeItem('username');
        localStorage.removeItem('name');
        window.location.href = 'login.html';
    });
    $('#service-button').click(function() {
        window.location.href = 'service.html';
    });
    $('#personalinfor-button').click(function() {
        window.location.href = 'personalinfor.html';
    });
    $('#classform-button').click(function() {
        window.location.href = 'classform.html';
    });
    $('#searching-button').click(function() {
        window.location.href = 'search.html';
    });
    $('#mainpage-button').click(function() {
        window.location.href = 'mainpage.html';
    });
    $('#classinfor-button').click(function() {
        window.location.href = 'classinfor.html';
    });

    console.log('Username in mainpage:', username);
    console.log('Name in mainpage:', name);
});

$(document).ready(function() {
    $('#apply-filters').click(function() {
        const filters = {
            object: $('#filter-object').val(),
            subject: $('#filter-subject').val(),
            grade: $('#filter-grade').val(),
            gender: $('#filter-gender').val(),
            area: $('#filter-area').val()
        };

        $.ajax({
            url: 'http://127.0.0.1:5012/students',
            method: 'GET',
            data: filters,
            dataType: 'json',
            success: function(data) {
                const container = $('#students-container');
                container.empty(); // Xóa nội dung cũ trước khi thêm nội dung mới
                if (data.error) {
                    container.html(`<p>Lỗi: ${data.error}</p>`);
                } else if (data.length === 0) {
                    container.html('<p>Không có dữ liệu để hiển thị.</p>');
                } else {
                    data.forEach(student => {
                        const card = $(`
                            <div class="student-card">
                                <p>Đối tượng cần tìm: ${student.object}</p>
                                <p>Môn học: ${student.subject}</p>
                                <p>Khối: ${student.grade}</p>
                                <p>Giới tính: ${student.gender}</p>
                                <p>Khu vực: ${student.area}</p>
                                <p>Điều kiện khác: ${student.cond}</p>
                                <a href="#" class="see-more">Xem thêm</a>
                                <div class="more-info" style="display: none;">
                                    <button class="register-class btn btn-primary">Đăng ký lớp</button>
                                </div>
                            </div>
                        `);
                        container.append(card);
                    });
                }
            },
            error: function(xhr, status, error) {
                $('#students-container').html(`<p>Lỗi khi lấy dữ liệu: ${xhr.statusText}</p>`);
            }
        });
    });

    // Load students on page load without filters
    $.ajax({
        url: 'http://127.0.0.1:5012/students',
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            const container = $('#students-container');
            if (data.error) {
                container.html(`<p>Lỗi: ${data.error}</p>`);
            } else if (data.length === 0) {
                container.html('<p>Không có dữ liệu để hiển thị.</p>');
            } else {
                data.forEach(student => {
                    const card = $(`
                        <div class="student-card">
                            <p>Đối tượng cần tìm: ${student.object}</p>
                            <p>Môn học: ${student.subject}</p>
                            <p>Khối: ${student.grade}</p>
                            <p>Giới tính: ${student.gender}</p>
                            <p>Khu vực: ${student.area}</p>
                            <p>Điều kiện khác: ${student.cond}</p>
                            <a href="#" class="see-more">Xem thêm</a>
                            <div class="more-info" style="display: none;">
                                <button class="register-class btn btn-primary">Đăng ký lớp</button>
                            </div>
                        </div>
                    `);
                    container.append(card);
                });
            }
        },
        error: function(xhr, status, error) {
            $('#students-container').html(`<p>Lỗi khi lấy dữ liệu: ${xhr.statusText}</p>`);
        }
    });

    // Handle see more click
    $(document).on('click', '.see-more', function(event) {
        event.preventDefault();
        const card = $(this).closest('.student-card');
        card.find('.more-info').slideToggle();
    });

    // Handle register class click
    $(document).on('click', '.register-class', function(event) {
        event.preventDefault();
        const card = $(this).closest('.student-card');
        const studentData = {
            object: card.find('p').eq(0).text().split(': ')[1],
            subject: card.find('p').eq(1).text().split(': ')[1],
            grade: card.find('p').eq(2).text().split(': ')[1],
            gender: card.find('p').eq(3).text().split(': ')[1],
            area: card.find('p').eq(4).text().split(': ')[1],
            username: localStorage.getItem('username')
        };

        $.ajax({
            url: 'http://127.0.0.1:5012/register_class',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(studentData),
            success: function(response) {
                Swal.fire({
                    title: 'Đăng ký thành công!',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                }).then(() => {
                    window.location.href = 'classinfor.html?' + $.param(studentData);
                });
            },
            error: function(xhr, status, error) {
                Swal.fire({
                    title: 'Lỗi!',
                    text: 'Đã xảy ra lỗi khi đăng ký lớp. Vui lòng thử lại.',
                    icon: 'error'
                });
            }
        });
    });
});

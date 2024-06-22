$(document).ready(function() {
    function loadUsers() {
        console.log('Loading users...'); // Ghi nhật ký khi bắt đầu tải người dùng
        $.ajax({
            url: 'http://localhost:5014/users',
            method: 'GET',
            dataType: 'json',
            success: function(users) {
                console.log('Users loaded:', users); // Ghi nhật ký khi người dùng được tải thành công
                var usersTableBody = $('#usersTable tbody');
                usersTableBody.empty();
                users.forEach(function(user) {
                    var row = `<tr>
                        <td>${user.id}</td>
                        <td>${user.username}</td>
                        <td>${user.name}</td>
                        <td>${user.gender}</td>
                        <td>${user.role}</td>
                        <td>${user.area}</td>
                        <td>${user.phone}</td>
                        <td>${user.academic}</td>
                        <td><button class="btn btn-danger deleteUserBtn" data-id="${user.id}">Xóa</button></td>
                    </tr>`;
                    usersTableBody.append(row);
                });
            },
            error: function(error) {
                console.log('Error loading users:', error); // Ghi nhật ký khi có lỗi
                Swal.fire({
                    title: 'Lỗi!',
                    text: 'Lỗi khi lấy danh sách người dùng',
                    icon: 'error'
                });
            }
        });
    }

    function loadClassForms() {
        console.log('Loading class forms...'); // Ghi nhật ký khi bắt đầu tải form
        $.ajax({
            url: 'http://localhost:5014/forms',
            method: 'GET',
            dataType: 'json',
            success: function(forms) {
                console.log('Class forms loaded:', forms); // Ghi nhật ký khi form được tải thành công
                var formsTableBody = $('#classFormsTable tbody');
                formsTableBody.empty();
                forms.forEach(function(form) {
                    var row = `<tr>
                        <td>${form.id}</td>
                        <td>${form.object}</td>
                        <td>${form.subject}</td>
                        <td>${form.grade}</td>
                        <td>${form.gender}</td>
                        <td>${form.area}</td>
                        <td>${form.cond}</td>
                        <td>
                            <button class="btn btn-success approveFormBtn" data-id="${form.id}">Duyệt</button>
                            <button class="btn btn-danger deleteFormBtn" data-id="${form.id}">Xóa</button>
                        </td>
                    </tr>`;
                    formsTableBody.append(row);
                });
            },
            error: function(error) {
                console.log('Error loading class forms:', error); // Ghi nhật ký khi có lỗi
                Swal.fire({
                    title: 'Lỗi!',
                    text: 'Lỗi khi lấy danh sách form tạo lớp',
                    icon: 'error'
                });
            }
        });
    }

    $('body').on('click', '.deleteUserBtn', function() {
        var userId = $(this).data('id');
        console.log('Deleting user with ID:', userId); // Ghi nhật ký khi bắt đầu xóa người dùng
        $.ajax({
            url: `http://localhost:5014/users/${userId}`,
            method: 'DELETE',
            success: function(response) {
                console.log('User deleted:', response); // Ghi nhật ký khi xóa người dùng thành công
                Swal.fire({
                    title: 'Thành công!',
                    text: response.message,
                    icon: 'success'
                }).then(() => {
                    loadUsers();
                });
            },
            error: function(error) {
                console.log('Error deleting user:', error); // Ghi nhật ký khi có lỗi
                Swal.fire({
                    title: 'Lỗi!',
                    text: 'Lỗi khi xóa người dùng',
                    icon: 'error'
                });
            }
        });
    });

    $('body').on('click', '.approveFormBtn', function() {
        var formId = $(this).data('id');
        console.log('Approving form with ID:', formId); // Ghi nhật ký khi bắt đầu duyệt form
        $.ajax({
            url: `http://localhost:5014/forms/${formId}/approve`,
            method: 'POST',
            success: function(response) {
                console.log('Form approved:', response); // Ghi nhật ký khi duyệt form thành công
                Swal.fire({
                    title: 'Thành công!',
                    text: response.message,
                    icon: 'success'
                }).then(() => {
                    loadClassForms();
                });
            },
            error: function(error) {
                console.log('Error approving form:', error); // Ghi nhật ký khi có lỗi
                Swal.fire({
                    title: 'Lỗi!',
                    text: 'Lỗi khi duyệt form',
                    icon: 'error'
                });
            }
        });
    });

    $('body').on('click', '.deleteFormBtn', function() {
        var formId = $(this).data('id');
        console.log('Deleting form with ID:', formId); // Ghi nhật ký khi bắt đầu xóa form
        $.ajax({
            url: `http://localhost:5014/forms/${formId}`,
            method: 'DELETE',
            success: function(response) {
                console.log('Form deleted:', response); // Ghi nhật ký khi xóa form thành công
                Swal.fire({
                    title: 'Thành công!',
                    text: response.message,
                    icon: 'success'
                }).then(() => {
                    loadClassForms();
                });
            },
            error: function(error) {
                console.log('Error deleting form:', error); // Ghi nhật ký khi có lỗi
                Swal.fire({
                    title: 'Lỗi!',
                    text: 'Lỗi khi xóa form',
                    icon: 'error'
                });
            }
        });
    });

    loadUsers();
    loadClassForms();
});

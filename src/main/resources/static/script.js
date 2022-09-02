const userFetchService = {
    head: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Referer': null
    },
    findOneUser: async (id) => await fetch(`api/users/${id}`)
}

async function findAllUsers() {
    const response = await fetch(`api/users`);
    let table = $('#table-body')
    table.empty();
    if (response.ok) {
        await response.json()
            .then(users => {
                users.forEach(user => {
                    let tableFilling = `$(
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.firstName}</td>
                            <td>${user.lastName}</td>
                            <td>${user.age}</td>
                            <td>${user.email}</td>
                            <td>${user.listRoles}</td>
                            <td>
                                <button type="button" id="editButton" data-userid="${user.id}" data-action="edit" class="btn btn-outline-secondary" 
                                data-toggle="modal" data-target="#someDefaultModal">Edit</button>
                            </td>
                            <td>
                                <button type="button" id="deleteButton" data-userid="${user.id}" data-action="delete" class="btn btn-outline-danger" 
                                data-toggle="modal" data-target="#someDefaultModal">Delete</button>
                            </td>
                        </tr>
                )`;
                    table.append(tableFilling);
                })
            })
    } else {
        alert("Ошибка HTTP: " + response.status);
    }

    // обрабатываем нажатие на любую из кнопок edit или delete
    // достаем из нее данные и отдаем модалке, которую к тому же открываем
    $("#mainTable").find('button').on('click', (event) => {
        let defaultModal = $('#someDefaultModal');
        let targetButton = $(event.target);
        let userId = targetButton.attr('data-userid');
        let action = targetButton.attr('data-action');
        console.log(userId);
        console.log(action);
        defaultModal.attr('data-userid', userId);
        defaultModal.attr('data-action', action);
        action === 'edit' ? defaultModal.find('.modal-body').html(editUserModal(defaultModal, userId)) :
                                  defaultModal.find('.modal-body').html(deleteUserModal(defaultModal, userId));
        defaultModal.modal('show');
    })
}

async function deleteUserModal(defaultModal, id) {
    let preUser = await userFetchService.findOneUser(id);
    let user = preUser.json();
    defaultModal.find('.modal-title').html('Delete user modal');
    user.then(user => {
        let bodyForm = `
            <div class="container col-8 text-center">
            <form class="form-group" id="deleteUser" action="api/users/${id}" method="post">
                <label for="id"><b>ID</b></label>
                <input disabled type="text" class="form-control" id="id" name="id" value="${user.id}" disabled><br>
                <label for="firstName"><b>First Name</b></label>
                <input disabled class="form-control" type="text" id="firstName" name="firstName" value="${user.firstName}"><br>
                <label for="lastName"><b>Last Name</b></label>
                <input disabled class="form-control" type="text" id="lastName" name="lastName" value="${user.lastName}"><br>
                <label for="age"><b>Age</b></label>
                <input disabled class="form-control" id="age" type="number" name="age" value="${user.age}">
                <label for="email"><b>Email</b></label>
                <input disabled class="form-control" type="email" id="email" name="email" value="${user.email}"><br>
                <label for="password"><b>Password</b></label>
                <input disabled class="form-control" type="password" id="password" name="password" value="${user.password}"><br>
                <label for="role"><b>Roles</b></label>
                <select disabled multiple class="form-control" id="role" name="rolesList" size="2">
                       <option>ADMIN</option>
                       <option>USER</option>
                </select>
            </form>
            </div>
        `;
        defaultModal.find('.modal-body').html('');
        defaultModal.find('.modal-body').append(bodyForm);
    });
    let closeButton = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>`;
    let deleteButton = `<button type="button" class="btn btn-danger" id="deleteButton" onclick="deleteUser(${id})" data-dismiss="modal">Delete</button>`;
    defaultModal.find('.modal-footer').empty().append(deleteButton);
    defaultModal.find('.modal-footer').append(closeButton);
}

async function deleteUser(id) {
    let response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: null
    });
    let result = await response.text();
    console.log(result);
    if (response.ok) {
        await findAllUsers();
    }
}

// редактируем юзера из модалки редактирования, забираем данные, отправляем
async function editUserModal(defaultModal, id) {

    //получаем user из json
    let preUser = await userFetchService.findOneUser(id);
    let user = preUser.json();

    //заполняем модалку данными из user
    defaultModal.find('.modal-title').empty().append('Edit user modal');
    user.then(user => {
        let bodyForm = `
            <div class="container col-8 text-center">
            <div class="form-group">
            <form action="/admin/edit" id="editUserForm" name="editUserForm" method="post">
                <label for="id"><b>ID</b></label>
                <input disabled type="text" class="form-control" id="id" name="id" value="${user.id}" disabled><br>
                <label for="firstName"><b>First Name</b></label>
                <input class="form-control" type="text" id="firstName" name="firstName" value="${user.firstName}"><br>
                <label for="lastName"><b>Last Name</b></label>
                <input class="form-control" type="text" id="lastName" name="lastName" value="${user.lastName}"><br>
                <label for="age"><b>Age</b></label>
                <input class="form-control" id="age" type="number" name="age" value="${user.age}">
                <label for="email"><b>Email</b></label>
                <input class="form-control" type="email" id="email" name="email" value="${user.email}"><br>
                <label for="password"><b>Password</b></label>
                <input class="form-control" type="password" id="password" name="password" value="${user.password}"><br>
                <label for="roleEdit"><b>Roles</b></label>
                <select multiple class="form-control" id="roleEdit" name="roleEdit" size="2">
                       <option data-id="169">ADMIN</option>
                       <option data-id="170">USER</option>
                </select>
            </form>
            </div>
            </div>
        `;
        defaultModal.find('.modal-body').html('');
        defaultModal.find('.modal-body').append(bodyForm);
        //добавляем в footer кнопки сброса модалки и подтверждение внесения изменений в пользователя
        let editButton = `<button type="button" class="btn btn-outline-success" id="editButton" onclick="editUser(${id})" data-dismiss="modal">Save changes</button>`;
        let closeButton = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>`;
        defaultModal.find('.modal-footer').empty().append(editButton);
        defaultModal.find('.modal-footer').append(closeButton);
    })
}

async function editUser(id) {
    function getRoles(list) {
        let roles = [];
        if (list.indexOf("USER") >= 0) {
            roles.push({"role": "USER"});
        }
        if (list.indexOf("ADMIN") >= 0) {
            roles.push({"role": "ADMIN"});
        }
        return roles;
    }

        let data = {
            id: $("#id", "#modal-body").val(),
            firstName: $("#firstName", "#modal-body").val(),
            lastName: $("#lastName", "#modal-body").val(),
            age: $("#age", "#modal-body").val(),
            email: $("#email", "#modal-body").val(),
            password: $("#password", "#modal-body").val(),
            roles: getRoles(Array.from(document.getElementById('roleEdit').selectedOptions).map(r => r.value))
        }

    console.log(data);
    let response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    let result = await response.text();
    console.log(result);
    if (response.ok) {
        await findAllUsers();
    }
}

// что то деалем при открытии модалки и при закрытии
// основываясь на ее дата атрибутах
async function getDefaultModal() {
    $('#someDefaultModal').modal({
        keyboard: true,
        backdrop: "static",
        show: false
    }).on("show.modal", (event) => {
        let thisModal = $(event.target);
        let userid = thisModal.attr('data-userid');
        let action = thisModal.attr('data-action');
        switch (action) {
            case 'edit':
                editUser(thisModal, userid);
                break;
            case 'delete':
                deleteUser(thisModal, userid);
                break;
        }
    }).on("hidden.modal", (e) => {
        let thisModal = $(e.target);
        thisModal.find('.modal-title').html('');
        thisModal.find('.modal-body').html('');
        thisModal.find('.modal-footer').html('');
    })
}
window.onload = () => findAllUsers();
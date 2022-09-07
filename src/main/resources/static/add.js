async function addNewUser() {
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
        firstName: $("#firstName", "#newUserForm").val().trim(),
        lastName: $("#lastName", "#newUserForm").val().trim(),
        age: $("#age", "#newUserForm").val().trim(),
        email: $("#email", "#newUserForm").val().trim(),
        password: $("#password", "#newUserForm").val().trim(),
        roles: getRoles(Array.from(document.getElementById('newRole').selectedOptions).map(r => r.value))
    };
    let response = await fetch(`/api/users`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (response.ok) {
        window.location.href = '/admin';
    }
    console.log(data);
}

async function addNewUserTable() {
    let addTable = $('#toggleTableAndUsers');
    addTable.empty();

    let addTableContent = `
                <h3>Add new user </h3>
                        <div class="container col-3 text-center">
                        <form action="/admin/add" id="newUserForm" name="newUserForm" method="post">
                            <div class="form-group">
                                <label for="firstName">Firstname</label>
                                <input type="text" id="firstName" name="firstName" class="form-control">
                            </div>
                            <div class="form-group">
                                <label for="lastName">Lastname</label>
                                <input type="text" id="lastName" name="lastName" class="form-control">
                            </div>
                            <div class="form-group">
                                <label for="age">Age</label>
                                <input type="text" id="age" class="form-control">
                            </div>
                            <div class="form-group">
                                <label for="email">Email</label>
                                <input type="text" id="email" class="form-control">
                            </div>
                            <div class="form-group">
                                <label for="password">Password</label>
                                <input type="text" id="password" class="form-control">
                            </div>
                            <div class="form-group">
                                <label for="newRole">Role</label>
                                <select multiple class="form-control" name="newRole" id="newRole" size="2">
                                    <option data-id="169">ADMIN</option>
                                    <option data-id="170">USER</option>
                                </select>
                            </div>
                            <div><button type="button" class="btn btn-success" onclick="addNewUser()">Add new user</button></div>
                        </form>
                    </div>`;
    addTable.append(addTableContent);
}
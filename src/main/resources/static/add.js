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
        let response = fetch(`/api/users`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then($('#nav-tabs a[href="#nav-usersTable"]').tab('show')).then(findAllUsers)



}
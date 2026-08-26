// Redirect if logged in
/*
User Types:-
0 - Student
1 - Teacher
2 - Admin
*/
if (localStorage.getItem("loginid") != null && localStorage.getItem("password") != null) {
    if (localStorage.getItem("usertype") == "0") {
        window.location.href = "/dashboard";
    }
    if (localStorage.getItem("usertype") == "1") {
        window.location.href = "/generate-dashboard";
    }
}

// Login code
const loginid = document.getElementById("loginid");
const password = document.getElementById("password");
const submit = document.getElementById("submit");

submit.addEventListener('click', async function() {
    const response = await fetch("/get-users");
    const data = await response.json();

    var isUserValid = false;

    data.data.forEach(users => {
        if (loginid.value == users.login_id && password.value == users.password) {
            isUserValid = true;
        }
    });

    if (!isUserValid) {
        window.location.reload()
        return;
    }

    localStorage.setItem("loginid", loginid.value)
    localStorage.setItem("password", password.value)

    var user = null;

    data.data.forEach(users => {
        if (loginid.value == users.login_id && password.value == users.password) {
            user = users;
        }
    });

    

    if (user != null) {
        localStorage.setItem("username", user.name);
        localStorage.setItem("usertype", user.type_of_user);
    }
    if (user.type_of_user == 0) {
        const students = await fetch("/get-students");
        const s_data = await students.json();

        console.log(s_data);

        var student = null;

        s_data.data.forEach(s_student => {
            if (s_student.name == localStorage.getItem("username")) {
                student = s_student;
            }
        });

        if (user != null) {
            localStorage.setItem("total-cert", student.total_certificates);
        }
    }

    loginid.value = "";
    password.value = "";

    if (localStorage.getItem("usertype") == "0") {
        window.location.href = "/dashboard";
    }
    if (localStorage.getItem("usertype") == "1") {
        window.location.href = "/generate-dashboard";
    }
});

// Redirect if not logged in
if (localStorage.getItem("loginid") == null || localStorage.getItem("password") == null) {
    window.location.href = "/";
}

if (localStorage.getItem("loginid") != null && localStorage.getItem("password") != null) {
    if (localStorage.getItem("usertype") == "0" && (window.location.pathname !== "/dashboard" &&
                                                    window.location.pathname !== "/profile")) {
        window.location.href = "/dashboard";
    }
    if (localStorage.getItem("usertype") == "1" && window.location.pathname !== "/generate-dashboard") {
        window.location.href = "/generate-dashboard";
    }
}

// Profile Overview
const profile_overview = document.getElementById("profile-overview-username");

profile_overview.textContent = `${localStorage.getItem("username")}`;

// Log Out
const logout = document.getElementById("log-out");

logout.addEventListener('click', function() {
    localStorage.clear()
    window.location.reload(); 
});

// Greeting
const greeting = document.getElementById("greeting");
greeting.textContent = ` Hello ${localStorage.getItem("username")}`

// Profile Details
const profile_details = document.getElementById("profile-details");

async function update_profile_details() {
    const s_response = await fetch("/get-students");
    const s_data = await s_response.json();
    var student = null;

    s_data.data.forEach(student_user => {
        if (student_user.name == localStorage.getItem("username")) {
            student = student_user;
        }
    });

    const e_response = await fetch("/get-enrolements");
    const e_data = await e_response.json();
    var student_enrollment = null;

    e_data.data.forEach(student_enroll => {
        if (student_enroll.user == localStorage.getItem("username")) {
            student_enrollment = student_enroll;
        }
    });

    profile_details.innerHTML = `
        <h4 style="margin: 0px;">Student Information</h4>
        Name: ${student.name}<br>
        Grade: ${student.grade}${student.section}<br>
        Email: ${student_enrollment.email}<br>
        Login ID: ${localStorage.getItem("loginid")}<br>
        User Type: Student<br>
    `
}

update_profile_details();

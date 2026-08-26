// Redirect if not logged in
if (localStorage.getItem("loginid") == null && localStorage.getItem("password") == null) {
    window.location.href = "/";
}

if (localStorage.getItem("loginid") != null && localStorage.getItem("password") != null) {
    if (localStorage.getItem("usertype") == "0" && window.location.pathname !== "/dashboard") {
        window.location.href = "/dashboard";
    }
    if (localStorage.getItem("usertype") == "1" && (window.location.pathname !== "/generate-dashboard" &&
                                                    window.location.pathname !== "/generate-history" &&
                                                    window.location.pathname !== "/generate-students" &&
                                                    window.location.pathname !== "/bulk-generate" &&
                                                    window.location.pathname !== "/generate-profile")) {
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

// Profile Details
const profile_details = document.getElementById("profile-details");

async function update_profile_details() {
    const u_response = await fetch("/get-users");
    const u_data = await u_response.json();
    var teacher = null;

    u_data.data.forEach(teacher_user => {
        if (teacher_user.name == localStorage.getItem("username")) {
            teacher = teacher_user;
        }
    });

    const e_response = await fetch("/get-enrolements");
    const e_data = await e_response.json();
    var teacher_enrollment = null;

    e_data.data.forEach(teacher_enroll => {
        if (teacher_enroll.user == localStorage.getItem("username")) {
            teacher_enrollment = teacher_enroll;
        }
    });

    profile_details.innerHTML = `
        <h4 style="margin: 0px;">Student Information</h4>
        Name: ${teacher.name}<br>
        Grade: ${teacher.grade}${student.section}<br>
        Email: ${teacher_enrollment.email}<br>
        Login ID: ${localStorage.getItem("loginid")}<br>
        User Type: Student<br>
    `
}

update_profile_details();

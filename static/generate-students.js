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

// Logout
const logout = document.getElementById("log-out");

logout.addEventListener('click', function() {
    localStorage.clear()
    window.location.reload(); 
});

// Profile Overview
const profile_overview = document.getElementById("profile-overview-username");

profile_overview.textContent = `${localStorage.getItem("username")}`;

// Student List
async function certificate_history(student_table) {
    const response = await fetch("/get-students");
    const data = await response.json();
    var students_list = []

    data.data.forEach(award => {
        student_table.innerHTML += `
            <tr>
                <td style="max-width: 550px;">${award.id}</td>
                <td>${award.name}</td>
                <td>${award.grade}${award.section}</td>
                <td>${award.total_certificates}</td>
            </tr>
        `;
    })
}

const student_table = document.getElementById("students-table");

certificate_history(student_table);

// Update Total Certificates
let certificateCounts = {};

async function generateTotalCertData() {
    const history = await fetch("/get-history");
    const h_data = await history.json();

    h_data.data.forEach(award => {
        if (!certificateCounts[award.student]) {
            certificateCounts[award.student] = 0;
        }

        certificateCounts[award.student]++;
    });
}

async function postTotalCertData(student) {
    await fetch("/update-total-certificates", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            total_certificates: certificateCounts
        })
    });
}

async function init() {
    await generateTotalCertData();

    for (const student in certificateCounts) {
        await postTotalCertData(student);
    }
}

init();

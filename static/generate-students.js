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
const student_table = document.getElementById("students-table");
var student_list = {students_data: [["NO STUDENTS"]]};
const grade_select = document.getElementById("grade-select");
const section_select = document.getElementById("section-select");

grade_select.addEventListener("change", function() {
    student_table.innerHTML = `
        <tr>
            <th>Srl No.</th>
            <th>Students</th>
            <th>Grade</th>
            <th>Total Certificates</th>
        </tr>
    `
    certificate_history(student_table);
});

section_select.addEventListener("change", function() {
    student_table.innerHTML = `
        <tr>
            <th>Srl No.</th>
            <th>Students</th>
            <th>Grade</th>
            <th>Total Certificates</th>
        </tr>
    `
    certificate_history(student_table);
});

async function certificate_history(student_table) {
    const studentsResponse = await fetch("/get-students");
    const studentsData = await studentsResponse.json();

    if (student_list.students_data[0] == "NO STUDENTS") {
        student_list.students_data = studentsData;
    }

    if (grade_select.value != "all") {
        student_list.students_data = studentsData;
        if (grade_select.value == "7") {
            student_list.students_data = studentsData;
            student_list.students_data.data = student_list.students_data.data.filter(element => element.grade == "7");
            if (section_select.value == "A") {
                student_list.students_data.data = student_list.students_data.data.filter(element => element.section == "A");
            }
            if (section_select.value == "B") {
                student_list.students_data.data = student_list.students_data.data.filter(element => element.section == "B");
            }
            if (section_select.value == "C") {
                student_list.students_data.data = student_list.students_data.data.filter(element => element.section == "C");
            }
        }
        if (grade_select.value == "8") {
            student_list.students_data = studentsData;
            student_list.students_data.data = student_list.students_data.data.filter(element => element.grade == "8");
            if (section_select.value == "A") {
                student_list.students_data.data = student_list.students_data.data.filter(element => element.section == "A");
            }
            if (section_select.value == "B") {
                student_list.students_data.data = student_list.students_data.data.filter(element => element.section == "B");
            }
            if (section_select.value == "C") {
                student_list.students_data.data = student_list.students_data.data.filter(element => element.section == "C");
            }
        }
        if (grade_select.value == "9") {
            student_list.students_data = studentsData;
            student_list.students_data.data = student_list.students_data.data.filter(element => element.grade == "9");
            if (section_select.value == "A") {
                student_list.students_data.data = student_list.students_data.data.filter(element => element.section == "A");
            }
            if (section_select.value == "B") {
                student_list.students_data.data = student_list.students_data.data.filter(element => element.section == "B");
            }
            if (section_select.value == "C") {
                student_list.students_data.data = student_list.students_data.data.filter(element => element.section == "C");
            }
        }
    }
    else if (section_select != "all") {
        student_list.students_data = studentsData;
        if (section_select.value == "A") {
            student_list.students_data = studentsData;
            student_list.students_data.data = student_list.students_data.data.filter(element => element.section == "A");
        }
        if (section_select.value == "B") {
            student_list.students_data = studentsData;
            student_list.students_data.data = student_list.students_data.data.filter(element => element.section == "B");
        }
        if (section_select.value == "C") {
            student_list.students_data = studentsData;
            student_list.students_data.data = student_list.students_data.data.filter(element => element.section == "C");
        }
    }
    else {
        student_list.students_data = studentsData;
    }

    const historyResponse = await fetch("/get-history");
    const historyData = await historyResponse.json();

    const certificateCounts = {};

    historyData.data.forEach(award => {
        if (!certificateCounts[award.student]) {
            certificateCounts[award.student] = 0;
        }

        certificateCounts[award.student]++;
    });

    student_list.students_data.data.forEach((student, index) => {
        const totalCertificates = certificateCounts[student.id] || 0;

        student_table.innerHTML += `
            <tr>
                <td style="max-width: 550px;">${index+1}</td>
                <td>${student.name}</td>
                <td>${student.grade}${student.section}</td>
                <td>${totalCertificates}</td>
            </tr>
        `;
    });
}

certificate_history(student_table);

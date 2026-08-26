from flask import Flask, render_template, url_for, request, jsonify
import base64
from supabase import Client, create_client

app = Flask(__name__)

supabase: Client = create_client(
    "https://mgxpwhofrtssqitbghrn.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1neHB3aG9mcnRzc3FpdGJnaHJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMxNDYyODYsImV4cCI6MjA5ODcyMjI4Nn0.3eQhzV0I6HMed0BNLPZX6CM53dYZhpF1D9KFICOHYZo"
)

@app.route("/")
def main():
    return render_template("login.html")

@app.route("/profile")
def profile():
    return render_template("profile.html")

@app.route("/generate-profile")
def generate_profile():
    return render_template("generate-profile.html")

@app.route("/bulk-generate")
def bulk_generate():
    return render_template("generate-bulk.html")

@app.route("/get-enrolements", methods=["GET"])
def get_enrolements():
    try:
        response = supabase.table('Enrollment').select("*").order("id").execute()
        return jsonify({"data": response.data}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/update-total-certificates", methods=["POST"])
def update_total_certificates():
    try:
        data = request.get_json()

        counts = data["total_certificates"]

        for student, total in counts.items():

            response = (
                supabase.table("Students")
                .update({"total_certificates": total})
                .eq("name", student)
                .execute()
            )

        return jsonify({"message": "updated"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/generate-students")
def generate_students():
    return render_template("generate-students.html")

@app.route("/generate-history")
def generate_history():
    return render_template("generate-history.html")

@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")

@app.route("/generate-dashboard")
def generate_dashboard():
    return render_template("generate-dashboard.html")

@app.route("/update-history", methods=["POST"])
def update_history():
    try:
        data = request.get_json()

        teacher = data.get("teacher")
        student = data.get("student")
        reason = data.get("reason")

        student_response = (
            supabase.table("Students")
            .select("grade, section")
            .eq("id", student)
            .execute()
        )

        if not student_response.data:
            return jsonify({"error": "Student not found"}), 404
        
        if len(student_response.data) == 1:
            student_response.data = student_response.data[0]

        grade = student_response.data["grade"]
        section = student_response.data["section"]

        response = supabase.table("History").insert({
            "teacher": teacher,
            "student": student,
            "reason": reason,
            "grade": grade,
            "section": section
        }).execute()

        return jsonify({"message": "History updated successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/get-history", methods=["GET"])
def get_history():
    try:
        response = supabase.table('History').select("*").order("created_at", desc=True).execute()
        return jsonify({"data": response.data}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/get-teachers", methods=["GET"])
def get_teachers():
    try:
        response = supabase.table('Users').select("*").eq("type_of_user", "1").order("id").execute()
        return jsonify({"data": response.data}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/get-users", methods=["GET"])
def get_users():
    try:
        response = supabase.table('Users').select("*").eq("status", "active").order("id").execute()
        return jsonify({"data": response.data}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/get-students", methods=["GET"])
def get_students():
    try:
        response = supabase.table('Students').select("*").order("id").execute()
        return jsonify({"data": response.data}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/get-events", methods=["GET"])
def get_events():
    try:
        response = supabase.table('Events').select("*").order("id").execute()
        return jsonify({"data": response.data}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/send-email", methods=["POST"])
def send_email():
    data = request.get_json()
    image_data = data["image"]

    image_data = image_data.split(",")[1]

    image_bytes = base64.b64decode(image_data)

    msg = Message(
        subject="Your Certificate",
        sender="joelmendonca.2602@gmail.com",
        recipients=[data["email"]]
    )

    msg.body = "Congratulations!! You have recieved a certificate from Dunes International School."

    msg.attach(
        "certificate.png",
        "image/png",
        image_bytes
    )

    mail.send(msg)

    return {"Email sent successfully!"}, 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

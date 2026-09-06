import os
import smtplib
from email.message import EmailMessage
from dotenv import load_dotenv

load_dotenv()

email = EmailMessage()
email["From"] = os.getenv("SMTP_EMAIL")
email["To"] = os.getenv("SMTP_EMAIL")
email["Subject"] = "Borrow Box Test Email"
email.set_content("This is a test email from Borrow Box.")

try:
    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls()
        server.login(
            os.getenv("SMTP_EMAIL"),
            os.getenv("SMTP_PASSWORD")
        )
        server.send_message(email)

    print("✅ Email sent successfully!")

except Exception as e:
    print("❌ Email failed:", e)


export const therapistSessionMail = ({
    therapistName,
    clientName,
    clientAge,
    paymentAmount,
    transactionId,
}) => {
    return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Session Assigned</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        color: #333;
        line-height: 1.6;
      }
      .container {
        max-width: 600px;
        margin: auto;
        padding: 20px;
        border: 1px solid #eee;
        border-radius: 8px;
        background: #fafafa;
      }
      h2 {
        color: #4CAF50;
      }
      ul {
        padding-left: 20px;
      }
      .footer {
        margin-top: 20px;
        font-size: 14px;
        color: #555;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <p>Dear <strong>${therapistName}</strong>,</p>
      <p>A session has been assigned to you. Kindly review the details below:</p>

      <h2>Client Information:</h2>
      <ul>
        <li><strong>Full Name:</strong> ${clientName}</li>
        <li><strong>Age:</strong> ${clientAge}</li>
        <li><strong>Payment:</strong> ₹${paymentAmount}</li>
        <li><strong>Transaction ID:</strong> ${transactionId}</li>
      </ul>

      <h2>Important Instructions:</h2>
      <ul>
        <li>Log in to your dashboard and verify the transaction.</li>
        <li>View client details directly from the dashboard before the session.</li>
        <li>At the start, collect the client’s PIN and update it in your dashboard.</li>
        <li>After completing the session, please click on the “End” button to submit it.</li>
      </ul>

      <p>Thank you for your continued support and professionalism.</p>

      <div class="footer">
        <p>Warm regards,<br/>
        <strong>Choose Your Therapist LLP</strong><br/>
        Support Team</p>
      </div>
    </div>
  </body>
  </html>
  `;
};


export const bookingConfirmationMail = ({
    clientName,
    therapistName,
    clientAge,
    paymentStatus,
    transactionId,
}) => {
    return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Booking Confirmation</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        color: #333;
        line-height: 1.6;
      }
      .container {
        max-width: 600px;
        margin: auto;
        padding: 20px;
        border: 1px solid #eee;
        border-radius: 8px;
        background: #fafafa;
      }
      h2 {
        color: #4CAF50;
      }
      ul {
        padding-left: 20px;
      }
      ol {
        padding-left: 20px;
      }
      .footer {
        margin-top: 20px;
        font-size: 14px;
        color: #555;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <p>Dear <strong>${clientName}</strong>,</p>
      <p>Your therapy session has been successfully booked. Please find your session details below:</p>

      <h2>Booking Details:</h2>
      <ul>
        <li><strong>Therapist:</strong> ${therapistName}</li>
        <li><strong>Your Full Name:</strong> ${clientName}</li>
        <li><strong>Age:</strong> ${clientAge}</li>
        <li><strong>Payment Status:</strong> ${paymentStatus}</li>
        <li><strong>Transaction ID:</strong> ${transactionId}</li>
      </ul>

      <h2>Important Instructions for You:</h2>
      <ol>
        <li>Log in to your dashboard to check the booking and verify your payment status.</li>
        <li>You will find a unique PIN number in your dashboard. Please share this PIN with your therapist at the beginning of your session.</li>
        <li>Your therapist will update the session details once it is completed.</li>
      </ol>

      <p>If you face any issues with your booking or dashboard, feel free to reach out to our support team.</p>

      <div class="footer">
        <p>Warm regards,<br/>
        <strong>Choose Your Therapist LLP</strong><br/>
        Support Team</p>
      </div>
    </div>
  </body>
  </html>
  `;
};



export const newSessionAdminMail = ({
    clientName,
    clientAge,
    paymentAmount,
    transactionId,
    therapistName,
    therapistId,
}) => {
    return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>New Session Booked</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        color: #333;
        line-height: 1.6;
      }
      .container {
        max-width: 600px;
        margin: auto;
        padding: 20px;
        border: 1px solid #eee;
        border-radius: 8px;
        background: #fafafa;
      }
      h2 {
        color: #4CAF50;
      }
      ul {
        padding-left: 20px;
      }
      .footer {
        margin-top: 20px;
        font-size: 14px;
        color: #555;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <p>Dear <strong>Choose Your Therapist Team</strong>,</p>
      <p>A new session has been booked on the platform. Below are the details for your reference:</p>

      <h2>Client Information:</h2>
      <ul>
        <li><strong>Full Name:</strong> ${clientName}</li>
        <li><strong>Age:</strong> ${clientAge}</li>
        <li><strong>Payment Status:</strong> ₹${paymentAmount}</li>
        <li><strong>Transaction ID:</strong> ${transactionId}</li>
      </ul>

      <h2>Therapist Information:</h2>
      <ul>
        <li><strong>Name:</strong> ${therapistName}</li>
        <li><strong>Therapist ID Code:</strong> ${therapistId}</li>
      </ul>

      <p>Thank you,</p>

      <div class="footer">
        <p><strong>Choose Your Therapist LLP</strong><br/>
        Support Team</p>
      </div>
    </div>
  </body>
  </html>
  `;
};


export const therapistText = (isBookingDetail,transactionId) => `
Dear ${isBookingDetail.therapist.user.name},

A session has been assigned to you.
Client: ${isBookingDetail.client.name}, Age: ${isBookingDetail.client.age || "N/A"}
Payment: ₹${isBookingDetail.amount}, Transaction ID: ${transactionId}

Check your dashboard for details and update session status after completion.

Choose Your Therapist LLP
Support Team
`;

export const clientText = (isBookingDetail,transactionId) => `
Dear ${isBookingDetail.client.name},

Your session with ${isBookingDetail.therapist.user.name} has been booked.
Payment: ₹${isBookingDetail.amount}, Transaction ID: ${transactionId}

Check your dashboard for your PIN and session details.

Choose Your Therapist LLP
Support Team
`;

export const adminText = (isBookingDetail,transactionId) => `
New session booked:

Client: ${isBookingDetail.client.name}, Age: ${isBookingDetail.client.age || "N/A"}
Payment: ₹${isBookingDetail.amount}, Transaction ID: ${transactionId}

Therapist: ${isBookingDetail.therapist.user.name}, ID: ${isBookingDetail.therapist._id}

Choose Your Therapist LLP
Support Team
`;

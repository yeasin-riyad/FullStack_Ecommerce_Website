export const forgotPasswordEmailTemplate = ({ name, otp }) => {
    return `
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            width: 100%;
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          h1 {
            color: #333;
            text-align: center;
          }
          h2 {
            color: #4caf50;
            text-align: center;
            font-size: 32px;
            padding: 10px;
            margin: 20px 0;
            background-color: #e0f7e3;
            border-radius: 8px;
            font-weight: bold;
          }
          p {
            color: #555;
            line-height: 1.6;
            font-size: 16px;
          }
          .footer {
            font-size: 14px;
            color: #888;
            text-align: center;
            margin-top: 20px;
          }
          .otp-section {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
            border: 1px solid #ddd;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Hello ${name},</h1>
          <p>We received a request to reset your password. Please use the following one-time password (OTP) to complete the process. This OTP is valid for 1 hour:</p>
          <div class="otp-section">
            <h2>${otp}</h2>
          </div>
          <p>If you did not request this password reset, please ignore this email.</p>
          <p>Thank you!</p>
          <div class="footer">
            <p>Sincerely, NextBuy-The Next Generation E-Commerce Solution.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };
  
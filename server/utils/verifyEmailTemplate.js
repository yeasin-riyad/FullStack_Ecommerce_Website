const verifyEmailTemplate=({name,url})=>{
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Verify Your Email</title>
    </head>
    <body>
        <h1>Welcome to NextBuy-The Next Generation E-Commerce Solution.!</h1>
        <p>Dear ${name},</p>
        <p>Thank you for signing up for our website. To verify your email, please click the link below:</p>
        <a style="color:white;background:blue;margin-top:10px" href="${url}">Verify Email</a>
        <p>If you did not sign up for our website, please ignore this email.</p>
    </body>
    </html>
    `
}

export default verifyEmailTemplate;
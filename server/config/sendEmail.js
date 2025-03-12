import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

if(!process.env.RESEND_API){
    console.log("Missing RESEND_API to the environment variable");
  
}


const resend = new Resend(process.env.RESEND_API);

const sendEmail=async({sendTo,subject,html}) => {
    try{
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: [sendTo],
            subject,
            html,
        });
        console.log(`Email sent to ${sendTo}`);
    } catch(error){
        console.error(`Error sending email to ${sendTo}:`, error);
    }
}


export default sendEmail;




import { resendClient, sender } from "../lib/resend.js"
import { createWelcomeEmailTemplate } from "./emailTemplates.js"

export const sendWelcomeEmail = async (email, name, clientUrl) => {
  const {data, error} = await resendClient.emails.send({
    from: `${sender.name} <${sender.email}>`,
    to: email,
    subject: "Welcome to Chatify!",
    html: createWelcomeEmailTemplate(name, clientUrl)
  })

  if (error) {
    throw new Error(`Failed to send welcome email ${error.message}`);
  } else {
    console.log("Welcome email sent:", data);
  }
}
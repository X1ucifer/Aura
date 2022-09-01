const accountSid = process.env.accountSid;
const authToken = process.env.authToken;
const client = require('twilio')(accountSid, authToken);
exports.send_sms = (message, phone_no, otp) => {
  try {
    client.messages
      .create({
        messagingServiceSid: process.env.messagingServiceSid,
        body: `${message} ${otp}`,
        to: phone_no
      })
      .then(message => console.log(message.sid))
      .done();
  }catch(err){
    console.log(err)
  }
}
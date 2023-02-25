const { pool } = require("../Configuration/db");
const { getAsBoolean, AuraMessage, AuraResponse } = require("../utils/auraUtils/Aura");
const errorMessage = require("../utils/messages/errorMessages");
const authQuery = require("../utils/SQL/SQLQuery");
var otpGenerator = require("otp-generator");
const Message = require("../utils/messages/messages");
const AuraConstants = require("../utils/auraUtils/AuraConstants");
const { httpStatusCodes, ApiError } = require("../utils/auraUtils/AuraError");
const accountSid = process.env.accountSid;
const authToken = process.env.authToken;
const client = require("twilio")(accountSid, authToken);
const localStorage = require("local-storage");

function isOTPValid(phone_number, otp)
{
    let getLocalStorage = localStorage.get(phone_number);
    let otpDetails = JSON.parse(getLocalStorage);
    let current_time = new Date().getTime();

    if (!getLocalStorage || getAsBoolean(otpDetails) || otpDetails.expiry_time < current_time)
    {
        return errorMessage.OTP_EXPIRED;
    }

    if (otp !== otpDetails.otp)
    {
        return AuraMessage.getMessage("OTP", errorMessage.INVALID);
    }

    return null;
}

async function getUserID(phone_number)
{
    let user = await pool.query(authQuery.GET_USER, [phone_number]);
    return new Promise((resolve, reject) => resolve(user.rowCount !== 0 ? user.rows[0].userid : null));
}

async function generateOTP(phone_number)
{
    let get_user, otp, now, item;
    try {

        if (localStorage.get(phone_number))
        {
            localStorage.remove(phone_number);
        }
        console.log(localStorage.get(phone_number));

        get_user = await pool.query(authQuery.GET_USER, [phone_number]); // searching users
        otp = otpGenerator.generate(6, {
            lowerCaseAlphabets: false,
            specialChars: false,
            upperCaseAlphabets: false
        });// generate otp

        now = new Date();
        item = { otp: otp, expiry_time: now.getTime() + AuraConstants.FIVE_MIN };// set the otp expiry time
        localStorage.set(phone_number, JSON.stringify(item));

        // Send otp using TIWILO
        let responseMessage = get_user.rows.length === 0 ? Message.SIGNUP_OTP_EXPIRE : Message.LOGIN_OTP_EXPIRE;
        return new Promise((resolve, reject) => resolve([responseMessage, otp]));
    }
    catch (err)
    {
        throw new ApiError("Error", AuraMessage.getMessage(err, errorMessage.ERROR_FROM_SERVER), httpStatusCodes.BAD_REQUEST);
    }
}

// Sends OTP
async function sendOTP(responseMessage, otp, phone_no)
{
    try
    {
        const response = await client.messages.create({ messagingServiceSid: process.env.messagingServiceSid, body: `${responseMessage} ${otp}`, to: phone_no })
            .then((message) => console.log(message.sid));
        
        console.log("Response:" + response );
    }
    catch (err)
    {
        throw new ApiError("Error", AuraMessage.getMessage(err, errorMessage.ERROR_SENDING_OTP), httpStatusCodes.INTERNAL_SERVER);
    }
}

async function generateAndSendOTP(res, phone_number)
{
    var [responseMessage, otp] = await generateOTP(phone_number);
    await sendOTP(responseMessage, otp, phone_number);
    AuraResponse(res, httpStatusCodes.OK, Message.SUCCESS, Message.OTP_SUCCESSFULL);
}


module.exports = {isOTPValid, getUserID, generateOTP, sendOTP, generateAndSendOTP}
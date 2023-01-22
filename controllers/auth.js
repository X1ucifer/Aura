const localStorage = require("local-storage");
const jwt = require("jsonwebtoken");
const {v4: uuid_v4} = require("uuid");
const {pool} = require("../Configuration/db");
const {httpStatusCodes, ApiError, AuraException} = require("../utils/auraUtils/AuraError");
const authQuery = require("../utils/SQL/SQLQuery");
const errorMessage = require("../utils/messages/errorMessages");
const Message = require("../utils/messages/messages");
const { AuraResponse } = require("../utils/auraUtils/Aura");
const { isOTPValid, getUserID, generateAndSendOTP } = require("./authUtils");

exports.signup = async (req, res) => {
    let body = req.body;
    let phone_number = body.phone_no;

    try
    {
        if (await getUserID(phone_number))
        {
            return AuraResponse(res, httpStatusCodes.OK, Message.SUCCESS, Message.ALREADY_REGISTERED);
        }
        generateAndSendOTP(res, phone_number);
    }
    catch(er)
    {
        console.log(er.message);
        new AuraException(res, er, httpStatusCodes.BAD_REQUEST, er.message);
    }
    finally
    {
        console.log("Api Ended!")
    }
};

exports.register = async (req, res) => {
    let body = req.body;
    let otp = body.otp;
    let phone_number = body.phone_no;
    let current_time = new Date().getTime();

    try
    {
        // validation

        if (await getUserID(phone_number))
        {
            return AuraResponse(res, httpStatusCodes.OK, Message.SUCCESS, Message.ALREADY_REGISTERED);
        }
        let isOtpNotValid = isOTPValid(phone_number, otp);
        if (isOtpNotValid)
        {
            throw new ApiError("Error", isOtpNotValid, httpStatusCodes.BAD_REQUEST);
        }

        // Inserting into DB starts

        await pool.query('BEGIN');

        let user_id = uuid_v4();
        await pool.query(authQuery.CREATE_USER, [user_id, phone_number, current_time, current_time]);
        await pool.query(authQuery.CREATE_LOGIN_FOR_USER, [uuid_v4(), user_id])
        localStorage.remove(phone_number);
        
        await pool.query('COMMIT');
        AuraResponse(res, httpStatusCodes.CREATED, Message.SUCCESS, Message.REGISTERED_SUCCESS);

    }
    catch (er)
    {
        await pool.query('ROLLBACK');
        console.log(er.message);
        new AuraException(res, er, httpStatusCodes.BAD_REQUEST, er.message);
    }
    finally
    {
        console.log("Api Ended!");
    }
}

exports.login = async (req, res) => {
    let body = req.body;
    let phone_number = body.phone_no;

    try
    {
        if (!await getUserID(phone_number))
        {
            throw new ApiError("Error", errorMessage.USER_NOT_FOUND, httpStatusCodes.NOT_FOUND);
        }
        generateAndSendOTP(res, phone_number);
    }
    catch(er)
    {
        console.log(er.message);
        new AuraException(res, er, httpStatusCodes.BAD_REQUEST, er.message);
    }
    finally
    {
        console.log("Api Ended!")
    }

}

exports.verify = async (req, res) => {
    let body = req.body;
    let otp = body.otp;
    let phone_number = body.phone_no;
    let userID;
    
    try
    {
        userID = await getUserID(phone_number);
        let successResponse = {};
        successResponse.data = [];

        // Validation
        if (!userID)
        {
            throw new ApiError("Error", errorMessage.USER_NOT_FOUND, httpStatusCodes.BAD_REQUEST);
        }

        let isOtpNotValid = isOTPValid(phone_number, otp);
        if (isOtpNotValid)
        {
            await pool.query(authQuery.INVALID_LOGIN_ATTEMPT, [new Date().getTime(), userID]);
            throw new ApiError("Error", isOtpNotValid, httpStatusCodes.BAD_REQUEST);
        }

        token = jwt.sign({ _id: userID }, process.env.JWT_SECRET, { expiresIn: "7d" });
        successResponse.data.push(token);

        // Inserting into DB Starts
        await pool.query(authQuery.SUCCESSFULL_LOGIN_ATTEMPT, [userID]);
        localStorage.remove(phone_number);

        AuraResponse(res, httpStatusCodes.OK, Message.SUCCESS, successResponse);
    }
    catch (er)
    {
        console.log(er.message);
        new AuraException(res, er, httpStatusCodes.BAD_REQUEST, er.message)
    }
    finally
    {
        console.log("Api Ended");
    }

     // return user and token to client, exclude hashed password
        // send token in cookie
        // res.cookie("token", token, {
        //     httpOnly: true,
        //     // secure: true, // only works on https
        // });
};

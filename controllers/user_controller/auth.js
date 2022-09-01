const localStorage = require('local-storage');
var otpGenerator = require('otp-generator');
const jwt = require('jsonwebtoken');
const  pool  = require("../../db");
const { send_sms } = require("../../components/sendotp");

exports.signup = async (req, res) => {
    let errors = {}
    let body = req.body;
    let bodykeys = Object.keys(body);
    if (typeof body === 'string') {
        try {
            body = JSON.parse(body);
        }
        catch (err) {
            if (!errors.action) {
                errors.action = [];
            }
            errors.action.push('Unable to parse request body. ' + err.message);
        }
    }
    if (Object.keys(errors).length === 0) {
        if (bodykeys.includes('phone_no')) {
            let phone_no = body.phone_no;
            if (isNaN(phone_no)) {
                errors.phone = []
                errors.phone.push('Phone number does not been empty')
            }
        } else {
            errors.phone = []
            errors.phone.push("Phone number is required")
        }
    }

    let search_users,otp,now,item

    if (Object.keys(errors).length === 0) {
        try {
            phone_no  = req.body.phone_no;
            if (localStorage.get(req.body.phone_no)) {
                localStorage.remove(req.body.phone_no)
            }
            console.log(localStorage.get(req.body.phone_no))
            search_users = await pool.query(`SELECT * FROM user_table WHERE phone_no='${phone_no}'`); // searching users
            otp = otpGenerator.generate(6, { lowerCaseAlphabets: false, specialChars: false, upperCaseAlphabets: false }); // generate otp;
            now = new Date()
            item = {
                otp: otp,
                expiry: now.getTime() + 300000,//set the otp expiry time 
            }
            localStorage.set(phone_no, JSON.stringify(item))
            if (search_users.rows.length == 0) {
                // Sending otp using twilio
                try {
                    send_sms("Your OTP will expired with in 1 min", phone_no, otp)
                } catch (err) {
                    errors.sendotp = []
                    errors.sendotp.push(`Error while sending OTP :: ${err}`)
                }
            } else {
                try {
                    send_sms("Welcome Back Your OTP will expired with in 1 min", phone_no, otp)
                } catch (err) {
                    errors.sendotp = []
                    errors.sendotp.push(`Error while sending OTP :: ${err}`)
                }
            }
        } catch (err) {
            console.log(err)
            errors.servererror = []
            errors.servererror.push(`Error from server while send otp :: ${err}`)
        }
    }
    if (Object.keys(errors).length === 0) {
        res.status(200).json({status: 'Sucess',data: 'OTP send successfully'})

    } else {
        res.status(400).json({ status: "ERROR", errors: errors })
    }

}

exports.login = async (req, res) => {
    let errors = {}
    let body = req.body
    if (typeof body === 'string') {
        try {
            body = JSON.parse(body);
        }
        catch (err) {
            if (!errors.action) {
                errors.action = [];
            }
            errors.action.push('Unable to parse request body. ' + err.message);
        }
    }
    let phone_no,otp,bodykeys
    if (Object.keys(errors).length === 0) {
        phone_no = body.phone_no;
        otp = body.otp;
        bodykeys = Object.keys(body)
        if (bodykeys.includes('phone_no') || Object.includes('otp')) {
            if (phone_no.length < 13 || phone_no.length > 16) {
                errors.phone = []
                errors.phone.push('Length of phone number should not exceed 16 digit or it does not less then 13 digit')
            }
            if (isNaN(phone_no)) {
                errors.phone = []
                errors.phone.push('Phone number does not been empty')
            }
            if (isNaN(otp)) {
                errors.otp = []
                errors.otp.push('OTP is required')
            }
            if (!(otp.length === 6)) {
                errors.otp = []
                errors.otp.push('OTP must 6 digit')
            }
        } else {
            errors.phone = []
            errors.phone.push("Phone number and OTP is required")
        }
    }
    let success,itemStr,search_users,item,now,valid_otp,user_id,
    current_datetime,logins_query,logins_values,users_query,users_values,token,loginattempts,invalidloginattempts;
    if (Object.keys(errors).length === 0) {
        try {
            success = {}
            phone_no = req.body.phone_no;
            otp = req.body.otp;
            search_users = await pool.query(`SELECT * FROM users WHERE phone='${phone_no}'`); // searching users

            itemStr = localStorage.get(phone_no)
            if (!itemStr) {
                success.otp_expire = []
                success.otp_expire.push('OTP is expired')
            }
            item = JSON.parse(itemStr)
            if (item === null) {
                errors.null = []
                errors.null.push('OTP is expired')
            } else {
                now = new Date()
                if (now.getTime() > item.expiry) {
                    // If the item is expired, delete the item from storage
                    // and return null
                    localStorage.remove(phone_no)
                    success.otp_expire = []
                    success.otp_expire.push('OTP is expired')
                }
                valid_otp = localStorage.get(phone_no);
                json_otp = JSON.parse(valid_otp);
                if (search_users.rows.length == 0) {
                    if (json_otp.otp === req.body.otp) { // if otp is matched then statement is execute
                        // User logins query
                        user_id = uuid_v4() // user id in Users Table and logins Table
                        current_datetime = new Date().getTime()
                        logins_query = `
                INSERT INTO logins (id,userid, successfullogin)
                VALUES ($1, $2, $3)
            `;
                        logins_values = [uuid_v4(), user_id, current_datetime]
                        users_query = `
                INSERT INTO users (id,phone,createdat,updatedat)
                VALUES ($1,$2,$3,$4)
                RETURNING *
            `
                        await pool.query(logins_query, logins_values);
                        users_values = [user_id, phone_no, current_datetime, current_datetime]
                        users_data = await pool.query(users_query, users_values);

                        token = jwt.sign({ _id: user_id }, process.env.JWT_SECRET, {
                            expiresIn: "7d",
                        });
                        // return user and token to client, exclude hashed password
                        // send token in cookie
                        res.cookie("token", token, {
                            httpOnly: true,
                            // secure: true, // only works on https
                        });
                        // send user as json response
                        users_data_rows = users_data.rows
                        console.log(users_data_rows)
                        users_data_rows[0].id = undefined;
                        localStorage.remove(phone_no)
                        success.success_json = []
                        success.success_json.push(users_data_rows)
                    } else {
                        errors.incorrect_otp = []
                        errors.incorrect_otp.push('OTP is worng')
                    }
                }

                else {
                    if (json_otp.otp === req.body.otp) {
                        // console.log(search_users.rows[0].id)
                        token = jwt.sign({ _id: search_users.rows[0].id }, process.env.JWT_SECRET, {
                            expiresIn: "7d",
                        });
                        // return user and token to client, exclude hashed password
                        // send token in cookie
                        res.cookie("token", token, {
                            httpOnly: true,
                            // secure: true, // only works on https
                        });
                        // send user as json response

                        localStorage.remove(phone_no)
                        await pool.query(`UPDATE logins
                SET invalidloginattempt = 0
                WHERE userid = '${search_users.rows[0].id}';`)
                        users_data_rows = search_users.rows
                        // users_data_rows[0].id = undefined;
                        return res.json({
                            status: 'sucess',
                            message: users_data_rows
                        });
                    } else {
                        loginattempts = await pool.query(`SELECT * FROM logins WHERE userid ='${search_users.rows[0].id}'`)
                        await pool.query(`UPDATE logins
        SET invalidloginattempt = ${loginattempts.rows[0].invalidloginattempt + 1}
        WHERE userid = '${search_users.rows[0].id}';`)
                        invalidloginattempts = search_users.rows[0].invalidloginattempts + 1
                        const failed_login_date = new Date().getTime()
                        await pool.query(`UPDATE logins
                SET failedlogin =  '${failed_login_date}'
                WHERE userid = '${search_users.rows[0].id}';`)
                        errors.incorrect_otp = []
                        errors.incorrect_otp.push('OTP is worng')
                    }

                }
            }
        } catch (err) {
            console.log(err)
            errors.servererror = []
            errors.servererror.push(`Error in server while check the otp :: ${err}`)
        }

    }
    if (Object.keys(errors).length === 0) {
        res.status(200).json({ status: "SUCCESS", data: success })
    } else {
        res.status(400).json({ status: "Failed", errors: errors })
    }
}
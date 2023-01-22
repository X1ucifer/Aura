const authQuery = 
{
    GET_USER: `SELECT * FROM users WHERE phone = $1 ;`,
    CREATE_USER: `INSERT INTO users (userid,phone,createdat,updatedat) VALUES ($1,$2,$3,$4) ;`,
    CREATE_LOGIN_FOR_USER: `INSERT INTO logins (id,userid) VALUES ($1, $2) ;`,
    INVALID_LOGIN_ATTEMPT: `UPDATE logins SET invalidloginattempt = invalidloginattempt + 1, failedlogindate = $1 WHERE userid = $2 ;`,
    SUCCESSFULL_LOGIN_ATTEMPT: `UPDATE logins SET successfullogin = successfullogin + 1 WHERE userid = $1 ;`,
}

module.exports = authQuery;
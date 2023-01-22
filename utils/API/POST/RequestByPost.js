const PostAPI =
{
    '/api/signup':
    {
        api: '/api/signup',
        method: 'POST',
        param:
        {
            phone_no:
            {
                min_len: 10,
                max_len: 15,
                required: true,
                type: 'string'
            },
        }
        
    },
    '/api/signup/register':
    {
        api: '/api/signup/register',
        method: 'POST',
        param:
        {
            phone_no:
            {
                min_len: 10,
                max_len: 15,
                required: true,
                type: 'string'
            },
            otp:
            {
                min_len: 6,
                max_len: 6,
                required: true,
                type: 'string'
            }
        }
    },
    '/api/login':
    {
        api: '/api/login',
        method: 'POST',
        param:
        {
            phone_no:
            {
                min_len: 10,
                max_len: 15,
                required: true,
                type: 'string'
            },
        }
    },
    '/api/login/verify' :
    {
        api: '/api/login/verify',
        method: 'POST',
        param:
        {
            phone_no:
            {
                min_len: 10,
                max_len: 15,
                required: true,
                type: 'string'
            },
            otp:
            {
                min_len: 6,
                max_len: 6,
                required: true,
                type: 'string'
            }
        }
    },

}

module.exports = PostAPI;
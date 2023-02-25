class AuraMessage
{
    getMessage()
    {
        var singleParam = (node, message) =>
        {
            return message.replace(/{[0]}/gi, () => node);
        };
        var multipleParam = (node, message) =>
        {
            for (var i = 0; i < node.length; ++i)
            {
                var regex = new RegExp("\\{" + i + "\\}", "gi");
                message = message.replace(regex, () => node[i]);
            }
            return message;
        }
        if (Array.isArray(arguments[0]))
        {
            return multipleParam(arguments[0], arguments[1]);
        }
        return singleParam(arguments[0], arguments[1]);
    }
}

class SqlQuery
{
    getSQLQuery()
    {
        var singleParam = (node, message) =>
        {
            return message.replace(/{[0]}/gi, () => node);
        };
        var multipleParam = (node, message) =>
        {
            for (var i = 0; i < node.length; ++i)
            {
                var regex = new RegExp("\\{" + i + "\\}", "gi");
                message = message.replace(regex, () => node[i]);
            }
            return message;
        }
        if (Array.isArray(arguments[0]))
        {
            return multipleParam(arguments[0], arguments[1]);
        }
        return singleParam(arguments[0], arguments[1]);
    }
}

function AuraResponse(res, statusCode, status, data)
{
    res.status(statusCode).json({status, data});
}


function getAsBoolean(object)
{
    return object === true || object === "true";
}

function isEmpty(object)
{
    return !(object !== undefined && object !== null && object.length !== 0 && object !== "");
}

function isNotEmpty(object)
{
    return object !== undefined && object !== null && object.length !== 0 && object !== "";
}

module.exports =
{
    getAsBoolean,
    isEmpty,
    isNotEmpty,
    AuraMessage: new AuraMessage(),
    SqlQuery: new SqlQuery(),
    AuraResponse
}
const AuraConstants = require("../utils/auraUtils/AuraConstants");
const errorMessage = require("../utils/messages/errorMessages");
const { AuraMessage } = require("../utils/auraUtils/Aura");
const { AuraException, httpStatusCodes } = require("../utils/auraUtils/AuraError");
const Request = require("../utils/API/Requests");

var preRequestValidation = function (req, res, next)
{
    console.log("API validation started...");
    const ApiParams = Request.getApiParams(req);

    if (!ApiParams)
    {
        return new AuraException(res, "Error", httpStatusCodes.BAD_REQUEST, errorMessage.INVALID_URL);
    }
    const params = ApiParams.param;
    const body = req.body;

    for (const node in body)
    {
        // If there is an extra param in response object throw error
        if (!params[node])
        {
            return new AuraException(res, "Error", httpStatusCodes.BAD_REQUEST, "Extra Param Found");
        }

        const paramAttribute = params[node];

        // If the node is required
        if (paramAttribute[AuraConstants.REQUIRED] && !body[node])
        {
            return new AuraException(res, "Error", httpStatusCodes.BAD_REQUEST, AuraMessage.getMessage(node, errorMessage.REQUIRED));
        }

        // If the node is optional no need to validate
        if (!paramAttribute[AuraConstants.REQUIRED] && !body[node])
        {
            continue;
        }

        // Check the node type
        if (!(typeof body[node] === paramAttribute[AuraConstants.TYPE]))
        {
            return new AuraException(res, "Error", httpStatusCodes.BAD_REQUEST, AuraMessage.getMessage(node, errorMessage.INVALID_DATA_TYPE));
        }

        // Check the node length if it is less
        if (body[node].toString().length < paramAttribute[AuraConstants.MIN_LEN])
        {
            return new AuraException(res, "Error", httpStatusCodes.BAD_REQUEST, AuraMessage.getMessage([node, paramAttribute[AuraConstants.MIN_LEN]], errorMessage.MIN_LEN));
        }

        // Check the node length if it is greater
        if (body[node].toString().length > paramAttribute[AuraConstants.MAX_LEN])
        {
            return new AuraException(res, "Error", httpStatusCodes.BAD_REQUEST, AuraMessage.getMessage([node, paramAttribute[AuraConstants.MAX_LEN]], errorMessage.MAX_LEN));
        }

    }

    next();
}

module.exports = preRequestValidation;
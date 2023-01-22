const DeleteAPI = require("./DELETE/RequestByDelete");
const GetAPI = require("./GET/RequestByGET");
const PostAPI = require("./POST/RequestByPost");
const PutAPI = require("./PUT/RequestByPut");

let instance;

class RequestClass
{
    constructor()
    {
        if (instance)
        {
            console.log("Trying to create Instance");
            throw new Error("New instance of Request cannot be created!!");
        }
        instance = this;
    }

    getApiParams(req)
    {
        switch (req.method)
        {
            case "GET":
                return GetAPI[req.url];
            case "POST":
                return PostAPI[req.url];
            case "PUT":
                return PutAPI[req.url];
            case "DELETE":
                return DeleteAPI[req.url];
            default:
                throw new Error("Invalid API Method!");
        }
    }
}

const Request = Object.freeze(new RequestClass());

module.exports = Request;
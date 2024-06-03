exports.handler = async (event) => {
    const { requestContext: { http: { method, path } } } = event;
    if(method === "GET" && path === "/hello") {
        return ({
            statusCode: 200,
            body: "{\"statusCode\": 200, \"message\": \"Hello from Lambda\"}"
        });
    }
    return({
        statusCode: 400,
        body: `{"statusCode": 400, "message": "Bad request syntax or unsupported method. Request path: ${path}. HTTP method: ${method}"}`
    });
};

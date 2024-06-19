module.exports = {
  success: (data) => {
    return {
      statusCode: 200,
      body: JSON.stringify(data),
      headers: {
        "Access-Control-Allow-Origin": "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
      },
    };
  },
  error: (message) => {
    return {
      statusCode: 500,
      body: JSON.stringify(message),
      headers: {
        "Access-Control-Allow-Origin": "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
      },
    };
  },
};

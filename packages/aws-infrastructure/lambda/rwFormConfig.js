exports.handler = async function(event) {
  console.log("request:", JSON.stringify(event, undefined, 2));

  let response = {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
  };

  const form = {
    id: 123,
    name: "my-form",
    values: {
      nudges: [1, 2, 3, 4],
      regularNudges: [1, 2, 3, 4]
    },
    email: true
  };
  
  let body = {
    message: "nothing"
  };

  if (event.httpMethod === "GET") {
    if (event.path === "/forms") {
      body = {
        content: form
      };  
    } else {
      body = {
        message: "this path is not supported yet"
      };
    }
  } else if (event.httpMethod === "POST") {
    body = {
      message: "POST is not yet supported"
    };
  } else {
    body = {
      message: "Unknown method and path"
    };
  }

  return {
    ...response,
    body: JSON.stringify(body),
  };
};

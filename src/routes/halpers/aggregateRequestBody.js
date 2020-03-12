async function aggregateRequestBody(req) {
  let body = "";

  req.on("data", chunk => {
    body += chunk.toString();
  });

  return new Promise((res, rej) => {
    req.on("end", () => {
      res(body);
    });

    req.on("abort", () => {
      rej();
    });
  });
}

module.exports = aggregateRequestBody;

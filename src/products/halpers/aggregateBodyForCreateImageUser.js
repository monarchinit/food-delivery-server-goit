const formidable = require("formidable")

const aggregateBodyForCreateImageUser=(req, res, next)=> {
    const form = formidable({
      multiples: true,
      uploadDir: __dirname + "../../../../static",
      keepExtensions: true
    });
    form.parse(req, (err, fields, files) => {
      if (err) {
        next(err);
        return;
      }

      req.body = {
        ...fields,
        ...files
      };

      next();
    });
  }

  module.exports = aggregateBodyForCreateImageUser
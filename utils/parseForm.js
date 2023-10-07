import formidable from "formidable";

export function parseForm(req) {
  return new Promise((resolve, reject) => {
    const form = formidable({
      keepExtensions: true,
      uploadDir: "./public/uploads",
    });
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      const data = { field: fields, file: files };
      resolve(data);
    });
  });
}

export function parseFormMultiple(req) {
  return new Promise((resolve, reject) => {
    const form = formidable({
      multiples: true,
      keepExtensions: true,
      uploadDir: "./public/uploads",
    });
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);



      const data = { field: fields, file: files };

      resolve(data);
    });
  });
}

export function linkToFile({ req, file }) {
  return `${req.protocol}://${req.headers.host}/view/${file}`;
}

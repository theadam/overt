export const collector = () => {
  const results = [];
  const cb = v => results.push(v);
  cb.results = results;
  return cb;
}

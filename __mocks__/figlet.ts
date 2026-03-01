export const textSync = (t) => console.log(t);
export const text = (t, cb) => cb(null, t);
export default { textSync, text };
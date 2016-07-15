import { share } from './transformers';

export const values = array => cb => {
  array.forEach(v => cb(v));
  return () => {};
}

export const value = x => values([x]);
export const of = x => values([x]);

export const repeat = (v, delay = 0) => cb => {
  let id;
  const go = () => {
    id = setTimeout(() => {go(); cb(v);}, delay);
  }
  go();
  return () => clearTimeout(id);
}

export function signal() {
  let dispatch = () => {};
  const stream = function(cb) {
    dispatch = cb;
    return () => (dispatch = () => {});
  }::share();
  stream.dispatch = v => dispatch(v);
  return stream;
}


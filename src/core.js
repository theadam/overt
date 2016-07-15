export const transformer = runner => function(...args) {
  const s1 = this;
  const transformer = runner(...args);
  const go = source =>  {
    const handler = transformer(source);
    return cb =>  {
      return handler(cb);
    }
  }
  if (s1) return go(s1);
  return function() {
    return go(this);
  }
}

export const sink = function(cb) {
  const s1 = this;
  const go = source => source(cb);
  if (s1) return go(s1);
  return function() {
    return go(this);
  }
};


import { transformer } from './core';

export const delay = transformer((amt = 0) => source => sink => {
  let id;
  let unsub = source(v => {
    setTimeout(() => sink(v), amt);
  });
  return () => {
    unsub();
    clearTimeout(id);
  }
});

export const map = transformer(mapper => source => sink => source(v => sink(mapper(v))));

export const filter = transformer(pred => source => sink => source(v => {
  if (pred(v)) sink(v);
}));

export const ap = transformer(stream => source => sink => {
  let latestf = { type: 'nothing' };
  let latestv = { type: 'nothing' };
  const push = () => {
    if (latestf.type === 'just' && latestv.type === 'just') {
      sink(latestf.value(latestv.value));
    }
  };
  const disposef = source(fn => {
    latestf = { type: 'just', value: fn };
    push();
  });
  const disposev = stream(v => {
    latestv = { type: 'just', value: v };
    push();
  });
  return () => {
    disposef();
    disposev();
  };
});

export const chain = transformer(mapper => {
  const listeners = [];
  return source => sink => {
    const unsub = source(v => {
      listeners.push(mapper(v)(sink));
    });
    return () => { unsub(); listeners.forEach(l => l()) };
  };
});

export const take = transformer(n => stream => sink => {
  let count = 0
  let disposer = null
  const dispose = () => {
    if (disposer !== null) {
      disposer()
      disposer = null
    }
  }
  disposer = stream(x => {
    count++
    if (count <= n) {
      sink(x)
    }
    if (count >= n) {
      dispose()
    }
  })
  if (count >= n) {
    dispose()
  }
  return dispose
});

export const chainLatest = transformer(mapper => {
  let listeners = () => {};
  return source => sink => {
    const unsub = source(v => {
      listeners();
      listeners = mapper(v)(sink);
    });
    return () => { unsub(); listeners() };
  };
});

export const concat = transformer(stream => source => cb => {
  const d1 = source(cb);
  const d2 = stream(cb);
  return () => { d1(); d2(); };
});

export const merge = concat;

export const scan = transformer((init, reducer) => {
  let s = init;
  return source => sink => {
    sink(s);
    return source(v => {
      s = reducer(s, v);
      sink(s);
    });
  }
});

export const share = transformer(() => {
  let listeners = [];
  let unsub;
  return source => {
    return sink => {
      if (listeners.length === 0) {
        unsub = source(v => listeners.forEach(sink => sink(v)));
      }
      listeners.push(sink);
      return () => {
        listeners = listeners.filter(x => x !== sink);
        if (listeners.length === 0) {
          unsub();
        }
      }
    }
  }
});

export const replay = transformer(() => {
  let set = false;
  let last;
  return source => {
    source(v => {

    });
    return cb => {

    };
  };
});

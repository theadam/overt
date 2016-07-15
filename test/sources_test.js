import { expect }from 'chai';

import { collector } from './utils';
import { values, value, signal, repeat } from '../src/sources';

describe('sources', () => {
  let collect;
  beforeEach(() => {
    collect = collector();
  });

  describe('values', () => {
    it('streams the values synchronously', () => {
      values([1, 2, 3, 4])(collect);
      expect(collect.results).to.deep.equal([1, 2, 3, 4]);
    });
  });

  describe('value', () => {
    it('it streams the value synchronously', () => {
      value(1)(collect);
      expect(collect.results).to.deep.equal([1]);
    });
  });

  describe('signal', () => {
    let sig;
    beforeEach(() => {
      sig = signal();
    });

    it('dispatches events', () => {
      sig(collect);
      sig.dispatch(1);
      sig.dispatch(2);
      expect(collect.results).to.deep.equal([1, 2]);
    });

    it('is shared', () => {
      const collect2 = collector();
      sig(collect);
      sig(collect2);
      sig.dispatch(1);
      sig.dispatch(2);
      expect(collect.results).to.deep.equal([1, 2]);
      expect(collect2.results).to.deep.equal([1, 2]);
    });

    it('can unsubscribe', () => {
      sig.dispatch(0);
      const collect2 = collector();
      const unsub = sig(collect);
      const unsub2 = sig(collect2);
      sig.dispatch(1);
      unsub();
      sig.dispatch(2);
      unsub2();
      sig.dispatch(3);
      expect(collect.results).to.deep.equal([1]);
      expect(collect2.results).to.deep.equal([1, 2]);
      sig(collect);
      sig.dispatch(4);
      sig(collect2);
      sig.dispatch(5);
      expect(collect.results).to.deep.equal([1, 4, 5]);
      expect(collect2.results).to.deep.equal([1, 2, 5]);
    });
  });

  describe('repeat', () => {
    it('repeats a value until unsubscribe', (cb) => {
      let count = 0;
      let unsub;
      unsub = repeat(1)(v => {
        collect(v);
        count += 1;
        if (count === 3) {
          unsub();
          expect(collect.results).to.deep.equal([1, 1, 1]);
          setTimeout(() => cb(), 10);
        } else if (count > 3) {
          cb(new Error('repeat called after unsubscribe'));
        }
      });
    });
  });
});

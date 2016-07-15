import { expect } from 'chai';

import { collector } from './utils';
import { values, signal, of } from '../src/sources';
import { delay, map, scan, share, chain, concat, ap, filter } from '../src/transformers';

describe('transformers', () => {
  let collect;
  beforeEach(() => {
    collect = collector();
  });

  describe('delay', () => {
    it('sends nothing synchronously', () => {
      values([1, 2, 3])::delay()(collect);
      expect(collect.results).to.deep.equal([]);
    });

    it('sends the values asynchronously', (cb) => {
      values([1, 2, 3])::delay()(collect);
      setTimeout(() => {
        expect(collect.results).to.deep.equal([1, 2, 3]);
        cb();
      });
    });
  });

  describe('map', () => {
    it('maps the values', () => {
      values([1, 2, 3])::map(x => x + 1)(collect);
      expect(collect.results).to.deep.equal([2, 3, 4]);
    });
  });

  describe('chain', () => {
    it('chains the values', () => {
      values([1, 2, 3])::chain(x => values([x, x, x]))(collect);
      expect(collect.results).to.deep.equal([1, 1, 1, 2, 2, 2, 3, 3, 3]);
    });
  });

  describe('concat', () => {
    it('merges the streams', () => {
      values([1, 2, 3])::concat(values([4, 5, 6]))(collect);
      expect(collect.results).to.deep.equal([1, 2, 3, 4, 5, 6]);
    });
  });

  describe('ap', () => {
    const add = x => y => x + y;
    let x, y;
    beforeEach(() => {
      x = signal();
      y = signal();
    });

    it('applies values to the streams', () => {
      x::map(add)::ap(y)(collect);
      x.dispatch(1);
      y.dispatch(2);
      x.dispatch(3);
      x.dispatch(4);
      y.dispatch(5);
      y.dispatch(6);
      expect(collect.results).to.deep.equal([3, 5, 6, 9, 10]);
    });
  });

  describe('filter', () => {
    it('filters', () => {
      values([1, 2, 3])::filter(x => x > 1)(collect);
      expect(collect.results).to.deep.equal([2, 3]);
    });
  });

  describe('scan', () => {
    it('sends the initial value immediately', () => {
      values([])::scan(3, () => 1)(collect);
      expect(collect.results).to.deep.equal([3]);
    });

    it('runs the reducer for each value', () => {
      values(['1', '2', '3'])::scan(0, (acc, v) => acc + parseInt(v))(collect);
      expect(collect.results).to.deep.equal([0, 1, 3, 6]);
    });
  });

  describe('share', () => {
    it('shared stream continues pushing same values to subscribers', (cb) => {
      const collect2 = collector();
      const source = values([1, 2, 3])::delay(1)::share();
      source(v => {
        collect(v);
        if (v === 1) {
          source(v2 => {
            collect2(v2);
            if (v2 === 3) {
              expect(collect.results).to.deep.equal([1, 2, 3]);
              expect(collect2.results).to.deep.equal([2, 3]);
              cb();
            }
          });
        }
      });
    });

    it('unshared stream pushes new values to subscribers', (cb) => {
      const collect2 = collector();
      const source = values([1, 2, 3])::delay(1);
      source(v => {
        collect(v);
        if (v === 1) {
          source(v2 => {
            collect2(v2);
            if (v2 === 3) {
              expect(collect.results).to.deep.equal([1, 2, 3]);
              expect(collect2.results).to.deep.equal([1, 2, 3]);
              cb();
            }
          });
        }
      });
    });
  });
});

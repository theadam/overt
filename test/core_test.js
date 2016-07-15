import { expect } from 'chai';

import { collector } from './utils';
import { values } from '../src/sources';
import { sink, transformer } from '../src/core';

describe('core', () => {
  describe('sink', () => {
    let collect;
    beforeEach(() => {
      collect = collector();
    });

    it('runs the callback provided with each value', () => {
      const collectVals = sink(collect);
      values([1, 2, 3])::collectVals();

      expect(collect.results).to.deep.equal([1, 2, 3]);
    });

    it('works when chained directly on a stream', () => {
      values([1, 2, 3])::sink(collect);

      expect(collect.results).to.deep.equal([1, 2, 3]);
    });

    it('returns the source unsubscribe fn', (cb) => {
      const source = () => {
        return () => cb();
      }
      const collectVals = sink(collect);
      const unsub = source::collectVals();
      unsub();
    });

    it('returns the source unsubscribe fn when chained', (cb) => {
      const source = () => {
        return () => cb();
      }
      const unsub = source::sink(collect);
      unsub();
    });
  });

  describe('transformer', () => {
    let collect;
    let map = transformer(mapper => source => cb => {
      return source(v => cb(mapper(v)));
    });

    beforeEach(() => {
      collect = collector();
    });

    it('runs the callback provided with each value', () => {
      values([1, 2, 3])::map(x => x + 1)(collect);

      expect(collect.results).to.deep.equal([2, 3, 4]);
    });

    it('works when created without chaining', () => {
      const add1 = map(x => x + 1);
      values([1, 2, 3])::add1()(collect);

      expect(collect.results).to.deep.equal([2, 3, 4]);
    });

    it('returns the source unsubscribe fn', (cb) => {
      const source = () => {
        return () => cb();
      }
      const unsub = source::map(x => x + 1)(collect);
      unsub();
    });

    it('returns the source unsubscribe fn unchained', (cb) => {
      const source = () => {
        return () => cb();
      }
      const add1 = map(x => x + 1);
      const unsub = source::add1()(collect);
      unsub();
    });
  });
});

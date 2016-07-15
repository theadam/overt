import { sink } from './core';

export const log = sink(::console.log);


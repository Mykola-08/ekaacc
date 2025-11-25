import * as migration_20251125_081153_initial from './20251125_081153_initial';

export const migrations = [
  {
    up: migration_20251125_081153_initial.up,
    down: migration_20251125_081153_initial.down,
    name: '20251125_081153_initial'
  },
];

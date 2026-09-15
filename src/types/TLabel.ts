/**
 * Marks a prop as translatable — plain `string` at runtime and at the type
 * level (a pure alias, zero cost, freely assignable from/to `string`).
 * Purely documentation for a human reading a Props interface: "this prop
 * participates in the labels/i18n system" — it cannot be auto-detected
 * from this type alone (see TThemeLabels.ts's own comment on why not),
 * each component still lists its own label prop names once via `Pick` in
 * its `T<Name>Labels` export.
 */
export type TLabel = string;

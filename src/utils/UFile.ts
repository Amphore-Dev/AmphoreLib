/**
 * A native `File` has zero own enumerable properties — `name`/`size`/`type`/
 * `lastModified` all live on the prototype as getters. Every deep-equal lib
 * used in this codebase (Formik's own `dirty` check via `react-fast-compare`,
 * and `lodash.isEqual` elsewhere) walks *own enumerable* keys — so it sees
 * `{}` vs `{}` for any two `File` instances and calls them equal, no matter
 * how different the actual files are. Concretely: picking a new file into a
 * `file`-type field never flips Formik's `dirty` to `true`, so a form with
 * only a file field changed never enables its submit button.
 *
 * `tagFile` stamps a plain enumerable signature string onto the instance
 * (mutating it in place — a `File` isn't frozen, and callers keep passing
 * the same reference everywhere else) so those comparisons see a real own
 * key. Two picks of the literally same file (same name/size/mtime/type) tag
 * identically, so re-selecting an unchanged file still reports as "not
 * dirty" — matching what a user would expect.
 */
export const tagFile = <T extends File>(file: T): T => {
	Object.defineProperty(file, "__sig", {
		value: `${file.name}:${file.size}:${file.lastModified}:${file.type}`,
		enumerable: true,
		configurable: true,
	});
	return file;
};

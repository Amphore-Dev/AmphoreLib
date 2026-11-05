/**
 * Runs every handler given, in order, for one event: the consumer's handler
 * and the component's own logic both run, neither replaces the other.
 * Internal, not exported from the package.
 */
export const composeHandlers =
	<E>(...handlers: (((event: E) => void) | undefined)[]) =>
	(event: E) => {
		handlers.forEach((handler) => handler?.(event));
	};

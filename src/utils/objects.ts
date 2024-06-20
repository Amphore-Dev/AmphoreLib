interface IObject {
	[key: string]: unknown;
}

export const cleanObject = (obj: IObject, emptyToo?: boolean) => {
	const result: IObject = { ...obj };
	Object.keys(result).forEach((key) => {
		if (
			result[key] === undefined ||
			result[key] === null ||
			(emptyToo && result[key] === "")
		) {
			delete result[key];
		}
	});
	return result;
};

export const duplicateObject = (obj: IObject) => {
	if (!obj) return null;
	return JSON.parse(JSON.stringify(obj));
};

export const isObjectEmpty = (obj: IObject) => {
	if (!obj) return true;
	return Object.keys(obj).length === 0;
};

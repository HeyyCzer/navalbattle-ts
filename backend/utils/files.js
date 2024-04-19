import { readdirSync } from "fs";

export function getFiles(path) {
	const files = [];
	const dirents = readdirSync(path, { withFileTypes: true });

	for (const dirent of dirents) {
		if (dirent.isDirectory()) {
			files.push(...getFiles(`${path}/${dirent.name}`));
		} else {
			if (!dirent.name.endsWith(".js")) continue;
			files.push(`${path}/${dirent.name}`);
		}
	}
	return files;
}

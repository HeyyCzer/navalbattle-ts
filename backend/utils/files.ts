import { readdirSync } from "node:fs";

export function getFiles(path: string): string[] {
	const files = [];
	const dirents = readdirSync(path, { withFileTypes: true });

	for (const dirent of dirents) {
		if (dirent.isDirectory()) {
			files.push(...getFiles(`${path}/${dirent.name}`));
		} else {
			if (
				(
					!dirent.name.endsWith(".ts") &&
					!dirent.name.endsWith(".js")
				) || 
				dirent.name.endsWith(".d.ts")
			) continue;
			
			files.push(`${path}/${dirent.name.replace(".ts", "").replace(".js", "")}`);
		}
	}
	return files;
}

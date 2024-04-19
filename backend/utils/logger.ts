const logger = {
	success: (...args: any) => {
		console.log(`[✅ SUCCESS]`.bgGreen, ...args);
	},
	info: (...args: any) => {
		console.log(`[⚡ INFO]`.bgBlue, ...args);
	},
	warn: (...args: any) => {
		console.log(`[⚠ WARN]`.bgYellow, ...args);
	},
	error: (...args: any) => {
		console.log(`[❌ ERROR]`.bgRed, ...args);
	},
	debug: (...args: any) => {
		console.log(`[🐞 DEBUG]`.bgMagenta, ...args);
	},
};

export default logger;
// Handle nodemon specific signal
process.on('SIGUSR2', () => {
	process.exit(0)
})

process.on('SIGTERM', () => {
	process.exit(0)
})

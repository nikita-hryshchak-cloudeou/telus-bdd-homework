export const { envConfig } = require(`./${process.env.bddEnv || "dev"}`);

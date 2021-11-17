import * as dotenv from 'dotenv';
import * as Joi from '@hapi/joi';
import * as fs from 'fs';

export type EnvConfig = Record<string, string>;

export class ConfigService {

    private readonly envConfig: EnvConfig;

    constructor(filePath: string) {
        const config = dotenv.parse(fs.readFileSync(filePath));
        console.log(process.env.NODE_ENV)
        console.log(filePath);
        this.envConfig = this.validateInput(config);
    }

    /**
     * Ensures all needed variables are set, and returns the validated JavaScript object
     * including the applied default values.
     */
    private validateInput(envConfig: EnvConfig): EnvConfig {
        const envVarsSchema: Joi.ObjectSchema = Joi.object({
            NODE_ENV: Joi.string().valid('development', 'production', 'test', 'provision').default('development'),
            PORT: Joi.number().default(3000),
            HOST: Joi.string(),
            DB_PORT: Joi.number().default(3306),
            USERNAME: Joi.string(),
            PASSWORD: Joi.string(),
            DATABASE: Joi.string(),
        });

        const { error, value: validatedEnvConfig } = envVarsSchema.validate(envConfig);
        if (error) {
            throw new Error(`Config validation error: ${error.message}`);
        }
        return validatedEnvConfig;
    }

    get env(): string {
        return this.envConfig.NODE_ENV;
    }

    get port(): number {
        return Number(this.envConfig.PORT);
    }

    get host(): string {
        return String(this.envConfig.HOST);
    }

    get dbPort(): number {
        return Number(this.envConfig.DB_PORT);
    }

    get username(): string {
        return String(this.envConfig.USERNAME);
    }

    get password(): string {
        return String(this.envConfig.PASSWORD);
    }
    
    get database(): string {
        return String(this.envConfig.DATABASE);
    }
}

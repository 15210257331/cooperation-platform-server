/*
 * @Author: chenxiaofei
 * @Date: 2020-03-20 15:33:20
 * @LastEditors: Sephiroth·D·Kid
 * @LastEditTime: 2020-03-20 15:37:28
 * @Description: Log4js 工具函数 & 实例化
 */

import * as Path from 'path';
import * as Log4js from 'log4js';
import * as Util from 'util';
import * as dayjs from 'dayjs';
import * as StackTrace from 'stacktrace-js';
import Chalk from 'chalk';
const baseLogPath = Path.resolve(__dirname, '../../logs');

export const log4jsConfig = {
    appenders: {
        console: {
            type: 'console',
        },
        access: {
            type: 'dateFile',
            filename: `${baseLogPath}/access/access.log`,
            alwaysIncludePattern: true,
            pattern: 'yyyyMMdd',
            daysToKeep: 60,
            numBackups: 3,
            category: 'http',
            keepFileExt: true,
        },
        app: {
            type: 'dateFile',
            filename: `${baseLogPath}/app-out/app.log`,
            alwaysIncludePattern: true,
            layout: {
                type: 'pattern',
                pattern: '{"date":"%d","level":"%p","category":"%c","host":"%h","pid":"%z","data":\'%m\'}',
            },
            // 日志文件按日期（天）切割
            pattern: 'yyyyMMdd',
            daysToKeep: 60,
            // maxLogSize: 10485760,
            numBackups: 3,
            keepFileExt: true,
        },
        errorFile: {
            type: 'dateFile',
            filename: `${baseLogPath}/errors/error.log`,
            alwaysIncludePattern: true,
            layout: {
                type: 'pattern',
                pattern: '{"date":"%d","level":"%p","category":"%c","host":"%h","pid":"%z","data":\'%m\'}',
            },
            // 日志文件按日期（天）切割
            pattern: 'yyyyMMdd',
            daysToKeep: 60,
            // maxLogSize: 10485760,
            numBackups: 3,
            keepFileExt: true,
        },
        errors: {
            type: 'logLevelFilter',
            level: 'ERROR',
            appender: 'errorFile',
        },
    },
    categories: {
        default: {
            appenders: ['console', 'app', 'errors'],
            level: 'DEBUG',
        },
        info: { appenders: ['console', 'app', 'errors'], level: 'info' },
        access: { appenders: ['console', 'app', 'errors'], level: 'info' },
        http: { appenders: ['access'], level: 'DEBUG' },
    },
    pm2: true, // 使用 pm2 来管理项目时，打开
    pm2InstanceVar: 'INSTANCE_ID', // 会根据 pm2 分配的 id 进行区分，以免各进程在写日志时造成冲突
}

export enum LoggerLevel {
    ALL = 'ALL',
    MARK = 'MARK',
    TRACE = 'TRACE',
    DEBUG = 'DEBUG',
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR',
    FATAL = 'FATAL',
    OFF = 'OFF',
}

export class ContextTrace {
    constructor(
        public readonly context: string,
        public readonly path?: string,
        public readonly lineNumber?: number,
        public readonly columnNumber?: number,
    ) { }
}

Log4js.addLayout('Awesome-nest', (logConfig: any) => {
    return (logEvent: Log4js.LoggingEvent): string => {
        let moduleName = '';
        let position = '';

        const messageList: string[] = [];
        logEvent.data.forEach((value: any) => {
            if (value instanceof ContextTrace) {
                moduleName = value.context;
                if (value.lineNumber && value.columnNumber) {
                    position = `${value.lineNumber}, ${value.columnNumber}`;
                }
                return;
            }

            if (typeof value !== 'string') {
                value = Util.inspect(value, false, 3, true);
            }

            messageList.push(value);
        });

        const messageOutput: string = messageList.join(' ');
        const positionOutput: string = position ? ` [${position}]` : '';
        const typeOutput = `[${logConfig.type}] ${logEvent.pid.toString()}   - `;
        const dateOutput = `${dayjs(logEvent.startTime).format('YYYY-MM-DD HH:mm:ss')}`;
        const moduleOutput: string = moduleName ? `[${moduleName}] ` : '[LoggerService] ';
        let levelOutput = `[${logEvent.level}] ${messageOutput}`;

        switch (logEvent.level.toString()) {
            case LoggerLevel.DEBUG:
                levelOutput = Chalk.green(levelOutput);
                break;
            case LoggerLevel.INFO:
                levelOutput = Chalk.cyan(levelOutput);
                break;
            case LoggerLevel.WARN:
                levelOutput = Chalk.yellow(levelOutput);
                break;
            case LoggerLevel.ERROR:
                levelOutput = Chalk.red(levelOutput);
                break;
            case LoggerLevel.FATAL:
                levelOutput = Chalk.hex('#DD4C35')(levelOutput);
                break;
            default:
                levelOutput = Chalk.grey(levelOutput);
                break;
        }

        return `${Chalk.green(typeOutput)}${dateOutput}  ${Chalk.yellow(moduleOutput)}${levelOutput}${positionOutput}`;
    };
});

Log4js.configure(log4jsConfig);

const logger = Log4js.getLogger();
logger.level = LoggerLevel.TRACE;

export class Logger {
    static trace(...args) {
        logger.trace(Logger.getStackTrace(), ...args);
    }

    static debug(...args) {
        logger.debug(Logger.getStackTrace(), ...args);
    }

    static log(...args) {
        logger.info(Logger.getStackTrace(), ...args);
    }

    static info(...args) {
        logger.info(Logger.getStackTrace(), ...args);
    }

    static warn(...args) {
        logger.warn(Logger.getStackTrace(), ...args);
    }

    static warning(...args) {
        logger.warn(Logger.getStackTrace(), ...args);
    }

    static error(...args) {
        logger.error(Logger.getStackTrace(), ...args);
    }

    static fatal(...args) {
        logger.fatal(Logger.getStackTrace(), ...args);
    }

    static access(...args) {
        const loggerCustom = Log4js.getLogger('http');
        loggerCustom.info(Logger.getStackTrace(), ...args);
    }

    static getStackTrace(deep = 2): string {
        const stackList: StackTrace.StackFrame[] = StackTrace.getSync();
        const stackInfo: StackTrace.StackFrame = stackList[deep];

        const lineNumber: number = stackInfo.lineNumber;
        const columnNumber: number = stackInfo.columnNumber;
        const fileName: string = stackInfo.fileName;
        const basename: string = Path.basename(fileName);
        return `${basename}(line: ${lineNumber}, column: ${columnNumber}): \n`;
    }
}

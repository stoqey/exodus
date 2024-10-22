import os from 'os';
require('dotenv').config();

const { env } = process;

// env
export const isDev = env.NODE_ENV !== 'production';

export const HOSTNAME = os.hostname();

/***
 * server env
 */
export const PORT = +(env.PORT || 3009);
export const appName = env.APP_NAME || 'EXODUS';

/**
 * Influx config
 */
export const databaseName = env.APP_DB || 'stoqey';
export const influxDbPort: number = +(env.INFLUX_PORT || 8086);
export const influxDbHost: string = (env.INFLUX_HOST || 'localhost');
export const influxDbUser = env.INFLUX_USER;
export const influxDbPass = env.INFLUX_PASS;
export const demoInsert = env.DEMO_INSERT;

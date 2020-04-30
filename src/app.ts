import express from 'express';
import influx from './db/database';
import bodyParser from 'body-parser';
import isEmpty from 'lodash/isEmpty';
import { MarketDataMeasurement } from './db/marketdata.schema';
import nanoexpress from 'nanoexpress';
import { PORT, databaseName, appName, HOSTNAME } from './config';
// const app: express.Application = express()

const app = nanoexpress();

app.get('/', function (req, res) {
    res.json({
        hostname: HOSTNAME,
        date: new Date
    })
})

app.get('/v1/query', function (req, res) {
    influx.query('select * from exodus_table')
        .then(result => {
            res.json(result)
            res.end()
        })
})

app.post('/v1/insert', function (req, res) {

    const data = req && req.body;

    const items: any = [];

    if (typeof data === "object") {
        const { symbol = "UNKNOWN", open = 0, high = 0, low = 0, close = 0, volume = 0 } = req.body as any;
        items.push(
            {
                measurement: MarketDataMeasurement,
                fields: {
                    symbol, open, high, low, close, volume
                },
                tags: {
                    symbol
                }
            }
        )
    }

    if (Array.isArray(data)) {
        data.map(item => {
            const { symbol = "UNKNOWN", open = 0, high = 0, low = 0, close = 0, volume = 0 } = item as any;
            items.push(
                {
                    measurement: MarketDataMeasurement,
                    fields: {
                        symbol, open, high, low, close, volume
                    },
                    tags: {
                        symbol
                    }
                }
            )
        })
    }

    res.end();
    if (!isEmpty(items)) {
        influx.writePoints(items)
    }

})

export async function runApp(): Promise<boolean> {
    try {

        let count = 0;
        const names = await influx.getDatabaseNames();
        if (!names.includes(databaseName)) {
            await influx.createDatabase(databaseName)
        }
        await app.listen(PORT);

        console.log(`Started ${appName} on ${PORT}`);

        return true;
        // setInterval(() => {
        //     influx.writePoints([
        //         {
        //             measurement: MarketDataMeasurement,
        //             fields: {
        //                 // symbol: "AAPL",
        //                 open: 1.1,
        //                 high: 1.1,
        //                 low: 1.1,
        //                 close: count += 1,
        //                 volume: 1
        //             },
        //             tags: {
        //                 symbol: 'AAPL'
        //             }

        //         }
        //     ])/*  */
        //     console.log('add values', count)
        // }, 500);

    }
    catch (error) {
        console.log('error running app', error && error.message);
        console.error(error)
        process.exit(1);
    }
}
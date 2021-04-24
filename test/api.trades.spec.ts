import fs from 'fs';
import { app, server } from '../src/app';
import mongoose from "mongoose"

const dir = './test/data/';
const testFolder = './test/data';
let testCaseNames = fs.readFileSync(dir + 'description.txt', 'utf8').toString().split('\n');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

interface ITest {
    request: {
        headers: {};
        method: string;
        body: {};
        url: string
    };
    response: {
        headers: {};
        status_code: number;
        body: {} | []
    };
}

const files = fs.readdirSync(testFolder).sort();
const table: { [index: string]: ITest[] } = {};

let i = 0;
for (const file of files) {
    if (["http00.json", "http01.json", "http02.json"].includes(file)) { // && file !== "http03.json" && file !== "http03.json"
        let events = fs.readFileSync(dir + file, 'utf8').toString().split('\n').map((line) => {
            return (!!line) ? JSON.parse(line) : undefined;
        }).filter(value => !!value);
        table[testCaseNames[i]] = events;
        i++;
    }
}

jest.setTimeout(30 * 1000);
describe('Check Tests', () => {

    beforeAll(async done => {
        app.on("ready", () => {
            done();
        })
    })

    afterAll(async done => {
        await mongoose.disconnect()
        server.close()
        done()
    });


    const entries = Object.entries(table);
    for (const [testCase, requests] of entries) {
        test(testCase, async () => {
            for (const eve of requests) {
                let response;

                switch (eve.request.method) {
                    case 'DELETE':
                        response = await chai.request(app).delete(eve.request.url);
                        expect(response.status).toEqual(eve.response.status_code);
                        break;

                    case 'GET':
                        response = await chai.request(app).get(eve.request.url);
                        expect(response.statusCode).toEqual(eve.response.status_code)
                        let ar1 = response.body;
                        let ar2 = eve.response.body;
                        if (eve.response.status_code === 404) {
                            continue;
                        }
                        expect((ar2 as []).length).toEqual(ar1.length);

                        for (let k = 0; k < ar1.length; k++) {
                            expect(ar2[k]).toEqual(ar1[k]);
                        }
                        break;

                    case 'POST':
                        response = await chai.request(app)
                            .post(eve.request.url)
                            .set(eve.request.headers)
                            .send(eve.request.body);

                        expect(response.status).toEqual(eve.response.status_code);
                        break;

                    case 'PUT':
                        response = await chai.request(app)
                            .put(eve.request.url)
                            .set(eve.request.headers)
                            .send(eve.request.body);

                        expect(response.status).toEqual(eve.response.status_code);
                        break;

                    default:
                        console.log(`unknown method`);
                }
            }
        });
    }

});


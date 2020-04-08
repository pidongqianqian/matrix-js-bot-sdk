import * as expect from "expect";
import { OptionsOfDefaultResponseBody } from "got/dist/source/create";

export function expectArrayEquals(expected: any[], actual: any[]) {
    expect(expected).toBeDefined();
    expect(actual).toBeDefined();
    expect(actual.length).toBe(expected.length);
    for (let i = 0; i < actual.length; i++) {
        expect(actual[i]).toEqual(expected[i]);
    }
}

export type Constructor<T> = { new(...args: any[]): T };

export function expectInstanceOf<T>(expected: Constructor<T>, actual: any): boolean {
    return actual instanceof expected;
}

export function testDelay(ms: number): Promise<any> {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

export function requestWrapper(requestFn: (opts, callback) => void) {
    return async (params: OptionsOfDefaultResponseBody) => {
        let requestParams: object = params;
        if (params.searchParams != null) {
            requestParams["qs"] = params.searchParams;
            requestParams["userQuerystring"] = true
            requestParams["qsStringifyOptions"] = {
                options: {arrayFormat: 'repeat'},
            }
        }
        delete requestParams["searchParams"];
        requestParams["uri"] = params.url;
        delete requestParams["url"];

        return new Promise<string>((resolve, reject) => {
            requestFn(requestParams, (err, response, respBody) => {
                if (err) {
                    reject(err);
                } else {
                    response.body = respBody;
                    resolve(response);
                }
            });
        });
    }
}

import { HttpException, Injectable, Module } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, Observable, timeout } from 'rxjs';
import { AxiosResponse } from 'axios';
const download = require('download')

const key = '287eb236fa7945ff8df00cd05b3b7271';

let headers = {
    'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_1_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
}

@Injectable()
export class RequestService {

    constructor(private httpService: HttpService) { }

    async getRandomQuote() {
        const randomQuoteApi = 'http://api.quotable.io/random';
        const response$ = this.httpService.get(randomQuoteApi);
        const response = await lastValueFrom(response$);
        return response.data;
    }

    async weatherData(location: any) {
        const weatherApi = `https://devapi.qweather.com/v7/weather/now?key=${key}&location=${location}`;
        const response$ = this.httpService.get(weatherApi);
        const response = await lastValueFrom(response$);
        if (response.status === 200 && response.data.code === '200') {
            return response.data.now
        }
    }
    async cityInfo(location: any) {
        console.log(location);
        const api = `https://geoapi.qweather.com/v2/city/lookup?key=${key}&location=${location}`
        const response$ = this.httpService.get(api);
        const response = await lastValueFrom(response$);
        if (response.status === 200 && response.data.code === '200') {
            return response.data.location;
        }
    }

    async getPicture() {
        let skip: number = 0;
        const api = 'http://service.picasso.adesk.com/v1/vertical/category/4e4d610cdf714d2966000000/vertical';
        const params = {
            limit: 30,
            skip: skip,
            first: 0,
        };
        const response$: Observable<AxiosResponse<any, any>> = this.httpService.get(api, { headers: headers, params });
        const res: AxiosResponse<any, any> = await lastValueFrom(response$);
        if (res.status === 200) {
            const data = res.data.res.vertical;
            await this.downloadFile(data)
            timeout(1000);
            if (skip < 1000) {
                load(skip + 30)
            } else {
                console.log('下载完成')
            }
        } else {
            throw new HttpException('出错了', 200);
        }

    }


    async downloadFile(data) {
        for (let index = 0; index < data.length; index++) {
            const item = data[index]

            // Path at which image will get downloaded
            const filePath = `${__dirname}/美女`

            await download(item.wp, filePath, {
                filename: item.id + '.jpeg',
                headers,
            }).then(() => {
                console.log(`Download ${item.id} Completed`)
                return
            })
        }
    }

}
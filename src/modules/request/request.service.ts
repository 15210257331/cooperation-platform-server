import { Injectable, Module } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

const key = '287eb236fa7945ff8df00cd05b3b7271';

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
            return {
                data: response.data.now
            }
        }
    }
    async cityInfo(location: any) {
        console.log(location);
        const api = `https://geoapi.qweather.com/v2/city/lookup?key=${key}&location=${location}`
        const response$ = this.httpService.get(api);
        const response = await lastValueFrom(response$);
        if (response.status === 200 && response.data.code === '200') {
            return {
                data: response.data.location
            }
        }
    }

    async picture() {
        
    }

}
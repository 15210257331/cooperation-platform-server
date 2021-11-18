import { Injectable, Module } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

const randomQuoteApi = 'http://api.quotable.io/random';

@Injectable()
export class RequestService {

    constructor(private httpService: HttpService) { }

    async getRandomQuote() {
        const response$ = this.httpService.get(randomQuoteApi);
        const response = await lastValueFrom(response$);
        return response.data;
    }

}
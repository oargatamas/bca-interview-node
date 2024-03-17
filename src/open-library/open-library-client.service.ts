import { HttpService } from '@nestjs/axios';
import {Injectable, InternalServerErrorException} from '@nestjs/common';
import {lastValueFrom} from 'rxjs';
import {OpenLibraryWorkIdResponse} from "./dto/open-library-work-id-response";

@Injectable()
export class OpenLibraryClientService {
  constructor(private readonly httpService: HttpService) {}

  async getBookDetails(workId: string): Promise<OpenLibraryWorkIdResponse> {
    try{
      const apiResponse = await lastValueFrom(this.httpService.get(`https://openlibrary.org/works/${workId}.json`));
      const data = apiResponse.data;

      if(!data.first_publish_date){
        throw new InternalServerErrorException("first_publish_date not existing in openlibrary.org response!");
      }

      const response = new OpenLibraryWorkIdResponse();
      response.workId = workId;
      response.publishedAt = new Date(data.first_publish_date);

      return response;
    }catch (error){
      console.error("OpenLibraryClientService - Failed to fetch book data from openlibrary.org: ", error);
      throw new InternalServerErrorException(error);
    }
  }
}

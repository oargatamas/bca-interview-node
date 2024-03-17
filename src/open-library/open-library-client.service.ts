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

      const response = new OpenLibraryWorkIdResponse();
      response.workId = workId;

      if(data.first_publish_date){
        response.publishedAt = new Date(data.first_publish_date);
      }else{
        console.log("first_publish_date not existing in openlibrary.org response!");
      }

      return response;
    }catch (error){
      console.error("OpenLibraryClientService - Failed to fetch book data from openlibrary.org: ", error);
      throw new InternalServerErrorException(error);
    }
  }
}

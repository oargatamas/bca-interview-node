import {Controller, Get, Param, Patch, Query} from '@nestjs/common';
import { Book } from './books.entity';
import { BooksService } from './books.service';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  findAll(): Promise<Book[]> {
    return this.booksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(+id);
  }

  @Get('/query/:country')
  findOneByAuthorCountry(@Param('country') country: string, @Query('from') fromYear: number){
    return this.booksService.findAllByAuthorCountry(country, fromYear);
  }

  @Patch('/update-all-with-year')
  async updateAllWithYear(){
    return this.booksService.updateAllWithYear();
  }

}

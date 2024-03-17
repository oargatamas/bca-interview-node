import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Between, LessThanOrEqual, MoreThanOrEqual, Not, Repository} from 'typeorm';
import {OpenLibraryClientService} from '../open-library/open-library-client.service';
import {Book} from './books.entity';

@Injectable()
export class BooksService {
    readonly DEFAULT_RELATIONS = ['authors'];

    constructor(
        @InjectRepository(Book)
        private readonly bookRepository: Repository<Book>,
        private readonly openLibraryClientService: OpenLibraryClientService,
    ) {
    }

    findAll(): Promise<Book[]> {
        return this.bookRepository.find({relations: this.DEFAULT_RELATIONS});
    }

    async findOne(id: number): Promise<Book> {
        const book = await this.bookRepository.findOne({
            relations: this.DEFAULT_RELATIONS,
            where: {id},
        });

        if (!book) throw new NotFoundException(`Book with id ${id} not found.`);

        return book;
    }

    async updateAllWithYear(): Promise<any> {
        let books = await this.bookRepository.findBy({
            year: Not(null),
        });

        for (let book of books){
          book.year = (<number> await this.openLibraryClientService.getBookDetails(book.workId));
        }

        await this.bookRepository.save(books);
    }
}

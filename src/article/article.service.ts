import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ArticleEntity } from '@app/article/article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { UserEntity } from '@app/user/user.entity';
import { CreateArticleDto } from '@app/article/dto/create.article.dto';
import { ArticleResponseInterface } from '@app/article/types/articleResponse.interface';
import slugify from 'slugify';
import { ListArticleResponseInterface } from '@app/article/types/listArticleResponse.interface';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
  ) {}

  async createArticle(
    user: UserEntity,
    createArticleDto: CreateArticleDto,
  ): Promise<ArticleEntity> {
    const article = new ArticleEntity();
    Object.assign(article, createArticleDto);

    if (!article.tagList) {
      article.tagList = [];
    }

    article.slug = this.getSlug(article.title);
    article.author = user;

    return await this.articleRepository.save(article);
  }

  buildArticleResponse(article: ArticleEntity): ArticleResponseInterface {
    return { article };
  }

  private getSlug(title: string): string {
    return (
      slugify(title, { lower: true }) +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
    );
  }

  async getArticleBySlug(slug: string): Promise<ArticleEntity> {
    const article = await this.articleRepository.findOne({ where: { slug } });

    if (!article) {
      throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND);
    }

    return article;
  }

  async deleteArticle(slug: string, id: number): Promise<DeleteResult> {
    const article = await this.getArticleBySlug(slug);

    if (article.author.id !== id) {
      throw new HttpException(
        'This article does not belong to you',
        HttpStatus.FORBIDDEN,
      );
    }

    return await this.articleRepository.delete({ slug });
  }

  async updateArticle(
    userId: number,
    slug: string,
    updateArticle: CreateArticleDto,
  ): Promise<ArticleEntity> {
    const article = await this.getArticleBySlug(slug);

    if (article.author.id !== userId) {
      throw new HttpException(
        'This article does not belong to you',
        HttpStatus.FORBIDDEN,
      );
    }

    Object.assign(article, updateArticle);

    return await this.articleRepository.save(article);
  }

  async findAll(
    userId: number,
    query: any,
  ): Promise<ListArticleResponseInterface> {
    const queryBuilder = this.articleRepository
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'author');

    const articlesCount = await queryBuilder.getCount();

    queryBuilder.orderBy('articles.createdAt', 'DESC');

    if (query.limit) {
      queryBuilder.limit(query.limit);
    }

    if (query.offset) {
      queryBuilder.offset(query.offset);
    }

    if (query.tag) {
      queryBuilder.andWhere('articles.tagList LIKE :tag', {
        tag: `%${query.tag}%`,
      });
    }

    if (query.author) {
      const author = await this.userRepository.findOne({
        where: { username: query.author },
      });
      queryBuilder.andWhere('articles.authorId = :id', {
        id: author.id,
      });
    }

    if (query.favorited) {
      const author = await this.userRepository.findOne({
        where: { username: query.favorited },
        relations: ['favorites'],
      });
      const ids = author.favorites.map((el) => el.id);

      if (ids.length > 0) {
        queryBuilder.andWhere('articles.id IN (:...ids)', { ids });
      } else {
        queryBuilder.andWhere('1=0');
      }
    }

    let favoriteIds: number[] = [];

    if (userId) {
      const currentUser = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['favorites'],
      });

      favoriteIds = currentUser.favorites.map((favorite) => favorite.id);
    }
    const articles = await queryBuilder.getMany();

    const articleWithFavorited = articles.map((article) => {
      const favorited = favoriteIds.includes(article.id);
      return { ...article, favorited };
    });

    return { articles: articleWithFavorited, articlesCount };
  }

  async addArticleToFavorite(
    userId: number,
    slug: string,
  ): Promise<ArticleEntity> {
    const article = await this.getArticleBySlug(slug);
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['favorites'],
    });

    const isNotFavorite =
      user.favorites.findIndex(
        (articleInFavorite) => articleInFavorite.id === article.id,
      ) === -1;

    if (isNotFavorite) {
      user.favorites.push(article);
      article.favoritesCount++;
      await this.userRepository.save(user);
      await this.articleRepository.save(article);
    }
    return article;
  }

  async deleteArticleToFavorite(
    userId: number,
    slug: string,
  ): Promise<ArticleEntity> {
    const article = await this.getArticleBySlug(slug);
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['favorites'],
    });

    const articleIndex = user.favorites.findIndex(
      (articleInFavorite) => articleInFavorite.id === article.id,
    );

    if (articleIndex >= 0) {
      user.favorites.splice(articleIndex, 1);
      article.favoritesCount--;
      await this.userRepository.save(user);
      await this.articleRepository.save(article);
    }
    return article;
  }
}

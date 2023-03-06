import { ArticleType } from '@app/article/types/article.type';

export interface ListArticleResponseInterface {
  articles: ArticleType[];
  articlesCount: number;
}

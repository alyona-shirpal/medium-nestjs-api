import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCommentDto } from '@app/article/dto/create.comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentEntity } from '@app/comment/comment.entity';
import { CommentResponseInterface } from '@app/comment/types/commentResponse.interface';
import { ArticleService } from '@app/article/article.service';
import { ListCommentResponseInterface } from '@app/comment/types/listCommentResponse.interface';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    private readonly articleService: ArticleService,
  ) {}

  buildCommentResponse(comment: CommentEntity): CommentResponseInterface {
    return { comment };
  }

  async createComment(
    comment: CreateCommentDto,
    userId: number,
    articleName: string,
  ) {
    const article = await this.articleService.getArticleBySlug(articleName);

    const articlePayload = {
      ...comment,
      authorId: userId,
      articleName: article.slug,
    };

    const createComment = new CommentEntity();

    Object.assign(createComment, articlePayload);

    return await this.commentRepository.save(createComment);
  }

  async getCommentsByArticle(
    article: string,
  ): Promise<ListCommentResponseInterface> {
    const comments = await this.commentRepository.find({
      where: { articleName: article },
    });

    if (comments.length === 0) {
      return { comments: [], commentsCount: 0 };
    }

    return { comments, commentsCount: comments.length };
  }

  async deleteComment(userId: number, article: string, commentId) {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId, articleName: article },
    });

    if (comment.authorId !== userId) {
      throw new HttpException(
        'No permission to delete the comment',
        HttpStatus.FORBIDDEN,
      );
    }

    return this.commentRepository.remove(comment);
  }
}

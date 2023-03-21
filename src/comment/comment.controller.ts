import { CommentService } from '@app/comment/comment.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { BackendValidationPipe } from '@app/shared/pipes/backendValidation.pipe';
import { User } from '@app/user/decorators/user.decorators';
import { CreateCommentDto } from '@app/article/dto/create.comment.dto';
import { CommentResponseInterface } from '@app/comment/types/commentResponse.interface';
import { ListCommentResponseInterface } from '@app/comment/types/listCommentResponse.interface';

@Controller()
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('articles/:article/comments')
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async createCommentsToArticle(
    @User('id') userId: number,
    @Param('article') articleName: string,
    @Body('comment') createCommentDto: CreateCommentDto,
  ): Promise<CommentResponseInterface> {
    const comment = await this.commentService.createComment(
      createCommentDto,
      userId,
      articleName,
    );
    return this.commentService.buildCommentResponse(comment);
  }

  @Get('articles/:article/comments')
  @UseGuards(AuthGuard)
  async getCommentsByArticle(
    @Param('article') article: string,
  ): Promise<ListCommentResponseInterface> {
    return this.commentService.getCommentsByArticle(article);
  }

  @Delete('articles/:article/comments/:commentId')
  @UseGuards(AuthGuard)
  async deleteComment(
    @User('id') userId: number,
    @Param('article') article: string,
    @Param('commentId') commentId: number,
  ) {
    return this.commentService.deleteComment(userId, article, commentId);
  }
}

import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from '@app/comment/comment.entity';
import { Module } from '@nestjs/common';
import { CommentService } from '@app/comment/comment.service';
import { ArticleService } from '@app/article/article.service';
import { UserEntity } from '@app/user/user.entity';
import { ArticleEntity } from '@app/article/article.entity';
import { FollowEntity } from '@app/profile/follow.entity';
import { CommentController } from '@app/comment/comment.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CommentEntity,
      UserEntity,
      ArticleEntity,
      FollowEntity,
    ]),
  ],
  exports: [CommentService],
  controllers: [CommentController],
  providers: [CommentService, ArticleService],
})
export class CommentModule {}

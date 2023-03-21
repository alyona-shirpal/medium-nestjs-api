import { CommentEntity } from '@app/comment/comment.entity';

export interface ListCommentResponseInterface {
  comments: CommentEntity[];
  commentsCount: number;
}

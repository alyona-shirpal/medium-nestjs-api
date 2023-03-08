import { UserEntity } from '@app/user/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfileResponseInterface } from '@app/profile/types/profile.response.interface';
import { ProfileType } from '@app/profile/types/profileType';
import { FollowEntity } from '@app/profile/follow.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FollowEntity)
    private readonly followRepository: Repository<FollowEntity>,
  ) {}

  async getProfileByUsername(
    userId: number,
    username: string,
  ): Promise<ProfileType> {
    const profile = await this.userRepository.findOne({ where: { username } });

    if (!profile) {
      throw new HttpException('Profile does not exist', HttpStatus.NOT_FOUND);
    }

    const follow = await this.followRepository.findOne({
      where: { followerId: userId, followingId: profile.id },
    });

    return { ...profile, following: Boolean(follow) };
  }

  buildResponse(profile: ProfileType): ProfileResponseInterface {
    delete profile.email;
    return { profile };
  }

  async followProfile(
    username: string,
    currentUserid: number,
  ): Promise<ProfileType> {
    const profile = await this.userRepository.findOne({ where: { username } });

    if (!profile) {
      throw new HttpException('Profile does not exist', HttpStatus.NOT_FOUND);
    }

    if (currentUserid === profile.id) {
      throw new HttpException(
        'You can not follow yourself',
        HttpStatus.BAD_REQUEST,
      );
    }

    const follow = await this.followRepository.findOne({
      where: { followerId: currentUserid, followingId: profile.id },
    });

    if (!follow) {
      const followToCreate = new FollowEntity();
      followToCreate.followingId = profile.id;
      followToCreate.followerId = currentUserid;

      await this.followRepository.save(followToCreate);
    }

    return { ...profile, following: true };
  }

  async unFollowProfile(
    username: string,
    currentUserId: number,
  ): Promise<ProfileType> {
    const profile = await this.userRepository.findOne({ where: { username } });

    if (!profile) {
      throw new HttpException('Profile does not exist', HttpStatus.NOT_FOUND);
    }

    if (currentUserId === profile.id) {
      throw new HttpException(
        'You can not unfollow yourself',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.followRepository.delete({
      followerId: currentUserId,
      followingId: profile.id,
    });

    return { ...profile, following: false };
  }
}

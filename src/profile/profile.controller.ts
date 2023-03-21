import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from '@app/profile/profile.service';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { ProfileResponseInterface } from '@app/profile/types/profile.response.interface';
import { User } from '@app/user/decorators/user.decorators';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('/:username')
  async getProfileByUsername(
    @User('id') userId: number,
    @Param('username') username: string,
  ): Promise<ProfileResponseInterface> {
    const profile = await this.profileService.getProfileByUsername(
      userId,
      username,
    );
    return this.profileService.buildResponse(profile);
  }

  @Post(':username/follow')
  @UseGuards(AuthGuard)
  async followProfile(
    @Param('username') username: string,
    @User('id') currentUserId: number,
  ): Promise<ProfileResponseInterface> {
    const profile = await this.profileService.followProfile(
      username,
      currentUserId,
    );
    return this.profileService.buildResponse(profile);
  }

  @Delete(':username/unfollow')
  @UseGuards(AuthGuard)
  async unFollowProfile(
    @Param('username') username: string,
    @User('id') currentUserId: number,
  ): Promise<ProfileResponseInterface> {
    const profile = await this.profileService.unFollowProfile(
      username,
      currentUserId,
    );
    return this.profileService.buildResponse(profile);
  }
}

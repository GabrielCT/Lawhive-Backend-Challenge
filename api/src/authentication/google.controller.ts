import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { GoogleService } from './google.service';

// TODO: rename to auth.controller.ts

@Controller('google')
export class GoogleController {
  constructor(private readonly googleService: GoogleService) {}

  @Get('redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    const token = await this.googleService.signIn(req.user);
    // TODO: set token as token instead of returning like this
    return token;
  }
}

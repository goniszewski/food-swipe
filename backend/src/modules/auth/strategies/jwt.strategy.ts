import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { passportJwtSecret } from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private configService: ConfigService,
    private userService: UserService,
  ) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${configService.get('COGNITO_ISSUER')}/.well-known/jwks.json`,
      }),

      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: configService.get('COGNITO_CLIENT_ID'),
      issuer: configService.get('COGNITO_ISSUER'),
      algorithms: ['RS256'],
    });
  }

  public async validate(payload: any) {
    const login = <string>payload['cognito:username'];
    const user = await this.userService.findByLogin(login);

    if (!user) {
      throw new UnauthorizedException(login, "This user doesn't exists.");
    }

    return user.toJSON();
  }
}

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
  CognitoUserSession,
  ICognitoUserPoolData,
  CognitoRefreshToken,
} from 'amazon-cognito-identity-js';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { RefreshAuthDto } from './dto/refresh-auth.dto';

// const poolData: ICognitoUserPoolData = {
//   UserPoolId: '{ userPoolId }',
//   ClientId: '{clientId}',
// };
// const userPool = new CognitoUserPool(poolData);

@Injectable()
export class AuthService {
  private userPool: CognitoUserPool;
  constructor(
    private readonly configService: ConfigService,
    private userService: UserService,
  ) {
    this.userPool = new CognitoUserPool({
      UserPoolId: this.configService.get('COGNITO_USER_POOL'),
      ClientId: this.configService.get('COGNITO_CLIENT_ID'),
    });
  }

  get secretKey() {
    return this.configService.get('COGNITO_SECRET_KEY');
  }

  async register(registerAuthDto: RegisterAuthDto) {
    const { name, login, password } = registerAuthDto;
    const cognitoResponse: CognitoUser = await new Promise(
      (resolve, reject) => {
        return this.userPool.signUp(
          login,
          password,
          // null,
          [
            new CognitoUserAttribute({
              Name: 'preferred_username',
              Value: name || login,
            }),
          ],
          null,
          async (error, result) => {
            if (!result) {
              reject({ error });
            } else {
              resolve(result.user);
            }
          },
        );
      },
    );

    if (!cognitoResponse.getUsername()) {
      throw new InternalServerErrorException(
        cognitoResponse,
        'Error when creating user in Cognito.',
      );
    }

    return this.userService.create({
      login: cognitoResponse.getUsername(),
      name: name || login,
    });
  }

  async login(user: LoginAuthDto) {
    const { login, password } = user;
    const authenticationDetails = new AuthenticationDetails({
      Username: login,
      Password: password,
    });
    const userData = {
      Username: login,
      Pool: this.userPool,
    };
    const newUser = new CognitoUser(userData);
    const cognitoResponse: CognitoUserSession = await new Promise(
      (resolve, reject) => {
        return newUser.authenticateUser(authenticationDetails, {
          onSuccess: (result) => {
            resolve(result);
          },
          onFailure: (err) => {
            reject(err);
          },
        });
      },
    );

    const response = {
      token: cognitoResponse.getIdToken().getJwtToken(),
      tokenExp: cognitoResponse.getIdToken().getExpiration(),
      refreshToken: cognitoResponse.getRefreshToken().getToken(),
    };
    return response;
  }

  async refreshToken({ login, refreshToken }: RefreshAuthDto) {
    const userData = {
      Username: login,
      Pool: this.userPool,
    };
    const user = new CognitoUser(userData);
    const cognitoResponse: CognitoUserSession = await new Promise(
      (resolve, reject) => {
        return user.refreshSession(
          new CognitoRefreshToken({ RefreshToken: refreshToken }),
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          },
        );
      },
    );

    const response = {
      token: cognitoResponse.getIdToken().getJwtToken(),
      tokenExp: cognitoResponse.getIdToken().getExpiration(),
      refreshToken: cognitoResponse.getRefreshToken().getToken(),
    };
    return response;
  }
}

import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}

    //username and pass are 2 parameter Passport Library throw back (ném về) 
    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByUsername(username);
        if(user){
          const isValid = this.usersService.isValidPassword(pass, user.password)
          if(isValid == true){
            return user;
          }
        }
        return null;
      }
}

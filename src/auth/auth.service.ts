import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}

    async signUp(authcredentialsDto: AuthCredentialsDto): Promise<void> {
        const { username, password } = authcredentialsDto;

        const user = this.userRepository.create({
            username,
            password
        });

        try {
            await this.userRepository.save(user);
        } catch (err) {
            if(err.code === '23505') {  // duplicate username
                throw new ConflictException('Username already exists');
            } else {
                throw new InternalServerErrorException();
            }
        }
        
    }
}

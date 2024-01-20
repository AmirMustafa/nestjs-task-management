import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async signUp(authcredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authcredentialsDto;

    // HASH PASSWORD AND STORE IN DB
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    const user = this.userRepository.create({
      username,
      password: hashPassword,
    });

    try {
      await this.userRepository.save(user);
    } catch (err) {
      if (err.code === '23505') {
        // duplicate username
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async signIn(authcredentialsDto: AuthCredentialsDto): Promise<string> {
    const { username, password } = authcredentialsDto;
    const user = await this.userRepository.findOne({ select: ["id", "username", "password"], where: {username} });

    if(user && await bcrypt.compare(password, user.password)) {
        return "login successful";
    } else {
        throw new UnauthorizedException('Please check your login credentials.');
    }
  } 
}

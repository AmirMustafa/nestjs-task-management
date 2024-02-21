import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { JwtPayload } from "./jwt-payload.interface";
import { UnauthorizedException } from "@nestjs/common";

export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {
        super({
            secretOrKey: 'topSecret92',
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
    }

    async validate(payload: JwtPayload): Promise<User> {
        const { username } = payload;
        const user: User = await this.userRepository.findOne({select: ["id", "username", "password"], where: {username}});

        if(!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}
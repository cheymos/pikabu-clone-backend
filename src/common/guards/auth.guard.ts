import { AuthGuard as AG } from '@nestjs/passport';

export class AuthGuard extends AG('jwt') {}

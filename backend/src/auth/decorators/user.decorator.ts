import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    
    // Aquí está accediendo a request.user que podría no tener la estructura esperada
    const user = request;
    
    // Comprueba si hay datos específicos solicitados
    if (data) {
      // Adapta esto a tu estructura
      if (data === 'userId') {
        return user?.id; // Asumiendo que en tu JWT, el ID está en user.id
      }
      if (data === 'userType') {
        return user?.userType; // Asumiendo que el rol está en user.userType
      }
      return user?.[data];
    }
    
    return user;
  },
);
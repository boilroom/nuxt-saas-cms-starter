// import { successResponse, errorResponse } from '~/server/utils/response';

export default eventHandler((event) => {
  const user = event.context.user;
  if (user) {
    return successResponse(event, {
      id: 4920,
      name: {
        en: 'John Doe',
        ru: 'Джон Доу',
        es: 'Juan Nadie',
        it: 'Giovanni Nessuno',
      },
      email: 'jd@gmail.com',
      age: 30,
      description: {
        en: 'This is a mock data',
        ru: 'Это моковые данные',
        es: 'Estos son datos simulados',
        it: 'Questi sono dati simulati',
      },
    });
  } else {
    return errorResponse(event, 'Unauthorized', 401);
  }
});
import { verify } from '@node-rs/argon2';
import { PrismaClient } from '@prisma/client';
import dataValidation from '~/utils/dataValidation';

export default eventHandler(async (event) => {
  const formData = await readFormData(event);

  const email = formData.get('email')?.toString() || '';
  const password = formData.get('password')?.toString() || '';

  const { error: emailError } = dataValidation('email', email);
  const { error: passwordError } = dataValidation('password', password);

  const throwInvalidCredentials = () => {
    throw createError({
      message: 'Invalid credentials',
      data: {
        errorCode: 'invalid_credentials',
      },
      statusCode: 400,
    });
  };

  if (emailError || passwordError) {
    throwInvalidCredentials();
  }

  const prisma = new PrismaClient();
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  }).catch(() => {
    throwInvalidCredentials();
  });

  if (!user?.passwordHash || !user?.id) {
    throwInvalidCredentials();
  } else {
    const validPassword = await verify(user.passwordHash, password, {
      parallelism: 1,
    });

    if (!validPassword) {
      throwInvalidCredentials();
    }

    const session = await lucia.createSession(user.id, {});
    appendHeader(event, "Set-Cookie", lucia.createSessionCookie(session.id).serialize());

    setResponseHeaders(event, {
      'Content-Type': 'application/json',
    });

    return {
      statusCode: 204,
      body: {},
    };
  }
});
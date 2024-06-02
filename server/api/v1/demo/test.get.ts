export default eventHandler((event) => {
  const user = event.context.user;
  return {
    statusCode: 200,
    body: {
      result: user ? `User authenticated with email ${user.email}` : 'User not authenticated',
    },
  };
});
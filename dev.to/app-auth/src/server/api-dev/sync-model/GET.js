import { instance, profileRepository, userRepository } from "_server/db";

export default async (_, res) => {
  await userRepository.sync({ force: true });
  await profileRepository.sync({ force: true });

  const tablas = await instance.getQueryInterface().showAllSchemas();
  res.send({ name: "SYNC MODEL DEV", tablas });
};

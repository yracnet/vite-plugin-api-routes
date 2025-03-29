import { profileRepository } from "_server/db";
import { createCRUDRouter } from "_server/restful";

export default createCRUDRouter(profileRepository);

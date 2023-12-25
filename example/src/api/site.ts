import { createAllowRoles, assertToken } from "../middleware/sessionToken";

export default [
    assertToken,
    createAllowRoles(['SITE']),
];
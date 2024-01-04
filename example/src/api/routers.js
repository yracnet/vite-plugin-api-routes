import { routers } from "@api/routers";

const orders = {
  '/api/auth/': 1,
  '/api/admin/': -1,
  '/api/site/': -1,
};
export const GET = (req, res, next) => {
  const routesKeys = routers
    .filter(it => it.path !== '/api/routers')
    .map((it, ix) => {
      it.key = `r${ix}`;
      return it;
    })
    .sort((a, b) => {
      if (a.path.startsWith('/api/auth/')) {
        return -1;
      }
      if (b.path.startsWith('/api/auth/')) {
        return 0;
      }
      return 0;
    })
  res.send(routesKeys);
};

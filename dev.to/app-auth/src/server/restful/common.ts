import { Op } from "sequelize";

export const NOPE = (v: any) => v;

export type QueryParams = any & {
  sort?: string;
  range?: string;
  filter?: string;
  q?: string;
};

export type QueryOptions = {
  qcols?: string[];
};

export const parseQuery = (
  {
    sort = '["id", "desc"]',
    range = "[0, 9]",
    filter = "{}",
    q = "",
  }: QueryParams,
  { qcols = [] }: QueryOptions = {}
) => {
  const _sort = JSON.parse(sort);
  const [offset = 0, limit = 9] = JSON.parse(range);
  const _filter = JSON.parse(filter) || {};
  const where: any = {
    [Op.and]: [],
  };
  where[Op.and] = Object.entries(_filter).map(([name, value]) => {
    if (Array.isArray(value)) {
      value = {
        [Op.in]: value,
      };
    }
    return {
      [name]: value,
    };
  });
  if (q) {
    where[Op.and].push({
      [Op.or]: qcols.map((name: string) => {
        return {
          [name]: { [Op.like]: `%${q}%` },
        };
      }),
    });
  }
  return {
    offset,
    limit,
    where,
    order: [_sort],
  };
};

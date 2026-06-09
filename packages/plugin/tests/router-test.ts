import { assertConfig } from "../src/model";
import { parseRouteEntry } from "../src/plugin-router/createRouteEntries";

const LEGACY_FILES = [
    {
        dir: 'c:/proyect/src/api',
        route: 'v1',
        files: [
            'index.js',
            'a/index.js',
            'a/b/index.js',
            'a/b/c.js',
            'd/[].js',
            'e/[...].js',
            'f/[...path].js',
            'g/[name].js',
            'g/[name]/x.js',
            'x/$id.js',
            'y/$$slug.js',
        ]
    }
];

const LEGACY_ROUTES = `
API_000|AUTH    |m_10    |/v1/                |../src/api/index.js                               |100_v1_010
API_001|SERVICE |m_20    |/v1/                |../src/api/index.js                               |100_v1_020
API_002|AUTH    |m_10    |/v1/a/              |../src/api/a/index.js                             |100_v1_100_a_010
API_003|SERVICE |m_20    |/v1/a/              |../src/api/a/index.js                             |100_v1_100_a_020
API_004|AUTH    |m_10    |/v1/a/b/            |../src/api/a/b/index.js                           |100_v1_100_a_100_b_010
API_005|SERVICE |m_20    |/v1/a/b/            |../src/api/a/b/index.js                           |100_v1_100_a_100_b_020
API_006|AUTH    |m_10    |/v1/a/b/c           |../src/api/a/b/c.js                               |100_v1_100_a_100_b_100_c_010
API_007|SERVICE |m_20    |/v1/a/b/c           |../src/api/a/b/c.js                               |100_v1_100_a_100_b_100_c_020
API_008|ERROR   |m120    |/v1/a/b/c           |../src/api/a/b/c.js                               |100_v1_100_a_100_b_100_c_120
API_009|ERROR   |m120    |/v1/a/b/            |../src/api/a/b/index.js                           |100_v1_100_a_100_b_120
API_010|ERROR   |m120    |/v1/a/              |../src/api/a/index.js                             |100_v1_100_a_120
API_011|AUTH    |m_10    |/v1/d/*             |../src/api/d/[].js                                |100_v1_100_d_110_[]_010
API_012|SERVICE |m_20    |/v1/d/*             |../src/api/d/[].js                                |100_v1_100_d_110_[]_020
API_013|ERROR   |m120    |/v1/d/*             |../src/api/d/[].js                                |100_v1_100_d_110_[]_120
API_014|AUTH    |m_10    |/v1/e/*             |../src/api/e/[...].js                             |100_v1_100_e_110_[...]_010
API_015|SERVICE |m_20    |/v1/e/*             |../src/api/e/[...].js                             |100_v1_100_e_110_[...]_020
API_016|ERROR   |m120    |/v1/e/*             |../src/api/e/[...].js                             |100_v1_100_e_110_[...]_120
API_017|AUTH    |m_10    |/v1/f/*path         |../src/api/f/[...path].js                         |100_v1_100_f_110_[...path]_010
API_018|SERVICE |m_20    |/v1/f/*path         |../src/api/f/[...path].js                         |100_v1_100_f_110_[...path]_020
API_019|ERROR   |m120    |/v1/f/*path         |../src/api/f/[...path].js                         |100_v1_100_f_110_[...path]_120
API_020|AUTH    |m_10    |/v1/g/:name         |../src/api/g/[name].js                            |100_v1_100_g_110_[name]_010
API_021|SERVICE |m_20    |/v1/g/:name         |../src/api/g/[name].js                            |100_v1_100_g_110_[name]_020
API_022|AUTH    |m_10    |/v1/g/:name/x       |../src/api/g/[name]/x.js                          |100_v1_100_g_110_[name]_100_x_010
API_023|SERVICE |m_20    |/v1/g/:name/x       |../src/api/g/[name]/x.js                          |100_v1_100_g_110_[name]_100_x_020
API_024|ERROR   |m120    |/v1/g/:name/x       |../src/api/g/[name]/x.js                          |100_v1_100_g_110_[name]_100_x_120
API_025|ERROR   |m120    |/v1/g/:name         |../src/api/g/[name].js                            |100_v1_100_g_110_[name]_120
API_026|AUTH    |m_10    |/v1/x/:id           |../src/api/x/$id.js                               |100_v1_100_x_110_$id_010
API_027|SERVICE |m_20    |/v1/x/:id           |../src/api/x/$id.js                               |100_v1_100_x_110_$id_020
API_028|ERROR   |m120    |/v1/x/:id           |../src/api/x/$id.js                               |100_v1_100_x_110_$id_120
API_029|AUTH    |m_10    |/v1/y/*slug         |../src/api/y/$$slug.js                            |100_v1_100_y_110_$$slug_010
API_030|SERVICE |m_20    |/v1/y/*slug         |../src/api/y/$$slug.js                            |100_v1_100_y_110_$$slug_020
API_031|ERROR   |m120    |/v1/y/*slug         |../src/api/y/$$slug.js                            |100_v1_100_y_110_$$slug_120
API_032|ERROR   |m120    |/v1/                |../src/api/index.js                               |100_v1_120
`;

const ISOLATED_FILES = [
    {
        dir: 'c:/proyect/src/api',
        route: 'v1',
        files: [
            'SERVICE.js',
            'ERROR.js',
            'AUTH.js',
            'a/SERVICE.js',
            'a/ERROR.js',
            'a/[id]/ERROR.js',
            'a/[id]/AUTH.js',
            'a/[id]/SERVICE.js',
            'b/ERROR.js',
            'b/AUTH.js',
            'b/c/ERROR.js',
            'b/c/SERVICE.js',
            'p1/[]/SERVICE.js',
            'p2/[...]/SERVICE.js',
            'p3/[...path]/SERVICE.js',
            'x1/$$/SERVICE.js',
            'x2/$$slug/SERVICE.js',
            'x3/$id/SERVICE.js',
        ]
    }
];
const ISOLATED_ROUTES = `
API_000|AUTH    |m_10    |/v1                 |../src/api/AUTH.js                                |100_v1_010
API_001|SERVICE |m_20    |/v1                 |../src/api/SERVICE.js                             |100_v1_020
API_002|SERVICE |m_20    |/v1/a               |../src/api/a/SERVICE.js                           |100_v1_100_a_020
API_003|AUTH    |m_10    |/v1/a/:id           |../src/api/a/[id]/AUTH.js                         |100_v1_100_a_110_[id]_010
API_004|SERVICE |m_20    |/v1/a/:id           |../src/api/a/[id]/SERVICE.js                      |100_v1_100_a_110_[id]_020
API_005|ERROR   |m120    |/v1/a/:id           |../src/api/a/[id]/ERROR.js                        |100_v1_100_a_110_[id]_120
API_006|ERROR   |m120    |/v1/a               |../src/api/a/ERROR.js                             |100_v1_100_a_120
API_007|AUTH    |m_10    |/v1/b               |../src/api/b/AUTH.js                              |100_v1_100_b_010
API_008|SERVICE |m_20    |/v1/b/c             |../src/api/b/c/SERVICE.js                         |100_v1_100_b_100_c_020
API_009|ERROR   |m120    |/v1/b/c             |../src/api/b/c/ERROR.js                           |100_v1_100_b_100_c_120
API_010|ERROR   |m120    |/v1/b               |../src/api/b/ERROR.js                             |100_v1_100_b_120
API_011|SERVICE |m_20    |/v1/p1/*            |../src/api/p1/[]/SERVICE.js                       |100_v1_100_p1_110_[]_020
API_012|SERVICE |m_20    |/v1/p2/*            |../src/api/p2/[...]/SERVICE.js                    |100_v1_100_p2_110_[...]_020
API_013|SERVICE |m_20    |/v1/p3/*path        |../src/api/p3/[...path]/SERVICE.js                |100_v1_100_p3_110_[...path]_020
API_014|SERVICE |m_20    |/v1/x1/*            |../src/api/x1/$$/SERVICE.js                       |100_v1_100_x1_110_$$_020
API_015|SERVICE |m_20    |/v1/x2/*slug        |../src/api/x2/$$slug/SERVICE.js                   |100_v1_100_x2_110_$$slug_020
API_016|SERVICE |m_20    |/v1/x3/:id          |../src/api/x3/$id/SERVICE.js                      |100_v1_100_x3_110_$id_020
API_017|ERROR   |m120    |/v1                 |../src/api/ERROR.js                               |100_v1_120
`;

const runLegacy = () => {
    const config = assertConfig({
        mode: 'legacy',
        root: 'c:/proyect/',
        filePriority: 100,
        paramPriority: 110,
        mapper: {
            AUTH: { method: 'm_10', priority: 10 },
            SERVICE: { method: 'm_20', priority: 20 },
            ERROR: { method: 'm120', priority: 120 },
            default: false,
            CRUD: false,
            ACTION: false,
            PING: false,
            USE: false,
            GET: false,
            POST: false,
            PUT: false,
            PATCH: false,
            DELETE: false,
        },
        dirs: [{
            dir: 'src/api',
            route: 'v1'
        }]
    });
    const result = parseRouteEntry(LEGACY_FILES, config)
        .map(it => {
            return `${it.varName}|${it.routeName.padEnd(8, ' ')}|${it.method.padEnd(8, ' ')}|${it.route.padEnd(20, ' ')}|${it.importFile.padEnd(50, ' ')}|${it.order}`
        })
        .join("\n");
    if (LEGACY_ROUTES.trim() === result) {
        console.log("\nLegacy Router Pass\n");
        //console.log(result);
    } else {
        console.log("Expectative Legacy");
        console.log(LEGACY_ROUTES);
        console.log("Output Legacy");
        console.log(result);
        throw Error("Invalid Legacy Mapping")
    }
}

const runIsolated = () => {
    const config = assertConfig({
        mode: 'isolated',
        root: 'c:/proyect/',
        mapper: {
            AUTH: { method: 'm_10', priority: 10 },
            SERVICE: { method: 'm_20', priority: 20 },
            ERROR: { method: 'm120', priority: 120 },
        },
        dirs: [{
            dir: 'src/api',
            route: 'v1'
        }]
    });
    const result = parseRouteEntry(ISOLATED_FILES, config)
        .map(it => {
            return `${it.varName}|${it.routeName.padEnd(8, ' ')}|${it.method.padEnd(8, ' ')}|${it.route.padEnd(20, ' ')}|${it.importFile.padEnd(50, ' ')}|${it.order}`
        })
        .join("\n");
    if (ISOLATED_ROUTES.trim() === result) {
        console.log("\nIsolated Router Pass\n");
        //console.log(result);
    } else {
        console.log("Expectative Isolated");
        console.log(ISOLATED_ROUTES);
        console.log("Output Isolated");
        console.log(result);
        throw Error("Invalid Isolated Mapping")
    }
}
runLegacy();
runIsolated();
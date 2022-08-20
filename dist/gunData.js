const wtNum = (t) => ({
    'stun': 0,
    'light': 1,
    'medium': 2,
    'heavy': 3
}[t]);
const wtByNum = (n) => [
    'stun',
    'light',
    'medium',
    'heavy'
][n];
const noOp = (stats) => stats;
const partsEffects = {
    barrel: {
        standard: noOp,
        suppressed: stats => (Object.assign(Object.assign({}, stats), { pierce: stats.pierce > 0 ? stats.pierce - 1 : 0 }))
    },
    optics: {
        sights: noOp,
        shortScope: stats => ({})
    }
};
export {};

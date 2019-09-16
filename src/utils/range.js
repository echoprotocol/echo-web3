/**
 *
 * @param from
 * @param to
 * @return {Number[]}
 */
export const createRange = (from, to) => new Array(to - from + 1).fill().map((_, i) => i + from);
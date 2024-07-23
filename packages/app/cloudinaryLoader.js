/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

export default ({ src, width, quality }) => {
  const params = [`f_auto`, `c_limit`, `w_${width}`, `q_${quality || `auto`}`];

  const paramsStr = src.toLowerCase().endsWith(`.svg`)
    ? ``
    : `/${params.join(`,`)}`;

  return `https://res.cloudinary.com/cedricmcdougal/image/upload${paramsStr}${src}`;
};

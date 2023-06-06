export const getFile = (type, file) => {
  return `${process.env.REACT_APP_API}/bot/static/${type}/${file}`;
};

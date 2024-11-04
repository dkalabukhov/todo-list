const isSeacrhStringMatches = (name, description, search) => {
  const regExp = new RegExp(search, 'gi');
  return name.search(regExp) !== -1 || description.search(regExp) !== -1;
};

export default isSeacrhStringMatches;
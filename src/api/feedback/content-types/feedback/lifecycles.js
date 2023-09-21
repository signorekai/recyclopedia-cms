module.exports = {
  afterCreate(event) {
    const { result, params } = event;

    console.log(params, result);
    // do something to the result
  },
};

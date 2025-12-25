export function filter(input, update, source) {
  var options = [];
  update(() => {
    const value = input.toLowerCase();
    options = source.filter((s) => {
      return s.label.toLowerCase().indexOf(value) > -1;
    });
  });
  return options;
}

export function filterOnName(input, update, source) {
  var options = [];
  update(() => {
    const value = input.toLowerCase();
    options = source.filter((item) => {
      return item.name.toLowerCase().indexOf(value) > -1;
    });
  });
  return options;
}

export function filterFn(input, update, source) {
  var options = [];
  if (input === "") {
    update(() => {
      options = source;
    });
    return options;
  }
  update(() => {
    const value = input.toLowerCase();
    options = source.filter((v) => v.toLowerCase().indexOf(value) > -1);
  });
  return options;
}

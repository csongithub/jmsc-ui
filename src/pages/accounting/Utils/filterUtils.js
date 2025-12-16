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

export function filterProject(input, update, projects) {
  var options = [];
  update(() => {
    const value = input.toLowerCase();
    options = projects.filter((project) => {
      return project.label.toLowerCase().indexOf(value) > -1;
    });
  });
  return options;
}

export function filterCapital(input, update, capitals) {
  var options = [];
  update(() => {
    const value = input.toLowerCase();
    options = capitals.filter((capital) => {
      return capital.label.toLowerCase().indexOf(value) > -1;
    });
  });
  return options;
}

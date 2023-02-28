const option = {
  dragOptions: {
    animation: 100,
    chosenClass: 'bg-selected',
    // ghostClass: 'bg-select',
  },
  searchOptions: function (text, list) {
    if (!text) {
      return list;
    } else {
      return list.filter(({ name }) => name.toLowerCase().includes(text.toLowerCase()));
    }
  },
  searchOptionsWtidhTargetName: function (targetKey, text, list) {
    if (!text) {
      return list;
    } else {
      return list.filter((item) => {
        if (
          text != '' &&
          item[targetKey] != undefined &&
          item[targetKey] != '' &&
          item[targetKey].toLowerCase().includes(text.toLowerCase())
        ) {
          return item;
        }
      });
    }
  },
};

export default option;

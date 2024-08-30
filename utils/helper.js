exports.sendResponse = (res, status, message, data = {}) => {
  res.status(status).json({
    status,
    message,
    response: data,
  });
};

exports.filterObject = (objs, allowFields) => {
  console.log(allowFields);
  const updatedObject = {};
  Object.keys(objs).forEach((obj) => {
    if (allowFields.includes(obj)) {
      updatedObject[obj] = objs[obj];
    }
  });

  return updatedObject;
};

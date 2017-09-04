'use strict';

export function convertParseObject(parseObj) {
  return {
    ...parseObj.attributes,
    ...(parseObj.getExtAttr ? parseObj.getExtAttr() : null),
    id: parseObj.id,
    labLocalId: parseObj.id ? undefined : parseObj.labLocalId,
    labId: parseObj.labId,
  };
}

export function convertParseObjectList(parseObjList) {
  if (!parseObjList) {
    return [];
  }
  return parseObjList.map(convertParseObject);
}

export function findById(list, id) {
  if (!list || !id) {
    return undefined;
  }
  return list.find((ele, i) => {
    return ele.labId === id;
  });
}

export function findIndexById(list, id) {
  if (!list || !id) {
    return undefined;
  }
  return list.findIndex((ele, i) => {
    return ele.labId === id;
  });
}

/**
 * 判断两个对象(可以是ParseObject 也可以是convertParseObject之后的)的id或labLocalId是否相同
 */
export function isIdEqual(obj1, obj2) {
  if (obj1.id) {
    return obj1.id === obj2.id;
  }
  if (obj1.labLocalId) {
    return obj1.labLocalId === obj2.labLocalId;
  }
  return false;
}

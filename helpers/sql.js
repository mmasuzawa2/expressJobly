const { BadRequestError } = require("../expressError");


function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  //dataToUpdate = key value pair to update the row with.
  //jsToSql = object used to convert js variable name to db column name
  //which are mentioned in the updating methods defined in model class. 
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // if dataToUpdate is {firstName: 'Aliya', age: 32} , returned value would be ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) => //note: second argument of map method equals to the index of the array entry
      `"${ jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    //setCols will be the SET string when updating.
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };




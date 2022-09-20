


const objectValue = (value) => {
    if (typeof value === "undefined" || value === null || typeof value === "boolean" || typeof value === "number") return false;
    if (typeof value === "string" && value.length === 0) return false;
    return true;
  };

const keyValue = (value) => {
    if(Object.keys(value).length === 0) return false;
    return true;
}


module.exports={keyValue,objectValue} // Exporting 
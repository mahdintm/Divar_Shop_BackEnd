import { sql } from "./mysql.js";
export var Category_data = [];
export var Product_data = [];
export var users = {};
async function start() {
  let Category_data_ = await sql(`select * from Category`);
  Category_data_.forEach((element) => {
    if (element.parent != 0) {
      Category_data.forEach((elem) => {
        if (elem.id == element.parent) {
          element.options = JSON.parse(element.options);
          elem.child.push(element);
          Category_data.push(element);
        }
      });
    } else {
      element.child = [];
      element.count = 5;
      element.options = JSON.parse(element.options);
      console.log(element.options);
      Category_data.push(element);
    }
  });
  let Product_data_ = await sql(`select * from Products`);
  Product_data_.forEach((element) => {
    element.registrations = JSON.parse(element.registrations);
    element.imgs = JSON.parse(element.imgs);
    element.options = JSON.parse(element.options);
    Product_data.push(element);
  });
}
start();

export class Users {
  static new_id = () => {};
}

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
          elem.child.push(element);
          Category_data.push(element);
        }
      });
    } else {
      element.child = [];
      element.count = 5;
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

export class Product_Class {
  static new_Product = async (data) => {
    Product_data.push(data);
  };

  static getAllProducts = async () => {
    return Product_data;
  };

  static getProduct = async (id) => {
    for (let i = 0; i < Product_data.length; i++) {
      if (Product_data[i].id == id) {
        return await Product_data[i];
      }
    }
  };

  static changeStatus = async (id, state) => {
    for (let i = 0; i < Product_data.length; i++) {
      if (Product_data[i].id == id) {
        await sql(`UPDATE Products SET active=${state} WHERE id="${id}"`);
        Product_data[i].active = JSON.parse(state);
        return console.log(5, Product_data[i].active);
      }
    }
  };

  static remove = (id) => {
    Product_data.forEach(async (element) => {
      if (element.id == id) {
        await sql(`DELETE FROM Products WHERE id="${id}"`);
        var index = Product_data.indexOf(element);
        if (index != -1) Product_data.splice(index, 1);
      }
    });
  };
}

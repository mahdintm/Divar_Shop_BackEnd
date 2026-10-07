import { sql, sql_arr } from "./mysql.js";
export var Category_data = [];
export var Product_data = [];
export var Setting = [];
export var users = {};
async function start() {
  let Category_data_ = await sql_arr(`select * from Category`);
  if (!Array.isArray(Category_data_)) {
    throw new Error("Category datastore query failed");
  }
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
  let Product_data_ = await sql_arr(`select * from Products`);
  if (!Array.isArray(Product_data_)) {
    throw new Error("Product datastore query failed");
  }
  Product_data_.forEach((element) => {
    element.registrations = JSON.parse(element.registrations);
    element.imgs = JSON.parse(element.imgs);
    element.options = JSON.parse(element.options);
    Product_data.push(element);
  });

  let Setting_ = await sql_arr(`select * from Settings`);
  if (!Array.isArray(Setting_)) {
    throw new Error("Settings datastore query failed");
  }
  Setting_.forEach((element) => {
    element.value = JSON.parse(element.value);
    Setting.push(element);
  });
}
start().catch((error) => {
  console.error("Datastore initialization failed:", error);
});

export class Users {
  static new_id = () => {};
}

export class Settings {
  static get = async (name) => {
    for (let i = 0; i < Setting.length; i++) {
      if (Setting[i].name == name) {
        return Setting[i].value;
      }
    }
  };
  static set = async (name, value) => {
    for (let i = 0; i < Setting.length; i++) {
      if (Setting[i].name == name) {
        const result = await sql("update Settings set value = ? where id = ?", [JSON.stringify(value), Setting[i].id]);
        if (!result) {
          return undefined;
        }
        Setting[i].value = value;
        return Setting[i].value;
      }
    }
  };
}

export class Product_Class {
  static new_Product = async (data) => {
    Product_data.push(data);
  };
  static setAllData = async (id, data) => {
    for (let i = 0; i < Product_data.length; i++) {
      if (Product_data[i].id == id) {
        Product_data[i] = data;
      }
    }
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
        const result = await sql(
          "UPDATE Products SET active = ? WHERE id = ?",
          [state, id]
        );
        if (!result) {
          return false;
        }
        Product_data[i].active = state;
        return true;
      }
    }
    return null;
  };

  static remove = async (id) => {
    for (const element of Product_data) {
      if (element.id == id) {
        const result = await sql("DELETE FROM Products WHERE id = ?", [id]);
        if (!result) {
          return false;
        }
        const index = Product_data.indexOf(element);
        if (index != -1) Product_data.splice(index, 1);
        return true;
      }
    }
    return null;
  };
}

const mysql = require("mysql");
const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
let db;

const init = () => {
  try {
    db = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB,
    });

    if (db) {
      console.log("SQL connected");
    } else console.log("SQL not connected");

    mongoose.connect(
      process.env.MONGO_CONNECT_URL,
      {
        useNewUrlParser: true,
      },
      (err) => {
        if (err) console.log(`MongoDB not connected::::::=>${err}`);
        else console.log(`MongoDB connected`);
      }
    );
    autoIncrement.initialize(mongoose.connection);
  } catch (err) {
    console.log("🚀 - Connection err :", err);
  }
};

init();

const insert = (table, data) => {
  return new Promise((resolve, reject) => {
    const keys = Object.keys(data);
    let valueQus = [];
    const values = keys.map((key) => {
      valueQus.push("?");
      return data[key];
    });
    db.query(
      `INSERT INTO ${table} (${keys.join(",")}) VALUES (${valueQus.join(",")})`,
      values,
      (err, results) => {
        if (err) {
          console.log("🚀 - err", err);
          reject(`Error in insert ${table}`);
        } else {
          resolve(results.insertId);
        }
      }
    );
  });
};

const find = (table, data = {}, col = "") => {
  return new Promise((resolve, reject) => {
    const keys = Object.keys(data);
    const values = keys.map((key) => {
      return data[key];
    });
    const columns = col ? `${col.split(" ").join(", ")}` : "*";
    const condition =
      keys.length > 0 ? `WHERE ${keys.join(" = ? AND ")} = ?` : "";
    const qry = `SELECT ${columns} FROM ${table} ${condition}`;
    db.query(qry, values, (err, results) => {
      if (err) {
        console.log("🚀 - err", err);
        reject(`Error in find ${table}`);
      } else {
        // results.length > 0 ? resolve(results) : resolve(null);
        resolve(results);
      }
    });
  });
};

const findOne = (table, data = {}, col = "") => {
  return new Promise((resolve, reject) => {
    const keys = Object.keys(data);
    const values = keys.map((key) => {
      return data[key];
    });
    const columns = col ? `${col.split(" ").join(", ")}` : "*";
    const condition =
      keys.length > 0 ? `WHERE ${keys.join(" = ? AND ")} = ?` : "";
    const qry = `SELECT ${columns} FROM ${table} ${condition} LIMIT 1`;
    db.query(qry, values, (err, results) => {
      if (err) {
        console.log("🚀 - err", err);
        reject(`Error in find ${table}`);
      } else {
        results.length > 0 ? resolve(results[0]) : resolve(null);
      }
    });
  });
};

const update = (table, cond = {}, set = {}) => {
  return new Promise((resolve, reject) => {
    const condKeys = Object.keys(cond);
    const setKeys = Object.keys(set);
    let values = [];
    values.push(
      ...setKeys.map((key) => {
        return set[key];
      })
    );
    values.push(
      ...condKeys.map((key) => {
        return cond[key];
      })
    );

    const qry = `UPDATE ${table} SET ${setKeys.join(
      " = ?, "
    )} = ? WHERE ${condKeys.join(" = ? AND ")} = ?`;
    db.query(qry, values, (err, results) => {
      if (err) {
        console.log("🚀 - err", err);
        reject(`Error in update ${table}`);
      } else {
        resolve(results);
      }
    });
  });
};

const deleteOne = (table, cond = {}) => {
  return new Promise((resolve, reject) => {
    const condKeys = Object.keys(cond);
    let values = condKeys.map((key) => {
      return cond[key];
    });

    const qry = `DELETE FROM ${table} WHERE ${condKeys.join(" = ? AND ")} = ?`;
    db.query(qry, values, (err, results) => {
      if (err) {
        console.log("🚀 - err", err);
        reject(`Error in delete ${table}`);
      } else {
        resolve(results);
      }
    });
  });
};

const call = async () => {
  /* try {
    const res = await insert("sessions", { client_id: 1, name: "test" });
    console.log(res);
  } catch (error) {
    console.log(error);
  } */
  /* try {
    const res = await find("sessions", { client_id: 1 });
    console.log(res);
  } catch (error) {
    console.log(error);
  } */
  /* try {
    const res = await update("sessions", { id: 14 }, { name: "test" });
    console.log(res);
  } catch (error) {
    console.log(error);
  } */
};

// call();

module.exports = { db, insert, find, findOne, update, deleteOne };

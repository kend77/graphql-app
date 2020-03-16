import Sequelize from "sequelize";
import db from "../db";

export default db.define("card", {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.TEXT
  },
  // we will manage a semicolon separated list
  labels: {
    type: Sequelize.TEXT
  },
  dueDate: {
    type: Sequelize.DATE
  }
});

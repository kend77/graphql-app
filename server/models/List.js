import Sequelize from "sequelize";
import db from "../db";
const List = db.define("list", {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

export default List;

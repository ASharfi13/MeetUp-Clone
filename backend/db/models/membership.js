'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Membership extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Membership.init({
    userId: {
      type: DataTypes.INTEGER,
      field: "userId"
    },
    groupId: {
      type: DataTypes.INTEGER,
      field: "groupId"
    },
    status: {
      type: DataTypes.STRING,
      field: "status",
      validate: {
        isValidMembership(value) {
          const validMemberships = ['pending', 'co-host', 'member'];
          if (!validMemberships.includes(value)) {
            throw new Error("Invalid Membership Status")
          }
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Membership',
    defaultScope: {
      attributes: {
        exclude: ["createdAt", "updatedAt"]
      }
    }
  });
  return Membership;
};

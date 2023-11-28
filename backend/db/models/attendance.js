'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Attendance.init({
    eventId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    status: {
      type: DataTypes.STRING,
      validate: {
        isValidStatus(value) {
          validStatuses = ['waitlist', 'pending', 'attending'];
          if (!validStatuses.includes(value)) {
            throw new Error('Invalid Attendance Status')
          }
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Attendance',
  });
  return Attendance;
};

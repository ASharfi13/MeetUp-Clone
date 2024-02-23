'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Group.hasMany(models.Venue, {
        foreignKey: "groupId",
        onDelete: "CASCADE",
        hooks: true
      })

      Group.hasMany(models.GroupImage, {
        foreignKey: "groupId",
        onDelete: "CASCADE",
        hooks: true
      })

      Group.belongsToMany(models.User, {
        through: models.Membership,
        foreignKey: "groupId",
        otherKey: "userId",
        as: "members"
      })

      Group.belongsTo(models.User, {
        foreignKey: "organizerId",
        as: "Organizer"
      })

      Group.hasMany(models.Event, {
        foreignKey: "groupId",
        onDelete: "CASCADE",
        hooks: true
      })
    }
  }
  Group.init({
    organizerId: DataTypes.INTEGER,
    name: {
      type: DataTypes.STRING()
    },
    about: {
      type: DataTypes.TEXT
    },
    type: {
      type: DataTypes.STRING
    },
    private: {
      type: DataTypes.BOOLEAN
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    backgroundImg: {
      type: DataTypes.STRING,
    }
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};

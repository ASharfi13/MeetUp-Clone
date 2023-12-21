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
      type: DataTypes.STRING(),
      validate: {
        isLessThan60Char(value) {
          if (value.length > 60) {
            throw new Error("Name must be 60 characters or less")
          }
        }
      }
    },
    about: {
      type: DataTypes.TEXT,
      validate: {
        isAtLeast50Char(value) {
          if (value.length < 50) {
            throw new Error("About must be at least 50 Characters or more");
          }
        }
      }
    },
    type: {
      type: DataTypes.STRING,
      validate: {
        isValidType(value) {
          const validTypes = ['Online', 'In person']
          if (!validTypes.includes(value)) {
            throw new Error('Type must be \'Online\' or \'In person\'')
          }
        }
      }
    },
    private: {
      type: DataTypes.BOOLEAN,
      validate: {
        isBoolean(value) {
          if (typeof value !== "boolean") {
            throw new Error("Private must be a boolean")
          }
        }
      }
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isNotEmptyStr(value) {
          if (value.length === 0) {
            throw new Error("City is required")
          }
        }
      }
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isNotEmptyAndValidStateStr(value) {
          if (value.length === 0) {
            throw new Error("State is required")
          }
        },
      },
    }
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};

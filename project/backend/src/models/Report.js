const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Report = sequelize.define('Report', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  reporterId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'reporter_id'
  },
  targetType: {
    type: DataTypes.ENUM('post', 'comment'),
    allowNull: false,
    field: 'target_type'
  },
  targetId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'target_id'
  },
  reason: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  description: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending'
  },
  handledAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'handled_at'
  }
}, {
  tableName: 'reports',
  timestamps: true,
  underscored: true
});

Report.associate = (models) => {
  Report.belongsTo(models.User, { as: 'reporter', foreignKey: 'reporterId' });
  Report.belongsTo(models.Comment, { foreignKey: 'targetId', constraints: false });
  Report.belongsTo(models.Post, { foreignKey: 'targetId', constraints: false });
};

module.exports = Report;
import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/Database.js';

const TriggerModel = sequelize.define('Trigger', {
  group_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  timestamp: {
    type: DataTypes.BIGINT, // Menggunakan INTEGER untuk menyimpan timestamp UNIX
    allowNull: false
  }
}, {
  tableName: 'triggers',
  timestamps: true
});

export default TriggerModel;

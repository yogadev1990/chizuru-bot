import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/Database.js';

const GrupModel = sequelize.define('Grupping', {
  group_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  timeremaining: {
    type: DataTypes.BIGINT, // Menggunakan INTEGER untuk menyimpan timestamp UNIX
    allowNull: false
  },
  antivirtex: {
    type: DataTypes.BOOLEAN, // Menggunakan INTEGER untuk menyimpan timestamp UNIX
    allowNull: false
  },
  antitoxic: {
    type: DataTypes.BOOLEAN, // Menggunakan INTEGER untuk menyimpan timestamp UNIX
    allowNull: false
  },
  antilink: {
    type: DataTypes.BOOLEAN, // Menggunakan INTEGER untuk menyimpan timestamp UNIX
    allowNull: false
  },
  welcome: {
    type: DataTypes.BOOLEAN, // Menggunakan INTEGER untuk menyimpan timestamp UNIX
    allowNull: false
  },
  out: {
    type: DataTypes.BOOLEAN, // Menggunakan INTEGER untuk menyimpan timestamp UNIX
    allowNull: false
  },
  nsfw: {
    type: DataTypes.BOOLEAN, // Menggunakan INTEGER untuk menyimpan timestamp UNIX
    allowNull: false
  },
  welcomemsg: {
    type: DataTypes.STRING, // Menggunakan INTEGER untuk menyimpan timestamp UNIX
    allowNull: true
  }
}, {
  tableName: 'grup_data',
  timestamps: true
});

export default GrupModel;

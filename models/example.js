module.exports = function (sequelize, DataTypes) {
  const Example = sequelize.define('Example', {
    image: DataTypes.STRING,
    title: DataTypes.TEXT,
    year: DataTypes.INTEGER,
    author: DataTypes.STRING,
    director: DataTypes.STRING,
    cast: DataTypes.TEXT,
    genre: DataTypes.STRING,
    synopsis: DataTypes.TEXT,
    rating: DataTypes.STRING,
    review: DataTypes.TEXT
  });

  Example.associate = function (models) {
    Example.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Example;
};

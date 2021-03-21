module.exports = function (sequelize, DataTypes) {
  const Example = sequelize.define('Example', {
    mediaType: DataTypes.STRING,
    image: DataTypes.TEXT,
    title: DataTypes.TEXT,
    year: DataTypes.INTEGER,
    author: DataTypes.STRING,
    director: DataTypes.STRING,
    cast: DataTypes.TEXT,
    genre: DataTypes.STRING,
    synopsis: DataTypes.TEXT,
    rating: DataTypes.INTEGER,
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

module.exports = (db) => {
  db.User.create({
    firstName: 'Adam',
    lastName: 'Gates',
    email: 'adam@gates.com',
    password: process.env.ADMIN_USER_PWD,
    isAdmin: true
  }).then(() => {
      db.Example.create({
        UserId: 1,
        image: 'Sample image',
        title: 'The Twentiety Century',
        year: '2019',
        author: null,
        director: "Matthew Rankin",
        cast: "Dan Beirne, Sarianne Cormier, Catherine St-Laurent",
        genre: "Biography, Comedy, Drama",
        synopsis: "Toronto, 1899. Aspiring young politician Mackenzie King dreams of becoming the Prime Minister of Canada. But he hesitates in love between a British soldier and a French-Canadian nurse, King furtively indulges a fetishistic obsession that may well be his downfall. In his quest for power, King must gratify the expectations of his imperious Mother, the hawkish fantasies of a war-mongering Governor-General and the utopian idealism of a Québécois mystic before facing the final test of leadership. Culminating in an epic battle between good and evil, King learns that disappointment may be the only way to survive the 20th century.",
        rating: "4/5",
        review: "Wild, Anna Biller-esque retro-mod fever dream." 
      });
    });
  });
};

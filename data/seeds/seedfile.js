exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('jokes').truncate()
    .then(function () {
     
      return knex('books').insert([
        {joke: "What did the Tin Man say when he got run over by a steamroller?", punchline: "Curses! Foil again"},
        {joke: "how do you make a tissue dance?", punchline: "Put a lttle boogie in it"},
        {joke: "What is an astronauts's favortie part of the computer?", punchline: "The spacebar"},
        {joke: "What do you get from a pampered cow?", punchline: "Spoiled Milk"},
        {joke: "Why is it annoying to eat next to basketball players", punchline: "They dribble all the time"},
        {joke: "The numbers 19 and 20 got into a fight...", punchline:21},
      ]);
    });
};

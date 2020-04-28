import { Movie } from '../models/Movie';

export  const moviesList: Movie[] = [
  {
      "id": 4,
      "name": "Crocodile Dundee",
      "year": "1986",
      "runtime": "97",
      "categories": [
          "Adventure",
          "Comedy"
      ],
      "director": "Peter Faiman",
      "actors": "Paul Hogan, Linda Kozlowski, John Meillon, David Gulpilil",
      "description": "An American reporter goes to the Australian outback to meet an eccentric crocodile poacher and invites him to New York City.",
      "imageUrl": "https://images-na.ssl-images-amazon.com/images/M/MV5BMTg0MTU1MTg4NF5BMl5BanBnXkFtZTgwMDgzNzYxMTE@._V1_SX300.jpg",
  },
  {
      "id": 6,
      "name": "Ratatouille",
      "year": "2007",
      "runtime": "111",
      "categories": [
          "Animation",
          "Comedy",
          "Family"
      ],
      "director": "Brad Bird, Jan Pinkava",
      "actors": "Patton Oswalt, Ian Holm, Lou Romano, Brian Dennehy",
      "description": "A rat who can cook makes an unusual alliance with a young kitchen worker at a famous restaurant.",
      "imageUrl": "https://images-na.ssl-images-amazon.com/images/M/MV5BMTMzODU0NTkxMF5BMl5BanBnXkFtZTcwMjQ4MzMzMw@@._V1_SX300.jpg"
  },
  {
      "id": 7,
      "name": "City of God",
      "year": "2002",
      "runtime": "130",
      "categories": [
          "Crime",
          "Drama"
      ],
      "director": "Fernando Meirelles, Kátia Lund",
      "actors": "Alexandre Rodrigues, Leandro Firmino, Phellipe Haagensen, Douglas Silva",
      "description": "Two boys growing up in a violent neighborhood of Rio de Janeiro take different paths: one becomes a photographer, the other a drug dealer.",
      "imageUrl": "https://images-na.ssl-images-amazon.com/images/M/MV5BMjA4ODQ3ODkzNV5BMl5BanBnXkFtZTYwOTc4NDI3._V1_SX300.jpg"
  },
  {
      "id": 17,
      "name": "The Third Man",
      "year": "1949",
      "runtime": "93",
      "categories": [
          "Film-Noir",
          "Mystery",
          "Thriller"
      ],
      "director": "Carol Reed",
      "actors": "Joseph Cotten, Alida Valli, Orson Welles, Trevor Howard",
      "description": "Pulp novelist Holly Martins travels to shadowy, postwar Vienna, only to find himself investigating the mysterious death of an old friend, Harry Lime.",
      "imageUrl": "https://images-na.ssl-images-amazon.com/images/M/MV5BMjMwNzMzMTQ0Ml5BMl5BanBnXkFtZTgwNjExMzUwNjE@._V1_SX300.jpg"
  },
  {
      "id": 18,
      "name": "The Beach",
      "year": "2000",
      "runtime": "119",
      "categories": [
          "Adventure",
          "Drama",
          "Romance"
      ],
      "director": "Danny Boyle",
      "actors": "Leonardo DiCaprio, Daniel York, Patcharawan Patarakijjanon, Virginie Ledoyen",
      "description": "Twenty-something Richard travels to Thailand and finds himself in possession of a strange map. Rumours state that it leads to a solitary beach paradise, a tropical bliss - excited and intrigued, he sets out to find it.",
      "imageUrl": "https://images-na.ssl-images-amazon.com/images/M/MV5BN2ViYTFiZmUtOTIxZi00YzIxLWEyMzUtYjQwZGNjMjNhY2IwXkEyXkFqcGdeQXVyNDk3NzU2MTQ@._V1_SX300.jpg"
  },
  {
      "id": 19,
      "name": "Scarface",
      "year": "1983",
      "runtime": "170",
      "categories": [
          "Crime",
          "Drama"
      ],
      "director": "Brian De Palma",
      "actors": "Al Pacino, Steven Bauer, Michelle Pfeiffer, Mary Elizabeth Mastrantonio",
      "description": "In Miami in 1980, a determined Cuban immigrant takes over a drug cartel and succumbs to greed.",
      "imageUrl": "https://images-na.ssl-images-amazon.com/images/M/MV5BMjAzOTM4MzEwNl5BMl5BanBnXkFtZTgwMzU1OTc1MDE@._V1_SX300.jpg"
  },
  {
      "id": 21,
      "name": "Black Swan",
      "year": "2010",
      "runtime": "108",
      "categories": [
          "Drama",
          "Thriller"
      ],
      "director": "Darren Aronofsky",
      "actors": "Natalie Portman, Mila Kunis, Vincent Cassel, Barbara Hershey",
      "description": "A committed dancer wins the lead role in a production of Tchaikovsky's \"Swan Lake\" only to find herself struggling to maintain her sanity.",
      "imageUrl": "https://images-na.ssl-images-amazon.com/images/M/MV5BNzY2NzI4OTE5MF5BMl5BanBnXkFtZTcwMjMyNDY4Mw@@._V1_SX300.jpg"
  },
  {
      "id": 22,
      "name": "Inception",
      "year": "2010",
      "runtime": "148",
      "categories": [
          "Action",
          "Adventure",
          "Sci-Fi"
      ],
      "director": "Christopher Nolan",
      "actors": "Leonardo DiCaprio, Joseph Gordon-Levitt, Ellen Page, Tom Hardy",
      "description": "A thief, who steals corporate secrets through use of dream-sharing technology, is given the inverse task of planting an idea into the mind of a CEO.",
      "imageUrl": "https://images-na.ssl-images-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg"
  },
  {
      "id": 26,
      "name": "The Silence of the Lambs",
      "year": "1991",
      "runtime": "118",
      "categories": [
          "Crime",
          "Drama",
          "Thriller"
      ],
      "director": "Jonathan Demme",
      "actors": "Jodie Foster, Lawrence A. Bonney, Kasi Lemmons, Lawrence T. Wrentz",
      "description": "A young F.B.I. cadet must confide in an incarcerated and manipulative killer to receive his help on catching another serial killer who skins his victims.",
      "imageUrl": "https://images-na.ssl-images-amazon.com/images/M/MV5BMTQ2NzkzMDI4OF5BMl5BanBnXkFtZTcwMDA0NzE1NA@@._V1_SX300.jpg"
  },
  {
      "id": 29,
      "name": "Midnight Express",
      "year": "1978",
      "runtime": "121",
      "categories": [
          "Crime",
          "Drama",
          "Thriller"
      ],
      "director": "Alan Parker",
      "actors": "Brad Davis, Irene Miracle, Bo Hopkins, Paolo Bonacelli",
      "description": "Billy Hayes, an American college student, is caught smuggling drugs out of Turkey and thrown into prison.",
      "imageUrl": "https://images-na.ssl-images-amazon.com/images/M/MV5BMTQyMDA5MzkyOF5BMl5BanBnXkFtZTgwOTYwNTcxMTE@._V1_SX300.jpg"
  },
  {
      "id": 30,
      "name": "Pulp Fiction",
      "year": "1994",
      "runtime": "154",
      "categories": [
          "Crime",
          "Drama"
      ],
      "director": "Quentin Tarantino",
      "actors": "Tim Roth, Amanda Plummer, Laura Lovelace, John Travolta",
      "description": "The lives of two mob hit men, a boxer, a gangster's wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
      "imageUrl": "https://images-na.ssl-images-amazon.com/images/M/MV5BMTkxMTA5OTAzMl5BMl5BanBnXkFtZTgwNjA5MDc3NjE@._V1_SX300.jpg"
  },
  {
      "id": 31,
      "name": "Lock, Stock and Two Smoking Barrels",
      "year": "1998",
      "runtime": "107",
      "categories": [
          "Comedy",
          "Crime"
      ],
      "director": "Guy Ritchie",
      "actors": "Jason Flemyng, Dexter Fletcher, Nick Moran, Jason Statham",
      "description": "A botched card game in London triggers four friends, thugs, weed-growers, hard gangsters, loan sharks and debt collectors to collide with each other in a series of unexpected events, all for the sake of weed, cash and two antique shotguns.",
      "imageUrl": "https://images-na.ssl-images-amazon.com/images/M/MV5BMTAyN2JmZmEtNjAyMy00NzYwLThmY2MtYWQ3OGNhNjExMmM4XkEyXkFqcGdeQXVyNDk3NzU2MTQ@._V1_SX300.jpg"
  },
  {
      "id": 32,
      "name": "Lucky Number Slevin",
      "year": "2006",
      "runtime": "110",
      "categories": [
          "Crime",
          "Drama",
          "Mystery"
      ],
      "director": "Paul McGuigan",
      "actors": "Josh Hartnett, Bruce Willis, Lucy Liu, Morgan Freeman",
      "description": "A case of mistaken identity lands Slevin into the middle of a war being plotted by two of the city's most rival crime bosses: The Rabbi and The Boss. Slevin is under constant surveillance by relentless Detective Brikowski as well as the infamous assassin Goodkat and finds himself having to hatch his own ingenious description to get them before they get him.",
      "imageUrl": "https://images-na.ssl-images-amazon.com/images/M/MV5BMzc1OTEwMTk4OF5BMl5BanBnXkFtZTcwMTEzMDQzMQ@@._V1_SX300.jpg"
  },
  {
      "id": 33,
      "name": "Rear Window",
      "year": "1954",
      "runtime": "112",
      "categories": [
          "Mystery",
          "Thriller"
      ],
      "director": "Alfred Hitchcock",
      "actors": "James Stewart, Grace Kelly, Wendell Corey, Thelma Ritter",
      "description": "A wheelchair-bound photographer spies on his neighbours from his apartment window and becomes convinced one of them has committed murder.",
      "imageUrl": "https://images-na.ssl-images-amazon.com/images/M/MV5BNGUxYWM3M2MtMGM3Mi00ZmRiLWE0NGQtZjE5ODI2OTJhNTU0XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg"
  },
  {
      "id": 35,
      "name": "Shutter Island",
      "year": "2010",
      "runtime": "138",
      "categories": [
          "Mystery",
          "Thriller"
      ],
      "director": "Martin Scorsese",
      "actors": "Leonardo DiCaprio, Mark Ruffalo, Ben Kingsley, Max von Sydow",
      "description": "In 1954, a U.S. marshal investigates the disappearance of a murderess who escaped from a hospital for the criminally insane.",
      "imageUrl": "https://images-na.ssl-images-amazon.com/images/M/MV5BMTMxMTIyNzMxMV5BMl5BanBnXkFtZTcwOTc4OTI3Mg@@._V1_SX300.jpg"
  },
  {
      "id": 36,
      "name": "Reservoir Dogs",
      "year": "1992",
      "runtime": "99",
      "categories": [
          "Crime",
          "Drama",
          "Thriller"
      ],
      "director": "Quentin Tarantino",
      "actors": "Harvey Keitel, Tim Roth, Michael Madsen, Chris Penn",
      "description": "After a simple jewelry heist goes terribly wrong, the surviving criminals begin to suspect that one of them is a police informant.",
      "imageUrl": "https://images-na.ssl-images-amazon.com/images/M/MV5BNjE5ZDJiZTQtOGE2YS00ZTc5LTk0OGUtOTg2NjdjZmVlYzE2XkEyXkFqcGdeQXVyMzM4MjM0Nzg@._V1_SX300.jpg"
  }
]

//export default films
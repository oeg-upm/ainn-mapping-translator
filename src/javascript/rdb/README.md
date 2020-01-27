# morph-GraphQL
[![Cyclopt rating](https://qaas.cyclopt.com/api/projects/5d0207e53f2693000422bafc/badge)](https://qaas.cyclopt.com)

Translate OBDA mappings (R2RML/RML) into GraphQL Resolvers

## EXAMPLE Starwars: Translating mappings online for Javascript and a set of CSV files (assuming that you have npm and node or docker installed)

### Dataset
![schema](https://raw.githubusercontent.com/oeg-upm/morph-graphql/master/examples/starwars/schema.png)
- url: https://github.com/oeg-upm/morph-graphql/tree/master/examples/starwars

### Mapping
- url: https://raw.githubusercontent.com/oeg-upm/morph-graphql/master/examples/starwars/mappings.rmlc.ttl

### Queries
![](https://raw.githubusercontent.com/oeg-upm/morph-graphql/master/examples/starwars/queries.png)

### Installation Instructions
With Node:
1. ```npm install```
2. ```git clone https://github.com/oeg-upm/morph-graphql```
3. ```cd morph-graphql```
4. ```cd javascript```
5. ```cd rdb```
6. ```npm install```
7. ```node app.js```

With docker:
1. ```docker run -d -p 8082:8082 --name mapping-translator oegdataintegration/mapping-translator:1.0```

### Running Instructions
1. ```mkdir starwars```
2. ```cd starwars```
3. Translate the corresponding mappings: 
   ```curl -X POST http://localhost:8082/transform -H 'Content-Type: application/json' -d '{ "prog_lang": "javascript", "dataset_type":"csv", "mapping_url":"https://raw.githubusercontent.com/oeg-upm/morph-graphql/master/examples/starwars/mappings.r2rml.ttl", "db_name":"starwars.sqlite", "mapping_language":"r2rml", "queryplanner":"joinmonster" }' > starwars.zip```
4. ```unzip starwars.zip```
5. ```npm install```
6. ```npm start```
7. Go to http://localhost:4321/graphql from your browser, use some of the queries below

### To query the hero in every episode
```
{
  listHeroes {
    episode {
      identifier
      code
    }
    hero {
      identifier
      name
    }
  }
}
```

### to query for the ID and friends of R2-D2
```
{
  listCharacter(name: "R2 D2") {
    identifier
    name
    friends {
      identifier
      charid
      friendId
    }
  }
}
```

### to query for Luke Skywalker directly, using his ID
```
{
  listCharacter(identifier: "http://starwars.mappingpedia.linkeddata.es/character/1000") {
    name
  }
}
```

### to query for both Luke and Leia
```
query FetchLukeAndLeiaAliased {
  luke: listCharacter(identifier: "http://starwars.mappingpedia.linkeddata.es/character/1000") {
    name
  }
  leia: listCharacter(identifier: "http://starwars.mappingpedia.linkeddata.es/character/1003") {
    name
  }
}
```

### to verify that R2-D2 is a droid
```
{
  listCharacter(name: "R2 D2") {
    identifier
    name
    type(name: "Droid") {
      identifier
      name
    }
  }
}
```

### to verify that the hero of episode Empire is a human
```
{
  listHeroes {
    identifier
    hero {
      identifier
      name
      type(name: "Human") {
        identifier
        name
      }
    }
    episode(code: "Empire") {
      identifier
      code
    }
  }
}
```

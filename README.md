# mapping-translator
Translate OBDA mappings (R2RML/RML) into GraphQL Resolvers

## Running the mapping translator
1. ```git clone https://github.com/oeg-upm/mapping-translator```
2. ```cd mapping-translator```
3. ```npm install```
4. ```node app.js```

## Translating RML mappings to GraphQL Resolvers for MongoDB and Python (Assuming that you have MongoDB, python and pip installed on your computer)
1. go to localhost:8082/transform
2. specify your rml mappings
3. click the "submit" button, hopefully a zip file containing all the necessary files will be generated
4. unzip that zip file and run the "startup.sh" script
5. Your graphql application is now ready at http://localhost:5000/graphql

## Example (Person is mapped to collection Persona, name is mapped to field nombre)
- mapping: https://raw.githubusercontent.com/oeg-upm/mapping-translator/master/example/persona.rml.ttl

## To query all persons 
```
query { Person { name } }
```
## To add a person
```
mutation {
  createPerson(name: "Bob") {
    person {
      name
    }
  }
}
```

# Screenshot
![screenshot](https://github.com/oeg-upm/mapping-translator/raw/master/example/screenshot.png)

![screenshot-graphql](https://github.com/oeg-upm/mapping-translator/raw/master/example/screenshot-graphql.png)

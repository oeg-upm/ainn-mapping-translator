var fs = require('fs');

exports.generateSchema = function(class_name, logical_source,
  predicate_object, listOfPredicateObjectMap) {
  //var predicates = Object.keys(predicate_object)
  var predicates = Object.keys(listOfPredicateObjectMap)

  var schema  ="";
  schema += "\ttype Query {" + "\n"
  schema += `\t\t${class_name}(`
  schema += predicates.reduce(function(filtered, predicate) {
    let objectMap = listOfPredicateObjectMap[predicate];
    if(objectMap.referenceValue || objectMap.functionString) {
      filtered.push(predicate + ":String")
    }
    return filtered
  }, []).join(",")
  schema += `): [${class_name}]`  + "\n"
  schema += "\t}"  + "\n"

  schema += "\ttype Mutation {" + "\n"
  schema += `\t\tcreate${class_name}(`
  schema += predicates.reduce(function(filtered, predicate) {
    let objectMap = listOfPredicateObjectMap[predicate];
    if(objectMap.referenceValue) {
      filtered.push(predicate + ":String")
    }
    return filtered
  }, []).join(",")
  schema += `): ${class_name}`  + "\n"
  schema += "\t}"  + "\n"

  schema +=  "\n"
  schema += `\ttype ${class_name} {` +  "\n"
  /*
  for(i=0;i<predicates.length;i++){
    schema += `\t\t${predicates[i]}: String` + "\n"
  }
  */
  schema += predicates.map(function(predicate) {
    return "\t\t" + predicate + ":String"
  }).join("\n") + "\n"

  schema += "\t}"  + "\n"
  //console.log("schema = \n" + schema)
  //console.log("\n\n\n")
  return schema;
}

exports.generateModel = function(class_name, logical_source,
  predicate_object, listOfPredicateObjectMap) {
  var predicates = Object.keys(predicate_object)

  var model = "";
  model += `class ${class_name} {\n`

  /*
  model += predicates.reduce(function(filtered, predicate) {
    let objectMap = listOfPredicateObjectMap[predicate];
    filtered.push("\t" + predicate + "() { return this." + predicate + " }")
    return filtered
  }, []).join("\n") + " \n";
  */
  model += `}`
  //console.log("model = \n" + model)
  //console.log("\n\n\n")
  return model;
}

exports.generateResolvers = function(class_name, logical_source,
  predicate_object_maps, listOfPredicateObjectMap) {
  let queryResolversString = this.generateQueryResolvers(class_name, logical_source,
    predicate_object_maps, listOfPredicateObjectMap);
  let mutationResolversString = this.generateMutationResolvers(class_name, logical_source,
    predicate_object_maps, listOfPredicateObjectMap);
  let resolversString = queryResolversString + "\t,\n" + mutationResolversString;

  //console.log("resolversString = \n" + resolversString)
  //console.log("\n\n\n")
  return resolversString;
}

exports.generateQueryResolvers = function(class_name, logical_source,
  predicate_object_maps, listOfPredicateObjectMap) {
  //console.log("listOfPredicateObjectMap = " + listOfPredicateObjectMap)
  var predicates = Object.keys(listOfPredicateObjectMap)
  let objectMaps = Object.values(listOfPredicateObjectMap)
  let projections = objectMaps.reduce(function(filtered, objectMap) {
    if(objectMap.referenceValue) {
      filtered.push(objectMap.referenceValue)
    } else if(objectMap.functionString) {
      //filtered.push(`${objectMap.functionString}`)

      let omHash = objectMap.getHashCode();
      filtered.push(`${objectMap.functionString} AS ${omHash}`)
    }
    return filtered
  }, []).join(",");

  var resolvers = "";
  resolvers += `\t${class_name}: function({`
  resolvers += predicates.reduce(function(filtered, predicate) {
    let objectMap = listOfPredicateObjectMap[predicate];
    if(objectMap.referenceValue || objectMap.functionString) {
      filtered.push(predicate)
    }
    return filtered
  }, []).join(",")
  resolvers += `}) {\n`
  let sqlSelectFrom = `SELECT ${projections} FROM ${logical_source}`
  resolvers += "\t\tlet sqlSelectFrom = `" + sqlSelectFrom + "`\n"
  resolvers += `\t\tlet sqlWhere = []\n`

  /*
  for(i=0;i<predicates.length;i++){
    resolvers += "\t\tif(" + predicates.map(function(predicate) {
      return predicate + " != null"}
      ).join(" && ") + ") {\n"
    resolvers += `\t\t\tsqlWhere = sqlWhere + " ${objects[i]} = '"+ ${predicates[i]} +"'"\n`
  }
  resolvers += "\t\t}\n"
  */

  let equalityString = predicates.reduce(function(filtered, predicate) {
    let objectMap = listOfPredicateObjectMap[predicate];
    if(objectMap.referenceValue) {
      filtered.push(`\t\tif(${predicate} != null) { sqlWhere.push("${objectMap.referenceValue} = '"+ ${predicate} +"'") }`)
    } else if(objectMap.functionString) {
      let omHash = objectMap.getHashCode();
      filtered.push(`\t\tif(${predicate} != null) { sqlWhere.push("${omHash} = '"+ ${predicate} +"'") }`)
    }
    return filtered
  }, []).join("\n")
  //console.log("equalityString = " + equalityString)
  resolvers += equalityString + "\n"

  resolvers += '\t\tlet sql = "";\n'
  resolvers += '\t\tif(sqlWhere.length == 0) { sql = sqlSelectFrom} else { sql = sqlSelectFrom + " WHERE " + sqlWhere.join("AND") }\n';
  resolvers += '\t\tlet data = db.all(sql);\n'
  resolvers += "\t\tconsole.log(`sql = ${sql}`)\n"
  resolvers += '\t\tlet allInstances = [];\n'
  resolvers += '\t\treturn data.then(rows => {\n';
  resolvers += '\t\t\trows.forEach((row) => {\n';

  resolvers += "\t\t\t\t" + `let instance = new ${class_name}();\n`
  /*
  for(i=0;i<predicates.length;i++){
    resolvers += `\t\t\t\t\instance.${predicates[i]} = row["${objects[i]}"];\n`
  }
  */
  resolvers += predicates.reduce(function(filtered, predicate) {
    let objectMap = listOfPredicateObjectMap[predicate];
    if(objectMap.referenceValue) {
      filtered.push(`\t\t\t\t\instance.${predicate} = row["${objectMap.referenceValue}"];`)
    } else if(objectMap.template) {
      //let templateString = objectMap.template.replaceAll("{", '${row["').replace("}", '"]}')
      let templateString = objectMap.template.split("{").join('${row["').split("}").join('"]}')
      templateString = "`" + templateString + "`" 
      filtered.push(`\t\t\t\t\instance.${predicate} = ${templateString}`)
    } else if(objectMap.functionString) {
      let alias = '`${row["' + objectMap.getHashCode() + '"]}`';
      filtered.push(`\t\t\t\t\instance.${predicate} = ${alias}`)
    }
    return filtered
  }, []).join("\n") + "\n";

  resolvers += '\t\t\t\tallInstances.push(instance);\n'
  resolvers += '\t\t\t})\n'
  resolvers += '\t\t\treturn allInstances;\n'
  resolvers += '\t\t});\n'
  resolvers += `\t}\n`

  //console.log("queryResolvers = \n" + resolvers)
  //console.log("\n\n\n")

  return resolvers;
}

exports.generateMutationResolvers = function(class_name, logical_source,
  predicate_object_maps, listOfPredicateObjectMap) {
  let predicates = Object.keys(listOfPredicateObjectMap)
  let objectMaps = Object.values(listOfPredicateObjectMap)
  let columnNames = objectMaps.reduce(function(filtered, objectMap) {
    if(objectMap.referenceValue) {
      filtered.push(objectMap.referenceValue)
    }
    return filtered
  }, []).join(",");

  mutationResolverString = ""
  //mutationResolverString += `\tcreate${class_name}: function({${predicates.join(",")}}) {\n`
  mutationResolverString += `\tcreate${class_name}: function({`
  mutationResolverString += predicates.reduce(function(filtered, predicate) {
    let objectMap = listOfPredicateObjectMap[predicate];
    if(objectMap.referenceValue) {
      filtered.push(predicate)
    }
    return filtered
  }, []).join(",")
  mutationResolverString += `}) {\n`

  mutationResolverString += `\t\tif(identifier == undefined) { identifier = uuid.v4().substring(0,8) }\n`
  let valuesString = predicates.reduce(function(filtered, predicate) {
    let objectMap = listOfPredicateObjectMap[predicate];
    if(objectMap.referenceValue) {
      filtered.push("'${" + predicate + "}'")
    }
    return filtered
  }, []).join(",")
  //console.log("valuesString = " + valuesString)

  let sqlString = "`INSERT INTO " + logical_source + "(" + columnNames +") VALUES(" + valuesString +")`"
  //console.log("sqlString = " + sqlString)

  mutationResolverString += `\t\tlet sqlInsert = ${sqlString}\n`;
  mutationResolverString += `\t\tlet status = db.run(sqlInsert).then(dbStatus => { return dbStatus });\n`


  let newInstanceString = predicates.reduce(function(filtered, predicate) {
    let objectMap = listOfPredicateObjectMap[predicate];
    if(objectMap.referenceValue) {
      filtered.push(`\t\tnewInstance.${predicate} = ${predicate}`)
    } 
    return filtered
  }, []).join("\n")
  mutationResolverString += `\t\tlet newInstance = new ${class_name}()\n`;
  mutationResolverString += newInstanceString + "\n";
  mutationResolverString += `\t\treturn newInstance\n`;
  
  mutationResolverString += `\t}\n`

  console.log(`mutationResolverString = \n${mutationResolverString}`)
  console.log("\n\n\n")

  return mutationResolverString;
}


exports.transform = function(class_name, logical_source, predicate_object) {
  var predicates = Object.keys(predicate_object)
  var objects = Object.values(predicate_object)

  var schema = this.generateSchema(class_name, logical_source, predicate_object);
  //console.log("schema = \n" + schema)

  var model = this.generateModel(class_name, logical_source, predicate_object);
  //console.log("model = \n" + model)

  var resolvers = this.generateResolvers(class_name, logical_source, predicate_object);
  //console.log("resolvers = \n" + resolvers)
}

exports.toLowerCaseFirstChar = function(str) {
    return str.substr( 0, 1 ).toLowerCase() + str.substr( 1 );
}

exports.generateApp = function(class_name, logical_source,
  predicate_object, listOfPredicateObjectMap, db_name, port_no) {
    //console.log("listOfPredicateObjectMap = " + listOfPredicateObjectMap)

  var appString = "";
  var schemaString = this.generateSchema(class_name, logical_source,
    predicate_object, listOfPredicateObjectMap)
  var modelString = this.generateModel(class_name, logical_source,
    predicate_object, listOfPredicateObjectMap)
  var resolversString = this.generateResolvers(class_name, logical_source,
    predicate_object, listOfPredicateObjectMap)

  appString += "const db = require('sqlite');\n"
  appString += "const express = require('express');\n"
  appString += "const graphqlHTTP = require('express-graphql');\n"
  appString += "const Promise = require('bluebird');\n"
  appString += "const uuid = require('uuid');\n"
  appString += "\n"
  appString += "var { buildSchema } = require('graphql');\n"
  appString += "\n"
  appString += "var schema = buildSchema(`\n"
  appString += schemaString
  appString += "`);\n"
  appString += modelString + "\n"
  appString += "\n"
  appString += "var root = { \n"
  appString += resolversString + "\n"
  appString += "};\n"
  appString += "const app = express();\n"
  appString += `const port = process.env.PORT || ${port_no};\n`
  appString += "app.use('/graphql', graphqlHTTP({schema: schema,  rootValue: root,  graphiql: true,}));\n"
  appString += "Promise.resolve().then(() => db.open('" + db_name + "', { Promise }))\n"
  appString += "\t.catch(err => console.error(err.stack))\n"
  appString += "\t.finally(() => app.listen(port));\n"
  appString += "\n"
  appString += `console.log('Running a GraphQL API server at localhost:${port_no}/graphql');\n`
  //console.log("appString = \n" + appString)

  return appString;
}

exports.generate_requirements = function(){
    var content=fs.readFileSync('./transformers/javascript/sqlite/package.json');
    return content;
}

exports.generate_statup_script_sh = function(){
    var content=fs.readFileSync('./transformers/javascript/startup.sh');
    return content;
}

exports.generate_statup_script_bat = function(){
  var content=fs.readFileSync('./transformers/javascript/startup.bat');
  return content;
}
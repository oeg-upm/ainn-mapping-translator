# EXAMPLE LinGBM: Translating mappings online for Javascript and LinGBM dataset in SQLite database (assuming that you have npm and node or docker installed). See https://github.com/LiUGraphQL/LinGBM

## Dataset
- in sqlite: https://github.com/oeg-upm/morph-graphql/raw/master/examples/LinGBM/LinGBM1000.db

## Mapping
- r2rml: https://raw.githubusercontent.com/oeg-upm/morph-graphql/master/examples/LinGBM/LinGBM.r2rml.ttl

## Installation Instructions
- See: https://github.com/oeg-upm/morph-graphql

## Setup Instructions

### Manually
1. ```mkdir LinGBM1000```
2. ```cd LinGBM1000```
3. Translate the corresponding mappings: 
   ```curl -X POST http://localhost:8082/transform -H 'Content-Type: application/json' -d '{ "prog_lang": "javascript", "dataset_type":"sqlite", "mapping_url":"https://raw.githubusercontent.com/oeg-upm/morph-graphql/master/examples/LinGBM/LinGBM.r2rml.ttl", "db_name":"LinGBM1000.db", "mapping_language":"r2rml", "queryplanner":"joinmonster" }' > LinGBM1000.zip```
4. ```unzip LinGBM1000.zip```
5. ```wget https://github.com/oeg-upm/morph-graphql/raw/master/examples/LinGBM/LinGBM1000.db```
6. ```mv LinGBM1000.db data```
7. ```npm install```

### With the script:
1. ```mkdir LinGBM1000``` (you can create this directory any where)
2. ```cd LinGBM1000```
3. ```sh setup.sh``` (if you create the LinGBM1000 directory in another location, make sure to copy the setup.sh as well)

## Running instructions:
1. ```npm start```
2. Go to http://localhost:4321/graphql from your browser, use some of the queries below

## Deployment
One instance of the LinGBM benchmark has been deployed at: http://lingbm1000.graphql.mappingpedia.linkeddata.es

## Queries

### q1: Queries of this template retrieve several attributes of every review about a product in a given offer
```
query offer_product_review {
  listOffer(nr: "2") {
    identifier
    productWithReviews {
      identifier
      reviews {
        identifier
        title
        text
        reviewDate
        publishDate
        rating1
        rating2
      }
    }
  }
}
```

### q2: Queries of this template retrieve all the reviews about all the products of a given producer.
```
query producer_product_review {
  listReview {
    title
    products {
      producer(nr: "8") {
        nr
      }
    }
  }
}
```


### q3: Queries of this template retrieve several attributes of both the product type and its parent type for a product discussed by a given review.
```
query review_product_producttype_parenttype {
  listReview(nr: "8") {
    reviewFor {
      producttype {
        nr
        label
        comment
        parent {
          identifier
          nr
          label
          comment
        }
      }
    }
  }
}
```


### q4: Queries of this template retrieve details of the reviews about the products in a given offer, including the country code of the reviewer’s country.
```
query offer_product_review_person_country {
  listOffer(nr: "2") {
    productWithReviews {
      label
      comment
      reviews {
        identifier
        title
        text
        rating1
        rating2
        rating3
        rating4
        reviewer {
          identifier
          country {
            identifier
            code
          }
        }
      }
    }
  }
}
```

### q5: Queries of this template go from a given product to its reviews and back, repeatedly for four times, and request the review titles along the way and the product label in the end.
```
query product_review_product {
  listProductWithReviews(nr: "370") {
    reviews {
      title
      reviewFor {
        productWithReviews {
          reviews {
            identifier
            nr
            title
            reviewFor {
              identifier
              product {
                identifier
                nr
                label
              }
            }
          }
        }
      }
    }
  }
}
```

### q6: Queries of this template retrieve the country of the producers that produce the products offered by a given vendor.
```
query vendor_offer_product_producer_country {
  listVendorWithOffers(nr: "1") {
    offers {
      product {
        producer {
          country {
            code
          }
        }
      }
    }
  }
}
```

### q11: Queries of this template search for all offers of a given vendor by using a search condition (instead of starting the traversal from the given vendor as done in Q6). Then, for each offer, the price and the offerWebpage is requested, as well as data about the offered product.
```
query subquerySearch {
  listOffer {
    price
    offerWebpage
    vendor(nr: "1") {
      nr
    }
    product {
      label
      comment
    }
  }
}
```


### q12: Queries of this template retrieve data about offers for products of a given producer. These offers are filtered based on a given vendor ID. The filter condition in this query template is the same as the search condition in the previous template.
```
query subqueryFilter1 {
  listOffer {
    identifier
    price
    offerWebpage
    vendor(nr: "1") {
      identifier
    }
    product {
      identifier
      label
      comment
      producer(nr: "16") {
        identifier
      }
    }
  }
}
```

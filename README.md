# Juma R2RML

Juma, jigsaw puzzles for representing mapping, is a method that applies the block metaphor to mapping languages.

In this implementation, we have applied the Juma method to the W3C Recommendation [R2RML](https://www.w3.org/TR/r2rml/). 

## Using the code

This code was developed using Java 8, maven and a MySQL database.

To execute the application go into project folder using terminal, and run the command mvn jetty:run. The default port is 8080.

Database connections can be modified in src/main/resources/hibernate.cfg.xml

In order to run mappings you need to install the following [R2RML engine](https://opengogs.adaptcentre.ie/crottija/r2rml) into your maven repository.

More information available at http://openscience.adaptcentre.ie/juma/ .

## License
Code written by Ademar Crotti Junior.

This study is supported by CNPQ, National Counsel of Technological and Scientific Development – Brazil and the Science Foundation Ireland [ADAPT Centre](https://www.adaptcentre.ie/) for Digital Content Technology (Grant 13/RC/2106) and released under the [MIT license](http://opensource.org/licenses/MIT).

## Publications

[1]  Crotti Junior, A., Debruyne, C., O’Sullivan, D.: Juma: an Editor that Uses a Block Metaphor to Facilitate the Creation and Editing of R2RML Mappings. In: The Semantic Web - Latest Advances and New Domains (ESWC 2017).

[2] Crotti Junior, A., Debruyne, C., O’Sullivan, D.: Using a Block Metaphor for Representing R2RML Mappings. In: Proceedings of the 3rd International Workshop on Visualization and Interaction for Ontologies and Linked Data co-located with the 16th International Semantic Web Conference (VOILA@ISWC 2017).
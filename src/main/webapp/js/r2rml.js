'use strict';

var mappingColour = 360;
var tripleMapColour = 200;
var mapColour = 48;
var valueColour = 62;
var parenttripleColour = 380;
var tableColour = 85;
var subjectColour = 122;
var predicateColour = 215;
var objectColour = 170;
var graphColour = 320;
var vocabs = [
        ['rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>', 'rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>'],
        ['rdfs: <http://www.w3.org/2000/01/rdf-schema#>', 'rdfs: <http://www.w3.org/2000/01/rdf-schema#>'], 
        ['xsd: <http://www.w3.org/2001/XMLSchema#>', 'xsd: <http://www.w3.org/2001/XMLSchema#>'],
        ['foaf: <http://xmlns.com/foaf/0.1/>', 'foaf: <http://xmlns.com/foaf/0.1/>']
       ];
var triplesmap = [];

// default values
// Blockly.HSV_SATURATION = 0.45;
// Blockly.HSV_VALUE = 0.65;

Blockly.HSV_SATURATION = 0.55;
Blockly.HSV_VALUE = 0.65;

var blockId;

var tripleMap = 'TM';
var logicalTable = 'LT';
var subjectMap = 'SM';
var predicateObjectMap = 'POM';
var predicateMap = 'PM';
var objectMap = 'OM';
var graphMap = 'GM';
var textClass = 'lead';

var tripleMap = 'Triples Map';
var logicalTable = 'Logical Table';
var subjectMap = 'Subject Map';
var predicateObjectMap = 'Predicate Object Maps';
var predicateMap = 'Predicate Maps';
var objectMap = 'Object Maps';
var graphMap = 'Graph Maps';

// indicate what is obligatory

// colours on the conector

// border colour indicating the next block

// arity -- important to have it in the video or material

// maybe delete term type for predicate map -- toolbox too


// between the groups

Blockly.Blocks['mapping'] = {
    init: function() {
    this.appendStatementInput('mapping')
        .setCheck(['prefix'])
        .appendField(new Blockly.FieldLabel('Prefixes', textClass));
    this.appendStatementInput('triplesmap')
        .setCheck('triplemap')
        .appendField(new Blockly.FieldLabel(tripleMap, textClass));
    this.setColour(mappingColour);
    this.setTooltip('Creates a mapping.');
    this.setHelpUrl('https://www.w3.org/TR/r2rml/');
    this.setDeletable(false);
  }
};


Blockly.Blocks['prefix'] = {
    init: function() {
    this.setColour(valueColour);
    this.appendDummyInput('prefix')
        .appendField('')
        .appendField(new Blockly.FieldTextInput('insert prefix here'), 'PREFIX');
    this.appendDummyInput('uri')
        .appendField(new Blockly.FieldLabel(': <', textClass))
        .appendField(new Blockly.FieldTextInput('insert uri here'), 'URI')
		.appendField(new Blockly.FieldLabel('>', textClass));
    this.setInputsInline(true);
    this.setPreviousStatement(true, ['mapping','prefix']);
    this.setNextStatement(true, ['prefix', 'base']);
    this.setTooltip('Creates a prefix.');
  }
};

Blockly.Blocks['base'] = {
    init: function() {
    this.setColour(valueColour);
    this.appendDummyInput('base')
        .appendField('base <')
        .appendField(new Blockly.FieldTextInput('insert uri here'), 'URI')
        .appendField('>');
    this.setInputsInline(true);
    this.setPreviousStatement(true, ['mapping','prefix']);
    this.setNextStatement(true, 'prefix');
    this.setTooltip('Creates a base uri.');
  }, onchange: function() {
    validateFields(this);
  }
};

Blockly.Blocks['predefinedprefix'] = {
    init: function() {
    this.setColour(valueColour);
    this.appendDummyInput('prefix')
        .appendField('')
        .appendField(new Blockly.FieldDropdown(vocabs), 'PREFIX');
    this.setInputsInline(true);
    this.setPreviousStatement(true, ['mapping','prefix']);
    this.setNextStatement(true, 'prefix');
    this.setTooltip('Creates a prefix.');
  }
};


Blockly.Blocks['tablesqlquery'] = {
    init: function() {
    if(this.sql != undefined){
    sqlFromDatabase = this.sql.substring(0,20) + (this.sql.length > 20 ? '...' : '')    
  }
    this.setColour(tableColour);
    this.appendDummyInput('tablesqlquery')
        .appendField(new Blockly.FieldDropdown([['table', 'table'], ['sql query', 'sqlquery']]), 'TABLESQLQUERY')
        .appendField(new Blockly.FieldLabel('click here to insert value',''), 'sql'); 
    this.setInputsInline(true);
    this.setPreviousStatement(true, ['logicaltable','tablesqlquery']);
    this.setTooltip('Defines a table or sql query.');
    this.setHelpUrl('https://www.w3.org/ns/r2rml#logicalTable');
    this.sql = "click here to insert";
  },
  mutationToDom: function() {
    var container = document.createElement('mutation');
    container.setAttribute('sql', this.sql);
    return container;
  },
  domToMutation: function(xmlElement) {
    this.sql = xmlElement.getAttribute('sql');
  this.setFieldValue(this.sql.substring(0,20) + (this.sql.length > 20 ? '...' : ''), 'sql');;
  },
  onchange: function(ev) {
    blockId = ev.blockId;
    var block = workspace.getBlockById(blockId);
    if(block != undefined && block.type == 'tablesqlquery'){
	      $('#content-logical-table').val(block.sql); 
	      $('#edit-logical-table').show();  
	      $('#edit-logical-table div textarea').focus();  
	      $('#edit-logical-table div textarea').select(); 
    } else {
	      $('#edit-logical-table').hide();  
    }
  }
};


$(document).ready(function() {
  $("#saveLogicalTable").bind("click", function() {
    var block = workspace.getBlockById(blockId);
    if(block){
      var content = $('#content-logical-table').val();
      block.sql = content;
      block.setFieldValue(content.substring(0,35) + (content.length > 35 ? '...' : ''), 'sql');
      blockId = undefined;
      $('#edit-logical-table').hide();
    }
  });
});

Blockly.Blocks['class'] = {
    init: function() {
    this.setColour(subjectColour);
    this.appendDummyInput('class')
        .appendField('Class:')
        .appendField(new Blockly.FieldTextInput('class'), 'CLASS');
    this.setInputsInline(true);
    this.setPreviousStatement(true, ['class', 'subjecttermtype']);
    this.setNextStatement(true, ['class', 'subjecttermtype']);
    this.setTooltip('Defines a class.');
    this.setHelpUrl('https://www.w3.org/ns/r2rml#class');
  }
};

function nextTripleMapName() {
  var blocks = getBlocksByType('triplemap');
  return 'TripleMap' + (blocks.length + 1);
}

Blockly.Blocks['triplemap'] = {
  init: function() {
    this.appendDummyInput('triple-map')
        .appendField('<#')
        .appendField(new Blockly.FieldTextInput(nextTripleMapName()), 'TRIPLEMAPNAME')
        .appendField('>');
    this.appendStatementInput('logicaltable')
        .setCheck(['tablesqlquery'])
        .appendField(new Blockly.FieldLabel(logicalTable, textClass));
    this.appendStatementInput('subjectmap')
        .setCheck(['subjectmap'])
        .appendField(new Blockly.FieldLabel(subjectMap, textClass));
    this.appendStatementInput('predicateobjectmap')
        .setCheck('predicateobjectmap')
        .appendField(new Blockly.FieldLabel(predicateObjectMap, textClass));
    this.setColour(tripleMapColour);
    this.setPreviousStatement(true, ['triplemap']);
    this.setNextStatement(true, 'triplemap');
    this.setTooltip('Creates a triple map.');
    this.setHelpUrl('https://www.w3.org/ns/r2rml#TriplesMap');
  }, onchange: function(ev) {
  	var MSG_UNIQUE_TRIPLE_MAP = 'Triples map names must be unique!';
  	var MSG_LOGICAL_TABLE_SUBJECT_MAP = 'A triple map must have one logical table and one subject map!';
	if(this.getInputTargetBlock('logicaltable') == null || this.getInputTargetBlock('subjectmap') == null) {
	    this.setWarningText(MSG_LOGICAL_TABLE_SUBJECT_MAP);
	} else {
	    this.setWarningText(null);
	}

    var abort = false;
    if(ev.type == Blockly.Events.CHANGE || ev.type == Blockly.Events.MOVE) {
      var blocks = getBlocksByType('triplemap');
      for(var i = 0; i < blocks.length && !abort; i++) {
        for(var j = 0; j < blocks.length && !abort; j++) {
          var oneBlock = blocks[i];
          var anotherBlock = blocks[j];
          if(oneBlock.id != anotherBlock.id && oneBlock.getFieldValue('TRIPLEMAPNAME') == anotherBlock.getFieldValue('TRIPLEMAPNAME')) {
            abort = true;
            alert(MSG_UNIQUE_TRIPLE_MAP);
            this.setFieldValue(nextTripleMapName(), 'TRIPLEMAPNAME');
          }
        }
      }

      var blocks = getBlocksByType('parenttriplesmap');
      for(var i = 0; i < blocks.length; i++) {
        if(ev.name == 'TRIPLEMAPNAME' && ev.oldValue == blocks[i].getFieldValue('PARENTTRIPLEMAP')){
          blocks[i].setFieldValue(ev.newValue, 'PARENTTRIPLEMAP');
          break;
        }
      }
    }

  }
};

Blockly.Blocks['subjectmap'] = {
    init: function() {
    this.appendStatementInput('termmap')
        .appendField(new Blockly.FieldDropdown([['constant', 'CONSTANT'], ['column', 'COLUMN'], ['template', 'TEMPLATE']]), 'TERMMAP')
        .appendField(new Blockly.FieldTextInput('insert value'), 'TERMMAPVALUE')
        .setCheck(['subjecttermtype', 'subjecttermmap', 'class'])
        .appendField('');
    this.setColour(subjectColour);
    this.setPreviousStatement(true, ['subjectmap']);
    this.setTooltip('Defines the subject.');
    this.setHelpUrl('https://www.w3.org/ns/r2rml#SubjectMap');
  }, onchange: function() {
    validateFields(this);
    if(this.getFieldValue('TERMMAP') == 'EMPTY') {
      this.setFieldValue('', 'TERMMAPVALUE');
      Blockly.addClass_(this.getField('TERMMAPVALUE').fieldGroup_, 'hideInput');
    } else {
      Blockly.removeClass_(this.getField('TERMMAPVALUE').fieldGroup_, 'hideInput');
    }
  }
};

Blockly.Blocks['predicateobjectmap'] = {
    init: function() {
    this.appendStatementInput('ppredicateobjectmap')
        .setCheck(['predicatemap'])
        .appendField(new Blockly.FieldLabel(predicateMap, textClass));
    this.appendStatementInput('opredicateobjectmap')
        .setCheck(['objectmap', 'parenttriplesmap'])
        .appendField(new Blockly.FieldLabel(objectMap, textClass));
    this.appendStatementInput('graphmap')
        .setCheck(['predicategraphtermap'])
        .appendField(new Blockly.FieldLabel(graphMap, textClass));
    this.setColour(mapColour);
    this.setPreviousStatement(true, [ 'predicateobjectmap']);
    this.setNextStatement(true, ['predicateobjectmap']);
    this.setTooltip('Creates a predicate object map.');
    this.setHelpUrl('https://www.w3.org/ns/r2rml#PredicateObjectMap');
  }, onchange: function(ev){
  	if(this.getInputTargetBlock('ppredicateobjectmap') == null || this.getInputTargetBlock('opredicateobjectmap') == null) {
  		this.setWarningText('A predicate object map must have at least one predicate map and one object map!');
  	} else {
  		this.setWarningText(null);
  	}
  }
};

Blockly.Blocks['predicatemap'] = {
    init: function() {
    this.appendDummyInput('termmap')
        .appendField(new Blockly.FieldDropdown([['constant', 'CONSTANT'], ['column', 'COLUMN'], ['template', 'TEMPLATE']]), 'TERMMAP')
        .appendField(new Blockly.FieldTextInput('insert value'), 'TERMMAPVALUE');
    this.setColour(predicateColour);
    this.setPreviousStatement(true, ['predicatemap']);
    this.setNextStatement(true, ['predicatemap']);
    this.setTooltip('Creates a predicate map.');
    this.setHelpUrl('http://www.w3.org/ns/r2rml#PredicateMap');
  }, onchange: function() {
    validateFields(this);
  }
};

Blockly.Blocks['objectmap'] = {
    init: function() {
    this.appendStatementInput('termmap')
        .appendField(new Blockly.FieldDropdown([['constant', 'CONSTANT'], ['column', 'COLUMN'], ['template', 'TEMPLATE']]), 'TERMMAP')
        .appendField(new Blockly.FieldTextInput('insert value'), 'TERMMAPVALUE')
        .setCheck(['objecttermmap', 'language', 'datatype', 'objecttermtype'])
        .appendField('');
    this.setColour(objectColour);
    this.setPreviousStatement(true, ['objectmap']);
    this.setNextStatement(true, ['objectmap']);
    this.setTooltip('Creates an object map.');
    this.setHelpUrl('http://www.w3.org/ns/r2rml#ObjectMap');
  }, onchange: function() {
    validateFields(this);
  }
};

function validateFields(block) {
  return;
  if(block.getDescendants() != undefined){
       var descendants = block.getDescendants();
       var typesToValidate = {'datatype': 'datatype', 'language': 'language', 'base': 'base uri',
                              'subjecttermmap': 'term map', 'predicatetermmap': 'term map', 
                              'objecttermmap': 'term map', 'subjecttermtype': 'term map', 
                              'predicatetermtype': 'term map', 'objecttermtype': 'term map', 'inverseexpression': 'inverse expression'};
       var hashmap = {};
       for(var key in typesToValidate) {
          hashmap[key] = 0;
       }

       for(var i = 0; i < descendants.length; i++) {
          var descendant = descendants[i];
          var type = descendant.type;
          if(type in hashmap) {
              hashmap[type] += 1;
              if(hashmap[type] > 1) {
                alert('Only one ' + typesToValidate[type]  + ' permited!');
                if(descendant.getChildren() != undefined && descendant.getChildren().length != 0){
                  var blockChildId = descendant.getChildren()[0].id;
                  var parent = descendant.getParent();
                  descendant.getChildren()[0].unplug();
                  var blockChild = workspace.getBlockById(blockChildId);
                  parent.nextConnection.connect(blockChild.previousConnection);
                }
                descendant.dispose();
                break;
            }
          }
       }
    }
}

// subject term map
Blockly.Blocks['subjecttermtype'] = {
    init: function() {
    this.appendDummyInput('termtype')
        .appendField('Term type')
        .appendField(new Blockly.FieldDropdown([['iri', 'termtypeiri'], ['blank node', 'termtypeblanknode']]), 'TERMTYPE');
    this.setColour(subjectColour);
    this.setPreviousStatement(true, ['subjecttermtype', 'class']);
    this.setNextStatement(true, ['subjecttermtype', 'termtypesubject', 'class']);
    this.setTooltip('Defines a term type.');
    this.setHelpUrl('https://www.w3.org/ns/r2rml#termType');
  }
};

//predicate term map
Blockly.Blocks['predicatetermtype'] = {
    init: function() {
    this.appendDummyInput('termtype')
        .appendField('Term type')
        .appendField(new Blockly.FieldDropdown([['iri', 'termtypeiri']]), 'TERMTYPE');
    this.setColour(predicateColour);
    this.setPreviousStatement(true, ['predicatetermmap']);
    // this.setNextStatement(true, ['predicatetermtype', 'predicatetermmap']); // TODO review this
    this.setTooltip('Defines a term type.');
    this.setHelpUrl('https://www.w3.org/ns/r2rml#termType');
  }
};

//object term map
Blockly.Blocks['subjectgraphtermap'] = {
    init: function() {
    this.setColour(subjectColour);
    this.appendDummyInput('graphtermap')
      .appendField('Subject graph map:')
      .appendField(new Blockly.FieldDropdown([['constant', 'CONSTANT'], ['column', 'COLUMN'], ['template', 'TEMPLATE']]), 'TERMMAP')
      .appendField(new Blockly.FieldTextInput('insert value'), 'TERMMAPVALUE');
    this.setInputsInline(true);
    this.setPreviousStatement(true, ['class', 'subjecttermtype']);
    this.setNextStatement(true, ['class', 'subjecttermtype']);
    this.setTooltip('Defines a graph map.');
    this.setHelpUrl('http://www.w3.org/ns/r2rml#GraphMap');
  } 
};

Blockly.Blocks['predicategraphtermap'] = {
    init: function() {
    this.setColour(graphColour);
    this.appendDummyInput('graphtermap')
      .appendField('Predicate object graph map:')
        .appendField(new Blockly.FieldDropdown([['constant', 'CONSTANT'], ['column', 'COLUMN'], ['template', 'TEMPLATE']]), 'TERMMAP')
        .appendField(new Blockly.FieldTextInput('insert value'), 'TERMMAPVALUE');
    this.setInputsInline(true);
    this.setPreviousStatement(true, ['predicategraphtermap']);
    this.setNextStatement(true, ['predicategraphtermap']);
    this.setTooltip('Defines a graph map.');
    this.setHelpUrl('http://www.w3.org/ns/r2rml#GraphMap');
  } 
};

Blockly.Blocks['language'] = {
    init: function() {
    this.setColour(objectColour);
    this.appendDummyInput('language')
        .appendField('Language:')
        .appendField(new Blockly.FieldTextInput('insert language here'), 'LANGUAGE');
    this.setInputsInline(true);
    this.setPreviousStatement(true, ['language', 'datatype', 'language', 'objecttermtype', 'inverseexpression', 'objecttermmap']);
    this.setNextStatement(true, ['language', 'datatype', 'objecttermtype', 'inverseexpression', 'objecttermmap']); 
    this.setTooltip('Defines a language.');
    this.setHelpUrl('https://www.w3.org/ns/r2rml#language');
  }
};


Blockly.Blocks['datatype'] = {
    init: function() {
    this.setColour(objectColour);
    this.appendDummyInput('datatype')
        .appendField('Datatype')
        .appendField(new Blockly.FieldTextInput('insert datatype here'), 'DATATYPE');
    this.setInputsInline(true);
    this.setPreviousStatement(true, ['datatype', 'language', 'objecttermtype', 'inverseexpression', 'objecttermmap']);
    this.setNextStatement(true, ['language', 'datatype', 'objecttermtype', 'inverseexpression', 'objecttermmap']); 
    this.setTooltip('Defines a datatype.');
    this.setHelpUrl('https://www.w3.org/ns/r2rml#datatype');
  }
};

Blockly.Blocks['inverseexpression'] = {
    init: function() {
    this.setColour(objectColour);
    this.appendDummyInput('inverseexpression')
        .appendField('Inverse Expression:')
        .appendField(new Blockly.FieldTextInput('insert inverse expression here'), 'INVERSEEXPRESSION');
    this.setInputsInline(true);
    this.setPreviousStatement(true, ['inverseexpression', 'language', 'datatype', 'objecttermtype', 'objecttermmap']);
    this.setNextStatement(true, ['language', 'datatype', 'objecttermtype', 'inverseexpression', 'objecttermmap']); 
    this.setTooltip('Defines an inverse expression.');
    this.setHelpUrl('http://www.w3.org/ns/r2rml#inverseExpression');
  }
};


function loadTripleMaps() {
  var options = [['select a triple map','']];
  var blocks = getBlocksByType('triplemap');
  for (var i = 0; i < blocks.length; i++) {
      options.push([blocks[i].getFieldValue('TRIPLEMAPNAME'), blocks[i].getFieldValue('TRIPLEMAPNAME')]);
  }
  return options;
}

Blockly.Blocks['parenttriplesmap'] = {
    init: function() {
    this.appendDummyInput('parenttriplemap')
        .appendField(new Blockly.FieldDropdown(loadTripleMaps), 'PARENTTRIPLEMAP');
    this.appendStatementInput('joincondition')
        .setCheck(['joincondition'])
        .appendField('Join Condition');
    this.setColour(parenttripleColour);
    this.setPreviousStatement(true, ['objectmap', 'parenttriplesmap']);
    this.setNextStatement(true, ['objectmap', 'parenttriplesmap']);
    this.setTooltip('Creates a parent triple map.');
    this.setHelpUrl('http://www.w3.org/ns/r2rml#parentTriplesMap');
  }
  , onchange: function(ev){
    if(this.getParent() != undefined && getTripleMap(this) != null) {
      var triplemapName = getTripleMap(this).getFieldValue('TRIPLEMAPNAME');
      var parenttriplemapName = this.getFieldValue('PARENTTRIPLEMAP');
      if(triplemapName == parenttriplemapName) {
        alert('Not possible to create a parent triple map with the same triple map!');
        this.setFieldValue(0, 'PARENTTRIPLEMAP');
      }
    }
  }
};

function getTripleMap(thisBlock){
  if(thisBlock.getParent() == null){
    return null;
  }
  if(thisBlock.type == 'triplemap') {
    return thisBlock;
  }
  return getTripleMap(thisBlock.getParent());
}

Blockly.Blocks['joincondition'] = {
    init: function() {
    this.setColour(parenttripleColour);
    this.appendDummyInput('joinconditionchild')
        .appendField('Child:')
        .appendField(new Blockly.FieldTextInput('insert value here'), 'CHILD');
    this.appendDummyInput('joinconditionparent')
        .appendField('Parent:')
        .appendField(new Blockly.FieldTextInput('insert value here'), 'PARENT');
    this.setPreviousStatement(true, ['joincondition']);
    this.setNextStatement(true, ['joincondition']);
    this.setTooltip('Defines a join condition.');
    this.setHelpUrl('http://www.w3.org/ns/r2rml#joinCondition');
  }
};

Blockly.Blocks['objecttermtype'] = {
  init: function() {
    this.setColour(objectColour);
    this.appendDummyInput("termtype")
        .appendField("Term type")
        .appendField(new Blockly.FieldDropdown([ ['iri', 'termtypeiri'], ['literal', 'termtypeliteral'], ['blank node', 'termtypeblanknode']]), 'TERMTYPE');
    this.appendValueInput("termtypevalue")
        .appendField("as/in")
        .setCheck(["objectdatatype", "objectlanguage"]);
    this.setPreviousStatement(true, ['objecttermmap']);
    this.setInputsInline(true);
    this.setTooltip('Defines a literal.');
    this.setHelpUrl('http://www.w3.org/ns/r2rml#termType');
  }, onchange: function() {
    if(this.getFieldValue('TERMTYPE') == 'termtypeliteral') {
    	this.getInput('termtypevalue').setVisible(true);
    } else {
    	this.getInput('termtypevalue').setVisible(false);
  	}
  	this.render();
  }
};


Blockly.Blocks['objectdatatype'] = {
  init: function() {
    this.setColour(objectColour);
    this.appendDummyInput()
        .appendField("datatype")
        .appendField(new Blockly.FieldTextInput("insert datatype here"), "DATATYPE");
    this.setOutput(true, null);
    this.setTooltip('Defines a datatype.');
    this.setHelpUrl('https://www.w3.org/ns/r2rml#datatype');
  }
};

Blockly.Blocks['objectlanguage'] = {
  init: function() {
    this.setColour(objectColour);
    this.appendDummyInput()
        .appendField("language")
        .appendField(new Blockly.FieldTextInput("insert language here"), "LANGUAGE");
    this.setOutput(true, null);
    this.setTooltip('Defines a language.');
    this.setHelpUrl('https://www.w3.org/ns/r2rml#language');
  }
};

// Utils

//************************************
//find all blocks on workspace by type
//************************************
function getBlocksByType(type) {
  var blocks = [];
  for (var blockID in workspace.blockDB_) {
    if (workspace.blockDB_[blockID].type == type) {
      blocks.push(workspace.blockDB_[blockID]);
    }
  }
  return(blocks);
}

function isAnyDisconnected() {
  for (var blockID in workspace.blockDB_) {
    if (workspace.blockDB_[blockID].type != 'mapping' && workspace.blockDB_[blockID].getParent() == undefined) {
      return true;
    }
  }
  return false;
}

/*
export
var xml = Blockly.Xml.workspaceToDom(workspace);
var xml_text = Blockly.Xml.domToText(xml);


import
var xml = Blockly.Xml.textToDom(xml_text);
Blockly.Xml.domToWorkspace(xml, workspace);

*/

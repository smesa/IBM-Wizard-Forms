angular.module('preview', ['ngRoute'])
 

.config(function($routeProvider) {
  $routeProvider
    .when('/', {      
      templateUrl:'views/preview.html',
      controller:'PreviewCtrl'
    })
    .when('/get/:formid/:verformid', {      
      templateUrl:'views/preview.html',
      controller:'PreviewCtrl'
    })
    .when('/getfull/:formid/:verformid', {      
      templateUrl:'views/preview_full.html',
      controller:'PreviewCtrl'
    })
    .otherwise({
      redirectTo:'/'
    });
})

.controller('PreviewCtrl', function($scope, $routeParams, $http) {
	
	
	var formid 			= $routeParams.formid;
	var verformid		= $routeParams.verformid;
	var panel 			= $("#ppal");
	
	
	$scope.openForm = function(){
		var uri = window.location.href.replace(/get/g, 'getfull');		
		window.open(uri,'_blank');
	}
	
	$scope.closeForm = function(){
		window.open('','_self').close();
	}
	
	//$scope.data = [];	
	
	var sURL  = 'http://hgmsapdev01.hgm.com:8000/sap/bc/ibmformwizard/forms_data/forms?formid=' + formid + '&verformid=' + verformid;
		
	$http.get( sURL ).
		success(function(list){
			list 		= list[0];
			$scope.data = list;
			
			
			// Recorro las secciones
			angular.forEach(list.versions[0].sections, function(section){				
				
				// Agrego la seccion al panel
				var elmsection = '<div class="panel panel-default"><div class="panel-heading"><h3 class="panel-title">'+section.sectiontitle+'</h3></div><div class="panel-body" id="'+list.formid + section.sectionid+'"></div></div>';
  				panel.append(elmsection);
  				
  				
  				//# de columnas
  				switch(section.sectioncolumn) {
	  			    case '1':
	  			    	section.sectioncolumn = 'col-md-12 col-sm-12'
	  			        break;
	  			    case '2':
	  			    	section.sectioncolumn = 'col-md-6 col-sm-6'
	  			        break;
	  			    case '3':
	  			    	section.sectioncolumn = 'col-md-4 col-sm-4'
	  			    		break;
	  			    case '4':
	  			    	section.sectioncolumn = 'col-md-3 col-sm-3'
	  			    		break
  				}
  				
  				
  				// Agrego los campos
  				angular.forEach(section.fields, function(field){
  					

  					// Elemento padre osea la seccion
  					var nameelmparent = list.formid + section.sectionid;
  					var elm = $('#'+nameelmparent);

  					// Evaluo que tipo de elemento es
  					switch(field.fieldtype) {
					    case 'TEXT':
					        addInput(elm,field,list.formid,section);
					        break;
					    case 'RADIO':
					        addRadio(elm,field,list.formid,section);
					        break;
					    case 'CHECK':
					        addCheck(elm,field,list.formid,section);
					        break;
					    case 'COMBO':
					        addCombo(elm,field,list.formid,section);
					        break;
					    default:
					        addInput(elm,field,list.formid,section);
					}  					

  				})
				
			})		
			
			
		});	
});

function addInput(elmparent,field,formid,seccion){	
	//var elm = ' <div class="form-group"><label for="'+formid+sectionid+field.fieldid+'">'+field.fieldtitle+'</label><input type="text" class="form-control" id="'+formid+sectionid+field.fieldid+'"placeholder="'+field.fieldplaceholder+'"></div>';
	
	var newDiv = document.createElement('div');
	newDiv.className = 'form-group ' +seccion.sectioncolumn;


	var newLabel 		= document.createElement('label');
	newLabel.innerHTML  = field.fieldtitle;	

	var newInput = document.createElement('input');
	newInput.type = 'text';
	newInput.id   =  formid+seccion.sectionid+field.fieldid;
	newInput.className  = 'form-control';
	newInput.placeholder = field.fieldplaceholder;

	var text = "";
	angular.forEach(field.values, function(value){

		text = text + ' ' + value.value;
		newInput.value = text;

	})

	newDiv.appendChild(newLabel);
	newDiv.appendChild(newInput);

	elmparent.append(newDiv);
}


function addRadio(elmparent,field,formid,seccion){	

	var newDiv = document.createElement('div');
	newDiv.className = 'form-group ' +seccion.sectioncolumn;


	var newLabel 		= document.createElement('label');
	newLabel.innerHTML  = field.fieldtitle;
	newDiv.appendChild(newLabel);

	var newbr = document.createElement('br');
	newDiv.appendChild(newbr);

	var newDivButton = document.createElement('div');
	newDivButton.className = "btn-group";
	newDivButton.id  = 'div' + formid+seccion.sectionid+field.fieldid;
	newDivButton.setAttribute('data-toggle','buttons');


	angular.forEach(field.values, function(value){

		var newLabelBtn = document.createElement('label');
		newLabelBtn.className = "btn btn-primary";
		newLabelBtn.innerHTML = value.value;


		var option = document.createElement("input");
		option.type = "radio";
		option.name = formid+seccion.sectionid+field.fieldid;
		option.value = value.value;
		option.setAttribute('autocomplete','off');


		newLabelBtn.appendChild(option);
		newDivButton.appendChild(newLabelBtn);

		console.log(value.value);


	})

	newDiv.appendChild(newDivButton);
	elmparent.append(newDiv);
}


function addCombo(elmparent,field,formid,seccion){	
	
	if(field.fieldplaceholder == ''){
		field.fieldplaceholder = 'Seleccione un valor'
	}

	var newDiv = document.createElement('div');
	newDiv.className = 'form-group ' +seccion.sectioncolumn;
	

	var newLabel 		= document.createElement('label');
	newLabel.innerHTML  = field.fieldtitle;
	newDiv.appendChild(newLabel);

	var newbr = document.createElement('br');
	newDiv.appendChild(newbr);


	var newselect = document.createElement('SELECT');
	newselect.className = "form-control";
	newselect.id        = formid+seccion.sectionid+field.fieldid;

	angular.forEach(field.values, function(value){

		var newoption = document.createElement('option');
		newoption.text = value.value;
		newoption.value = value.value;
		newselect.add(newoption);


	})

	newDiv.appendChild(newselect);
	elmparent.append(newDiv);
}

function addCheck(elmparent,field,formid,seccion){	
	
	var newDiv = document.createElement('div');
	newDiv.className = 'form-group ' +seccion.sectioncolumn;
	newDiv.id        = 'div'+ formid+seccion.sectionid+field.fieldid;

	var newLabel 		= document.createElement('label');
	newLabel.innerHTML  = field.fieldtitle;
	newDiv.appendChild(newLabel);

	var newbr = document.createElement('br');
	newDiv.appendChild(newbr);

	var newDivButton = document.createElement('div');
	newDivButton.className = "btn-group";
	newDivButton.id  = 'div' + formid+seccion.sectionid+field.fieldid;
	newDivButton.setAttribute('data-toggle','buttons');


	angular.forEach(field.values, function(value){

		var newLabelBtn = document.createElement('label');
		newLabelBtn.className = "btn btn-primary";
		newLabelBtn.innerHTML = value.value;


		var option = document.createElement("input");
		option.type = "checkbox";
		option.name = formid+seccion.sectionid+field.fieldid;
		option.value = value.value;
		option.setAttribute('autocomplete','off');


		newLabelBtn.appendChild(option);
		newDivButton.appendChild(newLabelBtn);

		console.log(value.value);


	})

	newDiv.appendChild(newDivButton);
	elmparent.append(newDiv);
}
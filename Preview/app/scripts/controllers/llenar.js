'use strict';

/**
 * @ngdoc function
 * @name exampleWssapApp.controller:LlenarCtrl
 * @description
 * # LlenarCtrl
 * Controller of the exampleWssapApp
 */
angular.module('exampleWssapApp')
  .controller('LlenarCtrl', function ($scope,$routeParams,$http) {

  	var formid   = $routeParams.formid;
  	var urlAPI = 'http://hgmsapdev01.hgm.com:8000/sap/bc/restsivigila?';
  	var urlAction = 'write=' + formid;
  	var sectiontmp = '<div class="panel panel-default"><div class="panel-heading"><h3 class="panel-title">{{list.formtitle}}</h3></div><div class="panel-body"></div></div>'
  	var panel = $("#ppal");
  	$scope.message = "";

  	$scope.list = [];

  	$scope.cancelForm = function(){
  		$('#modalok').modal('hide');
  		$('#modalerror').modal('hide');
  		window.history.back();
  	}

  	$scope.saveData = function(){
  		var data = guardarData($scope.list);
  		var urlSave = 'save=' + data;
  		console.log(urlSave);
  		$http.get(urlAPI + urlSave)
  			.success(function(msg){
  				console.log('sy-subrc:' + msg);

  				switch(msg) {
				    case '0 ':
				        $scope.message = 'Registro guardado exitosamente';
				        $('#modalok').modal('show')
				        break;
				    case '4 ':
				        $scope.message = 'Ocurrio un error guardando el registro';
				        $('#modalerror').modal('show')
				} 

  			});
  	}

  	$http.get(urlAPI + urlAction).
  		success(function(list){

  			$scope.list = list;

  			// Recorro las secciones
  			angular.forEach(list.secciones, function(seccion){


  				var elmsection = '<div class="panel panel-default"><div class="panel-heading"><h3 class="panel-title">'+seccion.sectiontitle+'</h3></div><div class="panel-body" id="'+list.formid + seccion.sectionid+'"></div></div>';
  				panel.append(elmsection);

  				console.log(seccion)

  				angular.forEach(seccion.fields, function(field){
  					

  					// Elemento padre osea la seccion
  					var nameelmparent = list.formid + seccion.sectionid;
  					var elm = $('#'+nameelmparent);

  					// Evaluo que tipo de elemento es
  					switch(field.fieldtype) {
					    case 'TEXT':
					        addInput(elm,field,list.formid,seccion);
					        break;
					    case 'RADIO':
					        addRadio(elm,field,list.formid,seccion);
					        break;
					    case 'CHECK':
					        addCheck(elm,field,list.formid,seccion);
					        break;
					    case 'COMBO':
					        addCombo(elm,field,list.formid,seccion);
					        break;
					    default:
					        addInput(elm,field,list.formid,seccion);
					}  					

  				})
  			})
  		});

  });


function addInput(elmparent,field,formid,seccion){	
	//var elm = ' <div class="form-group"><label for="'+formid+sectionid+field.fieldid+'">'+field.fieldtitle+'</label><input type="text" class="form-control" id="'+formid+sectionid+field.fieldid+'"placeholder="'+field.fieldplaceholder+'"></div>';
	
	var newDiv = document.createElement('div');
	newDiv.className = 'form-group ' +seccion.sectioncolumns;


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
	newDiv.className = 'form-group ' +seccion.sectioncolumns;


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
	newDiv.className = 'form-group ' +seccion.sectioncolumns;
	

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
	newDiv.className = 'form-group ' +seccion.sectioncolumns;
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


function guardarData(list){

	var data = "";

	// Recorro form
	angular.forEach(list.secciones, function(seccion){

		// Recorro secciones
		angular.forEach(seccion.fields, function(field){

			var key   = list.formid + "|" + seccion.sectionid + "|" + field.fieldid;	
			var clave = list.formid + seccion.sectionid + field.fieldid;	
			

			// Evaluo que tipo de elemento es
			switch(field.fieldtype) {
			    case 'TEXT':
			    	var value = document.getElementById(clave).value;
					data = data + "{'clave':'" + key + "','valor':'" + value + "'}," 
			        break;
			    case 'RADIO':
			 		var value = ($('input[name="'+clave+'"]:checked', '#div'+clave+'').val()); 
			 		data = data + "{'clave':'" + key + "','valor':'" + value + "'}," 
			        break;
			    case 'CHECK':
			    	var value = "";
					$('[name='+clave+']:checked').each(function() {
					 	value = value + $(this).val() + '-';
					});
					data = data + "{'clave':'" + key + "','valor':'" + value + "'}," 
			        break;
			    case 'COMBO':
			   		var value = document.getElementById(clave).value;
					data = data + "{'clave':'" + key + "','valor':'" + value + "'}," 
			        break;			      
			}  			

		})

	})

	return data;

}


var app={

	model:{
		"notes":[{"title": "Note Trial ", "content": "Oferta en la panaderia de la esquina"}]
		//{"title":"Comprar pan","content":"Oferta en la panaderia de la esquina"}
	},//Iniciamos modelo con la primera nota

	init: function(){
		this.initFastClick();
		this.initButtons();
		this.refreshList();
	},

	initFastClick: function(){
		FastClick.attach(document.body);
	},

	initButtons: function(){
		var save=document.querySelector('#save');
		var add=document.querySelector('#add');

		add.addEventListener('click',this.showEditor,false);
		save.addEventListener('click',this.saveNote,false);
	},

	showEditor: function(){
		document.getElementById('title').value="";
		document.getElementById('comment').value="";
		document.getElementById("note-editor").style.display="block";
		document.getElementById('title').focus();
	},

	saveNote: function(){
		app.makeNote();
		app.hideEditor();
		app.refreshList();
		app.storageData();
	},

	makeNote: function(){
		var notes=app.model.notes;
		notes.push({"title": app.extractTitle(),"content": app.extractComment()});
	},

	refreshList: function(){
		var div=document.getElementById('notes-list');
		div.innerHTML=this.addNotesToList();
	},

	addNotesToList: function(){//Array con las notas
		var notes=this.model.notes;
		var notesDivs='';
		for(var i in notes){
			var title=notes[i].title;
			notesDivs=notesDivs + this.addNote(i,title);
		}
		return notesDivs;
	},

	addNote: function(id,title){
		return "<div class='note-item' id='notas["+ id +"]'>"+title+"</div>";

	},
//PARA ALMACENAR EN EL DISPOSITIVO
	storageData: function(){//Solicitamos a ordova un Storage
	window.resolveLocalFileSystemURL(cordova.file.externalApplicationStorageDirectory, this.gotFS, this.fail);
},

	gotFS: function(fileSystem){//En el callbackpedimos fichero en el que estamos
		fileSystem.getFile("files/"+"model.json", {create: true, exclusive: false}, app.gotFileEntry, app.fail);
	},

	gotFileEntry: function(fileEntry){
		fileEntry.createWriter(app.gotFileWriter, app.fail);
	},

	gotFileWriter: function(writer){//Aquí tendremos el fichero abierto
		writer.onwriteend = function(evt){
			console.log("Data saved at externalApplicationStorageDirectory");
		};
		writer.write(JSON.stringify(app.model));
	},//Version JSON de nuestro modelo, con ésto ya tenemos todos los datos en el sistema

	readData: function(){
		window.resolveLocalFileSystemURL(cordova.file.externalApplicationStorageDirectory, this.getFS, this.fail);
	},

	getFS: function(fileSystem){
		fileSystem.getFile("files/"+"model.json", null, app.getFileEntry, app.noFile);
	},

	getFileEntry: function(fileEntry){
		fileEntry.file(app.readFile, app.fail);
	},

	readFile:function(file){
		var reader = new FileReader();
		reader.onloadend = function(evt){
			var data = evt.target.result;
			app.model = JSON.parse(data);
			app.init();
		};
		reader.readAsText(file);
	},

	noFile: function(error) {//En caso de no encontrar archivo
		app.init();
	},

	fail: function(error){
		console.log(error, code);
	},

	extractTitle: function(){
		return document.getElementById('title').value;
	},

	extractComment: function(){
		return document.getElementById('comment').value;
	},

hideEditor: function(){
		document.getElementById("note-editor").style.display="none";
	}

};

if('addEventListener' in document){
	document.addEventListener('deviceready',function (){
		app.readData();//Llamos los datos almacenados
	},false);
}

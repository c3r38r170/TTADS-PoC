let started=false;
let pagina='Dex';
function getAtrapados(){
		return JSON.parse(localStorage.getItem('atrapados')||'{"Dex":[],"Shiny":[],"Unown":[]}');
}

let cantidadDePokemones=60;
// fetch('https://pokeapi.co/api/v2/pokemon/?limit=905')
fetch('https://pokeapi.co/api/v2/pokemon/?limit='+cantidadDePokemones)
		.then(res=>res.json())
		.then(res=>{
				console.log(res.results);
				let todos=res.results.map(pok=>{
						pok.name=pok.name
								.replace('-f',' ♀')
								.replace('-m',' ♂');
						return pok;
				});
				Alpine.store('pokemonesDex',todos);
				Alpine.store('pokemonesShiny',todos);
				Alpine.store('title','Dex');
				Alpine.store('atrapados',getAtrapados())
				fetch('https://pokeapi.co/api/v2/pokemon/201')
						.then(res=>res.json())
						.then(unowns=>{
								let unown=[];
								for(let uno of unowns.forms){
										let letra=uno.name.split('-')[1];
										let id='-'+letra;
										let name=letra.toUpperCase();
										switch(letra){
										case 'a':
												id='';
												break;
										case 'exclamation':
												name='!';
												break;
										case 'question':
												name='?';
												break;
										}
										unown.push({id,name});
								}
								// console.log(unown,unowns);
								Alpine.store('pokemonesUnown',unown);
								if(!started){
										Alpine.start();
										started=true;
								}
						})
		});
// Alpine.start();
function cambiarEstado(id,atrapado,coleccion){
		let atrapados=getAtrapados();
		if(atrapado){
				atrapados[coleccion].push(id);
		}else{
				atrapados[coleccion].splice(atrapados[coleccion].indexOf(id),1);
		}

		Alpine.store('atrapados',atrapados);
		localStorage.setItem('atrapados',JSON.stringify(atrapados));
}

page.configure({
	window:window
	,hashbang:true
})

function mostrarSeccion(id){
		let viejo=document.querySelector('.not-hidden');
		viejo.classList.remove('not-hidden');
		document.getElementById(id).classList.add('not-hidden');
		document.body.classList.remove('main');
}

page('/', ()=>{
		mostrarSeccion('main');
		document.body.classList.add('main');
})

page('/dex', ()=>{
		pagina='Dex';
		mostrarSeccion('dex');
})

page('/shiny', ()=>{
		pagina='Shiny';
		mostrarSeccion('shiny');
})

page('/unown', ()=>{
		pagina='Unown';
		mostrarSeccion('unown');
})

window.page=page; 
const plSearch=n=>'https://www.plazalama.com.do/search?name='+encodeURIComponent(n);
const enrich={
fridge:{priceVerified:false,officialUrl:plSearch('Nevera LG LT32BPP 11 pies Inverter'),rooms:['Cocina'],need:'nevera'},
washer:{priceVerified:false,officialUrl:plSearch('Lavadora Whirlpool 14 kg'),rooms:['Lavado'],need:'lavadora'},
ac:{priceVerified:false,officialUrl:plSearch('Aire Inverter Tecnomaster 12K BTU'),rooms:['Dormitorios','Clima'],need:'aire'},
tv:{priceVerified:false,officialUrl:plSearch('Televisor Tecnomaster 40 Smart'),rooms:['Sala','Dormitorios'],need:'tv'},
microwave:{priceVerified:false,officialUrl:plSearch('Microondas Whirlpool 0.7 pies'),rooms:['Cocina'],need:'microondas'},
freezer:{priceVerified:false,officialUrl:plSearch('Freezer Horizontal Tecnomaster 5 pies'),rooms:['Cocina'],need:'freezer'},
pillow:{priceVerified:true,officialUrl:plSearch("Almohada Christys Family Standrd"),rooms:['Dormitorios'],need:'almohada'},
cutlery:{priceVerified:true,officialUrl:plSearch('Juegos De Cubiertos Churrasco Tramontina 12 Piezas'),rooms:['Comedor','Cocina'],need:'cubiertos'},
drawer:{priceVerified:true,officialUrl:plSearch('Gavetero Plástico de 5 Gavetas'),rooms:['Dormitorios'],need:'gavetero'},
curtain:{priceVerified:true,officialUrl:'https://plazalama.com.do/p/cortina-country-standard-rsxlin1510-32-140x240cm-2299902308378',rooms:['Dormitorios','Sala'],need:'cortina'},
moka:{priceVerified:true,officialUrl:plSearch('Greca Cocina Master De Aluminio 6 Tazas'),rooms:['Cocina'],need:'greca'},
tray:{priceVerified:true,officialUrl:plSearch('Bandeja Redonda de Aluminio 15'),rooms:['Cocina','Comedor'],need:'bandeja'}
};
PRODUCTS.forEach(p=>Object.assign(p,enrich[p.id]||{}));
const MORE_PRODUCTS=[
{id:'pillowQueen',dept:'Hogar',cat:'Dormitorio',brand:"Christy's",name:"Almohada Christy's Family Queen",price:273.75,stock:'Disponible',img:'',type:'pillow',specs:['Queen','Dormitorio'],why:'Para completar una habitación de huéspedes.',priceVerified:true,officialUrl:plSearch("Almohada Christy's Family Quenn"),rooms:['Dormitorios'],need:'almohada'},
{id:'towels6',dept:'Hogar',cat:'Baño',brand:'Country Standard',name:'Juego de Toalla Country Standard de la Cara 6 Piezas',price:216.75,stock:'Disponible',img:'',type:'tray',specs:['6 piezas','Baño'],why:'Básico para huéspedes y rotación.',priceVerified:true,officialUrl:plSearch('Juego de Toalla Country Standard de la Cara 6 Piezas'),rooms:['Baños'],need:'toallas'},
{id:'showerCurtain',dept:'Hogar',cat:'Baño',brand:'Casa',name:'Cortina de Baño Surtida con Ganchos',price:95,stock:'Disponible',img:'',type:'curtain',specs:['Baño','Con ganchos'],why:'Resuelve privacidad del baño a bajo costo.',priceVerified:true,officialUrl:plSearch('Cortina de Baño Surtida con Ganchos'),rooms:['Baños'],need:'cortinabano'},
{id:'soapDisp',dept:'Hogar',cat:'Baño',brand:'ZC',name:'Dispensador Decorativo para Jabón ZC',price:155,stock:'Disponible',img:'',type:'moka',specs:['Baño','Dispensador'],why:'Hace el baño más completo para huéspedes.',priceVerified:true,officialUrl:plSearch('Dispensador Decorativo para Jabón ZC'),rooms:['Baños'],need:'jabon'},
{id:'barChair',dept:'Hogar',cat:'Comedor',brand:'Andrea',name:'Silla Bar Andrea Gray 48x52x95.5',price:5771.25,stock:'Disponible',img:'',type:'drawer',specs:['Silla bar','Comedor'],why:'Asiento para desayunador o barra.',priceVerified:true,officialUrl:plSearch('Silla Bar Andrea Gray 48x52x95.5'),rooms:['Comedor'],need:'silla'},
{id:'plate',dept:'Hogar',cat:'Comedor',brand:'ZC',name:'Plato ZC 10.6 pulgadas',price:84.15,stock:'Disponible',img:'',type:'tray',specs:['10.6 pulgadas','Mesa'],why:'Vajilla simple para huésped.',priceVerified:true,officialUrl:plSearch('Plato Zc 10.6'),rooms:['Comedor','Cocina'],need:'plato'},
{id:'bowl',dept:'Hogar',cat:'Comedor',brand:'ZC',name:'Tazón hondo de melamina blanco 9 pulgadas',price:126.65,stock:'Disponible',img:'',type:'tray',specs:['9 pulgadas','Melamina'],why:'Para desayuno, cereal y servicio diario.',priceVerified:true,officialUrl:plSearch('Tazón hondo de melamina blanco de 9 pulgadas'),rooms:['Comedor','Cocina'],need:'bowl'},
{id:'napkin',dept:'Hogar',cat:'Comedor',brand:'Casa',name:'Servilleta Gris de Algodón 50x50cm',price:149.25,stock:'Disponible',img:'',type:'curtain',specs:['50x50 cm','Algodón'],why:'Termina la mesa con una presentación limpia.',priceVerified:true,officialUrl:plSearch('Servilleta Gris de Algodón 50x50cm'),rooms:['Comedor'],need:'servilleta'},
{id:'spoon',dept:'Hogar',cat:'Cocina',brand:'Cocina Master',name:'Cucharón de Servir Cocina Master',price:180,stock:'Disponible',img:'',type:'cutlery',specs:['Cocina','Servir'],why:'Utensilio básico para una cocina funcional.',priceVerified:true,officialUrl:plSearch('Cucharón de Servir Cocina Master'),rooms:['Cocina'],need:'utensilios'},
{id:'spatula',dept:'Hogar',cat:'Cocina',brand:'Cocina Master',name:'Espátula de Cocina Cocina Master',price:116,stock:'Disponible',img:'',type:'cutlery',specs:['Cocina','Espátula'],why:'Completa el set básico de cocina.',priceVerified:true,officialUrl:plSearch('Espátula De Cocina Cocina Master'),rooms:['Cocina'],need:'utensilios'},
{id:'hangers',dept:'Hogar',cat:'Dormitorio',brand:'Casa',name:'Set de Perchas de Madera 3 Piezas',price:100,stock:'Disponible',img:'',type:'drawer',specs:['3 piezas','Madera'],why:'Pequeño detalle que importa en una estadía.',priceVerified:true,officialUrl:plSearch('Set De Perchas de Madera R/P66 3 Piezas'),rooms:['Dormitorios'],need:'perchas'},
{id:'cushion',dept:'Hogar',cat:'Sala',brand:'Casa',name:'Cojín con Relleno 41x41cm',price:254.25,stock:'Disponible',img:'',type:'pillow',specs:['41x41 cm','Decoración'],why:'Da terminación y confort a la sala.',priceVerified:true,officialUrl:plSearch('Cojín con Relleno R/34917-3 41x41cm'),rooms:['Sala'],need:'cojin'},
{id:'plant',dept:'Hogar',cat:'Sala',brand:'Casa',name:'Suculenta Artificial Decorativa',price:195,stock:'Disponible',img:'',type:'moka',specs:['Decoración','Artificial'],why:'Añade detalle visual sin mantenimiento.',priceVerified:true,officialUrl:plSearch('Suculenta Artificial R/JH73'),rooms:['Sala'],need:'decoracion'},
{id:'macetero',dept:'Hogar',cat:'Sala',brand:'GW',name:'Macetero GW 13.5x13.5x13.5',price:264,stock:'Disponible',img:'',type:'moka',specs:['13.5 cm','Decoración'],why:'Accesorio sencillo para terminar un rincón.',priceVerified:true,officialUrl:'https://www.plazalama.com.do/p/macetero-gw-varios-colores-135x135x135-2299902416318',rooms:['Sala'],need:'decoracion'},
{id:'sofa',dept:'Hogar',cat:'Sala',brand:'Casa',name:'Set de Sofá Doble con Cojines Decorativos',price:34296.5,stock:'No disponible',img:'',type:'pillow',specs:['Sala','Set de sofá'],why:'Referencia real del catálogo público; actualmente figura no disponible.',priceVerified:true,officialUrl:plSearch('Set de Sofá Doble con Cojines Decorativos'),rooms:['Sala'],need:'sofa',unavailable:true}
];
MORE_PRODUCTS.forEach(p=>{if(!PRODUCTS.some(x=>x.id===p.id))PRODUCTS.push(p)});
const ROOM_ORDER=['Dormitorios','Sala','Comedor','Cocina','Baños','Lavado','Clima'];
const AIRBNB_OWNED=[
['camas','Camas / colchones'],['ropaCama','Ropa de cama'],['tv','TV'],['aire','Aire acondicionado'],['sofa','Sofá / sala'],
['comedor','Mesa / comedor'],['nevera','Nevera'],['microondas','Microondas'],['utensilios','Utensilios de cocina'],['lavadora','Lavadora'],
['toallas','Toallas'],['cortinas','Cortinas'],['todo','Ya tengo todo lo necesario']
];

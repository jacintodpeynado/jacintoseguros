/* Extra public Plaza Lama Hogar products for room-by-room browsing.
   Prices below were taken from the public Hogar/Decoracion catalog snapshot used for this prototype. */
const ROOM_PLUS_META={
  cutlery:{rooms:['Comedor','Cocina'],need:'cubiertos',subcat:'Cubiertos'},
  tray:{rooms:['Comedor','Cocina'],need:'bandeja',subcat:'Servicio'},
  pillow:{rooms:['Dormitorios'],need:'almohada',subcat:'Textiles'},
  curtain:{rooms:['Dormitorios','Sala'],need:'cortina',subcat:'Textiles'},
  drawer:{rooms:['Dormitorios'],need:'gavetero',subcat:'Organización'},
  moka:{rooms:['Cocina'],need:'greca',subcat:'Café'},
  fridge:{rooms:['Cocina'],need:'nevera',subcat:'Electro'},
  microwave:{rooms:['Cocina'],need:'microondas',subcat:'Electro'},
  washer:{rooms:['Lavado'],need:'lavadora',subcat:'Electro'},
  ac:{rooms:['Dormitorios','Clima'],need:'aire',subcat:'Clima'},
  tv:{rooms:['Sala','Dormitorios'],need:'tv',subcat:'Tecnología'}
};
Object.keys(ROOM_PLUS_META).forEach(id=>{let p=PRODUCTS.find(x=>x.id===id);if(p)Object.assign(p,ROOM_PLUS_META[id])});

const DINING_PRODUCTS=[
['plate106','ZC','Plato ZC 10.6 pulgadas',84.15,'Vajilla','plato','tray'],
['individual3648','Casa','Individual 36x48cm',168.75,'Textiles de mesa','individual','curtain'],
['bowl9','ZC','Tazón hondo de melamina blanco 9 pulgadas',126.65,'Vajilla','bowl','tray'],
['napkinGrey','Casa','Servilleta Gris de Algodón 50x50cm',149.25,'Textiles de mesa','servilleta','curtain'],
['plate8','ZC','Plato ZC 8 pulgadas colores surtidos',59.20,'Vajilla','plato','tray'],
['plate28','ZC','Plato ZC 28cm colores surtidos',79.20,'Vajilla','plato','tray'],
['plateGrey','ZC','Plato Llano ZC 10.5 pulgadas gris',79,'Vajilla','plato','tray'],
['dessertGrey','Casa','Plato para Postre de Cerámica 8 pulgadas gris',35,'Vajilla','plato','tray'],
['barChairGray','Andrea','Silla Bar Andrea Gray 48x52x95.5',5771.25,'Asientos','silla','drawer'],
['barChairBeige','Andrea','Silla Bar Andrea Beige 48x52x95.5',5771.25,'Asientos','silla','drawer'],
['plateDecor','Casa','Plato Decorativo 10.5 pulgadas diseños surtidos',63.20,'Vajilla','plato','tray'],
['plate84','ZC','Plato ZC 8.4 pulgadas varios colores',95.20,'Vajilla','plato','tray'],
['plateGreen','ZC','Plato Verde Oscuro ZC 8DC01',50.15,'Vajilla','plato','tray'],
['plateRound','Casa','Plato Redondo 10.65 pulgadas colores surtidos',60,'Vajilla','plato','tray'],
['bowl57','ZC','Bowl ZC 5.7 pulgadas color crema',55.20,'Vajilla','bowl','tray'],
['napkinTerra','Casa','Servilleta Terracota de Algodón 50x50cm',149.25,'Textiles de mesa','servilleta','curtain'],
['individualNavy','Casa','Individual 36x48cm Azul Marino',168.75,'Textiles de mesa','individual','curtain'],
['individualRound','Casa','Individual Redondo 38cm Azul Marino',93.75,'Textiles de mesa','individual','curtain'],
['plateDesign','Casa','Plato con Diseño 10.5 pulgadas',169.15,'Vajilla','plato','tray'],
['goldTray','Casa','Bandeja de Aluminio Dorada con Asa',225.25,'Servicio','bandeja','tray'],
['cutlery20','Tramontina','Juego de Cubiertos Tramontina 20 piezas',217.50,'Cubiertos','cubiertos','cutlery'],
['tableRunner','Casa','Camino de Mesa',325,'Textiles de mesa','camino','curtain']
].map(x=>({id:x[0],dept:'Hogar',cat:'Comedor',brand:x[1],name:x[2],price:x[3],stock:'Disponible según catálogo público',img:'',type:x[6],specs:[x[4],'Comedor'],why:'Opción pública de Plaza Lama para completar el comedor.',priceVerified:true,officialUrl:'https://www.plazalama.com.do/search?name='+encodeURIComponent(x[2]),rooms:['Comedor'],need:x[5],subcat:x[4]}));

const BED_PRODUCTS=[
['pillowPremium',"Christy's",'Almohada Blanca Christy Premium 19x29cm',316,'Textiles','almohada','pillow'],
['pillowQueen',"Christy's","Almohada Christy's Family Queen",273.75,'Textiles','almohada','pillow'],
['pillowBrizes','Brizes','Almohada Brizes Microfibra Queen',300,'Textiles','almohada','pillow'],
['hangersWood','Casa','Set de Perchas de Madera 3 piezas',100,'Organización','perchas','drawer'],
['curtainRail','Casa','Cortina MZ Riel',93.75,'Textiles','cortina','curtain']
].map(x=>({id:x[0],dept:'Hogar',cat:'Dormitorio',brand:x[1],name:x[2],price:x[3],stock:'Disponible según catálogo público',img:'',type:x[6],specs:[x[4],'Dormitorio'],why:'Producto público para completar habitaciones.',priceVerified:true,officialUrl:'https://www.plazalama.com.do/search?name='+encodeURIComponent(x[2]),rooms:['Dormitorios'],need:x[5],subcat:x[4]}));

const BATH_PRODUCTS=[
['towel6','Country Standard','Juego de Toalla Country Standard de la Cara 6 piezas',216.75,'Toallas','toallas','tray'],
['bathCurtain1','Casa','Cortina de Baño R/XT-005',229,'Cortinas','cortinabano','curtain'],
['bathCurtainHooks','Casa','Cortina de Baño Surtida con Ganchos',95,'Cortinas','cortinabano','curtain'],
['bathSet','Casa','Set de Cortina de Baño con Alfombra y Ganchos',390,'Cortinas','cortinabano','curtain'],
['soapBlack','UZ','Jabonera Negra UZ',225,'Accesorios','jabon','moka'],
['soapDisp','ZC','Dispensador Decorativo para Jabón ZC',155,'Accesorios','jabon','moka'],
['soapWhite','UZ','Jabonera para Baño Blanca con Rejilla Cromada',199,'Accesorios','jabon','moka']
].map(x=>({id:x[0],dept:'Hogar',cat:'Baño',brand:x[1],name:x[2],price:x[3],stock:'Disponible según catálogo público',img:'',type:x[6],specs:[x[4],'Baño'],why:'Producto público para equipar baños de huéspedes.',priceVerified:true,officialUrl:'https://www.plazalama.com.do/search?name='+encodeURIComponent(x[2]),rooms:['Baños'],need:x[5],subcat:x[4]}));

const KITCHEN_PRODUCTS=[
['ladle','Cocina Master','Cucharón de Servir Cocina Master',180,'Utensilios','utensilios','cutlery'],
['spatula','Cocina Master','Espátula de Cocina Cocina Master',116,'Utensilios','utensilios','cutlery'],
['plantainMasher','Casa','Majador de Plátano en Madera',196,'Utensilios','utensilios','cutlery'],
['mofongo','Casa','Pilón de Mofongo',796,'Utensilios','utensilios','moka'],
['pitcher','Family','Jarra Plástica Family 2.5 Lt',56,'Servicio','jarra','tray'],
['measuringCup','Casa','Taza Medidora 250ml',109.65,'Utensilios','utensilios','tray'],
['peeler','Casa','Pelador de Naranjas',45,'Utensilios','utensilios','cutlery'],
['plateRack','Family','Set de Platera Family Plástico',588,'Organización','platera','drawer']
].map(x=>({id:x[0],dept:'Hogar',cat:'Cocina',brand:x[1],name:x[2],price:x[3],stock:'Disponible según catálogo público',img:'',type:x[6],specs:[x[4],'Cocina'],why:'Producto público para completar una cocina funcional.',priceVerified:true,officialUrl:'https://www.plazalama.com.do/search?name='+encodeURIComponent(x[2]),rooms:['Cocina'],need:x[5],subcat:x[4]}));

const LIVING_PRODUCTS=[
['cushionFill','Casa','Cojín con Relleno 41x41cm',254.25,'Textiles','cojin','pillow'],
['succulent','Casa','Suculenta Artificial Decorativa',195,'Decoración','decoracion','moka'],
['planter149','Casa','Macetero Color Terracota 8.5x8.5',149,'Decoración','decoracion','moka'],
['plant199','Casa','Planta Artificial con Flores Decorativas',199,'Decoración','decoracion','moka'],
['flowers249','Casa','Flor Decorativa Artificial',249,'Decoración','decoracion','moka'],
['diffuser','Casa','Difusor Aromático de Varillas',795,'Decoración','decoracion','moka'],
['sofaPublic','Casa','Set de Sofá Doble con Cojines Decorativos',34296.5,'Muebles','sofa','pillow']
].map(x=>({id:x[0],dept:'Hogar',cat:'Sala',brand:x[1],name:x[2],price:x[3],stock:x[0]==='sofaPublic'?'No disponible':'Disponible según catálogo público',img:'',type:x[6],specs:[x[4],'Sala'],why:'Producto público para completar la sala.',priceVerified:true,officialUrl:'https://www.plazalama.com.do/search?name='+encodeURIComponent(x[2]),rooms:['Sala'],need:x[5],subcat:x[4],unavailable:x[0]==='sofaPublic'}));

const CLIMATE_PRODUCTS=[
{id:'fanKDK',dept:'Electrodomésticos',cat:'Clima',brand:'KDK',name:'Abanico Orbital KDK A40R 16 pulgadas',price:8995,stock:'Últimas unidades según catálogo público',img:'',type:'ac',specs:['16 pulgadas','Orbital'],why:'Alternativa de ventilación para áreas comunes.',priceVerified:true,officialUrl:'https://www.plazalama.com.do/search?name='+encodeURIComponent('Abanico Orbital KDK A40R 16'),rooms:['Clima','Sala'],need:'aire',subcat:'Ventilación'},
{id:'fanWallTM',dept:'Electrodomésticos',cat:'Clima',brand:'Tecnomaster',name:'Abanico de Pared Tecnomaster DF750TW 30 pulgadas',price:6595,stock:'224 unidades en página pública rastreada',img:'',type:'ac',specs:['30 pulgadas','Pared'],why:'Ventilación potente sin ocupar piso.',priceVerified:true,officialUrl:'https://plazalama.com.do/p/abanico-de-pared-tecnomaster-mdf750tw-30-2299901007050',rooms:['Clima','Sala'],need:'aire',subcat:'Ventilación'}
];

[...DINING_PRODUCTS,...BED_PRODUCTS,...BATH_PRODUCTS,...KITCHEN_PRODUCTS,...LIVING_PRODUCTS,...CLIMATE_PRODUCTS].forEach(p=>{if(!PRODUCTS.some(x=>x.id===p.id))PRODUCTS.push(p)});

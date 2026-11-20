# -*- coding: utf-8 -*-
"""Curaduría del canal #museo de Discord -> entradas del Museo de la Wiki.

Cada entrada: slug, nombre, serie, descripcion, imgs [(msg, k, pie)],
enlaces [(texto, url)], medios [(tipo, msg, k, nombre_archivo, titulo)].
msg = índice en export/museo-discord/mensajes.json, k = número de adjunto.
Se omiten las descripciones de personajes (mensajes 43-52, 54-56 y 58-63)
porque ya están en la sección de Personajes.
"""

ENTRADAS = [
  dict(slug='panamericanos', nombre='El peluche de los Panamericanos', serie='DMB',
       descripcion='Origen de este personaje: apareció en los capítulos 7 y 10 de Dúper Mario Bros.\nPertenece a las mascotas de los Juegos Panamericanos de 2011.',
       imgs=[(0,0,'El peluche que aparece en DMB'),(1,0,'Mascotas de los Juegos Panamericanos 2011')]),

  dict(slug='promos-dmb', nombre='Promos de Dúper Mario Bros', serie='DMB',
       descripcion='Imágenes promocionales que Rodrigo subió a su Facebook para anunciar los episodios de Dúper Mario Bros.\nDel promo del episodio 6 subió varias variaciones.',
       imgs=[(5,0,''),(8,0,''),(9,0,''),(10,0,'Promo del episodio 6'),(10,1,'Promo del episodio 6 (variación)'),(10,2,'Promo del episodio 6 (variación)'),(11,0,'¡Aniversario!'),(14,0,'Episodio 8 próximamente'),(16,0,'Episodio 8 próximamente'),(17,0,'En el sabio confiamos')]),

  dict(slug='promos-legobob', nombre='Promos de LegoBob', serie='LB',
       descripcion='Imágenes de LegoBob que Rodrigo subió a su Facebook.',
       imgs=[(6,0,''),(21,0,''),(22,0,'Especial de Halloween'),(26,0,''),(27,0,''),(28,0,'Super LegoBob Bros.')]),

  dict(slug='volante-legobob', nombre='El volante de LegoBob', serie='LB',
       descripcion='Una imagen de LegoBob que Rodrigo subió a su Facebook.\nGracias a la entrevista de 2025 supimos que Rodrigo la imprimió y la envió a varios compañeros. Aquí también está una de esas hojas impresas y la imagen original que compartió para la entrevista.',
       imgs=[(4,0,''),(40,0,''),(279,0,''),(279,1,'Una de las hojas impresas'),(281,0,'Imagen original compartida por Rodrigo para la entrevista')]),

  dict(slug='dibujos-link', nombre='Dibujos de Link de Rodrigo', serie='PD',
       descripcion='Dibujos de Link que Rodrigo subió a su Facebook.\n"Más dibujos de Link que había hecho hace 1 año"\n"Un dibujo de Link que hice, ¿qué tal me quedó?"',
       imgs=[(7,0,''),(18,0,'"Más dibujos de Link que había hecho hace 1 año"'),(19,0,'"Un dibujo de Link que hice, ¿qué tal me quedó?"'),(160,0,'Dibujo de Rodrigo de 2012')]),

  dict(slug='primer-creepypasta', nombre='Recuerdo de mi primer Creepypasta', serie='Creepy',
       descripcion='Imagen que Rodrigo subió a su Facebook:\n"Les dejo esto de recuerdo para que al menos tengan algo para recordar mi primer Creepypasta (el cual era malo)".',
       imgs=[(12,0,'')]),

  dict(slug='examen-photoshop', nombre='Examen final de Photoshop', serie='TMD',
       descripcion='"Nada que ver, pero he aquí un trabajo que hice de examen final para mi clase de Photoshop equis de" - Rodrigo',
       imgs=[(13,0,'')]),

  dict(slug='logos-tmd', nombre='Logos e imágenes de perfil de TMD', serie='TMD',
       descripcion='Logos de TheMarioDimension que Rodrigo subió a su Facebook (sí, el del fuego también lo hizo Rodrigo), el fuego usado en la foto de perfil antigua de TMD y un remake.',
       imgs=[(20,0,''),(25,0,'Sí, esto lo hizo Rodrigo'),(109,0,''),(110,0,''),(111,0,'Remake'),(203,0,'Fuego usado en la foto de perfil antigua de TMD'),(203,1,'')]),

  dict(slug='fotos-facebook', nombre='Fotos del Facebook de Rodrigo', serie='TMD',
       descripcion='Fotos de peluches, juguetes y legos que Rodrigo subió a su Facebook.',
       imgs=[(15,0,''),(23,0,''),(24,0,''),(29,0,''),(30,0,''),(31,0,''),(32,0,''),(33,0,''),(171,0,''),(34,0,'"Alerta de ladrón, alerta de ladrón!"'),(35,0,''),(36,0,''),(38,0,'"Cara de baboso"')]),

  dict(slug='bloopers', nombre='Bloopers perdidos', serie='LB',
       descripcion='LOST MEDIA: en el Facebook de Rodrigo hay unos videos que parecen ser bloopers; tristemente no son accesibles.\nEn la página de Facebook "TheMariodimension Legobob" Rodrigo subió un video de 3 segundos que era un blooper del episodio 6. Mostraba una escena donde LegoBob se suponía que se iba a romper en pedazos, pero al final terminó pasando algo que no podemos saber, ya que el video no se carga y probablemente es lost media para siempre.',
       imgs=[(37,0,''),(159,0,''),(159,1,'EP 6 BLOOPER - caída...rara')]),

  dict(slug='esta-de-moda', nombre='The ___ Dimension está de moda???', serie='TMD',
       descripcion='LOST MEDIA: "The ___ Dimension Está de Moda??? o.O"\nDescripción: "Si tienes una cuenta llamada The______Dimension por favor comenta!"\nEn el grupo de Facebook Rodrigo también contestó que él era la fuente de esos nombres de usuario.',
       imgs=[(41,0,''),(287,0,'')],
       enlaces=[('Link del video (perdido)','https://www.youtube.com/watch?v=HAwqtFCX8pE')]),

  dict(slug='green-rex', nombre='Green Rex', serie='LB',
       descripcion='"Un dinosaurio de piezas verdes de lego, era la mascota del villano hasta que Legobob lo hizo pedazos."',
       imgs=[(53,0,'')]),

  dict(slug='diseno-dustin', nombre='El diseño de Dustin', serie='LB',
       descripcion='"Antes del EP 7 de Legobob, planeaba poner otro personaje en vez de Dustin, pero luego pensé que sería genial hacer mi propio personaje de lego y ponerlo al aire, ¡y aquí lo tienen! En esta foto pueden ver cómo se diseñó Dustin!" - Rodrigo',
       imgs=[(57,0,'')]),

  dict(slug='crea-tu-legobob', nombre='Concurso: crea tu propio LegoBob', serie='LB',
       descripcion='Alrededor de los 2010s, Rodrigo hizo competiciones de "crea tu propio LegoBob". Aquí están todos los que se pudieron encontrar.',
       imgs=[(64,0,''),(81,0,'¡Felicidades, Rick TheLinkdimension!')]),

  dict(slug='peluchin', nombre='Peluchín y Fuck You', serie='LB',
       descripcion='Tanto Peluchín como Fuck You (los paramédicos que recogen a Burro en el episodio 10) son el peluche de la mascota de Liverpool, "Bolo".',
       imgs=[(65,0,''),(65,1,''),(65,2,'')]),

  dict(slug='detras-preguntas', nombre='Detrás de las escenas de Preguntas Dimensionales', serie='PD',
       descripcion='Detrás de las escenas de Preguntas Dimensionales: los mensajes con preguntas que le llegaban a Rodrigo y su aviso en el grupo para que no hicieran preguntas "a lo melolengo".',
       imgs=[(71,0,''),(72,0,'')]),

  dict(slug='publicaciones-facebook', nombre='Publicaciones de Rodrigo en Facebook', serie='TMD',
       descripcion='Publicaciones que Rodrigo hizo en Facebook y en el grupo "TheMariodimension Legobob": avisos de episodios, retrasos, encuestas y reglas del grupo.\n"En serio, no se desesperen, si no contesto es porque ando ocupado, no entro a Face en esta cuenta realmente para chatear, solo para checar cosas y poner publicaciones e info sobre TMD y TZD..."',
       imgs=[(66,0,''),(67,0,''),(68,0,''),(69,0,''),(73,0,''),(75,0,''),(76,0,''),(77,0,''),(78,0,''),(83,0,''),(84,0,''),(86,0,''),(87,0,''),(88,0,''),(89,0,''),(97,0,''),(199,0,''),(220,0,'')],
       enlaces=[('Posts de Rodrigo en el grupo de Facebook','https://www.facebook.com/groups/346870488671276/user/100002180370429')]),

  dict(slug='capturas-2012', nombre='Capturas de 2012', serie='TMD',
       descripcion='Capturas que Rodrigo compartió del canal y del grupo de Facebook en 2012, incluyendo el banner del "Grupo Oficial".',
       imgs=[(70,0,''),(74,0,'"It\'s over 100!!!"'),(80,0,''),(85,0,'')]),

  dict(slug='fans-2012', nombre='Publicaciones de fans en 2012', serie='TMD',
       descripcion='Imágenes y comentarios que los fans publicaron en Facebook en 2012.',
       imgs=[(194,0,'Del Facebook de "Kelf Ramos", 11 de junio de 2012: "wow eres famoso xd"'),(200,0,'De Franco G. Quintana, 23 de agosto de 2012'),(204,0,'De Antonio Guzmán'),(205,0,'De Alex Conker Oteo, 25 de octubre de 2012: "ooooo xD"'),(207,0,'De Pedro AG, 13 de octubre de 2012'),(208,0,'De Franco G. Quintana, 7 de octubre de 2012'),(210,0,'De Franco G. Quintana, 7 de octubre de 2012'),(211,0,'De Franco G. Quintana, 23 de agosto de 2012'),(212,0,'De Franco G. Quintana, 21 de agosto de 2012'),(213,0,'De Patricio Reyna, 4 de julio de 2012'),(213,1,''),(213,2,''),(214,0,'De Luis Enrique Gutierrez, 20 de junio de 2012: "WTFF qué carajo es esto"'),(216,0,'De Franco G. Quintana, 16 de junio de 2012: "jeje miren la carita escondida jeje"'),(218,0,'De Rick TheLinkdimension, 12 de mayo de 2012: "WTF!!?"')]),

  dict(slug='anuncios-antiguos', nombre='Anuncios antiguos de Rodrigo', serie='TMD',
       descripcion='Anuncios que Rodrigo publicaba sobre sus series: búsqueda de voces para Dúper Mario Bros, nuevas series, próximos episodios de LegoBob y más.',
       imgs=[(92,0,'Necesito voces para Dúper Mario Bros'),(93,0,'¿Qué le pasó a LegoBob EP 17 - La Escuela?'),(94,0,'Nueva serie próximamente'),(95,0,''),(96,0,'Próximo episodio'),(100,0,'Tómate esto con calma'),(101,0,'Problema de la pantalla diminuta'),(102,0,'LegoBob EP 16')]),

  dict(slug='que-paso-legobob', nombre='¿Qué pasó con LegoBob?', serie='LB',
       descripcion='El video "¿Qué pasó con LegoBob?" estuvo perdido: en 2021 YouTube puso en privado los videos no listados de antes de 2017, y en 2022 Rodrigo regresó los videos de LegoBob pero dejó en privado "¿Qué pasó con LegoBob?" y "Selección de episodios".\nEn 2024, TheWeirdoDimension contó en el servidor que él lo tenía, y el video completo se compartió en el museo.',
       imgs=[(105,0,'Miniatura'),(146,0,''),(153,0,''),(134,0,''),(174,0,'"yo lo tengo xd"')],
       medios=[('video',172,0,'que-paso-con-legobob.mp4','¿Qué pasó con LegoBob? (360p)')],
       enlaces=[('Link original del video','https://www.youtube.com/watch?v=BDTQr5BVrPA')]),

  dict(slug='video-maldito', nombre='LegoResumen - Creepypasta: El Video Maldito', serie='Creepy',
       descripcion='LOST MEDIA: "LegoResumen - Creepypasta : El Video Maldito"\nDescripción: "Resumimos y hablamos sobre el Creepy que subí ayer, espero que les guste!"',
       imgs=[(193,0,'')],
       enlaces=[('Link del video (perdido)','https://www.youtube.com/watch?v=0SzlB5GRPtc')]),

  dict(slug='operacion-destruccion', nombre='Operación Destrucción', serie='LB',
       descripcion='El episodio 15 de LegoBob, "El VerdeBob", originalmente iba a llamarse "Operación Destrucción".',
       imgs=[(192,0,''),(99,0,'')]),

  dict(slug='imagenes-recuperadas', nombre='Imágenes originales recuperadas', serie='TMD',
       descripcion='Imágenes originales usadas en los videos del canal, recuperadas por la comunidad.',
       imgs=[(103,0,''),(107,0,''),(112,0,''),(113,0,''),(115,0,''),(116,0,''),(117,0,''),(118,0,'"Mejoré algunos aspectos."'),(120,0,''),(121,0,''),(122,0,''),(132,0,''),(144,0,''),(248,0,'')]),

  dict(slug='el-despertador', nombre='El Despertador', serie='Creepy',
       descripcion='Imagen usada en el creepy "El Despertador".',
       imgs=[(114,0,'')]),

  dict(slug='april-fools', nombre='El April Fools de DMB', serie='DMB',
       descripcion='Miniatura del video de April Fools de Dúper Mario Bros. En algún punto de 2016 el video fue puesto en privado o borrado; aquí está la miniatura y aparentemente una captura del video.\nLa misma imagen apareció en Preguntas Dimensionales #4 como un supuesto screenshot de una supuesta parte 2 del episodio 12.\nTambién se descubrió un tuit: "Me gustó un video de @YouTube: [APRIL FOOLS] Dúper Mario Bros - Episodio 12".',
       imgs=[(123,0,'Miniatura del video de April Fools'),(147,0,''),(147,1,''),(182,0,''),(182,1,'Captura del video'),(257,0,'')],
       enlaces=[('El tuit','https://x.com/CheydeKabour/status/444667675059691520')]),

  dict(slug='peluche-johnny', nombre='El misterio del peluche de Johnny', serie='DMB',
       descripcion='El peluche de Johnny es todo un misterio: no sabemos de dónde salió ni quién lo hizo, y hemos visto varios peluches iguales (y parecidos) por internet. El primero lo encontró SynoTheKing, un pionero de los plushtubers hispanos; también está el del canal Peluso\'s World, que es igualito ("Lo encontré en un mercado junto con otros estilos de perritos. Fue solo coincidencia.").\nDespués de mucho se descubrió una forma de comprar un Johnny en AliExpress (por unos 30 dólares, y solo había uno disponible). También apareció en Wallapop, mucho más barato, pero el sitio es de España y no parece hacer envíos internacionales.\nY por si alguna vez quisiste fotos en alta calidad de Johnny: aquí están.',
       imgs=[(142,0,'Fotos en alta calidad de Johnny'),(124,0,'Encontrado por SynoTheKing'),(124,1,''),(125,0,'Lo que contestó Peluso'),(126,0,''),(126,1,''),(126,2,''),(141,0,''),(142,1,''),(142,2,''),(142,3,''),(142,4,''),(142,5,''),(142,6,''),(142,7,''),(189,0,''),(190,0,''),(190,1,''),(241,0,'')],
       enlaces=[('AliExpress','https://www.aliexpress.us/item/2251832806032208.html'),('Wallapop','https://es.wallapop.com/item/peluche-grande-919298339')]),

  dict(slug='boca-sabio', nombre='La boca del Sabio Washatumorra', serie='DMB',
       descripcion='La boca del Sabio Washatumorra en esta escena viene de los comerciales de Game Boy donde la boca dice el slogan "Get into it".',
       imgs=[(130,0,''),(131,0,'')]),

  dict(slug='reproducciones-2013', nombre='¿Y tus reproducciones TMD?', serie='TMD',
       descripcion='Viejo video de 2013 que muestra el canal de Rodrigo en esa época.',
       imgs=[(133,0,'')],
       enlaces=[('Ver el video','https://youtu.be/Oz72zX6EqWg')]),

  dict(slug='turulato', nombre='Turulato', serie='TMD',
       descripcion='Definición de "turulato". Aquí alguien en 2012 buscando turulato.',
       imgs=[(135,0,'')],
       enlaces=[('Definición de turulata','https://youtu.be/nceNk7uu4jA')]),

  dict(slug='videos-fans-dmb', nombre='Videos de fans de Dúper Mario Bros', serie='DMB',
       descripcion='Videos hechos por fans: un episodio 4 en Flipnote, recreaciones de los episodios 1 y 2, y streams viendo la serie.',
       imgs=[(137,0,'Dúper Mario Bros episodio 4 Flipnote'),(177,0,'AHORA SÍ QUE SÍ YA VOLVÍ'),(178,0,'Seguimos viendo Dúper Mario Bros')],
       enlaces=[('Episodio 4 Flipnote','https://youtu.be/L6bhq3ZUoqc'),('Recreación - Episodio 1','https://www.youtube.com/watch?v=qZgJMA6a9zs'),('Recreación - Episodio 2','https://www.youtube.com/watch?v=DG2fr7J0c_0'),('AHORA SÍ QUE SÍ YA VOLVÍ','https://www.youtube.com/watch?v=dNvbw1EqOAE'),('Seguimos viendo Dúper Mario Bros','https://youtu.be/aofBBFjJXuA')]),

  dict(slug='origen-weirdo', nombre='El origen del Weirdo', serie='CW',
       descripcion='"¡Me lo pasó Rodrigo para que se los compartiera, el origen del Weirdo!" - TMD2\nDibujos originales de The Weirdo\'s Survival Courses, junto con otras imágenes del Weirdo.',
       imgs=[(285,0,"The Weirdo's Survival Courses"),(285,1,''),(285,2,''),(285,3,''),(285,4,''),(285,5,''),(285,6,''),(285,7,''),(285,8,''),(285,9,''),(128,0,''),(129,0,''),(138,0,'"El Chow de Weirdo"')]),

  dict(slug='gohitenks', nombre='La controversia de Gohitenks', serie='Creepy',
       descripcion='Comentarios de la controversia de Gohitenks y la cuenta falsa de TMD. En palabras de MetaWolf en un tuit del 5 de abril de 2018: "Gohitenks acaba de responderle a la cuenta falsa de TMD con mi cuenta falsa diciéndole que mi video que hice hablando sobre él no fue más que un malentendido, lo que recomiendo es que vayan a su canal y denuncien su canal principal, el falso yo y el falso TMD."\nDe Gohitenks no queda mucho: aquí su foto de perfil en la mayor calidad que se pudo encontrar, y en el Internet Archive está lo poco que queda de su canal.\nTambién están las partes que Gohitenks agregó al creepypasta robado de Course 16 (al inicio y al final) y al video robado de El Despertador, transcritas de los subtítulos con filmot.com. La transcripción del video robado de Toc Toc se perdió seguramente para siempre.',
       imgs=[(150,0,''),(150,1,''),(151,0,'Foto de perfil de Gohitenks'),(151,1,''),(247,0,''),(295,0,'Course 16: parte agregada al inicio'),(295,1,'Course 16: parte agregada al final'),(297,0,'Partes agregadas al video robado de El Despertador'),(297,1,'')],
       enlaces=[('Canal de Gohitenks en el Internet Archive','https://web.archive.org/web/20190604042537/https://www.youtube.com/channel/UCaKBrzzbMNagQqtW9VHhFMQ'),('Video de 2018: el canal falso de TMD vs. el real','https://youtu.be/26m72VdgfvU')]),

  dict(slug='quien-peleo-mejor', nombre='¿Quién peleó mejor?', serie='LB',
       descripcion='Gracias a una extensión que nos deja ver las anotaciones de YouTube podemos ver que... ¡DUSTIN GANÓ LA PELEA!',
       imgs=[(152,0,'')]),

  dict(slug='canal-tmd', nombre='El canal de TMD a través de los años', serie='TMD',
       descripcion='Capturas del canal de TheMarioDimension en distintas épocas, banners y fondos.\nDescripción (parcial) antigua del canal: "Bienvenido a la dimensión más genial de Youtube! Plush Videos y Creepypastas al alcance de ti! MUY IMPORTANTE: Los videos que hago son MI pasatiempo, los hago cuando quiero, podría tardar hasta meses para hacerlos, no se quejen que me tardo, los hago cuando quiero, no trabajo aquí ni me pagan..."\nLa lista de reproducción "Jueguemos a: Minecraft - Deja Vu" no tiene videos, pero no está borrada.',
       imgs=[(104,0,''),(106,0,''),(108,0,''),(154,0,''),(155,0,''),(156,0,''),(157,0,''),(157,1,''),(163,0,'Captura de 2013'),(170,0,''),(181,0,''),(223,0,'Wallpaper viejo de Rodrigo'),(223,1,''),(224,0,'Imagen de fondo usada en el banner de Rodrigo'),(224,1,''),(240,0,'Encontrado dentro de un embed viejo del grupo de Facebook')],
       enlaces=[('Jueguemos a: Minecraft - Deja Vu (lista vacía)','https://www.youtube.com/playlist?list=PLOQ41Guc_k8pOEUBx19AqmHFuWmHgNPvG')]),

  dict(slug='no-se-habla', nombre='En el museo no se habla', serie='TMD',
       descripcion='¡En el museo no se habla!\n(¿Notaron el Ezlo a la izquierda?)',
       imgs=[(165,0,''),(166,0,'')]),

  dict(slug='bowser-hd', nombre='Bowser Mada Faca en alta calidad', serie='DMB',
       descripcion='Imagen de Bowser Mada Faca en alta calidad. Bowser Mada Faca y Mallio Bros incluso tenían sus propios perfiles de Facebook.',
       imgs=[(161,0,''),(162,0,'Grande'),(79,0,'El perfil de Facebook de Bowser Mada Faca')],
       enlaces=[('Perfil de Facebook de Mallio Bros','https://www.facebook.com/profile.php?id=100004129783256')]),

  dict(slug='que-fue-de-rodrigo', nombre='¿Qué fue de Rodrigo?', serie='TMD',
       descripcion='Después del capítulo 12, muchos se preguntaron qué fue de Rodrigo. A través de los años hubo escasas señales de vida:\n- 9 de enero de 2015: todas las listas de reproducción excepto "Jueguemos a: Minecraft Supervivencia" fueron actualizadas (sus descripciones fueron editadas).\n- 2016: el video de April Fools de DMB fue puesto en privado o borrado.\n- 2018: aumentó la lista de canales suscritos de Rodrigo, y parece que el banner cambió de rojo a azul (no confirmado, puede ser efecto Mandela).\n- 2019: Rodrigo actualizó su descripción. El 13 de septiembre reactivó los comentarios del capítulo 12 de DMB, dio corazones a muchos comentarios y fijó un comentario de @spergatito en el video de selección de episodios de LegoBob.\n- 2021: YouTube puso en privado los videos no listados de antes de 2017, y todos los videos de LegoBob desaparecieron.\n- 2022: Rodrigo regresó los videos y puso en privado "¿Qué pasó con LegoBob?" y "Selección de episodios".\n- 9 de mayo de 2023: Rodrigo dejó un bonito comentario en el episodio 12, que pasó de llamarse "Dúper Mario Bros - UNA PARTE DEL Episodio 12" a "Dúper Mario Bros - Episodio 12", y fijó un comentario del Loco Damián en el video de Toc Toc.\nGracias a Francesco el Pro por recopilar la mayoría de esta información.',
       imgs=[(184,0,''),(186,0,'El comentario de Rodrigo en el episodio 12'),(127,0,''),(186,1,''),(188,0,'')]),

  dict(slug='regreso-rodrigo', nombre='El regreso de Rodrigo', serie='TMD',
       descripcion='30 de diciembre de 2024: el día que TheMarioDimension/Rodrigo volvió.',
       imgs=[(275,0,''),(274,0,'29 de Febrero...wiiiii!'),(276,0,'TheZeldaDimension'),(277,0,'')],
       enlaces=[('dúper mario','https://youtu.be/mFPcrhUzaBU'),('29 de Febrero...wiiiii!','https://youtu.be/Ety6CbFc8g0')]),

  dict(slug='grito-soul', nombre='El grito de Mario Soul', serie='DMB',
       descripcion='El grito de Mario Soul.',
       imgs=[],
       medios=[('audio',179,0,'grito-mario-soul.mp3','Grito de Mario Soul')]),

  dict(slug='dmb-7-filler', nombre='DMB 7 es filler', serie='DMB',
       descripcion='¡DÚPER MARIO BROS EP 7 ES UN EPISODIO FILLER CONFIRMADO!',
       imgs=[(221,0,'')]),

  dict(slug='cancion-canto-mortal', nombre='La canción de Canto Mortal', serie='LB',
       descripcion='La canción de fondo de LegoBob EP 1 - Canto Mortal es todo un misterio. Según la descripción del video se llama "(k)new day" de Musicshake; en el sitio de Musicshake aparece hecha por un tal "dethmook", pero por la desaparición de Flash el sitio está super roto y sacar la canción es imposible.\nBuscando en YouTube se encontró un fragmento de 30 segundos subido hace 13 años (el video de LegoBob dura 44 segundos), y después una gran porción de la canción: 1 minuto con 48 segundos.',
       imgs=[(228,0,'')],
       medios=[('archivo',232,0,'dethmook.rar','Descargar la canción (.rar)')],
       enlaces=[('(k)new day en Musicshake','https://eng.musicshake.com/song/76216'),('Fragmento de 30 segundos','https://youtu.be/klPWWnfjNuw'),('CSS-Tutorial','https://youtu.be/SIR4QIEI9RI')]),

  dict(slug='capitulo-8-perdido', nombre='El "capítulo 8" perdido de DMB', serie='DMB',
       descripcion='LOST MEDIA: el 12 de junio de 2012 Rodrigo subió el "capítulo 8" de DMB y lo anunció en su grupo de Facebook. Lo raro viene cuando hacemos click en el link y vemos que está roto.\nAl día siguiente subiría este teaser, y el episodio 8 terminaría siendo subido el 16 de junio; Rodrigo lo anunció en su grupo con un link que lleva al episodio actual.\nSi alguien se acuerda de este video, ¡avísenos!',
       imgs=[(233,0,''),(234,0,'El teaser'),(234,1,''),(235,0,'')],
       enlaces=[('Link del "capítulo 8" (roto)','https://www.youtube.com/watch?v=e1pvzkLwgb8'),('El post del grupo','https://www.facebook.com/groups/346870488671276/permalink/441660785858912/')]),

  dict(slug='fondos-dmb', nombre='Fondos originales de DMB', serie='DMB',
       descripcion='Imágenes y fondos originales que Rodrigo usó en Dúper Mario Bros, encontrados por la comunidad (gracias, XDA).\nIncluye la imagen usada en el capítulo 1, el cielo original del EP 1, los últimos fondos del episodio 12, el Oxxo original sin editar del capítulo 4 y el Bowser\'s Castle del episodio 2 en HD.',
       imgs=[(231,0,'Imagen usada por Rodrigo en el capítulo 1'),(231,1,''),(299,0,'Imagen original del cielo que usó Rodrigo en el EP 1'),(299,1,''),(300,0,''),(301,0,''),(301,1,''),(242,0,'Último fondo utilizado en el episodio 12'),(242,1,''),(308,0,''),(308,1,''),(244,0,'Uno de los últimos fondos usados en el episodio 12'),(244,1,''),(246,0,''),(246,1,''),(249,0,'Oxxo original sin editar (capítulo 4)'),(249,1,''),(306,0,"Bowser's Castle del episodio 2 en HD")],
       enlaces=[('Okpo mountain view (Wikimedia Commons)','https://commons.wikimedia.org/wiki/File:Okpo_mountain_view.jpg')]),

  dict(slug='fondo-legobob-16', nombre='Imagen usada en LegoBob EP 16', serie='LB',
       descripcion='Imagen usada por Rodrigo en el episodio 16 de LegoBob.',
       imgs=[(202,0,''),(202,1,'')]),

  dict(slug='reglas-tmd-tzd', nombre='Reglas de TMD y TZD', serie='TMD',
       descripcion='Nuevo lost media de TMD: "Reglas de TMD y TZD".',
       imgs=[(197,0,'')],
       enlaces=[('Link del video (perdido)','https://www.youtube.com/watch?v=odgOqgnYDWw')]),

  dict(slug='comentarios-guardados', nombre='Comentarios guardados', serie='LB',
       descripcion='Se guardaron todos los comentarios del creepy de LegoBob y de la selección de episodios de LegoBob. Los del video de "¿Dónde está LegoBob?" quedaron tan largos que están en un archivo aparte.',
       imgs=[(250,0,'Comentarios del creepy de LegoBob'),(251,0,'De la selección de episodios de LegoBob')],
       enlaces=[('Comentarios de "¿Dónde está LegoBob?" (MediaFire)','https://www.mediafire.com/file/8hhvw9tjhxf160o/Dondeestalegobobcomentarios.rar/file')]),

  dict(slug='continuacion-rojizo', nombre='La continuación de EL ROJIZO 54', serie='DMB',
       descripcion='Dúper Mario Bros - Continuación de EL ROJIZO 54.\nEpisodio 12 Parte 2: Mario y los demás llegan a la Torre Sagrada, donde una misteriosa mujer impide que obtengan la esfera: es Punachimesa, la esposa del sabio. Mientras tanto, LegoBob visita las tumbas de Burro, Dustin y Pikachu (todo fue un sueño), y Bowser contrata nuevos secuaces.\nEpisodio 13: Punachimesa (Katerine) revela que es una diosa y que su hermano es Soul, cuyo verdadero nombre es Kiro. La siguiente esfera está en el templo de los dioses.\nEpisodio 14: Mario llama a Rosalina para viajar en el planetarium; en el templo, el guardián enmascarado resulta ser Krott, el otro hermano de Punachimesa. Koopa pide a Mario unirse para sacar a Soul de Bowser.\nEpisodio 15: en el planeta Kopot los héroes enfrentan a un dragón oscuro y recuperan la última esfera (y se olvidan de salvar a Peach). Clay regresa como guardián del templo sagrado y transforma las esferas en un poder.\nBonus "Peach...": en el club de comedia Bickolt, ahora administrado por Groovy, los héroes celebran... hasta que recuerdan que se olvidaron de Peach.\nTambién hay miniaturas que no se usaron: la del episodio 13 iba a tener una trama totalmente diferente.',
       imgs=[(268,0,''),(268,1,''),(268,2,''),(268,3,''),(268,4,''),(271,0,'Miniatura del bonus'),(270,0,'Miniatura no utilizada'),(270,1,'Miniatura no utilizada'),(272,0,'Episodio 12 Parte 2 encontrado')],
       enlaces=[('Episodio 12 Parte 2','https://youtu.be/6Zr5wfuXcxc')]),

  dict(slug='entrevista-2025', nombre='La entrevista de 2025', serie='TMD',
       descripcion='Gracias a la entrevista de 2025 se respondieron muchas preguntas que nunca tuvieron respuesta. Esta es una de las imágenes originales que compartió Rodri para la entrevista (con el collage hecho por WiWi de fondo).',
       imgs=[(282,0,'')]),

  dict(slug='servidor-minecraft', nombre='El servidor de Minecraft original', serie='JA',
       descripcion='Video mostrando el servidor de Minecraft; entre todo se menciona que Rodrigo potencialmente haría un video promocionando el servidor.\nTambién se encontró la semilla del mundo de Minecraft CO-OP, gracias a Oswaldo GD.',
       imgs=[(292,0,''),(311,0,'Semilla del mundo de Minecraft CO-OP')],
       enlaces=[('Ver el video','https://youtu.be/_-r1HKMHFA0')]),

  dict(slug='outro-lets-play', nombre="Tema del outro de los Let's Play", serie='JA',
       descripcion="El tema del outro de los Let's Play es \"Crawl, End Crawl\" (de la película Quantum of Solace).",
       imgs=[(293,0,'')],
       enlaces=[('Escuchar en YouTube','https://www.youtube.com/watch?v=orAZCyhj8R8')]),
]

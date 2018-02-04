# Nodepop

- [Inicalizando los datos de la aplicación] (#Inicalizando-los-datos-de-la-aplicación)
- [Arrancando la aplicación](#Arrancando-la-aplicación)
- [Valores configurables de la aplicación](#Valores-configurables-de-la-aplicación)
- [API](#API)

## Inicalizando los datos de la aplicación 
* __Carga de las bases de datos:__

	Para cargas los datos en bd *mongodb* o simplemente reinicializarlos, hay que ejecutar el archivo *install_db.js*. Para ello ejecutaremos el comando:
	
			npm run installDB
	
	La estructura de los datos es la siguiente:
	
	__Para usuarios:__
		
	El archivo es: *./data/Usuarios.json*
	
	Contiene la siguiente estructura:
		
	```json
	{"usuarios":
		[
			{
				"name":"Ulrick",
				"email":"uchick0@wunderground.com",
				"password":"1234abc"
			},
			{
				"name":"Gracia",
				"email":"gbiasioli1@joomla.org",
				"password":"ggracia"
			},
			[...]
		]
	}
	```
	__Para anuncios:__
	
	El archivo es: *./data/Anuncios.json*
	
	Contiene la siguiente estructura:
	
	```json
	{"anuncios":
		[
		    {
			    "name":"Bicicleta",
			    "sale":false,
			    "price":230.15,
			    "photo":"images/anuncios/bici.jpg",
			    "tags":"lifestyle"
		    },
		    {
			    "name":"iPhone 3GS",
			    "sale":true,
			    "price":50.00,
			    "photo":"images/anuncios/iphone3.jpg",
			    "tags":[ "lifestyle", "mobile"]
		    },
		    [...]
		]
	}
	```
	
## Arrancando la aplicación

Para arrancar la aplicación optamos a dos posibilidades según nuestras necesidades:
	
* __Modo básico o de desarrollo__
	
	Este método no incluye *cluster* y para inicializarlo utilizaremos el comando:
	
			npm run start

* __Modo *Cluster*__
	
	Con este arranque se inicializarán diferentes *clusters* de manera paralela:
	
			npm run cluster
			
## Valores configurables de la aplicación

Existen diferentes valores de la aplicación que se pueden configuar. Estos datos se tienen que determinar en el archivo `.env`. Se debera crear dicho archivo y copiar los datos del archivo y configurarlos.

* __PORT__

	- `PORT`: Número de puerto

* __JWT__

	- `JWT_SECRET`: Cadena que genera el JsonWebToken para la validación del usuario.
	- `JWT_EXPIRES_IN`: Tiempo de expiración del token

* __MONGODB__

	- `MONGODB_DATABASE`: Nombre la base datos a la que realizar una conexión mediante *mongoose*.

## API

### Version 1:
	
El control de errores esta desarrollado en multidioma gracias al módulo *i18n*. Por defecto se devuelven los errores en inglés. Para configurar el idioma se debe enviar la variable *Accept-Language* en la cabecera. Los idiomas disponibles són: inglés (en) y español (es). Esta pensada para ser consumida por plataformas móviles así que todo los métodos tendran una respuesta en formato *json*.
	
* __Registrando y autentificando al usuario__
	

	Para registrar a un usuario se tiene que hacer uso del *endpoint* mediante *POST*: 
			
	"*http://localhost:*[PORT_NUMBER]*/apiv1/usuario*"

	el método deberá recibir los siguientes *inputs*, todos ellos son obligatorios para el registro:
	
	- `name`: deberá ser un *String*.
	- `email`: deberá ser un *email* normalizado.
	- `password`: deberá ser un *String*. 

	como *outputs* el sistema puede devolver dos estructuras, según si el proceso se ha completado con éxito o no:
	
	En caso de que la petición se haya resuelto con éxito:
	
	- `success`: valor booleano que en este caso sera *true*.
	- `token`: *String* que contendra el token para la posterior autentificación para poder consumir la api de los anuncios.
	
	En caso de que haya habido algún tipo de error con el registro del usuario la api devolver la siguiente estructura:
	
	- `success`: valor booleano que en este caso sera *false*.
	- `error`: *String* los detalles del error del mensaje.

	
* __*Logueando* y autentificando al usuario__
	

	Para registrar a un usuario se tiene que hacer uso del *endpoint* mediante *POST*: : 
			
	"*http://localhost:*[PORT_NUMBER]*/apiv1/usuario*"

	el método deberá recibir los siguientes *inputs*, todos ellos son obligatorios para el *logueo*:
	
	- `email`:: deberá ser un *email* normalizado.
	- `password`: deberá ser un *String*. 

	como *outputs* el sistema puede devolver dos estructuras, según si el proceso se ha completado con éxito o no:
	
	En caso de que la petición se haya resuelto con éxito:
	
	- `success`: valor booleano que en este caso sera *true*.
	- `token`: *String* que contendra el token para la posterior autentificación para poder consumir la api de los anuncios.
	
	En caso de que haya habido algún tipo de error con el *logueo* del usuario la api devolver la siguiente estructura:
	
	- `success`: valor booleano que en este caso sera *false*.
	- `error`: *String* los detalles del error del mensaje.

	
		
* __Petición de anuncios__
	

	Para pedir la información de uno o de varios anuncios se tiene que hacer uso del *endpoint*: 
			
	`http://localhost:*[PORT_NUMBER]*/apiv1/anuncios`

	el método deberá recibir los siguientes *inputs*:

	- `name`: deberá ser un *String*. El sistema buscara cualquier producto que empiece con el campo enviado. Este campo es opcional.
	- `sale`: deberá ser un booleano. Es este campo se especifica si se quieren buscar anuncios de compra (*true*) o de venta (*false*). Este campo es opcional.
	- `tag`: Buscar una o varias *keywords* con la que se etiqueta a cada anuncion. Se puede buscar por uno varios tags. El sistema devolvera cualquier anuncio que contenga una de las palabras buscadas.. Este campo es opcional.	
	- `price`: el valor se bebe enviar en formato *String*. Dependiendo de si envias solo un número o dos separados por un guión, se podra buscar por precio justo o a partir de una cantidad y/o hasta otra cantidad. Este campo es opcional.
		*   Para enviar buscar por un valor exacto se deberá enviar un número. Ejemplo:`45`.
		*   Para buscar artículos a partir de un precio habrá que enviarle a la api un valor seguido por un guión: Ejemplo: `60-`.
		*   Para buscar artículos a hasta un precio en concreto se enviara un guión seguido por el valor deseado. Ejemplo: `-1500`.
		*   Para buscar los artículos cuyo precio este en un rango de precios se enviaran las 2 cantidades separadas por un guión. Ejemplo: `100-150`. 
	- `limit`: este valor es útil para la paginación de artículos. Limitar el número de resultados a recibir y es opcional. Deberá ser un número entero.
	- `skip`: este campo complementa a `limit`para la paginación. Su función es saltarse un número determinado de resultados. Es opcional y tendra que ser un número entero.
	
	como *outputs* el sistema puede devolver dos estructuras, según si el proceso se ha completado con éxito o no:
	
	En caso de que la petición se haya resuelto con éxito:
	
	- `success`: valor booleano que en este caso sera *true*.
	- `result`: *Array* de objetos con los resultados de anuncions encontrados según el criterio de la búsqueda. Cada objeto devuelto tiene la siguiente arquitectura:
		* `id`: *String* con valor alfanumérico con el identificador del anuncio.
		* `name`: Nombre del anuncio con formato *String*.
		* `sale`: valor booleano que identifica si es un artículo en venta (*true*) o bien es alguien que buscar comprar un artículo con esas características (*false*).
		* `price`: valor númerico con el precio.
		* `photo`: *String* con la ruta de la foto del producto.
		* `tags`: *Array* de *Strings* con las palabras clave del anuncio.
	
	En caso de que haya habido algún tipo de error con el *logueo* del usuario la api devolver la siguiente estructura:
	
	* *success*: valor booleano que en este caso sera *false*.
	* *error*: *String* los detalles del error del mensaje.



 ## Práctica devOps
 
 A continuación se presentan los diferentes enlaces para la evaluación de la práctica:
 
 [Acceso a la web estática mediante dominio](http://juanfoncuberta.com)
 
  [Acceso a la web estática mediante ip](http://18.217.128.196)
  
  [Acceso a la app de nodepop mediante subdominio](http://api.juanfoncuberta.com)
  
  [Acceso al elemento estático de la app para comprobar que es cargado por nginx](http://api.juanfoncuberta.com/images/anuncios/bici.jpg)
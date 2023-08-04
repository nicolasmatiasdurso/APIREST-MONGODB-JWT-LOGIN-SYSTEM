En este repositorio de codigo, se puede ver la implementación de una API REST alimentada por la base de datos de MONGODB utilizando MONGOOSE, que posee un sistema de usuarios recibido mediante solicitudes fetch enviadas desde el front y captadas por express mediante las rutas asignadas, ya sea para registrar o loguear un usuario, cuando se quiere registrar un usuario se realizan diversas validaciones y se hashea la contraseña por seguridad. Cuando se intenta ingresar un usuario realiza las mismas validaciones y compara la contraseña con la guardada en la base de datos lo mismo que el email. El codigo se puede implementar para un sistema de usuarios o de consultoría, fué probado con POSTMAN mediante diversas solicitudes para testear que funcione correctamente, esto mismo puede ser aplicado a solicitudes FETCH dentro de un formulario del frontend. 

Cosas que faltan agregar: Mejorar en JWT y la protección de rutas para no poder ser accedidades con una inyección SQL, ni desde el localstorage / cookies.



------------------------------------------------------------------------------------------------------------------------------------



Explicación paso a paso de cada archivo por si alguien quiere aprenderlo:

Users.js:

Vamos a analizar paso a paso qué hace este código:

Definir el esquema de usuario:
Se define un esquema de usuario con dos campos: email y password. El campo email es de tipo String, obligatorio (required: true), se realiza un recorte de espacios en blanco (trim: true), se convierte a minúsculas (lowerCase: true) y debe ser único (unique: true). El campo password también es de tipo String y es obligatorio.

Definir un pre-guardado hook:
Se utiliza el método pre de Mongoose para especificar una función que se ejecutará antes de guardar un documento de usuario en la base de datos. En esta función, se realiza el hash de la contraseña usando la función bcryptjs.hash. El valor de la contraseña se obtiene desde el campo this.password del documento actual y se almacena el hash resultante en el mismo campo. El hash se genera utilizando una sal (salt) generada por bcryptjs.genSalt con un factor de costo de 10.

Definir un método para comparar contraseñas:
Se crea un método comparePassword en el esquema que permite comparar una contraseña candidata (ingresada por un usuario) con la contraseña almacenada en la base de datos. Para esto, se utiliza bcryptjs.compare para verificar si la contraseña candidata coincide con el hash almacenado.

Crear el modelo de usuario:
Se utiliza mongoose.model para crear el modelo de usuario a partir del esquema definido. El modelo se almacena en la variable User.

Exportar el modelo:
El modelo de usuario se exporta para que pueda ser utilizado en otras partes de la aplicación.

-----------------------------------------------------------------------------------------------------------------------------------
Auth.routes.js  :

Este es un archivo auth.route.js que define las rutas relacionadas con la autenticación de usuarios en una aplicación Node.js utilizando Express y Mongoose. Vamos a analizar paso a paso qué hace este archivo:

Importar dependencias:

express: Es el marco de aplicación web de Node.js que se utiliza para crear rutas y manejar solicitudes y respuestas HTTP.
router: Es un objeto Router de Express que se utiliza para definir rutas y sus controladores asociados.
auth.controller.js: Es un archivo que contiene los controladores para las rutas de autenticación.
express-validator: Es una biblioteca utilizada para validar datos en las solicitudes HTTP.
validationResultExpress.js: Es un archivo que contiene un middleware personalizado para manejar los resultados de validación de express-validator.
Definir rutas y controladores:

router.post("/register", ...): Define una ruta POST para el registro de usuarios. Cuando se recibe una solicitud POST en /register, se ejecutan los siguientes middleware en orden:

body("email", ...).isEmail(): Valida que el campo "email" en la solicitud sea un email válido.
body("password", ...).isLength({min:6}): Valida que el campo "password" en la solicitud tenga al menos 6 caracteres de longitud.
validaciontotal: Es un middleware personalizado que maneja los resultados de validación de express-validator. Si hay errores de validación, enviará una respuesta con los errores; de lo contrario, pasará al siguiente middleware.
register: Es el controlador que se ejecutará cuando la validación sea exitosa. En este caso, se refiere al controlador register importado desde auth.controller.js.
router.post("/login", ...): Define una ruta POST para el inicio de sesión de usuarios. Cuando se recibe una solicitud POST en /login, se ejecutan los siguientes middleware en orden:

body("email", ...).isEmail(): Valida que el campo "email" en la solicitud sea un email válido.
body("password", ...).isLength({min:6}): Valida que el campo "password" en la solicitud tenga al menos 6 caracteres de longitud.
validaciontotal: Es un middleware personalizado que maneja los resultados de validación de express-validator. Si hay errores de validación, enviará una respuesta con los errores; de lo contrario, pasará al siguiente middleware.
login: Es el controlador que se ejecutará cuando la validación sea exitosa. En este caso, se refiere al controlador login importado desde auth.controller.js.
Exportar el enrutador:
La definición del enrutador se exporta para que pueda ser utilizado en el archivo principal de la aplicación para registrar estas rutas.

En resumen, este archivo define dos rutas POST (/register y /login) que se utilizan para registrar y autenticar usuarios. Cada ruta tiene middleware para validar el formato del correo electrónico y la contraseña antes de llamar a los controladores register y login, respectivamente. Los controladores manejan la lógica del registro y autenticación de usuarios. Además, se utiliza un middleware personalizado validaciontotal para manejar los resultados de validación de express-validator y enviar respuestas con errores si es necesario.

------------------------------------------------------------------------------------------------------------------------------------
Auth.controller.js:


Este es el archivo auth.controller.js, que contiene los controladores para las rutas de autenticación que se definieron en el archivo auth.route.js. Vamos a analizar paso a paso qué hace este archivo:

Importar dependencias:

User: Se importa el modelo de usuario (User) definido en el archivo user.js. Este modelo se utilizará para interactuar con la base de datos MongoDB y realizar operaciones relacionadas con los usuarios.
jwt: Es la biblioteca para trabajar con JSON Web Tokens (JWT). Se utiliza para generar y verificar tokens de autenticación.
Definir el controlador register:

Este controlador se encarga de registrar un nuevo usuario en la base de datos.
Extrae el correo electrónico (email) y la contraseña (password) desde el cuerpo de la solicitud (req.body).
Crea un nuevo documento de usuario utilizando el modelo User y los datos proporcionados.
Luego, se intenta guardar el usuario en la base de datos utilizando el método save() proporcionado por Mongoose.
Si el registro es exitoso, se devuelve una respuesta JSON con {ok: true} indicando que el registro fue exitoso.
Si ocurre un error, se verifica si el error es debido a que el correo electrónico ya está registrado (código 11000, clave duplicada en MongoDB). En este caso, se devuelve una respuesta con código de estado 400 y un mensaje de error indicando que ya existe el usuario. Si el error no es por un correo electrónico duplicado, se devuelve una respuesta con código de estado 500 y un mensaje de error indicando que hay un error en el servidor.
Definir el controlador login:

Este controlador se encarga del proceso de inicio de sesión de un usuario.
Extrae el correo electrónico (email) y la contraseña (password) desde el cuerpo de la solicitud (req.body).
Utiliza el modelo User y el método findOne de Mongoose para buscar un usuario en la base de datos con el correo electrónico proporcionado.
Si no se encuentra un usuario con el correo electrónico proporcionado, se devuelve una respuesta con código de estado 403 y un mensaje de error indicando que las credenciales no coinciden.
Si se encuentra un usuario, se compara la contraseña proporcionada (password) con la contraseña almacenada en la base de datos utilizando el método comparePassword definido en el modelo User. Si las contraseñas no coinciden, se devuelve una respuesta con código de estado 403 y un mensaje de error indicando que las credenciales no coinciden.
Si las credenciales son válidas, se genera un JSON Web Token (JWT) usando la función jwt.sign con el identificador único del usuario (user.id) y la clave secreta (process.env.JWT_SECRET). Luego, se devuelve una respuesta JSON con el token de autenticación.
Exportar los controladores:
Los controladores login y register se exportan para que puedan ser utilizados en el archivo auth.route.js.

En resumen, este archivo contiene los controladores necesarios para manejar el registro y el inicio de sesión de usuarios. Cuando se realiza una solicitud de registro, el controlador register crea un nuevo usuario en la base de datos. Cuando se realiza una solicitud de inicio de sesión, el controlador login verifica las credenciales del usuario y devuelve un token de autenticación JWT si las credenciales son válidas.





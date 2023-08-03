EXPLICACION USERS.JS PARA QUIEN NO COMPRENDA QUE ES LO QUE SUCEDE EN MI CODIGO:

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




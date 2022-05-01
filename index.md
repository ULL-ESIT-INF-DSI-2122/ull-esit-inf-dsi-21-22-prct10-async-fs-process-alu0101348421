</br>

[![Tests](https://github.com/ULL-ESIT-INF-DSI-2122/ull-esit-inf-dsi-21-22-prct09-filesystem-notes-app-alu0101348421/actions/workflows/test.js.yml/badge.svg)](https://github.com/ULL-ESIT-INF-DSI-2122/ull-esit-inf-dsi-21-22-prct09-filesystem-notes-app-alu0101348421/actions/workflows/test.js.yml)
[![Coverage Status](https://coveralls.io/repos/github/ULL-ESIT-INF-DSI-2122/ull-esit-inf-dsi-21-22-prct10-async-fs-process-alu0101348421/badge.svg?branch=main)](https://coveralls.io/github/ULL-ESIT-INF-DSI-2122/ull-esit-inf-dsi-21-22-prct10-async-fs-process-alu0101348421?branch=main)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ULL-ESIT-INF-DSI-2122_ull-esit-inf-dsi-21-22-prct10-async-fs-process-alu0101348421&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=ULL-ESIT-INF-DSI-2122_ull-esit-inf-dsi-21-22-prct10-async-fs-process-alu0101348421)

# Indice
- [Indice](#indice)
- [Introducción](#introducción)
- [Ejercicios](#ejercicios)
  - [Ejercicio 01](#ejercicio-01)
  - [Ejercicio 02](#ejercicio-02)
    - [Mediante tuberías](#mediante-tuberías)
    - [Mediante subprocesos](#mediante-subprocesos)
    - [Manejo de la línea de comandos](#manejo-de-la-línea-de-comandos)
  - [Ejercicio 03](#ejercicio-03)
    - [Modificación 1](#modificación-1)
    - [Modificación 2](#modificación-2)
  - [Ejercicio 04](#ejercicio-04)
    - [isFile](#isfile)
    - [isDir](#isdir)
    - [mkdir](#mkdir)
    - [ls](#ls)
    - [readFile](#readfile)
    - [rm](#rm)
    - [move](#move)
    - [Yargs](#yargs)
- [Conclusión](#conclusión)

# Introducción
A lo largo de esta práctica, nos centraremos en el uso de callbacks y funciones asíncronas. Para ello, haremos uso de las funciones de `fs` y `spawn`. Las funciones de callback son una forma de trabajar con funciones asíncronas.
# Ejercicios
## Ejercicio 01
En este ejercicio se nos propone un código de observación de archivos al que vamos a realizar una traza de ejecución.


## Ejercicio 02
En este ejercicio se nos pide un código que nos permita contar el número de veces que se repite una palabra en un archivo.
Para ello se nos pide hacerlo de dos formas:
### Mediante tuberías
  Esta función hará uso de `cat`, `grep` y una tubería que nos permitirá enlazar el stream de salida de `cat` con el de entrada de `grep` para poder realizar el conteo.
```typescript
export function searchPipe(file: string, word: string, callback:
    (err: NodeJS.ErrnoException | null, count: number) => void) {
  access(file, constants.F_OK, (err) => {
    if (err) {
      callback(err, 0);
    }
    const catStream = spawn('cat', [file]);
    const grepStream = spawn('grep', ['-o', word]);
    catStream.stdout.pipe(grepStream.stdin);
    grepStream.stdout.on('data', (data) => {
      const count = data.toString().split('\n').length - 1;
      callback(null, count);
    });
  });
}
```
### Mediante subprocesos
  Esta función hará uso de un subproceso que ejecutará grep sobre el nombre del archivo.
```typescript
export function searchSubprocess(file: string, word: string, callback:
    (err: NodeJS.ErrnoException | null, count: number) => void) {
  access(file, constants.F_OK, (err) => {
    if (err) {
      callback(err, 0);
    }
    const grepStream = spawn('grep', ['-o', word, file]);
    grepStream.stdout.on('data', (data) => {
      const count = data.toString().split('\n').length - 1;
      callback(null, count);
    });
  });
}
```
### Manejo de la línea de comandos
  Estas funciones se ejecutarán mediante la línea de comandos que será manejada mediante el módulo `yargs`.

```typescript
yargs
    .command({
      command: 'search',
      describe: 'Search the number of words repeated in a file',
      builder: {
        file: {
          describe: 'File to search',
          demandOption: true,
          type: 'string',
        },
        word: {
          describe: 'Word to search',
          demandOption: true,
          type: 'string',
        },
        method: {
          describe: 'Method to search',
          demandOption: true,
          type: 'string',
          choices: ['pipe', 'subprocess'],
        },
      },
      handler: (argv) => {
        const {file, word, method} = argv;
        if (method === 'pipe') {
          searchPipe(file as string, word as string, (err, count) => {
            if (err) {
              console.error(err);
            } else {
              console.log(`The word '${word}' appears ${count} times`);
            }
          });
        }
        if (method === 'subprocess') {
          searchSubprocess(file as string, word as string, (err, count) => {
            if (err) {
              console.error(err);
            } else {
              console.log(`The word '${word}' appears ${count} times`);
            }
          });
        }
      },
    })
    .help();

yargs.parse();
```
## Ejercicio 03
En este ejercicio se nos pide hacer uso del código de la práctica anterior para ejecutar un programa que observe el estado de un directorio notificando cuando una nota se añade, elimina, o modifica comprobando el usuario creador de la propia nota.

Para ello, en primer lugar, vamos a crear una función auxiliar que devuelva el nombre del usuario que creó la nota.
```typescript
export function getUser(file: string, callback: (err: Error | null,
  user: string | null) => void) {
  fs.readFile(file, (err, data) => {
    if (err) {
      callback(err, null);
    } else {
      const json = JSON.parse(data.toString());
      callback(null, json.user);
    }
  });
}
```

Luego, vamos a crear una función que se encargará de observar el directorio y notificar cuando se añade, elimina o modifica una nota.
```typescript
export function watch(dir: string, user: string,
    callback: (err: Error | null) => void) {
  fs.watch(dir, (event, filename) => {
    if (event === 'change') {
      getUser(`${dir}/${filename}`, (fileErr, fileUser) => {
        if (fileErr) {
          callback(fileErr);
        } else if (fileUser === user) {
          console.log(`${filename} has been changed by ${fileUser}`);
        }
      });
    } else {
      fs.stat(`${dir}/${filename}`, (statErr, stat) => {
        if (statErr) {
          console.log(`${filename} has been removed`);
        } else if (stat.isFile()) {
          getUser(`${dir}/${filename}`, (fileErr, fileUser) => {
            if (fileErr) {
              callback(fileErr);
            } else if (fileUser === user) {
              console.log(`${filename} has been created by ${fileUser}`);
            }
          });
        }
      });
    }
  });
}
```

Ahora, vamos a manejar la línea de comandos mediante yargs.
```typescript
yargs
    .command({
      command: 'watch',
      describe: 'Watch for changes in a directory',
      builder: {
        user: {
          describe: 'User of notes',
          demand: true,
          type: 'string',
          alias: 'u',
        },
        path: {
          describe: 'Path of notes',
          demand: true,
          type: 'string',
          alias: 'p',
        },
      },
      handler: (argv) => {
        console.log('Hola');
        watch(argv.path as string, argv.user as string, (err) => {
          if (err) {
            console.log(err);
          }
        });
      },
    })
    .help();
```

Por último, hay un par de modificaciones que se nos proponen.
### Modificación 1
En primer lugar, se nos pide como mostrar, además del nombre, el contenido del fichero.

Para ello, nos valdría con ejecutar un subproceso que ejecute el comando cat sobre el nombre del fichero.
```typescript
(...)
{
  console.log(`${filename} has been changed by ${fileUser}`);
  const catStream = spawn('cat', [filename]);
  catStream.stdout.on('data', (data) => {
    console.log(data.toString());
  });
}
(...)
```
### Modificación 2
Otra modificación que se nos pide es que el programa sea capaz de observar todos los directorios correspondientes a los diferentes usuarios de la aplicación.

En este caso, tendríamos que leer el directorio que se nos pasen para comprobar todos los subdirectorios, y luego, podríamos ejecutar el código que teníamos anteriormente sobre cada uno de los directorios, eliminando las líneas que comprueban que el usuario es el mismo que el que se pasa por parámetro a la función.

## Ejercicio 04
Para este ejercicio, tendremos una clase `Wrapper` singleton que ejecutará un conjunto de comandos que suelen ejecutarse por consola, en typescript.

Luego, esta clase se ejecutará mediante la línea de comandos mediante `yargs`.

```typescript
export class Wrapper {
  private static instance: Wrapper;
  private constructor() {}
  public static getInstance(): Wrapper {
    if (!Wrapper.instance) {
      Wrapper.instance = new Wrapper();
    }
    return Wrapper.instance;
  }

  (...)
}
```

### isFile
En este método, se nos pide comprobar si una ruta es un fichero o no. Para ello, 
el primer paso es comprobar si la ruta existe o no, y si no, devolvemos un falso.
```typescript
  isFile(path: string, callback: (err: NodeJS.ErrnoException | null,
    isFile: boolean) => void): void {
    fs.access(path, fs.constants.F_OK, (err) => {
      if (err) {
        callback(null, false);
      } else {
        fs.stat(path, (statErr, stats) => {
          if (statErr) {
            callback(statErr, false);
          }
          callback(null, stats.isFile());
        });
      }
    });
  }
```
### isDir
En este método, se nos pide comprobar si una ruta es un directorio o no. Para ello, deberemos comprobar si la ruta es accesible, y si es así, comprobar si es un directorio.
```typescript
  isDir(path: string, callback: (err: NodeJS.ErrnoException | null,
    isDirectory: boolean) => void): void {
    fs.access(path, fs.constants.F_OK, (err) => {
      if (err) {
        callback(null, false);
      } else {
        fs.stat(path, (statErr, stats) => {
          if (statErr) {
            callback(statErr, false);
          }
          callback(null, stats.isDirectory());
        });
      }
    });
  }
```
### mkdir
En este método, se nos pide crear un directorio, para ello, lo crearemos con el método mkdir de fs.
```typescript
  mkdir(path: string, callback: (err: NodeJS.ErrnoException | null) => void) {
    fs.access(path, fs.constants.F_OK, (err) => {
      if (err?.code === 'ENOENT') {
        fs.mkdir(path, (mkDirErr) => {
          callback(mkDirErr);
        });
      } else {
        callback(null);
      }
    });
  }
```
### ls
En este método, se nos pide listar los ficheros de un directorio. Si la ruta no existe, se devolverá un error.
```typescript
  ls(path: string, callback: (err: NodeJS.ErrnoException | null,
      files: string[]) => void) {
    fs.access(path, fs.constants.F_OK, (err) => {
      if (err) {
        callback(err, []);
      } else {
        fs.readdir(path, (readDirErr, files) => {
          if (readDirErr) {
            callback(readDirErr, []);
          } else {
            callback(null, files);
          }
        });
      }
    });
  }
```
### readFile
Para este método, se nos pide leer un fichero y devolver su contenido.
```typescript
  readFile(path: string, callback: (err: NodeJS.ErrnoException | null,
      data: string) => void) {
    fs.access(path, fs.constants.F_OK, (err) => {
      if (err) {
        callback(err, '');
      } else {
        fs.readFile(path, 'utf8', (readFileErr, data) => {
          if (readFileErr) {
            callback(readFileErr, '');
          }
          callback(null, data);
        });
      }
    });
  }
```
### rm
Este método tiene más complicaciones que los anteriores, porque necesitamos comprobar si la ruta es un directorio o no para poder ejecutar `fs.unlink` o `fs.rmdir` en función de eso.
```typescript
rm(path: string, callback: (err: NodeJS.ErrnoException | null) => void) {
    fs.access(path, fs.constants.F_OK, (err) => {
      if (err?.code === 'ENOENT') {
        callback(new Error('File not found'));
      } else if (err) {
        callback(err);
      } else if (fs.statSync(path).isFile()) {
        fs.unlink(path, (unlErr) => {
          if (unlErr) {
            callback(unlErr);
          } else {
            callback(null);
          }
        });
      } else {
        fs.rmdir(path, (rmErr) => {
          if (rmErr) {
            callback(rmErr);
          }
          callback(null);
        });
      }
    });
  }
```
### move
Por último, se nos pide mover un fichero o directorio de una ruta a otra.
```typescript
  move(src: string, dest: string, callback: (err: NodeJS.ErrnoException | null)
        => void) {
      fs.access(src, fs.constants.F_OK, (err) => {
        if (err?.code === 'ENOENT') {
          callback(new Error('File not found'));
        } else if (err) {
          callback(err);
        } else {
          fs.access(dest, fs.constants.F_OK, (accessErr) => {
            if (accessErr?.code === 'ENOENT') {
              fs.rename(src, dest, (renameErr) => {
                if (renameErr) {
                  callback(renameErr);
                } else {
                  callback(null);
                }
              });
            } else {
              callback(new Error('File already exists'));
            }
          });
        }
      });
    }
```

### Yargs
Con estos métodos, ya podemos crear una aplicación que nos permita crear, leer, mover y borrar ficheros. Para ello, solo nos faltará manejar la lógica de la línea de comandos. Teniendo en cuenta la longitud y la repetición del código, en este informe solo se mostrará el código de uno de los métodos.
```typescript
yargs
    .command({
      command: 'isFile',
      describe: 'Check if is a file',
      builder: {
        path: {
          describe: 'Path to check',
          demandOption: true,
          type: 'string',
        },
      },
      handler: (argv) => {
        const {path} = argv;
        Wrapper.getInstance().isFile(path as string, (err, isFile) => {
          if (err) {
            console.log(err);
          } else {
            console.log(isFile);
          }
        });
      },
    })
```

# Conclusión
En esta práctica se ha mostrado como hacer uso de las funciones asíncronas de Node.js para realizar aplicaciones que nos permitan trabajar con ficheros, directorios y subprocesos.
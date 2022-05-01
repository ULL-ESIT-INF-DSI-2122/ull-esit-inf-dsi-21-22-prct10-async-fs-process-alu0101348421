import * as fs from 'fs';
import yargs from 'yargs';

// Clase Wrapper ejercicio 4
export class Wrapper {
  private static instance: Wrapper;
  private constructor() {}
  public static getInstance(): Wrapper {
    if (!Wrapper.instance) {
      Wrapper.instance = new Wrapper();
    }
    return Wrapper.instance;
  }

  isFile(path: string, callback: (err: NodeJS.ErrnoException | null,
    isFile: boolean) => void): void {
    fs.access(path, fs.constants.F_OK, (err) => {
      if (err) {
        callback(null, false);
      } else {
        fs.stat(path, (err, stats) => {
          if (err) {
            callback(err, false);
          }
          callback(null, stats.isFile());
        });
      }
    });
  }

  isDir(path: string, callback: (err: NodeJS.ErrnoException | null,
    isDirectory: boolean) => void): void {
    fs.access(path, fs.constants.F_OK, (err) => {
      if (err) {
        callback(null, false);
      } else {
        fs.stat(path, (err, stats) => {
          if (err) {
            callback(err, false);
          }
          callback(null, stats.isDirectory());
        });
      }
    });
  }

  mkdir(path: string, callback: (err: NodeJS.ErrnoException | null) => void) {
    fs.access(path, fs.constants.F_OK, (err) => {
      if (err?.code === 'ENOENT') {
        fs.mkdir(path, (err) => {
          callback(err);
        });
      } else {
        callback(null);
      }
    });
  }

  ls(path: string, callback: (err: NodeJS.ErrnoException | null,
      files: string[]) => void) {
    fs.access(path, fs.constants.F_OK, (err) => {
      if (err) {
        callback(err, []);
      } else {
        fs.readdir(path, (err, files) => {
          if (err) {
            callback(err, []);
          } else {
            callback(null, files);
          }
        });
      }
    });
  }

  readFile(path: string, callback: (err: NodeJS.ErrnoException | null,
      data: string) => void) {
    fs.access(path, fs.constants.F_OK, (err) => {
      if (err) {
        callback(err, '');
      } else {
        fs.readFile(path, 'utf8', (err, data) => {
          if (err) {
            callback(err, '');
          }
          callback(null, data);
        });
      }
    });
  }

  rm(path: string, callback: (err: NodeJS.ErrnoException | null) => void) {
    fs.access(path, fs.constants.F_OK, (err) => {
      if (err?.code === 'ENOENT') {
        callback(new Error('File not found'));
      } else if (err) {
        callback(err);
      } else if (fs.statSync(path).isFile()) {
        fs.unlink(path, (err) => {
          if (err) {
            callback(err);
          } else {
            callback(null);
          }
        });
      } else {
        fs.rmdir(path, (err) => {
          if (err) {
            callback(err);
          }
          callback(null);
        });
      }
    });
  }

  move(src: string, dest: string, callback: (err: NodeJS.ErrnoException | null)
      => void) {
    fs.access(src, fs.constants.F_OK, (err) => {
      if (err?.code === 'ENOENT') {
        callback(new Error('File not found'));
      } else if (err) {
        callback(err);
      } else {
        fs.access(dest, fs.constants.F_OK, (err) => {
          if (err?.code === 'ENOENT') {
            fs.rename(src, dest, (err) => {
              if (err) {
                callback(err);
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
}

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
    .command({
      command: 'isDir',
      describe: 'Check if is a directory',
      builder: {
        path: {
          describe: 'Path to check',
          demandOption: true,
          type: 'string',
        },
      },
      handler: (argv) => {
        const {path} = argv;
        Wrapper.getInstance().isDir(path as string,
            (err, isDirectory) => {
              if (err) {
                console.log(err);
              } else {
                console.log(isDirectory);
              }
            });
      },
    })
    .command({
      command: 'mkdir',
      describe: 'Create a directory',
      builder: {
        path: {
          describe: 'Path to create',
          demandOption: true,
          type: 'string',
        },
      },
      handler: (argv) => {
        const {path} = argv;
        Wrapper.getInstance().mkdir(path as string, (err) => {
          if (err) {
            console.log(err);
          }
        });
      },
    })
    .command({
      command: 'ls',
      describe: 'List files in a directory',
      builder: {
        path: {
          describe: 'Path to list',
          demandOption: true,
          type: 'string',
        },
      },
      handler: (argv) => {
        const {path} = argv;
        Wrapper.getInstance().ls(path as string, (err, files) => {
          if (err) {
            console.log(err);
          } else {
            for (const file of files) {
              console.log(file);
            }
          }
        });
      },
    })
    .command({
      command: 'readFile',
      describe: 'Read a file',
      builder: {
        path: {
          describe: 'Path to read',
          demandOption: true,
          type: 'string',
        },
      },
      handler: (argv) => {
        const {path} = argv;
        Wrapper.getInstance().readFile(path as string, (err, data) => {
          if (err) {
            console.log(err);
          } else {
            console.log(data);
          }
        });
      },
    })
    .command({
      command: 'rm',
      describe: 'Remove a file or directory',
      builder: {
        path: {
          describe: 'Path to remove',
          demandOption: true,
          type: 'string',
        },
      },
      handler: (argv) => {
        const {path} = argv;
        Wrapper.getInstance().rm(path as string, (err) => {
          if (err) {
            console.log(err);
          }
        });
      },
    })
    .command({
      command: 'move',
      describe: 'Move a file or directory',
      builder: {
        src: {
          describe: 'Path to move',
          demandOption: true,
          type: 'string',
        },
        dest: {
          describe: 'Destination path',
          demandOption: true,
          type: 'string',
        },
      },
      handler: (argv) => {
        const {src, dest} = argv;
        Wrapper.getInstance().move(src as string, dest as string, (err) => {
          if (err) {
            console.log(err);
          }
        });
      },
    })
    .help();

yargs.parse();
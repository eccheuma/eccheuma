import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

export namespace environment {

  type env = {[ i: string ]: string } 

  export function config(keys: Array<string>): env {
  
    const env: env = Object();

    keys.forEach(key => {
      env[key] = process.env[key] as string;
    })
  
    return env;
  
  }
}

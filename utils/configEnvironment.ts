export namespace environment {

  type env = {[ i: string ]: string } 

  export function config(keys: Array<string>): env {
  
    const env: env = Object();
  
    for ( let K in keys ) {
      env[K] = process.env[K] as string;
    }
  
    return env;
  
  }
}

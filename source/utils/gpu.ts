export namespace gpu {

  let renderContext : WebGL2RenderingContext | null;
  let gpuStatus     : boolean | undefined = undefined;

  function setContext() {
    renderContext = document?.createElement('canvas').getContext('webgl2');
  }

  export function available(): boolean {

    if ( process.server === undefined || process.server ) return false;

    if ( !renderContext ) setContext();

    if ( gpuStatus === undefined ) gpuStatus = Boolean(renderContext);

    return gpuStatus

  }

}
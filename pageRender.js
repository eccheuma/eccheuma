const NODE_FS   = require('fs');
const NODE_PATH = require('path');

// const polka         = require('polka')
const { loadNuxt }  = require('nuxt')

const ROOT = NODE_PATH.join(__dirname);

async function start() {

  console.time('INIT')

  // const app   = polka();
  const nuxt  = await loadNuxt('start');

  const { html, error } = await nuxt.renderRoute('/home');

  NODE_FS.writeFile(`${ ROOT }/response.html`, html, () => {
    console.log(error || 'Done!'); console.timeEnd('INIT');
  })

}

start();

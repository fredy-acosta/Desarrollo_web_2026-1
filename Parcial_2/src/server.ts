import { App } from './config/index';

async function main() {
   const app = new App();
   await app.listen();
}

main().catch(error => {
   console.error('Error iniciando servidor:', error);
   process.exit(1);
});

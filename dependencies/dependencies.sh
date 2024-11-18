#Utilize esse arquivo para instalar as dependências de desenvolvimento
#
#Criado por João Denadai
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
nvm install 21
npm install electron --save-dev
npm install electron-builder --save-dev
npm install electron-store
npm install electron-logs
npm install electron-updater

FROM node:16
ENV NODE_ENV=production-docker

COPY . .

RUN npm ci --only=production
RUN npm run nuxt::build

CMD ["npm" ,"run", "nuxt::start"]
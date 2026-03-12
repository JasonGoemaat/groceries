FROM node:lts-alpine AS build
WORKDIR /app
COPY ./package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM adrianmusante/pocketbase:latest AS pocketbase
COPY --from=build /app/dist/groceries/browser /pocketbase/public
COPY --from=build /app/pocketbase/migrations /pocketbase/migrations
COPY --from=build /app/pocketbase/hooks /pocketbase/hooks
COPY --from=build --chmod=755 /app/pocketbase/scripts /pocketbase/scripts
# COPY --from=build /app/pocketbase/scripts /pocketbase/scripts
# RUN chmod +x /pocketbase/scripts/*

# These are included in adrianmusante/pocketbase and don't need to be here
# but are for my reference.
#
# EXPOSE 8090
# ENTRYPOINT ["/opt/pocketbase/scripts/entrypoint.sh"]

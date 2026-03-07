# Docker

My app will just be a web client and pocketbase server, I think I can run
that all in one container.   Pocketbase will serve files directly from
a pb_public (I think) folder where the executable resides.

## Build Tips

I should be able to use one of the existing pocketbase docker images.   Using
a multi-stage build I should be able to build the UI and copy the output
along with the pocketbase image contents.
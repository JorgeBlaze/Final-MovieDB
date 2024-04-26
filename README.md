# Final-MovieDB
Movie database project

So, i got the fastapi running with squlite; it can create, read, and delete movie entries. i wasn't able to get the update button to work. the drag and drop function partially works; if you drag in an mp4 file, it will take the name and file location from that file and create a new movie entity. it also adds a release year and running time estimate, but these aren't accurate (moved on before i found a fix)
i tried to get a search function working, and it does send get requests to the api, but it's expecting a int instead of a string for some reason--moved on again since this was taking too much time
I then tried to containorzie/condense the project into one single clickable file; i tried using docker, which partially worked - it builds, but doesn't run (ran out of time to fix)

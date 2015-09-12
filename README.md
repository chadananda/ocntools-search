# ocean-folder
Quick folder full-text search using browser local storage to index contents of a single folder
 
I manage hundreds of HTML books in local folders in public DropBox folders. I want a way to search the contents of these books from an index file. Here's what I have in mind:

1. A basic node script to build a JSON file list from all the HTML files found in a directory (and subdirectories).
   * Script also creates a basic index.html if one is not already present. 
   * That index.html will consume the JSON data with a simple angular app.
2. An angular index.html file that formats the JSON file as a navigation list
3. Angular/Jquery to load/update contents of html files into PouchDB database
4. Lunr.js to provide instant full-text search of file content.

This will all be packaged into a single global Node.js module so that I can use it in any public Dropbox folder to create a web-based searchable index file with no server dependencies.

<img src="http://content.screencast.com/users/chadananda/folders/Jing/media/c7227436-adcd-4cb5-a761-a17c9676bc9d/00001301.png" />

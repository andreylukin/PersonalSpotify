# PersonalSpotify
This is a personal project of mine, with which I will try to enhance my Spotify experience. 

What I am interested to do with this project is to graph the artists/songs/genres I listen to over time and see if I have any types of listening cycles that I always thought I do have.

I also thought it would be an interesting feature to be notified when something I usually dont notice happen with my listening, maybe me listening to a really unpopular artist.


One thing that I cared about a lot is to keep track of the genres I am listening to. After some checks, Spotify almost never has any genres available for albums and doesn't always have genres available for artists, so I will union that data with wikipedia data to try to find possible genres.


I will keep everything on Firebase since it will be the least hassle to keep track of.

Currently, what I have  working is I am saving data on the songs I am listening to on Firebase. Spotify's API doesn't have a good listener to let me know when I've listened to a new song, so my DigitalOcean Droplet has a cron job that pull the API every minute.


Currently, this is the data I am saving on Firebase:

- albumInfo
  - album_type
  - name
  - release_date
  - total_tracks
- artistInfo
  - followers
  - genres
  - name
  - popularity
- trackAnalysisInfo
  - danceability
  - duration_ms
  - energy
  - instrumentalness
  - key
  - liveness
  - mode
  - speechiness
  - tempo
  - valence
- trackInfo
  - name
  - played_at
  - popularity
  - uri

Since I am taking some ML and AI classes next semester, I will try  to encorporate data analytics stuff into it as well.

Now, this will run for a while until I run anything on it!
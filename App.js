import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, ImageBackground } from 'react-native';
import axios from 'axios';


const backgroundImage = require('./assets/series_8_the.jpg');

export default function App() {
  const [episodes, setEpisodes] = useState([]);
  const [expandedSeasons, setExpandedSeasons] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        const response = await axios.get('https://api.tvmaze.com/shows/83/episodes');
        setEpisodes(response.data);
      } catch (error) {
        console.error('Erro ao buscar episódios:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEpisodes();
  }, []);

  const groupedEpisodes = episodes.reduce((acc, episode) => {
    if (!acc[episode.season]) {
      acc[episode.season] = [];
    }
    acc[episode.season].push(episode);
    return acc;
  }, {});

  const toggleSeason = (season) => {
    setExpandedSeasons((prev) => ({
      ...prev,
      [season]: !prev[season],
    }));
  };

  if (loading) {
    return (
      <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <FlatList
        data={Object.keys(groupedEpisodes)}
        keyExtractor={(item) => item.toString()}
        renderItem={({ item: season }) => (
          <View style={styles.seasonContainer}>
            <TouchableOpacity onPress={() => toggleSeason(season)}>
              <Text style={styles.seasonTitle}>Temporada {season}</Text>
            </TouchableOpacity>
            {expandedSeasons[season] && (
              <FlatList
                data={groupedEpisodes[season]}
                keyExtractor={(episode) => episode.id.toString()}
                renderItem={({ item: episode }) => (
                  <View style={styles.episode}>
                    <Text style={styles.episodeTitle}>Episódio {episode.number}: {episode.name}</Text>
                    <Text>{episode.airdate}</Text>
                  </View>
                )}
              />
            )}
          </View>
        )}
        contentContainerStyle={styles.contentContainer}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', 

  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#fff',
  },
  seasonContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
  },
  seasonTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  episode: {
    marginLeft: 10,
    marginBottom: 5,
  },
  episodeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  contentContainer: {
    paddingBottom: 20,
  },
});
